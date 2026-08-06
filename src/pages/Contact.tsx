import { useEffect, useState } from "react";
import { EnvelopeIcon, ClockIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { Eyebrow } from "../components/ui-bits";
import { usePageView, useFormTracking } from "@/hooks/useAnalytics";
import { syncContact } from "@/lib/data-sync";
import contactHeroImg from "../assets/enterprise-architecture.jpg";

const CONTACT_EMAIL = "hello@rareroles.com";
const CONTACT_PHONE = "0808 246 4543";
const CONTACT_PHONE_TEL = "+2348082464543";
const CONTACT_WHATSAPP_URL = `https://wa.me/2348082464543?text=${encodeURIComponent(
  "Hi! I'd like to chat about my hiring needs.",
)}`;
const CONTACT_ADDRESS = "14B Admiralty Way, Lekki Phase 1, Lagos, Nigeria";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add analytics tracking
  usePageView();
  const trackFormSubmit = useFormTracking();

  useEffect(() => {
    document.title = "Contact — Get in touch | RareRoles";
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const name = String(formData.get("name") ?? "");
      const email = String(formData.get("email") ?? "");
      const company = String(formData.get("company") ?? "");
      const message = String(formData.get("message") ?? "");

      // Track form submission
      trackFormSubmit('contact_form', { name, email, company });

      // Dual-write to Supabase + Google Apps Script
      try {
        const syncResult = await syncContact({
          name,
          email,
          company,
          message,
          source: 'contact_form',
        });
        
        if (import.meta.env.DEV) {
          console.log('[Contact] Sync result:', syncResult);
        }

        if (syncResult.overall === 'partial') {
          console.warn('[Contact] Partial sync - one destination failed');
        } else if (syncResult.overall === 'failed') {
          console.error('[Contact] Complete sync failure');
        }
      } catch (syncError) {
        console.error('[Contact] Sync error:', syncError);
      }

      // Show success state
      setSent(true);
      setLoading(false);
      
    } catch (err) {
      console.error('[Contact] Form submission error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
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
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl animate-pulse" />
        <div
          className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-accent/5 blur-3xl animate-pulse"
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
                    className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-accent"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 transition-all duration-300 group-hover/field:scale-110">
                    <svg
                      className="h-5 w-5 text-accent transition-all duration-300 group-hover/field:text-primary"
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
                    className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-accent"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 transition-all duration-300 group-hover/field:scale-110">
                    <EnvelopeIcon
                      className="h-5 w-5 text-accent transition-all duration-300 group-hover/field:text-primary"
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
                    className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-accent"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 transition-all duration-300 group-hover/field:scale-110">
                    <svg
                      className="h-5 w-5 text-accent transition-all duration-300 group-hover/field:text-primary"
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
                    className="w-full resize-none rounded-3xl border border-slate-300 bg-white px-5 py-3 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-accent"
                  />
                  <div className="absolute right-5 top-4 transition-all duration-300 group-hover/field:scale-110">
                    <svg
                      className="h-5 w-5 text-accent transition-all duration-300 group-hover/field:text-primary"
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

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group/btn relative w-full overflow-hidden rounded-full bg-gradient-to-r from-accent to-primary py-4 text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 hover:opacity-90 focus:outline-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {loading ? 'Sending...' : 'Submit'}
                </span>
                {!loading && (
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                )}
              </button>
            </form>

            {/* Success Message Modal */}
            {sent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <svg
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-slate-900">Message Sent!</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Thank you for reaching out. We'll get back to you soon.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-6 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
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
              <div className="group/card transform rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10">
                <div className="flex items-start gap-4">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary shadow-md transition-all duration-300 group-hover/card:scale-110 group-hover/card:shadow-lg group-hover/card:shadow-accent/30">
                    <PhoneIcon className="h-5 w-5 text-white" strokeWidth={2} />
                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-accent opacity-0 transition-all duration-300 group-hover/card:scale-125 group-hover/card:opacity-100" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-base font-bold text-slate-900 transition-colors duration-300 group-hover/card:text-accent"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      General Enquiries
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      Email:{" "}
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="text-accent hover:underline"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </p>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      Phone:{" "}
                      <a
                        href={`tel:${CONTACT_PHONE_TEL}`}
                        className="text-accent hover:underline"
                      >
                        {CONTACT_PHONE}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Office Location */}
              <div className="group/card transform rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10">
                <div className="flex items-start gap-4">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary shadow-md transition-all duration-300 group-hover/card:scale-110 group-hover/card:shadow-lg group-hover/card:shadow-accent/30">
                    <MapPinIcon className="h-5 w-5 text-white" strokeWidth={2} />
                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-accent opacity-0 transition-all duration-300 group-hover/card:scale-125 group-hover/card:opacity-100" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-base font-bold text-slate-900 transition-colors duration-300 group-hover/card:text-accent"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Office Location
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {CONTACT_ADDRESS}
                    </p>
                  </div>
                </div>
              </div>

              {/* Operation Hours */}
              <div className="group/card transform rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10">
                <div className="flex items-start gap-4">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary shadow-md transition-all duration-300 group-hover/card:scale-110 group-hover/card:shadow-lg group-hover/card:shadow-accent/30">
                    <ClockIcon className="h-5 w-5 text-white" strokeWidth={2} />
                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-accent opacity-0 transition-all duration-300 group-hover/card:scale-125 group-hover/card:opacity-100" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-base font-bold text-slate-900 transition-colors duration-300 group-hover/card:text-accent"
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
                  href={CONTACT_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="group/social flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:scale-110 hover:border-accent hover:bg-gradient-to-br hover:from-accent hover:to-primary hover:text-white hover:shadow-md hover:shadow-accent/20"
                >
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover/social:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="group/social flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:scale-110 hover:border-accent hover:bg-gradient-to-br hover:from-accent hover:to-primary hover:text-white hover:shadow-md hover:shadow-accent/20"
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
                  className="group/social flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:scale-110 hover:border-accent hover:bg-gradient-to-br hover:from-accent hover:to-primary hover:text-white hover:shadow-md hover:shadow-accent/20"
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
                  className="group/social flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:scale-110 hover:border-accent hover:bg-gradient-to-br hover:from-accent hover:to-primary hover:text-white hover:shadow-md hover:shadow-accent/20"
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
                  className="group/social flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:scale-110 hover:border-accent hover:bg-gradient-to-br hover:from-accent hover:to-primary hover:text-white hover:shadow-md hover:shadow-accent/20"
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
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
