const fs = require("fs")
const readline = require('readline');

async function readLines(filePath, numLines, callback) {
  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity, // Recognize both \n and \r\n as line breaks
  });

  const lines = [];

  rl.on('line', (line) => {
    // Push the new line and maintain only the last 'numLines' lines
    lines.push(line);
    if (lines.length > numLines) {
      lines.shift();  // Remove the first line to keep the array size bounded
    }
  });

  rl.on('close', () => {
    // Once the stream is closed, return the last N lines
    callback(null, lines);
  });

  rl.on('error', (err) => {
    console.log(err);
  });
}

module.exports = readLines;

