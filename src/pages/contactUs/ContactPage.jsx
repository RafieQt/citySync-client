import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

// ── Shared shader ─────────────────────────────────────────────────────────────
const VERT = `attribute vec2 a_pos; void main(){ gl_Position=vec4(a_pos,0,1); }`;
const FRAG = `
precision mediump float;
uniform float u_time; uniform vec2 u_res;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.0+vec2(1.7,9.2);a*=0.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res; uv.y=1.0-uv.y; float t=u_time*0.18;
  vec2 p=uv*vec2(2.4,1.6);
  float sweep=fbm(p+vec2(t*0.6,t*0.3))*0.5+fbm(p+vec2(t*0.3,-t*0.5)+3.7)*0.3+fbm(p*1.4-vec2(t*0.4,t*0.2)+1.3)*0.2;
  vec3 deep=vec3(0.102,0.192,0.173),mid=vec3(0.263,0.518,0.459),bright=vec3(0.537,0.843,0.718);
  vec3 col=mix(deep,mid,smoothstep(0.38,0.62,sweep));
  col=mix(col,bright,smoothstep(0.55,0.72,sweep)*0.45);
  col*=(0.55+0.45*(1.0-smoothstep(0.3,1.1,length(uv-0.5)*1.4)));
  col+=fbm(uv*6.0+vec2(t*1.2,t*0.8))*0.04*bright;
  gl_FragColor=vec4(col,1.0);
}`;

function ShaderCanvas() {
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const gl = canvas.getContext("webgl"); if (!gl) return;
        const resize = () => { canvas.width = canvas.offsetWidth * devicePixelRatio; canvas.height = canvas.offsetHeight * devicePixelRatio; };
        resize(); window.addEventListener("resize", resize);
        const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
        const prog = gl.createProgram();
        gl.attachShader(prog, mk(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog); gl.useProgram(prog);
        const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, "a_pos"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        const uT = gl.getUniformLocation(prog, "u_time"), uR = gl.getUniformLocation(prog, "u_res");
        let raf, start = null;
        const frame = ts => { if (!start) start = ts; const t = (ts - start) / 1000; gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform1f(uT, t); gl.uniform2f(uR, canvas.width, canvas.height); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); raf = requestAnimationFrame(frame); };
        raf = requestAnimationFrame(frame);
        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
    }, []);
    return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />;
}

function FadeIn({ children, delay = 0, className = "" }) {
    const ref = useRef(null); const [vis, setVis] = useState(false);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.disconnect(); } }, { threshold: 0.15 });
        obs.observe(el); return () => obs.disconnect();
    }, [delay]);
    return (
        <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(18px)", transition: "opacity 0.7s ease,transform 0.7s ease" }}>
            {children}
        </div>
    );
}

// ── Info items ────────────────────────────────────────────────────────────────
const INFO = [
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#89D7B7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
        ),
        label: "Visit us",
        value: "City Hall Annex, Block 4\nDhaka, Bangladesh",
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#89D7B7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.12 1.18 2 2 0 012.12 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
            </svg>
        ),
        label: "Call us",
        value: "+880 1700-000000\nMon–Fri, 9am – 5pm",
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#89D7B7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
        ),
        label: "Email us",
        value: "hello@civicfix.gov\nWe reply within 24 hours",
    },
];

