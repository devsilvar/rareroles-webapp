import { useEffect, useState } from "react";
import { EnvelopeIcon, ClockIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { Eyebrow } from "../components/ui-bits";
import contactHeroImg from "../assets/enterprise-architecture.jpg";

const CONTACT_EMAIL = "hello@rareroles.com";

export default function Contact() {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = "Contact — Get in touch | RareRoles";
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const message = String(formData.get("message") ?? "");

    const subject = `New enquiry from ${name}`;
    const body = [`Name: ${name}`, `Email: ${email}`, "", message]
      .filter((line) => line !== null)
      .join("\n");

    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSent(true);
  };

  return (
    <>
      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden">
        {/* Background image — young tech professionals working on laptops */}
        <img
          src={contactHeroImg}
          alt="Young tech professionals working together on laptops"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Layered overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-ink/92 via-ink/80 to-brand-purple/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

        {/* Subtle dot texture for depth */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="container-page relative z-10 pt-28 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-4xl">
            <Eyebrow className="[&>span]:text-white/90 [&>div]:to-white/60">
              Get in touch
            </Eyebrow>
            <h1 className="text-display mt-6 text-5xl text-white md:text-7xl lg:text-[88px]">
              Let's talk about your{" "}
              <span className="italic text-white/70">hiring needs.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-white/85 md:text-xl">
              Whether you're hiring for rare tech roles or exploring opportunities, we're here to help. Reach out and let's start the conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-24 md:pb-32 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Subtle animated background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#E91E63]/5 blur-3xl animate-pulse" />
        <div
          className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-[#FF5722]/5 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-[#E91E63]/5 blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="container-page relative z-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* LEFT COLUMN - Form */}
          <div className="group">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
                >
                  Your Name
                </label>
                <div className="relative group/field">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter Your Name"
                    className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#E91E63]"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 transition-all duration-300 group-hover/field:scale-110">
                    <svg
                      className="h-5 w-5 text-[#E91E63] transition-all duration-300 group-hover/field:text-[#D81B60]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
                >
                  Your Email
                </label>
                <div className="relative group/field">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter Your Email"
                    className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#E91E63]"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 transition-all duration-300 group-hover/field:scale-110">
                    <EnvelopeIcon
                      className="h-5 w-5 text-[#E91E63] transition-all duration-300 group-hover/field:text-[#D81B60]"
                      strokeWidth={2}
                    />
                  </div>
                </div>
              </div>

              {/* Company Field (Optional) */}
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label
                  htmlFor="company"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
                >
                  Company (Optional)
                </label>
                <div className="relative group/field">
                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Enter Your Company Name"
                    className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#E91E63]"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 transition-all duration-300 group-hover/field:scale-110">
                    <svg
                      className="h-5 w-5 text-[#E91E63] transition-all duration-300 group-hover/field:text-[#D81B60]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message Field */}
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
                >
                  Message
                </label>
                <div className="relative group/field">
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Enter Your Message"
                    className="w-full resize-none rounded-3xl border border-slate-300 bg-white px-5 py-3 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#E91E63]"
                  />
                  <div className="absolute right-5 top-4 transition-all duration-300 group-hover/field:scale-110">
                    <svg
                      className="h-5 w-5 text-[#E91E63] transition-all duration-300 group-hover/field:text-[#D81B60]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="group/btn relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[#E91E63] to-[#D81B60] py-4 text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 hover:opacity-90 focus:outline-none active:scale-[0.98]"
              >
                <span className="relative z-10">Submit</span>
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN - Contact Info */}
          <div>
            {/* Header */}
            <div className="mb-8">
              <Eyebrow>Contact Us</Eyebrow>
              <h1
                className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Contact Us
              </h1>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                Have a role to fill or want to join our talent network? We would love to hear from
                you
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {/* General Enquiries */}
              <div className="group/card transform rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-[#E91E63]/30 hover:shadow-lg hover:shadow-[#E91E63]/10">
                <div className="flex items-start gap-4">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E91E63] to-[#D81B60] shadow-md transition-all duration-300 group-hover/card:scale-110 group-hover/card:shadow-lg group-hover/card:shadow-[#E91E63]/30">
                    <PhoneIcon className="h-5 w-5 text-white" strokeWidth={2} />
                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-[#E91E63] opacity-0 transition-all duration-300 group-hover/card:scale-125 group-hover/card:opacity-100" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-base font-bold text-slate-900 transition-colors duration-300 group-hover/card:text-[#E91E63]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      General Enquiries
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      Email: {CONTACT_EMAIL}
                    </p>
                  </div>
                </div>
              </div>

              {/* Operation Hours */}
              <div className="group/card transform rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-[#E91E63]/30 hover:shadow-lg hover:shadow-[#E91E63]/10">
                <div className="flex items-start gap-4">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E91E63] to-[#D81B60] shadow-md transition-all duration-300 group-hover/card:scale-110 group-hover/card:shadow-lg group-hover/card:shadow-[#E91E63]/30">
                    <ClockIcon className="h-5 w-5 text-white" strokeWidth={2} />
                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-[#E91E63] opacity-0 transition-all duration-300 group-hover/card:scale-125 group-hover/card:opacity-100" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-base font-bold text-slate-900 transition-colors duration-300 group-hover/card:text-[#E91E63]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Operation Hours
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">Monday-Friday: 9:00am-5:00pm</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 py-2">
                <a
                  href="#"
                  className="group/social flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:scale-110 hover:border-[#E91E63] hover:bg-gradient-to-br hover:from-[#E91E63] hover:to-[#D81B60] hover:text-white hover:shadow-md hover:shadow-[#E91E63]/20"
                >
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover/social:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="group/social flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:scale-110 hover:border-[#E91E63] hover:bg-gradient-to-br hover:from-[#E91E63] hover:to-[#D81B60] hover:text-white hover:shadow-md hover:shadow-[#E91E63]/20"
                >
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover/social:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="group/social flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:scale-110 hover:border-[#E91E63] hover:bg-gradient-to-br hover:from-[#E91E63] hover:to-[#D81B60] hover:text-white hover:shadow-md hover:shadow-[#E91E63]/20"
                >
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover/social:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="group/social flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:scale-110 hover:border-[#E91E63] hover:bg-gradient-to-br hover:from-[#E91E63] hover:to-[#D81B60] hover:text-white hover:shadow-md hover:shadow-[#E91E63]/20"
                >
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover/social:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
              </div>

              {/* Office Location */}
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
