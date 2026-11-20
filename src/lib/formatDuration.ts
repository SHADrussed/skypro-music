export function formatDuration(value: number): string {
  const seconds = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const minutesText = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secondsText = String(seconds % 60).padStart(2, "0");
  return `${minutesText}:${secondsText}`;
}
