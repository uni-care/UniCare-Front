"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "201068359667";

export default function JoinTeamForm() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        area: "",
        portfolio: "",
        reason: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {
        const message = [
            `*New UniCare Contributor Application* 🌿`,
            ``,
            `*Name:* ${form.firstName} ${form.lastName}`,
            `*Email:* ${form.email}`,
            `*Area:* ${form.area || "Not specified"}`,
            `*Portfolio:* ${form.portfolio || "Not provided"}`,
            ``,
            `*Why they want to join:*`,
            form.reason || "No reason provided.",
        ].join("\n");

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="lg:w-2/3 w-full bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-sm">
            <form
                className="flex flex-col gap-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <div className="flex flex-col md:flex-row gap-6">
                    <label className="flex flex-col flex-1">
                        <span className="text-neutral-900 text-base font-medium leading-normal pb-2">First Name</span>
                        <input
                            className="w-full rounded-xl border border-neutral-200 bg-white h-14 px-4 text-base text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            name="firstName"
                            placeholder="Jane"
                            type="text"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <span className="text-neutral-900 text-base font-medium leading-normal pb-2">Last Name</span>
                        <input
                            className="w-full rounded-xl border border-neutral-200 bg-white h-14 px-4 text-base text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            name="lastName"
                            placeholder="Doe"
                            type="text"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>

                <label className="flex flex-col flex-1">
                    <span className="text-neutral-900 text-base font-medium leading-normal pb-2">Email Address</span>
                    <input
                        className="w-full rounded-xl border border-neutral-200 bg-white h-14 px-4 text-base text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        name="email"
                        placeholder="jane@example.com"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="flex flex-col flex-1">
                    <span className="text-neutral-900 text-base font-medium leading-normal pb-2">Area of Contribution</span>
                    <div className="relative">
                        <select
                            className="w-full rounded-xl border border-neutral-200 bg-white h-14 px-4 text-base text-neutral-900 appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            name="area"
                            value={form.area}
                            onChange={handleChange}
                            required
                        >
                            <option disabled value="">Select an area...</option>
                            <option value="Feature Development">Feature Development</option>
                            <option value="Server Hosting">Server Hosting</option>
                            <option value="Core Engineering">Core Engineering</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                            <span className="material-symbols-outlined">expand_more</span>
                        </div>
                    </div>
                </label>

                <label className="flex flex-col flex-1">
                    <span className="text-neutral-900 text-base font-medium leading-normal pb-2">Portfolio or GitHub URL</span>
                    <div className="relative">
                        <input
                            className="w-full rounded-xl border border-neutral-200 bg-white h-14 pl-12 pr-4 text-base text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            name="portfolio"
                            placeholder="https://github.com/janedoe"
                            type="url"
                            value={form.portfolio}
                            onChange={handleChange}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 flex items-center">
                            <span className="material-symbols-outlined text-[20px]">link</span>
                        </div>
                    </div>
                </label>

                <label className="flex flex-col flex-1">
                    <span className="text-neutral-900 text-base font-medium leading-normal pb-2">Why do you want to join?</span>
                    <textarea
                        className="w-full rounded-lg border border-neutral-200 bg-white h-32 px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                        name="reason"
                        placeholder="Tell us about your experience and what you'd like to work on..."
                        value={form.reason}
                        onChange={handleChange}
                        required
                    />
                </label>

                <div className="pt-2">
                    <button
                        className="flex cursor-pointer items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-white h-14 w-full md:w-auto px-10 text-base font-bold shadow-lg shadow-primary/20 transition-colors"
                        type="submit"
                    >
                        Submit Application
                    </button>
                </div>
            </form>
        </div>
    );
}
