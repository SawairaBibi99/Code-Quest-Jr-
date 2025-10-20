'use client';
import { useEffect, useState } from 'react';
import { getSocket } from '@/features/sessions/ws';
import { useSearchParams } from 'next/navigation';

type User = { id: string; name: string };

export default function Room({ params }: { params: { id: string } }) {
  const [users, setUsers] = useState<User[]>([]);
  const [driverId, setDriverId] = useState<string | null>(null);
  const sp = useSearchParams();
  const displayName = sp.get('name') || `Player-${Math.floor(Math.random()*1000)}`;

  useEffect(() => {
    const s = getSocket();
    s.emit('room:join', { roomId: params.id, name: displayName });
    const onPresence = (p: { users: User[]; driverId: string | null }) => { setUsers(p.users); setDriverId(p.driverId); };
    const onRole = (p: { driverId: string | null }) => setDriverId(p.driverId);
    s.on('presence:update', onPresence);
    s.on('role:update', onRole);
    return () => {
      s.emit('room:leave', { roomId: params.id });
      s.off('presence:update', onPresence);
      s.off('role:update', onRole);
    };
  }, [params.id, displayName]);

  return (
    <div className="card">
      <h2 className="text-2xl font-[Baloo 2]">Room {params.id}</h2>
      <p className="mt-2">You are <b>{displayName}</b></p>
      <div className="mt-4 flex gap-3 flex-wrap">
        {users.map(u => (
          <div key={u.id} className={`px-3 py-2 rounded-xl ${u.id===driverId ? 'bg-jelly-400 text-white' : 'bg-bubble-100'}`}>
            {u.name} {u.id===driverId ? '👑 Driver' : '🧭 Navigator'}
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-600 mt-4">Driver swaps automatically every 90s.</p>
    </div>
  );
}
