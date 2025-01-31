import express, { Request, Response } from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
const app = express();

const port = 8080;

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

//Store room and their connection
const rooms: Record<string, Set<WebSocket>> = {};

wss.on("connection", (ws) => {
  console.log("New Client Connected");

  let roomId: string;

  ws.on("error", () => {
    console.error();
  });

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());

    if (data.type === "join") {
      roomId = data.roomId;

      if (!rooms[roomId]) {
        rooms[roomId] = new Set();
      }
      rooms[roomId].add(ws);
      ws.send(`User joined room: ${roomId}`);
      ws.send(`Room size: ${rooms[roomId].size}`);
    } else if (data.type === "message") {
      if (rooms[roomId]) {
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === ws.OPEN) {
            client.send(JSON.stringify({ type: "message", text: data.text }));
          }
        });
      }
    }
  });
  ws.on("close", () => {
    if (roomId && rooms[roomId]) {
      rooms[roomId].delete(ws);
      ws.send(`User left the room: ${roomId}`);
    }

    if (rooms[roomId].size === 0) {
      delete rooms[roomId];
      ws.send(`Room deleted: ${roomId}`);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is connected at Port:${port}`);
});
