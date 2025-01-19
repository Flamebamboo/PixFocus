export const formatStatsTime = (seconds) => {
  if (!seconds) return "0";
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  if (hours > 0) {
    return minutes > 0 ? `${hours}h${minutes}m` : `${hours}h`;
  } else {
    return `${minutes}m`;
  }
};

// need to display it like 1h30m or 1h or 30m or 5m time below 5 minuts wont be added to stats
