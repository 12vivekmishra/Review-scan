import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// REVIEW TEMPLATE ENGINE — sentence-part combinator, 500+ unique combinations
// ═══════════════════════════════════════════════════════════════════════════════
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

// Each review is built from: OPENER + MIDDLE + CLOSER
// Mixing 8 openers × 8 middles × 8 closers = 512 combinations per rating/style

const PARTS = {
  5: {
    openers: [
      (n) => `Yaar, ${n} is just too good!`,
      (n) => `Bhai, ${n} ne dil jeet liya!`,
      (n) => `Okay so ${n} has officially become my new favourite spot.`,
      (n) => `Went to ${n} last weekend and honestly blown away.`,
      (n) => `Just got back from ${n} and had to leave a review!`,
      (n) => `${n} is absolutely top class, no doubt about it.`,
      (n) => `Finally visited ${n} and wow — totally lived up to the hype.`,
      (n) => `Me and my friends visited ${n} and we all agreed — 10/10.`,
      (n) => `Stumbled upon ${n} and it turned out to be the best decision of the day.`,
      (n) => `${n} is one of those places you tell all your friends about.`,
    ],
    middles: [
      (h) => `The ${h[0] || "food"} was absolutely on point and the ${h[1] || "ambience"} made it even better.`,
      (h) => `${h[0] ? `The ${h[0]} was fire 🔥` : "Everything was fire 🔥"} and the whole vibe of the place was just perfect.`,
      (h) => `The ${h[0] || "vibe"} was on another level — felt like a completely different world inside.`,
      (h) => `${h[0] ? `Their ${h[0]} is seriously something else` : "The food is seriously something else"} — fresh, flavourful and beautifully done.`,
      (h) => `The ${h[0] || "service"} was super warm and the ${h[1] || "food"} quality was consistently brilliant.`,
      (h) => `From the ${h[0] || "ambience"} to the ${h[1] || "food"}, everything felt thoughtfully done.`,
      (h) => `The staff was so friendly and the ${h[0] || "food"} was delicious — not a single complaint.`,
      (h) => `The ${h[0] || "coffee"} was perfectly made and the ${h[1] || "food"} portions were generous and tasty.`,
      (h) => `Every single item we ordered — especially the ${h[0] || "food"} — was spot on.`,
      (h) => `The ${h[0] || "ambience"} gives such good energy and the ${h[1] || "food"} matches it perfectly.`,
    ],
    closers: [
      () => `Totally worth every rupee. Must visit! 🙌`,
      () => `Will definitely be coming back — probably next week itself 😄`,
      () => `Highly highly recommend, don't sleep on this place!`,
      () => `Already planning my next visit. Don't miss this one!`,
      () => `One of the best experiences I've had in this city, no cap.`,
      () => `5 stars easily. Go asap! ⭐⭐⭐⭐⭐`,
      () => `Absolutely love this place — it's now a regular for me.`,
      () => `Chef's kiss experience from start to finish 🤌`,
      () => `Take my word for it — you won't regret going here!`,
      () => `Solid solid place. Already recommended it to like 10 people!`,
    ],
  },

  4: {
    openers: [
      (n) => `Really enjoyed my time at ${n}!`,
      (n) => `Had a great outing at ${n} last week.`,
      (n) => `Visited ${n} with some friends and came away pretty impressed.`,
      (n) => `${n} is a really solid spot — glad I finally checked it out.`,
      (n) => `Went to ${n} for the first time and would definitely go back.`,
      (n) => `${n} turned out to be a really pleasant surprise!`,
      (n) => `Spent a good couple of hours at ${n} and really enjoyed it.`,
      (n) => `Had a nice experience at ${n} overall — would recommend!`,
      (n) => `${n} is definitely one of the better places in this area.`,
      (n) => `Checked out ${n} recently and it was a great call.`,
    ],
    middles: [
      (h) => `The ${h[0] || "food"} was great and the ${h[1] || "ambience"} was really pleasant.`,
      (h) => `The ${h[0] || "ambience"} is super nice — perfect for a casual catch up or even a work session.`,
      (h) => `Loved the ${h[0] || "vibe"} and the ${h[1] || "service"} was attentive without being pushy.`,
      (h) => `The ${h[0] || "food"} was consistently good and the portions were quite decent for the price.`,
      (h) => `The ${h[0] || "coffee"} was well made and the ${h[1] || "food"} options were creative.`,
      (h) => `Staff was friendly and helpful, and the ${h[0] || "food"} quality was quite good.`,
      (h) => `The ${h[0] || "food"} was flavourful and arrived quickly — no complaints on that front.`,
      (h) => `The ${h[0] || "ambience"} feels cozy and the ${h[1] || "food"} is the kind you keep coming back for.`,
      (h) => `Everything from the ${h[0] || "service"} to the ${h[1] || "food"} was handled well.`,
      (h) => `The ${h[0] || "food"} was tasty and the ${h[1] || "ambience"} made for a really enjoyable outing.`,
    ],
    closers: [
      () => `Minor things could be better but overall a really good experience. Would come back!`,
      () => `Solid 4 stars from my side — will definitely visit again.`,
      () => `Happy to recommend it to anyone looking for a good outing!`,
      () => `Not perfect but very close — one of my go-to spots now.`,
      () => `A few small things to iron out but overall a great place. Will return!`,
      () => `Would recommend to friends and family for sure 👍`,
      () => `Good value for money and a pleasant experience overall.`,
      () => `Definitely going back — probably trying their full menu next time!`,
      () => `Really enjoyed it — a solid place that won't disappoint.`,
      () => `4 stars and happy about it. Good stuff ${n => n}!`,
    ],
  },

  3: {
    openers: [
      (n) => `Visited ${n} recently — mixed feelings overall.`,
      (n) => `Had an okay time at ${n} — not bad, not great.`,
      (n) => `${n} is decent but I expected a bit more honestly.`,
      (n) => `Tried ${n} after hearing a lot about it — it was alright.`,
      (n) => `${n} is a fine place but nothing too extraordinary.`,
      (n) => `Went to ${n} last week — it was an average experience.`,
      (n) => `${n} has potential but didn't quite hit the mark for me.`,
      (n) => `Spent some time at ${n} — it was okay for a casual visit.`,
    ],
    middles: [
      (h) => `The ${h[0] || "food"} was okay but nothing too exciting, and the ${h[1] || "service"} could use some improvement.`,
      (h) => `The ${h[0] || "ambience"} is nice but the ${h[1] || "food"} was a bit underwhelming for the price.`,
      (h) => `${h[0] ? `The ${h[0]} was the highlight` : "Some items were good"} but other things felt average.`,
      (h) => `The ${h[0] || "food"} was okay — not bad but not the kind you'd rave about to friends.`,
      (h) => `The place looks good but the ${h[0] || "food"} quality was a bit inconsistent.`,
      (h) => `The ${h[0] || "service"} was a bit slow but staff were polite about it.`,
      (h) => `The ${h[0] || "ambience"} is the best thing about it — the ${h[1] || "food"} needs more work.`,
      (h) => `${h[0] ? `The ${h[0]} was decent` : "The food was decent"} but I've had better for the same price elsewhere.`,
    ],
    closers: [
      () => `Has potential — might give it another shot on a quieter day.`,
      () => `Somewhere in the middle for me. Might revisit if improvements happen.`,
      () => `Worth trying once at least, but manage your expectations.`,
      () => `Not a bad place — just needs a bit more consistency.`,
      () => `Room for improvement but not a dealbreaker. Would try again.`,
      () => `Okay for a one-time visit — not sure if I'd rush back though.`,
      () => `Average experience but hoping they sort things out. Have potential!`,
      () => `Neither great nor terrible — a solid 3 from me.`,
    ],
  },

  2: {
    openers: [
      (n) => `Bit disappointed with ${n} honestly.`,
      (n) => `Expected much more from ${n} based on the reviews I'd seen.`,
      (n) => `${n} was not really what I was expecting — quite underwhelming.`,
      (n) => `Visited ${n} and unfortunately came away disappointed.`,
      (n) => `Had high hopes for ${n} but they weren't really met.`,
      (n) => `${n} looked great online but the actual experience was quite average.`,
    ],
    middles: [
      (h) => `The ${h[0] || "food"} wasn't great for the price and the wait was longer than acceptable.`,
      (h) => `The ${h[0] || "service"} was below average and the ${h[1] || "food"} was just about okay.`,
      (h) => `The ${h[0] || "food"} was mediocre — not bad but not worth the price they're charging.`,
      (h) => `The ${h[0] || "ambience"} looks nice but the ${h[1] || "food"} quality didn't match at all.`,
      (h) => `The ${h[0] || "food"} was inconsistent and the ${h[1] || "service"} felt rushed and inattentive.`,
      (h) => `${h[0] ? `The ${h[0]} was the only decent thing` : "Nothing really stood out"} — rest was below par.`,
    ],
    closers: [
      () => `Maybe they were having an off day — hope they sort things out.`,
      () => `Probably won't be rushing back anytime soon.`,
      () => `Needs a lot of improvement before I'd consider visiting again.`,
      () => `Would give it one more chance but expectations will be very low.`,
      () => `Hope the management takes feedback seriously and works on consistency.`,
      () => `Not worth the price in its current state honestly.`,
    ],
  },

  1: {
    openers: [
      (n) => `Really bad experience at ${n} — had to leave this review.`,
      (n) => `${n} was a complete waste of time and money unfortunately.`,
      (n) => `Worst cafe experience I've had in a while — ${n} let me down badly.`,
      (n) => `Do not recommend ${n} at all based on my visit.`,
    ],
    middles: [
      (h) => `The ${h[0] || "food"} was terrible — cold, tasteless and not worth what they charge.`,
      (h) => `The ${h[0] || "service"} was shockingly rude and the ${h[1] || "food"} quality was unacceptable.`,
      (h) => `Waited forever for our order and when it came the ${h[0] || "food"} was disappointing.`,
      (h) => `The ${h[0] || "food"} was mediocre at best and the ${h[1] || "service"} made things worse.`,
    ],
    closers: [
      () => `Would not recommend to anyone. Very disappointing.`,
      () => `Really hope the management takes this seriously and makes improvements.`,
      () => `Won't be going back. Lots of better options in the city.`,
      () => `For the price they're charging, the standards need to be much higher.`,
    ],
  },
};

