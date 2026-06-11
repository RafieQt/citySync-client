import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

// ── Shared shader (same as hero) ──────────────────────────────────────────────
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
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;
    const resize = () => { canvas.width = canvas.offsetWidth * devicePixelRatio; canvas.height = canvas.offsetHeight * devicePixelRatio; };
    resize(); window.addEventListener("resize", resize);
    const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(prog, "u_time"), uR = gl.getUniformLocation(prog, "u_res");
    let raf, start = null;
    const frame = ts => { if (!start) start = ts; const t = (ts-start)/1000; gl.viewport(0,0,canvas.width,canvas.height); gl.uniform1f(uT,t); gl.uniform2f(uR,canvas.width,canvas.height); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); raf=requestAnimationFrame(frame); };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"absolute",inset:0,width:"100%",height:"100%",display:"block" }} />;
}

// ── Fade-in on scroll ─────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
      {children}
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const VALUES = [
  { num: "01", title: "Transparency first", body: "Every reported issue is public. Every status update is visible. Residents always know exactly where things stand — no black boxes, no runaround." },
  { num: "02", title: "Speed over process", body: "We cut the red tape between a citizen's report and the crew that fixes it. Automated routing means the right team is assigned in minutes, not days." },
  { num: "03", title: "Accountability built in", body: "Staff assignments are tracked, deadlines are enforced, and resolution rates are published monthly. If it slips, you'll know before we do." },
];

const STATS = [
  { value: "2,400+", label: "Issues resolved" },
  { value: "48 hrs", label: "Avg. response time" },
  { value: "12",     label: "Districts covered" },
  { value: "94%",    label: "Satisfaction rate" },
];

