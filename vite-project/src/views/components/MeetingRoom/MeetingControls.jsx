/**
 * MeetingControls.jsx
 * Bottom control bar for the meeting room.
 */

function ControlBtn({ icon, label, active = true, danger = false, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 group cursor-pointer border-none bg-transparent"
      title={label}
    >
      <div
        className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl text-lg transition-all"
        style={{
          background: danger
            ? "rgba(229,57,53,0.18)"
            : active
              ? "rgba(26,115,232,0.18)"
              : "rgba(255,255,255,0.08)",
          border: `1px solid ${
            danger ? "rgba(229,57,53,0.4)" : active ? "rgba(26,115,232,0.35)" : "#30363D"
          }`,
          position: "relative",
        }}
      >
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold"
            style={{ background: "#E53935", color: "#fff" }}>
            {badge}
          </span>
        )}
      </div>
      <span className="text-[9px] sm:text-[10px]" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </span>
    </button>
  );
}

export default function MeetingControls({
  micOn, camOn, chatOpen, duration,
  onToggleMic, onToggleCam, onToggleChat,
  onShareLink, onEndCall,
  langDirection, onToggleLang,
}) {
  return (
    <div
      className="flex items-center justify-between gap-2 sm:gap-4 px-4 sm:px-8 py-3 border-t"
      style={{ background: "#161B22", borderColor: "#30363D" }}
    >
      {/* Left — call timer + lang */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#43A047" }} />
          <span className="text-[12px] font-semibold tabular-nums" style={{ color: "#E6EDF3", fontFamily: "'DM Sans', sans-serif" }}>
            {duration}
          </span>
        </div>
        {/* Language toggle pill */}
        <button
          onClick={onToggleLang}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border cursor-pointer transition-all hover:opacity-80"
          style={{
            background: "rgba(0,191,165,0.12)", borderColor: "rgba(0,191,165,0.35)",
            color: "#00BFA5", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
          }}
        >
          🌐 {langDirection}
        </button>
      </div>

      {/* Centre — core controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        <ControlBtn icon={micOn ? "🎙️" : "🔇"} label={micOn ? "Mute"  : "Unmute"} active={micOn}  onClick={onToggleMic} />
        <ControlBtn icon={camOn ? "📷" : "🚫"} label={camOn ? "Cam Off" : "Cam On"} active={camOn}  onClick={onToggleCam} />
        <ControlBtn icon="🔗"  label="Share"   active={false} onClick={onShareLink} />
        <ControlBtn icon="💬"  label="Chat"    active={chatOpen} onClick={onToggleChat} />
        {/* End call — red */}
        <button
          onClick={onEndCall}
          className="flex flex-col items-center gap-1 cursor-pointer border-none bg-transparent"
        >
          <div
            className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl text-lg transition-all hover:scale-105"
            style={{ background: "#E53935", border: "none" }}
          >
            📵
          </div>
          <span className="text-[9px] sm:text-[10px]" style={{ color: "#E53935", fontFamily: "'DM Sans', sans-serif" }}>
            End
          </span>
        </button>
      </div>

      {/* Right — participants */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "#30363D" }}>
          <span className="text-[11px]" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>👥</span>
          <span className="text-[11px]" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>2 / 2</span>
        </div>
      </div>
    </div>
  );
}