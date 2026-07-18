"use client";

import { useEffect } from "react";
import { useRouter, Link } from "@/i18n/routing";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "next-intl";
import { CreateAccountForm } from "@/components/auth/create-account-form";
import { cn } from "@/lib/utils";

const RegisterIllustration = ({ isAr }: { isAr: boolean }) => (
  <svg viewBox="0 0 400 300" className="w-full max-w-[360px] h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="registerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#517565" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#a4c3b2" stopOpacity="0.85" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
      </filter>
    </defs>
    
    <style>{`
      @keyframes crawl-trail {
        to { stroke-dashoffset: -24; }
      }
      @keyframes scale-node {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.04); }
      }
      @keyframes pulse-sparkle {
        0%, 100% { opacity: 0.4; transform: scale(0.9); }
        50% { opacity: 1; transform: scale(1.25); }
      }
    `}</style>

    {/* Connecting Curved Pathway - Wavy treasure map style */}
    <path 
      d="M 105 150 C 110 110, 160 70, 200 55 C 240 40, 280 110, 295 150 C 310 190, 260 230, 200 245 C 140 260, 100 190, 105 150" 
      stroke="rgba(81, 117, 101, 0.12)" 
      strokeWidth="5" 
      strokeLinecap="round"
      fill="none"
    />
    <path 
      d="M 105 150 C 110 110, 160 70, 200 55 C 240 40, 280 110, 295 150 C 310 190, 260 230, 200 245 C 140 260, 100 190, 105 150" 
      stroke="url(#registerGrad)" 
      strokeWidth="2.5" 
      strokeDasharray="4 8" 
      strokeLinecap="round"
      className="animate-[crawl-trail_8s_linear_infinite]" 
      fill="none"
    />

    {/* Value Sparks on the wavy path */}
    {/* Top Left Spark */}
    <g className="animate-[pulse-sparkle_3s_ease-in-out_infinite] origin-center" style={{ transformOrigin: '152px 98px' }}>
      <path d="M 152 98 Q 152 98, 152 94 Q 152 98, 156 98 Q 152 98, 152 102 Q 152 98, 148 98 Z" fill="#517565" />
    </g>
    {/* Top Right Spark */}
    <g className="animate-[pulse-sparkle_3s_ease-in-out_infinite_0.75s] origin-center" style={{ transformOrigin: '252px 98px' }}>
      <path d="M 252 98 Q 252 98, 252 94 Q 252 98, 256 98 Q 252 98, 252 102 Q 252 98, 248 98 Z" fill="#a4c3b2" />
    </g>
    {/* Bottom Right Spark */}
    <g className="animate-[pulse-sparkle_3s_ease-in-out_infinite_1.5s] origin-center" style={{ transformOrigin: '252px 202px' }}>
      <path d="M 252 202 Q 252 202, 252 198 Q 252 202, 256 202 Q 252 202, 252 206 Q 252 202, 248 202 Z" fill="#a4c3b2" />
    </g>
    {/* Bottom Left Spark */}
    <g className="animate-[pulse-sparkle_3s_ease-in-out_infinite_2.25s] origin-center" style={{ transformOrigin: '152px 202px' }}>
      <path d="M 152 202 Q 152 202, 152 198 Q 152 202, 156 202 Q 152 202, 152 206 Q 152 202, 148 202 Z" fill="#517565" />
    </g>

    {/* Glowing Center Node */}
    <g className="animate-[scale-node_5s_ease-in-out_infinite]" style={{ transformOrigin: '200px 150px' }}>
      <circle cx="200" cy="150" r="35" fill="url(#registerGrad)" filter="url(#shadow)" />
      
      {/* Seedling & Heart of Care symbol */}
      <path 
        d="M 200 162 C 182 147, 174 137, 174 128 C 174 118, 182 110, 192 110 C 197 110, 200 115, 200 120 C 200 115, 203 110, 208 110 C 218 110, 226 118, 226 128 C 226 137, 218 147, 200 162 Z" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="rgba(255, 255, 255, 0.15)" 
      />
      {/* Sprout stem */}
      <path d="M 200 154 V 140" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      {/* Left leaf */}
      <path d="M 200 148 Q 192 144, 193 138 Q 200 141, 200 148" fill="white" />
      {/* Right leaf */}
      <path d="M 200 144 Q 208 140, 207 134 Q 200 137, 200 144" fill="white" />
    </g>

    {/* Outer Orbit Nodes representing student life and sharing */}
    {/* Left Node: Knowledge Sharing (Open Book) */}
    <g filter="url(#shadow)">
      <circle cx="105" cy="150" r="20" fill="white" stroke="#517565" strokeWidth="2" />
      <path d="M 95 147 C 99 144, 103 146, 105 150 C 105 146, 109 144, 113 147 V 156 C 109 153, 105 155, 105 155 C 105 155, 101 153, 95 156 Z" stroke="#517565" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="M 105 150 V 155" stroke="#517565" strokeWidth="1.5" />
    </g>
    
    {/* Right Node: Engineering Tools (Drafting Compass) */}
    <g filter="url(#shadow)">
      <circle cx="295" cy="150" r="20" fill="white" stroke="#a4c3b2" strokeWidth="2" />
      {/* Compass head */}
      <circle cx="295" cy="140" r="2.5" stroke="#a4c3b2" strokeWidth="1.5" fill="white" />
      <path d="M 295 142.5 V 145" stroke="#a4c3b2" strokeWidth="1.5" />
      {/* Legs */}
      <path d="M 295 145 L 288 158" stroke="#a4c3b2" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 295 145 L 302 158" stroke="#a4c3b2" strokeWidth="1.8" strokeLinecap="round" />
      {/* Arc/cross bar */}
      <path d="M 291 152 Q 295 154, 299 152" stroke="#a4c3b2" strokeWidth="1.2" fill="none" />
    </g>

    {/* Top Node: Academic Achievement (Graduation Cap) */}
    <g filter="url(#shadow)">
      <circle cx="200" cy="55" r="20" fill="white" stroke="#517565" strokeWidth="2" />
      <path d="M 188 55 L 200 49 L 212 55 L 200 61 Z" fill="none" stroke="#517565" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M 194 57.5 V 60.5 C 194 60.5, 196 63, 200 63 C 204 63, 206 60.5, 206 60.5 V 57.5" stroke="#517565" strokeWidth="1.5" fill="none" />
      <path d="M 209 55 V 61.5" stroke="#517565" strokeWidth="1.2" />
      <circle cx="209" cy="62" r="1" fill="#517565" />
    </g>

    {/* Bottom Node: Science & Labs (Erlenmeyer Flask) */}
    <g filter="url(#shadow)">
      <circle cx="200" cy="245" r="20" fill="white" stroke="#a4c3b2" strokeWidth="2" />
      {/* Liquid fill */}
      <path d="M 193 250 L 191 254 H 209 L 207 250 Z" fill="#a4c3b2" opacity="0.5" />
      {/* Flask outline */}
      <path d="M 197 236 H 203 M 198 236 V 242 L 191 254 C 190 256, 192 257, 194 257 H 206 C 208 257, 210 256, 209 254 L 202 242 V 236" stroke="#a4c3b2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Bubbles */}
      <circle cx="197" cy="246" r="1" fill="#a4c3b2" />
      <circle cx="202" cy="248" r="1.5" fill="#a4c3b2" />
    </g>
  </svg>
);

