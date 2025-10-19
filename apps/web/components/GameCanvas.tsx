'use client';
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
export default function GameCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 640, height: 480,
      parent: ref.current,
      backgroundColor: '#e0f2fe',
      scene: {
        create() {
          const text = this.add.text(50, 50, 'Guide the robot to the star! ⭐', { fontFamily: 'Baloo 2', fontSize: '24px', color: '#0ea5e9' });
          const robot = this.add.rectangle(80, 200, 40, 40, 0x22c55e).setOrigin(0.5);
          const star = this.add.star(560, 200, 5, 10, 20, 0xf97316);
          this.tweens.add({ targets: star, angle: 360, duration: 3000, repeat: -1 });
        }
      }
    };
    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);
  return <div ref={ref} className="w-full" />;
}
