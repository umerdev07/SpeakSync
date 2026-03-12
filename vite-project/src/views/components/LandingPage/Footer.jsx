const cols = [
  { title:"Product",  links:["Features","How It Works","Pricing","Changelog"] },
  { title:"Tech",     links:["React.js","Node.js","WebRTC","Socket.io","FastAPI"] },
  { title:"Project",  links:["About FYP","SRS Document","Design Spec","GitHub"] },
];

export default function Footer() {
  return (
    <footer className="pt-14 pb-9 px-[72px] bg-darkCard border-t border-border">
      <div className="flex justify-between items-start mb-12 flex-wrap gap-8">
        {/* Brand */}
        <div className="max-w-[260px]">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              style={{ boxShadow: "0 0 16px #1A73E840" }}>
              <span className="font-display font-extrabold text-[13px] text-white">SS</span>
            </div>
            <span className="font-display font-extrabold text-[18px] text-textPrim">SpeakSync</span>
          </div>
          <p className="font-body text-[13.5px] text-textSec leading-[1.7]">
            Real-time English ↔ Urdu translation during live video calls.
            Breaking language barriers, one conversation at a time.
          </p>
        </div>

        {/* Link columns */}
        {cols.map(col => (
          <div key={col.title}>
            <p className="font-body text-xs font-semibold tracking-[.08em] uppercase text-textSec mb-4">
              {col.title}
            </p>
            <div className="flex flex-col gap-2.5">
              {col.links.map(l => (
                <a key={l} href="#"
                  className="font-body text-sm text-textSec no-underline transition-colors duration-200 hover:text-white">
                  {l}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border pt-6 flex justify-between items-center flex-wrap gap-3">
        <p className="font-body text-[13px] text-[#3a4555]">
          © 2026 SpeakSync — Final Year Project · Built with React.js, Node.js & WebRTC
        </p>
        <div className="flex gap-5">
          {["Privacy Policy","Terms of Service","Contact"].map(l => (
            <a key={l} href="#"
              className="font-body text-[13px] text-[#3a4555] no-underline transition-colors duration-200 hover:text-textSec">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}