const TEAM = [
  { initials: "AR", name: "Amina Rashid",   role: "Executive Director",      bio: "Former city planner with 14 years in public infrastructure." },
  { initials: "KD", name: "Kofi Danso",     role: "Head of Field Operations", bio: "Coordinates all on-ground response teams across 12 districts." },
  { initials: "SR", name: "Sara Reyes",     role: "Community Liaison",        bio: "Bridges resident feedback and administrative action every day." },
  { initials: "TN", name: "Tariq Nasser",   role: "Platform Lead",            bio: "Builds and maintains the systems that keep everything moving." },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#FFF4E1", minHeight: "100vh" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes ripple { 0%{transform:scale(0.85);opacity:0.6} 100%{transform:scale(1.6);opacity:0} }
      `}</style>

      {/* ── Hero ── */}
      <section style={{ position: "relative", overflow: "hidden", background: "#0d2420", minHeight: 480, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 32px" }}>
        <ShaderCanvas />
        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:80,background:"linear-gradient(to bottom,transparent,#1A312C)",zIndex:1,pointerEvents:"none" }} />
        <div style={{ position:"relative",zIndex:2,textAlign:"center",maxWidth:680 }}>
          <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#89D7B7",marginBottom:24,display:"flex",alignItems:"center",justifyContent:"center",gap:12 }}>
            <span style={{display:"inline-block",width:28,height:1,background:"#89D7B7"}}/>
            About Us
            <span style={{display:"inline-block",width:28,height:1,background:"#89D7B7"}}/>
          </p>
          <h1 style={{ fontSize:"clamp(36px,5.5vw,58px)",fontWeight:900,lineHeight:1.05,letterSpacing:"-0.03em",color:"#FFF4E1",marginBottom:20 }}>
            Built for the people<br/>
            <span style={{color:"#89D7B7"}}>who built the city.</span>
          </h1>
          <p style={{ fontSize:"clamp(15px,1.8vw,18px)",lineHeight:1.7,color:"rgba(255,244,225,0.65)",maxWidth:520,margin:"0 auto" }}>
            CitySync started as a single spreadsheet shared between three neighbourhood organisers. Today it connects thousands of residents with the teams that keep their streets safe and running.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section style={{ background:"#1A312C",padding:"96px 32px" }}>
        <div style={{ maxWidth:860,margin:"0 auto" }}>
          <FadeIn>
            <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"#428475",marginBottom:32 }}>Our mission</p>
          </FadeIn>
          <FadeIn delay={80}>
            <p style={{ fontSize:"clamp(26px,4vw,44px)",fontWeight:800,lineHeight:1.2,color:"#FFF4E1",letterSpacing:"-0.02em" }}>
              To make public infrastructure responsive to the people who depend on it — not the other way around.
            </p>
          </FadeIn>
          <FadeIn delay={160}>
            <div style={{ marginTop:48,paddingTop:48,borderTop:"1px solid rgba(255,244,225,0.1)" }}>
              <p style={{ fontSize:16,lineHeight:1.75,color:"rgba(255,244,225,0.6)",maxWidth:640 }}>
                For too long, reporting a broken bench or flooded drain meant filling out a form that disappeared into a system no one trusted. CitySync changes that contract. We give residents a direct line to action, and we give administrators the tools to honour it. Every issue logged has a name, a location, an assignee, and a deadline. Nothing is anonymous. Nothing is forgotten.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ background:"#FFF4E1",padding:"96px 32px" }}>
        <div style={{ maxWidth:860,margin:"0 auto" }}>
          <FadeIn>
            <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"#428475",marginBottom:64 }}>How we work</p>
          </FadeIn>
          <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
            {VALUES.map((v, i) => (
              <FadeIn key={v.num} delay={i * 100}>
                <div style={{ display:"grid",gridTemplateColumns:"120px 1fr",gap:32,padding:"48px 0",borderTop:"1px solid rgba(26,49,44,0.12)",position:"relative",overflow:"hidden" }}>
                  <span style={{ fontSize:96,fontWeight:900,color:"#89D7B7",opacity:0.12,lineHeight:1,userSelect:"none",letterSpacing:"-0.04em" }}>{v.num}</span>
                  <div style={{ paddingTop:8 }}>
                    <h3 style={{ fontSize:22,fontWeight:800,color:"#1A312C",marginBottom:14,letterSpacing:"-0.02em" }}>{v.title}</h3>
                    <p style={{ fontSize:16,lineHeight:1.7,color:"rgba(26,49,44,0.65)" }}>{v.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background:"#428475",padding:"80px 32px" }}>
        <div style={{ maxWidth:860,margin:"0 auto" }}>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:2 }}>
            {STATS.map((s,i) => (
              <FadeIn key={s.label} delay={i*80}>
                <div style={{ padding:"40px 32px",textAlign:"center" }}>
                  <p style={{ fontSize:"clamp(36px,4vw,52px)",fontWeight:900,color:"#FFF4E1",letterSpacing:"-0.03em",lineHeight:1,marginBottom:10 }}>{s.value}</p>
                  <p style={{ fontSize:13,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,244,225,0.6)" }}>{s.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section style={{ background:"#FFF4E1",padding:"96px 32px" }}>
        <div style={{ maxWidth:860,margin:"0 auto" }}>
          <FadeIn>
            <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"#428475",marginBottom:16 }}>The team</p>
            <h2 style={{ fontSize:"clamp(28px,4vw,42px)",fontWeight:900,color:"#1A312C",letterSpacing:"-0.03em",marginBottom:64 }}>
              The people behind<br/>every resolved issue.
            </h2>
          </FadeIn>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:24 }}>
            {TEAM.map((m,i) => (
              <FadeIn key={m.name} delay={i*80}>
                <div style={{ background:"#fff",border:"1px solid rgba(26,49,44,0.1)",borderRadius:16,padding:"28px 24px",transition:"transform 0.2s,box-shadow 0.2s" }}
                  onMouseOver={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(26,49,44,0.1)"}}
                  onMouseOut={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
                  <div style={{ width:52,height:52,borderRadius:"50%",background:"#1A312C",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16 }}>
                    <span style={{ fontSize:16,fontWeight:700,color:"#89D7B7",letterSpacing:"0.05em" }}>{m.initials}</span>
                  </div>
                  <p style={{ fontSize:17,fontWeight:800,color:"#1A312C",marginBottom:4,letterSpacing:"-0.01em" }}>{m.name}</p>
                  <p style={{ fontSize:12,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#428475",marginBottom:14 }}>{m.role}</p>
                  <p style={{ fontSize:14,lineHeight:1.65,color:"rgba(26,49,44,0.6)" }}>{m.bio}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section style={{ background:"#1A312C",padding:"80px 32px",textAlign:"center" }}>
        <FadeIn>
          <h2 style={{ fontSize:"clamp(24px,3.5vw,38px)",fontWeight:900,color:"#FFF4E1",letterSpacing:"-0.02em",marginBottom:12 }}>
            See something that needs fixing?
          </h2>
          <p style={{ fontSize:16,color:"rgba(255,244,225,0.55)",marginBottom:36 }}>Takes 30 seconds.</p>
          <Link to="/submitIssue">
          <button
            style={{ padding:"14px 36px",borderRadius:12,background:"#89D7B7",border:"none",color:"#1A312C",fontSize:15,fontWeight:700,cursor:"pointer",transition:"transform 0.15s,box-shadow 0.15s",boxShadow:"0 4px 24px rgba(137,215,183,0.25)" }}
            onMouseOver={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 32px rgba(137,215,183,0.4)"}}
            onMouseOut={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 4px 24px rgba(137,215,183,0.25)"}}>
            Report an Issue
          </button>
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}