import express from "express";
import { Server } from "socket.io";
import { createServer } from 'http';
const port = 3110;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    console.log(`User Connected with Id: ${socket.id}`);

    // socket.on("message",(message)=>{
    //     console.log(message);
    // })

    socket.on("message", data => {
        io.to(data.room).emit("receive_msg", data);
    })


    socket.on("join_room", room => {
        socket.join(room)
        console.log("joined in room ", room);
    })

    socket.on("disconnect", () => {
        console.log("User Disconnected");
        socket.broadcast.emit('notify', 'Someone Existed from socket');
    })
})




server.listen(port, () => {
    console.log(`Server Running on ${port}`);
})
