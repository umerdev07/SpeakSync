import { useVisible } from "../../../hooks/useVisible";

const features = [
  { icon:"🎙️", title:"Voice-to-Voice Translation",
    desc:"Speak naturally in English or Urdu. Our AI captures, translates, and plays back in the listener's language in under 2 seconds.", accent:"#1A73E8" },
  { icon:"📹", title:"HD Video Conferencing",
    desc:"Crystal-clear video powered by WebRTC. Adapts to your network conditions so the conversation never drops.", accent:"#00BFA5" },
  { icon:"💬", title:"Live Translated Chat",
    desc:"Every text message is automatically translated for the other participant. No copy-paste, no confusion.", accent:"#9C27B0" },
  { icon:"🖥️", title:"Screen Sharing",
    desc:"Share your screen, a window, or a browser tab instantly — works alongside video, audio and translation simultaneously.", accent:"#FF9800" },
  { icon:"📅", title:"Meeting Scheduler",
    desc:"Book calls in advance, set date and time, invite participants by email, and get reminder notifications.", accent:"#43A047" },
  { icon:"🔒", title:"Secure & Encrypted",
    desc:"All audio, video, and chat data is encrypted end-to-end. JWT authentication protects every session.", accent:"#E91E63" },
];

export default function FeaturesSection() {
  const [ref, visible] = useVisible();

  return (
    <section id="features" className="py-[100px] px-[72px] bg-dark" ref={ref}>
      {/* Header */}
      <div className={`fade-up ${visible ? "visible" : ""} text-center mb-16`}>
        <span className="font-body text-[13px] font-semibold tracking-[.1em] uppercase text-primary block mb-3">
          Core Features
        </span>
        <h2 className="font-display font-extrabold tracking-[-1px] mb-4 text-[clamp(32px,4vw,52px)]">
          Everything You Need to<br />
          <span className="gradient-text">Communicate Without Limits</span>
        </h2>
        <p className="font-body text-[17px] text-textSec max-w-[520px] mx-auto leading-[1.7]">
          Six powerful features designed to make cross-language video calls feel completely natural.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-5 max-w-[1100px] mx-auto">
        {features.map((f, i) => (
          <div key={i}
            className={`feature-card fade-up ${visible ? "visible" : ""}`}
            style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-2xl mb-5"
              style={{ background: `${f.accent}18`, border: `1px solid ${f.accent}30` }}>
              {f.icon}
            </div>
            <h3 className="font-display text-[18px] font-bold text-textPrim mb-2.5">{f.title}</h3>
            <p className="font-body text-sm text-textSec leading-[1.7]">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}