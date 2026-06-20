"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import {
    MdOutlineCode,
    MdOutlineDiversity3,
    MdOutlineBrush,
    MdOutlineArrowForward
} from "react-icons/md";

export default function AboutPage() {
    const t = useTranslations("About");
    const locale = useLocale();
    const isAr = locale === "ar";

    return (
        <div className="bg-background-light min-h-screen pt-36 pb-20">
            {/* Hero Section - Split Layout */}
            <section className="max-w-6xl mx-auto px-4 md:px-8 py-10">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
                    {/* Left: Mission Text */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:pe-12">
                        <div className="flex flex-col gap-2 text-start items-start">
                            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold w-fit mb-2">
                                {t("ourStory")}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-neutral-900">
                                {t("heroTitle")}
                            </h1>
                            <p className="text-neutral-500 text-lg font-normal leading-relaxed mt-4">
                                {t("heroDesc1")}
                            </p>
                            <p className="text-neutral-500 text-base font-normal leading-relaxed">
                                {t("heroDesc2")}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <button className="flex items-center justify-center rounded-xl h-12 px-6 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer">
                                {t("manifestoCta")}
                            </button>
                            <button className="flex items-center justify-center rounded-xl h-12 px-6 border border-primary/30 text-primary text-base font-bold hover:bg-primary/5 transition-all cursor-pointer">
                                {t("teamCta")}
                            </button>
                        </div>
                    </div>

                    {/* Right: Hero Image */}
                    <div className="w-full lg:w-1/2 relative group overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-primary/10 z-10 pointer-events-none mix-blend-multiply" />
                        <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden">
                            <Image
                                src="/about hero.png"
                                alt="Artistic sketch of engineering blueprints and connecting lines representing community"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                        </div>
                        {/* Overlay Badge */}
                        <div className="absolute bottom-6 start-6 z-20 bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-primary/20">
                            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1 text-start">Est. 2024</p>
                            <p className="text-sm text-neutral-800 text-start">{isAr ? "نصمم المستقبل معًا." : "Designing the future, together."}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Values Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 border-t border-neutral-200">
                <div className="flex flex-col gap-4 text-center items-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight text-neutral-900 max-w-[720px]">
                        {t("valuesTitle")}
                    </h2>
                    <p className="text-neutral-500 text-base font-normal leading-normal max-w-[600px]">
                        {t("valuesSubtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="group flex flex-1 gap-5 rounded-xl border border-neutral-200 bg-white p-8 flex-col hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-all duration-300 text-start items-start">
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <MdOutlineCode className="text-2xl" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-bold leading-tight text-neutral-900">{t("value1Title")}</h3>
                            <p className="text-neutral-500 text-sm font-normal leading-relaxed">
                                {t("value1Desc")}
                            </p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="group flex flex-1 gap-5 rounded-xl border border-neutral-200 bg-white p-8 flex-col hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-all duration-300 text-start items-start">
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <MdOutlineDiversity3 className="text-2xl" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-bold leading-tight text-neutral-900">{t("value2Title")}</h3>
                            <p className="text-neutral-500 text-sm font-normal leading-relaxed">
                                {t("value2Desc")}
                            </p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="group flex flex-1 gap-5 rounded-xl border border-neutral-200 bg-white p-8 flex-col hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-all duration-300 text-start items-start">
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <MdOutlineBrush className="text-2xl" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-bold leading-tight text-neutral-900">{t("value3Title")}</h3>
                            <p className="text-neutral-500 text-sm font-normal leading-relaxed">
                                {t("value3Desc")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Highlight / Narrative Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 rounded-2xl bg-neutral-100 p-8 md:p-12">
                    <div className="flex flex-1 flex-col gap-6 text-start items-start">
                        <div className="flex flex-col gap-3">
                            <h3 className="text-2xl md:text-3xl font-bold leading-tight text-neutral-900">
                                {t("narrativeTitle")}
                            </h3>
                            <p className="text-neutral-500 text-base font-normal leading-relaxed">
                                {t("narrativeDesc")}
                            </p>
                        </div>
                        <button className="flex items-center justify-center rounded-xl h-10 px-6 bg-neutral-900 text-white text-sm font-medium w-fit hover:opacity-90 transition-opacity cursor-pointer">
                            {t("narrativeCta")}
                            <MdOutlineArrowForward className="text-base transition-transform rtl:rotate-180 ms-2" />
                        </button>
                    </div>
                    <div className="relative w-full md:w-1/2 aspect-video rounded-xl overflow-hidden shadow-lg">
                        <Image
                            src="/about-narrative.png"
                            alt="Group of diverse engineers collaborating around a table"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
