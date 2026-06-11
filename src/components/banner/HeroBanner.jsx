import { useEffect, useRef, useState } from "react";

const VERT = `
  attribute vec2 a_pos;
  void main(){ gl_Position = vec4(a_pos,0,1); }
`;

const FRAG = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_res;

  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    f = f*f*(3.0-2.0*f);
    float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
  }
  float fbm(vec2 p){
    float v=0.0, a=0.5;
    for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.0+vec2(1.7,9.2); a*=0.5; }
    return v;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / u_res;
    uv.y = 1.0 - uv.y;
    float t = u_time * 0.18;

    vec2 p = uv * vec2(2.4, 1.6);
    float n1 = fbm(p + vec2(t*0.6, t*0.3));
    float n2 = fbm(p + vec2(t*0.3, -t*0.5) + 3.7);
    float n3 = fbm(p * 1.4 - vec2(t*0.4, t*0.2) + 1.3);

    float sweep = n1*0.5 + n2*0.3 + n3*0.2;
    float band  = smoothstep(0.38, 0.62, sweep);

    vec3 deep   = vec3(0.102, 0.192, 0.173);
    vec3 mid    = vec3(0.263, 0.518, 0.459);
    vec3 bright = vec3(0.537, 0.843, 0.718);

    vec3 col = mix(deep, mid, band);
    col = mix(col, bright, smoothstep(0.55, 0.72, sweep) * 0.45);

    float vignette = 1.0 - smoothstep(0.3, 1.1, length(uv - 0.5) * 1.4);
    col *= (0.55 + 0.45 * vignette);

    float shimmer = fbm(uv * 6.0 + vec2(t*1.2, t*0.8)) * 0.04;
    col += shimmer * bright;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function compileShader(gl, type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
}

function ShaderCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl");
        if (!gl) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        };
        resize();
        window.addEventListener("resize", resize);

        const prog = gl.createProgram();
        gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            gl.STATIC_DRAW
        );
        const aPos = gl.getAttribLocation(prog, "a_pos");
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        const uTime = gl.getUniformLocation(prog, "u_time");
        const uRes = gl.getUniformLocation(prog, "u_res");

        let rafId, start = null;
        const frame = (ts) => {
            if (!start) start = ts;
            const t = (ts - start) / 1000;
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform1f(uTime, t);
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            rafId = requestAnimationFrame(frame);
        };
        rafId = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ display: "block" }}
        />
    );
}

function PulsingPin() {
    return (
        <div className="relative flex items-center justify-center w-[72px] h-[72px] mx-auto">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: `${100 + i * 40}%`,
                        height: `${100 + i * 40}%`,
                        border: `${1.5 - i * 0.3}px solid`,
                        borderColor: i === 0 ? "#89D7B7" : "#428475",
                        opacity: 0.5 - i * 0.15,
                        animation: `ripple 2.2s ease-out infinite ${i * 0.55}s`,
                    }}
                />
            ))}
            <div
                className="relative z-10 flex items-center justify-center w-[52px] h-[52px] rounded-full"
                style={{
                    background: "#89D7B7",
                    boxShadow: "0 0 32px rgba(137,215,183,0.35)",
                }}
            >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                        fill="#1A312C"
                    />
                </svg>
            </div>
        </div>
    );
}

function StatPill({ label, delay = 0 }) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    return (
        <div
            className="flex items-center gap-2 px-[18px] py-2 rounded-full backdrop-blur-sm"
            style={{
                background: "rgba(66,132,117,0.25)",
                border: "1px solid rgba(137,215,183,0.25)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.55s ease, transform 0.55s ease",
            }}
        >
            <span
                className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                style={{
                    background: "#89D7B7",
                    animation: `pulseDot 2s ease-in-out infinite ${delay * 0.001}s`,
                }}
            />
            <span
                className="text-[13px] font-medium"
                style={{ color: "rgba(255,244,225,0.8)" }}
            >
                {label}
            </span>
        </div>
    );
}

