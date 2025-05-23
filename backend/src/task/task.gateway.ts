import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class TaskGateway {
  @WebSocketServer()
  server: Server;

  emitTaskUpdate(todoAppId: string, payload: any) {
    this.server.to(todoAppId).emit('taskUpdate', payload);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() todoAppId: string, @ConnectedSocket() client: Socket) {
    client.join(todoAppId);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() todoAppId: string, @ConnectedSocket() client: Socket) {
    client.leave(todoAppId);
  }
}
