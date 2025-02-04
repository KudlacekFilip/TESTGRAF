let offsetY = 0;
let data = [
  ["2025", "0", "0"],
  ["2024", "45412", "192.52"],
  ["2023", "43341", "184.27"],
  ["2022", "40353", "129.32"],
  ["2021", "37839", "210.95"],
  ["2020", "35611", "214.49"],
  ["2019", "34125", "196.75"],
  ["2018", "31885", "188.95"],
  ["2017", "29504", "179.04"],
  ["2016", "27589", "173.93"],
  ["2015", "26367", "173.81"],
  ["2014", "25686", "154.25"],
  ["2013", "25128", "145.50"],
  ["2012", "25109", "147.93"],
  ["2011", "24419", "145.77"],
  ["2010", "23951", "154.12"],
  ["2009", "23488", "168.86"],
  ["2008", "22691", "165.18"],
  ["2007", "20957", "134.85"],
  ["2006", "19546", "148.99"],
  ["2005", "18344", "142.78"],
  ["2004", "17466", "142.24"],
  ["2003", "16430", "137.68"],
  ["2002", "15524", "132.00"],
  ["2001", "14378", "136.93"],
  ["2000", "13219", "104.30"],
  ["1999", "12658", "105.85"],
  ["1998", "11693", "108.55"],
  ["1997", "10691", "94.48"],
  ["1996", "9676", "90.03"],
  ["1995", "8172", "89.88"],
  ["1994", "6894", "78.82"],
  ["1993", "5817", "68.84"],
  ["1992", "4644", "63.08"],
  ["1991", "3792", "57.70"],
  ["1990", "3286", "58.08"],
  ["1989", "3286", "100.00"],
];

let isPaused = false;
let hideUI = false;
let colors = [];
let adjustedColors = [];
let currentYear = "";
let yearAlpha = 0;
let shuffleMessageAlpha = 0;
let shuffleMessageDuration = 120;
let tooltipData = null;
let showFullTooltip = false;
let canvasHeight = data.length * 96;
let robotoFont;

function preload() {
  robotoFont = loadFont('Roboto-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, max(canvasHeight, windowHeight));
  frameRate(60);
  noCursor();
  textFont(robotoFont); // Set the Roboto font

  colors = data.map(() => color(random(255), random(255), random(255)));
  adjustedColors = colors.map((c) =>
    color(
      constrain(red(c) + 20, 0, 255),
      constrain(green(c) + 40, 0, 255),
      constrain(blue(c) + 70, 0, 255)
    )
  );
}

function draw() {
  background(255);

  if (!isPaused) {
    offsetY += 1;
    if (offsetY >= height) {
      offsetY = 0;
    }
  }

  let cellSize = 30;
  let x = 0;
  let y = offsetY - height;

  for (let i = 0; i < data.length; i++) {
    let yearData = data[i];
    let year = yearData[0];
    let value1 = parseFloat(yearData[1].replace(",", "."));
    let value2 = parseFloat(yearData[2].replace(",", "."));

    let normalizedValue1 = map(value1, 0, 1000, 1, 10);
    let normalizedValue2 = map(value2, 0, 200, 1, 10);

    for (let k = 0; k < normalizedValue1; k++) {
      drawShape(x, y, colors[i], cellSize, year, value1, value2);
      x += cellSize;
      if (x + cellSize > width) {
        x = 0;
        y += cellSize;
      }
    }

    for (let k = 0; k < normalizedValue2; k++) {
      drawShape(x, y, adjustedColors[i], cellSize, year, value1, value2);
      x += cellSize;
      if (x + cellSize > width) {
        x = 0;
        y += cellSize;
      }
    }
  }

  if (!hideUI) {
    if (tooltipData) {
      if (showFullTooltip) {
        drawTooltip();
      } else {
        drawYearOnly();
      }
    }

    drawShuffleMessage();
    drawCustomCursor();
    drawInstructions(window.scrollY);
  }
}

function drawShape(x, y, shapeColor, size, year, value1, value2) {
  noStroke();
  fill(shapeColor);
  rect(x, y, size, size);
  if (mouseX > x && mouseX < x + size && mouseY > y && mouseY < y + size) {
    tooltipData = { year, value1, value2 };
  }
}

function drawTooltip() {
  let padding = 10;
  let textContent = `Year: ${tooltipData.year}\nAverage salary: ${nf(tooltipData.value1, 0, 0)} Kč\nPurchasing power vs. 1989: ${nf(tooltipData.value2, 0, 2)} %`;
  let boxWidth = textWidth(textContent) + padding - 15;
  let boxHeight = 60;

  fill(255, 230);
  rect(mouseX + 5, mouseY + 5, boxWidth, boxHeight, 10);
  fill(0);
  textSize(12);
  textAlign(LEFT, TOP);
  text(textContent, mouseX + padding + 5, mouseY + padding + 3);
}

function drawYearOnly() {
  fill(255, 230);
  rect(mouseX + 5, mouseY + 5, 60, 30, 10);
  fill(0);
  noStroke();
  textSize(21);
  textAlign(CENTER, CENTER);
  text(tooltipData.year, mouseX + 35, mouseY + 17);
}

function drawInstructions(scrollY) {
  let instructions = "Press (S) to Shuffle data\nPress (M) to show Tooltip\nPress (P) to Pause\nPress (H) to hide UI\nPress (E) to Export as PNG";
  let padding = 20;
  let rectWidth = 190;
  let rectHeight = 100;

  let x = 20;
  let y = 20 + scrollY; // Adjust y position based on scrollY

  fill(240, 240, 240, 230);
  noStroke();
  rect(x, y, rectWidth, rectHeight, 10);
  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text(instructions, x + padding / 2, y + padding - 14);
}

function drawShuffleMessage() {
  if (shuffleMessageAlpha > 0) {
    push(); // Save the current drawing state
    fill(0, shuffleMessageAlpha);
    textSize(24);
    textAlign(CENTER, CENTER);
    noStroke();

    fill(255, 230);
    rectMode(CENTER);
    rect(width/2, scrollY+windowHeight/2, 170, 40, 10); // Background for text

    fill(0);
    text("Data Shuffled!", width/2, scrollY+windowHeight/2 - 4); // Center text

    shuffleMessageAlpha -= 255 / shuffleMessageDuration; // Gradually fade out over duration

    pop(); // Restore the previous drawing state
  }
}
function drawCustomCursor() {
  fill(255);
  ellipse
    (mouseX, mouseY, 5, 5);
}

function keyPressed() {
  if (key === "P" || key === "p") {
    isPaused = !isPaused;
  }
  if (key === "M" || key === "m") {
    showFullTooltip = !showFullTooltip;
  }
  if (key === "S" || key === "s") {
    shuffleData();
  }
  if (key === "H" || key === "h") {
    hideUI = !hideUI;
  }
  if (key === "E" || key === "e") {
    exportVisualization();
  }
  if (key === "C" || key === "c") {
    generateRandomColors(); // Call the function to generate new random colors
  }
}

function generateRandomColors() {
  colors = data.map(() => color(random(255), random(255), random(255)));
  adjustedColors = colors.map((c) =>
    color(
      constrain(red(c) + 20, 0, 255),
      constrain(green(c) + 40, 0, 255),
      constrain(blue(c) + 70, 0, 255)
    )
  );
}

function shuffleData() {
  data.sort(() => random() - 0.5);
  shuffleMessageAlpha = 255; // Reset alpha for the message
}

function exportVisualization() {
  let fileName = `visualization_${new Date().toISOString().slice(0, 10)}.png`;
  saveCanvas(fileName, 'png'); // Saves the canvas as a PNG file
}
