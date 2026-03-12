import { useState, useEffect } from "react";

export default function Navbar({ onLogin }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[72px] h-[68px] transition-all duration-300
      ${scrolled
        ? "bg-dark/90 backdrop-blur-xl border-b border-border"
        : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-[38px] h-[38px] rounded-[10px] bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_#1A73E880]">
          <span className="font-display font-extrabold text-[15px] text-white">SS</span>
        </div>
        <span className="font-display font-extrabold text-xl text-textPrim tracking-tight">
          SpeakSync
        </span>
      </div>

      {/* Nav links */}
      <div className="flex gap-9 items-center">
        {["Features", "How It Works", "Pricing", "About"].map(l => (
          <a key={l} className="nav-link" href={`#${l.toLowerCase().replace(/ /g, "-")}`}>{l}</a>
        ))}
      </div>

      {/* CTA */}
      <div className="flex gap-3 items-center">
        <button className="btn-outline px-5 py-2 text-sm" onClick={onLogin}>
          Sign In
        </button>
        <button className="btn-primary px-[22px] py-2 text-sm" onClick={onLogin}>
          Get Started Free
        </button>
      </div>
    </nav>
  );
}