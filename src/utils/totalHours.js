function calculateHours(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const result = end - start;

  return result / (1000 * 60 * 60);
}

module.exports = calculateHours;
