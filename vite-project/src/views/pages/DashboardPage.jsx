import { useState } from "react";
import Sidebar            from "../components/DashboardPage/Sidebar";
import DashboardHome      from "../components/DashboardPage/DashboardHome";
import CallHistory        from "../components/DashboardPage/CallHistory";
import ScheduledMeetings  from "../components/DashboardPage/ScheduledMeetings";
import Settings           from "../components/DashboardPage/Settings";
import { Toast, Pill }    from "../components/DashboardPage/DashboardAtoms";
import { MOCK_HISTORY, NAV_ITEMS } from "../components/DashboardPage/DashboardConstants";
import MeetingRoom        from "./MeetingRoom";

export default function DashboardPage() {
  const [activeTab,     setActiveTab]    = useState("dashboard");
  const [sidebarOpen,   setSidebarOpen]  = useState(false);
  const [history,       setHistory]      = useState(MOCK_HISTORY);
  const [toast,         setToast]        = useState({ msg: "", visible: false });

  // Meeting room state
  const [inMeeting,     setInMeeting]    = useState(false);
  const [meetingRoomId, setMeetingRoomId] = useState(null);
  const [meetingLang,   setMeetingLang]  = useState("EN → UR");

  const [settingValues, setSettingValues] = useState({
    language:   "English → Urdu",
    microphone: "Default Input Device",
    speaker:    "Default Output Device",
    name:       "Umer",
  });

  const showToast = (msg) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  };

  // Navigate into meeting room
  const handleJoinRoom = (roomId, lang) => {
    setMeetingRoomId(roomId);
    setMeetingLang(lang);
    setInMeeting(true);
  };

  // Come back to dashboard from meeting
  const handleLeaveMeeting = () => {
    setInMeeting(false);
    setMeetingRoomId(null);
    setActiveTab("dashboard");
  };

  // ── If currently in a meeting, render full-screen meeting room ────────────
  if (inMeeting) {
    return (
      <MeetingRoom
        userName={settingValues.name}
        langDirection={meetingLang}
        roomId={meetingRoomId}
        onLeave={handleLeaveMeeting}
      />
    );
  }

  // ── Dashboard layout ──────────────────────────────────────────────────────
  const PAGE = {
    dashboard: { emoji: "👋", title: `Welcome back, ${settingValues.name}`, sub: "Your SpeakSync command center" },
    history:   { emoji: "📋", title: "Call History",    sub: "All your past translation calls"  },
    schedule:  { emoji: "📅", title: "Schedule",         sub: "Manage your upcoming meetings"    },
    settings:  { emoji: "⚙",  title: "Settings",         sub: "Configure your preferences"       },
  };
  const current = PAGE[activeTab];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0D1117; }
        ::-webkit-scrollbar-thumb { background: #30363D; border-radius: 10px; }
        input::placeholder { color: #8B949E; }
        select option { background: #161B22; color: #E6EDF3; }
      `}</style>

      <div className="flex min-h-screen" style={{ background: "#0D1117", color: "#E6EDF3" }}>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 sticky top-0 h-screen overflow-y-auto border-r"
          style={{ background: "#1C2333", borderColor: "#30363D" }}>
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userName={settingValues.name} />
        </aside>

        {/* Mobile Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-[200] lg:hidden" style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setSidebarOpen(false)}>
            <aside className="flex flex-col w-60 h-full border-r overflow-y-auto"
              style={{ background: "#1C2333", borderColor: "#30363D" }}
              onClick={e => e.stopPropagation()}>
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}
                onClose={() => setSidebarOpen(false)} userName={settingValues.name} />
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-9 overflow-y-auto pb-24 lg:pb-10">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-7 gap-3">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border cursor-pointer"
                style={{ background: "#161B22", borderColor: "#30363D", color: "#E6EDF3", fontSize: 16 }}
                onClick={() => setSidebarOpen(true)}
              >☰</button>
              <div>
                <h1 className="font-extrabold tracking-tight m-0 text-lg sm:text-2xl"
                  style={{ fontFamily: "'Syne', sans-serif" }}>
                  {current.emoji} {current.title}
                </h1>
                <p className="hidden sm:block text-[12px] mt-0.5 m-0"
                  style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
                  {current.sub}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              <Pill icon="🟢" label="Connected" />
              <Pill icon="🌐" label="EN ↔ UR" />
            </div>
          </div>

          {/* Tab content */}
          {activeTab === "dashboard" && (
            <DashboardHome
              history={history}
              onShowAllHistory={() => setActiveTab("history")}
              onToast={showToast}
              onJoinRoom={handleJoinRoom}
            />
          )}
          {activeTab === "history" && (
            <CallHistory history={history} onToast={showToast} />
          )}
          {activeTab === "schedule" && (
            <ScheduledMeetings onToast={showToast} />
          )}
          {activeTab === "settings" && (
            <Settings
              settingValues={settingValues}
              onSettingChange={(k, v) => setSettingValues(p => ({ ...p, [k]: v }))}
              onClearHistory={() => setHistory([])}
              onToast={showToast}
            />
          )}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t"
          style={{ background: "#1C2333", borderColor: "#30363D" }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 cursor-pointer border-none"
              style={{
                background: "transparent",
                color: activeTab === item.id ? "#1A73E8" : "#8B949E",
                borderTop: activeTab === item.id ? "2px solid #1A73E8" : "2px solid transparent",
                fontFamily: "'DM Sans', sans-serif", fontSize: 10,
              }}
              onClick={() => setActiveTab(item.id)}>
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <Toast msg={toast.msg} visible={toast.visible} />
    </>
  );
}