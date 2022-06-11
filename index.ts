import dayjs from "dayjs";
import dotenv from "dotenv";
import exifr from "exifr";
import fs from "fs";
import path from "path";
import { createIgClient, createIgPhoto } from "./ig-client";
import { reverse } from "./nominatim";

const DEBUG = false;
const DELAY = 1000 * 1;
const FOLDER = path.resolve("./img/");
const FOLDER_ED = path.join(FOLDER, "ed");
fs.existsSync(FOLDER_ED) || fs.mkdirSync(FOLDER_ED, { recursive: true });
dotenv.config();

(async () => {
  try {
    const igClient = await createIgClient(DEBUG);

    const files = fs
      .readdirSync(FOLDER)
      .filter((file) => path.extname(file).toLowerCase() === ".jpg")
      .map((file) => path.join(FOLDER, file));

    let filesInfo = (
      await Promise.all(
        files.map(async (file) => {
          const res = await exifr.parse(file, ["DateTimeOriginal", "Model", "GPSLatitude", "GPSLongitude"]);
          return { ...res, file: file } as {
            file: string;
            DateTimeOriginal?: Date;
            Model?: string;
            latitude?: number;
            longitude?: number;
          };
        })
      )
    ).sort((a, b) => dayjs(a.DateTimeOriginal).diff(dayjs(b.DateTimeOriginal)));

    for (const [index, info] of Object.entries(filesInfo)) {
      await new Promise((r) => setTimeout(r, DELAY));

      let caption: string = "";
      if (info.DateTimeOriginal) caption += `#${dayjs(info.DateTimeOriginal).format("YYYYMMDD")}`;
      if (info.latitude && info.longitude) {
        const res = await reverse({ lat: info.latitude, lon: info.longitude, language: "en" });
        const { town, suburb, city, state_district, county, state, country } = res.address;
        const place = [town, suburb, city, state_district, county, state, country]
          .find((val) => Boolean(val))
          ?.replace("New Taipei", "NewTaipei")
          ?.replace("'", "")
          ?.split(" ")[0];
        if (place) caption += ` #${place}`;
      }
      if (info.Model) caption += ` (${info.Model})`;

      await igClient.publishPhoto({ file: await createIgPhoto(info.file), caption: caption });
      fs.renameSync(info.file, path.join(FOLDER_ED, path.basename(info.file)));
      console.log(`${path.basename(info.file)} "${caption}" (${parseInt(index) + 1}/${filesInfo.length})`);
    }

    console.log("Finished.");
  } catch (err) {
    console.log(err);
  }
})();
