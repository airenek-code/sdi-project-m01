//
/*

    CANVAS INITIALIZATION - STARTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

*/
//

const w = window.innerWidth;
const h = window.innerHeight;

// Obtaining canvas in HTML
UI = document.getElementById("canvas-UI");
UI.width = w;
UI.height = h;

MG = document.getElementById("canvas-MG");
MG.width = w;
MG.height = h;

BG = document.getElementById("canvas-BG");
BG.width = w;
BG.height = h;

// Setting all 2d context for canvas in HTML
const ctx_UI = UI.getContext("2d");
const ctx_MG = MG.getContext("2d");
const ctx_BG = BG.getContext("2d");

// Initialzing globalAlpha property for canvas
ctx_UI.globalAlpha = 0.75;
ctx_MG.globalAlpha = 0.7;
ctx_BG.globalAlpha = 1;

// Initialzing other properties for canvas
ctx_UI.imageSmoothingQuality = "high";
ctx_BG.imageSmoothingQuality = "high";

//
/*

    CANVAS INITIALIZATION - ENDS 
    CANVAS INITIALIZATION - ENDS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    CANVAS INITIALIZATION - ENDS 

*/
//

//
/*

    EVENT LISTENERS - STARTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

*/
//

// Initalizing cursorClick object to store variables of mouse click event
const cursorClick = {
  cclickX: undefined,
  cclickY: undefined,
  cclickActive: false,
};

window.addEventListener("mousedown", function (evt) {
  cursorClick.cclickX = evt.x;
  cursorClick.cclickY = evt.y;
  cursorClick.cclickActive = true;

  // console.log("\n--- Event: [CURSOR CLICK]");
  // console.log(`\ncclickX: ${cursorClick.cclickX}\ncclickY: ${cursorClick.cclickY}\ncclickActive: '${cursorClick.cclickActive}'\n\n`);
});

// Initalizing cursorMove object to store variables of whenever the mouse move event
const cursorMove = {
  cposX: undefined,
  cposY: undefined,
};

window.addEventListener("mousemove", function (evt) {
  cursorMove.cposX = evt.x;
  cursorMove.cposY = evt.y;

  // console.log("\n--- Event: [CURSOR MOVE]");
  // console.log(`\ncposX: ${cursorMove.cposX}\ncposY: ${cursorMove.cposY}\n\n`);
});

//
/*

    EVENT LISTENERS - ENDS
    EVENT LISTENERS - ENDS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    EVENT LISTENERS - ENDS

*/
//

//
/*

  CLASS CREATION - STARTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

*/
//

const randFloat = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Recommended: totalShapes is 10 or more, ideal is 50
const totalShapes = 60;

const distDivider = 6.75;
const soundEle = document.createElement("audio");
const soundArr = ["../sdi-m01-js/lib/audio/pop_01.wav", "../sdi-m01-js/lib/audio/pop_02.wav", "../sdi-m01-js/lib/audio/pop_03.wav"];

let floatersPopped = null;
let fontDescend = 200;
let fontAscend = fontDescend / 2;
let scaleStep = Math.round((fontDescend - fontAscend) / totalShapes);

class Floater {
  constructor(tranX, tranY, velX, velY, radius, color) {
    this.tranX = tranX;
    this.tranY = tranY;
    this.velX = velX;
    this.velY = velY;
    this.radius = radius;
    this.color = `rgba(${color})`;
  }

