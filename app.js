const imageInput = document.getElementById('imageInput');
const runOCRBtn = document.getElementById('runOCR');
const calcBtn = document.getElementById('calculate');
const output = document.getElementById('output');

runOCRBtn.onclick = async () => {
  if (!imageInput.files.length) return;

  const data = await runOCRFromImage(imageInput.files[0]);

  // DEBUG: show what OCR extracted
  console.log("OCR result object:", data);
  console.log("OCR rawNumbers:", data.rawNumbers);

  alert(
    "OCR extracted:\n" +
    "Underlying: " + (data.underlying ?? "null") + "\n" +
    "rawNumbers: " + (data.rawNumbers ? data.rawNumbers.join(", ") : "none")
  );

  // Fill fields if present (you can still overwrite manually)
  if (data.underlying != null) document.getElementById('underlying').value = data.underlying;
  if (data.delta != null) document.getElementById('delta').value = data.delta;
  if (data.gamma != null) document.getElementById('gamma').value = data.gamma;
  if (data.theta != null) document.getElementById('theta').value = data.theta;
};

calcBtn.onclick = () => {
  const underlying = parseFloat(document.getElementById('underlying').value);
  const optionPrice = parseFloat(document.getElementById('optionPrice').value);
  const targetPrice = parseFloat(document.getElementById('targetPrice').value);
  const delta = parseFloat(document.getElementById('delta').value);
  const gamma = parseFloat(document.getElementById('gamma').value);
  const theta = parseFloat(document.getElementById('theta').value);
  const timeDays = parseFloat(document.getElementById('timeHorizon').value);

  const move = requiredStockMove({
    optionPrice,
    targetPrice,
    delta,
    gamma,
    theta,
    timeDays
  });

  if (move === null) {
    output.textContent = "No real solution — assumptions break down.";
    return;
  }

  const targetStock = underlying + move;

  output.textContent =
    `Required SPY move: ${move.toFixed(2)}\n` +
    `Target SPY price: ${targetStock.toFixed(2)}\n\n` +
    `Assumptions:\n` +
    `• IV flat\n` +
    `• Greeks locally valid\n` +
    `• Small–moderate move only`;
};
