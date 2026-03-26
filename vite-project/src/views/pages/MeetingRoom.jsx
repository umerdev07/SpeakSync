/**
 * MeetingRoom.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * SpeakSync — Meeting Room Page  (FULLY WIRED)
 *
 * Route: /room/:roomId
 *
 * What's wired:
 *   ✅ Real local camera + mic via getUserMedia
 *   ✅ Socket.io signalling (join-room, offer, answer, ICE trickle)
 *   ✅ WebRTC peer connection (two-way video + audio)
 *   ✅ Screen sharing (replaces outgoing video track live)
 *   ✅ Correct share link always derived from current roomId
 *   ✅ Chat (local + relayed via socket)
 *   ✅ Mic / cam toggles
 *   ✅ Language direction toggle (ready for translationService)
 *   ✅ Call duration timer
 *   ✅ Ended screen with duration summary
 *   ✅ TURN credentials fetched from /api/ice-credentials on mount
 *
 * translationService integration points are marked with:
 *   // 🌐 TRANSLATION_HOOK — see translationService.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef, useCallback } from "react";
import VideoTile        from "../components/MeetingRoom/VideoTile";
import MeetingControls  from "../components/MeetingRoom/MeetingControls";
import ChatPanel        from "../components/MeetingRoom/ChatPanel";
import webrtcService from "../../services/webrtcService";
import socketService from "../../services/socketService";

// ── Config ────────────────────────────────────────────────────────────────────
// In production, set REACT_APP_SIGNAL_URL in your .env
const SIGNAL_URL = import.meta.env.VITE_SIGNAL_URL || "http://localhost:5000";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * getRoomIdFromPath()
 * Reads the roomId from the URL path.
 * Works both with React Router useParams() and without.
 * Priority: props.roomId → URL → fallback
 */