  //   Shape Creation
  #drawShape() {
    ctx_MG.beginPath();
    ctx_MG.arc(this.tranX, this.tranY, this.radius, 0, Math.PI * 2, false);
    ctx_MG.fillStyle = this.color;
    ctx_MG.fill();
    ctx_MG.lineWidth = 2;
    ctx_MG.strokeStyle = `rgba(255, 255, 255, 0)`;
    ctx_MG.stroke();
  }

  //   Shape Movement
  #translateShape() {
    // Setting the frame boundaries
    if (this.tranX + this.radius > w || this.tranX - this.radius < 0) {
      this.velX = -this.velX;
    }

    if (this.tranY + this.radius > h || this.tranY - this.radius < 0) {
      this.velY = -this.velY;
    }

    // Setting animation paths with initial position and direction
    this.tranX += this.velX;
    this.tranY += this.velY;
  }

  //   Game Definition
  gameplay() {
    this.#drawShape();
    this.#translateShape();

    let soundTrigger = false;
    // console.log(`         \nSound [TRIGGER]: '${soundTrigger}'\n\n`);

    // maxGrowth is based on the screen size
    const maxGrowth = w / 9;

    // Finding the differences in X and Y values, only using integers and positive numbers
    // Math.abs resolves # to positive values
    // toFixed(decimalPt) resolves # to (decimalPt) value
    const diff_CMX = Math.abs(cursorMove.cposX - this.tranX.toFixed(2));
    const diff_CMY = Math.abs(cursorMove.cposY - this.tranY.toFixed(2));

    const diff_CCX = Math.abs(cursorClick.cclickX - Math.round(this.tranX));
    const diff_CCY = Math.abs(cursorClick.cclickY - Math.round(this.tranY));

    // This prevents the shapes from being grossly huge beyond the window's scale
    if (this.radius <= maxGrowth) {
      // Check if cursor movement falls within the area of any circles
      if (diff_CMX >= 0 && diff_CMX <= this.radius && diff_CMY >= 0 && diff_CMY <= this.radius) {
        // console.log("         \n[Cursor MOVE] within floaters area\n\n");
        // console.log("Before scale:", this.radius.toFixed(3));

        this.radius += randFloat(0.2, 1) * 20;
        soundTrigger = true;

        // console.log("After scale:", this.radius.toFixed(3));

        // Check if cursor click falls within the area of any circles
        if (diff_CCX >= 0 && diff_CCX <= this.radius && diff_CCY >= 0 && diff_CCY <= this.radius && cursorClick.cclickActive == true) {
          // Paint on BG canvas
          // console.log("         \n[Cursor CLICK] within floaters area\n\n");

          const blurAmt = Math.round(randFloat(4, 75));

          // Randomize the degree of blurness as the canvas is being painted
          ctx_BG.filter = `blur(${blurAmt}px) brightness(150%) opacity(80%)`;
          // console.log(`         \n[BLUR] Amount: ${blurAmt}\n\n`);

          ctx_BG.beginPath();
          ctx_BG.arc(cursorClick.cclickX, cursorClick.cclickY, this.radius, 0, Math.PI * 2, false);
          ctx_BG.fillStyle = this.color;
          ctx_BG.fill();

          cursorClick.cclickActive = false;
          // console.log(`         \n[Cursor RESET cclickActive] to: '${cursorClick.cclickActive}'\n\n`);
        }
      }
    }

    // Floaters burst when they exceed the maxGrowth specified
    else {
      ctx_UI.clearRect(0, 0, UI.width, UI.height);

      this.radius = 0;
      soundTrigger = true;
      floatersPopped++;
      // console.log(`         \nTotal floaters [POPPED]: ${floatersPopped}\n\n`);

      // Scale of live counters' text is animated
      if (fontDescend > 100) {
        fontDescend -= scaleStep;
        fontAscend += scaleStep;

        // console.log(`         \nCounter Scale [STEP]: ${scaleStep}\n\n`);
        // console.log(`         \nCounter Scale [DESCENDING]: ${fontDescend}\n\n`);
        // console.log(`         \nCounter Scale [ASCENDING]: ${fontAscend}\n\n`);
      }

      // Updates game status counter to screen
      if (totalShapes - floatersPopped > 0) {
        // Live counter - floater updates
        ctx_UI.font = `${fontDescend}px Helvetica`;
        ctx_UI.textAlign = "center";
        ctx_UI.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx_UI.fillText(`${totalShapes - floatersPopped}`, w / 2 - w / distDivider, h / 2);
        ctx_UI.lineWidth = "8.5";
        ctx_UI.strokeStyle = "rgba(0, 0, 0, 0.075)";
        ctx_UI.strokeText(`${totalShapes - floatersPopped}`, w / 2 - w / distDivider, h / 2);

        // Static text - UI divider
        ctx_UI.font = "400px Helvetica";
        ctx_UI.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx_UI.fillText(`/`, w / 2, h / 2 + h / 8);
        ctx_UI.lineWidth = "6.5";
        ctx_UI.strokeStyle = "rgba(0, 0, 0, 0.075)";
        ctx_UI.strokeText(`/`, w / 2, h / 2 + h / 8);

        // Static text - "floater/s remain"
        ctx_UI.font = "italic 18px Georgia";
        ctx_UI.textAlign = "center";
        ctx_UI.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx_UI.fillText(`floater/s remain`, w / 2 - w / distDivider, h / 2 + h / 16);

        // Static text - "percentage painted"
        ctx_UI.fillText(`percentage painted`, w / 2 + w / distDivider, h / 2 + h / 16);
      }

      // Plays the popping sound from soundArr
      if (soundTrigger) {
        try {
          const soundPick = Math.round(randFloat(0, soundArr.length - 1));
          soundEle.src = soundArr[soundPick];
          soundEle.play();
        } catch (error) {
          // console.log("         \nAudio Playback Issues\n\n");
        }

        // console.log(`         \nSound [TRIGGER]: '${soundTrigger}'\n\n`);
      }
    }
  }
}

