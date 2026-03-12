import { useState, useRef, useEffect } from "react";

export default function ChatPanel({ localName, remoteConnected }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: "System", text: "Chat is end-to-end encrypted.", system: true },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, {
      id: Date.now(), sender: localName || "You", text, mine: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setInput("");
    // TODO: socketService.sendChat(roomId, text, localName)
  };

  return (
    <div className="flex flex-col h-full border-l" style={{ borderColor: "#30363D", background: "#161B22" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#30363D" }}>
        <div>
          <p className="text-[13px] font-bold m-0" style={{ fontFamily: "'Syne', sans-serif", color: "#E6EDF3" }}>
            💬 In-Call Chat
          </p>
          <p className="text-[10px] m-0 mt-0.5" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
            {remoteConnected ? "Participant connected" : "Waiting for participant…"}
          </p>
        </div>
        <div className="w-2 h-2 rounded-full" style={{ background: remoteConnected ? "#43A047" : "#8B949E" }} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.mine ? "items-end" : "items-start"}`}>
            {msg.system ? (
              <div className="text-center w-full my-1">
                <span className="text-[10px] px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
                  {msg.text}
                </span>
              </div>
            ) : (
              <>
                <span className="text-[10px] mb-1" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
                  {msg.sender} · {msg.time}
                </span>
                <div className="px-3 py-2 text-[13px] max-w-[85%]"
                  style={{
                    background: msg.mine ? "rgba(26,115,232,0.22)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${msg.mine ? "rgba(26,115,232,0.35)" : "#30363D"}`,
                    color: "#E6EDF3", fontFamily: "'DM Sans', sans-serif",
                    borderRadius: msg.mine ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                  }}
                >
                  {msg.text}
                </div>
              </>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t" style={{ borderColor: "#30363D" }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ background: "#0e1318", borderColor: "#30363D" }}>
          <input
            className="flex-1 bg-transparent outline-none text-[13px]"
            style={{ color: "#E6EDF3", fontFamily: "'DM Sans', sans-serif" }}
            placeholder={remoteConnected ? "Type a message…" : "Waiting to connect…"}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            disabled={!remoteConnected}
          />
          <button onClick={sendMessage} disabled={!input.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer border-none transition-opacity hover:opacity-80"
            style={{ background: input.trim() ? "#1A73E8" : "rgba(255,255,255,0.08)", color: input.trim() ? "#fff" : "#8B949E", fontSize: 14 }}>
            ➤
          </button>
        </div>
        <p className="text-[10px] mt-1 text-center" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
          Press Enter to send
        </p>
      </div>
    </div>
  );
}