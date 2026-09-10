import React, { useState, useEffect } from 'react';
import { ArrowRight, Compass, Sparkles, Sliders, Activity, Eye, Zap, RefreshCw } from 'lucide-react';

interface HeroProps {
  onExploreLabs: () => void;
  onHowItWorks: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreLabs, onHowItWorks }) => {
  // Interactive Physics Visual state
  const [activeVisualMode, setActiveVisualMode] = useState<'pendulum' | 'circuit' | 'optics'>('pendulum');
  
  // Pendulum Interactive Parameters
  const [pendulumLength, setPendulumLength] = useState<number>(75); // cm
  const [pendulumGravity, setPendulumGravity] = useState<number>(9.81); // m/s^2
  const [pendulumAngle, setPendulumAngle] = useState<number>(0);

  // Circuit Interactive Parameters
  const [resistance, setResistance] = useState<number>(4); // Ohms
  const [voltage, setVoltage] = useState<number>(12); // Volts

  // Optics Interactive Parameters
  const [objectDistance, setObjectDistance] = useState<number>(30); // cm
  const focalLength = 15; // cm (fixed convex lens)

  // Calculated Values
  const periodT = (2 * Math.PI * Math.sqrt((pendulumLength / 100) / pendulumGravity)).toFixed(3);
  const currentI = (voltage / resistance).toFixed(2);
  // 1/v = 1/f + 1/u (u is negative: 1/v = 1/f - 1/|u|)
  const imageDistanceV = objectDistance > focalLength 
    ? ((focalLength * objectDistance) / (objectDistance - focalLength)).toFixed(1)
    : 'Virtual (Erect)';

  // Gentle pendulum swing animation
  useEffect(() => {
    let frameId: number;
    let time = 0;
    const animate = () => {
      time += 0.04;
      const freq = Math.sqrt(pendulumGravity / (pendulumLength / 100));
      setPendulumAngle(Math.sin(time * freq * 0.7) * 18);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [pendulumLength, pendulumGravity]);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/30 lab-grid-bg">
      {/* Decorative ambient scientific grid glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Context, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Project Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-200/70 text-indigo-700 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider font-mono">
                UNIVERSITY COMMUNITY ENGAGEMENT PROJECT
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Experience Physics <br className="hidden sm:inline" />
              <span className="text-indigo-600">Beyond the Laboratory.</span>
            </h1>

            {/* Subtitle / Supporting text */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
              An accessible virtual physics laboratory for Classes 9–12, designed for students and schools with limited access to laboratory equipment.
            </p>

            {/* Core Project Purpose Badges */}
            <div className="flex flex-wrap gap-2 pt-1 pb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-white border border-slate-200 text-slate-700 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Indian Classes 9–12
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-white border border-slate-200 text-slate-700 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Free Digital Access
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-white border border-slate-200 text-slate-700 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Experiment-Based Learning
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                id="hero-cta-explore-labs"
                onClick={onExploreLabs}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                <span>Explore Virtual Labs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                id="hero-cta-how-it-works"
                onClick={onHowItWorks}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-900 border border-slate-300/80 shadow-xs transition-all text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <Compass className="w-4 h-4 text-slate-500" />
                <span>How It Works</span>
              </button>
            </div>

            {/* Subtitle Note */}
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 pt-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300" />
              Practical Physics for Schools with Limited Laboratory Access
            </p>
          </div>

          {/* Right Column: Abstract Scientific Interactive Laboratory Visual */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-xl shadow-slate-200/50 border border-slate-200/80 relative">
              
              {/* Card Header & Visual Mode Switcher */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                    Digital Apparatus Sandbox
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  Interactive Physics Simulation
                </span>
              </div>

              {/* Apparatus Mode Selector Tabs */}
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100/90 p-1 rounded-xl mb-4 text-xs font-semibold text-slate-600">
                <button
                  id="tab-mode-pendulum"
                  onClick={() => setActiveVisualMode('pendulum')}
                  className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeVisualMode === 'pendulum'
                      ? 'bg-white text-indigo-700 shadow-xs font-bold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Pendulum</span>
                </button>
                <button
                  id="tab-mode-circuit"
                  onClick={() => setActiveVisualMode('circuit')}
                  className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeVisualMode === 'circuit'
                      ? 'bg-white text-indigo-700 shadow-xs font-bold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Ohm's Law</span>
                </button>
                <button
                  id="tab-mode-optics"
                  onClick={() => setActiveVisualMode('optics')}
                  className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeVisualMode === 'optics'
                      ? 'bg-white text-indigo-700 shadow-xs font-bold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Convex Lens</span>
                </button>
              </div>

              {/* Canvas Visual Display Area */}
              <div className="w-full h-56 bg-slate-950 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-800 lab-grid-bg">
                
                {/* 1. Pendulum Simulation Graphic */}
                {activeVisualMode === 'pendulum' && (
                  <div className="w-full h-full relative flex flex-col items-center justify-start pt-4">
                    {/* Stand top support */}
                    <div className="w-32 h-2.5 bg-slate-700 rounded-full border border-slate-600 shadow-sm" />
                    <div className="w-1.5 h-3 bg-slate-500 -mt-0.5" />

                    {/* Swing Container */}
                    <div 
                      className="origin-top flex flex-col items-center transition-transform duration-75"
                      style={{
                        transform: `rotate(${pendulumAngle}deg)`,
                        height: `${Math.min(150, 60 + pendulumLength * 0.9)}px`
                      }}
                    >
                      {/* String */}
                      <div className="w-0.5 flex-1 bg-indigo-400/80 dashed-line" />
                      {/* Metallic Bob */}
                      <div className="w-7 h-7 rounded-full bg-gradient-to-b from-indigo-300 via-indigo-500 to-indigo-800 shadow-md ring-2 ring-indigo-400/30 flex items-center justify-center text-[9px] font-mono text-white">
                        m
                      </div>
                    </div>

                    {/* Ground Reference Grid and Angles */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>g = {pendulumGravity} m/s²</span>
                      <span className="text-emerald-400 font-bold">T = {periodT} s</span>
                    </div>
                  </div>
                )}

                {/* 2. Ohm's Law Circuit Graphic */}
                {activeVisualMode === 'circuit' && (
                  <div className="w-full h-full p-4 relative flex flex-col justify-between">
                    {/* SVG Circuit Schematic */}
                    <svg className="w-full h-32" viewBox="0 0 300 120">
                      {/* Wires */}
                      <rect x="30" y="20" width="240" height="80" fill="none" stroke="#475569" strokeWidth="2" rx="4" />
                      {/* Battery */}
                      <rect x="25" y="50" width="10" height="20" fill="#0f172a" />
                      <line x1="20" y1="53" x2="40" y2="53" stroke="#818cf8" strokeWidth="2" />
                      <line x1="26" y1="67" x2="34" y2="67" stroke="#818cf8" strokeWidth="2" />
                      <text x="8" y="63" fill="#94a3b8" fontSize="10" fontFamily="monospace">V</text>

                      {/* Voltmeter in parallel */}
                      <circle cx="150" cy="20" r="14" fill="#0f172a" stroke="#6366f1" strokeWidth="2" />
                      <text x="146" y="24" fill="#a5b4fc" fontSize="11" fontWeight="bold" fontFamily="monospace">V</text>

                      {/* Resistor in bottom branch */}
                      <rect x="125" y="93" width="50" height="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                      <text x="141" y="104" fill="#38bdf8" fontSize="10" fontFamily="monospace">R</text>

                      {/* Ammeter in series */}
                      <circle cx="230" cy="100" r="12" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                      <text x="226" y="104" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">A</text>
                    </svg>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 px-2">
                      <span>V = {voltage} V</span>
                      <span>R = {resistance} Ω</span>
                      <span className="text-emerald-400 font-bold">I = {currentI} A</span>
                    </div>
                  </div>
                )}

                {/* 3. Convex Lens Optics Graphic */}
                {activeVisualMode === 'optics' && (
                  <div className="w-full h-full p-4 relative flex flex-col justify-between">
                    <svg className="w-full h-32" viewBox="0 0 320 120">
                      {/* Principal Axis */}
                      <line x1="10" y1="60" x2="310" y2="60" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
                      
                      {/* Convex Lens */}
                      <path d="M 160 15 Q 166 60 160 105 Q 154 60 160 15 Z" fill="#6366f1" opacity="0.3" stroke="#818cf8" strokeWidth="1.5" />
                      <line x1="160" y1="10" x2="160" y2="110" stroke="#a5b4fc" strokeWidth="1" opacity="0.5" />

                      {/* Focal Points */}
                      <circle cx="110" cy="60" r="2.5" fill="#f59e0b" />
                      <text x="106" y="74" fill="#f59e0b" fontSize="8" fontFamily="monospace">F₁</text>
                      <circle cx="210" cy="60" r="2.5" fill="#f59e0b" />
                      <text x="206" y="74" fill="#f59e0b" fontSize="8" fontFamily="monospace">F₂</text>

                      {/* Object Arrow */}
                      <line x1="60" y1="60" x2="60" y2="30" stroke="#38bdf8" strokeWidth="2.5" />
                      <polygon points="60,25 56,33 64,33" fill="#38bdf8" />
                      <text x="44" y="24" fill="#38bdf8" fontSize="8" fontFamily="monospace">Object</text>

                      {/* Parallel Ray into Focal Point */}
                      <line x1="60" y1="30" x2="160" y2="30" stroke="#fbbf24" strokeWidth="1.5" />
                      <line x1="160" y1="30" x2="260" y2="90" stroke="#fbbf24" strokeWidth="1.5" />

                      {/* Center Ray */}
                      <line x1="60" y1="30" x2="260" y2="90" stroke="#a78bfa" strokeWidth="1.5" />

                      {/* Inverted Image Arrow */}
                      <line x1="260" y1="60" x2="260" y2="90" stroke="#34d399" strokeWidth="2.5" />
                      <polygon points="260,95 256,87 264,87" fill="#34d399" />
                      <text x="246" y="108" fill="#34d399" fontSize="8" fontFamily="monospace">Image</text>
                    </svg>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 px-2">
                      <span>f = {focalLength} cm</span>
                      <span>u = -{objectDistance} cm</span>
                      <span className="text-emerald-400 font-bold">v = +{imageDistanceV} cm</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Live Parameter Adjustment Controls */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                {activeVisualMode === 'pendulum' && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1 font-mono">
                      <span>Pendulum Length (L): {pendulumLength} cm</span>
                      <span>Formula: T = 2π√(L/g)</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="120"
                      value={pendulumLength}
                      onChange={(e) => setPendulumLength(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      aria-label="Adjust Pendulum Length"
                    />
                  </div>
                )}

                {activeVisualMode === 'circuit' && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1 font-mono">
                      <span>Rheostat Resistance: {resistance} Ω</span>
                      <span>Formula: I = V / R</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={resistance}
                      onChange={(e) => setResistance(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      aria-label="Adjust Rheostat Resistance"
                    />
                  </div>
                )}

                {activeVisualMode === 'optics' && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1 font-mono">
                      <span>Object Distance (u): {objectDistance} cm</span>
                      <span>Formula: 1/f = 1/v - 1/u</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="60"
                      value={objectDistance}
                      onChange={(e) => setObjectDistance(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      aria-label="Adjust Object Distance"
                    />
                  </div>
                )}

                {/* Bottom Caption */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                    Live variable manipulation demo
                  </span>
                  <span className="font-mono text-indigo-600 font-medium">Standard SI Units</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
