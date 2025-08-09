type Props = { children: React.ReactNode; className?: string };

export default function PageShell({ children, className = '' }: Props) {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1200px_900px_at_20%_-10%,#f1f5f9_0%,transparent_60%),radial-gradient(1200px_800px_at_120%_10%,#e0f2fe_0%,transparent_55%)]">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both }
        @media (prefers-reduced-motion: reduce) { .fade-up { animation: none } }
      `}</style>
      <main className="min-h-screen flex items-start md:items-center justify-center px-4 py-10">
        <div
          className={`fade-up w-full max-w-[520px] md:max-w-[640px] rounded-3xl bg-white/75 backdrop-blur-md border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-6 md:p-10 ${className}`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
