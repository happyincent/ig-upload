# ig-upload

## Introduction
Upload photos with caption e.g., `#20200913 #Taipei (Pixel 3a XL)` to Instagram in one click.

* Take image metadata as Feed Caption ([exifreader](https://github.com/mattiasw/ExifReader))
* Reverse Latitude and Longitude into City name with OpenStreetMap ([Nominatim API](http://nominatim.org/release-docs/latest/api/Reverse/))
* Crop image if `width < height` in a [4:5](https://help.instagram.com/1631821640426723) aspect ratio ([sharp](https://github.com/lovell/sharp))
* Login and upload photos to Instagram Feed ([instagram-private-api](https://github.com/dilame/instagram-private-api))

## Prerequisite
```
npm install
```

## Usage

#### 1. Add .env into `./.env`
```
IG_USERNAME=
IG_PASSWORD=

# Debug Only
cookie=
csrftoken=
claim=
```

#### 2. Put photos into `./img/xxx.jpg`

#### 3. Run and check `./process.log`
```
npm start
```
