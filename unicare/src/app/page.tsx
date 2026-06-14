import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-125 h-125 rounded-full bg-primary/20 organic-glow"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-150 h-150 rounded-full bg-muted-teal/20 organic-glow"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen pt-12">
        <main className="flex-1 flex flex-col items-center justify-center px-6 lg:px-20 py-24">
          <div className="max-w-300 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex flex-col gap-8 order-2 lg:order-1">
              <div className="flex flex-col gap-4">
                <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary w-fit text-xs font-bold tracking-widest uppercase">
                  Community Driven
                </span>
                <h2 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-[#131615]">
                  The Universities <span className="text-primary italic">Ecosystem</span> of Care
                </h2>
                <p className="text-lg lg:text-xl text-neutral-600 font-light leading-relaxed max-w-md">
                  A campus marketplace to lend, buy, and share textbooks, lab tools,
                  and resources across the university community.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/marketplace" className="group flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl shadow-primary/40 hover:translate-y-0.5 transition-all cursor-pointer">
                  Enter the Ecosystem
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
                <Link href="/marketplace" className="flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold border border-primary/20 hover:bg-white/50 transition-all cursor-pointer">
                  Explore Assets
                </Link>
              </div>

              <div className="flex items-center gap-8 mt-4">
                <div>
                  <p className="text-2xl font-bold text-primary">5k+</p>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest">
                    Students
                  </p>
                </div>
                <div className="h-8 w-px bg-primary/20"></div>
                <div>
                  <p className="text-2xl font-bold text-primary">10k+</p>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest">
                    Resources
                  </p>
                </div>
                <div className="h-8 w-px bg-primary/20"></div>
                <div>
                  <p className="text-2xl font-bold text-primary">1.2k</p>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest">
                    Active Roots
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center relative">
              <div className="w-full max-w-125 aspect-square rounded-xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(106,144,127,0.25)] relative group">
                <Image
                  fill
                  alt="Abstract 3D shapes"
                  className="w-full h-full object-cover grayscale-20 group-hover:scale-110 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpIkpKbh7d1et9JsXU_OHwKrOjuqrSLDUpsDpxk1HCsOHYvubsHTchUdd3KYHV7KTo6QDqU8kt2e67a9KvCQFzNi4xbzmOQLCeS0UTpdbkhmZ9gCXrCvmYVY0f40E9cudqsE5IAzkfYppK0L_RWXEFPbKly_Opy9F5h6cbgbFaTB-k7reTei3SSCf0H04y6ygoh0uKGhdKUBkp7PPywRE2pdDh7GYLbvUS9lBnp7pJc39fQhDxNbaU5WhtTmsrGMxLdUveVqd_chmM"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-linear-to-tr from-primary/40 to-transparent"></div>
              </div>

              <div className="absolute -bottom-8  md:bottom-10 left-0 md:-left-4 glass-card p-6 rounded-3xl border border-white/40 shadow-2xl max-w-60 z-20 animate-[pulse_4s_ease-in-out_infinite] hover:-translate-y-2 transition-transform duration-500">
                <p className="flex items-center gap-2 font-semibold uppercase tracking-widest text-primary/70 mb-2">
                  <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                  Community Driven
                </p>
                <p className="text-lg italic font-serif-art text-primary">&quot;The roots of Uni Students grow through the soil of art.&quot;</p>
              </div>
            </div>
          </div>
        </main>

        <section className="relative px-6 lg:px-20 py-32 overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 1440 600"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="step-path animate-dash"
                d="M100 300 C 300 100, 600 500, 720 300 S 1100 100, 1340 300"
                stroke="#6a907f"
                strokeLinecap="round"
                strokeWidth="2"
              ></path>
              <circle cx="400" cy="600" fill="#6a907f" r="4"></circle>
              <circle cx="800" cy="400" fill="#6a907f" r="4"></circle>
            </svg>
          </div>

          <div className="max-w-300 mx-auto relative z-10">
            <div className="mb-20">
              <h3 className="text-4xl font-bold tracking-tight mb-4">
                The Cycle of <span className="text-primary italic">Support</span>
              </h3>
              <p className="text-neutral-500 max-w-sm">
                A seamless flow of academic resources and student support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
              <div className="flex flex-col items-start space-y-6 md:translate-y-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-150 transition-transform group-hover:scale-110"></div>
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <Image
                      width={128}
                      height={128}
                      alt="Post"
                      className="w-32 h-32 object-contain opacity-80 mix-blend-multiply transition-transform group-hover:rotate-12"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtLSV7tjpbJmepscALpNOWWJna-mOj7X7xwZNffwh24rvWKcefCr7es48eDOp-opwE28UQaItJbEIb-LnXDPGKfhmYB99ZexRknxazvYe2-_ax7EIpoE1c27_m-xSWk6B1KAFvk5ZaB3hIbXS3wiUrpXQnsunFfWZTY6tW1mUPA_wxYhOWiwte-rf-vloKqaXtKNUO2nNGPUEaguX2d8A62X9P6_88IZ_AEDdrGbFNsQjuwNZElKW0eoFryf_guWsFnNF3FgtafRIH"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-primary/40 font-thin">
                        package_2
                      </span>
                    </div>
                  </div>
                </div>
                <div className="max-w-60">
                  <h4 className="text-2xl font-bold mb-3 tracking-tight">Post</h4>
                  <p className="text-neutral-600 font-light leading-relaxed italic">
                    Release your unused textbooks, drawing boards, or tools; let them
                    support another student&apos;s campus journey.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start space-y-6 md:-translate-y-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-muted-teal/15 blur-2xl rounded-full scale-150 transition-transform group-hover:scale-110"></div>
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <Image
                      width={128}
                      height={128}
                      alt="Share"
                      className="w-32 h-32 object-contain opacity-80 mix-blend-multiply transition-transform group-hover:-rotate-12"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB007sAwvnJz9vk8xtdV5MgqWS-M3mkoybrbVibkrx1RM9tgIPmQfJqM18m6OvUalIwLpz_Locp0lu0fBSKTVpmnNs5695oDxzTC_fXrHF-inMqHRCb-SpA6-V9eaLT-MkNCHEqcwYvDSe38vSvXx0OFZjLxXC7OVYsW1YAct8YKneA04_RtmbfgWF_P7oUvhXO5toWX5Syq55Auj5eyntyhpeJCMKJrxmSg-myxdDkKl7ZTsjOnl-8IBlWmMSYgeEW5Jj4dJV6iQtz"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-primary/40 font-thin">
                        handshake
                      </span>
                    </div>
                  </div>
                </div>
                <div className="max-w-60">
                  <h4 className="text-2xl font-bold mb-3 tracking-tight">Share</h4>
                  <p className="text-neutral-600 font-light leading-relaxed italic">
                    Find or share resources within your campus. Connect with peers in a trusted,
                    secure student marketplace built on mutual trust.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start space-y-6 md:translate-y-12">
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 transition-transform group-hover:scale-110"></div>
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <Image
                      width={128}
                      height={128}
                      alt="Impact"
                      className="w-32 h-32 object-contain opacity-90 transition-transform group-hover:scale-110"
                      src="/impact-vision.png"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-primary/70 font-thin">
                        potted_plant
                      </span>
                    </div>
                  </div>
                </div>
                <div className="max-w-60">
                  <h4 className="text-2xl font-bold mb-3 tracking-tight">
                    Impact
                  </h4>
                  <p className="text-neutral-600 font-light leading-relaxed italic">
                    Watch the student community thrive as we share resources, helping every
                    student succeed without financial burden.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 lg:px-20 py-24 bg-primary/5">
          <div className="max-w-300 mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div className="flex flex-col gap-2">
                <h3 className="text-3xl font-bold tracking-tight">
                  Cultivate Your Toolkit
                </h3>
                <p className="text-neutral-500">
                  Discover textbooks, tools, and dorm items shared by peer students.
                </p>
              </div>
              <Link href="/marketplace" className="flex items-center gap-2 text-primary font-bold hover:underline cursor-pointer">
                View all <span className="material-symbols-outlined">trending_flat</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/marketplace" className="group relative aspect-4/5 overflow-hidden rounded-xl cursor-pointer">
                <Image
                  fill
                  alt="Instruments"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrpsacMm6siyKn3E_mlMtinA1SVP5fmtrcDvMA3mr7hzUryrf_hs-sICQQUr5O7epG7FvZVDz0F0lQmupxBOaIICoQfCdgIsi2sQLj5_U8Li_vrAHWstKaMWfuEgDSdaTxfkiUuF2znWapVAHUalGzVkMis4dwEVvUPWRuISaby2IrKJ5_tccZT80MvaGGuJy64ATjsqgmGSUvH-Qqq9v5938MYKHAXSnEGXEJoAl3KYc2L0LU7Shi3CHQ9l4sKCXPYohIl5toSCog"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                    Supplies
                  </p>
                  <h4 className="text-xl font-bold">Lab & Science Supplies</h4>
                </div>
              </Link>

              <Link href="/marketplace" className="group relative aspect-4/5 overflow-hidden rounded-xl cursor-pointer">
                <Image
                  fill
                  alt="Reference"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="/library-vision.png"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                    Textbooks
                  </p>
                  <h4 className="text-xl font-bold">Course Materials</h4>
                </div>
              </Link>

              <Link href="/marketplace" className="group relative aspect-4/5 overflow-hidden rounded-xl cursor-pointer">
                <Image
                  fill
                  alt="Hardware"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="/electronics-vision.png"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                    Devices
                  </p>
                  <h4 className="text-xl font-bold">Calculators & Electronics</h4>
                </div>
              </Link>

              <Link href="/post" className="border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center p-8 text-center group hover:bg-primary/5 transition-colors cursor-pointer">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    add
                  </span>
                </div>
                <h4 className="text-lg font-bold">Lend Your Own</h4>
                <p className="text-sm text-neutral-500 mt-2 italic font-light">
                  Share your unused resources with fellow students.
                </p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
