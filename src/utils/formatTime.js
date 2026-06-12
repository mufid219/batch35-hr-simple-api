function formatTime(date) {
  return date.toISOString().substring(11, 16);
}

module.exports = formatTime;
