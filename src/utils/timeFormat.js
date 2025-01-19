export const formatTimeDisplay = (seconds) => {
  if (!seconds) return "00:00";
  const totalMinutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${totalMinutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};
