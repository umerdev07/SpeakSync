import { useVisible } from "../../../hooks/useVisible";

const testimonials = [
  { name:"Dr. Sarah Ahmed", role:"University Lecturer, Lahore",
    text:"SpeakSync completely changed how I communicate with my international students. The Urdu translation is impressively accurate and nearly instant.",
    avatar:"SA", color:"#1A73E8" },
  { name:"Bilal Mahmood", role:"Software Engineer, Karachi",
    text:"I use it for client calls with English-speaking partners. It removes the language barrier completely — feels like a superpower.",
    avatar:"BM", color:"#00BFA5" },
  { name:"Prof. Ali Hassan", role:"FYP Evaluator",
    text:"An impressive final year project. The real-time translation pipeline is technically sound and the UI is polished. Well done.",
    avatar:"AH", color:"#9C27B0" },
];

export default function TestimonialsSection() {
  const [ref, visible] = useVisible();

  return (
    <section className="py-[100px] px-[72px] bg-dark" ref={ref}>
      <div className={`fade-up ${visible ? "visible" : ""} text-center mb-14`}>
        <span className="font-body text-[13px] font-semibold tracking-[.1em] uppercase text-primary block mb-3">
          What People Say
        </span>
        <h2 className="font-display font-extrabold tracking-[-0.8px] text-[clamp(28px,3.5vw,46px)]">
          Loved by <span className="gradient-text">Early Users</span>
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-5 max-w-[1100px] mx-auto">
        {testimonials.map((t, i) => (
          <div key={i} className={`testimonial-card fade-up ${visible ? "visible" : ""}`}
            style={{ animationDelay: `${i * 0.12}s` }}>
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <span key={j} className="text-[#F9A825] text-sm">★</span>
              ))}
            </div>
            <p className="font-body text-[14.5px] text-textSec leading-[1.8] mb-6 italic">
              "{t.text}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-extrabold text-sm"
                style={{ background: `${t.color}20`, border: `2px solid ${t.color}50`, color: t.color }}>
                {t.avatar}
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-textPrim">{t.name}</p>
                <p className="font-body text-xs text-textSec">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}