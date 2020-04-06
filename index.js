const fs = require("fs");
const mergeImages = require("merge-images");
const sizeOf = require("image-size");
const { Canvas, Image } = require("canvas");

for (let i = 1; i <= 7; i++) {
  fs.readdir(`images/case${i}`, (err, files) => {
    const [recto, verso] = files.filter(
      (file) => file !== ".DS_Store" && file.split(".")[0] !== "output"
    );

    const dimensionsRecto = sizeOf(`images/case${i}/${recto}`);
    const dimensionsVerso = sizeOf(`images/case${i}/${verso}`);

    const outputFormat = i % 2 === 0 ? "jpeg" : "png";

    mergeImages(
      [
        { src: `images/case${i}/${recto}`, x: 0, y: 0 },
        {
          src: `images/case${i}/${verso}`,
          x: 0,
          y: dimensionsRecto.height + 1,
        },
      ],
      {
        Canvas,
        Image,
        format: `image/${outputFormat}`,
        width: Math.max(dimensionsRecto.width, dimensionsVerso.width),
        height: dimensionsRecto.height + dimensionsVerso.height,
        quality: 0.8,
      }
    )
      .then((base64) => {
        const regex = `^data:image\/${outputFormat};base64,`;
        const base64Data = base64.replace(new RegExp(regex), "");

        fs.writeFile(
          `images/case${i}/output.${outputFormat}`,
          base64Data,
          { encoding: "base64" },
          () => {
            console.log(
              `File written into ./images/case${i}/output.${outputFormat}`
            );
          }
        );
      })
      .catch((err) => {
        console.log(`Err with case ${i}`);
        console.log(err);
      });
  });
}
