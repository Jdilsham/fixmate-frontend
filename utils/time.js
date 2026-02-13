export function formatWorkedTime(totalSeconds = 0) {
  if (totalSeconds < 0) totalSeconds = 0;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}

export function calculateFinalAmount({
  paymentType,
  hourlyRate,
  fixedPrice,
  workedSeconds,
}) {
  if (paymentType === "HOURLY") {
    return Math.round((hourlyRate * workedSeconds) / 3600);
  }

  return fixedPrice ?? 0;
}