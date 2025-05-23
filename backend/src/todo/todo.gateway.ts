import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class TodoGateway {
  @WebSocketServer()
  server: Server;

  emitTodoUpdate(todoAppId: string, payload: any) {
    this.server.to(todoAppId).emit('todoUpdate', payload);
  }

  emitCollaboratorUpdate(userId: string, payload: any) {
    this.server.to(userId).emit('collaboratorUpdate', payload);
  }
  emitTodoDeleted(userIds: string[], todoId: string) {
    userIds.forEach(userId => {
      this.server.to(userId).emit('todoDeleted', { todoId });
    });
  }  
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() todoAppId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(todoAppId);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() todoAppId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(todoAppId);
  }
}
