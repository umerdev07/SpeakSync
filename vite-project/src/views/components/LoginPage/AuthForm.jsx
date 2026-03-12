import { useState } from "react";
import { C, DISPLAY, BODY } from "../../../constants/theme";
import AuthInput     from "./AuthInput";
import MetaTabs      from "./MetaTabs";
import SocialButtons from "./SocialButtons";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ mounted }) {
    const navigate = useNavigate();

  const [mode, setMode]         = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [errors, setErrors]     = useState({});
  const [form, setForm]         = useState({ name:"", email:"", password:"", confirm:"" });

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]:"" }));
  };

 const validate = () => {
  const e = {};

  if (mode === "signup") {
    if (!form.name.trim()) {
      e.name = "Name is required";
    }
  }

  if (!form.email.includes("@")) {
    e.email = "Enter a valid email";
  }

  if (mode !== "forgot") {
    if (form.password.length < 6) {
      e.password = "Min 6 characters";
    }
  }

  if (mode === "signup") {
    if (form.password !== form.confirm) {
      e.confirm = "Passwords don't match";
    }
  }

  return e;
};

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
       setTimeout(() => {
      setLoading(false);
      if (mode === "forgot") {
        setSent(true);
      } else {
        navigate("/dashboard"); // ← add this (covers both login & signup)
      }
    }, 1800);
  };

  const switchMode = (m) => {
    setMode(m); setErrors({}); setSent(false);
    setForm({ name:"", email:"", password:"", confirm:"" });
  };

  const EyeToggle = ({ show, onToggle }) => (
    <button type="button" onClick={onToggle}
      className="bg-transparent border-none cursor-pointer text-base p-0 leading-none transition-all duration-200 hover:scale-110"
      style={{ color: C.textSec }}
      onMouseEnter={e => e.currentTarget.style.color = C.textPrim}
      onMouseLeave={e => e.currentTarget.style.color = C.textSec}>
      {show ? "🙈" : "👁️"}
    </button>
  );

  return (
    <div
      className="w-full max-w-[410px] relative z-10 transition-all duration-[650ms] ease-out"
      style={{
        opacity:   mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(24px)",
      }}
    >
      {/* logo */}
      <div className="flex items-center gap-3 mb-9">
        <div
          className="w-10 h-10 rounded-[11px] flex items-center justify-center shrink-0"
          style={{
            background:`linear-gradient(135deg,${C.primary},${C.accent})`,
            boxShadow:`0 0 24px ${C.primary}55, inset 0 1px 0 rgba(255,255,255,.15)`,
          }}
        >
          <span style={{ fontFamily:DISPLAY, fontWeight:800, fontSize:"15px", color:"#fff" }}>SS</span>
        </div>
        <div>
          <span className="block leading-tight font-extrabold text-xl tracking-[-0.4px]"
            style={{ fontFamily:DISPLAY, color:C.textPrim }}>
            SpeakSync
          </span>
          <span className="text-[11px] tracking-[.04em]"
            style={{ fontFamily:BODY, color:C.textSec }}>
            Real-time translation
          </span>
        </div>
      </div>

      {/* tabs */}
      {mode !== "forgot" && <MetaTabs mode={mode} onSwitch={switchMode} />}

      {/* card */}
      <div
        className="rounded-[20px] p-8 relative overflow-hidden"
        style={{
          background: C.darkCard,
          border:     `1px solid ${C.border}`,
          boxShadow:  `0 24px 64px rgba(0,0,0,.6), 0 0 0 1px #ffffff04, inset 0 1px 0 rgba(255,255,255,.04)`,
        }}
      >
        {/* top gradient line */}
        <div className="absolute top-0 left-[10%] right-[10%] h-px"
          style={{ background:`linear-gradient(90deg,transparent,${C.primary}60,${C.accent}40,transparent)` }} />

        {/* heading */}
        <div className="mb-6">
          {mode === "forgot" && (
            <button onClick={() => switchMode("login")}
              className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[13px] mb-4 p-0 transition-colors duration-200"
              style={{ fontFamily:BODY, color:C.textSec }}
              onMouseEnter={e=>e.currentTarget.style.color=C.textPrim}
              onMouseLeave={e=>e.currentTarget.style.color=C.textSec}>
              ← Back to Sign In
            </button>
          )}
          <h1 className="font-extrabold text-2xl tracking-[-0.5px] mb-1.5"
            style={{ fontFamily:DISPLAY, color:C.textPrim }}>
            {mode==="login"  && "Welcome back 👋"}
            {mode==="signup" && "Create account ✨"}
            {mode==="forgot" && "Reset password 🔑"}
          </h1>
          <p className="text-sm leading-relaxed" style={{ fontFamily:BODY, color:C.textSec }}>
            {mode==="login"  && "Sign in to continue your conversations"}
            {mode==="signup" && "Join SpeakSync and break language barriers"}
            {mode==="forgot" && "We'll send a reset link to your inbox"}
          </p>
        </div>

        {/* forgot success */}
        {mode==="forgot" && sent ? (
          <ForgotSuccess email={form.email} onBack={() => switchMode("login")} />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {mode==="signup" && (
              <AuthInput label="Full Name" type="text" name="name"
                value={form.name} onChange={set("name")}
                placeholder="Ahmed Ali" icon="👤" error={errors.name} />
            )}

            <AuthInput label="Email Address" type="email" name="email"
              value={form.email} onChange={set("email")}
              placeholder="you@example.com" icon="✉️" error={errors.email} />

            {mode !== "forgot" && (
              <AuthInput label="Password"
                type={showPass ? "text" : "password"} name="password"
                value={form.password} onChange={set("password")}
                placeholder="Min. 6 characters" icon="🔒" error={errors.password}
                rightEl={<EyeToggle show={showPass} onToggle={() => setShowPass(!showPass)} />}
              />
            )}

            {mode==="signup" && (
              <AuthInput label="Confirm Password"
                type={showConf ? "text" : "password"} name="confirm"
                value={form.confirm} onChange={set("confirm")}
                placeholder="Repeat your password" icon="🔒" error={errors.confirm}
                rightEl={<EyeToggle show={showConf} onToggle={() => setShowConf(!showConf)} />}
              />
            )}

            {mode==="login" && (
              <div className="flex justify-end -mt-1">
                <button type="button" onClick={() => switchMode("forgot")}
                  className="bg-transparent border-none cursor-pointer text-[13px] p-0 transition-colors duration-200"
                  style={{ fontFamily:BODY, color:C.primary }}
                  onMouseEnter={e=>e.currentTarget.style.color=C.accent}
                  onMouseLeave={e=>e.currentTarget.style.color=C.primary}>
                  Forgot password?
                </button>
              </div>
            )}

            {mode==="signup" && (
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" className="mt-[3px] w-[15px] h-[15px] shrink-0"
                  style={{ accentColor:C.primary }} />
                <span className="text-[13px] leading-[1.6]" style={{ fontFamily:BODY, color:C.textSec }}>
                  I agree to the{" "}
                  <a href="#" style={{ color:C.primary, textDecoration:"none", borderBottom:`1px solid ${C.primary}40` }}>
                    Terms of Service
                  </a>{" "}and{" "}
                  <a href="#" style={{ color:C.primary, textDecoration:"none", borderBottom:`1px solid ${C.primary}40` }}>
                    Privacy Policy
                  </a>
                </span>
              </label>
            )}

            <SubmitButton loading={loading} mode={mode} />
          </form>
        )}

        {mode !== "forgot" && !sent && <SocialButtons />}
      </div>

      {/* bottom switch */}
      {mode !== "forgot" && (
        <p className="text-center text-sm mt-5" style={{ fontFamily:BODY, color:C.textSec }}>
          {mode==="login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => switchMode(mode==="login" ? "signup" : "login")}
            className="bg-transparent border-none cursor-pointer text-sm font-bold p-0 transition-colors duration-200"
            style={{ color:C.primary }}
            onMouseEnter={e=>e.currentTarget.style.color=C.accent}
            onMouseLeave={e=>e.currentTarget.style.color=C.primary}>
            {mode==="login" ? "Sign Up free →" : "Sign In →"}
          </button>
        </p>
      )}

      <p className="text-center text-xs mt-3.5" style={{ fontFamily:BODY, color:`${C.textSec}40` }}>
        <a href="/" className="no-underline transition-colors duration-200"
          style={{ color:"inherit" }}
          onMouseEnter={e=>e.currentTarget.style.color=C.textSec}
          onMouseLeave={e=>e.currentTarget.style.color=`${C.textSec}40`}>
          ← Back to Home
        </a>
      </p>
    </div>
  );
}

