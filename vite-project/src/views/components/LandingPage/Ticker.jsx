export default function Ticker() {
  const items = [
    "🎙️ Real-Time Voice Translation","📹 HD Video Calling","💬 Live Chat",
    "🌐 English ↔ Urdu","🔒 End-to-End Encrypted","⚡ Ultra-Low Latency",
    "🤖 AI-Powered NLP","📅 Meeting Scheduler","🖥️ Screen Sharing",
    "🎙️ Real-Time Voice Translation","📹 HD Video Calling","💬 Live Chat",
    "🌐 English ↔ Urdu","🔒 End-to-End Encrypted","⚡ Ultra-Low Latency",
    "🤖 AI-Powered NLP","📅 Meeting Scheduler","🖥️ Screen Sharing",
  ];

  return (
    <div className="border-t border-b border-border py-4 bg-darkCard overflow-hidden">
      <div className="ticker-track">
        {items.map((item, i) => (
          <span key={i} className="font-body text-[13.5px] font-medium text-textSec whitespace-nowrap px-8 flex items-center gap-2">
            {item}
            <span className="text-border mx-1">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}