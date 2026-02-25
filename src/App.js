import React, { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const videoRef = useRef(null);

  /* ================= PETALS ================= */
  const petalsRef = useRef([]);
  const petalLayerRef = useRef(null);

  useEffect(() => {
    const layer = petalLayerRef.current;
    if (!layer) return;

    const count = 40;

    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "petal";
      layer.appendChild(p);

      petalsRef.current.push({
        el: p,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speed: 0.6 + Math.random(),
        sway: Math.random() * 1.5,
        angle: Math.random() * Math.PI * 2,
      });
    }

    function animate() {
      petalsRef.current.forEach((p) => {
        p.y += p.speed;
        p.angle += 0.01;
        p.x += Math.sin(p.angle) * p.sway;

        if (p.y > window.innerHeight) {
          p.y = -20;
          p.x = Math.random() * window.innerWidth;
        }

        p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.angle}rad)`;
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  /* ================= COUNTDOWN ================= */
  
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const weddingDate = new Date("2026-03-07T18:00:00");
    const timer = setInterval(() => {
      const now = new Date();
      const diff = weddingDate - now;

      if (diff > 0) {
        setTimeLeft({
          Days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          Hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          Minutes: Math.floor((diff / (1000 * 60)) % 60),
          Seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ================= TYPING TITLE ================= */
  const title = "Celebrating Our Love\nWith Those We Love";
  const [typed, setTyped] = useState("");
  const [showEvents, setShowEvents] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("events");
      if (!el) return;

      if (
        el.getBoundingClientRect().top < window.innerHeight * 0.6 &&
        !started.current
      ) {
        started.current = true;
        let i = 1;

        const t = setInterval(() => {
          setTyped(title.slice(0, i));
          i++;
          if (i > title.length) {
            clearInterval(t);
            setTimeout(() => setShowEvents(true), 400);
          }
        }, 70);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= LOVE STORY SECTION ================= */
  const [storyVisible, setStoryVisible] = useState(false);
  const storyStarted = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("love-story");
      if (!el) return;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.65 && !storyStarted.current) {
        storyStarted.current = true;
        setTimeout(() => setStoryVisible(true), 100);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= QUOTE POPUP ================= */
  const [quoteVisible, setQuoteVisible] = useState(false);
  const quoteStarted = useRef(false);

  /* ================= FIXED PHOTO REVEAL ================= */
  // The scroll container sits in normal flow; we use its scroll position
  // to drive: 0→1 = photo reveals (clip-path opens up), stays at 1 while
  // events-timeline slides on top from below.
  const photoContainerRef = useRef(null);
  const [photoReveal, setPhotoReveal] = useState(0); // 0 = hidden, 1 = fully revealed

  // Events timeline scroll state
  const [etHeaderVisible, setEtHeaderVisible] = useState(false);
  const [etItemsVisible, setEtItemsVisible] = useState([false, false, false, false]);
  const etStarted = useRef(false);

  // "Hope to See You" section
  const [hopeVisible, setHopeVisible] = useState(false);
  const hopeStarted = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const wh = window.innerHeight;

      // ---- Quote popup ----
      const qEl = document.getElementById("quote-section");
      if (qEl && !quoteStarted.current && qEl.getBoundingClientRect().top < wh * 0.72) {
        quoteStarted.current = true;
        setTimeout(() => setQuoteVisible(true), 100);
      }

      // ---- Photo reveal ----
      // Progress 0→1 as the scroll container (100vh) scrolls through the viewport.
      // Starts the moment quote section bottom leaves the screen.
      const pc = photoContainerRef.current;
      if (pc) {
        const rect = pc.getBoundingClientRect();
        // rect.top goes from +windowHeight (just entered) to -100vh (exited)
        // We want 0 when top=windowHeight, 1 when top=0
        const progress = Math.min(1, Math.max(0, (wh - rect.top) / wh));
        setPhotoReveal(progress);
      }

      // ---- Events timeline ----
      const etEl = document.getElementById("events-timeline");
      if (etEl && !etStarted.current && etEl.getBoundingClientRect().top < wh * 0.8) {
        etStarted.current = true;
        setTimeout(() => setEtHeaderVisible(true), 100);
        [0, 1, 2, 3].forEach((i) => {
          setTimeout(() => {
            setEtItemsVisible((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }, 400 + i * 250);
        });
      }

      // ---- Hope to See You ----
      const hopeEl = document.getElementById("hope-section");
      if (hopeEl && !hopeStarted.current && hopeEl.getBoundingClientRect().top < wh * 0.8) {
        hopeStarted.current = true;
        setTimeout(() => setHopeVisible(true), 100);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= STYLES ================= */
  const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Playfair+Display:wght@400;600&family=Great+Vibes&family=Dancing+Script:wght@700&display=swap');

body{margin:0;background:#050302;color:#fff;font-family:'Playfair Display',serif}
html{scroll-behavior:smooth}

/* PETALS */
#petal-layer{position:fixed;inset:0;pointer-events:none;z-index:6}
.petal{
  width:12px;height:12px;position:absolute;
  background:radial-gradient(circle,#ffd700,#bfa137);
  border-radius:50% 0 50% 0;
  opacity:.9;
}

/* INTRO VIDEO */
.video-intro{position:fixed;inset:0;z-index:9999;background:black}
.video-intro video{width:100%;height:100%;object-fit:cover}

.sound-overlay{
  position:absolute;inset:0;
  background:rgba(0,0,0,.45);
  display:flex;flex-direction:column;
  justify-content:center;align-items:center;
  color:white;cursor:pointer;
}

.sound-btn{
  margin-top:20px;border:2px solid gold;
  padding:14px 28px;border-radius:40px;
  display:flex;gap:10px;
  font-family:'Cinzel',serif;
  letter-spacing:2px;
}

/* HERO */
.hero{
  min-height:100vh;
  background:
   linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.9)),
   url('/royal-bg.png') center/cover no-repeat;
  display:flex;align-items:center;justify-content:center;
  padding:40px;text-align:center;
  position: relative;
  z-index: 5;
}

.glass{
  backdrop-filter:blur(14px);background:rgba(0,0,0,.55);
  border:1px solid rgba(255,215,0,.3);border-radius:30px;
  padding:70px 60px;max-width:1000px;width:100%;text-align:center;color:white;
}

.we{letter-spacing:4px;color:#f5d58a;font-family:'Cinzel',serif}

.names{
  font-family:'Dancing Script',cursive;
  font-size:4rem;
  font-weight:700;
  background:linear-gradient(45deg,#ffd700,#fff1b8,#ffd700);
  -webkit-background-clip:text;color:transparent;
  line-height:1.3;
}

/* COUNTDOWN */
.countdown{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:18px;
  margin-top:40px;
}

.time{
  background:rgba(255,215,0,.12);
  border:1px solid rgba(255,215,0,.4);
  border-radius:18px;
  padding:18px;
}

.time h1{margin:0;color:#ffd700;font-size:32px}
.time p{margin:0;font-family:'Cinzel',serif;font-size:12px}

/* EVENTS */
#events{
  background:#f7f4ef;
  color:#111;
  padding:140px 8%;
  position: relative;
  z-index: 5;
}

.events-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:80px;
  align-items:center;
}

.events-img img{
  width:100%;
  border-radius:10px;
  filter:grayscale(100%);
}

.events-text h2{
  white-space:pre-line;
  font-family:'Cinzel',serif;
  font-size:36px;
  margin-bottom:50px;
}

.event-item{margin-bottom:40px}

.event-num{
  font-family:'Cinzel',serif;
  font-size:22px;
  margin-bottom:6px;
}

.event-title{
  font-family:'Cinzel',serif;
  font-size:22px;
  margin-bottom:10px;
}

.event-desc{
  font-size:15px;
  line-height:1.6;
  color:#444;
}

/* ============ LOVE STORY SECTION ============ */
#love-story {
  min-height: 60vh;
  background: #0d0a06;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 70px 8%;
  z-index: 5;
}

/* Ambient glow blobs */
#love-story::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(191,161,55,0.12) 0%, transparent 70%);
  top: -100px;
  left: -100px;
  pointer-events: none;
}

#love-story::after {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(191,100,55,0.08) 0%, transparent 70%);
  bottom: -80px;
  right: -80px;
  pointer-events: none;
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 100px;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* LEFT — heading slides in from left */
.story-heading {
  opacity: 0;
  transform: translateX(-70px);
  transition: opacity 1s ease, transform 1s ease;
}

.story-heading.visible {
  opacity: 1;
  transform: translateX(0);
}

.story-heading h2 {
  font-family: 'Cinzel', serif;
  font-size: clamp(28px, 3.5vw, 46px);
  font-weight: 400;
  line-height: 1.35;
  letter-spacing: 3px;
  color: #fff;
  margin: 0;
  position: relative;
}

.story-heading h2 span {
  display: block;
  font-family: 'Great Vibes', cursive;
  font-size: clamp(40px, 5vw, 66px);
  background: linear-gradient(135deg, #ffd700, #bfa137, #ffe57a);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 2px;
  margin-top: 10px;
}

.story-heading h2::after {
  content: '';
  display: block;
  width: 0px;
  height: 1px;
  background: linear-gradient(90deg, #ffd700, transparent);
  margin-top: 32px;
  transition: width 1.4s ease 0.8s;
}

.story-heading.visible h2::after {
  width: 120px;
}

/* RIGHT — text fades in from right with delay */
.story-text {
  opacity: 0;
  transform: translateX(70px);
  transition: opacity 1s ease 0.4s, transform 1s ease 0.4s;
  border-left: 1px solid rgba(255, 215, 0, 0.2);
  padding-left: 50px;
}

.story-text.visible {
  opacity: 1;
  transform: translateX(0);
}

/* Decorative quote mark */
.story-text::before {
  content: '\u201C';
  font-family: 'Great Vibes', cursive;
  font-size: 100px;
  background: linear-gradient(135deg, #ffd700, #bfa137);
  -webkit-background-clip: text;
  color: transparent;
  line-height: 0.6;
  display: block;
  margin-bottom: 30px;
  opacity: 0;
  transition: opacity 1s ease 0.9s;
}

.story-text.visible::before {
  opacity: 1;
}

.story-text p {
  font-family: 'Playfair Display', serif;
  font-size: clamp(15px, 1.4vw, 18px);
  line-height: 2.1;
  color: #c8b99a;
  margin: 0;
  text-align: left;
}

/* FOOTER */
.footer{
  background:#050302;
  color:#d6c27a;
  text-align:center;
  padding:60px;
  font-family:'Cinzel',serif;
  position: relative;
  z-index: 5;
}

/* ============ QUOTE SECTION ============ */
/* Solid white background so it covers the fixed photo completely */
#quote-section {
  background: #fff;
  padding: 80px 10%;
  text-align: center;
  position: relative;
  z-index: 5;
  min-height: unset;
}

.quote-inner {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 1.1s ease, transform 1.1s ease;
  max-width: 820px;
  margin: 0 auto;
}

.quote-inner.visible {
  opacity: 1;
  transform: translateY(0);
}

.quote-inner blockquote {
  font-family: 'Cinzel', serif;
  font-size: clamp(17px, 2.4vw, 26px);
  font-weight: 400;
  line-height: 1.7;
  color: #1a1a1a;
  letter-spacing: 1.5px;
  margin: 0 0 28px 0;
}

.quote-inner cite {
  font-family: 'Playfair Display', serif;
  font-size: 15px;
  color: #999;
  font-style: normal;
  letter-spacing: 3px;
  text-transform: uppercase;
}

/*
  ============ FIXED PHOTO SYSTEM ============

  - #photo-fixed is position:fixed, z-index:1 — always behind all solid sections
  - Quote section (z-index:4, solid white) sits above it — you don't see photo there
  - #photo-scroll-container is a transparent 200vh spacer after the quote section
    While you scroll through it, the fixed photo is visible (nothing covering it)
    The clip-path on the photo goes from inset(100% 0 0 0) → inset(0 0 0 0)
    creating a "rising up from bottom" reveal effect
  - Events-timeline (z-index:4, solid background) slides up and covers photo
*/

#photo-fixed {
  position: fixed;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: transparent;
}

#photo-fixed img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  will-change: clip-path, filter;
}

/* White spacer sits BELOW the fixed photo (z-index:2 < photo z-index:3)
   So the white shows at the edges/before photo reveals,
   and the photo rises over it via clip-path */
#photo-scroll-container {
  position: relative;
  height: 100vh;
  z-index: 2;
  pointer-events: none;
  background: #fff;
}

/* Events timeline slides ON TOP of the fixed photo */
#events-timeline {
  position: relative;
  z-index: 5;
  background: #faf7f2;
  padding: 120px 8%;
  overflow: hidden;
}

.et-header {
  text-align: center;
  margin-bottom: 90px;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.9s ease, transform 0.9s ease;
}

.et-header.visible {
  opacity: 1;
  transform: translateY(0);
}

.et-header p {
  font-family: 'Great Vibes', cursive;
  font-size: 28px;
  color: #bfa137;
  margin: 0 0 10px 0;
  letter-spacing: 1px;
}

.et-header h2 {
  font-family: 'Cinzel', serif;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 400;
  letter-spacing: 5px;
  color: #1a1a1a;
  margin: 0;
}

.et-header h2::after {
  content: '';
  display: block;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #bfa137, transparent);
  margin: 24px auto 0;
}

/* Timeline container */
.et-list {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}

/* Vertical line */
.et-list::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, transparent, #d4b86a 10%, #d4b86a 90%, transparent);
  transform: translateX(-50%);
}

/* Each event card */
.et-item {
  display: grid;
  grid-template-columns: 1fr 60px 1fr;
  gap: 0;
  align-items: start;
  margin-bottom: 70px;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.et-item.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Alternating: odd → card on left, even → card on right */
.et-item:nth-child(odd) .et-card  { grid-column: 1; grid-row: 1; text-align: right; }
.et-item:nth-child(odd) .et-dot   { grid-column: 2; grid-row: 1; }
.et-item:nth-child(odd) .et-empty { grid-column: 3; grid-row: 1; }

.et-item:nth-child(even) .et-empty { grid-column: 1; grid-row: 1; }
.et-item:nth-child(even) .et-dot   { grid-column: 2; grid-row: 1; }
.et-item:nth-child(even) .et-card  { grid-column: 3; grid-row: 1; text-align: left; }

.et-dot {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 18px;
}

.et-dot-inner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffd700;
  border: 3px solid #fff;
  box-shadow: 0 0 0 2px #bfa137, 0 0 20px rgba(255,215,0,0.4);
  flex-shrink: 0;
}

.et-card {
  background: #fff;
  border: 1px solid rgba(191,161,55,0.2);
  border-radius: 16px;
  padding: 28px 32px;
  box-shadow: 0 4px 30px rgba(0,0,0,0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.et-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(191,161,55,0.15);
}

.et-num {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 3px;
  color: #bfa137;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.et-title {
  font-family: 'Cinzel', serif;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.et-datetime {
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
  line-height: 1.6;
}

.et-datetime strong {
  display: block;
  color: #333;
  font-weight: 600;
}

.et-location {
  font-family: 'Playfair Display', serif;
  font-size: 13px;
  color: #777;
  margin-bottom: 18px;
  line-height: 1.5;
}

.et-map-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #1a1a1a, #333);
  color: #ffd700;
  text-decoration: none;
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 2px;
  padding: 10px 20px;
  border-radius: 30px;
  border: 1px solid rgba(255,215,0,0.3);
  transition: background 0.3s ease, transform 0.2s ease;
}

.et-map-btn:hover {
  background: linear-gradient(135deg, #ffd700, #bfa137);
  color: #1a1a1a;
  transform: scale(1.04);
}

.et-map-btn svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

/* ============ HOPE TO SEE YOU SECTION ============ */
#hope-section {
  background: #0d0a06;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 100px 8%;
  position: relative;
  z-index: 5;
  overflow: hidden;
}

#hope-section::before {
  content: '';
  position: absolute;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(191,161,55,0.1) 0%, transparent 65%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.hope-inner {
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(60px) scale(0.96);
  transition: opacity 1.2s ease, transform 1.2s ease;
}

.hope-inner.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.hope-pre {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(22px, 3vw, 36px);
  color: #bfa137;
  display: block;
  margin-bottom: 16px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s;
}

.hope-inner.visible .hope-pre {
  opacity: 1;
  transform: translateY(0);
}

.hope-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(36px, 7vw, 90px);
  font-weight: 400;
  letter-spacing: 6px;
  background: linear-gradient(135deg, #ffd700, #fff6c0, #ffd700);
  -webkit-background-clip: text;
  color: transparent;
  line-height: 1.15;
  margin: 0 0 32px 0;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1s ease 0.5s, transform 1s ease 0.5s;
}

.hope-inner.visible .hope-title {
  opacity: 1;
  transform: translateY(0);
}

.hope-sub {
  font-family: 'Playfair Display', serif;
  font-size: clamp(14px, 1.6vw, 18px);
  color: #9a8a6a;
  letter-spacing: 3px;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.9s ease 0.9s;
}

.hope-inner.visible .hope-sub {
  opacity: 1;
}

.hope-divider {
  width: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #bfa137, transparent);
  margin: 28px auto;
  transition: width 1.4s ease 0.7s;
}

.hope-inner.visible .hope-divider {
  width: 200px;
}

@media(max-width:900px){
  .events-grid{grid-template-columns:1fr}
  .story-grid{grid-template-columns:1fr;gap:60px}
  .names{font-size:3.5rem}
  .story-text{border-left:none;padding-left:0;border-top:1px solid rgba(255,215,0,0.2);padding-top:40px}
  .quote-inner blockquote{font-size:16px}
  .et-list::before{left:24px}
  .et-item{grid-template-columns:48px 1fr !important}
  .et-item .et-dot{grid-column:1 !important;grid-row:1 !important;padding-top:22px}
  .et-item .et-card{grid-column:2 !important;grid-row:1 !important;text-align:left !important}
  .et-item .et-empty{display:none}
}
`;

  return (
    <>
      <style>{styles}</style>

      <div id="petal-layer" ref={petalLayerRef}></div>

      {/* INTRO VIDEO */}
      {showIntro && (
        <div className="video-intro">
          <video
            ref={videoRef}
            src="/wedding-intro2.mp4"
            autoPlay
            muted
            playsInline
            onEnded={() => setShowIntro(false)}
          />
          {!soundEnabled && (
            <div
              className="sound-overlay"
              onClick={() => {
                setSoundEnabled(true);
                videoRef.current.muted = false;
                videoRef.current.play();
              }}
            >
              <h2>Tap to Experience with Sound</h2>
              <div className="sound-btn">
                <Volume2 /> ENABLE SOUND
              </div>
            </div>
          )}
        </div>
      )}

      {!showIntro && (
        <>
          {/* HERO WITH COUNTDOWN */}
          <section className="hero">
            <div className="glass">
              <p className="we">WE ARE GETTING MARRIED</p>
              <h1 className="names">Anvesh Kumar Reddy & Poojitha</h1>
              <p>7 March 2026 · Ongole, Andhra Pradesh</p>

              <div className="countdown">
                {Object.entries(timeLeft).map(([k, v]) => (
                  <div className="time" key={k}>
                    <h1>{v}</h1>
                    <p>{k}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* EVENTS */}
          <section id="events">
            <div className="events-grid">
              <div className="events-img">
                <img src="/wedding-photo.png" alt="wedding" />
              </div>

              <div className="events-text">
                <h2>{typed}</h2>

                {showEvents && (
                  <>
                    <div className="event-item">
                      <div className="event-num">Wedding Ceremony</div>
                      <div className="event-title">Saturday, Mar 7, 2026</div>
                      <div className="event-desc">
                        S.G.V.S Convention, South By-pass<br />
                        Ongole, Andhra Pradesh
                      </div>
                    </div>

                    <div className="event-item">
                      <div className="event-num">Dinner</div>
                      <div className="event-title">Saturday, Mar 7, 2026</div>
                      <div className="event-desc">
                        at 8-00 PM onwards
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* ============ LOVE STORY SECTION ============ */}
          <section id="love-story">
            <div className="story-grid">
              {/* LEFT — heading */}
              <div className={`story-heading${storyVisible ? " visible" : ""}`}>
                <h2>
                  Not Just an<br />
                  <span>Ordinary Story</span>
                </h2>
              </div>

              {/* RIGHT — story text */}
              <div className={`story-text${storyVisible ? " visible" : ""}`}>
                <p>
                  What began as a simple conversation turned into a beautiful journey.
            Two hearts met, and destiny quietly wrote our forever.
                </p>
              </div>
            </div>
          </section>

          {/* ============ QUOTE SECTION ============
               Solid white background covers the fixed photo.
               Quote text pops in when scrolled to. */}
          <section id="quote-section">
            <div className={`quote-inner${quoteVisible ? " visible" : ""}`}>
              <blockquote>
                "To the world you are one person,<br />
                but to one person you are the world".
              </blockquote>
              <cite>Anonymous</cite>
            </div>
          </section>

          {/* ============ FIXED PHOTO — behind everything at z-index:1 ============
               clip-path: inset(X% 0 0 0) — X goes 100→0 as you scroll,
               so the photo "rises up" from the bottom into full view.
               After full reveal, the Events section (z-index:4, solid bg) scrolls over it. */}
          <div id="photo-fixed">
            <img
              src="/wedding-photo.png"
              alt="couple"
              style={{
                clipPath: `inset(${(1 - photoReveal) * 100}% 0% 0% 0%)`,
                filter: `brightness(${0.3 + photoReveal * 0.7})`,
              }}
            />
          </div>

          {/* ============ PHOTO SCROLL CONTAINER ============
               Transparent 200vh spacer — sits in normal flow after quote section.
               As you scroll through it, photoReveal goes 0→1 driving the reveal.
               Nothing visually here — the fixed photo shows through. */}
          <div id="photo-scroll-container" ref={photoContainerRef} />

          {/* ============ EVENTS TIMELINE SECTION ============ */}
          <section id="events-timeline">
            <div className={`et-header${etHeaderVisible ? " visible" : ""}`}>
              <p>Join Us For</p>
              <h2>Events & Location</h2>
            </div>

            <div className="et-list">
              {[
                {
                  num: "01",
                  title: "Haldi Ceremony",
                  date: "Friday, Mar 6, 2026",
                  time: "10:00 AM onwards",
                  location: "Alluru, Ongole\nAndhra Pradesh",
                  maps: "https://maps.app.goo.gl/AHaUEUcfLuTDiqiL7",
                },
                {
                  num: "02",
                  title: "Sangeet Night",
                  date: "Friday, Mar 6, 2026",
                  time: "7:00 PM onwards",
                  location: "Alluru, Ongole\nAndhra Pradesh",
                  maps: "https://maps.app.goo.gl/AHaUEUcfLuTDiqiL7",
                },
                {
                  num: "03",
                  title: "Groom Ceremony",
                  date: "Saturday, Mar 7, 2026",
                  time: "9:00 AM onwards",
                  location: "Alluru, Ongole\nAndhra Pradesh",
                  maps: "https://maps.app.goo.gl/AHaUEUcfLuTDiqiL7",
                },
                {
                  num: "04",
                  title: "Wedding Ceremony",
                  date: "Saturday, Mar 7, 2026",
                  time: "11:00 AM · Dinner at 8:00 PM",
                  location: "S.G.V.S Convention, South By-pass\nOngole, Andhra Pradesh",
                  maps: "https://maps.app.goo.gl/6C7codEY3K8jcvZc6",
                },
              ].map((ev, i) => (
                <div key={i} className={`et-item${etItemsVisible[i] ? " visible" : ""}`}>
                  {/* Left side / empty placeholder for even */}
                  {i % 2 === 0 ? (
                    <div className="et-card">
                      <div className="et-num">Event {ev.num}</div>
                      <div className="et-title">{ev.title}</div>
                      <div className="et-datetime">
                        <strong>{ev.date}</strong>
                        {ev.time}
                      </div>
                      <div className="et-location">{ev.location.split("\n").map((l, j) => <span key={j}>{l}<br /></span>)}</div>
                      <a className="et-map-btn" href={ev.maps} target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>
                        Open in Maps
                      </a>
                    </div>
                  ) : (
                    <div className="et-empty"></div>
                  )}

                  {/* Center dot */}
                  <div className="et-dot"><div className="et-dot-inner"></div></div>

                  {/* Right side / empty placeholder for odd */}
                  {i % 2 !== 0 ? (
                    <div className="et-card">
                      <div className="et-num">Event {ev.num}</div>
                      <div className="et-title">{ev.title}</div>
                      <div className="et-datetime">
                        <strong>{ev.date}</strong>
                        {ev.time}
                      </div>
                      <div className="et-location">{ev.location.split("\n").map((l, j) => <span key={j}>{l}<br /></span>)}</div>
                      <a className="et-map-btn" href={ev.maps} target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>
                        Open in Maps
                      </a>
                    </div>
                  ) : (
                    <div className="et-empty"></div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ============ HOPE TO SEE YOU SECTION ============ */}
          <section id="hope-section">
            <div className={`hope-inner${hopeVisible ? " visible" : ""}`}>
              <span className="hope-pre">With All Our Love</span>
              <h2 className="hope-title">Hope to See You!</h2>
              <div className="hope-divider"></div>
              <p className="hope-sub">Anvesh Kumar Reddy &amp; Poojitha · Mar 7, 2026</p>
            </div>
          </section>

          <div className="footer">With Love & Blessings ❤️</div>
        </>
      )}
    </>
  );
}