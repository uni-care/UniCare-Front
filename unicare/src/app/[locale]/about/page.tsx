"use client";

import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import {
    MdOutlineExplore,
    MdOutlineDiversity3,
    MdOutlineTrendingUp,
    MdOutlineArrowForward
} from "react-icons/md";

// Clean, custom line art illustration with embedded CSS animations for the Hero section
const HeroIllustration = ({ isAr }: { isAr: boolean }) => {
    const xLeft = 100;
    const xRight = 400;

    const x1 = isAr ? xRight : xLeft; // Step 1 Node X (Right for RTL, Left for LTR)
    const x2 = isAr ? xLeft : xRight; // Step 2 Node X (Left for RTL, Right for LTR)
    const x3 = isAr ? xRight : xLeft; // Step 3 Node X (Right for RTL, Left for LTR)

    const textX1 = isAr ? x1 - 50 : x1 + 50;
    const textX2 = isAr ? x2 + 50 : x2 - 50;
    const textX3 = isAr ? x3 - 50 : x3 + 50;

    // Under explicit direction styling, 'start' maps to right-edge in RTL and left-edge in LTR.
    // 'end' maps to left-edge in RTL and right-edge in LTR.
    const textAnchor1 = "start";
    const textAnchor2 = "end";
    const textAnchor3 = "start";

    // Curve path starting at y=40, through y=120, y=310, y=500 to y=580
    const pathD = isAr
        ? "M 400 40 L 400 120 C 400 210, 100 210, 100 310 C 100 410, 400 410, 400 500 L 400 580"
        : "M 100 40 L 100 120 C 100 210, 400 210, 400 310 C 400 410, 100 410, 100 500 L 100 580";

    return (
        <svg viewBox="0 0 500 620" className="w-full h-full min-h-[560px] max-h-[620px] py-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <mask id="roadmap-mask">
                    <rect x="0" y="0" width="500" height="620" fill="black" />
                    <path
                        d={pathD}
                        stroke="white"
                        strokeWidth="10"
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                        className="animate-[draw-path_2.2s_ease-out_forwards]"
                    />
                </mask>
            </defs>

            <style>{`
                @keyframes draw-path {
                    0% { stroke-dashoffset: 1000; }
                    100% { stroke-dashoffset: 0; }
                }
                @keyframes flow-dots {
                    0% { stroke-dashoffset: 60; }
                    100% { stroke-dashoffset: 0; }
                }
                @keyframes fade-in-step {
                    0% { opacity: 0; transform: translateY(4px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* Winding Curvy Connecting Path - using Primary Green and masked for draw-in animation */}
            <path
                d={pathD}
                stroke="#6a907f"
                strokeWidth="2.5"
                strokeDasharray="6 8"
                className="animate-[flow-dots_4s_linear_infinite]"
                strokeLinecap="round"
                mask="url(#roadmap-mask)"
            />

            {/* Step 1: List / Share */}
            <g className="animate-[fade-in-step_0.6s_ease-out_both]" style={{ animationDelay: '0.4s' }}>
                <circle cx={x1} cy="120" r="28" fill="white" stroke="#6a907f" strokeWidth="2" className="shadow-sm" />
                {/* Document / Listing Icon */}
                <rect x={x1 - 10} y="110" width="20" height="20" rx="3" stroke="#6a907f" strokeWidth="2" fill="white" />
                <line x1={x1 - 5} y1="116" x2={x1 + 5} y2="116" stroke="#6a907f" strokeWidth="1.8" strokeLinecap="round" />
                <line x1={x1 - 5} y1="121" x2={x1 + 5} y2="121" stroke="#6a907f" strokeWidth="1.8" strokeLinecap="round" />
                <line x1={x1 - 5} y1="126" x2={x1 + 1} y2="126" stroke="#6a907f" strokeWidth="1.8" strokeLinecap="round" />

                {/* Text Block */}
                <text x={textX1} y="114" textAnchor={textAnchor1} style={{ direction: isAr ? 'rtl' : 'ltr' }} className="fill-neutral-900 font-extrabold text-[15px] font-sans">
                    {isAr ? "١. اعرض وشارك" : "1. LIST & SHARE"}
                </text>
                <text x={textX1} y="133" textAnchor={textAnchor1} style={{ direction: isAr ? 'rtl' : 'ltr' }} className="fill-neutral-500 text-[12px] font-normal font-sans">
                    {isAr ? "اعرض أدوات الرسم، الآلات الحاسبة،" : "Post drawing tools, calculators,"}
                </text>
                <text x={textX1} y="149" textAnchor={textAnchor1} style={{ direction: isAr ? 'rtl' : 'ltr' }} className="fill-neutral-500 text-[12px] font-normal font-sans">
                    {isAr ? "أو الكتب الجامعية التي لا تستخدمها." : "or textbook resources on campus."}
                </text>
            </g>

            {/* Step 2: Match / Connect */}
            <g className="animate-[fade-in-step_0.6s_ease-out_both]" style={{ animationDelay: '1.1s' }}>
                <circle cx={x2} cy="310" r="28" fill="white" stroke="#a4c3b2" strokeWidth="2" className="shadow-sm" />
                {/* Double Node Exchange Icon - using Muted Teal */}
                <circle cx={x2 - 6} cy="310" r="5" stroke="#a4c3b2" strokeWidth="2" fill="white" />
                <circle cx={x2 + 6} cy="310" r="5" stroke="#a4c3b2" strokeWidth="2" fill="white" />
                <path d={`M ${x2 - 1} 310 H ${x2 + 1}`} stroke="#a4c3b2" strokeWidth="2" />
                <path d={`M ${x2 - 6} 305 Q ${x2} 298, ${x2 + 6} 305`} stroke="#a4c3b2" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d={`M ${x2 + 6} 315 Q ${x2} 322, ${x2 - 6} 315`} stroke="#a4c3b2" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                {/* Text Block */}
                <text x={textX2} y="304" textAnchor={textAnchor2} style={{ direction: isAr ? 'rtl' : 'ltr' }} className="fill-neutral-900 font-extrabold text-[15px] font-sans">
                    {isAr ? "٢. تواصل ونسق" : "2. CONNECT & COORDINATE"}
                </text>
                <text x={textX2} y="323" textAnchor={textAnchor2} style={{ direction: isAr ? 'rtl' : 'ltr' }} className="fill-neutral-500 text-[12px] font-normal font-sans">
                    {isAr ? "تنسيق آمن ومباشر مع زملائك" : "Coordinate safely with verified peers"}
                </text>
                <text x={textX2} y="339" textAnchor={textAnchor2} style={{ direction: isAr ? 'rtl' : 'ltr' }} className="fill-neutral-500 text-[12px] font-normal font-sans">
                    {isAr ? "من مختلف الكليات والتخصصات." : "from all university departments."}
                </text>
            </g>

            {/* Step 3: Success / Grow */}
            <g className="animate-[fade-in-step_0.6s_ease-out_both]" style={{ animationDelay: '1.8s' }}>
                <circle cx={x3} cy="500" r="28" fill="white" stroke="#6a907f" strokeWidth="2" className="shadow-sm" />
                {/* Academic Success / Sprout Icon */}
                <path d={`M ${x3} 512 V 492`} stroke="#6a907f" strokeWidth="2" strokeLinecap="round" />
                <path d={`M ${x3} 502 Q ${x3 - 8} 496, ${x3 - 8} 488 Q ${x3} 490, ${x3} 497 Z`} fill="rgba(106, 144, 127, 0.08)" stroke="#6a907f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d={`M ${x3} 498 Q ${x3 + 8} 492, ${x3 + 8} 484 Q ${x3} 486, ${x3} 493 Z`} fill="rgba(106, 144, 127, 0.08)" stroke="#6a907f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

                {/* Text Block */}
                <text x={textX3} y="494" textAnchor={textAnchor3} style={{ direction: isAr ? 'rtl' : 'ltr' }} className="fill-neutral-900 font-extrabold text-[15px] font-sans">
                    {isAr ? "٣. وفر وانجح" : "3. SAVE & EXCEL"}
                </text>
                <text x={textX3} y="513" textAnchor={textAnchor3} style={{ direction: isAr ? 'rtl' : 'ltr' }} className="fill-neutral-500 text-[12px] font-normal font-sans">
                    {isAr ? "وفر التكاليف الدراسية ودعم زملائك" : "Reduce university expenses while"}
                </text>
                <text x={textX3} y="529" textAnchor={textAnchor3} style={{ direction: isAr ? 'rtl' : 'ltr' }} className="fill-neutral-500 text-[12px] font-normal font-sans">
                    {isAr ? "لبناء مجتمع طلابي مستدام." : "supporting a sustainable community."}
                </text>
            </g>
        </svg>
    );
};

const NarrativeIllustration = ({ isAr }: { isAr: boolean }) => (
    <svg viewBox="0 0 500 320" className="w-full h-full max-h-[300px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6a907f" />
                <stop offset="50%" stopColor="#a4c3b2" />
                <stop offset="100%" stopColor="#6a907f" />
            </linearGradient>
            <filter id="glow-soft" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>

        <style>{`
            @keyframes path-dash {
                0% { stroke-dashoffset: 400; }
                100% { stroke-dashoffset: 0; }
            }
            @keyframes pulse-node {
                0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(106,144,127,0.1)); }
                50% { transform: scale(1.05); filter: drop-shadow(0 0 8px rgba(106,144,127,0.3)); }
            }
        `}</style>

        {/* Orbit dotted connection track */}
        <path
            d="M 120 160 C 120 80, 200 80, 250 160 C 300 240, 380 240, 380 160 C 380 80, 300 80, 250 160 C 200 240, 120 240, 120 160"
            stroke="rgba(106, 144, 127, 0.08)"
            strokeWidth="10"
            strokeLinecap="round"
        />

        {/* Dotted Flow animation line */}
        <path
            d="M 120 160 C 120 80, 200 80, 250 160 C 300 240, 380 240, 380 160 C 380 80, 300 80, 250 160 C 200 240, 120 240, 120 160"
            stroke="url(#flowGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="15 85"
            className="animate-[path-dash_6s_linear_infinite]"
        />

        {/* Item Node Left (Book / Knowledge) */}
        <g className="animate-[pulse-node_4s_ease-in-out_infinite] origin-center" style={{ transformOrigin: '120px 160px' }}>
            <circle cx="120" cy="160" r="22" fill="white" stroke="#6a907f" strokeWidth="2.5" filter="url(#glow-soft)" />
            {/* Book symbol */}
            <path d="M113 154 H127 V166 H113 Z" stroke="#6a907f" strokeWidth="1.5" />
            <path d="M117 158 H123 M117 162 H123" stroke="#6a907f" strokeWidth="1.5" />
            <text x="120" y="198" textAnchor="middle" style={{ direction: isAr ? 'rtl' : 'ltr' }} className="text-[10px] font-bold fill-neutral-600 font-sans tracking-wide">
                {isAr ? "استعارة" : "BORROW"}
            </text>
        </g>

        {/* Exchange Center Node */}
        <g className="origin-center" style={{ transformOrigin: '250px 160px' }}>
            <circle cx="250" cy="160" r="16" fill="white" stroke="#a4c3b2" strokeWidth="2" filter="url(#glow-soft)" />
            {/* Arrows */}
            <path d="M246 157 L250 153 L254 157 M254 163 L250 167 L246 163" stroke="#a4c3b2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Item Node Right (Lab Tool / Hardware) */}
        <g className="animate-[pulse-node_4s_ease-in-out_infinite_2s] origin-center" style={{ transformOrigin: '380px 160px' }}>
            <circle cx="380" cy="160" r="22" fill="white" stroke="#6a907f" strokeWidth="2.5" filter="url(#glow-soft)" />
            {/* Calculator/Tool symbol */}
            <path d="M375 153 H385 V167 H375 Z" stroke="#6a907f" strokeWidth="1.5" />
            <circle cx="378" cy="157" r="1" fill="#6a907f" />
            <circle cx="382" cy="157" r="1" fill="#6a907f" />
            <circle cx="378" cy="161" r="1" fill="#6a907f" />
            <circle cx="382" cy="161" r="1" fill="#6a907f" />
            <text x="380" y="198" textAnchor="middle" style={{ direction: isAr ? 'rtl' : 'ltr' }} className="text-[10px] font-bold fill-neutral-600 font-sans tracking-wide">
                {isAr ? "إعارة" : "LEND"}
            </text>
        </g>
    </svg>
);

export default function AboutPage() {
    const t = useTranslations("About");
    const locale = useLocale();
    const isAr = locale === "ar";

    return (
        <div className="bg-background-light min-h-screen pt-28 pb-20 overflow-hidden">
            {/* Hero Section - Split Layout */}
            <section className="max-w-6xl mx-auto px-4 md:px-8 py-10">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
                    {/* Left: Mission Text */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:pe-12 animate-in fade-in slide-in-from-left duration-700">
                        <div className="flex flex-col gap-2 text-start items-start">
                            <div className="flex gap-3 mb-2 items-center">
                                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-[#345144] text-xs font-bold w-fit uppercase tracking-wide">
                                    {t("ourStory")}
                                </span>
                                <span className="text-neutral-400 text-xs font-semibold tracking-wide">
                                    {isAr ? "• تأسس ٢٠٢٦" : "• Est. 2026"}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-neutral-900 bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
                                {t("heroTitle")}
                            </h1>
                            <div className="flex flex-col gap-4 mt-4 w-full">
                                <div className="flex flex-col gap-2.5 p-5 rounded-2xl bg-neutral-500/[0.02] border border-neutral-200/50 backdrop-blur-sm transition-all duration-300 hover:border-neutral-300/60 text-start">
                                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                                        {t("theHurdle")}
                                    </span>
                                    <p className="text-neutral-500 text-sm md:text-base font-normal leading-relaxed">
                                        {t("heroDesc1")}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2.5 p-5 rounded-2xl bg-primary/[0.01] border border-primary/10 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 text-start">
                                    <span className="text-xs font-bold uppercase tracking-widest text-primary">
                                        {t("theVision")}
                                    </span>
                                    <p className="text-neutral-500 text-sm md:text-base font-normal leading-relaxed">
                                        {t("heroDesc2")}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-2">
                            <Link
                                href="/marketplace"
                                className="flex items-center justify-center rounded-xl h-12 px-6 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                            >
                                {t("manifestoCta")}
                            </Link>
                            <Link
                                href="/register"
                                className="flex items-center justify-center rounded-xl h-12 px-6 border border-primary/30 text-primary text-base font-bold hover:bg-primary/5 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                            >
                                {t("teamCta")}
                            </Link>
                        </div>
                    </div>

                    {/* Right: Hero Graphic (Simplicity SVG) */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-4 animate-in fade-in slide-in-from-right duration-700">
                        <HeroIllustration isAr={isAr} />
                    </div>
                </div>
            </section>

            {/* Mission Values Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 border-t border-neutral-200/60 mt-10">
                <div className="flex flex-col gap-4 text-center items-center mb-12 animate-in fade-in duration-1000">
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight text-neutral-900 max-w-[720px]">
                        {t("valuesTitle")}
                    </h2>
                    <p className="text-neutral-500 text-base font-normal leading-normal max-w-[600px]">
                        {t("valuesSubtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="group flex flex-1 gap-6 rounded-2xl border border-neutral-200/80 bg-white p-8 flex-col hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 text-start items-start animate-in fade-in slide-in-from-bottom duration-700">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-md">
                            <MdOutlineExplore className="text-2xl" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-bold leading-tight text-neutral-900 group-hover:text-primary transition-colors">{t("value1Title")}</h3>
                            <p className="text-neutral-500 text-sm font-normal leading-relaxed">
                                {t("value1Desc")}
                            </p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="group flex flex-1 gap-6 rounded-2xl border border-neutral-200/80 bg-white p-8 flex-col hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 text-start items-start animate-in fade-in slide-in-from-bottom duration-700">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-md">
                            <MdOutlineDiversity3 className="text-2xl" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-bold leading-tight text-neutral-900 group-hover:text-primary transition-colors">{t("value2Title")}</h3>
                            <p className="text-neutral-500 text-sm font-normal leading-relaxed">
                                {t("value2Desc")}
                            </p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="group flex flex-1 gap-6 rounded-2xl border border-neutral-200/80 bg-white p-8 flex-col hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 text-start items-start animate-in fade-in slide-in-from-bottom duration-700">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-md">
                            <MdOutlineTrendingUp className="text-2xl" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-bold leading-tight text-neutral-900 group-hover:text-primary transition-colors">{t("value3Title")}</h3>
                            <p className="text-neutral-500 text-sm font-normal leading-relaxed">
                                {t("value3Desc")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Highlight / Narrative Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 mt-6 animate-in fade-in duration-1000">
                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 rounded-3xl bg-gradient-to-br from-primary/5 via-teal-500/[0.02] to-transparent border border-primary/10 p-8 md:p-14 backdrop-blur-md">
                    <div className="flex flex-1 flex-col gap-6 text-start items-start">
                        <div className="flex flex-col gap-3">
                            <h3 className="text-2xl md:text-3xl font-extrabold leading-snug py-1 text-neutral-900 bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
                                {t("narrativeTitle")}
                            </h3>
                            <p className="text-neutral-500 text-base font-normal leading-relaxed">
                                {t("narrativeDesc")}
                            </p>
                        </div>
                        <Link
                            href="/marketplace"
                            className="flex items-center justify-center rounded-xl h-12 px-6 bg-primary text-white text-sm font-bold w-fit hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-lg shadow-primary/20"
                        >
                            {t("narrativeCta")}
                            <MdOutlineArrowForward className="text-base transition-transform rtl:rotate-180 ms-2" />
                        </Link>
                    </div>
                    <div className="relative w-full md:w-1/2 flex items-center justify-center p-4">
                        <NarrativeIllustration isAr={isAr} />
                    </div>
                </div>
            </section>
        </div>
    );
}
