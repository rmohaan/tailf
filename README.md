# tailf

# Step 1:
npm i

# Step 2:
In a terminal, run `node fileWriter.js`. This will write some number to log file in real time [ essentially simulating the log file creation in real world example ]

# Step 3:
In another terminal, run `node server.js` [ This is the File Watcher service which creates a server and websocket and pushses the file content changes to the connected clients in real time ]

# Step 4:
Open a browser and enter `localhost:3000` [ Client 1 ]

# Step 5:
Open a browser and enter `localhost:3000` [ Client 2 ]

Both the browser tabs will start with last 10 lines of the log file provided and will stream the latest logs in real time.
