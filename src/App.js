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
        if (p.y > window.innerHeight) { p.y = -20; p.x = Math.random() * window.innerWidth; }
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
      if (el.getBoundingClientRect().top < window.innerHeight * 0.6 && !started.current) {
        started.current = true;
        let i = 1;
        const t = setInterval(() => {
          setTyped(title.slice(0, i));
          i++;
          if (i > title.length) { clearInterval(t); setTimeout(() => setShowEvents(true), 400); }
        }, 70);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [title]);

  /* ================= LOVE STORY ================= */
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

  /* ================= SCROLL ANIMATIONS ================= */
  const [quoteVisible, setQuoteVisible] = useState(false);
  const quoteStarted = useRef(false);
  const photoContainerRef = useRef(null);
  const [photoReveal, setPhotoReveal] = useState(0);
  const [etHeaderVisible, setEtHeaderVisible] = useState(false);
  const [etItemsVisible, setEtItemsVisible] = useState([false, false, false, false]);
  const etStarted = useRef(false);
  const [hopeVisible, setHopeVisible] = useState(false);
  const hopeStarted = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const wh = window.innerHeight;

      const qEl = document.getElementById("quote-section");
      if (qEl && !quoteStarted.current && qEl.getBoundingClientRect().top < wh * 0.72) {
        quoteStarted.current = true;
        setTimeout(() => setQuoteVisible(true), 100);
      }

      const pc = photoContainerRef.current;
      if (pc) {
        const rect = pc.getBoundingClientRect();
        setPhotoReveal(Math.min(1, Math.max(0, (wh - rect.top) / wh)));
      }

      const etEl = document.getElementById("events-timeline");
      if (etEl && !etStarted.current && etEl.getBoundingClientRect().top < wh * 0.8) {
        etStarted.current = true;
        setTimeout(() => setEtHeaderVisible(true), 100);
        [0, 1, 2, 3].forEach((i) => {
          setTimeout(() => {
            setEtItemsVisible((prev) => { const next = [...prev]; next[i] = true; return next; });
          }, 400 + i * 250);
        });
      }

      const hopeEl = document.getElementById("hope-section");
      if (hopeEl && !hopeStarted.current && hopeEl.getBoundingClientRect().top < wh * 0.8) {
        hopeStarted.current = true;
        setTimeout(() => setHopeVisible(true), 100);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= RSVP ================= */
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({
    name: "", phone: "", guests: "1", date: "Mar 7", message: ""
  });
  const [rsvpStatus, setRsvpStatus] = useState("idle");

  // ⬇️ PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
  const SHEET_URL = "https://script.google.com/macros/s/AKfycbyThiVe1UYOkAZJQbnjDAzCCj4rx7pIw8_O3dBSLhAz_1IdBg2YYi-29CudoZJZJsYC/exec";

  const handleRsvpSubmit = async () => {
    if (!rsvpForm.name.trim() || !rsvpForm.phone.trim()) return;
    setRsvpStatus("submitting");
    try {
      const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      await fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rsvpForm, submittedAt }),
      });
      setRsvpStatus("success");
      setRsvpForm({ name: "", phone: "", guests: "1", date: "Mar 7", message: "" });
    } catch (err) {
      setRsvpStatus("error");
    }
  };

  /* ================= STYLES ================= */
  const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Playfair+Display:wght@400;600&family=Great+Vibes&family=Dancing+Script:wght@700&display=swap');

