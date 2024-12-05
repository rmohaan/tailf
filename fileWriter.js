const fs = require("fs")

function writeToFileInterval(filePath, data, interval) {
  
    const log = fs.openSync(filePath, 'a+')
    let i = 0;
    let intervalId = setInterval(() => {
        console.log(i)
        //fs.write(log, i + '\n');
        fs.write(log, `${i + '\n'}`, (err, written, buffer) => {
            if (err) {
              console.error('Error writing to file:', err);
            } else {
              console.log(`User input saved to ${filePath}`);
            }
        });
        i++;
    }, interval);

    process.on('SIGINT', () => {
        console.log('File writing stopped.');
        clearInterval(intervalId);
        process.exit(0);
    });
  }
  
  module.exports = { writeToFileInterval }


