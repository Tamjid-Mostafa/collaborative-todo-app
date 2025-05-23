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

export const useMultipleSocketRooms = (
  roomIds: string[],
  eventHandlers: { [event: string]: (...args: any[]) => void }
) => {
  useEffect(() => {
    const s = getSocket();

    // Join all rooms
    roomIds.forEach((roomId) => {
      s.emit("joinRoom", roomId);
    });

    // Register all event handlers
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      s.on(event, handler);
    });

    return () => {
      // Leave all rooms
      roomIds.forEach((roomId) => {
        s.emit("leaveRoom", roomId);
      });

      // Remove all handlers
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        s.off(event, handler);
      });
    };
  }, [JSON.stringify(roomIds), ...Object.values(eventHandlers)]);
};