// ── sub-components ────────────────────────────────────────────────

function ForgotSuccess({ email, onBack }) {
  return (
    <div className="text-center py-3">
      <div className="w-16 h-16 rounded-[20px] mx-auto mb-[18px] flex items-center justify-center text-[32px]"
        style={{ background:`${C.success}18`, border:`1px solid ${C.success}40` }}>
        📬
      </div>
      <p className="font-bold text-[18px] mb-2" style={{ fontFamily:"'Syne',sans-serif", color:C.textPrim }}>
        Check your inbox!
      </p>
      <p className="text-sm leading-[1.7] mb-6" style={{ fontFamily:"'DM Sans',sans-serif", color:C.textSec }}>
        Reset link sent to <strong style={{ color:C.textPrim, fontWeight:600 }}>{email}</strong>
      </p>
      <button onClick={onBack}
        className="py-2.5 px-7 rounded-[10px] border-none text-white text-sm font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
        style={{
          fontFamily:"'DM Sans',sans-serif",
          background:`linear-gradient(135deg,${C.primary},${C.primaryDark})`,
          boxShadow:`0 4px 16px ${C.primary}40`,
        }}
        onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 8px 24px ${C.primary}55`}
        onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 4px 16px ${C.primary}40`}>
        Back to Sign In
      </button>
    </div>
  );
}