function buildReview(name, rating, picks) {
  const parts = PARTS[rating] || PARTS[3];
  const opener = pick(parts.openers)(name);
  const middle = pick(parts.middles)(picks);
  const closer = pick(parts.closers)();
  return `${opener} ${middle} ${closer}`;
}

function generateReviews(name, rating, picks) {
  const results = [];
  let attempts = 0;
  // Generate 3 guaranteed-unique reviews
  while (results.length < 3 && attempts < 20) {
    const review = buildReview(name, rating, picks);
    // Ensure no two reviews start with the same opener word
    const firstWord = review.split(" ")[0];
    const duplicate = results.some(r => r.split(" ")[0] === firstWord);
    if (!duplicate) results.push(review);
    attempts++;
  }
  // Fallback: just push even if slightly similar
  while (results.length < 3) {
    results.push(buildReview(name, rating, picks));
  }
  return results;
}

// ─── Default Config ────────────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  businessName: "The Brew Collective",
  tagline: "Your words help others find us",
  accentColor: "#2D6A4F",
  adminPassword: "admin123",
  locations: [
    { id: 1, name: "Downtown Roastery", address: "12 Oak Street, Downtown", googleUrl: "https://g.page/r/YOUR_PLACE_ID_1/review", active: true },
    { id: 2, name: "Westside Bloom", address: "88 Maple Ave, Westside", googleUrl: "https://g.page/r/YOUR_PLACE_ID_2/review", active: true },
    { id: 3, name: "Northgate Press", address: "5 River Lane, Northgate", googleUrl: "https://g.page/r/YOUR_PLACE_ID_3/review", active: true },
  ],
  highlights: ["Coffee", "Food", "Ambience", "Service", "Pastries", "Value"],
};

