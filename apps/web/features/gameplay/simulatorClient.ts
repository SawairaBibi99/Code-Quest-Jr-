type Command = { op: 'move' | 'turn'; n?: number; dir?: 'L'|'R' };
export type SimWorld = { x: number; y: number; dir: 0|1|2|3; goal: {x:number;y:number} };

export function run(commands: Command[], world: SimWorld) {
  const w = { ...world };
  const forward = () => {
    if (w.dir === 0) w.y -= 1;
    if (w.dir === 1) w.x += 1;
    if (w.dir === 2) w.y += 1;
    if (w.dir === 3) w.x -= 1;
  };
  for (const c of commands) {
    if (c.op === 'turn') w.dir = ((w.dir + (c.dir === 'R' ? 1 : 3)) % 4) as 0|1|2|3;
    if (c.op === 'move') for (let i=0;i<(c.n ?? 1);i++) forward();
  }
  const success = (w.x === w.goal.x && w.y === w.goal.y);
  return { world: w, success };
}
