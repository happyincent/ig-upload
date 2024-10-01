import dayjs from "dayjs";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { createIgClient, createIgPhoto } from "./ig-client";
import { reverse } from "./nominatim";
import ExifReader from "exifreader";
import customParseFormat from "dayjs/plugin/customParseFormat";

const DEBUG = false;
const DELAY = 1000 * 1;
const FOLDER = path.resolve("./img/");
const FOLDER_ED = path.join(FOLDER, "ed");
fs.existsSync(FOLDER_ED) || fs.mkdirSync(FOLDER_ED, { recursive: true });
dotenv.config();
dayjs.extend(customParseFormat);

(async () => {
  try {
    const igClient = await createIgClient(DEBUG);

    const files = fs
      .readdirSync(FOLDER, { withFileTypes: true })
      .filter((file) => file.isFile())
      .map((file) => path.join(file.parentPath, file.name));

    const filesInfo = (
      await Promise.all(
        files.map((file) =>
          ExifReader.load(file, { expanded: true }).then((tags) => ({
            file,
            DateTime: tags.exif?.DateTimeOriginal?.description
              ? dayjs(tags.exif.DateTimeOriginal.description, "YYYY:MM:DD HH:mm:ss").toDate()
              : fs.statSync(file).mtime,
            Latitude: tags.gps?.Latitude,
            Longitude: tags.gps?.Longitude,
            Model: tags.exif?.Model?.description.replaceAll(" ", "").replaceAll("-", ""),
          }))
        )
      )
    ).sort((a, b) => dayjs(a.DateTime).diff(dayjs(b.DateTime)));

    for (const [index, info] of Object.entries(filesInfo)) {
      await new Promise((r) => setTimeout(r, DELAY));

      let caption: string = "";
      if (info.DateTime) caption += `#${dayjs(info.DateTime).format("YYYYMMDD")}`;
      if (info.Latitude && info.Longitude) {
        const res = await reverse({ lat: info.Latitude, lon: info.Longitude, language: "en" });
        const { town, suburb, city, state_district, county, state, country } = res.address;
        const place = [town, suburb, city, state_district, county, state, country]
          .find((val) => Boolean(val))
          ?.replace("New ", "New")
          ?.replaceAll("'", "")
          ?.split(" ")[0];
        if (place)
          if (["North", "South", "East", "West"].includes(place) && city) caption += ` #${place}${city}`;
          else caption += ` #${place}`;
      }
      if (info.Model) caption += ` #${info.Model}`;

      await igClient.publishPhoto(await createIgPhoto(info.file), { caption });
      fs.renameSync(info.file, path.join(FOLDER_ED, path.basename(info.file)));
      console.log(`${path.basename(info.file)} "${caption}" (${parseInt(index) + 1}/${filesInfo.length})`);
    }

    console.log("Finished.");
  } catch (err) {
    console.log(err);
  }
})();