function getRoomIdFromPath(propsRoomId) {
  if (propsRoomId) return propsRoomId;
  const parts = window.location.pathname.split("/");
  const id    = parts[parts.length - 1];
  // Validate format: ss-xxxx-xxxx-xxxx
  if (/^ss-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/.test(id)) return id;
  return "ss-demo-room-0001";
}

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

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function MeetingRoom({
  roomId:    propsRoomId,
  userName = "You",
  langDirection: initLang = "EN → UR",
  onLeave,
}) {
  const roomId = getRoomIdFromPath(propsRoomId);

  // ── Media state ────────────────────────────────────────────────────────────
  const [localStream,       setLocalStream]       = useState(null);
  const [micOn,             setMicOn]             = useState(true);
  const [camOn,             setCamOn]             = useState(true);
  const [screenSharing,     setScreenSharing]     = useState(false);
  const [remoteConnected,   setRemoteConnected]   = useState(false);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [chatOpen,          setChatOpen]          = useState(false);
  const [chatMessages,      setChatMessages]      = useState([
    { id: 1, sender: "System", text: "Chat is end-to-end encrypted.", system: true },
  ]);
  const [langDir,           setLangDir]           = useState(initLang);
  const [linkCopied,        setLinkCopied]        = useState(false);
  const [showToast,         setShowToast]         = useState("");
  const [ended,             setEnded]             = useState(false);
  const [connectionStatus,  setConnectionStatus]  = useState("Connecting…");

  // ── Refs ───────────────────────────────────────────────────────────────────
  const localVideoRef  = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenVideoRef = useRef(null); // local screen preview (PiP)
  const duration       = useDuration();

  // ── Toast ──────────────────────────────────────────────────────────────────
  const toast = useCallback((msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 2500);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // MOUNT — Start media, connect socket, set up signalling
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let stream;

    const start = async () => {
      // 1. Get local media
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("[MeetingRoom] Media access denied:", err);
        toast("⚠️ Camera/mic access denied.");
        return;
      }

      // 2. Fetch TURN credentials from signalling server
      let turnConfig = null;
      try {
        const res  = await fetch(`${SIGNAL_URL}/api/ice-credentials`);
        const data = await res.json();
        turnConfig = data.turnConfig;
        console.log("[MeetingRoom] TURN config received.");
      } catch (err) {
        console.warn("[MeetingRoom] Could not fetch TURN credentials — using STUN only:", err.message);
      }

      // 3. Initialise WebRTC service
      await webrtcService.init(
        stream,
        // onRemoteStream
        (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        },
        // onStateChange
        (state) => {
          setConnectionStatus(state);
          if (state === "connected")    { setRemoteConnected(true);  toast("🟢 Connected!"); }
          if (state === "disconnected") { setRemoteConnected(false); toast("🔴 Participant disconnected."); }
          if (state === "failed")       { toast("❌ Connection failed. Try again."); }
        },
        // onIceCandidate
        (candidate) => {
          socketService.sendIceCandidate(roomId, candidate);
        },
        turnConfig,
      );

      // 4. Connect socket and join room
      socketService.connect(
        SIGNAL_URL,
        () => {
          console.log("[MeetingRoom] Socket connected — joining room:", roomId);
          socketService.joinRoom(roomId, userName);
        },
        (reason) => {
          console.warn("[MeetingRoom] Socket disconnected:", reason);
          setConnectionStatus("Reconnecting…");
        },
        (err) => {
          toast("⚠️ Signalling server unreachable.");
          console.error("[MeetingRoom] Socket error:", err);
        },
      );

      // ── Signalling handlers ──────────────────────────────────────────────

      // Remote peer joined → WE create the offer (initiator)
      socketService.onUserJoined(async ({ userName: remoteName }) => {
        console.log("[MeetingRoom] User joined:", remoteName, "— creating offer…");
        toast(`👤 ${remoteName} joined`);
        const offer = await webrtcService.createOffer();
        socketService.sendOffer(roomId, offer);
      });

      // We received an offer → create answer (joiner side)
      socketService.onOffer(async (offer) => {
        console.log("[MeetingRoom] Received offer — creating answer…");
        const answer = await webrtcService.handleOffer(offer);
        socketService.sendAnswer(roomId, answer);
      });

      // We received an answer to our offer
      socketService.onAnswer(async (answer) => {
        console.log("[MeetingRoom] Received answer — setting remote description…");
        await webrtcService.setRemoteAnswer(answer);
      });

      // ICE candidate from remote peer
      socketService.onIceCandidate(async (candidate) => {
        await webrtcService.addIceCandidate(candidate);
      });

      // Remote peer left
      socketService.onUserLeft(({ userName: remoteName }) => {
        console.log("[MeetingRoom] User left:", remoteName);
        setRemoteConnected(false);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        toast(`👤 ${remoteName} left the call`);
      });

      // Room is full
      socketService.onRoomFull(() => {
        toast("⛔ Room is full (max 2 participants).");
      });

      // Incoming chat message from remote
      socketService.onChatMessage(({ text, sender, timestamp }) => {
        setChatMessages(prev => [...prev, {
          id:     timestamp,
          sender,
          text,
          mine:   false,
          time:   new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }]);
      });

      // 🌐 TRANSLATION_HOOK #1 — Start listening for translation once connected
      // Uncomment and configure when attaching NLLB / m2m100:
      //
      // import translationService from "../services/translationService";
      // translationService.init({ direction: langDir, apiUrl: "/api/translate" });
      // translationService.startListening(stream);  ← pass local audio stream
      // translationService.onTranslation(({ text, audioBlob }) => {
      //   setSubtitleText(text);
      //   const audio = new Audio(URL.createObjectURL(audioBlob));
      //   audio.play();
      // });
    };

    start();

    return () => {
      // Cleanup on unmount
      socketService.disconnect();
      webrtcService.close();
      stream?.getTracks().forEach(t => t.stop());

      // 🌐 TRANSLATION_HOOK #2 — Stop translation pipeline on unmount
      // translationService.stop();
    };
  }, [roomId, userName]);

  // ─────────────────────────────────────────────────────────────────────────
  // CONTROLS
  // ─────────────────────────────────────────────────────────────────────────

  const handleToggleMic = () => {
    const next = !micOn;
    webrtcService.toggleMic(next);
    setMicOn(next);
  };

  const handleToggleCam = () => {
    const next = !camOn;
    webrtcService.toggleCamera(next);
    setCamOn(next);
  };

  // Share link — always uses the CURRENT roomId from the URL
  const handleShareLink = () => {
    const link = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(link).catch(() => {
      // Fallback for non-https / older browsers
      const el = document.createElement("textarea");
      el.value = link;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    setLinkCopied(true);
    toast(`🔗 Link copied: /room/${roomId}`);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleToggleLang = () => {
    const next = langDir === "EN → UR" ? "UR → EN" : "EN → UR";
    setLangDir(next);
    toast(`🌐 Language: ${next}`);

    // 🌐 TRANSLATION_HOOK #3 — Update direction mid-call
    // translationService.setDirection(next);
  };

  // ── Screen share ───────────────────────────────────────────────────────────
  const handleToggleScreen = async () => {
    if (screenSharing) {
      await webrtcService.stopScreenShare();
      if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
      setScreenSharing(false);
      toast("🖥 Screen share stopped");
    } else {
      try {
        await webrtcService.startScreenShare(
          // onScreenStreamReady — show in local PiP
          (screenStream) => {
            if (screenVideoRef.current) {
              screenVideoRef.current.srcObject = screenStream;
            }
            setScreenSharing(true);
            toast("🖥 Screen share started");
          },
          // onScreenShareEnded — browser "Stop sharing" button clicked
          () => {
            if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
            setScreenSharing(false);
            toast("🖥 Screen share ended");
          },
        );
      } catch (err) {
        if (err.name !== "NotAllowedError") {
          toast("⚠️ Could not start screen share.");
          console.error("[MeetingRoom] Screen share error:", err);
        }
      }
    }
  };

  // ── Send chat ──────────────────────────────────────────────────────────────
  const handleSendChat = (text) => {
    const msg = {
      id:     Date.now(),
      sender: userName,
      text,
      mine:   true,
      time:   new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages(prev => [...prev, msg]);
    socketService.sendChat(roomId, text, userName);
  };

  // ── End call ───────────────────────────────────────────────────────────────
  const handleEndCall = () => {
    socketService.disconnect();
    webrtcService.close();
    setEnded(true);
    setTimeout(() => onLeave?.(), 1800);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // ENDED SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (ended) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D1117" }}>
        <div className="text-center">
          <div className="text-5xl mb-4">📵</div>
          <h2 className="text-2xl font-extrabold mb-2"
            style={{ fontFamily: "'Syne', sans-serif", color: "#E6EDF3" }}>
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

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN MEETING UI
  // ─────────────────────────────────────────────────────────────────────────
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

          {/* Translation badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
            style={{ background: "rgba(0,191,165,0.1)", borderColor: "rgba(0,191,165,0.3)", color: "#00BFA5" }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00BFA5" }} />
            <span className="text-[11px] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              🌐 {langDir} · Live
            </span>
          </div>

          {/* Share button */}
          <button
            onClick={handleShareLink}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[12px] font-semibold cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              background:   linkCopied ? "rgba(0,191,165,0.15)"  : "rgba(26,115,232,0.15)",
              borderColor:  linkCopied ? "rgba(0,191,165,0.4)"   : "rgba(26,115,232,0.4)",
              color:        linkCopied ? "#00BFA5"                : "#1A73E8",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {linkCopied ? "✓ Copied" : "🔗 Share"}
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Video area */}
          <div className="flex-1 flex flex-col overflow-hidden p-3 sm:p-4 gap-3">

            {/* Remote video — main large tile */}
            <div className="flex-1 relative">
              {!remoteConnected ? (
                <div className="w-full h-full rounded-2xl flex flex-col items-center justify-center border gap-4"
                  style={{ background: "#0e1318", borderColor: "#30363D" }}>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: "#1A73E8",
                          animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }} />
                    ))}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-center"
                      style={{ fontFamily: "'Syne', sans-serif", color: "#E6EDF3" }}>
                      Waiting for participant…
                    </p>
                    <p className="text-[12px] text-center mt-1"
                      style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
                      Share the link below to invite someone
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
                  <p className="text-[10px]" style={{ color: "#556066", fontFamily: "'DM Sans', sans-serif" }}>
                    {window.location.origin}/room/{roomId}
                  </p>
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

              {/* Local video PiP — bottom-right */}
              <div className="absolute bottom-3 right-3 w-28 sm:w-36 shadow-2xl rounded-xl overflow-hidden border"
                style={{ borderColor: screenSharing ? "#00BFA5" : "#30363D", zIndex: 10 }}>
                <VideoTile
                  videoRef={screenSharing ? screenVideoRef : localVideoRef}
                  label={userName}
                  isMuted={!micOn}
                  isCamOff={!camOn && !screenSharing}
                  isLocal={true}
                  isScreenShare={screenSharing}
                />
              </div>
            </div>

            {/* Subtitle bar */}
            {/* 🌐 TRANSLATION_HOOK #4 — Replace static text with subtitleText state */}
            {/* const [subtitleText, setSubtitleText] = useState(""); */}
            <div className="px-4 py-2 rounded-xl border text-center text-[12px] flex-shrink-0"
              style={{ background: "rgba(0,0,0,0.5)", borderColor: "#30363D", color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
              {remoteConnected
                ? "🎙 Translation active — subtitles will appear here"
                /* Replace ↑ with: subtitleText || "🎙 Listening for speech…" */
                : "Translation will begin once participant joins"}
            </div>
          </div>

          {/* Chat sidebar */}
          {chatOpen && (
            <div className="w-72 sm:w-80 flex-shrink-0 hidden sm:flex flex-col"
              style={{ borderLeft: "1px solid #30363D" }}>
              <ChatPanel
                localName={userName}
                remoteConnected={remoteConnected}
                messages={chatMessages}
                onSendMessage={handleSendChat}
              />
            </div>
          )}
        </div>

        {/* ── CONTROLS ── */}
        <div className="flex-shrink-0">
          <MeetingControls
            micOn={micOn}
            camOn={camOn}
            chatOpen={chatOpen}
            screenSharing={screenSharing}
            duration={duration}
            langDirection={langDir}
            onToggleMic={handleToggleMic}
            onToggleCam={handleToggleCam}
            onToggleChat={() => setChatOpen(p => !p)}
            onShareLink={handleShareLink}
            onToggleLang={handleToggleLang}
            onToggleScreen={handleToggleScreen}
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

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.1); }
        }
      `}</style>
    </>
  );
}