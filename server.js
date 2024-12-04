const fs = require('fs');
const express = require('express')
const { WebSocketServer } = require('ws')
const readline = require('readline');


const { writeToFileInterval } = require("./fileWriter.js")

const webserver = express()
 .use((req, res) =>
   res.sendFile('websocket.html', { root: __dirname })
 )
 .listen(3000, () => console.log(`Listening on ${3000}`))

 
const sockserver = new WebSocketServer({ port: 443 })
const watchFile = "log.txt"


sockserver.on('connection', ws => {

  console.log('New client connected!')
  ws.send('connection established')
  readFirstLines(watchFile, 10)
  .then(lines => {
    console.log(lines);
    ws.send(JSON.stringify(lines))
  })
  .catch(err => {
    console.error(err);
  });
  

  let watching = false
  fs.watch(watchFile, (eventType, filename) => {

    if(watching) return;
    watching = true;

    // check

    if (eventType === 'change') {
      fs.readFile(filename, 'utf8', function (err, data) {
        ws.send(data)
      });
    }

    // the timeout is to prevent the script to run twice with short functions
    // the delay can be longer to disable the function for a set time
    setTimeout(() => {
        watching = false;
    }, 1000);

  });
  

  
  ws.on('close', () => console.log('Client has disconnected!'))
  ws.onerror = function () {
    console.log('websocket error')
  }
 })


 async function readFirstLines(filePath, numLines) {
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

    if (lineCount >= numLines) {
      break;
    }
  }

  return lines;
}

// Not properly flushing the buffer
//writeToFileInterval(watchFile, 'Current time: ' + new Date().toLocaleString(), 5000); // Write every 5 seconds

