const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const expressWs = require("express-ws");

const app = express();
const appWS = expressWs(app);

const PORT = parseInt(process.env.PORT) || 3000;

const ROOM = {}

app.use(morgan("combined"));
app.use(cors());

app.ws("/chat", (ws, req) => {
    const name = req.query.name;
    console.log(`New websocket connection: ${name}`);
    // add web socket connection to the room
    ws.participantName = name;
    // JSON.parse / JSON.stringify?
    // ws.send({
    //     from: name,
    //     message: "has joined the room!",
    //     timestamp: new Date()
    //   })
    ROOM[name] = ws;

    // setup
    ws.on("message", (payload) => {
        console.log('payload', payload)
        const chat = JSON.stringify({
            from: name,
            message: payload,
            timestamp: (new Date()).toString()
        })
        // broadcast to everyone in the ROOM
        for (let p in ROOM) {
            ROOM[p].send(chat)
        }
    });

    ws.on("close", () => {
        console.log(`Closing websocket connection for ${name}`);
        // close our end of connection
        ROOM[name].close();
        // remove ourselves from the room
        delete ROOM[name];
    });

    
});

app.listen(PORT, () => {
    console.log(`Application started on port: ${PORT} at ${new Date()}`);
});
