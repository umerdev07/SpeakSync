import { useVisible } from "../../../hooks/useVisible";

export default function CTASection({ onLogin }) {
  const [ref, visible] = useVisible();

  return (
    <section className="py-[100px] px-[72px] bg-dark" ref={ref}>
      <div className={`fade-up ${visible ? "visible" : ""} max-w-[800px] mx-auto text-center border border-border rounded-[24px] p-[64px_48px] relative overflow-hidden`}
        style={{
          background: "linear-gradient(135deg, #161B22, #0e1318)",
          boxShadow: "0 20px 60px rgba(0,0,0,.5)",
        }}>
        {/* Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, #1A73E818 0%, transparent 65%)" }} />

        <span className="font-body text-[13px] font-semibold tracking-[.1em] uppercase text-accent block mb-4 relative z-10">
          Ready to Start?
        </span>
        <h2 className="font-display font-extrabold tracking-[-1px] mb-4 relative z-10 text-[clamp(28px,4vw,48px)]">
          Start Your First<br />
          <span className="gradient-text">Cross-Language Call</span>
        </h2>
        <p className="font-body text-[17px] text-textSec mb-9 leading-[1.7] relative z-10">
          No downloads, no setup, no language barrier. Just click and start talking.
        </p>
        <div className="flex gap-3.5 justify-center relative z-10">
          <button className="btn-primary px-9 py-3.5 text-base rounded-[10px]" onClick={onLogin}>
            Create Free Account →
          </button>
          <button className="btn-outline px-7 py-3.5 text-[15px] rounded-[10px]">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}