import { createServer } from "http"
import { Server } from "socket.io"
import next from "next"

const port = process.env.PORT || 3000;
const dev = true
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(handle)
  const io = new Server(server)

  io.on("connection", (socket) => {
    console.log("Client connected", socket.id)

    socket.on("patient-update", (data) => {
      io.emit("patient-update", data)
    })

    // เมื่อคนไข้กด Submit
    socket.on("patient-submit", (data) => {
      io.emit("patient-submit", data)
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected")
    })
  })

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})
