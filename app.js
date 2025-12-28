const calcBtn = document.getElementById('calculate');
const output = document.getElementById('output');

calcBtn.onclick = () => {
  const underlying = parseFloat(document.getElementById('underlying').value);
  const optionPrice = parseFloat(document.getElementById('optionPrice').value);
  const targetPrice = parseFloat(document.getElementById('targetPrice').value);
  const delta = parseFloat(document.getElementById('delta').value);
  const gamma = parseFloat(document.getElementById('gamma').value);
  const theta = parseFloat(document.getElementById('theta').value);
  const timeDays = parseFloat(document.getElementById('timeHorizon').value);

  if (
    isNaN(underlying) ||
    isNaN(optionPrice) ||
    isNaN(targetPrice) ||
    isNaN(delta) ||
    isNaN(gamma) ||
    isNaN(theta)
  ) {
    output.textContent = "Please fill in all fields.";
    return;
  }

  const move = requiredStockMove({
    optionPrice,
    targetPrice,
    delta,
    gamma,
    theta,
    timeDays
  });

  if (move === null) {
    output.textContent = "No real solution — check inputs (theta must be negative).";
    return;
  }

  const targetStock = underlying + move;

  output.textContent =
`Required underlying move: ${move.toFixed(2)}\n` +
`Target underlying price: ${targetStock.toFixed(2)}\n\n` +
    `Assumptions:\n` +
    `• IV flat\n` +
    `• Greeks locally valid\n` +
    `• Small–moderate move only`;
};
