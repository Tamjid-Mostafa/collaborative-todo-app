import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
    });
  }
  return socket;
};

export const useSocketRoom = (roomId: string, onUpdate: () => void) => {
  useEffect(() => {
    const s = getSocket();

    s.emit("joinRoom", roomId);
    s.on("taskUpdate", onUpdate);

    return () => {
      s.emit("leaveRoom", roomId);
      s.off("taskUpdate", onUpdate);
    };
  }, [roomId, onUpdate]);
};
