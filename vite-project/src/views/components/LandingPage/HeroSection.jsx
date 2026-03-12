const bars = [8,20,36,16,48,28,56,36,24,44,32,52,20,40,28,52,36,24,48,16,44,28,56,20,36,48,24,40];

export default function HeroSection({ onLogin }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-[72px] pt-[120px] pb-20 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, #0c1f4a 0%, #0D1117 65%)" }}>

      {/* Glow ring */}
      <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #1A73E812 0%, transparent 65%)" }} />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(#E6EDF3 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Diagonal lines */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="absolute left-[-5%] w-[110%] h-px pointer-events-none"
          style={{
            top: `${20 + i * 25}%`,
            background: `linear-gradient(90deg, transparent, #1A73E8${12 + i * 6}, transparent)`,
            transform: `rotate(-${3 + i * 2}deg)`,
          }} />
      ))}

      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/40 rounded-full px-4 py-1.5 mb-7 animate-fadeUp">
        <span className="w-[7px] h-[7px] rounded-full bg-accent animate-pulseGlow"
          style={{ boxShadow: "0 0 8px #00BFA5" }} />
        <span className="font-body text-[13px] font-medium text-accent">
          Real-Time English ↔ Urdu Translation
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-display font-extrabold text-center leading-[1.1] tracking-[-1.5px] max-w-[900px] animate-fadeUp text-[clamp(42px,6vw,80px)]"
        style={{ animationDelay: "0.1s" }}>
        Break Every
        <span className="gradient-text"> Language </span>
        <br />Barrier in Real Time
      </h1>

      {/* Subheading */}
      <p className="font-body text-textSec text-center max-w-[580px] leading-[1.7] mt-6 animate-fadeUp text-[clamp(15px,1.6vw,19px)]"
        style={{ animationDelay: "0.2s" }}>
        SpeakSync translates your voice live during video calls.
        Speak English, be heard in Urdu — and vice versa — with
        AI-powered speech-to-speech translation.
      </p>

      {/* CTA row */}
      <div className="flex gap-3.5 mt-10 animate-fadeUp" style={{ animationDelay: "0.3s" }}>
        <button className="btn-primary px-8 py-3.5 text-base rounded-[10px]" onClick={onLogin}>
          Start a Free Call →
        </button>
        <button className="btn-outline px-7 py-3.5 text-[15px] rounded-[10px] flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">▶</span>
          Watch Demo
        </button>
      </div>

      {/* Trust line */}
      <p className="font-body text-[13px] text-[#4A5568] mt-5 animate-fadeUp" style={{ animationDelay: "0.4s" }}>
        No credit card required · Free during beta · FYP Project
      </p>

      {/* Floating card */}
      <div className="mt-16 w-full max-w-[700px] animate-fadeUp" style={{ animationDelay: "0.5s" }}>
        <div className="bg-darkCard border border-border rounded-[20px] p-8 animate-heroFloat"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,.6), 0 0 0 1px #1A73E815" }}>

          {/* Mock call bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-success" style={{ boxShadow: "0 0 8px #43A047" }} />
              <span className="font-body text-[13px] text-textSec">Live Call Active</span>
            </div>
            <div className="flex gap-1.5">
              {["#E53935", "#F9A825", "#43A047"].map(c => (
                <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              ))}
            </div>
          </div>

          {/* Waveform */}
          <svg width="100%" height="56" viewBox="0 0 640 80" preserveAspectRatio="xMidYMid meet" fill="none">
            {bars.map((h, i) => (
              <rect key={i} x={i * 23 + 2} y={(80 - h) / 2} width="16" height={h} rx="4"
                fill={i % 3 === 0 ? "#1A73E8" : i % 3 === 1 ? "#00BFA5" : "#1A73E835"}
                style={{
                  opacity: 0.7 + (i % 4) * 0.08,
                  animation: `waveBar ${0.7 + (i % 5) * 0.2}s ease-in-out ${i * 0.05}s infinite alternate`,
                  transformOrigin: "center",
                }}
              />
            ))}
          </svg>

          {/* Translation bubbles */}
          <div className="flex gap-3 mt-5">
            <div className="flex-1 bg-primary/10 border border-primary/30 rounded-[10px] p-3">
              <p className="font-body text-[11px] text-textSec mb-1">🇺🇸 English (Original)</p>
              <p className="font-body text-[13px] text-textPrim">"Hello, can you hear me clearly?"</p>
            </div>
            <div className="flex items-center text-accent text-lg">⇄</div>
            <div className="flex-1 border border-accent/30 rounded-[10px] p-3" style={{ background: "#00BFA50D" }}>
              <p className="font-body text-[11px] text-textSec mb-1">🇵🇰 Urdu (Translated)</p>
              <p className="font-body text-[13px] text-accent">"ہیلو، کیا آپ مجھے صاف سن سکتے ہیں؟"</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}