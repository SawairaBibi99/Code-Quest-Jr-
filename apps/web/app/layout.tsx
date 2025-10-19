import './globals.css';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-[Inter] text-slate-800">
        <header className="p-4 flex items-center justify-between">
          <div className="text-3xl font-[Baloo 2] text-jelly-600">🍓 CodeQuest Jr</div>
          <nav className="flex gap-3">
            <a className="badge" href="/">Play</a>
            <a className="badge" href="/class">Class</a>
            <a className="badge" href="/builder">Builder</a>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
