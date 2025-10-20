export async function getHint(goal: string, last_error?: string) {
  const base = process.env.NEXT_PUBLIC_AI_BASE!;
  const res = await fetch(`${base}/ai/hint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal, last_error, skill: { loops: 0.2, conditionals: 0.1 } })
  });
  if (!res.ok) throw new Error('AI hint failed');
  return res.json() as Promise<{ hint: string }>;
}
