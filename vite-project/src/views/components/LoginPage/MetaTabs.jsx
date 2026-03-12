import { C, BODY } from "../../../constants/theme";
export default function MetaTabs({ mode, onSwitch }) {
  return (
    <div
      className="flex gap-1 rounded-[13px] p-1 mb-6"
      style={{
        background:  C.cardInner,
        border:      `1px solid ${C.border}`,
        boxShadow:   "inset 0 2px 8px rgba(0,0,0,.3)",
      }}
    >
      {[
        { id:"login",  label:"Sign In",  icon:"→" },
        { id:"signup", label:"Sign Up",  icon:"✦" },
      ].map(t => (
        <button
          key={t.id}
          onClick={() => onSwitch(t.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-[10px] border-none text-sm font-semibold cursor-pointer transition-all duration-300"
          style={{
            fontFamily:  BODY,
            background:  mode === t.id
              ? `linear-gradient(135deg,${C.primary},${C.primaryDark})`
              : "transparent",
            color:       mode === t.id ? "#fff" : C.textSec,
            boxShadow:   mode === t.id
              ? `0 4px 16px ${C.primary}50, inset 0 1px 0 rgba(255,255,255,.15)`
              : "none",
            transform:   mode === t.id ? "translateY(-1px)" : "translateY(0)",
          }}
        >
          <span className="text-xs" style={{ opacity: mode === t.id ? 1 : 0.5 }}>
            {t.icon}
          </span>
          {t.label}
        </button>
      ))}
    </div>
  );
}