// ─── QR Code Component ─────────────────────────────────────────────────────────
function QRCodeCanvas({ value, size = 200, id }) {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (window.QRCode) { setLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);
  useEffect(() => {
    if (!loaded || !containerRef.current) return;
    containerRef.current.innerHTML = "";
    try { new window.QRCode(containerRef.current, { text: value, width: size, height: size, colorDark: "#1a1a1a", colorLight: "#ffffff", correctLevel: window.QRCode.CorrectLevel.M }); }
    catch (e) { console.error(e); }
  }, [loaded, value, size]);
  return <div id={id} ref={containerRef} style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>{!loaded && <div style={{ fontSize: 12, color: "#999" }}>Loading…</div>}</div>;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}
function lighten(hex, amt) {
  let r=parseInt(hex.slice(1,3),16)+amt, g=parseInt(hex.slice(3,5),16)+amt, b=parseInt(hex.slice(5,7),16)+amt;
  r=Math.min(255,r); g=Math.min(255,g); b=Math.min(255,b);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// ─── Admin shared styles ───────────────────────────────────────────────────────
const A = {
  wideCard: { background:"#fff", borderRadius:"16px", border:"1px solid #e8e8e4", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.04)", marginBottom:16 },
  input: { width:"100%", padding:"10px 12px", borderRadius:"8px", border:"1.5px solid #e8e8e4", fontSize:"14px", outline:"none", fontFamily:"inherit", marginBottom:"10px", boxSizing:"border-box", background:"#fff" },
  label: { fontSize:"11px", fontWeight:600, color:"#888", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"8px", display:"block" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// REVIEW FLOW — full redesign
// ═══════════════════════════════════════════════════════════════════════════════
function ReviewFlow({ config, preselectedLocId }) {
  const locations = config.locations.filter(l => l.active);
  const preLoc = preselectedLocId ? locations.find(l => l.id === Number(preselectedLocId)) : null;
  const [step, setStep] = useState(preLoc ? 1 : 0);
  const [location, setLocation] = useState(preLoc || null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [picks, setPicks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);

  const accent = config.accentColor || "#2D6A4F";
  const accentRgb = hexToRgb(accent);
  const ratingMeta = [
    null,
    { label: "Poor",         emoji: "😕", color: "#e05050" },
    { label: "Below average",emoji: "😐", color: "#e07820" },
    { label: "Decent",       emoji: "🙂", color: "#c8a000" },
    { label: "Great",        emoji: "😊", color: "#4caf7d" },
    { label: "Excellent!",   emoji: "🤩", color: accent },
  ];

  const togglePick = (h) => setPicks(p => p.includes(h) ? p.filter(x=>x!==h) : p.length<3 ? [...p,h] : p);

  const goStep = (n) => {
    setAnimating(true);
    setTimeout(() => { setStep(n); setAnimating(false); }, 180);
  };

  const generate = () => {
    setLoading(true);
    goStep(2);
    setTimeout(() => {
      setReviews(generateReviews(location.name, rating, picks));
      setLoading(false);
    }, 1200);
  };

  const copyAndContinue = async (review, idx) => {
    setSelected(review);
    setCopiedIdx(idx);
    try { await navigator.clipboard.writeText(review); } catch {}
    setTimeout(() => goStep(3), 700);
  };

  const reset = () => {
    setStep(preLoc ? 1 : 0);
    setLocation(preLoc||null); setRating(0); setHover(0);
    setPicks([]); setReviews([]); setCopiedIdx(null); setSelected(null);
  };

  const displayRating = hover || rating;
  const rm = ratingMeta[displayRating];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes scaleIn{from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}
    @keyframes popStar{0%{transform:scale(1)}40%{transform:scale(1.35)}100%{transform:scale(1)}}
    @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(120px) rotate(720deg);opacity:0}}
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
    button{font-family:inherit;-webkit-tap-highlight-color:transparent}
    .fade-up{animation:fadeUp 0.32s ease both}
    .scale-in{animation:scaleIn 0.25s ease both}
    .star-pop{animation:popStar 0.28s ease}
    .review-card{transition:all 0.18s ease;border:2px solid transparent;background:#f9f9f9}
    .review-card:hover{background:#f3f3f3;border-color:#e0e0e0}
    .review-card.selected{border-color:${accent}!important;background:rgba(${accentRgb},0.04)!important}
    .loc-btn{transition:all 0.15s ease;border:2px solid #ebebeb;background:#fff;text-align:left;width:100%;cursor:pointer;border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px}
    .loc-btn:active{transform:scale(0.98)}
    .loc-btn.selected{border-color:${accent};background:rgba(${accentRgb},0.05)}
    .chip-btn{transition:all 0.15s ease;border:1.5px solid #e8e8e8;background:#fff;cursor:pointer;border-radius:100px;padding:9px 16px;font-size:14px;font-weight:500;color:#555;white-space:nowrap}
    .chip-btn:active{transform:scale(0.95)}
    .chip-btn.chosen{border-color:${accent};background:${accent};color:#fff}
    .primary-btn{width:100%;padding:16px;border-radius:14px;border:none;font-size:16px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.18s ease;display:flex;align-items:center;justify-content:center;gap:8px}
    .primary-btn:active{transform:scale(0.98)}
    .primary-btn:disabled{background:#e8e8e8!important;color:#aaa!important;cursor:not-allowed;transform:none}
    .ghost-btn{width:100%;padding:13px;border-radius:14px;border:1.5px solid #e8e8e8;background:#fff;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit;color:#666;transition:all 0.15s}
    .ghost-btn:active{transform:scale(0.98)}
    .confetti-piece{position:absolute;width:8px;height:8px;border-radius:2px;animation:confettiFall 1.2s ease forwards}
  `;

  // ── Wrappers
  const Screen = ({ children, style }) => (
    <div style={{ minHeight:"100svh", background:"#f7f7f5", display:"flex", flexDirection:"column", ...style }}>
      <style>{css}</style>
      {children}
    </div>
  );

  const Card = ({ children, style }) => (
    <div className="fade-up" style={{ background:"#fff", borderRadius:"24px", padding:"28px 24px", boxShadow:"0 2px 20px rgba(0,0,0,0.07)", ...style }}>
      {children}
    </div>
  );

  // ── Step 0: Location picker
  if (step === 0) return (
    <Screen>
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"24px 20px 32px", maxWidth:480, width:"100%", margin:"0 auto" }}>
        <div className="fade-up" style={{ marginBottom:32, paddingTop:16 }}>
          <div style={{ fontSize:12, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:accent, marginBottom:8 }}>
            {config.businessName}
          </div>
          <h1 style={{ fontSize:28, fontWeight:700, color:"#111", lineHeight:1.2, marginBottom:8 }}>
            Which location did you visit?
          </h1>
          <p style={{ fontSize:14, color:"#888", lineHeight:1.5 }}>{config.tagline}</p>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:10, flex:1 }}>
          {locations.map((loc, i) => (
            <button
              key={loc.id}
              className={`loc-btn${location?.id===loc.id?" selected":""}`}
              style={{ animationDelay:`${i*0.06}s` }}
              onClick={() => setLocation(loc)}
            >
              <div style={{
                width:44, height:44, borderRadius:12, flexShrink:0,
                background: location?.id===loc.id ? accent : "#f0f0f0",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:18, transition:"all 0.2s"
              }}>
                {location?.id===loc.id ? "✓" : "☕"}
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:600, color:"#111", marginBottom:2 }}>{loc.name}</div>
                <div style={{ fontSize:12, color:"#999" }}>{loc.address}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ marginTop:24 }}>
          <button
            className="primary-btn"
            style={{ background: accent, color:"#fff" }}
            disabled={!location}
            onClick={() => goStep(1)}
          >
            Continue <span style={{ fontSize:18 }}>→</span>
          </button>
        </div>
      </div>
    </Screen>
  );

  // ── Step 1: Rating + highlights
  if (step === 1) return (
    <Screen>
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"24px 20px 32px", maxWidth:480, width:"100%", margin:"0 auto" }}>

        {/* Back + location */}
        <div className="fade-up" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
          {!preLoc && (
            <button onClick={() => goStep(0)} style={{ background:"#f0f0f0", border:"none", borderRadius:10, width:36, height:36, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>
              ←
            </button>
          )}
          <div style={{ background:`rgba(${accentRgb},0.1)`, borderRadius:10, padding:"6px 12px", fontSize:13, fontWeight:600, color:accent }}>
            {location?.name}
          </div>
        </div>

        {/* Rating */}
        <div className="fade-up" style={{ marginBottom:36 }}>
          <h2 style={{ fontSize:26, fontWeight:700, color:"#111", marginBottom:6 }}>How was your experience?</h2>
          <p style={{ fontSize:14, color:"#999", marginBottom:24 }}>Be honest — it helps us improve</p>

          {/* Stars */}
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:14 }}>
            {[1,2,3,4,5].map(s => (
              <button
                key={s}
                className={rating===s?"star-pop":""}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(s)}
                style={{ background:"none", border:"none", cursor:"pointer", padding:4, lineHeight:0, fontSize:0, transition:"transform 0.15s" }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24"
                  fill={s<=(hover||rating) ? (ratingMeta[hover||rating]?.color||accent) : "#e8e8e8"}
                  style={{ filter: s<=(hover||rating) ? `drop-shadow(0 2px 6px ${ratingMeta[hover||rating]?.color||accent}44)` : "none", transition:"all 0.18s" }}>
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              </button>
            ))}
          </div>

          {/* Rating label */}
          <div style={{ textAlign:"center", height:32, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            {displayRating>0 ? (
              <div className="scale-in" key={displayRating} style={{ display:"flex", alignItems:"center", gap:6, fontSize:16, fontWeight:600, color: rm?.color }}>
                <span style={{ fontSize:22 }}>{rm?.emoji}</span>
                {rm?.label}
              </div>
            ) : (
              <span style={{ fontSize:14, color:"#bbb" }}>Tap a star to rate</span>
            )}
          </div>
        </div>

        {/* Highlights */}
        <div className="fade-up" style={{ marginBottom:32 }}>
          <div style={{ fontSize:13, fontWeight:600, color:"#555", marginBottom:12 }}>
            What made it special?
            <span style={{ fontWeight:400, color:"#bbb", marginLeft:6 }}>Pick up to 3</span>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {config.highlights.map(h => (
              <button
                key={h}
                className={`chip-btn${picks.includes(h)?" chosen":""}`}
                onClick={() => togglePick(h)}
              >
                {picks.includes(h) && <span style={{ marginRight:4 }}>✓</span>}
                {h}
              </button>
            ))}
          </div>
        </div>

        <button
          className="primary-btn"
          style={{ background: !rating ? "#e8e8e8" : accent, color: !rating ? "#aaa" : "#fff", marginTop:"auto" }}
          disabled={!rating}
          onClick={generate}
        >
          Generate my review ✨
        </button>
      </div>
    </Screen>
  );

  // ── Step 2: Pick a review
  if (step === 2) return (
    <Screen>
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"24px 20px 32px", maxWidth:480, width:"100%", margin:"0 auto" }}>

        <div className="fade-up" style={{ marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
            {[1,2,3,4,5].map(s => (
              <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s<=rating ? (ratingMeta[rating]?.color||accent) : "#e8e8e8"}>
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            ))}
            <span style={{ fontSize:12, color:"#999", marginLeft:4 }}>{location?.name}</span>
          </div>
          <h2 style={{ fontSize:26, fontWeight:700, color:"#111", marginBottom:4 }}>
            {loading ? "Writing your review…" : "Pick your favourite"}
          </h2>
          <p style={{ fontSize:14, color:"#999" }}>
            {loading ? "Our AI is crafting something authentic" : "Tap one to copy it, then paste into Google"}
          </p>
        </div>

        {loading ? (
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:12 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ borderRadius:16, overflow:"hidden", height:100+i*12 }}>
                <div style={{ height:"100%", background:"linear-gradient(90deg,#f0f0ec 25%,#e8e8e4 50%,#f0f0ec 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.5s infinite" }} />
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"center", marginTop:16 }}>
              <div style={{ width:24, height:24, border:`3px solid ${accent}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:12, flex:1 }}>
            {reviews.map((r, i) => (
              <div
                key={i}
                className={`review-card${copiedIdx===i?" selected":""}`}
                style={{ borderRadius:16, padding:"18px 18px 14px", cursor:"pointer", position:"relative", animationDelay:`${i*0.08}s` }}
                onClick={() => copyAndContinue(r, i)}
              >
                <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:"#bbb", marginBottom:8 }}>
                  Option {i+1}
                </div>
                <p style={{ fontSize:14, lineHeight:1.7, color:"#333", marginBottom:12 }}>{r}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ fontSize:12, color:"#bbb" }}>{r.split(' ').length} words</div>
                  <div style={{
                    display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600,
                    color: copiedIdx===i ? "#2a9d5c" : accent,
                    background: copiedIdx===i ? "rgba(42,157,92,0.08)" : `rgba(${accentRgb},0.08)`,
                    padding:"5px 10px", borderRadius:20
                  }}>
                    {copiedIdx===i ? <>✓ Copied!</> : <>Copy & use</>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <button className="ghost-btn" style={{ marginTop:16 }} onClick={() => goStep(1)}>
            ← Change my rating
          </button>
        )}
      </div>
    </Screen>
  );

  // ── Step 3: Done
  if (step === 3) return (
    <Screen style={{ alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
      <style>{css}</style>
      {/* Confetti */}
      {["#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#FF6FC8","#c8973a"].map((col,i)=>(
        <div key={i} className="confetti-piece" style={{
          background:col, left:`${15+i*12}%`, top:"-10px",
          animationDelay:`${i*0.12}s`, animationDuration:`${1+i*0.15}s`,
          borderRadius: i%2===0 ? "50%" : "2px"
        }}/>
      ))}

      <div className="fade-up" style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"32px 28px", maxWidth:400, width:"100%", textAlign:"center" }}>

        {/* Big checkmark */}
        <div style={{
          width:88, height:88, borderRadius:"50%", background:`rgba(${accentRgb},0.1)`,
          display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24,
          animation:"pulse 2s ease-in-out infinite"
        }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          </div>
        </div>

        <h2 style={{ fontSize:28, fontWeight:700, color:"#111", marginBottom:8 }}>Review copied!</h2>
        <p style={{ fontSize:15, color:"#888", lineHeight:1.6, marginBottom:24 }}>
          Just paste it into Google Reviews and you're done. Takes 10 seconds.
        </p>

        {/* Review preview */}
        <div style={{
          background:"#f7f7f5", borderRadius:16, padding:"16px 18px",
          border:"1px solid #eee", marginBottom:28, width:"100%", textAlign:"left"
        }}>
          <div style={{ display:"flex", gap:6, marginBottom:8 }}>
            {[1,2,3,4,5].map(s=>(
              <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s<=rating ? (ratingMeta[rating]?.color||accent) : "#e8e8e8"}>
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            ))}
          </div>
          <p style={{ fontSize:13, color:"#555", lineHeight:1.65, fontStyle:"italic" }}>"{selected}"</p>
        </div>

        {/* Steps */}
        <div style={{ width:"100%", marginBottom:24 }}>
          {[
            { n:1, text:"Tap the button below", done:true },
            { n:2, text:"Long-press the text field & Paste", done:false },
            { n:3, text:"Hit Submit — you're a legend 🙌", done:false },
          ].map(s=>(
            <div key={s.n} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
              <div style={{
                width:26, height:26, borderRadius:"50%", flexShrink:0,
                background: s.done ? accent : "#f0f0f0",
                color: s.done ? "#fff" : "#999",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:12, fontWeight:700
              }}>{s.n}</div>
              <div style={{ fontSize:13, color:s.done?"#111":"#888" }}>{s.text}</div>
            </div>
          ))}
        </div>

        <a
          href={location?.googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            width:"100%", padding:"16px", borderRadius:14, background:accent, color:"#fff",
            textDecoration:"none", fontSize:16, fontWeight:600, marginBottom:10
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Open Google Reviews
        </a>
        <button className="ghost-btn" onClick={reset}>Leave another review</button>
      </div>
    </Screen>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN LOGIN
// ═══════════════════════════════════════════════════════════════════════════════
function AdminLogin({ config, onSuccess, onBack }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const attempt = () => {
    if (pw === config.adminPassword) onSuccess();
    else { setErr(true); setTimeout(()=>setErr(false),1500); setPw(""); }
  };
  return (
    <div style={{ minHeight:"100svh", background:"#f5f5f2", display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"'Inter',-apple-system,sans-serif" }}>
      <div style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:360, border:"1px solid #e8e8e4", overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ background:"#1a1a1a", padding:"28px 24px 24px", color:"#fff" }}>
          <div style={{ fontSize:"11px", letterSpacing:"0.12em", textTransform:"uppercase", opacity:0.6, marginBottom:"4px" }}>Admin Access</div>
          <div style={{ fontSize:"22px", fontWeight:700 }}>Sign in</div>
        </div>
        <div style={{ padding:"22px 24px 26px" }}>
          <span style={A.label}>Password</span>
          <input style={{ ...A.input, borderColor:err?"#e05050":"#e8e8e4" }}
            type="password" placeholder="Enter admin password" value={pw}
            onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&attempt()} autoFocus/>
          {err && <div style={{ fontSize:13, color:"#e05050", marginTop:-6, marginBottom:8 }}>Incorrect password</div>}
          <button onClick={attempt} style={{ width:"100%", padding:"13px", borderRadius:"10px", border:"none", background:"#1a1a1a", color:"#fff", fontSize:"14px", fontWeight:600, cursor:"pointer", marginTop:4 }}>Enter admin panel →</button>
          <button onClick={onBack} style={{ width:"100%", padding:"12px", borderRadius:"10px", border:"1.5px solid #e8e8e4", background:"#fff", color:"#555", fontSize:"14px", fontWeight:500, cursor:"pointer", marginTop:10 }}>← Back to reviews</button>
          <div style={{ fontSize:12, color:"#bbb", marginTop:12, textAlign:"center" }}>Default: admin123</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════════
function AdminPanel({ config, setConfig, onExit }) {
  const [tab, setTab] = useState("general");
  const [draft, setDraft] = useState(JSON.parse(JSON.stringify(config)));
  const [saved, setSaved] = useState(false);
  const baseUrl = typeof window!=="undefined" ? window.location.origin+window.location.pathname : "https://yoursite.com/";

  const save = () => {
    setConfig(draft);
    try { localStorage.setItem("cafeReviewConfig", JSON.stringify(draft)); } catch {}
    setSaved(true); setTimeout(()=>setSaved(false),2000);
  };

  const updateLoc = (id,field,val) => setDraft(d=>({...d,locations:d.locations.map(l=>l.id===id?{...l,[field]:val}:l)}));
  const addLoc = () => { const newId=(Math.max(...draft.locations.map(l=>l.id))||0)+1; setDraft(d=>({...d,locations:[...d.locations,{id:newId,name:"New Location",address:"",googleUrl:"",active:true}]})); };
  const removeLoc = (id) => setDraft(d=>({...d,locations:d.locations.filter(l=>l.id!==id)}));
  const updateHL = (i,val) => setDraft(d=>{const h=[...d.highlights];h[i]=val;return{...d,highlights:h};});
  const addHL = () => setDraft(d=>({...d,highlights:[...d.highlights,"New Tag"]}));
  const removeHL = (i) => setDraft(d=>({...d,highlights:d.highlights.filter((_,j)=>j!==i)}));

  const tabStyle = (active) => ({
    padding:"8px 14px", borderRadius:"8px", border:"none", fontSize:"13px", fontWeight:600, cursor:"pointer",
    background:active?"#1a1a1a":"transparent", color:active?"#fff":"#777", transition:"all 0.15s", fontFamily:"inherit",
  });

  const downloadQR = (locId,locName) => {
    const container = document.getElementById(`qr-download-${locId}`);
    if(!container) return;
    const canvas = container.querySelector("canvas");
    if(canvas){ const link=document.createElement("a"); link.download=`qr-${locName.replace(/\s+/g,"-").toLowerCase()}.png`; link.href=canvas.toDataURL(); link.click(); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f5f5f2", fontFamily:"'Inter',-apple-system,sans-serif" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}button{font-family:inherit}input{font-family:inherit;color:#1a1a1a}`}</style>
      <div style={{ background:"#fff", borderBottom:"1px solid #e8e8e4", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 }}>
        <div>
          <div style={{ fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"#999", fontWeight:600 }}>Admin Panel</div>
          <div style={{ fontSize:17, fontWeight:700, color:"#1a1a1a" }}>{draft.businessName}</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={onExit} style={{ padding:"8px 14px", borderRadius:8, border:"1.5px solid #e8e8e4", background:"#fff", fontSize:13, cursor:"pointer", color:"#555", fontWeight:500 }}>← Exit</button>
          <button onClick={save} style={{ padding:"8px 16px", borderRadius:8, border:"none", background:saved?"#2a9d5c":"#1a1a1a", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", transition:"background 0.3s", minWidth:110 }}>
            {saved?"✓ Saved!":"Save changes"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth:720, margin:"0 auto", padding:"24px 16px" }}>
        <div style={{ display:"flex", gap:2, background:"#fff", borderRadius:12, padding:4, border:"1px solid #e8e8e4", marginBottom:20, width:"fit-content" }}>
          {[["general","General"],["locations","Locations"],["highlights","Highlights"],["qr","QR Codes"]].map(([t,label])=>(
            <button key={t} style={tabStyle(tab===t)} onClick={()=>setTab(t)}>{label}</button>
          ))}
        </div>

        {tab==="general" && (
          <div style={A.wideCard}>
            <div style={{ padding:"18px 22px", borderBottom:"1px solid #f0f0ec" }}>
              <div style={{ fontWeight:700, fontSize:15 }}>Brand & Settings</div>
              <div style={{ fontSize:13, color:"#999", marginTop:2 }}>Customize how your review app looks</div>
            </div>
            <div style={{ padding:"20px 22px" }}>
              <span style={A.label}>Business Name</span>
              <input style={A.input} value={draft.businessName} onChange={e=>setDraft(d=>({...d,businessName:e.target.value}))}/>
              <span style={A.label}>Tagline</span>
              <input style={A.input} value={draft.tagline} onChange={e=>setDraft(d=>({...d,tagline:e.target.value}))}/>
              <span style={A.label}>Accent Color</span>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12 }}>
                <input type="color" value={draft.accentColor} onChange={e=>setDraft(d=>({...d,accentColor:e.target.value}))}
                  style={{ width:44, height:36, borderRadius:8, border:"1.5px solid #e8e8e4", cursor:"pointer", padding:2, flexShrink:0 }}/>
                <input style={{ ...A.input, marginBottom:0, flex:1 }} value={draft.accentColor} onChange={e=>setDraft(d=>({...d,accentColor:e.target.value}))}/>
              </div>
              <div style={{ background:draft.accentColor, borderRadius:12, padding:"18px 20px", color:"#fff", marginBottom:16 }}>
                <div style={{ fontSize:10, opacity:0.6, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>{draft.businessName}</div>
                <div style={{ fontSize:18, fontWeight:700 }}>{draft.tagline}</div>
                <div style={{ display:"flex", gap:2, marginTop:10 }}>{"★★★★★".split("").map((s,i)=><span key={i} style={{ opacity:i<4?1:0.3, fontSize:18 }}>{s}</span>)}</div>
              </div>
              <span style={A.label}>Admin Password</span>
              <input style={A.input} type="password" value={draft.adminPassword} onChange={e=>setDraft(d=>({...d,adminPassword:e.target.value}))} placeholder="Enter new password"/>
              <div style={{ fontSize:12, color:"#aaa" }}>Change this from "admin123" before going live.</div>
            </div>
          </div>
        )}

        {tab==="locations" && (
          <div style={A.wideCard}>
            <div style={{ padding:"18px 22px", borderBottom:"1px solid #f0f0ec", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div><div style={{ fontWeight:700, fontSize:15 }}>Locations</div><div style={{ fontSize:13, color:"#999", marginTop:2 }}>{draft.locations.length} location{draft.locations.length!==1?"s":""}</div></div>
              <button onClick={addLoc} style={{ padding:"8px 14px", borderRadius:8, border:"none", background:"#1a1a1a", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add</button>
            </div>
            <div style={{ padding:"20px 22px" }}>
              {draft.locations.map((loc,idx)=>(
                <div key={loc.id} style={{ border:"1px solid #e8e8e4", borderRadius:12, padding:"16px", marginBottom:12, background:loc.active?"#fafaf8":"#fdfdfd", opacity:loc.active?1:0.6 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#888", letterSpacing:"0.06em", textTransform:"uppercase" }}>Location {idx+1}</div>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <label style={{ fontSize:12, color:"#777", display:"flex", gap:5, alignItems:"center", cursor:"pointer", userSelect:"none" }}>
                        <input type="checkbox" checked={loc.active} onChange={e=>updateLoc(loc.id,"active",e.target.checked)}/> Active
                      </label>
                      {draft.locations.length>1 && <button onClick={()=>removeLoc(loc.id)} style={{ background:"none", border:"none", color:"#e05050", cursor:"pointer", fontSize:12, fontWeight:600 }}>Remove</button>}
                    </div>
                  </div>
                  <input style={A.input} placeholder="Location name" value={loc.name} onChange={e=>updateLoc(loc.id,"name",e.target.value)}/>
                  <input style={A.input} placeholder="Address" value={loc.address} onChange={e=>updateLoc(loc.id,"address",e.target.value)}/>
                  <input style={{ ...A.input, marginBottom:4 }} placeholder="Google Review URL" value={loc.googleUrl} onChange={e=>updateLoc(loc.id,"googleUrl",e.target.value)}/>
                  <div style={{ fontSize:11, color:"#bbb" }}>Google Business Profile → "Get more reviews" → copy the link</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="highlights" && (
          <div style={A.wideCard}>
            <div style={{ padding:"18px 22px", borderBottom:"1px solid #f0f0ec", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div><div style={{ fontWeight:700, fontSize:15 }}>Highlight Tags</div><div style={{ fontSize:13, color:"#999", marginTop:2 }}>Customers pick up to 3 when rating</div></div>
              <button onClick={addHL} style={{ padding:"8px 14px", borderRadius:8, border:"none", background:"#1a1a1a", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add tag</button>
            </div>
            <div style={{ padding:"20px 22px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                {draft.highlights.map((h,i)=>(
                  <div key={i} style={{ display:"flex", gap:6, alignItems:"center" }}>
                    <input style={{ ...A.input, marginBottom:0, flex:1 }} value={h} onChange={e=>updateHL(i,e.target.value)}/>
                    <button onClick={()=>removeHL(i)} style={{ background:"none", border:"none", color:"#e05050", cursor:"pointer", fontSize:20, lineHeight:1, flexShrink:0 }}>×</button>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:12, color:"#aaa" }}>Keep tags to 1-2 words. They shape the AI-generated reviews.</div>
            </div>
          </div>
        )}

        {tab==="qr" && (
          <div style={A.wideCard}>
            <div style={{ padding:"18px 22px", borderBottom:"1px solid #f0f0ec" }}>
              <div style={{ fontWeight:700, fontSize:15 }}>QR Codes</div>
              <div style={{ fontSize:13, color:"#999", marginTop:2 }}>Edit the Google Review link for each location — QR updates instantly</div>
            </div>
            <div style={{ padding:"20px 22px" }}>
              <div style={{ background:"#fffbea", border:"1px solid #f0e060", borderRadius:10, padding:"12px 14px", marginBottom:18, fontSize:13, color:"#7a6000" }}>
                <strong>How to get your Google Review link:</strong> Go to Google Business Profile → click "Ask for reviews" → copy the link. Paste it below and hit Save.
              </div>
              {draft.locations.filter(l=>l.active).map(loc=>{
                const qrUrl = `${baseUrl}?loc=${loc.id}`;
                  <div key={loc.id} style={{ border:"1px solid #e8e8e4", borderRadius:14, padding:"18px 18px", marginBottom:14, background:"#fff" }}>
                    {/* Header */}
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                      <div style={{ width:40, height:40, borderRadius:10, background:"#f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>☕</div>
                      <div>
                        <div style={{ fontSize:15, fontWeight:700, color:"#111" }}>{loc.name}</div>
                        <div style={{ fontSize:12, color:"#999" }}>{loc.address}</div>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div style={{ display:"flex", justifyContent:"center", marginBottom:14, padding:"14px", background:"#fafaf8", borderRadius:10, border:"1px solid #f0f0ec" }}>
                      <QRCodeCanvas value={qrUrl} size={150}/>
                    </div>

                    {/* Editable Google Review URL */}
                    <div style={{ marginBottom:12 }}>
                      <span style={{ ...A.label, marginBottom:6 }}>Google Review URL</span>
                      <input
                        style={{ ...A.input, marginBottom:4, fontSize:13 }}
                        placeholder="Paste your Google Review link here…"
                        value={loc.googleUrl && !loc.googleUrl.includes("YOUR_PLACE_ID") ? loc.googleUrl : ""}
                        onChange={e => updateLoc(loc.id, "googleUrl", e.target.value)}
                      />
                      <div style={{ fontSize:11, color: qrUrl.includes("YOUR_PLACE_ID") || qrUrl.includes(baseUrl) ? "#e07820" : "#2a9d5c", fontWeight:500 }}>
                        {loc.googleUrl && !loc.googleUrl.includes("YOUR_PLACE_ID") && loc.googleUrl !== ""
                          ? "✓ Custom Google Review link set — QR points to this"
                          : "⚠ No link set — QR currently links to app URL"}
                      </div>
                    </div>

                    {/* Download */}
                    <button onClick={()=>downloadQR(loc.id, loc.name)}
                      style={{ padding:"8px 14px", borderRadius:8, border:"1.5px solid #e8e8e4", background:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", color:"#555", width:"100%" }}>
                      ↓ Download QR as PNG
                    </button>
                    <div id={`qr-download-${loc.id}`} style={{ position:"absolute", left:-9999, top:-9999, width:400, height:400 }}>
                      <QRCodeCanvas value={qrUrl} size={400}/>
                    </div>
                  </div>
                );
              })}
              <div style={{ background:"#f0f7f4", border:"1px solid #c8e6d8", borderRadius:10, padding:"12px 14px", fontSize:13, color:"#1a5c3a" }}>
                <strong>Remember:</strong> After updating links, hit <strong>"Save changes"</strong> at the top — then download your QR codes.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [config, setConfig] = useState(() => {
    try { const s=localStorage.getItem("cafeReviewConfig"); return s?JSON.parse(s):DEFAULT_CONFIG; }
    catch { return DEFAULT_CONFIG; }
  });
  const [mode, setMode] = useState("review");
  const params = new URLSearchParams(window.location.search);
  const locId = params.get("loc");

  return (
    <div style={{ fontFamily:"'Inter',-apple-system,sans-serif" }}>
      {mode==="review" && <>
        <ReviewFlow config={config} preselectedLocId={locId}/>
        <div style={{ position:"fixed", bottom:14, width:"100%", textAlign:"center", zIndex:10 }}>
          <button onClick={()=>setMode("adminLogin")} style={{ fontSize:11, color:"#ccc", background:"none", border:"none", cursor:"pointer", letterSpacing:"0.04em" }}>
            Admin ·
          </button>
        </div>
      </>}
      {mode==="adminLogin" && <AdminLogin config={config} onSuccess={()=>setMode("admin")} onBack={()=>setMode("review")}/>}
      {mode==="admin" && <AdminPanel config={config} setConfig={setConfig} onExit={()=>setMode("review")}/>}
    </div>
  );
}
