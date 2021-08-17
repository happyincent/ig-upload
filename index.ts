import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import exifr from "exifr";
import sharp from "sharp";
import dotenv from "dotenv";
dotenv.config();
const aspect = require("aspectratio");

import NodeGeocoder from "node-geocoder";
import { IgApiClient } from "instagram-private-api";
import { publishWithFetch } from "./fakeig";

const DEBUG = false;
const DELAY_SEC = 1;
const IG_Portrait_Aspect_Ratio = "4:5";
const EXTENSION = ".jpg";
const FOLDER = path.resolve("./img/");
const FOLDER_ED = path.join(FOLDER, "ed");
fs.existsSync(FOLDER_ED) || fs.mkdirSync(FOLDER_ED, { recursive: true });

const geocoder = NodeGeocoder({ provider: "openstreetmap", language: "en" });
const ig = new IgApiClient();
ig.state.generateDevice(process.env.IG_USERNAME ?? "");

async function login() {
  await ig.simulate.preLoginFlow();
  await ig.account.login(process.env.IG_USERNAME ?? "", process.env.IG_PASSWORD ?? "");
  process.nextTick(async () => await ig.simulate.postLoginFlow());
}

(async () => {
  try {
    const files = fs
      .readdirSync(FOLDER)
      .filter((file) => path.extname(file).toLowerCase() === EXTENSION)
      .map((file) => path.join(FOLDER, file));

    let filesInfo = await Promise.all(
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
    );

    filesInfo.sort(
      (prev, next) => new Date(prev.DateTimeOriginal ?? 0).getTime() - new Date(next.DateTimeOriginal ?? 1).getTime()
    );

    if (!DEBUG) await login();

    for (const [key, info] of Object.entries(filesInfo)) {
      let photo: Buffer = Buffer.alloc(0);
      let caption: string = "";

      if (info.DateTimeOriginal) caption += `#${dayjs(info.DateTimeOriginal).format("YYYYMMDD")}`;
      if (info.latitude && info.longitude) {
        const res = await geocoder.reverse({
          lat: info.latitude,
          lon: info.longitude,
        });
        if (res[0]) caption += ` #${(res[0].city ?? res[0].country)?.replace("New Taipei", "NewTaipei")}`;
      }
      if (info.Model) caption += ` (${info.Model})`;

      console.log(`${path.basename(info.file)} "${caption}" (${parseInt(key) + 1}/${filesInfo.length})`);

      const img = sharp(await sharp(info.file).rotate().toBuffer());
      const { width, height } = await img.metadata();
      if (width && height && width < height) {
        const crop = aspect.crop(width, height, IG_Portrait_Aspect_Ratio);
        photo = await img
          .extract({
            left: crop[0] as number,
            top: crop[1] as number,
            width: crop[2] as number,
            height: crop[3] as number,
          })
          .jpeg({ quality: 95 })
          .toBuffer();
      } else {
        photo = await img.jpeg({ quality: 95 }).toBuffer();
      }

      if (!DEBUG) await ig.publish.photo({ file: photo, caption: caption });
      else
        await publishWithFetch(photo, caption, {
          cookie: process.env.cookie ?? "",
          csrftoken: process.env.csrftoken ?? "",
          claim: process.env.claim ?? "",
        });

      fs.renameSync(info.file, path.join(FOLDER_ED, path.basename(info.file)));
      await new Promise((resolve) => setTimeout(resolve, 1000 * DELAY_SEC));
    }

    console.log("Finished.");
  } catch (err) {
    console.log(err);
  }
})();
