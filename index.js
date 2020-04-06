const fs = require("fs");
const mergeImages = require("merge-images");
const sizeOf = require("image-size");
const { Canvas, Image } = require("canvas");

for (let i = 1; i <= 7; i++) {
  fs.readdir(`images/case${i}`, (err, files) => {
    const [rectoFilename, versoFilename] = files.filter(
      (file) => file !== ".DS_Store" && file.split(".")[0] !== "output"
    );

    const dimensionsRecto = sizeOf(`images/case${i}/${rectoFilename}`);
    const dimensionsVerso = sizeOf(`images/case${i}/${versoFilename}`);

    const recto = {
      filename: rectoFilename,
      height: dimensionsRecto.height,
      width: dimensionsRecto.width,
    };

    const verso = {
      filename: versoFilename,
      height: dimensionsVerso.height,
      width: dimensionsVerso.width,
    };

    const mergeRectoVersoWithFormat = (outputFormat) =>
      mergeRectoVerso(`case${i}`, recto, verso, outputFormat);

    mergeRectoVersoWithFormat("jpeg");
    mergeRectoVersoWithFormat("png");
  });
}

function mergeRectoVerso(folder, recto, verso, outputFormat) {
  mergeImages(
    [
      { src: `images/${folder}/${recto.filename}`, x: 0, y: 0 },
      {
        src: `images/${folder}/${verso.filename}`,
        x: 0,
        y: recto.height + 1,
      },
    ],
    {
      Canvas,
      Image,
      format: `image/${outputFormat}`,
      width: Math.max(recto.width, verso.width),
      height: recto.height + verso.height,
      quality: 0.8,
    }
  )
    .then((base64) => {
      const regex = `^data:image\/${outputFormat};base64,`;
      const base64Data = base64.replace(new RegExp(regex), "");

      fs.writeFile(
        `images/${folder}/output.${outputFormat}`,
        base64Data,
        { encoding: "base64" },
        () => {
          console.log(
            `File written into ./images/${folder}/output.${outputFormat}`
          );
        }
      );
    })
    .catch((err) => {
      console.log(`Err with case ${i} when creating a ${outputFormat} image.`);
      console.log(err);
    });
}
