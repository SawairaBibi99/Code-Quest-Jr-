'use client';
import { useState } from 'react';
import { getHint } from '@/features/hints/api';

export default function HintToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <div className="mt-3">
      <button
        className="btn-bouncy"
        onClick={async () => {
          setLoading(true);
          try { const r = await getHint('Move robot to star using a loop'); setMsg(r.hint); }
          finally { setLoading(false); }
        }}
      >
        {loading ? 'Thinking…' : 'Hint 💡'}
      </button>
      {msg && <div className="mt-3 p-3 rounded-xl bg-slate-900 text-white">{msg}</div>}
    </div>
  );
}
