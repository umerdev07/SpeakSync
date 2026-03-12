import { useVisible } from "../../../hooks/useVisible";

const steps = [
  { n:"01", title:"Create or Join a Meeting",
    desc:"Sign up, generate a unique meeting link, and share it with your participant. No software downloads needed.", icon:"🔗" },
  { n:"02", title:"Select Your Language",
    desc:"Each participant picks their preferred language — English or Urdu. SpeakSync handles the rest automatically.", icon:"🌐" },
  { n:"03", title:"Speak Naturally",
    desc:"Talk as you normally would. Your voice is captured, transcribed, and translated in real time by our AI engine.", icon:"🎙️" },
  { n:"04", title:"Hear the Translation",
    desc:"The translated audio plays to the other participant in their language within 2 seconds. No delays, no awkward pauses.", icon:"🔊" },
];

export default function HowItWorksSection() {
  const [ref, visible] = useVisible();

  return (
    <section id="how-it-works" className="py-[100px] px-[72px] bg-dark" ref={ref}>
      {/* Header */}
      <div className={`fade-up ${visible ? "visible" : ""} text-center mb-16`}>
        <span className="font-body text-[13px] font-semibold tracking-[.1em] uppercase text-accent block mb-3">
          How It Works
        </span>
        <h2 className="font-display font-extrabold tracking-[-1px] text-[clamp(30px,4vw,50px)]">
          Up and Running in <span className="gradient-text">4 Simple Steps</span>
        </h2>
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-4 gap-5 max-w-[1100px] mx-auto relative">
        {/* Connector line */}
        <div className="absolute top-11 left-[12.5%] right-[12.5%] h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, #1A73E850, #00BFA550, transparent)" }} />

        {steps.map((s, i) => (
          <div key={i} className={`step-card fade-up ${visible ? "visible" : ""}`}
            style={{ animationDelay: `${i * 0.12}s` }}>
            <div className="w-11 h-11 rounded-[12px] bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display font-extrabold text-sm text-white mb-5"
              style={{ boxShadow: "0 0 16px #1A73E840" }}>
              {s.n}
            </div>
            <div className="text-[28px] mb-3">{s.icon}</div>
            <h3 className="font-display text-[17px] font-bold text-textPrim mb-2.5 leading-[1.3]">{s.title}</h3>
            <p className="font-body text-[13.5px] text-textSec leading-[1.7]">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}