//
/*

  CLASS CREATION - ENDS
  CLASS CREATION - ENDS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  CLASS CREATION - ENDS

*/
//

//
/*

  CLASS INSTANTIATION & FUNCTIONS - STARTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

*/
//

let shapeContainer = [];

// Only values between 0 - 255 allowed for variables
// Here we are setting min * / max* [RED, GREEN, BLUE], they can be altered for different color schemes
const minR = 10;
const maxR = 250;

const minG = 10;
const maxG = 250;

const minB = 10;
const maxB = 250;

const avgMinRGB = (minR + minG + minB) / 3;
const avgMaxRGB = (maxR + maxG + maxB) / 3;

// Only values between 0 - 1 / 0 - 255 allowed for variables minA / maxA [ALPHA]
const minA = 0.4;
const maxA = 0.55;

// Only values between 0 - 100 allowed for variables shapeAllotMin / shapeAllotMax, both values MUST add up to 100 to represent totality of 100%
const shapeAllotMin = 30;
const shapeAllotMax = 70;

// Recommended: minRad 10px+-, maxRad 90px+-
const minRad = 10;
const maxRad = 85;

const generateShapeArr = (randRadius) => {
  const randTranX = Math.random() * (w - randRadius * 2) + randRadius;
  const randTranY = Math.random() * (h - randRadius * 2) + randRadius;

  // randVelX & ranVelY will indicate the speed and direction of the floaters
  const randVelX = Math.random() - 3.5;
  const randVelY = Math.random() - 0.5;

  // The below variables will generate floaters with assorted random colors & opacity
  const randR = Math.round(randFloat(minR, maxR));
  const randG = Math.round(randFloat(minG, maxG));
  const randB = Math.round(randFloat(minB, maxB));
  const randA = randFloat(minA, maxA);

  shapeContainer.push(new Floater(randTranX, randTranY, randVelX, randVelY, randRadius, [randR, randG, randB, randA]));
};

for (let j = 1; j <= (totalShapes / 100) * shapeAllotMin; j++) {
  let randRadius = Math.round(randFloat(minRad, minRad * 2.5));

  // console.log(`         \nShape Rand [MIN RADIUS]: '${randRadius}'\n\n`);
  // console.log(`         \nShape % Allot [MIN COUNTER]: ${j}\n\n`);

  generateShapeArr(randRadius);
}

for (let k = 1; k <= (totalShapes / 100) * shapeAllotMax; k++) {
  let randRadius = Math.round(randFloat(maxRad / 2.5, maxRad));

  // console.log(`         \nShape Rand [MAX RADIUS]: '${randRadius}'\n\n`);
  // console.log(`         \nShape % Allot [MAX COUNTER]: ${k}\n\n`);

  generateShapeArr(randRadius);
}

const animate = function () {
  requestAnimationFrame(animate);

  // Clears the canvas before requestAnimationFrame() is called
  ctx_MG.clearRect(0, 0, MG.width, MG.height);

  for (let i = 0; i < shapeContainer.length; i++) {
    shapeContainer[i].gameplay();
  }
};

animate();

// Calculation of % of canvas painted starts here
// Scanning X/Y sectors in px, the higher this number is - the faster the response time and the lower its accuracy becomes
// Currently the most liberal value (of 'sector'), is set to 100
const sector = 100;

// Area of browser window
const area = w * h;

