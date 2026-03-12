import { useState } from "react";
import { C, BODY } from "../../../constants/theme";

export default function AuthInput({
  label, type, name, value, onChange,
  placeholder, icon, rightEl, error,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">

      {/* label */}
      <label
        className="font-body text-[11.5px] font-bold tracking-[.08em] uppercase transition-colors duration-200"
        style={{ color: focused ? C.primary : C.textSec, fontFamily: BODY }}
      >
        {label}
      </label>

      {/* input wrapper */}
      <div className="relative">

        {/* left icon */}
        <span
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] pointer-events-none transition-opacity duration-200"
          style={{ opacity: focused ? 1 : 0.38 }}
        >
          {icon}
        </span>

        <input
          type={type} name={name} value={value}
          onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-[11px] py-3 pl-[42px] pr-11 text-sm outline-none transition-all duration-200"
          style={{
            fontFamily: BODY,
            background:  focused ? `${C.primary}07` : C.cardInner,
            border:      `1.5px solid ${error ? "#E53935CC" : focused ? C.primary : C.border}`,
            color:       C.textPrim,
            boxShadow:   focused
              ? `0 0 0 3px ${C.primary}18, 0 2px 12px rgba(0,0,0,.3)`
              : `0 2px 8px rgba(0,0,0,.2)`,
          }}
        />

        {/* right element */}
        {rightEl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightEl}
          </div>
        )}

        {/* bottom focus line */}
        <div
          className="absolute bottom-0 h-0.5 rounded-b-[11px] transition-all duration-300"
          style={{
            background: `linear-gradient(90deg,${C.primary},${C.accent})`,
            width:  focused ? "100%" : "0%",
            left:   focused ? "0%"   : "50%",
          }}
        />
      </div>

      {/* error */}
      {error && (
        <div className="flex items-center gap-1.5 text-[12px] animate-fadeUp" style={{ color:"#E53935", fontFamily: BODY }}>
          <span
            className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0"
            style={{ background:"#E5393520", border:"1px solid #E5393550" }}
          >
            !
          </span>
          {error}
        </div>
      )}
    </div>
  );
}