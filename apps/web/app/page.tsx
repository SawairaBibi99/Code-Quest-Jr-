'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
export default function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card">
        <h2 className="text-2xl font-[Baloo 2] mb-2">Adventure Mode</h2>
        <p>Solve fun puzzles and earn badges!</p>
        <Link href="/play" className="btn-bouncy inline-block mt-4">Start Quest ▶</Link>
      </motion.div>
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card">
        <h2 className="text-2xl font-[Baloo 2] mb-2">Join Friends</h2>
        <p>Play together in a shared room with live help.</p>
        <Link href="/room/demo" className="btn-bouncy inline-block mt-4">Join Demo Room</Link>
      </motion.div>
    </div>
  );
}
