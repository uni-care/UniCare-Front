"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/routing";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "next-intl";
import { LoginForm } from "@/components/auth/login-form";
import { cn } from "@/lib/utils";

const LoginIllustration = ({ isAr }: { isAr: boolean }) => (
  <svg viewBox="0 0 400 300" className="w-full max-w-[360px] h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="loginGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#517565" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#a4c3b2" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    
    <style>{`
      @keyframes float-ball-1 {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-10px) scale(1.05); }
      }
      @keyframes float-ball-2 {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(8px) scale(0.95); }
      }
      @keyframes pulse-ring {
        0% { transform: scale(0.95); opacity: 0.2; }
        50% { transform: scale(1.05); opacity: 0.4; }
        100% { transform: scale(0.95); opacity: 0.2; }
      }
    `}</style>

    {/* Soft glowing circles */}
    <circle cx="200" cy="150" r="85" stroke="#517565" strokeWidth="1" strokeDasharray="4 6" className="animate-[pulse-ring_8s_ease-in-out_infinite] origin-center" style={{ transformOrigin: '200px 150px' }} />
    <circle cx="200" cy="150" r="55" stroke="#a4c3b2" strokeWidth="1.5" strokeDasharray="6 8" />

    {/* Connection Lines */}
    <path d="M 120 100 C 150 70, 250 70, 280 100" stroke="#517565" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 4" />
    <path d="M 120 200 C 150 230, 250 230, 280 200" stroke="#a4c3b2" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 4" />

    {/* Floating Nodes */}
    {/* Center Node (Sharing center) */}
    <g className="animate-[float-ball-1_6s_ease-in-out_infinite]" style={{ transformOrigin: '200px 150px' }}>
      <circle cx="200" cy="150" r="30" fill="url(#loginGrad)" className="shadow-lg" />
      <path d="M192 150 H208 M200 142 V158" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </g>

    {/* Top-Left Node (Student/Trust) */}
    <g className="animate-[float-ball-2_7s_ease-in-out_infinite]" style={{ transformOrigin: '120px 100px' }}>
      <circle cx="120" cy="100" r="22" fill="white" stroke="#517565" strokeWidth="2.5" />
      {/* Small user silhouette */}
      <circle cx="120" cy="94" r="5" fill="#517565" />
      <path d="M112 106 C112 101, 115 100, 120 100 C125 100, 128 101, 128 106" fill="#517565" />
    </g>

    {/* Top-Right Node (Resources/Books) */}
    <g className="animate-[float-ball-1_5s_ease-in-out_infinite]" style={{ transformOrigin: '280px 100px' }}>
      <circle cx="280" cy="100" r="22" fill="white" stroke="#517565" strokeWidth="2.5" />
      <path d="M273 95 H287 V107 H273 Z" stroke="#517565" strokeWidth="2" fill="none" />
      <line x1="277" y1="99" x2="283" y2="99" stroke="#517565" strokeWidth="1.5" />
      <line x1="277" y1="103" x2="283" y2="103" stroke="#517565" strokeWidth="1.5" />
    </g>

    {/* Bottom-Left Node (Lab Tools) */}
    <g className="animate-[float-ball-1_8s_ease-in-out_infinite]" style={{ transformOrigin: '120px 200px' }}>
      <circle cx="120" cy="200" r="22" fill="white" stroke="#a4c3b2" strokeWidth="2.5" />
      <rect x="114" y="194" width="12" height="12" rx="2" stroke="#a4c3b2" strokeWidth="2" fill="none" />
      <circle cx="120" cy="200" r="2" fill="#a4c3b2" />
    </g>

    {/* Bottom-Right Node (Eco Growth/Sprout) */}
    <g className="animate-[float-ball-2_6s_ease-in-out_infinite]" style={{ transformOrigin: '280px 200px' }}>
      <circle cx="280" cy="200" r="22" fill="white" stroke="#a4c3b2" strokeWidth="2.5" />
      <path d="M280 208 V194" stroke="#a4c3b2" strokeWidth="2" strokeLinecap="round" />
      <path d="M280 198 Q274 195, 274 190 Q280 192, 280 196 Z" fill="rgba(164, 195, 178, 0.1)" stroke="#a4c3b2" strokeWidth="1.8" />
    </g>
  </svg>
);

function LoginContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isAr = locale === "ar";
  const redirectTo = searchParams.get("redirectTo") || "/";

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

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
              {isAr ? "مجتمع جامعي تشاركي" : "Campus Sharing Ecosystem"}
            </span>
            <h2 className={cn(
              "text-4xl xl:text-5xl font-black leading-tight text-neutral-900",
              isAr ? "font-amiri" : ""
            )}>
              {isAr ? "بوابة الطالب للمشاركة والاستعارة" : "Connecting Campus Resources In One Place"}
            </h2>
            <p className="text-neutral-600 text-base font-light leading-relaxed mt-2">
              {isAr 
                ? "انضم إلى زملائك في مجتمع جامعي متكامل لتبادل الكتب، الأدوات الهندسية والمختبرية، والآلات الحاسبة بسهولة وأمان."
                : "Join thousands of students who are sharing academic tools, textbooks, and equipment to build a more affordable and cooperative campus life."}
            </p>
          </div>
          
          {/* Animated Abstract SVG Graphic */}
          <div className="w-full flex justify-center py-4">
            <LoginIllustration isAr={isAr} />
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
          <LoginForm redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background-light px-4 py-32">
          <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
