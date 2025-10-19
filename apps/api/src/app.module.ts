import { Module, OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { WsGateway } from './websocket.gateway';

@Module({ providers: [WsGateway] })
export class AppModule implements OnModuleInit {
  private io!: Server;
  async onModuleInit() {
    const pub = createClient({ url: process.env.REDIS_URL });
    const sub = pub.duplicate();
    await Promise.all([pub.connect(), sub.connect()]);
    this.io = new Server({ cors: { origin: '*' }, path: '/socket.io' });
    // @ts-ignore
    this.io.adapter(createAdapter(pub as any, sub as any));
    this.io.on('connection', (socket) => {
      socket.on('room:join', (roomId: string) => socket.join(roomId));
      socket.on('blocks:update', ({ roomId, patch }) => socket.to(roomId).emit('blocks:patch', patch));
      socket.on('cursor', ({ roomId, cursor }) => socket.to(roomId).emit('cursor', cursor));
      socket.on('run', ({ roomId }) => socket.to(roomId).emit('run'));
    });
    this.io.listen(4010);
  }
}