// This is to cap the pixel values so it stays within the min / max range
// After application of filters these value changes, so we are doing this in case it interferes with the accuracy of calculation
const ceiling = (value) => {
  if (value > avgMaxRGB) {
    value = avgMaxRGB;
    return value;
  } else {
    return value;
  }
};

const pixelsPainted = () => {
  let pixelsCount = null;

  // [sector x sector] pixel scan
  for (let i = 0; i <= w; i = i + sector) {
    for (let j = 0; j <= h; j = j + sector) {
      const imgData = ctx_BG.getImageData(i, j, sector, sector);

      // console.log(`         \nScanning [SECTOR]: ${i} / ${j}\n\n`);

      // The below values may exceed min / max ranges due to application of filters, so we need to keep them within the min / max ranges
      const red = ceiling(imgData.data[0]);
      const green = ceiling(imgData.data[1]);
      const blue = ceiling(imgData.data[2]);
      const alpha = imgData.data[3];

      console.log(`\nR: ${red}\nG: ${green}\nB: ${blue}\nA: ${alpha}\n\n`);

      if ((red >= minR && red <= maxR) || (green >= minG && green <= maxG) || (blue >= minB && blue <= maxB)) {
        pixelsCount++;
        console.log(`         \nPixels [PAINTED]: ${pixelsCount}\n\n`);
      }
    }
  }
  return pixelsCount;
};

const percentPainted = (pixelsCount) => {
  const area = w * h;
  const percentPaint = (pixelsCount * (sector * sector)) / area;
  //  console.log(`         \nPercentage [PERCENT PAINTED]: ${percentPaint * 100} %\n\n`);

  return Math.round(percentPaint * (100 - sector / 5));
};

// Live counter - percentage painted updates only on mouseclick
window.addEventListener("mousedown", function (evt) {
  const printScore = percentPainted(pixelsPainted());

  // Live counter - percentage painted updates
  ctx_UI.font = `${fontAscend}px Helvetica`;
  ctx_UI.textAlign = "center";
  ctx_UI.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx_UI.fillText(`${printScore}`, w / 2 + w / distDivider, h / 2);
  ctx_UI.lineWidth = "8.5";
  ctx_UI.strokeStyle = "rgba(0, 0, 0, 0.075)";
  ctx_UI.strokeText(`${printScore}`, w / 2 + w / distDivider, h / 2);
});

//
/*

  CLASS INSTANTIATION & FUNCTIONS - ENDS
  CLASS INSTANTIATION & FUNCTIONS - ENDS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  CLASS INSTANTIATION & FUNCTIONS - ENDS

*/
//

//
/*

  UI CREATION - STARTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

*/
//

const greetingArr = [`"Hello!"`, `"Salve!"`, `"Salut!"`, `"Hola!"`, `"你好!"`, `"Olá!"`, `"Guten Tag!"`, `"Selamat!"`];
const greetingPick = Math.round(randFloat(0, greetingArr.length - 1));

ctx_UI.lineWidth = "1.5";
ctx_UI.strokeStyle = `rgba(0, 0, 0, 0.275)`;

ctx_UI.font = "italic 115px Helvetica";
ctx_UI.fillStyle = "rgba(255, 255, 255, 0.6)";
ctx_UI.fillText(greetingArr[greetingPick], 120, 215);
ctx_UI.lineWidth = "1.5";
ctx_UI.strokeStyle = "rgba(0, 0, 0, 0.75)";
ctx_UI.strokeText(greetingArr[greetingPick], 120, 215, 2000);
ctx_UI.strokeStyle = "rgba(0, 0, 0, 0.26)";
ctx_UI.strokeText(greetingArr[greetingPick], 130, 215, 2000);

ctx_UI.font = "italic 17px Georgia";
ctx_UI.fillStyle = "rgba(0, 0, 0, 0.75)";
ctx_UI.fillText(`[ Mouseover ] -  Pops the floaters`, 160, 311);
ctx_UI.fillText(`[ Mousedown ] -  Paints the canvas`, 160, 338);
ctx_UI.fillText(`Do either.. Or both!`, 160, 394);
ctx_UI.fillText(`Or.. Simply watch the floaters go by......`, 160, 421);

//
/*

  UI CREATION - ENDS
  UI CREATION - ENDS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  UI CREATION - ENDS

*/
//
