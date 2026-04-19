import Image from "next/image";
import JoinTeamForm from "@/components/forms/JoinTeamForm";

const TEAM_ROLES = [
    {
        icon: "code",
        title: "Feature Development",
        subtitle: "Frontend & Backend",
    },
    {
        icon: "dns",
        title: "Server Hosting",
        subtitle: "DevOps & Infrastructure",
    },
    {
        icon: "engineering",
        title: "Core Engineering",
        subtitle: "Architecture & Performance",
    },
];

export default function ContributePage() {
    return (
        <div className="bg-background-light min-h-screen pt-28 pb-20">
            <div className="max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col gap-16">

                {/* Hero Section */}
                <section className="flex flex-col gap-8 py-10 lg:flex-row lg:items-center lg:gap-16">
                    <div className="flex flex-col gap-6 lg:w-1/2">
                        <div className="flex flex-col gap-3 text-left">
                            <span className="text-primary font-bold tracking-wider uppercase text-sm">
                                Join the Community
                            </span>
                            <h1 className="text-neutral-900 text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
                                Build the Future of University Resources
                            </h1>
                            <p className="text-neutral-500 text-lg font-normal leading-relaxed max-w-xl">
                                Join our community of contributors. Whether you&apos;re into feature development, server hosting, or
                                core engineering, there&apos;s a place for you at UniCare.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <button className="flex cursor-pointer items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-white h-12 px-6 text-base font-bold shadow-lg shadow-primary/20 transition-colors">
                                View Open Roles
                            </button>
                            <button className="flex h-12 px-6 items-center justify-center rounded-xl border-2 border-primary/20 hover:border-primary/50 text-neutral-900 text-base font-bold transition-all bg-transparent cursor-pointer">
                                Read Documentation
                            </button>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <div className="relative w-full aspect-4/3 rounded-2xl shadow-xl overflow-hidden group">
                            <Image
                                src="/contribute-hero.png"
                                alt="Group of diverse engineers collaborating around a laptop"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-all duration-500" />
                        </div>
                    </div>
                </section>

                {/* Beta CTA Banner */}
                <section className="w-full bg-primary/10 border border-primary/20 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-bold mb-1">
                            <span className="material-symbols-outlined text-xl">lock</span>
                            <span className="text-sm uppercase tracking-wider">Limited Access</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-neutral-900">
                            Closed-Source Beta Program
                        </h3>
                        <p className="text-neutral-500 max-w-xl">
                            Be among the first to try our upcoming AI-powered student verification, smart lending system, and
                            real-time community tools — and help us refine them before they go live across universities.
                        </p>
                    </div>
                    <button className="flex cursor-pointer items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-white h-12 px-8 text-sm font-bold whitespace-nowrap shadow-lg shadow-primary/20 transition-colors">
                        Apply for Beta Access
                    </button>
                </section>

                {/* Join the Team */}
                <section className="flex flex-col lg:flex-row gap-12 py-10 items-start">
                    <div className="lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-28">
                        <h2 className="text-neutral-900 text-3xl font-bold leading-tight tracking-tight">
                            Join the Team
                        </h2>
                        <p className="text-neutral-500 text-lg leading-relaxed">
                            Interested in shaping UniCare? Fill out the form to get involved in our development cycle. We are looking
                            for passionate individuals who care about open engineering culture.
                        </p>
                        <div className="flex flex-col gap-4 mt-4">
                            {TEAM_ROLES.map((role) => (
                                <div
                                    key={role.title}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white border border-neutral-100 shadow-sm"
                                >
                                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">{role.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-neutral-900">{role.title}</h4>
                                        <p className="text-sm text-neutral-500">{role.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <JoinTeamForm />
                </section>
            </div>
        </div>
    );
}
