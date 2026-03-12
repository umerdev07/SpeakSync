import { useState, useEffect, useRef } from "react";
import { PrimaryBtn } from "./DashboardAtoms";

export default function JoinRoomModal({ onClose, onJoin }) {
  const [lang, setLang]           = useState("EN → UR");
  const [camAllowed, setCamAllowed] = useState(null);   // null | true | false
  const [micAllowed, setMicAllowed] = useState(null);
  const [stream, setStream]       = useState(null);
  const [camOn, setCamOn]         = useState(true);
  const [micOn, setMicOn]         = useState(true);
  const [requesting, setRequesting] = useState(false);
  const videoRef = useRef(null);

  // Ask permissions on mount
  useEffect(() => {
    requestPermissions();
    return () => stopStream();
  }, []);

  // Attach stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const stopStream = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
  };

  const requestPermissions = async () => {
    setRequesting(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
      setCamAllowed(true);
      setMicAllowed(true);
    } catch (err) {
      // Try audio only
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicAllowed(true);
      } catch {
        setMicAllowed(false);
      }
      setCamAllowed(false);
    }
    setRequesting(false);
  };

  const toggleCam = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach(t => (t.enabled = !camOn));
    setCamOn(prev => !prev);
  };

  const toggleMic = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach(t => (t.enabled = !micOn));
    setMicOn(prev => !prev);
  };

  const handleJoin = () => {
    stopStream();
    onJoin?.(lang);
    onClose();
  };

  const handleClose = () => {
    stopStream();
    onClose();
  };

  const PermBadge = ({ allowed, label, icon }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold border"
      style={{
        background: allowed === true  ? "rgba(0,191,165,0.12)"
                  : allowed === false ? "rgba(229,57,53,0.12)"
                  : "rgba(255,255,255,0.06)",
        borderColor: allowed === true  ? "#00BFA544"
                   : allowed === false ? "#E5393544"
                   : "#30363D",
        color: allowed === true  ? "#00BFA5"
             : allowed === false ? "#E53935"
             : "#8B949E",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <span>{icon}</span>
      <span>
        {allowed === null ? `${label}: checking…`
         : allowed ? `${label}: allowed`
         : `${label}: blocked`}
      </span>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border overflow-hidden"
        style={{ background: "#161B22", borderColor: "#30363D", boxShadow: "0 40px 100px #00000099" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b" style={{ borderColor: "#30363D" }}>
          <div>
            <h2 className="text-lg font-extrabold m-0" style={{ fontFamily: "'Syne', sans-serif", color: "#E6EDF3" }}>
              Ready to join?
            </h2>
            <p className="text-[12px] mt-0.5 m-0" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
              Check your camera & mic before entering
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-lg transition-opacity hover:opacity-70 cursor-pointer border"
            style={{ background: "transparent", borderColor: "#30363D", color: "#8B949E" }}
          >✕</button>
        </div>

        {/* Camera preview */}
        <div className="px-6 pt-5">
          <div
            className="relative w-full rounded-xl overflow-hidden flex items-center justify-center"
            style={{ background: "#0e1318", aspectRatio: "16/9", border: "1px solid #30363D" }}
          >
            {camAllowed && stream && camOn ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl">
                  {requesting ? "⏳" : camAllowed === false ? "🚫" : "📷"}
                </div>
                <p className="text-[12px] text-center px-4" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
                  {requesting         ? "Requesting camera access…"
                   : camAllowed === false ? "Camera access blocked. Check browser settings."
                   : !camOn            ? "Camera is off"
                   : "Camera not available"}
                </p>
              </div>
            )}

            {/* Cam / Mic toggle buttons overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3">
              {/* Mic toggle */}
              <button
                onClick={toggleMic}
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg cursor-pointer transition-all hover:scale-105 border"
                style={{
                  background: micOn ? "rgba(26,115,232,0.25)" : "rgba(229,57,53,0.25)",
                  borderColor: micOn ? "#1A73E855" : "#E5393555",
                }}
                title={micOn ? "Mute mic" : "Unmute mic"}
              >
                {micOn ? "🎙️" : "🔇"}
              </button>
              {/* Cam toggle */}
              <button
                onClick={toggleCam}
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg cursor-pointer transition-all hover:scale-105 border"
                style={{
                  background: camOn ? "rgba(26,115,232,0.25)" : "rgba(229,57,53,0.25)",
                  borderColor: camOn ? "#1A73E855" : "#E5393555",
                }}
                title={camOn ? "Turn off camera" : "Turn on camera"}
              >
                {camOn ? "📷" : "🚫"}
              </button>
            </div>
          </div>

          {/* Permission badges */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <PermBadge allowed={micAllowed} label="Microphone" icon="🎙️" />
            <PermBadge allowed={camAllowed} label="Camera"     icon="📷" />
          </div>
        </div>

        {/* Language selector */}
        <div className="px-6 pt-5">
          <label className="block text-[11px] font-semibold mb-2 tracking-wide uppercase"
            style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
            Translation Direction
          </label>
          <div className="grid grid-cols-2 gap-2">
            {["EN → UR", "UR → EN"].map(opt => (
              <button
                key={opt}
                onClick={() => setLang(opt)}
                className="py-3 rounded-xl text-[13px] font-bold border cursor-pointer transition-all"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  background: lang === opt ? "rgba(26,115,232,0.18)" : "rgba(255,255,255,0.04)",
                  borderColor: lang === opt ? "#1A73E8" : "#30363D",
                  color: lang === opt ? "#1A73E8" : "#8B949E",
                }}
              >
                {opt === "EN → UR" ? "🇬🇧 English → اردو" : "اردو → 🇬🇧 English"}
              </button>
            ))}
          </div>
          <p className="text-[11px] mt-2" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
            Your speech will be translated in this direction during the call.
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-5 flex gap-3">
          <button
            onClick={handleJoin}
            className="flex-1 py-3 rounded-xl font-bold text-[14px] cursor-pointer transition-opacity hover:opacity-85"
            style={{
              fontFamily: "'Syne', sans-serif",
              background: "linear-gradient(135deg, #00BFA5, #00897B)",
              color: "#fff", border: "none",
            }}
          >
            → Join Now
          </button>
          <button
            onClick={handleClose}
            className="px-5 py-3 rounded-xl font-bold text-[13px] cursor-pointer transition-opacity hover:opacity-80 border"
            style={{
              fontFamily: "'Syne', sans-serif",
              background: "transparent", borderColor: "#30363D", color: "#8B949E",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}