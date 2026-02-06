"use client";

import Image from "next/image";
import React from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

type HeroImageLensProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

function HeroImageLens({ src, alt, priority }: HeroImageLensProps) {
  const reducedMotion = usePrefersReducedMotion();
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const rafId = React.useRef<number | null>(null);
  const last = React.useRef({ x: 50, y: 50, active: false });

  const [pos, setPos] = React.useState({ x: 50, y: 50, active: false });
  const [hasInteracted, setHasInteracted] = React.useState(false);

  const scheduleSet = React.useCallback((next: typeof last.current) => {
    last.current = next;
    if (rafId.current != null) return;
    rafId.current = window.requestAnimationFrame(() => {
      rafId.current = null;
      setPos({ ...last.current });
    });
  }, []);

  const onMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (!hasInteracted) setHasInteracted(true);
      scheduleSet({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)), active: true });
    },
    [scheduleSet, hasInteracted]
  );

  const onLeave = React.useCallback(() => {
    scheduleSet({ ...last.current, active: false });
  }, [scheduleSet]);

  React.useEffect(() => {
    return () => {
      if (rafId.current != null) window.cancelAnimationFrame(rafId.current);
    };
  }, []);

  // No “clear/blur reveal” effect — user asked to remove the hover-to-clear interaction.

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full"
      onPointerMove={reducedMotion ? undefined : onMove}
      onPointerEnter={reducedMotion ? undefined : onMove}
      onPointerLeave={reducedMotion ? undefined : onLeave}
    >
      {/* Base image (always crisp — no hover zoom / no blur) */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover object-center"
        style={{ transformOrigin: "center" }}
      />

      {/* Subtle pointer-follow highlight (no sharpening / clearing) */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            opacity: pos.active ? 1 : 0,
            transition: "opacity 220ms ease",
            background:
              "radial-gradient(circle 220px at var(--x) var(--y), rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 18%, rgba(255,255,255,0) 58%)",
            ...( { "--x": `${pos.x}%`, "--y": `${pos.y}%` } as React.CSSProperties ),
          }}
        />
      )}

      {/* Grain + vignette polish */}
      <div className="absolute inset-0 hero-grain" aria-hidden="true" />
      <div className="absolute inset-0 hero-vignette" aria-hidden="true" />

      {/* (Removed) Visible circle / affordance UI — user requested no ring overlay. */}
    </div>
  );
}

