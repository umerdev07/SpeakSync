import { useState } from "react";
import { PrimaryBtn } from "./DashboardAtoms";
import { SETTINGS_CONFIG } from "./DashboardConstants";

function SettingModal({ setting, currentValue, onClose, onSave }) {
  const [value, setValue] = useState(currentValue);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-md rounded-2xl border p-7 overflow-y-auto max-h-[90vh]"
        style={{ background: "#161B22", borderColor: "#30363D", boxShadow: "0 40px 100px #00000099" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-extrabold m-0" style={{ fontFamily: "'Syne', sans-serif", color: "#E6EDF3" }}>
            {setting.icon} {setting.label}
          </h2>
          <button onClick={onClose} className="text-xl cursor-pointer hover:opacity-70"
            style={{ background: "none", border: "none", color: "#8B949E" }}>✕</button>
        </div>
        <p className="text-[12px] mb-5" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
          {setting.description}
        </p>

        {/* Input by type */}
        {setting.type === "select" && (
          <select
            className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none border mb-5"
            style={{ background: "#0e1318", borderColor: "#30363D", color: "#E6EDF3", fontFamily: "'DM Sans', sans-serif", colorScheme: "dark" }}
            value={value}
            onChange={e => setValue(e.target.value)}
          >
            {setting.options.map(o => <option key={o}>{o}</option>)}
          </select>
        )}

        {setting.type === "devices" && (
          <div className="flex flex-col gap-2 mb-5">
            {setting.options.map(o => (
              <label key={o}
                className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all"
                style={{
                  background: value === o ? "rgba(26,115,232,0.12)" : "#0e1318",
                  borderColor: value === o ? "#1A73E8" : "#30363D",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#E6EDF3",
                }}
              >
                <input type="radio" name="device" value={o} checked={value === o}
                  onChange={() => setValue(o)} style={{ accentColor: "#1A73E8" }} />
                {o}
              </label>
            ))}
          </div>
        )}

        {setting.type === "text" && (
          <input
            className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none border mb-5"
            style={{ background: "#0e1318", borderColor: "#30363D", color: "#E6EDF3", fontFamily: "'DM Sans', sans-serif" }}
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        )}

        <div className="flex gap-3">
          <PrimaryBtn onClick={() => onSave(value)} className="flex-1 justify-center">Save Changes</PrimaryBtn>
          <PrimaryBtn outline color="#30363D" onClick={onClose} className="flex-1 justify-center">Cancel</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

export default function Settings({ settingValues, onSettingChange, onClearHistory, onToast }) {
  const [activeModal, setActiveModal] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleSave = (key, value) => {
    onSettingChange(key, value);
    setActiveModal(null);
    onToast(`${SETTINGS_CONFIG.find(s => s.key === key)?.label} updated!`);
  };

  const handleClearHistory = () => {
    onClearHistory();
    setConfirmClear(false);
    onToast("Call history cleared!");
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-extrabold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: "#E6EDF3" }}>
          Settings
        </h2>
        <p className="text-[12px] mb-5" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
          Manage your SpeakSync preferences
        </p>

        {/* Setting rows */}
        <div className="flex flex-col gap-3 mb-6">
          {SETTINGS_CONFIG.map(setting => (
            <div key={setting.key}
              className="flex items-center justify-between gap-4 p-4 rounded-2xl border flex-wrap sm:flex-nowrap"
              style={{ background: "#161B22", borderColor: "#30363D" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border"
                  style={{ background: "rgba(26,115,232,0.12)", borderColor: "rgba(26,115,232,0.2)" }}>
                  {setting.icon}
                </div>
                <div>
                  <div className="text-[14px] font-bold" style={{ fontFamily: "'Syne', sans-serif", color: "#E6EDF3" }}>
                    {setting.label}
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: "#00BFA5", fontFamily: "'DM Sans', sans-serif" }}>
                    {settingValues[setting.key]}
                  </div>
                </div>
              </div>
              <PrimaryBtn outline color="#1A73E8" className="text-[12px] !px-4 !py-2 ml-auto"
                onClick={() => setActiveModal(setting)}>
                Change
              </PrimaryBtn>
            </div>
          ))}
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border p-5" style={{ background: "rgba(229,57,53,0.05)", borderColor: "rgba(229,57,53,0.25)" }}>
          <div className="text-[14px] font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: "#E53935" }}>
            ⚠ Danger Zone
          </div>
          <p className="text-[12px] mb-4" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
            These actions are permanent and cannot be undone.
          </p>
          <div className="flex flex-wrap gap-3">
            <PrimaryBtn outline color="#E53935" className="text-[12px] !px-4 !py-2"
              onClick={() => setConfirmClear(true)}>
              🗑 Clear Call History
            </PrimaryBtn>
            <PrimaryBtn outline color="#E53935" className="text-[12px] !px-4 !py-2"
              onClick={() => onToast("Logging out… (demo)")}>
              ↩ Log Out
            </PrimaryBtn>
          </div>
        </div>
      </div>

      {/* Setting change modal */}
      {activeModal && (
        <SettingModal
          setting={activeModal}
          currentValue={settingValues[activeModal.key]}
          onClose={() => setActiveModal(null)}
          onSave={(value) => handleSave(activeModal.key, value)}
        />
      )}

      {/* Confirm clear modal */}
      {confirmClear && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          onClick={() => setConfirmClear(false)}
        >
          <div className="w-full max-w-sm rounded-2xl border p-7"
            style={{ background: "#161B22", borderColor: "#30363D", boxShadow: "0 40px 100px #00000099" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-3xl mb-3">🗑</div>
            <h2 className="text-lg font-extrabold mb-2" style={{ fontFamily: "'Syne', sans-serif", color: "#E6EDF3" }}>
              Clear all history?
            </h2>
            <p className="text-[13px] mb-6" style={{ color: "#8B949E", fontFamily: "'DM Sans', sans-serif" }}>
              This will permanently delete all your call history. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <PrimaryBtn color="#E53935" className="flex-1 justify-center" onClick={handleClearHistory}>
                Yes, Clear All
              </PrimaryBtn>
              <PrimaryBtn outline color="#30363D" className="flex-1 justify-center" onClick={() => setConfirmClear(false)}>
                Cancel
              </PrimaryBtn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}