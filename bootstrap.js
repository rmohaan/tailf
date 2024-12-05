const fs = require("fs")
const readline = require('readline');

async function readLines(filePath, numLines, ws) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Consider \r\n as a single newline
    });
  
    let lines = [];
    let lineCount = 0;
  
    for await (const line of rl) {
      lines.push(line);
      lineCount++;
      ws.send(`${line} <br />`)
      if (lineCount >= numLines) {
        break;
      }
    }
    return lines;
  }

  module.exports = readLines;