export default function RegisterPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const isAr = locale === "ar";

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light px-4 py-32">
        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background-light overflow-hidden">
      {/* Decorative Brand Column - Hidden on mobile/tablet */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20 relative bg-gradient-to-br from-[#f6fff8] via-[#e8f5ed] to-[#f6fff8] border-e border-[#517565]/10 overflow-hidden">
        {/* Abstract Warm Background Gradients */}
        <div className="absolute top-[-20%] start-[-20%] size-[60%] rounded-full bg-[#a4c3b2]/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] end-[-10%] size-[50%] rounded-full bg-[#517565]/10 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-6 max-w-lg">
          <Link href="/" className="text-2xl font-black tracking-tight text-[#517565] w-fit hover:opacity-90 transition-opacity">
            UniCare
          </Link>
          <div className="flex flex-col gap-3 text-start items-start">
            <span className="text-xs font-bold uppercase tracking-widest text-[#517565] px-3 py-1 rounded-full bg-[#517565]/10">
              {isAr ? "تنمية روح التعاون" : "Student Collaboration Ecosystem"}
            </span>
            <h2 className={cn(
              "text-4xl xl:text-5xl font-black leading-tight text-neutral-900",
              isAr ? "font-amiri" : ""
            )}>
              {isAr ? "شارك مواردك، ساند زملائك، وحقّق أثرًا" : "Share Resources, Support Peers, and Create Impact"}
            </h2>
            <p className="text-neutral-600 text-base font-light leading-relaxed mt-2">
              {isAr 
                ? "أنشئ حسابك الجامعي الموثوق الآن لتبدأ في عرض كتبك وأدواتك، أو استعارة وتلقي ما تحتاجه للفصل الدراسي الجديد بكل سهولة."
                : "Create your student account to borrow, lend, or sell textbooks, calculators, and equipment with verified university peers."}
            </p>
          </div>
          
          {/* Animated Abstract SVG Graphic */}
          <div className="w-full flex justify-center py-4">
            <RegisterIllustration isAr={isAr} />
          </div>
        </div>
      </div>

      {/* Form Column - centered on mobile, split-width on desktop */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 md:px-8 py-20 relative bg-[#f6fff8]/30">
        <div className="absolute top-1/4 start-1/4 size-[120px] rounded-full bg-[#a4c3b2]/10 blur-[40px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 end-1/4 size-[160px] rounded-full bg-[#517565]/8 blur-[50px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 w-full max-w-md">
          {/* Mobile logo header */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <Link href="/" className="text-3xl font-black tracking-tight text-[#517565] mb-2">
              UniCare
            </Link>
            <p className="text-neutral-500 text-sm text-center">
              {isAr ? "مجتمع جامعي تشاركي آمن" : "Your verified student resource hub"}
            </p>
          </div>
          <CreateAccountForm />
        </div>
      </div>
    </div>
  );
}
