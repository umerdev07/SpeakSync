import { useState, useEffect } from "react";
import { C } from "../../constants/theme";
import AuthForm    from "../components/LoginPage/AuthForm";
import SloganPanel from "../components/LoginPage/SloganPanel";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background:C.dark }}>

      {/* ── left: form panel ── */}
      <div
        className="w-1/2 min-h-screen flex items-center justify-center px-10 py-12 relative"
        style={{ borderRight:`1px solid ${C.border}` }}
      >
        {/* glow */}
        <div className="absolute top-[35%] left-[20%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background:`radial-gradient(circle,${C.primary}07 0%,transparent 65%)` }} />

        {/* dot grid */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage:"radial-gradient(#E6EDF3 1px,transparent 1px)", backgroundSize:"28px 28px" }} />

        <AuthForm mounted={mounted} />
      </div>

      {/* ── right: slogan panel ── */}
      <SloganPanel mounted={mounted} />
    </div>
  );
}