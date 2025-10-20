// apps/api/src/app.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { WsGateway } from './websocket.gateway';

// --- add this near the top ---
type RoomState = {
  users: Record<string, { id: string; name: string }>;
  driverId: string | null;
  interval?: NodeJS.Timeout;
};
const rooms = new Map<string, RoomState>();
// ------------------------------

@Module({
  providers: [WsGateway],
})
export class AppModule implements OnModuleInit {
  private io!: Server;

  async onModuleInit() {
    const pub = createClient({ url: process.env.REDIS_URL });
    const sub = pub.duplicate();
    await Promise.all([pub.connect(), sub.connect()]);

    this.io = new Server({
      cors: {
        origin: ['http://localhost:3000'], // frontend URL
        credentials: true,
      },
      path: '/socket.io',
    });

    // @ts-ignore – redis adapter expects redis v3 types
    this.io.adapter(createAdapter(pub as any, sub as any));

    // Start listening for socket connections
    this.io.listen(4010);
    console.log('✅ WebSocket server running on ws://localhost:4010/socket.io');

    // --- PLACE THIS ENTIRE BLOCK BELOW io.listen() ---
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // join with a displayName for presence
      socket.on('room:join', ({ roomId, name }: { roomId: string; name: string }) => {
        socket.join(roomId);
        const r = rooms.get(roomId) ?? { users: {}, driverId: null };
        r.users[socket.id] = { id: socket.id, name: name?.slice(0, 24) || 'Player' };
        if (!r.driverId) r.driverId = socket.id; // first joiner is driver
        rooms.set(roomId, r);
        this.io
          .to(roomId)
          .emit('presence:update', { users: Object.values(r.users), driverId: r.driverId });

        // rotation timer every 90s
        if (!r.interval) {
          r.interval = setInterval(() => {
            const ids = Object.keys(r.users);
            if (ids.length === 0) return;
            const idx = Math.max(0, ids.indexOf(r.driverId || ids[0]));
            r.driverId = ids[(idx + 1) % ids.length];
            this.io.to(roomId).emit('role:update', { driverId: r.driverId });
          }, 90_000);
        }
      });

      socket.on('room:leave', ({ roomId }) => {
        socket.leave(roomId);
        const r = rooms.get(roomId);
        if (!r) return;
        delete r.users[socket.id];
        if (r.driverId === socket.id) {
          const ids = Object.keys(r.users);
          r.driverId = ids[0] ?? null;
          this.io.to(roomId).emit('role:update', { driverId: r.driverId });
        }
        this.io
          .to(roomId)
          .emit('presence:update', { users: Object.values(r.users), driverId: r.driverId });
        if (Object.keys(r.users).length === 0) {
          if (r.interval) clearInterval(r.interval);
          rooms.delete(roomId);
        }
      });

      socket.on('disconnect', () => {
        for (const roomId of socket.rooms) {
          if (roomId === socket.id) continue;
          const r = rooms.get(roomId);
          if (!r) continue;
          delete r.users[socket.id];
          if (r.driverId === socket.id) {
            const ids = Object.keys(r.users);
            r.driverId = ids[0] ?? null;
            this.io.to(roomId).emit('role:update', { driverId: r.driverId });
          }
          this.io
            .to(roomId)
            .emit('presence:update', { users: Object.values(r.users), driverId: r.driverId });
          if (Object.keys(r.users).length === 0) {
            if (r.interval) clearInterval(r.interval);
            rooms.delete(roomId);
          }
        }
      });

      // existing events
      socket.on('blocks:update', ({ roomId, patch }) =>
        socket.to(roomId).emit('blocks:patch', patch),
      );
      socket.on('cursor', ({ roomId, cursor }) =>
        socket.to(roomId).emit('cursor', cursor),
      );
      socket.on('run', ({ roomId }) => socket.to(roomId).emit('run'));
    });
  }
}
