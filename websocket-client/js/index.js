import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io("http://localhost:4000")
socket.on("name", data => {
    console.log(data)
})