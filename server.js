const fs = require('fs');
const express = require('express')
const { WebSocketServer } = require('ws')
const readLines = require('./bootstrap.js')

const FileWatcher = require("./watcher.js")
//const { writeToFileInterval } = require("./fileWriter.js")

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
  readLines(watchFile, 10, (err, data) => {
    if (err) {
      console.log(err)
    }
    data.forEach(line => {
      ws.send(`${line} <br />`)
    });
  });

  let watcher = new FileWatcher(watchFile);

  watcher.on("newContent", (newContent) => {
    ws.send(`${newContent} <br/>`)
  });

  ws.on('close', () => console.log('Client has disconnected!'))
  ws.onerror = function () {
    console.log('websocket error')
  }
 })

// Not properly flushing the buffer
//writeToFileInterval(watchFile, 'Current time: ' + new Date().toLocaleString(), 5000); // Write every 5 seconds

