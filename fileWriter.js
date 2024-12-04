const fs = require("fs")

function writeToFileInterval(filePath, data, interval) {
    const writeStream = fs.createWriteStream(filePath, { flags: 'a' }); // Append to file
  
    let intervalId = setInterval(() => {
      writeStream.write(data + '\n'); // Write data with a newline
      writeStream.emit("drain");
    }, interval);
  
    // Optional: Graceful shutdown to close the stream
    process.on('SIGINT', () => {
      clearInterval(intervalId);
      writeStream.end();
      console.log('File writing stopped.');
      process.abort()
    });
  }
  
  module.exports = { writeToFileInterval }