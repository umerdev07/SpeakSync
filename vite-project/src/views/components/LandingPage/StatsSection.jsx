import { useVisible } from "../../../hooks/useVisible";

const stats = [
  { num:"< 2s",    label:"Translation Latency", icon:"⚡" },
  { num:"99%",     label:"System Uptime",        icon:"🟢" },
  { num:"2",       label:"Languages Supported",  icon:"🌐" },
  { num:"256-bit", label:"AES Encryption",       icon:"🔒" },
];

export default function StatsSection() {
  const [ref, visible] = useVisible();

  return (
    <section className="py-[72px] px-[72px] bg-darkCard border-t border-b border-border" ref={ref}>
      <div className="grid grid-cols-4 gap-5 max-w-[1000px] mx-auto">
        {stats.map((s, i) => (
          <div key={i} className={`stat-card fade-up ${visible ? "visible" : ""}`}
            style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="text-[28px] mb-2.5">{s.icon}</div>
            <div className="font-display font-extrabold text-primary mb-1.5 text-[clamp(28px,3vw,40px)]">{s.num}</div>
            <div className="font-body text-sm text-textSec">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}