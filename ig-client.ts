import { IgApiClient, PostingPhotoOptions } from "instagram-private-api";
import fetch from "node-fetch";
import sharp from "sharp";

const IG_Portrait_Aspect_Ratio = 5 / 4; // 4:5

async function createIgPhoto(filename: string) {
  const img = sharp(await sharp(filename).rotate().toBuffer());
  const { width, height } = await img.metadata();
  if (width && height && width < height) {
    return await img
      .resize(width, Math.floor(width * IG_Portrait_Aspect_Ratio))
      .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
      .toBuffer();
  } else {
    return await img.jpeg({ quality: 95, chromaSubsampling: "4:4:4" }).toBuffer();
  }
}

async function createIgClient(debug: boolean) {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME ?? "");

  if (!debug) {
    await ig.simulate.preLoginFlow();
    await ig.account.login(process.env.IG_USERNAME ?? "", process.env.IG_PASSWORD ?? "");
    process.nextTick(async () => await ig.simulate.postLoginFlow());
  }

  return {
    publishPhoto: (options: PostingPhotoOptions) =>
      !debug
        ? ig.publish.photo(options)
        : publishWithFetch(options.file, options.caption ?? "", {
            cookie: process.env.cookie ?? "",
            csrftoken: process.env.csrftoken ?? "",
            claim: process.env.claim ?? "",
          }),
  };
}

async function publishWithFetch(
  photo: Buffer,
  caption: string,
  header: { cookie: string; csrftoken: string; claim: string }
) {
  const upload_id = Date.now();

  const upload = await fetch(`https://www.instagram.com/rupload_igphoto/fb_uploader_${upload_id}`, {
    headers: {
      accept: "*/*",
      "accept-language": "zh-TW,zh;q=0.9,en;q=0.8",
      "content-type": "image/jpeg",
      "content-length": `${photo.byteLength}`,
      origin: "https://www.instagram.com",
      "user-agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
      offset: "0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-csrftoken": `${header.csrftoken}`,
      "x-entity-length": `${photo.byteLength}`,
      "x-entity-name": `fb_uploader_${upload_id}`,
      "x-entity-type": "image/jpeg",
      "x-ig-app-id": "1217981644879628",
      "x-ig-www-claim": `${header.claim}`,
      "x-instagram-ajax": "a1de4804d095",
      "x-instagram-rupload-params": `{"media_type":1,"upload_id":"${upload_id}","upload_media_height":1080,"upload_media_width":1080}`,
      "x-requested-with": "XMLHttpRequest",
      cookie: header.cookie,
    },
    method: "POST",
    body: photo,
  });

  const res = await (upload.json() as Promise<any>);
  console.log(res);

  if ("upload_id" in res) {
    await fetch("https://www.instagram.com/create/configure/", {
      headers: {
        accept: "*/*",
        "accept-language": "zh-TW,zh;q=0.9,en;q=0.8",
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrftoken": `${header.csrftoken}`,
        "x-ig-app-id": "1217981644879628",
        "x-ig-www-claim": `${header.claim}`,
        "x-instagram-ajax": "a1de4804d095",
        "x-requested-with": "XMLHttpRequest",
        origin: "https://www.instagram.com",
        "user-agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
        cookie: header.cookie,
      },
      method: "POST",
      body: `upload_id=${upload_id}&caption=${caption}&usertags=&custom_accessibility_caption=&retry_timeout=`,
    });
  }
}

export { createIgPhoto, createIgClient };
