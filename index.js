const fs = require("fs");
const mergeImages = require("merge-images");
const sizeOf = require("image-size");
const { Canvas, Image } = require("canvas");

const dimensionsRecto = sizeOf("images/recto.jpg");
const dimensionsVerso = sizeOf("images/verso.jpg");

const outputFormat = "jpeg";

mergeImages(
  [
    { src: "images/recto.jpg", x: 0, y: 0 },
    { src: "images/verso.jpg", x: 0, y: dimensionsRecto.height },
  ],
  {
    Canvas,
    Image,
    format: `image/${outputFormat}`,
    width: Math.max(dimensionsRecto.width, dimensionsVerso.width),
    height: dimensionsRecto.height + dimensionsVerso.height,
    quality: 0.8,
  }
).then((base64) => {
  const regex = `^data:image\/${outputFormat};base64,`;
  const base64Data = base64.replace(new RegExp(regex), "");

  fs.writeFile("images/output.jpg", base64Data, { encoding: "base64" }, () => {
    console.log("File written");
  });
});
