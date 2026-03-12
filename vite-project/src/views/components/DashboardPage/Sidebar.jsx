import { Avatar } from "./DashboardAtoms";
import { NAV_ITEMS } from "./dashboardConstants";

export default function Sidebar({ activeTab, setActiveTab, onClose, userName }) {
  return (
    <div
      className="flex flex-col h-screen overflow-y-auto pb-6"
      style={{ background: "#1C2333" }}
    >
      {/* Logo */}
      <div className="px-6 pt-7 pb-5 border-b mb-3" style={{ borderColor: "#30363D" }}>
        <div
          className="text-xl font-extrabold tracking-tight"
          style={{
            fontFamily: "'Syne', sans-serif",
            background: "linear-gradient(135deg, #1A73E8, #00BFA5)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}
        >
          SpeakSync
        </div>
        <div className="text-[10px] mt-0.5 tracking-widest" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
          REAL-TIME TRANSLATION
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-6 py-[11px] cursor-pointer text-[13px] transition-all"
            style={{
              background: activeTab === item.id ? "rgba(26,115,232,0.12)" : "transparent",
              borderLeft: activeTab === item.id ? "3px solid #1A73E8" : "3px solid transparent",
              color: activeTab === item.id ? "#E6EDF3" : "#8B949E",
              fontWeight: activeTab === item.id ? 600 : 400,
              fontFamily: "'DM Sans', sans-serif",
            }}
            onClick={() => { setActiveTab(item.id); onClose?.(); }}
          >
            <span className="text-[15px]">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* User card */}
      <div className="mx-4 p-3.5 rounded-xl border shrink-0" style={{ background: "#0e1318", borderColor: "#30363D" }}>
        <div className="flex items-center gap-2.5">
          <Avatar initials={userName?.[0] || "U"} size={34} color="#00BFA5" />
          <div>
            <div className="text-[12px] font-bold" style={{ fontFamily: "'Syne', sans-serif", color: "#E6EDF3" }}>
              {userName || "Umer"}
            </div>
            <div className="text-[10px]" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
              Student · FYP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}