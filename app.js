const imageInput = document.getElementById('imageInput');
const runOCRBtn = document.getElementById('runOCR');
const calcBtn = document.getElementById('calculate');
const output = document.getElementById('output');

runOCRBtn.onclick = async () => {
  if (!imageInput.files.length) return;

  const strikeVal = document.getElementById('strike').value;
  const strike = strikeVal ? parseInt(strikeVal, 10) : null;

  const data = await runOCRFromImage(imageInput.files[0], strike);

  // Fill fields if present (you can still overwrite manually)
  if (data.underlying != null) document.getElementById('underlying').value = data.underlying;
  if (data.optionPrice != null) document.getElementById('optionPrice').value = data.optionPrice;
  if (data.theta != null) document.getElementById('theta').value = data.theta;
  if (data.delta != null) document.getElementById('delta').value = data.delta;
  if (data.gamma != null) document.getElementById('gamma').value = data.gamma;

  // If it couldn't find the strike row, show why
  if (data.rowFound === false) {
    alert("Could not find the strike row in OCR text. Try a clearer screenshot or zoom in, then retry.");
  }
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
