import fetch from "node-fetch";

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

  const res = await upload.json();
  console.log(res);

  if ("upload_id" in res) {
    fetch("https://www.instagram.com/create/configure/", {
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

export { publishWithFetch };