export default function Home() {
  return (
    <main className="[font-family:var(--font-manrope)] text-[#161514] bg-[#FAF8F4] selection:bg-[#A66A4A]/20">
      {/* 1. Header / Navigation */}
  <header className="sticky top-0 z-50 border-b border-[#2F2D2B]/6 bg-[#FAF8F4]/75 backdrop-blur-xl supports-[backdrop-filter]:bg-[#FAF8F4]/70 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-5 flex items-center justify-between gap-6">
          <a href="#" className="flex items-center gap-4 group">
      <div className="relative w-10 h-10 overflow-hidden rounded-full border border-[#A66A4A]/25 shadow-sm group-hover:shadow-md transition-shadow">
                <Image src="/maya-reynolds.png" alt="Dr. Maya Reynolds portrait" fill className="object-cover" priority />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="[font-family:var(--font-cormorant)] text-[18px] text-[#1A1918]">Dr. Maya Reynolds</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#3A3836]/55 font-semibold">Clinical Psychologist</div>
            </div>
            <span className="sr-only">Dr. Maya Reynolds</span>
          </a>

          <nav className="flex items-center gap-4">
            <ul className="hidden md:flex items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2F2D2B]/70">
              <li>
                <a href="#" className="relative inline-flex py-3 transition-colors hover:text-[#1A1918]">
                  About
                  <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[#A66A4A]/70 transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
              <li>
                <a href="#services" className="relative inline-flex py-3 transition-colors hover:text-[#1A1918]">
                  Services
                  <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[#A66A4A]/70 transition-all duration-300 hover:w-full" />
                </a>
              </li>
              <li>
                <a href="#" className="relative inline-flex py-3 transition-colors hover:text-[#1A1918]">
                  Our Office
                  <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[#A66A4A]/70 transition-all duration-300 hover:w-full" />
                </a>
              </li>
              <li>
                <a href="#" className="relative inline-flex py-3 transition-colors hover:text-[#1A1918]">
                  FAQ
                  <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[#A66A4A]/70 transition-all duration-300 hover:w-full" />
                </a>
              </li>
            </ul>

            <a
              href="#"
              className="hidden md:inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#161514] text-[#F3F0EA] text-[10px] font-bold uppercase tracking-[0.22em] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A66A4A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F4]"
            >
              Book Consultation
            </a>

            <div className="md:hidden">
              <button className="text-[10px] font-bold uppercase tracking-[0.22em] px-5 py-2.5 border border-[#161514]/10 rounded-full bg-white/40 backdrop-blur text-[#161514] hover:bg-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A66A4A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F4]">
                Menu
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* 2. Hero section (Ethereal & Premium) */}
  <section className="relative min-h-[calc(100vh-72px)] flex items-center bg-[#FAF8F4] overflow-hidden">
        {/* Abstract Fluid Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40 mix-blend-multiply">
            {/* Warm blob */}
            <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(166,106,74,0.16)_0%,rgba(166,106,74,0)_70%)] blur-[100px] animate-[pulse_6s_ease-in-out_infinite]" />
            {/* Gray blob */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[1200px] h-[1200px] bg-[radial-gradient(circle,rgba(58,56,54,0.08)_0%,rgba(58,56,54,0)_70%)] blur-[120px]" />
        </div>

  <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 md:gap-24 relative z-10 w-full">
          <div className="md:w-[45%]">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 mb-10 border border-[#161514]/6 rounded-full bg-white/35 backdrop-blur-md shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5D6C68] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5D6C68]"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#5D6C68]">Accepting New Clients</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-light tracking-[-0.035em] leading-[0.98] [font-family:var(--font-cormorant)] text-[#161514] mb-6 max-w-lg">
              Find clarity in <br/>
              <span className="italic text-[#A66A4A] relative inline-block">
                the chaos.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl font-light leading-relaxed text-[#3A3836]/70 max-w-md [font-family:var(--font-cormorant)]">
              Compassionate, evidence‑based therapy for high‑achieving adults. Reclaim your calm in Santa Monica.
            </p>

            <div className="mt-14 flex flex-col sm:flex-row gap-6 items-start">
              <button className="group px-10 py-5 bg-[#161514] text-[#F3F0EA] rounded-full text-xs font-bold uppercase tracking-[0.16em] shadow-[0_20px_40px_-15px_rgba(22,21,20,0.30)] hover:shadow-[0_25px_50px_-12px_rgba(22,21,20,0.45)] hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A66A4A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F4]">
                <span className="relative z-10">Book Consultation</span>
                <div className="absolute inset-0 bg-[#A66A4A] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              </button>
              <button className="px-10 py-5 bg-transparent text-[#161514] border border-[#161514]/18 rounded-full text-xs font-bold uppercase tracking-[0.16em] hover:bg-white/60 hover:border-[#161514]/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A66A4A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F4]">
                Explore Services
              </button>
            </div>
          </div>

          <div className="md:w-[55%] w-full relative group [perspective:1000px]">
             {/* Abstract organic shape decoration */}
             <div className="absolute -top-12 -right-12 w-64 h-64 border border-[#A66A4A]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-100" />
            
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.10)] transition-all duration-1000 hover:shadow-[0_55px_130px_-25px_rgba(166,106,74,0.18)] bg-[#E8E6E1] max-h-[calc(100vh-200px)]">
              <HeroImageLens src="/office1.jpeg" alt="Sleek modern therapy office" priority />
            </div>
            
            {/* Floating Info card */}
            <div className="absolute -bottom-10 -left-10 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl hidden md:block max-w-xs border border-white/50">
               <p className="[font-family:var(--font-cormorant)] text-2xl italic text-[#1A1918] leading-tight">"A sanctuary for your mind."</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Intro statement (Minimal & Typographic) */}
  <section className="bg-white py-32 md:py-44 border-b border-[#2F2D2B]/6">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#A66A4A] mb-14">A Space for Healing</p>
          <div className="relative">
             <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[120px] leading-none opacity-[0.06] font-serif text-[#A66A4A] select-none">“</span>
             <p className="text-4xl md:text-6xl font-light leading-[1.35] [font-family:var(--font-cormorant)] text-[#1A1918] text-balance">
              You might look like you have it together on the outside, while feeling <span className="italic text-[#A66A4A]">quietly exhausted</span> inside. Therapy is a place to slow down, feel supported, and find <span className="border-b border-[#A66A4A]/30 pb-1">steadiness</span>.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Services Section (3-Column Grid - Layout Preserved) */}
    <section id="services" className="py-24 md:py-32 bg-[#F2F0E9]">
      <div className="max-w-7xl mx-auto px-6">
             <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="max-w-xl">
                   <h3 className="text-4xl md:text-5xl font-light [font-family:var(--font-cormorant)] mb-4 text-[#1A1918]">Clinical Specializations</h3>
                   <p className="text-[#3A3836]/70 font-light leading-relaxed">
                      Tailored, evidence-based interventions designed to help high-achieving adults move from merely surviving to deeply thriving.
                   </p>
                </div>
                <a href="#services" className="hidden md:inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-[#3A3836]/30 pb-1 hover:border-[#A66A4A] hover:text-[#A66A4A] transition-colors">
                   View All Services
                </a>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Service 1 */}
                <article className="group relative bg-[#FAF9F6] p-10 rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-500 border border-[#3A3836]/5 hover:-translate-y-1 overflow-hidden">
                   <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                     <div className="absolute -top-24 -left-24 w-64 h-64 bg-[radial-gradient(circle,rgba(166,106,74,0.14)_0%,rgba(166,106,74,0)_70%)] blur-[55px]" />
                   </div>
                   <div className="mb-8 w-12 h-12 rounded-full bg-[#5D6C68]/10 flex items-center justify-center group-hover:bg-[#5D6C68] transition-colors duration-500">
                      <svg className="w-5 h-5 text-[#5D6C68] group-hover:text-[#F2F0E9] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                   </div>
                   <h4 className="text-2xl font-medium [font-family:var(--font-cormorant)] text-[#1A1918] mb-4">Anxiety &amp; Panic</h4>
                   <p className="text-sm leading-relaxed text-[#3A3836]/70 mb-8 min-h-[80px]">
                      Breaking the cycle of chronic worry and panic attacks. We use somatic regulation and CBT to help you reclaim your sense of safety.
                   </p>
                   <details className="group/details">
                     <summary className="list-none cursor-pointer inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A66A4A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A66A4A]/35 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF9F6] rounded-full">
                       <span className="group-hover:underline decoration-[#A66A4A]/30 underline-offset-4">Learn more</span>
                       <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#3A3836]/10 bg-white/60 text-[#3A3836]/70 transition-transform duration-300 group-open/details:rotate-45">
                         +
                       </span>
                     </summary>
                     <div className="mt-6 rounded-2xl border border-[#3A3836]/5 bg-white/60 backdrop-blur p-6 text-sm text-[#3A3836]/75 leading-relaxed">
                       <div className="grid grid-cols-1 gap-4">
                         <div>
                           <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3A3836]/60 mb-2">What we’ll work on</p>
                           <p>Body-based anxiety cues, overthinking loops, and panic triggers—so you can feel grounded day to day.</p>
                         </div>
                         <div>
                           <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3A3836]/60 mb-2">Tools</p>
                           <p>CBT reframes, paced breathing, somatic tracking, and personalized “calm plans” for high-stress moments.</p>
                         </div>
                       </div>
                     </div>
                   </details>
                </article>

                {/* Service 2 */}
                <article className="group relative bg-[#FAF9F6] p-10 rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-500 border border-[#3A3836]/5 hover:-translate-y-1 overflow-hidden">
                   <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                     <div className="absolute -top-24 -right-24 w-72 h-72 bg-[radial-gradient(circle,rgba(93,108,104,0.14)_0%,rgba(93,108,104,0)_70%)] blur-[60px]" />
                   </div>
                   <div className="mb-8 w-12 h-12 rounded-full bg-[#A66A4A]/10 flex items-center justify-center group-hover:bg-[#A66A4A] transition-colors duration-500">
                      <svg className="w-5 h-5 text-[#A66A4A] group-hover:text-[#F2F0E9] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                   </div>
                   <h4 className="text-2xl font-medium [font-family:var(--font-cormorant)] text-[#1A1918] mb-4">Burnout Recovery</h4>
                   <p className="text-sm leading-relaxed text-[#3A3836]/70 mb-8 min-h-[80px]">
                      For the exhausted professional. Address perfectionism, set sustainable boundaries, and reconnect with your core values and energy.
                   </p>
                   <details className="group/details">
                     <summary className="list-none cursor-pointer inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A66A4A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A66A4A]/35 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF9F6] rounded-full">
                       <span className="group-hover:underline decoration-[#A66A4A]/30 underline-offset-4">Learn more</span>
                       <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#3A3836]/10 bg-white/60 text-[#3A3836]/70 transition-transform duration-300 group-open/details:rotate-45">
                         +
                       </span>
                     </summary>
                     <div className="mt-6 rounded-2xl border border-[#3A3836]/5 bg-white/60 backdrop-blur p-6 text-sm text-[#3A3836]/75 leading-relaxed">
                       <div className="grid grid-cols-1 gap-4">
                         <div>
                           <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3A3836]/60 mb-2">What we’ll work on</p>
                           <p>Burnout patterns, nervous system depletion, and “always-on” pressure—without losing your ambition.</p>
                         </div>
                         <div>
                           <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3A3836]/60 mb-2">Tools</p>
                           <p>Boundary scripts, values-based decisions, pacing, and recovery rituals you can actually keep.</p>
                         </div>
                       </div>
                     </div>
                   </details>
                </article>

                {/* Service 3 */}
                <article className="group relative bg-[#FAF9F6] p-10 rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-500 border border-[#3A3836]/5 hover:-translate-y-1 overflow-hidden">
                   <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                     <div className="absolute -bottom-28 left-1/3 w-72 h-72 bg-[radial-gradient(circle,rgba(122,107,93,0.14)_0%,rgba(122,107,93,0)_70%)] blur-[60px]" />
                   </div>
                   <div className="mb-8 w-12 h-12 rounded-full bg-[#7A6B5D]/10 flex items-center justify-center group-hover:bg-[#7A6B5D] transition-colors duration-500">
                      <svg className="w-5 h-5 text-[#7A6B5D] group-hover:text-[#F2F0E9] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                   </div>
                   <h4 className="text-2xl font-medium [font-family:var(--font-cormorant)] text-[#1A1918] mb-4">Trauma &amp; EMDR</h4>
                   <p className="text-sm leading-relaxed text-[#3A3836]/70 mb-8 min-h-[80px]">
                      Deep processing for past wounds. Using EMDR to help the brain metabolize traumatic memories without creating overwhelm.
                   </p>
                   <details className="group/details">
                     <summary className="list-none cursor-pointer inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A66A4A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A66A4A]/35 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF9F6] rounded-full">
                       <span className="group-hover:underline decoration-[#A66A4A]/30 underline-offset-4">Learn more</span>
                       <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#3A3836]/10 bg-white/60 text-[#3A3836]/70 transition-transform duration-300 group-open/details:rotate-45">
                         +
                       </span>
                     </summary>
                     <div className="mt-6 rounded-2xl border border-[#3A3836]/5 bg-white/60 backdrop-blur p-6 text-sm text-[#3A3836]/75 leading-relaxed">
                       <div className="grid grid-cols-1 gap-4">
                         <div>
                           <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3A3836]/60 mb-2">What we’ll work on</p>
                           <p>Gentle trauma processing with strong stabilization—so you stay within your window of tolerance.</p>
                         </div>
                         <div>
                           <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3A3836]/60 mb-2">Tools</p>
                           <p>EMDR prep, resourcing, grounding, and paced reprocessing—always consent-led and collaborative.</p>
                         </div>
                       </div>
                     </div>
                   </details>
                </article>
             </div>
         </div>
      </section>

    {/* 5. "Our Office" Section (New Mandatory Section - 2 Images) */}
  <section className="py-24 md:py-32 px-6 bg-[#EAE8E3]">
      <div className="max-w-7xl mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 {/* Text Content */}
                 <div className="order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 mb-6 opacity-70">
            <span className="h-[1px] w-8 bg-[#A66A4A]"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A66A4A]">Our Sanctuary</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-light [font-family:var(--font-cormorant)] text-[#1A1918] mb-8 leading-tight">
                        A private space designed for <span className="italic text-[#5D6C68]">safety</span> and stillness.
                    </h2>
                    <p className="text-[#3A3836]/80 leading-loose font-light mb-8 max-w-xl">
                        Located in the heart of Ocean Park, Santa Monica, our office offers a physical retreat from the noise of the city. We believe your environment shapes your healing capability.
                    </p>
          <ul className="space-y-5 mb-12 text-sm font-medium text-[#3A3836]/90">
                        <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A66A4A]" />
                            Sound-softened rooms for complete privacy
                        </li>
                        <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A66A4A]" />
                            Natural light and grounding, organic textures
                        </li>
                        <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A66A4A]" />
                            Hybrid options available (In-person &amp; Video)
                        </li>
                    </ul>
      <button className="px-8 py-4 bg-[#3A3836] text-[#F2F0E9] text-xs uppercase tracking-[0.2em] font-bold rounded-full hover:bg-[#A66A4A] transition-colors duration-500 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A66A4A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#EAE8E3]">
                        Tour the Space
                    </button>
                 </div>

                 {/* Image Grid (Meeting the "2-3 Images" requirement) */}
                 <div className="order-1 lg:order-2 grid grid-cols-2 gap-4 h-[520px]">
           <div className="relative h-full w-full rounded-[20px] overflow-hidden translate-y-8 select-none shadow-md hover:shadow-xl transition-shadow duration-700">
             <Image src="/office1.jpeg" alt="Therapy office seating area" fill className="object-cover hover:scale-[1.04] transition-transform duration-1000" />
                     </div>
           <div className="relative h-full w-full rounded-[20px] overflow-hidden -translate-y-8 select-none shadow-md hover:shadow-xl transition-shadow duration-700">
             <Image src="/office2.jpeg" alt="Natural light in therapy room" fill className="object-cover hover:scale-[1.04] transition-transform duration-1000" />
                     </div>
                 </div>
             </div>
         </div>
      </section>

      {/* 6. FAQ Section (New Mandatory Section for Copywriting Checklist) */}
      <section className="py-24 bg-[#FFFFFF]">
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
                 <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#5D6C68] mb-4 block">Common Questions</span>
                 <h2 className="text-3xl md:text-4xl font-light [font-family:var(--font-cormorant)] text-[#1A1918]">Understanding the Process</h2>
            </div>
            
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-10 md:gap-y-8">
                {/* FAQ Item 1 */}
    <div className="rounded-2xl border border-[#3A3836]/5 bg-[#FAF9F6] p-9 shadow-sm hover:shadow-md transition-shadow duration-500">
      <h4 className="text-lg font-semibold [font-family:var(--font-cormorant)] text-[#1A1918] mb-3">Do you accept high-profile clients?</h4>
      <p className="text-sm leading-relaxed text-[#3A3836]/65">
                        Yes. We understand the unique privacy needs of public figures and executives. Our practice maintains strict confidentiality protocols and offers discreet entry options.
                    </p>
                </div>
                {/* FAQ Item 2 */}
    <div className="rounded-2xl border border-[#3A3836]/5 bg-[#FAF9F6] p-9 shadow-sm hover:shadow-md transition-shadow duration-500">
          <h4 className="text-lg font-semibold [font-family:var(--font-cormorant)] text-[#1A1918] mb-3">What if I can't meet weekly?</h4>
          <p className="text-sm leading-relaxed text-[#3A3836]/65">
                        Consistency builds momentum, but we offer intensive sessions (90-min) bi-weekly for busy professionals who need deeper work with less frequency.
                    </p>
                </div>
                {/* FAQ Item 3 */}
    <div className="rounded-2xl border border-[#3A3836]/5 bg-[#FAF9F6] p-9 shadow-sm hover:shadow-md transition-shadow duration-500">
          <h4 className="text-lg font-semibold [font-family:var(--font-cormorant)] text-[#1A1918] mb-3">Do you take insurance?</h4>
          <p className="text-sm leading-relaxed text-[#3A3836]/65">
                        We are an out-of-network provider. This ensures your care is dictated by clinical needs, not policy limits. We provide Superbills for potential reimbursement.
                    </p>
                </div>
                {/* FAQ Item 4 */}
    <div className="rounded-2xl border border-[#3A3836]/5 bg-[#FAF9F6] p-9 shadow-sm hover:shadow-md transition-shadow duration-500">
          <h4 className="text-lg font-semibold [font-family:var(--font-cormorant)] text-[#1A1918] mb-3">Is the consultation really free?</h4>
          <p className="text-sm leading-relaxed text-[#3A3836]/65">
                        Absolutely. The 15-minute phone consultation is an opportunity for us to ensure we are the best clinical fit for your goals before committing.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* 7. Meet Dr. Maya (Restyled) */}
      <section className="relative bg-[#FAF9F6] py-32 md:py-40 border-t border-[#3A3836]/5 overflow-hidden">
        {/* Soft glow accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[radial-gradient(circle,rgba(166,106,74,0.10)_0%,rgba(166,106,74,0)_70%)] blur-[70px]" />
          <div className="absolute -bottom-24 right-[-10%] w-[700px] h-[420px] bg-[radial-gradient(circle,rgba(93,108,104,0.10)_0%,rgba(93,108,104,0)_70%)] blur-[85px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mx-auto inline-flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-[#A66A4A]/10 blur-xl" />
              <div className="relative inline-block rounded-full overflow-hidden w-28 h-28 border border-[#A66A4A]/25 p-1 bg-white/60 backdrop-blur">
                <Image
                  src="/maya-reynolds.png"
                  alt="Dr. Maya Reynolds"
                  width={112}
                  height={112}
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 opacity-70">
              <span className="h-px w-10 bg-[#A66A4A]/60" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#3A3836]/60">Meet Your Therapist</span>
              <span className="h-px w-10 bg-[#A66A4A]/60" />
            </div>
          </div>

          <h2 className="mt-10 text-4xl md:text-6xl font-light [font-family:var(--font-cormorant)] text-[#1A1918] leading-[1.1]">
            <span className="opacity-90">“My approach is warm,</span>
            <span className="block">
              <span className="italic text-[#A66A4A]">collaborative</span>, and grounded.”
            </span>
          </h2>

          {/* Cute + premium chips */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 rounded-full text-[11px] font-semibold tracking-wide bg-white/70 border border-[#3A3836]/10 text-[#3A3836]/80 shadow-sm">
              10+ years experience
            </span>
            <span className="px-4 py-2 rounded-full text-[11px] font-semibold tracking-wide bg-white/70 border border-[#3A3836]/10 text-[#3A3836]/80 shadow-sm">
              CBT • EMDR • Mindfulness
            </span>
            <span className="px-4 py-2 rounded-full text-[11px] font-semibold tracking-wide bg-white/70 border border-[#3A3836]/10 text-[#3A3836]/80 shadow-sm">
              Ocean Park, Santa Monica
            </span>
          </div>

          <div className="mt-12 prose prose-lg mx-auto text-[#3A3836]/70 font-light leading-loose max-w-2xl">
            <p>
              I work with adults who are feeling overwhelmed by anxiety, stress, trauma, or burnout. Many of my clients are high‑achieving and deeply thoughtful, yet find themselves emotionally exhausted.
            </p>
            <p className="mt-6">
              I prioritize safety and stabilization while helping you develop insight and long‑term resilience. Drawing on evidence‑based methods including CBT, EMDR, and mindfulness, I offer a space where you can finally stop performing and start healing.
            </p>
          </div>

          <div className="mt-14 flex items-center justify-center gap-4">
            <button className="px-8 py-4 bg-[#1A1918] text-[#F2F0E9] text-xs uppercase tracking-[0.2em] font-bold rounded-full hover:bg-[#A66A4A] transition-colors duration-500 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A66A4A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6]">
              Request a Consultation
            </button>
            <button className="px-8 py-4 bg-transparent text-[#1A1918] border border-[#1A1918]/15 text-xs uppercase tracking-[0.2em] font-bold rounded-full hover:bg-white/60 hover:border-[#1A1918]/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A66A4A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6]">
              Learn About My Style
            </button>
          </div>
        </div>
      </section>

      {/* 8. Call-to-action */}
      <section className="bg-[#141312] py-32 md:py-44 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#A66A4A] to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h3 className="text-5xl md:text-7xl font-thin [font-family:var(--font-cormorant)] text-[#F2F0E9] mb-8">
            Begin Your Journey Home
          </h3>
          <p className="text-[#F2F0E9]/60 text-lg font-light mb-12 max-w-xl mx-auto">
            You don't have to carry it all alone. Schedule a free 15-minute consultation to see if we're the right fit for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button className="px-14 py-6 bg-[#A66A4A] text-[#F2F0E9] rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#7A6B5D] hover:-translate-y-1 transition-all duration-300 shadow-[0_14px_44px_-18px_rgba(166,106,74,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A66A4A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141312]">
              Book Consultation
            </button>
            <button className="px-14 py-6 bg-transparent border border-[#F2F0E9]/18 text-[#F2F0E9] rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#F2F0E9]/5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A66A4A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141312]">
              Read FAQ
            </button>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-[#FAF9F6] border-t border-[#3A3836]/10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 mb-16">
                
                {/* Brand */}
                <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="flex items-center gap-3 opacity-90">
                        <Image src="/maya-reynolds.png" alt="Dr. Maya Reynolds" width={40} height={40} className="rounded-full grayscale" />
                        <span className="[font-family:var(--font-cormorant)] font-medium text-xl text-[#1A1918]">Dr. Maya Reynolds</span>
                    </div>
                    <p className="text-[#3A3836]/50 text-sm max-w-xs text-center md:text-left">
                        Clinical Psychology &amp; Somatic Healing for the high-functioning professional.
                    </p>
                </div>

                {/* Links */}
                <div className="flex gap-12 text-[#3A3836]/70 text-sm">
                    <ul className="space-y-3">
                        <li className="font-bold text-[#1A1918] text-xs uppercase tracking-widest mb-4">Practice</li>
            <li className="hover:text-[#A66A4A] cursor-pointer transition-colors">Services</li>
            <li className="hover:text-[#A66A4A] cursor-pointer transition-colors">About</li>
            <li className="hover:text-[#A66A4A] cursor-pointer transition-colors">FAQ</li>
                    </ul>
                    <ul className="space-y-3">
                        <li className="font-bold text-[#1A1918] text-xs uppercase tracking-widest mb-4">Contact</li>
            <li className="hover:text-[#A66A4A] cursor-pointer transition-colors">hello@drmaya.com</li>
            <li className="hover:text-[#A66A4A] cursor-pointer transition-colors">310-555-0123</li>
            <li className="hover:text-[#A66A4A] cursor-pointer transition-colors">Santa Monica, CA</li>
                    </ul>
                </div>
            </div>

            <div className="pt-8 border-t border-[#3A3836]/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-[#3A3836]/40">
                <span>© {new Date().getFullYear()} Dr. Maya Reynolds Psychology. All rights reserved.</span>
                <div className="flex gap-6">
          <span className="hover:text-[#A66A4A] cursor-pointer transition-colors">Instagram</span>
          <span className="hover:text-[#A66A4A] cursor-pointer transition-colors">LinkedIn</span>
          <span className="hover:text-[#A66A4A] cursor-pointer transition-colors">Privacy</span>
                </div>
            </div>
        </div>
      </footer>
    </main>
  );
}
