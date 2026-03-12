import { useState } from "react";
import { Card, SectionTitle, Pill, PrimaryBtn, Badge, Avatar } from "./DashboardAtoms";
import { BASE_URL, genRoomId } from "./DashboardConstants";
import JoinRoomModal from "./JoinRoomModal";

// Valid link: https://speaksync.app/room/ss-xxxx-xxxx-xxxx
const isValidLink = (val) =>
  /^https:\/\/speaksync\.app\/room\/ss-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/.test(val.trim());

const extractRoomId = (link) => link.trim().replace(BASE_URL, "");

export default function DashboardHome({ history, onShowAllHistory, onToast, onJoinRoom }) {
  const [roomLink, setRoomLink]           = useState("");
  const [joinLink, setJoinLink]           = useState("");
  const [joinError, setJoinError]         = useState("");
  const [copied, setCopied]               = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [pendingRoomId, setPendingRoomId] = useState(null);

  const handleGenerate = () => {
    setRoomLink(BASE_URL + genRoomId());
    onToast("Room link generated!");
  };

  const handleCopy = () => {
    if (!roomLink) return;
    navigator.clipboard.writeText(roomLink).catch(() => {});
    setCopied(true);
    onToast("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinClick = () => {
    const trimmed = joinLink.trim();
    if (!trimmed) { setJoinError("Please paste a meeting link."); return; }
    if (!isValidLink(trimmed)) { setJoinError("Invalid SpeakSync link. Check and try again."); return; }
    setJoinError("");
    setPendingRoomId(extractRoomId(trimmed));
    setJoinModalOpen(true);
  };

  // Called after user confirms camera/mic/lang in JoinRoomModal
  const handleJoinConfirm = (lang) => {
    setJoinModalOpen(false);
    onToast(`Joining with ${lang} translation…`);
    onJoinRoom?.(pendingRoomId, lang);
  };

  // Host shortcut — create + enter immediately
  const handleStartNow = () => {
    const roomId = genRoomId();
    setRoomLink(BASE_URL + roomId);
    onToast("Room created! Starting…");
    setTimeout(() => onJoinRoom?.(roomId, "EN → UR"), 600);
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Create + Join */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Create Room */}
        <Card>
          <SectionTitle icon="🔗" title="Create a Room" sub="Generate a shareable meeting link instantly" />

          <div className="flex gap-2 flex-wrap">
            <PrimaryBtn onClick={handleGenerate}>⚡ Generate Room Link</PrimaryBtn>
            <PrimaryBtn onClick={handleStartNow} color="#00BFA5">🚀 Start Now</PrimaryBtn>
          </div>

          {roomLink ? (
            <div className="flex items-center gap-2 mt-3 p-3 rounded-xl border"
              style={{ background: "#0e1318", borderColor: "#30363D" }}>
              <span className="flex-1 text-[11px] break-all"
                style={{ color: "#00BFA5", fontFamily: "'DM Sans', sans-serif" }}>
                {roomLink}
              </span>
              <PrimaryBtn onClick={handleCopy} outline color={copied ? "#00BFA5" : "#1A73E8"}
                className="text-[11px] !px-3 !py-1.5">
                {copied ? "✓ Copied" : "Copy"}
              </PrimaryBtn>
            </div>
          ) : (
            <p className="text-[11px] mt-3" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
              Share the link with your participant — they join, you talk.
              Or click <strong style={{ color: "#00BFA5" }}>Start Now</strong> to enter immediately.
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            <Pill icon="🔒" label="E2E Encrypted" />
            <Pill icon="⚡" label="&lt; 2s Latency" />
            <Pill icon="🌐" label="EN ↔ UR" />
          </div>
        </Card>

        {/* Join Room */}
        <Card>
          <SectionTitle icon="🚀" title="Join a Room" sub="Paste a SpeakSync meeting link to enter" />
          <input
            className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none border"
            style={{
              background: "#0e1318",
              borderColor: joinError ? "#E53935" : "#30363D",
              color: "#E6EDF3",
              fontFamily: "'DM Sans', sans-serif",
            }}
            placeholder="https://speaksync.app/room/ss-xxxx-xxxx-xxxx"
            value={joinLink}
            onChange={e => { setJoinLink(e.target.value); setJoinError(""); }}
          />
          {joinError && (
            <p className="text-[11px] mt-1.5" style={{ color: "#E53935", fontFamily: "'DM Sans', sans-serif" }}>
              ⚠ {joinError}
            </p>
          )}
          <PrimaryBtn onClick={handleJoinClick} className="mt-3 w-full justify-center" color="#00BFA5">
            → Join Meeting
          </PrimaryBtn>
          <p className="text-[11px] mt-3" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
            Your voice will be translated in real-time during the call.
          </p>
        </Card>
      </div>

      {/* Recent Calls */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <SectionTitle icon="🕐" title="Recent Calls" sub="Your last 3 conversations" />
          <PrimaryBtn outline color="#1A73E8" onClick={onShowAllHistory} className="text-[11px] !px-3 !py-1.5">
            View All
          </PrimaryBtn>
        </div>

        <div className="flex flex-col divide-y" style={{ borderColor: "#30363D" }}>
          {history.length === 0 ? (
            <p className="text-center py-10 text-[13px]"
              style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
              No recent calls yet.
            </p>
          ) : (
            history.slice(0, 3).map(r => (
              <div key={r.id} className="flex items-center justify-between py-3 gap-3">
                <div className="flex items-center gap-3">
                  <Avatar initials={r.avatar} size={36}
                    color={r.lang.includes("EN →") ? "#1A73E8" : "#00BFA5"} />
                  <div>
                    <div className="text-[13px] font-semibold"
                      style={{ color: "#E6EDF3", fontFamily: "'DM Sans', sans-serif" }}>
                      {r.with}
                    </div>
                    <div className="text-[10px] mt-0.5 flex items-center gap-2"
                      style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
                      <span>{r.date}</span>
                      <span>·</span>
                      <span>{r.dur}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge color={r.lang.includes("EN →") ? "#1A73E8" : "#00BFA5"}>{r.lang}</Badge>
                  <PrimaryBtn outline color="#1A73E8" className="text-[10px] !px-2.5 !py-1"
                    onClick={() => onToast("Rejoining room… (demo)")}>
                    Rejoin
                  </PrimaryBtn>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Join Permission Modal */}
      {joinModalOpen && (
        <JoinRoomModal
          onClose={() => setJoinModalOpen(false)}
          onJoin={handleJoinConfirm}
        />
      )}
    </div>
  );
}