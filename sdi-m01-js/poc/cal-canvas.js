const BG = document.getElementById("myCanvas");
const ctx_BG = BG.getContext("2d");

// Size of canvas
// We are starting with a small canvas as it affects feedback time and this is only a test
const w = 200;
const h = 200;

// Our min range of RGB
let minR = 10;
let minG = 10;
let minB = 10;

// Our max range of RGB
let maxR = 240;
let maxG = 240;
let maxB = 240;

/*
  The variable 'sector' determines how precise we want the scanning function to be
  The lower the number, the more precise with more time taken
  The higher the number, the less accuracte with less time taken
*/

// As this is a test canvas, the values we are using for the sectors include only (1 - Precise Scan), (10 - Moderate Scan) or (30 - Liberal Scan)
const sector = 30;

// This function does a [sector x sector] pixel scan, to calculate the number of pixels that has been tainted with colors that fall between the min / max range
const pixelsPainted = function () {
  let pixelsCount = null;

  for (let i = 0; i <= w; i = i + sector) {
    for (let j = 0; j <= h; j = j + sector) {
      const imgData = ctx_BG.getImageData(i, j, sector, sector);

      console.log(`         \nScanning [SECTOR]: ${i} / ${j}\n\n`);

      // The below values may exceed min / max ranges after application of filters, so we need to normalize the values again so it falls within the min / max ranges
      const red = imgData.data[0];
      const green = imgData.data[1];
      const blue = imgData.data[2];
      const alpha = imgData.data[3];

      console.log(`R: ${red}\nG: ${green}\nB: ${blue}\nA: ${alpha}`);

      if ((red >= minR && red <= maxR) || (green >= minG && green <= maxG) || (blue >= minB && blue <= maxB)) {
        pixelsCount++;
        console.log(`         \nPixels [PAINTED]: ${pixelsCount}\n\n`);
      }
    }
  }
  return pixelsCount;
};

// This function will take the painted areas in pixels and express it in percentage
const percentPainted = function (pixelsCount) {
  const area = w * h;
  const percentPaint = (pixelsCount * (sector * sector)) / area;

  return (percentPaint * 100).toFixed(2);
};

console.log(`\nPercentage Painted: ${percentPainted(pixelsPainted())} %\n\n`);
