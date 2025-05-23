import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // Or your deployed backend URL

socket.on("connect", () => {
  console.log("Connected to socket server", socket.id);
});

socket.emit("events", { title: "My task" });

socket.on("events", (data) => {
  console.log("Received real-time update", data);
});