export default function HeroBanner() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const delays = [80, 160, 260, 380, 500, 650];
        const timers = delays.map((d, i) =>
            setTimeout(() => setPhase((p) => Math.max(p, i + 1)), d)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    const fade = (show) => ({
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.65s ease, transform 0.65s ease",
    });

    return (
        <>
            <style>{`
        @keyframes ripple {
          0%   { transform: scale(0.85); opacity: 0.6; }
          100% { transform: scale(1.6);  opacity: 0;   }
        }
        @keyframes pulseDot {
          0%,100% { opacity: 1; transform: scale(1);   }
          50%     { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>

            <div
                className="relative overflow-hidden flex flex-col items-center justify-center min-h-[92vh] px-6 py-20 text-center"
                style={{ background: "#0d2420" }}
            >
                <ShaderCanvas />

                {/* Bottom fade */}
                <div
                    className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 z-10"
                    style={{ background: "linear-gradient(to bottom, transparent, #1A312C)" }}
                />

                <div className="relative z-20 flex flex-col items-center max-w-2xl gap-7">
                    {/* Eyebrow */}
                    <div style={fade(phase >= 1)} className="flex items-center gap-3">
                        <span className="inline-block w-7 h-px" style={{ background: "#89D7B7" }} />
                        <span
                            className="text-[11px] font-bold tracking-[0.2em] uppercase"
                            style={{ color: "#89D7B7" }}
                        >
                            Civic Issue Reporting
                        </span>
                        <span className="inline-block w-7 h-px" style={{ background: "#89D7B7" }} />
                    </div>

                    {/* Pin */}
                    <div style={fade(phase >= 2)}>
                        <PulsingPin />
                    </div>

                    {/* Headline */}
                    <h1
                        className="text-[clamp(38px,6vw,62px)] font-black leading-[1.05] tracking-[-0.03em] m-0"
                        style={{ ...fade(phase >= 3), color: "#FFF4E1" }}
                    >
                        Report it.{" "}
                        <span style={{ color: "#89D7B7" }}>Track it.</span>
                        <br />
                        See it fixed.
                    </h1>

                    {/* Subtext */}
                    <p
                        className="text-[clamp(15px,2vw,18px)] leading-[1.65] max-w-[480px] m-0"
                        style={{ ...fade(phase >= 4), color: "rgba(255,244,225,0.65)" }}
                    >
                        Spotted a broken streetlight, pothole, or public hazard? Submit it
                        in seconds — our team gets assigned and resolves it fast.
                    </p>

                    {/* CTAs */}
                    <div
                        style={fade(phase >= 5)}
                        className="flex flex-wrap gap-3 justify-center"
                    >
                        <button
                            className="px-7 py-[14px] rounded-xl font-bold text-[15px] border-none cursor-pointer transition-all duration-150"
                            style={{
                                background: "#89D7B7",
                                color: "#1A312C",
                                boxShadow: "0 4px 24px rgba(137,215,183,0.28)",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 32px rgba(137,215,183,0.45)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "";
                                e.currentTarget.style.boxShadow = "0 4px 24px rgba(137,215,183,0.28)";
                            }}
                        >
                            Report an Issue
                        </button>
                        <button
                            className="px-7 py-[14px] rounded-xl font-semibold text-[15px] cursor-pointer transition-all duration-150"
                            style={{
                                background: "rgba(255,244,225,0.06)",
                                border: "1.5px solid rgba(255,244,225,0.2)",
                                color: "#FFF4E1",
                                backdropFilter: "blur(8px)",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.borderColor = "rgba(255,244,225,0.4)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "";
                                e.currentTarget.style.borderColor = "rgba(255,244,225,0.2)";
                            }}
                        >
                            View Open Issues
                        </button>
                    </div>

                    {/* Pills */}
                    <div
                        style={fade(phase >= 6)}
                        className="flex flex-wrap gap-[10px] justify-center"
                    >
                        <StatPill label="2,400+ issues resolved" delay={900} />
                        <StatPill label="Avg. 48h response" delay={1050} />
                        <StatPill label="12 districts covered" delay={1200} />
                    </div>
                </div>
            </div>
        </>
    );
}