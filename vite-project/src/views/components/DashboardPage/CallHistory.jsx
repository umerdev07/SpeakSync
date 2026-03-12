import { Card, SectionTitle, Avatar, Badge, PrimaryBtn } from "./DashboardAtoms";

export default function CallHistory({ history, onToast }) {
  if (history.length === 0) {
    return (
      <Card>
        <SectionTitle icon="🕐" title="Call History" sub="All your past SpeakSync conversations" />
        <div className="text-center py-16" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
          No call history yet.
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <SectionTitle icon="🕐" title="Call History" sub="All your past SpeakSync conversations" />

      {/* Desktop table header */}
      <div className="hidden md:grid gap-4 px-4 pb-2 border-b mb-1"
        style={{
          gridTemplateColumns: "36px 1fr 90px 150px 70px 80px",
          borderColor: "#30363D",
          fontSize: 10, color: "#8B949E",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
        }}
      >
        <span />
        <span>Participant</span>
        <span>Language</span>
        <span>Date & Time</span>
        <span>Duration</span>
        <span>Action</span>
      </div>

      <div className="flex flex-col">
        {history.map(r => (
          <div key={r.id}>
            {/* Desktop row */}
            <div
              className="hidden md:grid items-center gap-4 px-4 py-3 rounded-xl transition-colors hover:bg-white/[0.03]"
              style={{ gridTemplateColumns: "36px 1fr 90px 150px 70px 80px" }}
            >
              <Avatar initials={r.avatar} size={34} color={r.lang.includes("EN →") ? "#1A73E8" : "#00BFA5"} />
              <div>
                <div className="text-[13px] font-semibold" style={{ color: "#E6EDF3", fontFamily: "'DM Sans', sans-serif" }}>{r.with}</div>
                <div className="text-[10px]" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>{r.id}</div>
              </div>
              <Badge color={r.lang.includes("EN →") ? "#1A73E8" : "#00BFA5"}>{r.lang}</Badge>
              <span className="text-[11px]" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>{r.date}</span>
              <span className="text-[12px]" style={{ color: "#E6EDF3", fontFamily: "'DM Sans', sans-serif" }}>{r.dur}</span>
              <PrimaryBtn outline color="#1A73E8" className="text-[10px] !px-2.5 !py-1"
                onClick={() => onToast("Rejoining… (demo)")}>
                Rejoin
              </PrimaryBtn>
            </div>

            {/* Mobile card */}
            <div className="md:hidden flex items-center justify-between py-3 border-b gap-3"
              style={{ borderColor: "#30363D" }}>
              <div className="flex items-center gap-3">
                <Avatar initials={r.avatar} size={34} color={r.lang.includes("EN →") ? "#1A73E8" : "#00BFA5"} />
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: "#E6EDF3", fontFamily: "'DM Sans', sans-serif" }}>{r.with}</div>
                  <div className="text-[10px] flex gap-2 mt-0.5" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
                    <span>{r.date}</span><span>·</span><span>{r.dur}</span>
                  </div>
                  <div className="mt-1"><Badge color={r.lang.includes("EN →") ? "#1A73E8" : "#00BFA5"}>{r.lang}</Badge></div>
                </div>
              </div>
              <PrimaryBtn outline color="#1A73E8" className="text-[10px] !px-2.5 !py-1"
                onClick={() => onToast("Rejoining… (demo)")}>
                Rejoin
              </PrimaryBtn>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}