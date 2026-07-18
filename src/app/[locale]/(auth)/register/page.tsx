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
    </defs>
    
    <style>{`
      @keyframes float-ring-1 {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-8px) rotate(180deg); }
      }
      @keyframes scale-node {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.06); }
      }
    `}</style>

    {/* Connecting Curved Pathway */}
    <path d="M 80 150 Q 200 50, 320 150 Q 200 250, 80 150" stroke="#517565" strokeWidth="2" strokeDasharray="5 7" className="animate-[float-ring-1_20s_linear_infinite] origin-center" style={{ transformOrigin: '200px 150px' }} />

    {/* Glowing Center Node */}
    <g className="animate-[scale-node_5s_ease-in-out_infinite]" style={{ transformOrigin: '200px 150px' }}>
      <circle cx="200" cy="150" r="35" fill="url(#registerGrad)" className="shadow-lg" />
      {/* Handshake/Trust Line Art icon */}
      <path d="M188 152 C188 145, 192 143, 200 143 C208 143, 212 145, 212 152 M194 157 C197 155, 203 155, 206 157" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="194" cy="152" r="2" fill="white" />
      <circle cx="206" cy="152" r="2" fill="white" />
    </g>

    {/* Outer Orbit Nodes representing collaboration */}
    <circle cx="80" cy="150" r="20" fill="white" stroke="#517565" strokeWidth="2" />
    {/* Book */}
    <path d="M75 146 H85 V154 H75 Z" stroke="#517565" strokeWidth="1.5" />
    
    <circle cx="320" cy="150" r="20" fill="white" stroke="#a4c3b2" strokeWidth="2" />
    {/* Sprout */}
    <path d="M320 156 V145" stroke="#a4c3b2" strokeWidth="1.5" />
    <path d="M320 148 Q324 146, 324 142" stroke="#a4c3b2" strokeWidth="1.5" />

    <circle cx="200" cy="50" r="20" fill="white" stroke="#517565" strokeWidth="2" />
    {/* Student cap */}
    <path d="M192 50 L200 45 L208 50 L200 55 Z" fill="none" stroke="#517565" strokeWidth="1.5" />
    <path d="M196 52.5 V56" stroke="#517565" strokeWidth="1.5" />

    <circle cx="200" cy="250" r="20" fill="white" stroke="#a4c3b2" strokeWidth="2" />
    {/* Messaging/Globe */}
    <circle cx="200" cy="250" r="6" stroke="#a4c3b2" strokeWidth="1.5" />
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