function SubmitButton({ loading, mode }) {
  const [hovered, setHovered] = useState(false);
  const label = mode==="forgot" ? "Send Reset Link →"
              : mode==="signup" ? "Create Account →"
              : "Sign In →";

  return (
    <button type="submit" disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full py-3.5 rounded-[11px] border-none text-white text-[15px] font-semibold tracking-[.02em] relative overflow-hidden transition-all duration-200"
      style={{
        fontFamily:"'DM Sans',sans-serif",
        background:`linear-gradient(135deg,${C.primary},${C.primaryDark})`,
        cursor:    loading ? "not-allowed" : "pointer",
        opacity:   loading ? 0.75 : 1,
        transform: hovered && !loading ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered && !loading
          ? `0 10px 30px ${C.primary}60, inset 0 1px 0 rgba(255,255,255,.2)`
          : `0 4px 20px ${C.primary}40, inset 0 1px 0 rgba(255,255,255,.12)`,
      }}
    >
      {/* shimmer */}
      {hovered && !loading && (
        <div className="absolute top-0 left-[-100%] w-[60%] h-full pointer-events-none animate-ticker"
          style={{ background:"linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent)" }} />
      )}

      {loading ? (
        <span className="flex items-center justify-center gap-2.5">
          <span className="w-4 h-4 rounded-full inline-block animate-spin"
            style={{ border:"2.5px solid rgba(255,255,255,.3)", borderTopColor:"#fff" }} />
          {mode==="forgot" ? "Sending link..." : mode==="signup" ? "Creating account..." : "Signing in..."}
        </span>
      ) : label}
    </button>
  );
}