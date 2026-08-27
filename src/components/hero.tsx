import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CheckBadgeIcon,
  BoltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import { useGetStarted } from "./get-started-modal";
import headshot1Img from "../assets/headshot (1).jfif";
import headshot2Img from "../assets/headshot (2).jfif";
import headshot3Img from "../assets/headshot (3).jfif";
import headshot4Img from "../assets/headshot (4).jfif";
import headshot5Img from "../assets/headshot (5).jfif";

export function Hero() {
  const { open: openGetStarted } = useGetStarted();
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Hero Video Background - PROMINENT */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/heroo.webp"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          src="/hero-video.mp4"
        >
          Your browser does not support the video tag.
        </video>
        {/* Lighter gradient - lets video show through */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      <div className="container-page relative">
        {/* Centered, full-width hero content */}
        <div className="flex min-h-[75vh] items-center justify-center py-10 sm:py-12 md:py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            {/* Badge - HIDDEN ON MOBILE, visible on large screens */}
            <div className="hidden justify-center lg:flex">
              <ExclusiveBadge />
            </div>

            {/* Heading - optimized for mobile, well-sized across all screens */}
            <h1 className="text-hero-serif text-3xl leading-tight text-white drop-shadow-2xl sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:mt-6 lg:text-6xl lg:leading-tight xl:text-7xl xl:leading-tight">
              Hire Rare Tech Talent{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-accent drop-shadow-lg">Without Stress</span>
                <span className="absolute inset-x-0 -bottom-1 -z-0 h-2 rounded-sm bg-accent/30 blur-sm sm:-bottom-2 sm:h-3 md:h-4" />
              </span>
            </h1>

            {/* Subtext - optimized for mobile readability */}
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/90 drop-shadow-lg sm:mt-5 sm:text-base md:mt-6 md:text-lg lg:max-w-3xl lg:text-xl">
              We focus on roles others struggle to fill:
              <strong className="font-semibold text-white"> Rare roles.</strong>{" "}
              <strong className="font-semibold text-white">Hard-to-fill positions.</strong>{" "}
              <strong className="font-semibold text-white">Experienced niche talent.</strong>
            </p>

            {/* Value pills - compact on mobile, well-spaced */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:mt-6 sm:gap-2.5 md:mt-7 md:gap-3">
              {[
                { icon: CheckBadgeIcon, label: "Pre-vetted specialists" },
                { icon: BoltIcon, label: "Faster hiring" },
                { icon: ShieldCheckIcon, label: "Reduced Hiring Cost" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-md sm:gap-2 sm:px-3 sm:py-2 md:px-4 md:text-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
                  <span className="whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>

            {/* CTAs - smart grid layout: 2 buttons on mobile, all 3 on larger screens */}
            <div
              id="get-started"
              className="mt-6 grid grid-cols-2 gap-2.5 scroll-mt-24 sm:mt-7 sm:gap-3 md:mt-8 md:flex md:flex-row md:items-center md:justify-center md:gap-3.5"
            >
              <button
                type="button"
                onClick={() => openGetStarted()}
                className="group col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-accent/50 sm:px-6 sm:py-3 md:col-span-1 md:px-7 md:py-3.5 md:text-base"
              >
                Get Started
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Trust indicators - compact on mobile */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-center sm:gap-4 md:mt-10 md:gap-5">
              {/* Avatars - smaller on mobile */}
              <div className="flex -space-x-2">
                {[headshot1Img, headshot2Img, headshot3Img, headshot4Img, headshot5Img].map(
                  (src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Specialist ${i + 1}`}
                      className="h-8 w-8 rounded-full border-2 border-white/50 object-cover shadow-xl ring-2 ring-white/20 sm:h-10 sm:w-10 md:h-11 md:w-11"
                      loading="lazy"
                    />
                  ),
                )}
              </div>

              {/* Stats - compact on mobile */}
              <div className="text-xs text-white/90 drop-shadow-lg sm:text-sm md:text-base">
                <span className="text-sm font-bold text-white sm:text-base md:text-lg">2,400+</span>{" "}
                specialists ·{" "}
                <span className="text-sm font-bold text-white sm:text-base md:text-lg">87%</span>{" "}
                acceptance
              </div>
            </div>

            {/* Scroll indicator - hidden on mobile for space efficiency */}
            <div className="mt-8 hidden justify-center sm:flex md:mt-10 lg:mt-12">
              <div className="flex flex-col items-center gap-2 text-white/60">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Scroll to explore
                </span>
                <svg
                  className="h-5 w-5 animate-bounce md:h-6 md:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Exclusive rotating badge - Glass-morphism version for video background
function ExclusiveBadge() {
  const specialties = [
    "AI & LLM Engineers",
    "Solution Architects",
    "Core Banking Experts",
    "CCIE Network Engineers",
    "Oracle PL/SQL Developers",
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const badgeRef = React.useRef<HTMLDivElement>(null);

  // Pause animation when badge is not visible (scrolled past hero)
  React.useEffect(() => {
    if (!badgeRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Pause when badge is not intersecting (scrolled past)
          setIsPaused(!entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );

    observer.observe(badgeRef.current);

    return () => observer.disconnect();
  }, []);

  // Rotate specialty text only when not paused
  React.useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % specialties.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [specialties.length, isPaused]);

  return (
    <div ref={badgeRef} className="group relative inline-flex">
      {/* Accent glow */}
      <div className="absolute -inset-1.5 rounded-full bg-accent/30 opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Main horizontal badge - Glass-morphism */}
      <div className="relative flex items-center gap-3 overflow-hidden rounded-full border border-white/30 bg-white/15 pl-1.5 pr-5 py-1.5 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:border-white/50 group-hover:shadow-accent/30">
        {/* Left: Compact circular indicator */}
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
          {/* Rotating ring */}
          <div className="absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-tr from-accent to-accent/60 p-[2px]">
            <div className="h-full w-full rounded-full bg-white/20 backdrop-blur-sm" />
          </div>

          {/* Inner gradient circle */}
          <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/80 shadow-lg">
            <div className="absolute inset-0 animate-shimmer-rotate rounded-full bg-gradient-to-tr from-transparent via-white/50 to-transparent" />
            <div className="relative h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
          </div>

          {/* Pulse ring */}
          <div className="absolute inset-0 animate-pulse-ring rounded-full bg-accent/40" />
        </div>

        {/* Center: Horizontal flowing content */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Left text block */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/60">
              Elite Network
            </span>
            <div className="flex items-center gap-1.5">
              <div className="h-1 w-1 rounded-full bg-accent animate-pulse-subtle" />
              <span className="text-[10px] font-semibold text-white/90">Now Hiring</span>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />

          {/* Center: Rotating specialty showcase */}
          <div className="relative h-8 overflow-hidden">
            <div
              className="transition-transform duration-700 ease-out"
              style={{ transform: `translateY(-${currentIndex * 32}px)` }}
            >
              {specialties.map((specialty, index) => (
                <div key={index} className="flex h-8 items-center">
                  <span className="whitespace-nowrap text-sm font-bold tracking-tight text-white drop-shadow-lg transition-all duration-700">
                    {specialty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Minimal progress indicator */}
        <div className="flex items-center gap-1 ml-2">
          {specialties.map((_, index) => (
            <div
              key={index}
              className={`rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? "h-1.5 w-1.5 bg-white shadow-sm shadow-white/50"
                  : "h-1 w-1 bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Subtle shimmer overlay on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:animate-shimmer-horizontal group-hover:opacity-100" />

        {/* Top highlight line */}
        <div className="pointer-events-none absolute inset-x-4 top-0.5 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
    </div>
  );
}
