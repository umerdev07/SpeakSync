import { useState, useEffect } from "react";
import { C, DISPLAY, BODY } from "../../../constants/theme";
import { SLOGANS, PILLS } from "./LoginTheme";


export default function SloganPanel({ mounted }) {
  const [idx, setIdx]         = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % SLOGANS.length); setVisible(true); }, 500);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  const jump = (i) => {
    setVisible(false);
    setTimeout(() => { setIdx(i); setVisible(true); }, 300);
  };

  const s = SLOGANS[idx];

  return (
    <div
      className="w-1/2 min-h-screen flex flex-col items-center justify-center px-[72px] py-16 relative overflow-hidden"
      style={{ background:`radial-gradient(ellipse 100% 80% at 70% 30%, #061428 0%, ${C.dark} 70%)` }}
    >
      {/* ambient orbs */}
      <div className="absolute -top-[120px] -right-[80px] w-[500px] h-[500px] rounded-full pointer-events-none animate-pulseGlow"
        style={{ background:`radial-gradient(circle,${C.primary}18 0%,transparent 70%)` }} />
      <div className="absolute -bottom-[80px] -left-[60px] w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background:`radial-gradient(circle,${C.accent}12 0%,transparent 70%)`, animation:"pulseGlow 4s ease-in-out 1.5s infinite" }} />
      <div className="absolute top-[40%] right-[5%] w-[200px] h-[200px] rounded-full pointer-events-none"
        style={{ background:`radial-gradient(circle,${C.accent}10 0%,transparent 70%)`, animation:"pulseGlow 4s ease-in-out 3s infinite" }} />

      {/* dot grid */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage:"radial-gradient(#E6EDF3 1px,transparent 1px)", backgroundSize:"28px 28px" }} />

      {/* diagonal lines */}
      {[...Array(5)].map((_,i) => (
        <div key={i} className="absolute left-[-5%] w-[110%] h-px pointer-events-none"
          style={{
            top:`${8+i*22}%`,
            background:`linear-gradient(90deg,transparent,${C.primary}${6+i*4},transparent)`,
            transform:`rotate(-${1+i*1.5}deg)`,
          }} />
      ))}

      {/* left vertical glow line */}
      <div className="absolute left-0 top-[15%] bottom-[15%] w-px"
        style={{ background:`linear-gradient(180deg,transparent,${C.primary}40,${C.accent}30,transparent)` }} />

      {/* content */}
      <div className="relative z-10 w-full max-w-[440px]">

        {/* animated icon */}
        <div
          className="w-[68px] h-[68px] rounded-[20px] mb-9 flex items-center justify-center text-[30px] transition-all duration-500"
          style={{
            background: `linear-gradient(135deg,${C.primary}20,${C.accent}15)`,
            border:     `1px solid ${C.primary}35`,
            boxShadow:  `0 8px 32px ${C.primary}25, inset 0 1px 0 rgba(255,255,255,.08)`,
            opacity:    visible ? 1 : 0,
            transform:  visible ? "translateY(0) scale(1)" : "translateY(14px) scale(0.88)",
          }}
        >
          {s.icon}
        </div>

        {/* tag badge */}
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 mb-5 transition-all duration-500"
          style={{
            background: `${C.primary}15`,
            border:     `1px solid ${C.primary}35`,
            opacity:    visible ? 1 : 0,
            transform:  visible ? "translateY(0)" : "translateY(10px)",
            transitionDelay: "0.05s",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulseGlow"
            style={{ background:C.accent, boxShadow:`0 0 6px ${C.accent}` }} />
          <span className="text-[12px] font-semibold tracking-[.06em] uppercase"
            style={{ fontFamily:BODY, color:C.accent }}>
            {s.tag}
          </span>
        </div>

        {/* headline */}
        <h2
          className="font-extrabold leading-[1.18] tracking-[-1.2px] mb-[18px] transition-all duration-500"
          style={{
            fontFamily:DISPLAY,
            fontSize:"clamp(30px,3vw,48px)",
            opacity:   visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(18px)",
            transitionDelay: "0.1s",
          }}
        >
          <span style={{ color:C.textPrim }}>{s.line1}</span>
          <br/>
          <span style={{
            background:`linear-gradient(135deg,${C.primary},${C.accent})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>
            {s.line2}
          </span>
        </h2>

        {/* sub */}
        <p
          className="text-base leading-[1.8] mb-9 transition-all duration-500"
          style={{
            fontFamily:BODY, color:C.textSec,
            opacity:   visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transitionDelay: "0.15s",
          }}
        >
          {s.sub}
        </p>

        {/* dot indicators */}
        <div
          className="flex items-center gap-2 mb-[52px] transition-opacity duration-400"
          style={{ opacity: visible ? 1 : 0, transitionDelay:"0.2s" }}
        >
          {SLOGANS.map((_,i) => (
            <button key={i} onClick={() => jump(i)}
              className="h-1 rounded-full border-none cursor-pointer p-0 transition-all duration-400"
              style={{
                width:      i === idx ? "32px" : "8px",
                background: i === idx ? `linear-gradient(90deg,${C.primary},${C.accent})` : C.border,
                boxShadow:  i === idx ? `0 0 8px ${C.primary}60` : "none",
              }}
            />
          ))}
        </div>

        {/* divider */}
        <div
          className="h-px mb-7 transition-opacity duration-700"
          style={{
            background:`linear-gradient(90deg,${C.primary}30,${C.accent}20,transparent)`,
            opacity: mounted ? 1 : 0,
            transitionDelay:"0.5s",
          }}
        />

        {/* pills grid */}
        <div
          className="grid grid-cols-2 gap-2.5 transition-all duration-700"
          style={{
            opacity:   mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transitionDelay:"0.55s",
          }}
        >
          {PILLS.map((p,i) => <Pill key={i} icon={p.icon} label={p.label} />)}
        </div>

        {/* decorative quote */}
        <div
          className="mt-12 leading-none select-none pointer-events-none"
          style={{
            fontFamily:DISPLAY, fontSize:"120px", fontWeight:800,
            color:`${C.primary}08`, letterSpacing:"-8px",
          }}
        >
          "
        </div>
      </div>
    </div>
  );
}

function Pill({ icon, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 cursor-default transition-all duration-200"
      style={{
        background: hovered ? `${C.primary}15` : `${C.primary}08`,
        border:     `1px solid ${hovered ? `${C.primary}45` : C.border}`,
        color:      hovered ? C.textPrim : C.textSec,
        boxShadow:  hovered ? `0 4px 16px ${C.primary}18` : "none",
        transform:  hovered ? "translateY(-1px)" : "translateY(0)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize:   "12.5px", fontWeight:500,
      }}
    >
      <span
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] shrink-0"
        style={{ background:`${C.primary}15`, border:`1px solid ${C.primary}25` }}
      >
        {icon}
      </span>
      {label}
    </div>
  );
}