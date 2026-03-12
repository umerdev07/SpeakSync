import { useState } from "react";
import { Badge, PrimaryBtn } from "./DashboardAtoms";
import { MOCK_SCHEDULED } from "./DashboardConstants";

function ScheduleModal({ onClose, onSave }) {
  const [form, setForm] = useState({ title: "", with: "", date: "", time: "", lang: "EN → UR" });

  const handleSave = () => {
    if (!form.title || !form.with || !form.date || !form.time) return;
    onSave({ id: Date.now(), ...form });
    onClose();
  };

  const inputCls = "w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none border";
  const inputStyle = { background: "#0e1318", borderColor: "#30363D", color: "#E6EDF3", fontFamily: "'DM Sans', sans-serif", colorScheme: "dark" };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-md rounded-2xl border p-7 overflow-y-auto max-h-[90vh]"
        style={{ background: "#161B22", borderColor: "#30363D", boxShadow: "0 40px 100px #00000099" }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-extrabold mb-5 m-0" style={{ fontFamily: "'Syne', sans-serif", color: "#E6EDF3" }}>
          📅 Schedule a Meeting
        </h2>

        {[
          { key: "title", label: "Title",       placeholder: "Meeting title",    type: "text" },
          { key: "with",  label: "Participant",  placeholder: "Participant name", type: "text" },
          { key: "date",  label: "Date",         placeholder: "Date",            type: "date" },
          { key: "time",  label: "Time",         placeholder: "Time",            type: "time" },
        ].map(f => (
          <div key={f.key} className="mb-3.5">
            <label className="block text-[11px] mb-1.5 font-semibold tracking-wide uppercase"
              style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
              {f.label}
            </label>
            <input
              type={f.type}
              className={inputCls}
              style={inputStyle}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            />
          </div>
        ))}

        <div className="mb-5">
          <label className="block text-[11px] mb-1.5 font-semibold tracking-wide uppercase"
            style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
            Language
          </label>
          <select
            className={inputCls}
            style={inputStyle}
            value={form.lang}
            onChange={e => setForm(p => ({ ...p, lang: e.target.value }))}
          >
            <option>EN → UR</option>
            <option>UR → EN</option>
          </select>
        </div>

        <div className="flex gap-3">
          <PrimaryBtn onClick={handleSave} className="flex-1 justify-center">Confirm Schedule</PrimaryBtn>
          <PrimaryBtn outline color="#30363D" onClick={onClose} className="flex-1 justify-center">Cancel</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

export default function ScheduledMeetings({ onToast }) {
  const [schedules, setSchedules] = useState(MOCK_SCHEDULED);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = (meeting) => {
    setSchedules(prev => [meeting, ...prev]);
    onToast("Meeting scheduled!");
  };

  const handleDelete = (id) => setSchedules(prev => prev.filter(s => s.id !== id));

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-extrabold m-0" style={{ fontFamily: "'Syne', sans-serif", color: "#E6EDF3" }}>
            Scheduled Meetings
          </h2>
          <p className="text-[12px] mt-1 m-0" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
            Plan your upcoming calls
          </p>
        </div>
        <PrimaryBtn onClick={() => setModalOpen(true)}>+ Schedule Meeting</PrimaryBtn>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {schedules.length === 0 && (
          <div className="text-center py-16" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
            No scheduled meetings yet.
          </div>
        )}

        {schedules.map(m => (
          <div key={m.id}
            className="flex items-start justify-between gap-3 p-4 rounded-xl border flex-wrap sm:flex-nowrap"
            style={{ background: "#0e1318", borderColor: "#30363D" }}
          >
            <div className="flex gap-3 items-start">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border"
                style={{ background: "rgba(26,115,232,0.12)", borderColor: "rgba(26,115,232,0.2)" }}>
                📅
              </div>
              <div>
                <div className="text-[15px] font-bold" style={{ fontFamily: "'Syne', sans-serif", color: "#E6EDF3" }}>
                  {m.title}
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
                  with {m.with} · {m.date} at {m.time}
                </div>
                <div className="mt-2">
                  <Badge color={m.lang.includes("EN →") ? "#1A73E8" : "#00BFA5"}>{m.lang}</Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0 ml-auto">
              <PrimaryBtn color="#00BFA5" className="text-[11px] !px-3.5 !py-1.5"
                onClick={() => onToast("Starting meeting… (demo)")}>
                Start
              </PrimaryBtn>
              <PrimaryBtn outline color="#E53935" className="text-[11px] !px-3 !py-1.5"
                onClick={() => handleDelete(m.id)}>
                ✕
              </PrimaryBtn>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <ScheduleModal onClose={() => setModalOpen(false)} onSave={handleSave} />
      )}
    </>
  );
}