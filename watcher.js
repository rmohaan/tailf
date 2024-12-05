const fs = require("fs");
const EventEmitter = require("events");

class FileWatcher extends EventEmitter {
  constructor(filePath) {
    super();
    this.filePath = filePath;
    this.lastPosition = 0; // Keep track of the file's last read position
    this.startWatching();
  }

  startWatching() {
    // Initialize the last position to the current file size
    fs.stat(this.filePath, (err, stats) => {
      if (err) {
        console.error(`Error accessing file: ${err.message}`);
        return;
      }
      this.lastPosition = stats.size;

      // Watch the file for changes
      fs.watch(this.filePath, (eventType) => {
        console.log(`${this.filePath} has changed...`)
        if (eventType === "change") {
          this.processNewContent();
        }
      });
    });
  }

  processNewContent() {
    // Read only the new content from the file
    const readStream = fs.createReadStream(this.filePath, {
      start: this.lastPosition,
    });

    readStream.on("data", (chunk) => {
      const newContent = chunk.toString();
      this.emit("newContent", newContent); // Emit the new content
    });

    readStream.on("end", () => {
      // Update the last read position
      fs.stat(this.filePath, (err, stats) => {
        if (!err) {
          this.lastPosition = stats.size;
        }
      });
    });

    readStream.on("error", (err) => {
      console.error(`Error reading file: ${err.message}`);
    });
  }
}

module.exports = FileWatcher;