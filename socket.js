const { Server } = require("socket.io")
let io;

module.exports = {
    init: httpServer => {
        io = new Server(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
    },
    getIo: () => {
        if (!io)
            throw new Error("Socket IO is not initialized")
        return io
    }
}