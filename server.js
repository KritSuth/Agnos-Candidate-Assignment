import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer);

  // Socket.io
  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);

    socket.on("patient-update", (data) => { socket.broadcast.emit("patient-update", data);
});
    socket.on("patient-submit", (data) => io.emit("patient-submit", data));

    socket.on("disconnect", () => console.log("Client disconnected"));
  });

  // Serve Next.js
  server.all("*", (req, res) => handle(req, res));

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => console.log(`Server running on port ${port}`));
});
