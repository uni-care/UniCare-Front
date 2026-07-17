"use client";

// Warm, Animated Abstract SVG Hero Graphic
export default function HeroIllustration() {
    return (
        <svg viewBox="0 0 500 500" className="w-full h-full max-w-[420px] aspect-square mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="warmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#517565" />
                    <stop offset="100%" stopColor="#a4c3b2" />
                </linearGradient>
                <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f6fff8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#a4c3b2" stopOpacity="0.2" />
                </linearGradient>
            </defs>
            <style>{`
                @keyframes rotate-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes pulse-soft {
                    0%, 100% { transform: scale(1); opacity: 0.9; }
                    50% { transform: scale(1.05); opacity: 1; }
                }
                @keyframes float-shape-1 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-12px) rotate(3deg); }
                }
                @keyframes float-shape-2 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(10px) rotate(-4deg); }
                }
                .rotating-orbit {
                    transform-origin: 250px 250px;
                    animation: rotate-slow 30s linear infinite;
                }
                .pulsing-center {
                    transform-origin: 250px 250px;
                    animation: pulse-soft 5s ease-in-out infinite;
                }
                .floating-shape-1 {
                    transform-origin: 150px 150px;
                    animation: float-shape-1 7s ease-in-out infinite;
                }
                .floating-shape-2 {
                    transform-origin: 350px 350px;
                    animation: float-shape-2 6s ease-in-out infinite;
                }
            `}</style>

            {/* Glowing background paths */}
            <circle cx="250" cy="250" r="200" stroke="rgba(164, 195, 178, 0.2)" strokeWidth="1" strokeDasharray="6 6" className="rotating-orbit" />
            <circle cx="250" cy="250" r="160" stroke="rgba(81, 117, 101, 0.12)" strokeWidth="1.5" />

            {/* Layered Abstract Heart/Leaf Center representing care and growth */}
            <g className="pulsing-center">
                <path d="M250 120 C180 50, 80 150, 250 360 C420 150, 320 50, 250 120 Z" fill="url(#glowGrad)" stroke="#517565" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Sprouting leaf lines inside the heart */}
                <path d="M250 330 Q250 240, 250 160" stroke="#517565" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M250 250 C272 230, 292 230, 282 205 C260 205, 250 228, 250 250 Z" fill="rgba(81, 117, 101, 0.15)" stroke="#517565" strokeWidth="1.8" />
                <path d="M250 205 C228 185, 208 185, 218 160 C240 160, 250 182, 250 205 Z" fill="rgba(164, 195, 178, 0.25)" stroke="#517565" strokeWidth="1.8" />
            </g>

            {/* Floating warm abstract tokens */}
            <g className="floating-shape-1">
                <circle cx="120" cy="140" r="30" fill="white" stroke="#a4c3b2" strokeWidth="2" />
                {/* Micro heart symbol */}
                <path d="M120 132 C116 128, 110 130, 120 144 C130 130, 124 128, 120 132 Z" fill="#517565" />
            </g>

            <g className="floating-shape-2">
                <rect x="340" y="320" width="60" height="50" rx="12" fill="white" stroke="#517565" strokeWidth="2" />
                <line x1="355" y1="338" x2="385" y2="338" stroke="#a4c3b2" strokeWidth="2" strokeLinecap="round" />
                <line x1="355" y1="345" x2="375" y2="345" stroke="#517565" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Soft decorative elements */}
            <circle cx="360" cy="170" r="12" fill="rgba(81, 117, 101, 0.08)" stroke="#517565" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="150" cy="330" r="22" fill="rgba(164, 195, 178, 0.1)" stroke="#a4c3b2" strokeWidth="1" />
        </svg>
    );
}
