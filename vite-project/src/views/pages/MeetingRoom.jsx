/**
 * MeetingRoom.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * SpeakSync — Meeting Room Page
 *
 * Route: /room/:roomId
 *
 * Renders the full in-call UI:
 *   - Local + remote video tiles
 *   - Meeting controls (mic, cam, end, share, chat)
 *   - Chat sidebar panel
 *   - Translation direction badge
 *   - Waiting state when remote not yet connected
 *
 * Services wired (stubs only — replace with real calls when implementing):
 *   - webrtcService  → peer connection
 *   - socketService  → signalling + chat
 *   - translationService → audio translation
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useState, useEffect, useRef } from "react";
import VideoTile      from "../components/MeetingRoom/VideoTile";
import MeetingControls from "../components/MeetingRoom/MeetingControls";
import ChatPanel      from "../components/MeetingRoom/ChatPanel";

// ── Mock room link for sharing (replace with real router param) ────────────
// When integrated with React Router:
//   const { roomId } = useParams();
// For now we read from window.location.pathname as a stub.
function getRoomIdFromPath() {
  const parts = window.location.pathname.split("/");
  return parts[parts.length - 1] || "ss-demo-room-0001";
}

// ── Duration timer helper ────────────────────────────────────────────────────
function useDuration() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// ────────────────────────────────────────────────────────────────────────────
export default function MeetingRoom({ userName = "Umer", langDirection: initLang = "EN → UR", onLeave }) {
  const roomId = getRoomIdFromPath();

  // Media state
  const [localStream, setLocalStream]       = useState(null);
  const [micOn,  setMicOn]                  = useState(true);
  const [camOn,  setCamOn]                  = useState(true);
  const [remoteConnected, setRemoteConnected] = useState(false);  // will be true once peer joins

  // UI state
  const [chatOpen,  setChatOpen]            = useState(false);
  const [langDir,   setLangDir]             = useState(initLang);
  const [linkCopied, setLinkCopied]         = useState(false);
  const [showToast,  setShowToast]          = useState("");
  const [ended,      setEnded]              = useState(false);

  const localVideoRef  = useRef(null);
  const remoteVideoRef = useRef(null);
  const duration = useDuration();

  // ── Start local media on mount ─────────────────────────────────────────
  useEffect(() => {
    let stream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        // TODO: webrtcService.init(stream, onRemoteStream, onStateChange, onIceCandidate)
        // TODO: socketService.connect(SOCKET_URL, onConnect, onDisconnect)
        // TODO: socketService.joinRoom(roomId, userName)
        // TODO: socketService.onUserJoined(() => setRemoteConnected(true))
        // TODO: socketService.onUserLeft(() => setRemoteConnected(false))
      } catch (err) {
        console.error("[MeetingRoom] Media access denied:", err);
      }
    })();
    return () => {
      stream?.getTracks().forEach(t => t.stop());
      // TODO: socketService.disconnect()
      // TODO: webrtcService.close()
    };
  }, []);

  // ── Toast helper ──────────────────────────────────────────────────────
  const toast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 2500);
  };

  // ── Controls ──────────────────────────────────────────────────────────
  const handleToggleMic = () => {
    localStream?.getAudioTracks().forEach(t => (t.enabled = !micOn));
    // TODO: webrtcService.toggleMic(!micOn)
    setMicOn(p => !p);
  };

  const handleToggleCam = () => {
    localStream?.getVideoTracks().forEach(t => (t.enabled = !camOn));
    // TODO: webrtcService.toggleCamera(!camOn)
    setCamOn(p => !p);
  };

  const handleShareLink = () => {
    const link = `https://speaksync.app/room/${roomId}`;
    navigator.clipboard.writeText(link).catch(() => {});
    setLinkCopied(true);
    toast("Meeting link copied!");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleToggleLang = () => {
    const next = langDir === "EN → UR" ? "UR → EN" : "EN → UR";
    setLangDir(next);
    toast(`Language switched to ${next}`);
    // TODO: translationService.setDirection(next)
  };

  const handleEndCall = () => {
    localStream?.getTracks().forEach(t => t.stop());
    // TODO: socketService.disconnect()
    // TODO: webrtcService.close()
    setEnded(true);
    setTimeout(() => onLeave?.(), 1500);
  };

  // ── Ended screen ──────────────────────────────────────────────────────
  if (ended) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D1117" }}>
        <div className="text-center">
          <div className="text-5xl mb-4">📵</div>
          <h2 className="text-2xl font-extrabold mb-2" style={{ fontFamily: "'Syne', sans-serif", color: "#E6EDF3" }}>
            Call Ended
          </h2>
          <p className="text-[13px] mb-6" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
            Duration: {duration} · {langDir}
          </p>
          <button
            onClick={() => onLeave?.()}
            className="px-6 py-2.5 rounded-xl font-bold text-[13px] cursor-pointer border-none hover:opacity-85"
            style={{ background: "#1A73E8", color: "#fff", fontFamily: "'Syne', sans-serif" }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Main meeting UI ───────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #30363D; border-radius: 4px; }
        input::placeholder { color: #8B949E; }
      `}</style>

      <div className="flex flex-col h-screen" style={{ background: "#0D1117", color: "#E6EDF3" }}>

        {/* ── TOP BAR ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b flex-shrink-0"
          style={{ background: "#161B22", borderColor: "#30363D" }}>

          {/* Logo + room ID */}
          <div className="flex items-center gap-3">
            <div className="text-base font-extrabold"
              style={{
                fontFamily: "'Syne', sans-serif",
                background: "linear-gradient(135deg, #1A73E8, #00BFA5)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
              SpeakSync
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px]"
              style={{ borderColor: "#30363D", color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
              🔒 {roomId}
            </div>
          </div>

          {/* Centre — translation badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
            style={{ background: "rgba(0,191,165,0.1)", borderColor: "rgba(0,191,165,0.3)", color: "#00BFA5" }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00BFA5" }} />
            <span className="text-[11px] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              🌐 {langDir} · Live
            </span>
          </div>

          {/* Right — share button */}
          <button
            onClick={handleShareLink}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[12px] font-semibold cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              background: linkCopied ? "rgba(0,191,165,0.15)" : "rgba(26,115,232,0.15)",
              borderColor: linkCopied ? "rgba(0,191,165,0.4)" : "rgba(26,115,232,0.4)",
              color: linkCopied ? "#00BFA5" : "#1A73E8",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {linkCopied ? "✓ Copied" : "🔗 Share"}
          </button>
        </div>

        {/* ── BODY: videos + chat ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Video area */}
          <div className="flex-1 flex flex-col overflow-hidden p-3 sm:p-4 gap-3">

            {/* Remote video — main large tile */}
            <div className="flex-1 relative">
              {!remoteConnected ? (
                /* Waiting screen */
                <div className="w-full h-full rounded-2xl flex flex-col items-center justify-center border gap-4"
                  style={{ background: "#0e1318", borderColor: "#30363D" }}>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: "#1A73E8",
                          animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }} />
                    ))}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-center" style={{ fontFamily: "'Syne', sans-serif", color: "#E6EDF3" }}>
                      Waiting for participant…
                    </p>
                    <p className="text-[12px] text-center mt-1" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
                      Share the link to invite someone
                    </p>
                  </div>
                  <button
                    onClick={handleShareLink}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold cursor-pointer border hover:opacity-80 transition-opacity"
                    style={{
                      background: "rgba(26,115,232,0.15)", borderColor: "rgba(26,115,232,0.4)",
                      color: "#1A73E8", fontFamily: "'Syne', sans-serif",
                    }}
                  >
                    🔗 Copy Invite Link
                  </button>
                </div>
              ) : (
                <div className="w-full h-full">
                  <VideoTile
                    videoRef={remoteVideoRef}
                    label="Participant"
                    isMuted={false}
                    isCamOff={false}
                    isLocal={false}
                  />
                </div>
              )}

              {/* Local video PiP — bottom right corner */}
              <div className="absolute bottom-3 right-3 w-28 sm:w-36 shadow-2xl rounded-xl overflow-hidden border"
                style={{ borderColor: "#30363D", zIndex: 10 }}>
                <VideoTile
                  videoRef={localVideoRef}
                  label={userName}
                  isMuted={!micOn}
                  isCamOff={!camOn}
                  isLocal={true}
                />
              </div>
            </div>

            {/* Subtitle bar */}
            <div className="px-4 py-2 rounded-xl border text-center text-[12px] flex-shrink-0"
              style={{ background: "rgba(0,0,0,0.5)", borderColor: "#30363D", color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
              {remoteConnected
                ? "🎙 Translation active — subtitles will appear here"
                : "Translation will begin once participant joins"}
            </div>
          </div>

          {/* Chat sidebar */}
          {chatOpen && (
            <div className="w-72 sm:w-80 flex-shrink-0 hidden sm:flex flex-col" style={{ borderLeft: "1px solid #30363D" }}>
              <ChatPanel localName={userName} remoteConnected={remoteConnected} />
            </div>
          )}
        </div>

        {/* ── CONTROLS ── */}
        <div className="flex-shrink-0">
          <MeetingControls
            micOn={micOn}
            camOn={camOn}
            chatOpen={chatOpen}
            duration={duration}
            langDirection={langDir}
            onToggleMic={handleToggleMic}
            onToggleCam={handleToggleCam}
            onToggleChat={() => setChatOpen(p => !p)}
            onShareLink={handleShareLink}
            onToggleLang={handleToggleLang}
            onEndCall={handleEndCall}
          />
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-xl text-[13px] font-semibold z-[9999] pointer-events-none whitespace-nowrap"
          style={{ background: "#00BFA5", color: "#0D1117", boxShadow: "0 8px 32px rgba(0,191,165,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
          ✓ {showToast}
        </div>
      )}

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </>
  );
}