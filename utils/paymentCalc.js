export function calculateFinalAmount({
  paymentType,
  hourlyRate,
  fixedPrice,
  workedSeconds,
}) {
  if (paymentType === "HOURLY") {
    const hours = workedSeconds / 3600;
    return Math.round(hourlyRate * hours);
  }

  return fixedPrice ?? 0;
}