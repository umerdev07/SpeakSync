// ── Shared UI atoms used across Dashboard components ──────────────────────

export const Avatar = ({ initials, size = 38, color = "#1A73E8" }) => (
  <div
    className="flex items-center justify-center rounded-full flex-shrink-0 font-bold"
    style={{
      width: size, height: size,
      background: `linear-gradient(135deg, ${color}55, ${color}22)`,
      border: `1.5px solid ${color}55`,
      fontSize: size * 0.35, color,
      fontFamily: "'Syne', sans-serif",
    }}
  >
    {initials}
  </div>
);

export const Badge = ({ children, color = "#00BFA5" }) => (
  <span
    className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap tracking-wide"
    style={{
      background: `${color}22`, color,
      border: `1px solid ${color}44`,
      fontFamily: "'DM Sans', sans-serif",
    }}
  >
    {children}
  </span>
);

export const Pill = ({ icon, label }) => (
  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px]"
    style={{
      background: "rgba(255,255,255,0.04)",
      borderColor: "#30363D", color: "#8B949E",
      fontFamily: "'DM Sans', sans-serif",
    }}
  >
    <span>{icon}</span>{label}
  </div>
);

export const Toast = ({ msg, visible }) => (
  <div
    className="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-xl text-[13px] font-semibold pointer-events-none z-[9999] whitespace-nowrap transition-all duration-300"
    style={{
      background: "#00BFA5", color: "#0D1117",
      boxShadow: "0 8px 32px #00BFA555",
      opacity: visible ? 1 : 0,
      transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
      fontFamily: "'DM Sans', sans-serif",
    }}
  >
    ✓ {msg}
  </div>
);

export const SectionTitle = ({ icon, title, sub }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2.5 mb-1">
      <span className="text-lg">{icon}</span>
      <h2 className="text-[17px] font-bold m-0" style={{ fontFamily: "'Syne', sans-serif", color: "#E6EDF3" }}>
        {title}
      </h2>
    </div>
    {sub && (
      <p className="text-[12px] m-0 pl-7" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
        {sub}
      </p>
    )}
  </div>
);

export const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl p-6 border ${className}`}
    style={{ background: "#161B22", borderColor: "#30363D" }}
  >
    {children}
  </div>
);

export const PrimaryBtn = ({ children, onClick, className = "", outline = false, color = "#1A73E8" }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl font-bold text-[13px] tracking-wide transition-opacity hover:opacity-85 cursor-pointer whitespace-nowrap ${className}`}
    style={{
      fontFamily: "'Syne', sans-serif",
      background: outline ? "transparent" : color,
      color: outline ? color : "#fff",
      border: outline ? `1.5px solid ${color}` : "none",
    }}
  >
    {children}
  </button>
);