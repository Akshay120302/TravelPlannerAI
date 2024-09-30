import { Server } from "socket.io";

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://172.16.2.56:8888', 'http://localhost:8888', 'https://travelplannerai.onrender.com'],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on("joinTrip", (tripId, userId) => {
      console.log(`User ${userId} joined trip ${tripId}`);
      socket.join(tripId); // Join a specific trip room
      io.to(tripId).emit("userJoined", { userId, tripId });
    });

    socket.on("sendMessage", (messageData) => {
      const { tripId, message, userId } = messageData;
      io.to(tripId).emit("receiveMessage", { userId, message });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
