'use client';
import dynamic from 'next/dynamic';
import HintToast from '../../components/HintToast';
const GameCanvas = dynamic(() => import('../../components/GameCanvas'), { ssr: false });
const BlocklyPanel = dynamic(() => import('../../components/BlocklyPanel'), { ssr: false });
export default function Play() {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="card"><GameCanvas /></div>
      <div className="card">
        <BlocklyPanel />
        <HintToast />
      </div>
    </div>
  );
}
