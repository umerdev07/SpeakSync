import { useVisible } from "../../../hooks/useVisible";

const stack = [
  { name:"React.js",   role:"Frontend UI",         color:"#1A73E8" },
  { name:"Node.js",    role:"Backend Server",       color:"#539e43" },
  { name:"Socket.io",  role:"Real-Time Comms",      color:"#00BFA5" },
  { name:"WebRTC",     role:"Video Streaming",      color:"#FF6B35" },
  { name:"FastAPI",    role:"AI Translation Layer", color:"#009688" },
  { name:"Supabase",   role:"Auth & Database",      color:"#3ECF8E" },
  { name:"Python LLM", role:"NLP Fine-Tuning",      color:"#FFD43B" },
  { name:"Express.js", role:"REST API",             color:"#68A063" },
];

export default function TechSection() {
  const [ref, visible] = useVisible();

  return (
    <section className="py-20 px-[72px] bg-darkCard border-t border-border" ref={ref}>
      <div className={`fade-up ${visible ? "visible" : ""} text-center mb-12`}>
        <span className="font-body text-[13px] font-semibold tracking-[.1em] uppercase text-primary block mb-3">
          Tech Stack
        </span>
        <h2 className="font-display font-extrabold tracking-[-0.8px] text-[clamp(28px,3.5vw,44px)]">
          Built on <span className="gradient-text">Modern Technology</span>
        </h2>
      </div>

      <div className="flex flex-wrap gap-3 justify-center max-w-[900px] mx-auto">
        {stack.map((t, i) => (
          <div key={i}
            className={`fade-up ${visible ? "visible" : ""} bg-cardInner rounded-xl px-6 py-4 flex flex-col items-center gap-1.5 min-w-[120px] transition-all duration-200 cursor-default hover:-translate-y-1`}
            style={{
              border: `1px solid ${t.color}30`,
              animationDelay: `${i * 0.07}s`,
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${t.color}80`}
            onMouseLeave={e => e.currentTarget.style.borderColor = `${t.color}30`}
          >
            <span className="font-display text-[15px] font-bold" style={{ color: t.color }}>{t.name}</span>
            <span className="font-body text-[11.5px] text-textSec">{t.role}</span>
          </div>
        ))}
      </div>
    </section>
  );
}