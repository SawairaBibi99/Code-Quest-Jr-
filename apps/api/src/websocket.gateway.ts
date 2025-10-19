import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' }, path: '/socket.io' })
export class WsGateway {
  @SubscribeMessage('room:join')
  handleJoin(@MessageBody() roomId: string, @ConnectedSocket() socket: Socket) {
    socket.join(roomId);
  }
  @SubscribeMessage('blocks:update')
  relayBlocks(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    socket.to(data.roomId).emit('blocks:patch', data.patch);
  }
}
