// ── Mock Data ──────────────────────────────────────────────────────────────
export const MOCK_HISTORY = [
  { id: "ss-4f2a", with: "Ahmed Raza",  lang: "EN → UR", date: "Today, 10:30 AM",    dur: "18 min", avatar: "AR" },
  { id: "ss-9c1b", with: "Sara Malik",  lang: "UR → EN", date: "Today, 08:12 AM",    dur: "6 min",  avatar: "SM" },
  { id: "ss-7d3e", with: "Bilal Khan",  lang: "EN → UR", date: "Yesterday, 4:45 PM", dur: "32 min", avatar: "BK" },
  { id: "ss-2e8f", with: "Nadia Iqbal", lang: "UR → EN", date: "Yesterday, 1:00 PM", dur: "11 min", avatar: "NI" },
  { id: "ss-6a5c", with: "Usman Tariq", lang: "EN → UR", date: "Mon, 9:00 AM",       dur: "45 min", avatar: "UT" },
];

export const MOCK_SCHEDULED = [
  { id: 1, title: "FYP Discussion", with: "Sir Zafar",  date: "Mar 12, 2025", time: "10:00 AM", lang: "EN → UR" },
  { id: 2, title: "Client Demo",    with: "Ahmed Raza", date: "Mar 14, 2025", time: "03:00 PM", lang: "EN → UR" },
  { id: 3, title: "Team Sync",      with: "Sara Malik", date: "Mar 16, 2025", time: "11:30 AM", lang: "UR → EN" },
];

export const BASE_URL = "https://speaksync.app/room/";

export const genRoomId = () => {
  const seg = () => Math.random().toString(36).slice(2, 6);
  return `ss-${seg()}-${seg()}-${seg()}`;
};

export const NAV_ITEMS = [
  { id: "dashboard", icon: "⊞", label: "Dashboard"    },
  { id: "history",   icon: "🕐", label: "Call History" },
  { id: "schedule",  icon: "📅", label: "Scheduled"    },
  { id: "settings",  icon: "⚙",  label: "Settings"     },
];

export const SETTINGS_CONFIG = [
  {
    key: "language", icon: "🌐", label: "Default Language",
    description: "Choose which language direction to use by default in calls.",
    type: "select",
    options: ["English → Urdu", "Urdu → English"],
  },
  {
    key: "microphone", icon: "🎙️", label: "Microphone",
    description: "Select the input device for capturing your voice.",
    type: "devices",
    options: ["Default Input Device", "Built-in Microphone", "External Mic (USB)", "Headset Microphone"],
  },
  {
    key: "speaker", icon: "🔊", label: "Speaker",
    description: "Select the output device for translated audio playback.",
    type: "devices",
    options: ["Default Output Device", "Built-in Speakers", "Headphones", "External Speakers"],
  },
  {
    key: "name", icon: "👤", label: "Display Name",
    description: "This name is shown to participants during a call.",
    type: "text",
  },
];