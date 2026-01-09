
function generateRandomKey() {
  const min = 1000; // minimum 4-digit number
  const max = 9999; // maximum 4-digit number
  return `${Math.floor(Math.random() * (max - min + 1)) + min}`;
}

module.exports = { generateRandomKey };