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
    const dC = targetPrice - optionPrice;
const a = 0.5 * gamma;
const b = delta;
const c = theta * timeDays - dC;
const discriminant = b * b - 4 * a * c;

output.textContent =
  "No real solution.\n" +
  `discriminant=${discriminant}\n` +
  `a=${a}, b=${b}, c=${c}\n` +
  `dC=${dC}, timeDays=${timeDays}\n` +
  "Check inputs/units.";
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
