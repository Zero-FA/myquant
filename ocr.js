async function runOCRFromImage(file) {
  const { data } = await Tesseract.recognize(
    file,
    'eng',
    { logger: m => console.log(m) }
  );

  const text = data.text;

  // 1️⃣ Underlying (this already works)
  const spyMatch = text.match(/SPY[:\s]*([0-9]+\.[0-9]+)/i);

  // 2️⃣ Extract ALL decimal numbers from OCR text
  const numbers = text
    .replace(/,/g, '')                // remove commas
    .match(/-?\d+\.\d+/g) || [];

  // DEBUG: see what OCR actually read
  console.log("OCR numbers:", numbers);

  /*
    Expected order for a single row (example):
    [ bid, mid, ask, theta, delta, gamma ]
    OR
    [ mid, volume?, theta, delta, gamma ]

    YOU will confirm this visually once.
  */

  return {
    underlying: spyMatch ? parseFloat(spyMatch[1]) : null,
    rawNumbers: numbers.map(Number)
  };
}
