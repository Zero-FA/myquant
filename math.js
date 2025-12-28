function requiredStockMove({
  optionPrice,
  targetPrice,
  delta,
  gamma,
  theta,
  timeDays
}) {
  const dC = targetPrice - optionPrice;

  const a = 0.5 * gamma;
  const b = delta;
  const c = theta * timeDays - dC;

  // Linear fallback if gamma is ~0
  if (Math.abs(a) < 1e-12) {
    if (Math.abs(b) < 1e-12) return null;
    return -c / b;
  }

  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null;

  const sqrtD = Math.sqrt(discriminant);

  const root1 = (-b + sqrtD) / (2 * a);
  const root2 = (-b - sqrtD) / (2 * a);

  return Math.abs(root1) < Math.abs(root2) ? root1 : root2;
}
