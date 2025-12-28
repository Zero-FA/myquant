async function runOCRFromImage(file) {
  const { data } = await Tesseract.recognize(
    file,
    'eng',
    { logger: m => console.log(m) }
  );

  const text = data.text;

  // Very simple heuristics (user can edit values after)
  const spyMatch = text.match(/SPY[:\s]*([0-9]+\.[0-9]+)/i);
  const deltaMatch = text.match(/Delta\s*([0-9]+\.[0-9]+)/i);
  const gammaMatch = text.match(/Gamma\s*([0-9]+\.[0-9]+)/i);
  const thetaMatch = text.match(/Theta\s*(-?[0-9]+\.[0-9]+)/i);

  return {
    underlying: spyMatch ? parseFloat(spyMatch[1]) : null,
    delta: deltaMatch ? parseFloat(deltaMatch[1]) : null,
    gamma: gammaMatch ? parseFloat(gammaMatch[1]) : null,
    theta: thetaMatch ? parseFloat(thetaMatch[1]) : null
  };
}