*{box-sizing:border-box;}
body{margin:0;background:#050302;color:#fff;font-family:'Playfair Display',serif;overflow-x:hidden;}
html{scroll-behavior:smooth;overflow-x:hidden;}

#petal-layer{position:fixed;inset:0;pointer-events:none;z-index:6;}
.petal{width:12px;height:12px;position:absolute;background:radial-gradient(circle,#ffd700,#bfa137);border-radius:50% 0 50% 0;opacity:.9;}

.video-intro{position:fixed;inset:0;z-index:9999;background:black;}
.video-intro video{width:100%;height:100%;object-fit:cover;}
.sound-overlay{position:absolute;inset:0;background:rgba(0,0,0,.45);display:flex;flex-direction:column;justify-content:center;align-items:center;color:white;cursor:pointer;padding:20px;text-align:center;}
.sound-btn{margin-top:20px;border:2px solid gold;padding:14px 28px;border-radius:40px;display:flex;gap:10px;align-items:center;font-family:'Cinzel',serif;letter-spacing:2px;font-size:14px;}

.hero{min-height:100vh;background:linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.9)),url('/royal-bg.png') center/cover no-repeat;display:flex;align-items:center;justify-content:center;padding:20px;text-align:center;position:relative;z-index:5;}
.glass{backdrop-filter:blur(14px);background:rgba(0,0,0,.55);border:1px solid rgba(255,215,0,.3);border-radius:30px;padding:50px 40px;max-width:1000px;width:100%;text-align:center;color:white;}
.we{letter-spacing:4px;color:#f5d58a;font-family:'Cinzel',serif;font-size:13px;margin-bottom:12px;}
.names{font-family:'Dancing Script',cursive;font-size:clamp(2rem,6vw,4rem);font-weight:700;background:linear-gradient(45deg,#ffd700,#fff1b8,#ffd700);-webkit-background-clip:text;color:transparent;line-height:1.3;margin:10px 0;}
.glass > p{font-size:14px;color:rgba(255,255,255,0.8);margin:8px 0 0;}
.countdown{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:30px;}
.time{background:rgba(255,215,0,.12);border:1px solid rgba(255,215,0,.4);border-radius:18px;padding:14px 8px;}
.time h1{margin:0;color:#ffd700;font-size:clamp(20px,4vw,32px);}
.time p{margin:0;font-family:'Cinzel',serif;font-size:10px;letter-spacing:1px;}

#events{background:#f7f4ef;color:#111;padding:80px 6%;position:relative;z-index:5;}
.events-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;max-width:1200px;margin:0 auto;}
.events-img img{width:100%;border-radius:10px;filter:grayscale(100%);}
.events-text h2{white-space:pre-line;font-family:'Cinzel',serif;font-size:clamp(22px,3vw,36px);margin-bottom:40px;}
.event-item{margin-bottom:32px;}
.event-num{font-family:'Cinzel',serif;font-size:18px;margin-bottom:6px;}
.event-title{font-family:'Cinzel',serif;font-size:18px;margin-bottom:8px;}
.event-desc{font-size:14px;line-height:1.6;color:#444;}

#love-story{min-height:60vh;background:#0d0a06;color:#fff;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:70px 6%;z-index:5;}
#love-story::before{content:'';position:absolute;width:600px;height:600px;background:radial-gradient(circle,rgba(191,161,55,0.12) 0%,transparent 70%);top:-100px;left:-100px;pointer-events:none;}
#love-story::after{content:'';position:absolute;width:500px;height:500px;background:radial-gradient(circle,rgba(191,100,55,0.08) 0%,transparent 70%);bottom:-80px;right:-80px;pointer-events:none;}
.story-grid{display:grid;grid-template-columns:1fr 1.4fr;gap:80px;align-items:center;max-width:1200px;width:100%;margin:0 auto;position:relative;z-index:1;}
.story-heading{opacity:0;transform:translateX(-70px);transition:opacity 1s ease,transform 1s ease;}
.story-heading.visible{opacity:1;transform:translateX(0);}
.story-heading h2{font-family:'Cinzel',serif;font-size:clamp(24px,3.5vw,46px);font-weight:400;line-height:1.35;letter-spacing:3px;color:#fff;margin:0;}
.story-heading h2 span{display:block;font-family:'Great Vibes',cursive;font-size:clamp(36px,5vw,66px);background:linear-gradient(135deg,#ffd700,#bfa137,#ffe57a);-webkit-background-clip:text;color:transparent;letter-spacing:2px;margin-top:10px;}
.story-heading h2::after{content:'';display:block;width:0px;height:1px;background:linear-gradient(90deg,#ffd700,transparent);margin-top:32px;transition:width 1.4s ease 0.8s;}
.story-heading.visible h2::after{width:120px;}
.story-text{opacity:0;transform:translateX(70px);transition:opacity 1s ease 0.4s,transform 1s ease 0.4s;border-left:1px solid rgba(255,215,0,0.2);padding-left:50px;}
.story-text.visible{opacity:1;transform:translateX(0);}
.story-text::before{content:'\u201C';font-family:'Great Vibes',cursive;font-size:100px;background:linear-gradient(135deg,#ffd700,#bfa137);-webkit-background-clip:text;color:transparent;line-height:0.6;display:block;margin-bottom:30px;opacity:0;transition:opacity 1s ease 0.9s;}
.story-text.visible::before{opacity:1;}
.story-text p{font-family:'Playfair Display',serif;font-size:clamp(14px,1.4vw,18px);line-height:2.1;color:#c8b99a;margin:0;text-align:left;}

.footer{background:#050302;color:#d6c27a;text-align:center;padding:50px 20px;font-family:'Cinzel',serif;font-size:14px;position:relative;z-index:5;}

#quote-section{background:#fff;padding:70px 8%;text-align:center;position:relative;z-index:5;}
.quote-inner{opacity:0;transform:translateY(50px);transition:opacity 1.1s ease,transform 1.1s ease;max-width:820px;margin:0 auto;}
.quote-inner.visible{opacity:1;transform:translateY(0);}
.quote-inner blockquote{font-family:'Cinzel',serif;font-size:clamp(15px,2.4vw,26px);font-weight:400;line-height:1.7;color:#1a1a1a;letter-spacing:1.5px;margin:0 0 24px 0;}
.quote-inner cite{font-family:'Playfair Display',serif;font-size:14px;color:#999;font-style:normal;letter-spacing:3px;text-transform:uppercase;}

#photo-fixed{position:fixed;inset:0;z-index:3;pointer-events:none;background:transparent;}
#photo-fixed img{width:100%;height:100%;object-fit:cover;object-position:center;display:block;will-change:clip-path,filter;}
#photo-scroll-container{position:relative;height:100vh;z-index:2;pointer-events:none;background:#fff;}

#events-timeline{position:relative;z-index:5;background:#faf7f2;padding:80px 6%;overflow:hidden;}
.et-header{text-align:center;margin-bottom:70px;opacity:0;transform:translateY(40px);transition:opacity 0.9s ease,transform 0.9s ease;}
.et-header.visible{opacity:1;transform:translateY(0);}
.et-header p{font-family:'Great Vibes',cursive;font-size:clamp(22px,3vw,28px);color:#bfa137;margin:0 0 10px 0;}
.et-header h2{font-family:'Cinzel',serif;font-size:clamp(22px,4vw,48px);font-weight:400;letter-spacing:4px;color:#1a1a1a;margin:0;}
.et-header h2::after{content:'';display:block;width:60px;height:2px;background:linear-gradient(90deg,transparent,#bfa137,transparent);margin:20px auto 0;}
.et-list{max-width:900px;margin:0 auto;position:relative;}
.et-list::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,transparent,#d4b86a 10%,#d4b86a 90%,transparent);transform:translateX(-50%);}
.et-item{display:grid;grid-template-columns:1fr 60px 1fr;gap:0;align-items:start;margin-bottom:60px;opacity:0;transform:translateY(40px);transition:opacity 0.8s ease,transform 0.8s ease;}
.et-item.visible{opacity:1;transform:translateY(0);}
.et-item:nth-child(odd) .et-card{grid-column:1;grid-row:1;text-align:right;}
.et-item:nth-child(odd) .et-dot{grid-column:2;grid-row:1;}
.et-item:nth-child(odd) .et-empty{grid-column:3;grid-row:1;}
.et-item:nth-child(even) .et-empty{grid-column:1;grid-row:1;}
.et-item:nth-child(even) .et-dot{grid-column:2;grid-row:1;}
.et-item:nth-child(even) .et-card{grid-column:3;grid-row:1;text-align:left;}
.et-dot{display:flex;align-items:flex-start;justify-content:center;padding-top:18px;}
.et-dot-inner{width:16px;height:16px;border-radius:50%;background:#ffd700;border:3px solid #fff;box-shadow:0 0 0 2px #bfa137,0 0 20px rgba(255,215,0,0.4);flex-shrink:0;}
.et-card{background:#fff;border:1px solid rgba(191,161,55,0.2);border-radius:16px;padding:24px 28px;box-shadow:0 4px 30px rgba(0,0,0,0.06);transition:transform 0.3s ease,box-shadow 0.3s ease;}
.et-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(191,161,55,0.15);}
.et-num{font-family:'Cinzel',serif;font-size:11px;letter-spacing:3px;color:#bfa137;text-transform:uppercase;margin-bottom:8px;}
.et-title{font-family:'Cinzel',serif;font-size:18px;font-weight:600;color:#1a1a1a;margin-bottom:10px;}
.et-datetime{font-family:'Playfair Display',serif;font-size:13px;color:#555;margin-bottom:8px;line-height:1.6;}
.et-datetime strong{display:block;color:#333;font-weight:600;}
.et-location{font-family:'Playfair Display',serif;font-size:13px;color:#777;margin-bottom:16px;line-height:1.5;}
.et-map-btn{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#1a1a1a,#333);color:#ffd700;text-decoration:none;font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;padding:10px 18px;border-radius:30px;border:1px solid rgba(255,215,0,0.3);transition:background 0.3s ease,transform 0.2s ease;}
.et-map-btn:hover{background:linear-gradient(135deg,#ffd700,#bfa137);color:#1a1a1a;transform:scale(1.04);}
.et-map-btn svg{width:14px;height:14px;fill:currentColor;}

#hope-section{background:#0d0a06;min-height:60vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:80px 6%;position:relative;z-index:5;overflow:hidden;}
#hope-section::before{content:'';position:absolute;width:700px;height:700px;background:radial-gradient(circle,rgba(191,161,55,0.1) 0%,transparent 65%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;}
.hope-inner{position:relative;z-index:1;opacity:0;transform:translateY(60px) scale(0.96);transition:opacity 1.2s ease,transform 1.2s ease;}
.hope-inner.visible{opacity:1;transform:translateY(0) scale(1);}
.hope-pre{font-family:'Great Vibes',cursive;font-size:clamp(20px,3vw,36px);color:#bfa137;display:block;margin-bottom:16px;opacity:0;transform:translateY(20px);transition:opacity 0.9s ease 0.3s,transform 0.9s ease 0.3s;}
.hope-inner.visible .hope-pre{opacity:1;transform:translateY(0);}
.hope-title{font-family:'Cinzel',serif;font-size:clamp(30px,7vw,90px);font-weight:400;letter-spacing:4px;background:linear-gradient(135deg,#ffd700,#fff6c0,#ffd700);-webkit-background-clip:text;color:transparent;line-height:1.15;margin:0 0 28px 0;opacity:0;transform:translateY(30px);transition:opacity 1s ease 0.5s,transform 1s ease 0.5s;}
.hope-inner.visible .hope-title{opacity:1;transform:translateY(0);}
.hope-sub{font-family:'Playfair Display',serif;font-size:clamp(12px,1.6vw,18px);color:#9a8a6a;letter-spacing:2px;text-transform:uppercase;opacity:0;transition:opacity 0.9s ease 0.9s;}
.hope-inner.visible .hope-sub{opacity:1;}
.hope-divider{width:0;height:1px;background:linear-gradient(90deg,transparent,#bfa137,transparent);margin:24px auto;transition:width 1.4s ease 0.7s;}
.hope-inner.visible .hope-divider{width:180px;}

/* ============ RSVP inside hope section ============ */
.rsvp-wrap{margin-top:36px;position:relative;z-index:1;}
.rsvp-btn{display:inline-flex;align-items:center;gap:10px;background:linear-gradient(135deg,#ffd700,#bfa137);color:#0d0a06;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:3px;padding:16px 42px;border-radius:50px;border:none;cursor:pointer;transition:transform 0.2s ease,box-shadow 0.2s ease;box-shadow:0 0 30px rgba(255,215,0,0.2);}
.rsvp-btn:hover{transform:scale(1.05);box-shadow:0 0 50px rgba(255,215,0,0.4);}
.rsvp-form-wrap{max-height:0;overflow:hidden;transition:max-height 0.9s ease,opacity 0.5s ease;opacity:0;}
.rsvp-form-wrap.open{max-height:1100px;opacity:1;}
.rsvp-form{background:rgba(255,255,255,0.04);border:1px solid rgba(255,215,0,0.12);border-radius:24px;padding:40px 36px;max-width:520px;margin:32px auto 0;text-align:left;}
.rsvp-row{margin-bottom:20px;}
.rsvp-row label{display:block;font-family:'Cinzel',serif;font-size:10px;letter-spacing:2.5px;color:#bfa137;text-transform:uppercase;margin-bottom:8px;}
.rsvp-row input,.rsvp-row select,.rsvp-row textarea{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,215,0,0.18);border-radius:10px;padding:12px 16px;color:#fff;font-family:'Playfair Display',serif;font-size:14px;outline:none;transition:border-color 0.3s ease;}
.rsvp-row input:focus,.rsvp-row select:focus,.rsvp-row textarea:focus{border-color:rgba(255,215,0,0.55);}
.rsvp-row input::placeholder,.rsvp-row textarea::placeholder{color:rgba(255,255,255,0.28);}
.rsvp-row select option{background:#1a1209;color:#fff;}
.rsvp-row textarea{resize:vertical;min-height:80px;}
.rsvp-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;}
.rsvp-submit{width:100%;background:linear-gradient(135deg,#ffd700,#bfa137);color:#0d0a06;font-family:'Cinzel',serif;font-size:12px;font-weight:600;letter-spacing:3px;padding:16px;border-radius:12px;border:none;cursor:pointer;margin-top:8px;transition:transform 0.2s ease,opacity 0.2s ease;}
.rsvp-submit:hover{transform:scale(1.02);}
.rsvp-submit:disabled{opacity:0.45;cursor:not-allowed;transform:none;}
.rsvp-success{text-align:center;padding:20px 0;}
.rsvp-success h3{font-family:'Great Vibes',cursive;font-size:clamp(30px,5vw,48px);color:#ffd700;margin:0 0 12px 0;}
.rsvp-success p{font-family:'Playfair Display',serif;font-size:15px;color:#9a8a6a;margin:0 0 24px 0;}
.rsvp-close-btn{display:inline-flex;align-items:center;background:transparent;border:1px solid rgba(255,215,0,0.3);color:#ffd700;font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;padding:12px 28px;border-radius:40px;cursor:pointer;transition:background 0.3s ease;}
.rsvp-close-btn:hover{background:rgba(255,215,0,0.1);}
.rsvp-error{text-align:center;color:#ff8888;font-family:'Playfair Display',serif;font-size:14px;margin-top:14px;}

/* ============ MOBILE ============ */
@media(max-width:768px){
  .glass{padding:36px 20px;border-radius:20px;}
  .we{font-size:10px;letter-spacing:2px;}
  .names{font-size:clamp(1.8rem,8vw,2.6rem);}
  .glass > p{font-size:12px;}
  .countdown{grid-template-columns:repeat(2,1fr);gap:10px;margin-top:24px;}
  .time{padding:12px 6px;border-radius:14px;}
  .time h1{font-size:24px;}
  .time p{font-size:9px;}
  #events{padding:60px 5%;}
  .events-grid{grid-template-columns:1fr;gap:30px;}
  .events-text h2{font-size:22px;margin-bottom:28px;}
  .event-num,.event-title{font-size:16px;}
  .event-desc{font-size:13px;}
  #love-story{padding:60px 5%;min-height:unset;}
  .story-grid{grid-template-columns:1fr;gap:36px;}
  .story-heading h2{font-size:24px;letter-spacing:2px;}
  .story-heading h2 span{font-size:36px;}
  .story-text{border-left:none;padding-left:0;border-top:1px solid rgba(255,215,0,0.2);padding-top:28px;}
  .story-text::before{font-size:70px;}
  .story-text p{font-size:14px;line-height:1.9;}
  #quote-section{padding:50px 5%;}
  .quote-inner blockquote{font-size:15px;letter-spacing:1px;line-height:1.6;}
  .quote-inner cite{font-size:11px;letter-spacing:2px;}
  #events-timeline{padding:60px 4%;}
  .et-header{margin-bottom:50px;}
  .et-header p{font-size:20px;}
  .et-header h2{font-size:22px;letter-spacing:2px;}
  .et-list::before{left:18px;transform:none;}
  .et-item{grid-template-columns:40px 1fr !important;margin-bottom:32px;}
  .et-item .et-dot{grid-column:1 !important;grid-row:1 !important;padding-top:16px;}
  .et-item .et-card{grid-column:2 !important;grid-row:1 !important;text-align:left !important;padding:16px 14px;}
  .et-item .et-empty{display:none !important;}
  .et-dot-inner{width:12px;height:12px;}
  .et-title{font-size:15px;margin-bottom:8px;}
  .et-datetime{font-size:12px;}
  .et-location{font-size:12px;margin-bottom:12px;}
  .et-map-btn{font-size:10px;padding:8px 14px;letter-spacing:1px;}
  #hope-section{padding:60px 5%;min-height:50vh;}
  .hope-title{font-size:clamp(26px,8vw,48px);letter-spacing:2px;}
  .hope-pre{font-size:20px;}
  .hope-sub{font-size:11px;letter-spacing:1.5px;}
  .hope-divider{margin:18px auto;}
  .rsvp-form{padding:24px 16px;border-radius:16px;}
  .rsvp-grid{grid-template-columns:1fr;gap:0;}
  .rsvp-btn{font-size:11px;padding:14px 28px;letter-spacing:2px;}
  .rsvp-submit{font-size:11px;letter-spacing:2px;}
  .footer{padding:36px 5%;font-size:13px;}
  .sound-overlay h2{font-size:18px;}
  .sound-btn{font-size:12px;padding:12px 20px;}
}

@media(max-width:380px){
  .names{font-size:1.6rem;}
  .time h1{font-size:20px;}
  .et-card{padding:14px 12px;}
  .et-title{font-size:14px;}
  .hope-title{font-size:26px;}
}
`;

  return (
    <>
      <style>{styles}</style>
      <div id="petal-layer" ref={petalLayerRef}></div>

      {showIntro && (
        <div className="video-intro">
          <video ref={videoRef} src="/wedding-intro2.mp4" autoPlay muted playsInline onEnded={() => setShowIntro(false)} />
          {!soundEnabled && (
            <div className="sound-overlay" onClick={() => { setSoundEnabled(true); videoRef.current.muted = false; videoRef.current.play(); }}>
              <h2>Tap to Experience with Sound</h2>
              <div className="sound-btn"><Volume2 /> ENABLE SOUND</div>
            </div>
          )}
        </div>
      )}

      {!showIntro && (
        <>
          <section className="hero">
            <div className="glass">
              <p className="we">WE ARE GETTING MARRIED</p>
              <h1 className="names">Anvesh <br />& <br />Poojitha</h1>
              <p>7 March 2026 · Ongole, Andhra Pradesh</p>
              <div className="countdown">
                {Object.entries(timeLeft).map(([k, v]) => (
                  <div className="time" key={k}><h1>{v}</h1><p>{k}</p></div>
                ))}
              </div>
            </div>
          </section>

          <section id="events">
            <div className="events-grid">
              <div className="events-img"><img src="/wedding-photo2.jpeg" alt="wedding" /></div>
              <div className="events-text">
                <h2>{typed}</h2>
                {showEvents && (
                  <>
                    <div className="event-item">
                      <div className="event-num">Wedding Ceremony</div>
                      <div className="event-title">Saturday, Mar 7, 2026</div>
                      <div className="event-desc">S.G.V.S Convention, South By-pass<br />Ongole, Andhra Pradesh</div>
                    </div>
                    <div className="event-item">
                      <div className="event-num">Dinner</div>
                      <div className="event-title">Saturday, Mar 7, 2026</div>
                      <div className="event-desc">at 8:00 PM onwards</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          <section id="love-story">
            <div className="story-grid">
              <div className={`story-heading${storyVisible ? " visible" : ""}`}>
                <h2>Not Just an<br /><span>Ordinary Story</span></h2>
              </div>
              <div className={`story-text${storyVisible ? " visible" : ""}`}>
                <p>What began as a simple conversation turned into a beautiful journey. Two hearts met, and destiny quietly wrote our forever.</p>
              </div>
            </div>
          </section>

          <section id="quote-section">
            <div className={`quote-inner${quoteVisible ? " visible" : ""}`}>
              <blockquote>"To the world you are one person,<br />but to one person you are the world".</blockquote>
              <cite>Anonymous</cite>
            </div>
          </section>

          <div id="photo-fixed">
            <img src="/wedding-photo.jpeg" alt="couple"
              style={{ clipPath: `inset(${(1 - photoReveal) * 100}% 0% 0% 0%)`, filter: `brightness(${0.3 + photoReveal * 0.7})` }} />
          </div>
          <div id="photo-scroll-container" ref={photoContainerRef} />

          <section id="events-timeline">
            <div className={`et-header${etHeaderVisible ? " visible" : ""}`}>
              <p>Join Us For</p><h2>Events & Location</h2>
            </div>
            <div className="et-list">
              {[
                { num:"01", title:"Haldi Ceremony", date:"Friday, Mar 6, 2026", time:"10:00 AM onwards", location:"Alluru, Ongole\nAndhra Pradesh", maps:"https://maps.app.goo.gl/AHaUEUcfLuTDiqiL7" },
                { num:"02", title:"Sangeet Night", date:"Friday, Mar 6, 2026", time:"7:00 PM onwards", location:"Alluru, Ongole\nAndhra Pradesh", maps:"https://maps.app.goo.gl/AHaUEUcfLuTDiqiL7" },
                { num:"03", title:"Groom Ceremony", date:"Saturday, Mar 7, 2026", time:"9:00 AM onwards", location:"Alluru, Ongole\nAndhra Pradesh", maps:"https://maps.app.goo.gl/AHaUEUcfLuTDiqiL7" },
                { num:"04", title:"Wedding Ceremony", date:"Saturday, Mar 7, 2026", time:"11:00 AM · Dinner at 8:00 PM", location:"S.G.V.S Convention, South By-pass\nOngole, Andhra Pradesh", maps:"https://maps.app.goo.gl/6C7codEY3K8jcvZc6" },
              ].map((ev, i) => (
                <div key={i} className={`et-item${etItemsVisible[i] ? " visible" : ""}`}>
                  {i % 2 === 0 ? (
                    <div className="et-card">
                      <div className="et-num">Event {ev.num}</div>
                      <div className="et-title">{ev.title}</div>
                      <div className="et-datetime"><strong>{ev.date}</strong>{ev.time}</div>
                      <div className="et-location">{ev.location.split("\n").map((l, j) => <span key={j}>{l}<br /></span>)}</div>
                      <a className="et-map-btn" href={ev.maps} target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>
                        Open in Maps
                      </a>
                    </div>
                  ) : <div className="et-empty"></div>}
                  <div className="et-dot"><div className="et-dot-inner"></div></div>
                  {i % 2 !== 0 ? (
                    <div className="et-card">
                      <div className="et-num">Event {ev.num}</div>
                      <div className="et-title">{ev.title}</div>
                      <div className="et-datetime"><strong>{ev.date}</strong>{ev.time}</div>
                      <div className="et-location">{ev.location.split("\n").map((l, j) => <span key={j}>{l}<br /></span>)}</div>
                      <a className="et-map-btn" href={ev.maps} target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>
                        Open in Maps
                      </a>
                    </div>
                  ) : <div className="et-empty"></div>}
                </div>
              ))}
            </div>
          </section>

          <section id="hope-section">
            <div className={`hope-inner${hopeVisible ? " visible" : ""}`}>
              <span className="hope-pre">With All Our Love</span>
              <h2 className="hope-title">Hope to See You!</h2>
              <div className="hope-divider"></div>
              <p className="hope-sub">Anvesh Kumar Reddy &amp; Poojitha · Mar 7, 2026</p>

              {/* RSVP button + form inside hope section */}
              <div className="rsvp-wrap">
                <button className="rsvp-btn" onClick={() => { setRsvpOpen(!rsvpOpen); setRsvpStatus("idle"); }}>
                  {rsvpOpen ? "✕  Close" : "✉  RSVP Now"}
                </button>

                <div className={`rsvp-form-wrap${rsvpOpen ? " open" : ""}`}>
                  <div className="rsvp-form">
                    {rsvpStatus === "success" ? (
                      <div className="rsvp-success">
                        <h3>See You There! 🎉</h3>
                        <p>Thank you for your RSVP. We can't wait to celebrate with you!</p>
                        <button className="rsvp-close-btn" onClick={() => { setRsvpStatus("idle"); setRsvpOpen(false); }}>Close</button>
                      </div>
                    ) : (
                      <>
                        <div className="rsvp-row">
                          <label>Your Full Name *</label>
                          <input type="text" placeholder="Enter your name" value={rsvpForm.name}
                            onChange={e => setRsvpForm({ ...rsvpForm, name: e.target.value })} />
                        </div>
                        <div className="rsvp-row">
                          <label>Phone Number *</label>
                          <input type="tel" placeholder="Enter your phone number" value={rsvpForm.phone}
                            onChange={e => setRsvpForm({ ...rsvpForm, phone: e.target.value })} />
                        </div>
                        <div className="rsvp-grid">
                          <div className="rsvp-row" style={{ marginBottom: 0 }}>
                            <label>No. of Guests</label>
                            <select value={rsvpForm.guests} onChange={e => setRsvpForm({ ...rsvpForm, guests: e.target.value })}>
                              {["1", "2", "3", "4", "5", "6+"].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                          </div>
                          <div className="rsvp-row" style={{ marginBottom: 0 }}>
                            <label>Which Day?</label>
                            <select value={rsvpForm.date} onChange={e => setRsvpForm({ ...rsvpForm, date: e.target.value })}>
                              <option value="Mar 6">Mar 6 — Haldi &amp; Sangeet</option>
                              <option value="Mar 7">Mar 7 — Wedding</option>
                              <option value="Both">Both Days</option>
                            </select>
                          </div>
                        </div>
                        <div className="rsvp-row" style={{ marginTop: "20px" }}>
                          <label>Message for the Couple (optional)</label>
                          <textarea placeholder="Write your wishes here..." value={rsvpForm.message}
                            onChange={e => setRsvpForm({ ...rsvpForm, message: e.target.value })} />
                        </div>
                        <button className="rsvp-submit"
                          disabled={rsvpStatus === "submitting" || !rsvpForm.name.trim() || !rsvpForm.phone.trim()}
                          onClick={handleRsvpSubmit}>
                          {rsvpStatus === "submitting" ? "Sending..." : "CONFIRM RSVP"}
                        </button>
                        {rsvpStatus === "error" && <p className="rsvp-error">Something went wrong. Please try again.</p>}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="footer">With Love & Blessings ❤️</div>
        </>
      )}
    </>
  );
}