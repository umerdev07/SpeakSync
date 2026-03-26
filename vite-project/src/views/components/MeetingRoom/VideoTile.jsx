/**
 * VideoTile.jsx
 * A single participant video panel — handles cam, cam-off, and screen share modes.
 */
export default function VideoTile({ videoRef, label, isMuted, isCamOff, isLocal = false, isScreenShare = false }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border flex items-center justify-center w-full h-full"
      style={{
        background:  "#0e1318",
        borderColor: isScreenShare ? "#00BFA5" : "#30363D",
        minHeight:   "100%",
      }}
    >
      {!isCamOff || isScreenShare ? (
        <video
          ref={videoRef}
          autoPlay
          muted={isLocal}
          playsInline
          className="w-full h-full object-cover"
          // Mirror local camera only (not screen share)
          style={{ transform: (isLocal && !isScreenShare) ? "scaleX(-1)" : "none" }}
        />
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border"
            style={{
              background:  "rgba(26,115,232,0.15)",
              borderColor: "rgba(26,115,232,0.3)",
              color:       "#1A73E8",
              fontFamily:  "'Syne', sans-serif",
            }}
          >
            {label?.[0]?.toUpperCase() || "?"}
          </div>
          <p className="text-[12px]" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
            Camera off
          </p>
        </div>
      )}

      {/* Label bar */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center justify-between"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }}
      >
        <span className="text-[11px] font-semibold" style={{ color: "#E6EDF3", fontFamily: "'DM Sans', sans-serif" }}>
          {isScreenShare ? "🖥 Your Screen" : `${label}${isLocal ? " (You)" : ""}`}
        </span>
        {isMuted && (
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(229,57,53,0.35)", color: "#ff6b6b" }}
          >
            🔇 Muted
          </span>
        )}
      </div>
    </div>
  );
}