export default function Card({ children }: { children: React.ReactNode }) {
  return <div className="p-6 rounded-2xl bg-white/90 backdrop-blur shadow">{children}</div>;
}
