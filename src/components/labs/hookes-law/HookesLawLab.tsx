import React, { useState } from 'react';
import { Experiment, HookeObservation } from '../../../types';
import { EXPERIMENTS } from '../../../data/experiments';
import {
  HOOKES_LAW_INFO,
  HOOKES_LAW_APPARATUS,
  HOOKES_LAW_PROCEDURE,
  HOOKES_LAW_PRECAUTIONS,
  HOOKES_LAW_COMMON_ERRORS,
} from '../../../data/hookesLawData';
import { SpringCanvas } from './SpringCanvas';
import { HookeControls } from './HookeControls';
import { HookeReadings } from './HookeReadings';
import { HookeObservationTable } from './HookeObservationTable';
import { FXGraph } from './FXGraph';
import { HookeQuiz } from './HookeQuiz';
import { HookeViva } from './HookeViva';
import { HookeDoubt } from './HookeDoubt';
import {
  ArrowLeft,
  BookOpen,
  ListOrdered,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Activity,
  Award
} from 'lucide-react';

interface HookesLawLabProps {
  experiment: Experiment;
  onBack: () => void;
  onSelectExperiment: (exp: Experiment) => void;
}

export const HookesLawLab: React.FC<HookesLawLabProps> = ({
  experiment,
  onBack,
  onSelectExperiment,
}) => {
  // Physical parameters state
  const [massGrams, setMassGrams] = useState<number>(0); // Default 0 g (unloaded initial reference)

  // Physical constants
  const THEORETICAL_K = HOOKES_LAW_INFO.constants.theoreticalK; // 20.0 N/m
  const G = HOOKES_LAW_INFO.constants.g; // 9.81 m/s²

  // Real-time physical calculations
  const massKg = massGrams / 1000;
  const force = Number((massKg * G).toFixed(4));
  const extensionMeters = Number((force / THEORETICAL_K).toFixed(5));
  const extensionCm = Number((extensionMeters * 100).toFixed(3));

  // Recorded observations
  const [observations, setObservations] = useState<HookeObservation[]>([]);

  // Check if current mass has already been recorded
  const hasRecordedCurrent = observations.some((o) => o.massGrams === massGrams);

  // Control handlers
  const handleMassChange = (newMass: number) => {
    setMassGrams(Math.min(500, Math.max(0, newMass)));
  };

  const handleAddLoad = () => {
    setMassGrams((prev) => Math.min(500, prev + 50));
  };

  const handleRemoveLoad = () => {
    setMassGrams((prev) => Math.max(0, prev - 50));
  };

  const handleReset = () => {
    setMassGrams(0);
  };

  const handleRecordReading = () => {
    if (hasRecordedCurrent) return;

    const calculatedK = massGrams > 0 && extensionMeters > 0
      ? Number((force / extensionMeters).toFixed(2))
      : null;

    const newObservation: HookeObservation = {
      id: `obs-hooke-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      srNo: observations.length + 1,
      massGrams,
      massKg: Number(massKg.toFixed(3)),
      force: Number(force.toFixed(3)),
      extensionMeters: Number(extensionMeters.toFixed(4)),
      extensionCm: Number(extensionCm.toFixed(2)),
      springConstant: calculatedK,
      timestamp: Date.now(),
    };

    setObservations((prev) => [...prev, newObservation]);
  };

  const handleDeleteObservation = (id: string) => {
    setObservations((prev) => prev.filter((o) => o.id !== id));
  };

  const handleClearObservations = () => {
    setObservations([]);
  };

  // Find other experiments for switcher
  const ohmsLawExp = EXPERIMENTS.find((e) => e.slug === 'ohms-law');
  const pendulumExp = EXPERIMENTS.find((e) => e.slug === 'simple-pendulum');
  const projectileExp = EXPERIMENTS.find((e) => e.slug === 'projectile-motion');

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* 1. TOP BREADCRUMB & SWITCHER HEADER */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Labs Portal</span>
              <span className="sm:hidden">Portal</span>
            </button>

            <div className="h-4 w-px bg-slate-200 shrink-0" />

            <div className="truncate">
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 block">
                Experiment 03 &bull; Classes 9–11
              </span>
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                Hooke's Law &bull; Verification &amp; Spring Constant
              </h1>
            </div>
          </div>

          {/* Quick experiment toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {projectileExp && (
              <button
                onClick={() => onSelectExperiment(projectileExp)}
                className="hidden lg:inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                title="Switch to Experiment 04"
              >
                <span>Exp 04: Projectile Motion</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Bench Active
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">

        {/* 2. EXPERIMENT HEADER */}
        <div id="experiment-header" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold uppercase tracking-wider">
                  EXPERIMENT 03 &bull; Classes 9–11
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
                  Elasticity &amp; Material Properties
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-semibold">
                  Fully Interactive Laboratory Bench
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Hooke's Law — Verification &amp; Spring Constant
              </h2>

              <div className="pt-2 text-sm sm:text-base text-slate-700 space-y-1">
                <p>
                  <strong className="text-slate-900 font-mono uppercase text-xs tracking-wider">Aim: </strong>
                  To verify Hooke's Law by studying the relationship between the applied force and extension produced in a spring, and to determine the spring constant.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  Suspend known slotted masses from a helical spring, measure the corresponding elongation from the unloaded zero reference mark (x₀), tabulate trials, and plot the <span className="font-mono font-semibold text-slate-900">Force (F) versus Extension (x)</span> linear graph to deduce the experimental spring constant <span className="font-mono font-semibold text-slate-900">k</span> from the regression slope.
                </p>
              </div>
            </div>

            {/* Quick Stats / Theoretical Constant Box */}
            <div className="shrink-0 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs space-y-2 min-w-[220px]">
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Simulation Reference Constants
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Theoretical Spring Constant (k):</div>
                <div className="text-lg font-extrabold text-indigo-700">
                  {THEORETICAL_K.toFixed(2)} <span className="text-xs font-semibold text-slate-500">N/m</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <div>Formula: <span className="text-indigo-600 font-bold">F = k &bull; x</span></div>
                <div>Slope: <span className="text-emerald-600 font-bold">m = &Delta;F / &Delta;x = k</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BENTO GRID: THEORY, FORMULA & METHODOLOGY */}
        <div id="theory-section" className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1: Underlying Theory (Span 7) */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Fundamental Theory &bull; Linear Elasticity</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-2">
                Hooke's Law for a Helical Spring
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans mb-4">
                {HOOKES_LAW_INFO.theory.statement}
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1 font-mono">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Governing Relationships:</div>
                <div className="text-indigo-700 font-bold text-sm">
                  F &prop; x &nbsp;&rArr;&nbsp; {HOOKES_LAW_INFO.theory.formula} &nbsp;&rArr;&nbsp; {HOOKES_LAW_INFO.theory.rearranged}
                </div>
                <div className="text-slate-600 text-[11px] pt-1">
                  where <span className="font-bold">F = mg</span> is applied force in newtons (N), <span className="font-bold">x</span> is elongation in metres (m), and <span className="font-bold">k</span> is spring stiffness in newtons per metre (N/m).
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Operating Limit: Elastic Region</span>
              <span className="text-indigo-600 font-semibold">{HOOKES_LAW_INFO.theory.elasticLimitNote}</span>
            </div>
          </div>

          {/* Card 2: Graphical Determination of k (Span 5) */}
          <div className="md:col-span-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-800/60 text-indigo-200 text-xs font-mono font-bold uppercase mb-3 border border-indigo-700">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Slope Derivation</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                Evaluation of Spring Constant from Slope
              </h3>
              
              <div className="space-y-3 font-mono text-xs my-4">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">Force–Extension Graph Slope (m):</div>
                  <div className="text-indigo-300 font-bold text-sm">
                    Slope = &Delta;F / &Delta;x = (F₂ - F₁) / (x₂ - x₁)
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">Direct Spring Constant:</div>
                  <div className="text-emerald-400 font-bold text-sm">
                    k_experimental = Slope (N/m)
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-sans leading-relaxed pt-2 border-t border-slate-800">
              Notice that the line of best fit passes through the origin (0, 0), as zero applied force produces zero net extension from the unloaded equilibrium state.
            </div>
          </div>

        </div>

        {/* 4. MAIN INTERACTIVE VIRTUAL LABORATORY WORKSPACE */}
        <div id="virtual-apparatus-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Interactive Apparatus &bull; Live Tensile Spring Bench</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Virtual Laboratory Bench
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Adjust suspended mass &bull; Observe spring elongation &bull; Tabulate trials
            </div>
          </div>

          {/* Workbench Grid: Left = Apparatus Canvas (Span 7), Right = Controls & Readings (Span 5) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Interactive SVG Helical Spring Canvas */}
            <div className="lg:col-span-7">
              <SpringCanvas
                massGrams={massGrams}
                force={force}
                extensionMeters={extensionMeters}
                extensionCm={extensionCm}
                theoreticalK={THEORETICAL_K}
              />
            </div>

            {/* Right: Controls & Real-Time Instrument Readings */}
            <div className="lg:col-span-5 space-y-6">
              {/* Load Actuator & Experiment Controls */}
              <HookeControls
                massGrams={massGrams}
                onMassChange={handleMassChange}
                onAddLoad={handleAddLoad}
                onRemoveLoad={handleRemoveLoad}
                onReset={handleReset}
                onRecordReading={handleRecordReading}
                hasRecordedCurrent={hasRecordedCurrent}
              />

              {/* Digital Calculations & Instrument Readings */}
              <HookeReadings
                massGrams={massGrams}
                massKg={massKg}
                force={force}
                extensionMeters={extensionMeters}
                extensionCm={extensionCm}
                theoreticalK={THEORETICAL_K}
              />
            </div>

          </div>
        </div>

        {/* 5. OBSERVATION TABLE */}
        <HookeObservationTable
          observations={observations}
          onDeleteObservation={handleDeleteObservation}
          onClearObservations={handleClearObservations}
          onRecordReading={handleRecordReading}
          hasRecordedCurrent={hasRecordedCurrent}
          currentMassGrams={massGrams}
        />

        {/* 6. DYNAMIC F-X GRAPH & LEAST-SQUARES REGRESSION */}
        <FXGraph
          observations={observations}
          theoreticalK={THEORETICAL_K}
        />

        {/* 7. APPARATUS SPECIFICATIONS */}
        <div id="apparatus-section" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          <div className="pb-5 border-b border-slate-200 mb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Laboratory Inventory</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Apparatus &amp; Instrument Specifications
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Standard physical hardware required for conducting this experiment in a secondary school physics laboratory.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HOOKES_LAW_APPARATUS.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-sans">{item.role}</p>
                </div>
                <div className="pt-2 border-t border-slate-200/80 text-[11px] font-mono text-indigo-700">
                  <span className="text-slate-400">Spec: </span>{item.spec}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. EXPERIMENTAL PROCEDURE (13 NUMBERED STEPS) */}
        <div id="procedure-section" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          <div className="pb-5 border-b border-slate-200 mb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Standard Operating Procedure</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Step-by-Step Laboratory Procedure (13 Steps)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Follow these sequential laboratory instructions to systematically suspend masses, measure elongation, and deduce spring constant k.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {HOOKES_LAW_PROCEDURE.map((step, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl border border-slate-200/90 bg-white flex items-start gap-3 hover:border-indigo-200 hover:bg-slate-50/40 transition-colors"
              >
                <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <p className="text-xs sm:text-sm text-slate-700 font-sans leading-snug pt-0.5">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 9. PRECAUTIONS & COMMON ERRORS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Precautions (Span 6) */}
          <div id="precautions-section" className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Experimental Precautions (8 Key Rules)
              </h3>
            </div>

            <div className="space-y-3.5">
              {HOOKES_LAW_PRECAUTIONS.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-1">
                  <div className="font-semibold text-emerald-950 text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed pl-3.5">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Common Errors & Mitigation (Span 6) */}
          <div id="common-errors-section" className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Sources of Error &amp; Mitigation (7 Items)
              </h3>
            </div>

            <div className="space-y-3.5">
              {HOOKES_LAW_COMMON_ERRORS.map((err, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-100 space-y-1.5">
                  <div className="font-semibold text-amber-950 text-xs sm:text-sm">
                    {idx + 1}. {err.name}
                  </div>
                  <div className="text-xs text-slate-600 font-sans leading-relaxed">
                    <strong className="text-slate-700">Root Cause: </strong>
                    {err.cause}
                  </div>
                  <div className="text-xs text-emerald-800 font-sans leading-relaxed pt-1 border-t border-amber-200/60">
                    <strong className="text-emerald-900">Laboratory Prevention: </strong>
                    {err.prevention}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 10. FORMATIVE CONCEPT QUIZ (5 QUESTIONS) */}
        <HookeQuiz />

        {/* 11. VIVA VOCE PRACTICE (6 QUESTIONS) */}
        <HookeViva />

        {/* 12. ASK A DOUBT / JOURNAL LOG */}
        <HookeDoubt />

        {/* 13. FOOTER NAVIGATION */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Laboratory Portal</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {pendulumExp && (
              <button
                onClick={() => onSelectExperiment(pendulumExp)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Exp 02: Simple Pendulum</span>
              </button>
            )}
            {projectileExp && (
              <button
                onClick={() => onSelectExperiment(projectileExp)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Exp 04: Projectile Motion</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
