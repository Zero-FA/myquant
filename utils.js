function parseNumber(text) {
  const n = parseFloat(text);
  return isNaN(n) ? null : n;
}
