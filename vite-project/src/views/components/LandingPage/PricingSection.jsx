import { useVisible } from "../../../hooks/useVisible";

const plans = [
  { name:"Free", price:"0", period:"forever",
    desc:"Perfect for trying SpeakSync",
    features:["2 participants per call","30 min call limit","English ↔ Urdu translation","In-call chat","Meeting history (7 days)"],
    cta:"Get Started Free", featured:false },
  { name:"Pro", price:"9", period:"per month",
    desc:"For professionals & power users",
    features:["2 participants per call","Unlimited call duration","All translation features","Screen sharing","Full meeting history","Priority support"],
    cta:"Start Free Trial", featured:true },
  { name:"Academic", price:"Free", period:"for students",
    desc:"Free for FYP & university use",
    features:["All Pro features","Academic use only","University email required","FYP demo mode","Evaluation report export"],
    cta:"Apply for Access", featured:false },
];

export default function PricingSection({ onLogin }) {
  const [ref, visible] = useVisible();

  return (
    <section id="pricing" className="py-[100px] px-[72px] bg-darkCard border-t border-border" ref={ref}>
      <div className={`fade-up ${visible ? "visible" : ""} text-center mb-[60px]`}>
        <span className="font-body text-[13px] font-semibold tracking-[.1em] uppercase text-accent block mb-3">
          Pricing
        </span>
        <h2 className="font-display font-extrabold tracking-[-0.8px] mb-3.5 text-[clamp(28px,3.5vw,46px)]">
          Simple, <span className="gradient-text">Transparent Pricing</span>
        </h2>
        <p className="font-body text-base text-textSec">Start free. Upgrade when you're ready.</p>
      </div>

      <div className="grid grid-cols-3 gap-5 max-w-[960px] mx-auto items-start">
        {plans.map((p, i) => (
          <div key={i}
            className={`pricing-card ${p.featured ? "featured" : ""} fade-up ${visible ? "visible" : ""}`}
            style={{ animationDelay: `${i * 0.1}s` }}>
            {p.featured && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent rounded-full px-4 py-1 font-body text-xs font-semibold text-white whitespace-nowrap">
                Most Popular
              </div>
            )}
            <p className="font-display text-xl font-bold text-textPrim mb-1.5">{p.name}</p>
            <p className="font-body text-[13px] text-textSec mb-5">{p.desc}</p>
            <div className="mb-6">
              <span className={`font-display font-extrabold text-[42px] ${p.featured ? "text-primary" : "text-textPrim"}`}>
                {p.price === "Free" ? "Free" : `$${p.price}`}
              </span>
              {p.price !== "Free" && (
                <span className="font-body text-sm text-textSec ml-1.5">/{p.period}</span>
              )}
              {p.price === "Free" && p.name !== "Free" && (
                <span className="font-body text-[13px] text-textSec ml-1.5">{p.period}</span>
              )}
            </div>
            <button
              className={`${p.featured ? "btn-primary" : "btn-outline"} w-full py-3 text-[14.5px] rounded-lg mb-6`}
              onClick={onLogin}>
              {p.cta}
            </button>
            <div className="flex flex-col gap-2.5">
              {p.features.map((f, j) => (
                <div key={j} className="flex items-center gap-2.5">
                  <span className="text-success text-sm shrink-0">✓</span>
                  <span className="font-body text-[13.5px] text-textSec">{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}