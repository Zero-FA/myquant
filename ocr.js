async function runOCRFromImage(file, strike = null) {
  const { data } = await Tesseract.recognize(
    file,
    'eng',
    { logger: m => console.log(m) }
  );

  const text = data.text || "";

  // 1) Underlying (works well because it’s labeled)
  const spyMatch = text.match(/SPY[:\s]*([0-9]+\.[0-9]+)/i);
  const underlying = spyMatch ? parseFloat(spyMatch[1]) : null;

  // If no strike provided, just return underlying (and let user type the rest)
  if (!strike) {
    return { underlying, rowFound: false };
  }

  // 2) Find the line that contains the strike (e.g. "691")
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // Match strike as a whole number token (avoid matching 1691 etc.)
  const strikeRegex = new RegExp(`(^|\\s)${strike}(\\s|$)`);

  const rowLine = lines.find(l => strikeRegex.test(l));

  if (!rowLine) {
    return { underlying, rowFound: false };
  }

  // 3) Extract decimals from the strike row
  // For your table layout, the row usually contains:
  // Bid, Mid, Ask, Theta, Delta, Gamma  (Volume is an integer with commas, ignored)
  const decimals = (rowLine.replace(/,/g, "").match(/-?\d+\.\d+/g) || []).map(Number);

  // Expected example for 691 row:
  // [0.65, 0.66, 0.66, -0.1749, 0.3583, 0.1444]
  // Map them if we have enough
  let optionPrice = null, theta = null, delta = null, gamma = null;

  if (decimals.length >= 6) {
    optionPrice = decimals[1];  // Mid
    theta = decimals[3];
    delta = decimals[4];
    gamma = decimals[5];
  } else if (decimals.length === 5) {
    // Sometimes OCR drops one of bid/ask; assume first is mid in that case
    optionPrice = decimals[0];
    theta = decimals[2];
    delta = decimals[3];
    gamma = decimals[4];
  } else {
    // Not enough info extracted from that line
    return { underlying, rowFound: false };
  }

  return {
    underlying,
    optionPrice,
    theta,
    delta,
    gamma,
    rowFound: true
  };
}
