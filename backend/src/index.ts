import express, { Request, Response } from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
const app = express();
import cors from "cors";

const port = 8080;
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

//Store room and their connection
const rooms: Record<string, Map<WebSocket, string>> = {};

wss.on("connection", (ws) => {
  console.log("New Client Connected");

  let roomId: string;
  let userName: string;
  ws.on("error", () => {
    console.error();
  });

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());

    if (data.type === "join") {
      roomId = data.roomId;
      userName = data.userName;

      if (!rooms[roomId]) {
        rooms[roomId] = new Map();
      }
      rooms[roomId].set(ws, userName);

      rooms[roomId].forEach((name, client) => {
        if (client.readyState === ws.OPEN) {
          client.send(
            JSON.stringify({
              type: "notification",
              text: `${userName} has joined the room`,
              size: rooms[roomId].size,
            }),
          );
        }
      });
    } else if (data.type === "message") {
      const roomId = data.roomId;
      if (roomId && rooms[roomId]) {
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === ws.OPEN) {
            client.send(
              JSON.stringify({
                type: "message",
                text: data.text,
                sender: userName,
              }),
            );
          }
        });
      }
    }
  });
  ws.on("close", () => {
    if (roomId && rooms[roomId]) {
      const userName = rooms[roomId].get(ws);

      const roomSizeBeforeRemoval = rooms[roomId].size;

      rooms[roomId].delete(ws);

      rooms[roomId].forEach((name, client) => {
        if (client.readyState === ws.OPEN) {
          client.send(
            JSON.stringify({
              type: "notification",
              text: `${userName} has left the room`,
              size: rooms[roomId].size,
            }),
          );
        }
      });

      if (ws.readyState === ws.OPEN) {
        ws.send(
          JSON.stringify({
            type: "notification",
            text: `${userName} left the room`,
            size: rooms[roomId].size,
          }),
        );
      }

      if (roomSizeBeforeRemoval === 1) {
        delete rooms[roomId];
        console.log(`Room deleted: ${roomId}`);
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Server is connected at Port:${port}`);
});