const CATEGORIES = [
    "Road & pavement damage",
    "Streetlight outage",
    "Drainage / flooding",
    "Waste & sanitation",
    "Park or public space",
    "General enquiry",
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", category: "", district: "", message: "" });
    const [sent, setSent] = useState(false);
    const [focused, setFocused] = useState(null);

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
    };

    const inputStyle = (field) => ({
        width: "100%", padding: "13px 16px", borderRadius: 10, fontSize: 15, lineHeight: 1.5,
        background: "rgba(255,244,225,0.06)", color: "#FFF4E1",
        border: focused === field ? "1.5px solid #89D7B7" : "1.5px solid rgba(255,244,225,0.15)",
        outline: "none", transition: "border-color 0.2s", fontFamily: "inherit",
    });

    const labelStyle = { fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,244,225,0.5)", display: "block", marginBottom: 8 };

    return (
        <div style={{ fontFamily: "system-ui,sans-serif", background: "#FFF4E1", minHeight: "100vh" }}>
            <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::placeholder{color:rgba(255,244,225,0.25)!important;}
        select option{background:#1A312C;color:#FFF4E1;}
      `}</style>

            {/* ── Hero ── */}
            <section style={{ position: "relative", overflow: "hidden", background: "#0d2420", minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 32px" }}>
                <ShaderCanvas />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to bottom,transparent,#1A312C)", zIndex: 1, pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 600 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#89D7B7", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                        <span style={{ display: "inline-block", width: 28, height: 1, background: "#89D7B7" }} />
                        Contact Us
                        <span style={{ display: "inline-block", width: 28, height: 1, background: "#89D7B7" }} />
                    </p>
                    <h1 style={{ fontSize: "clamp(34px,5vw,54px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", color: "#FFF4E1", marginBottom: 18 }}>
                        Got something to say?<br />
                        <span style={{ color: "#89D7B7" }}>We're listening.</span>
                    </h1>
                    <p style={{ fontSize: "clamp(15px,1.8vw,17px)", lineHeight: 1.7, color: "rgba(255,244,225,0.6)" }}>
                        Whether it's a report, a question, or feedback — reach out and someone will get back to you within 24 hours.
                    </p>
                </div>
            </section>

            {/* ── Body ── */}
            <section style={{ background: "#1A312C", padding: "80px 32px 100px" }}>
                <div style={{ maxWidth: 1020, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 340px", gap: 64, alignItems: "start" }}>

                    {/* ── Form ── */}
                    <FadeIn>
                        {sent ? (
                            <div style={{ padding: "64px 48px", background: "rgba(137,215,183,0.08)", border: "1.5px solid rgba(137,215,183,0.25)", borderRadius: 20, textAlign: "center" }}>
                                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(137,215,183,0.15)", border: "2px solid #89D7B7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#89D7B7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <h2 style={{ fontSize: 28, fontWeight: 800, color: "#FFF4E1", marginBottom: 12, letterSpacing: "-0.02em" }}>Message received</h2>
                                <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,244,225,0.55)", marginBottom: 32 }}>
                                    Thanks for reaching out. We'll get back to you within 24 hours. In the meantime, you can track any active reports from your dashboard.
                                </p>
                                <button
                                    onClick={() => { setSent(false); setForm({ name: "", email: "", category: "", district: "", message: "" }); }}
                                    style={{ padding: "11px 28px", borderRadius: 10, background: "transparent", border: "1.5px solid rgba(255,244,225,0.2)", color: "rgba(255,244,225,0.7)", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "border-color 0.2s" }}
                                    onMouseOver={e => e.currentTarget.style.borderColor = "rgba(255,244,225,0.4)"}
                                    onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,244,225,0.2)"}>
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#428475", marginBottom: 12 }}>Send a message</p>
                                <h2 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 900, color: "#FFF4E1", letterSpacing: "-0.02em", marginBottom: 40 }}>
                                    Tell us what's on your mind.
                                </h2>
                                <form onSubmit={handleSubmit}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                                        <div>
                                            <label style={labelStyle}>Full name</label>
                                            <input
                                                type="text" placeholder="Rafi Ahmed" required
                                                value={form.name} onChange={set("name")}
                                                onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                                                style={inputStyle("name")}
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Email address</label>
                                            <input
                                                type="email" placeholder="rafi@example.com" required
                                                value={form.email} onChange={set("email")}
                                                onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                                                style={inputStyle("email")}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                                        <div>
                                            <label style={labelStyle}>Category</label>
                                            <select
                                                value={form.category} onChange={set("category")} required
                                                onFocus={() => setFocused("category")} onBlur={() => setFocused(null)}
                                                style={{ ...inputStyle("category"), appearance: "none", cursor: "pointer" }}>
                                                <option value="" disabled>Select a category</option>
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>District</label>
                                            <input
                                                type="text" placeholder="e.g. Mirpur, Gulshan…"
                                                value={form.district} onChange={set("district")}
                                                onFocus={() => setFocused("district")} onBlur={() => setFocused(null)}
                                                style={inputStyle("district")}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: 28 }}>
                                        <label style={labelStyle}>Your message</label>
                                        <textarea
                                            rows={5} placeholder="Describe the issue or question in as much detail as you like…" required
                                            value={form.message} onChange={set("message")}
                                            onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                                            style={{ ...inputStyle("message"), resize: "vertical", minHeight: 120 }}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        style={{ padding: "14px 36px", borderRadius: 12, background: "#89D7B7", border: "none", color: "#1A312C", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "transform 0.15s,box-shadow 0.15s", boxShadow: "0 4px 24px rgba(137,215,183,0.2)" }}
                                        onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(137,215,183,0.38)" }}
                                        onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 24px rgba(137,215,183,0.2)" }}>
                                        Send message →
                                    </button>
                                </form>
                            </div>
                        )}
                    </FadeIn>

                    {/* ── Info sidebar ── */}
                    <FadeIn delay={120}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#428475", marginBottom: 20 }}>Other ways to reach us</p>

                            {INFO.map((item, i) => (
                                <div key={i} style={{ padding: "22px 20px", background: "rgba(255,244,225,0.04)", border: "1px solid rgba(255,244,225,0.08)", borderRadius: 14, display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 4 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(137,215,183,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#428475", marginBottom: 6 }}>{item.label}</p>
                                        {item.value.split("\n").map((line, j) => (
                                            <p key={j} style={{ fontSize: 14, color: j === 0 ? "#FFF4E1" : "rgba(255,244,225,0.45)", lineHeight: 1.6, fontWeight: j === 0 ? 600 : 400 }}>{line}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Response time badge */}
                            <div style={{ marginTop: 16, padding: "20px", background: "rgba(137,215,183,0.07)", border: "1px solid rgba(137,215,183,0.2)", borderRadius: 14 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#89D7B7", flexShrink: 0, animation: "pulse-dot 2s ease-in-out infinite" }} />
                                    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#89D7B7" }}>Currently active</p>
                                </div>
                                <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,244,225,0.55)" }}>
                                    Our response team is online. Average reply time today is <strong style={{ color: "#FFF4E1", fontWeight: 600 }}>under 3 hours.</strong>
                                </p>
                            </div>

                            <style>{`@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.7)}}`}</style>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ── Bottom strip ── */}
            <section style={{ background: "#FFF4E1", padding: "64px 32px", textAlign: "center" }}>
                <FadeIn>
                    <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(26,49,44,0.35)", marginBottom: 12 }}>Prefer to report directly?</p>
                    <h2 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 900, color: "#1A312C", letterSpacing: "-0.02em", marginBottom: 20 }}>
                        Use the issue report form —<br />faster, trackable, and always on record.
                    </h2>
                    <Link to="/submitIssue">
                    <button
                        style={{ padding: "13px 32px", borderRadius: 12, background: "#1A312C", border: "none", color: "#FFF4E1", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "transform 0.15s,box-shadow 0.15s", boxShadow: "0 4px 20px rgba(26,49,44,0.15)" }}
                        onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(26,49,44,0.25)" }}
                        onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(26,49,44,0.15)" }}>
                        File a Report
                    </button>
                    </Link>
                </FadeIn>
            </section>
        </div>
    );
}