import React, { useState, useEffect, useRef } from 'react';
import { Experiment, PendulumObservation } from '../../../types';
import { EXPERIMENTS } from '../../../data/experiments';
import {
  SIMPLE_PENDULUM_INFO,
  SIMPLE_PENDULUM_APPARATUS,
  SIMPLE_PENDULUM_PROCEDURE,
  SIMPLE_PENDULUM_PRECAUTIONS,
  SIMPLE_PENDULUM_COMMON_ERRORS,
} from '../../../data/simplePendulumData';
import { PendulumCanvas } from './PendulumCanvas';
import { PendulumControls } from './PendulumControls';
import { PendulumReadings } from './PendulumReadings';
import { PendulumObservationTable } from './PendulumObservationTable';
import { TLGraph } from './TLGraph';
import { PendulumQuiz } from './PendulumQuiz';
import { PendulumViva } from './PendulumViva';
import { PendulumDoubt } from './PendulumDoubt';
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

interface SimplePendulumLabProps {
  experiment: Experiment;
  onBack: () => void;
  onSelectExperiment: (exp: Experiment) => void;
}

export const SimplePendulumLab: React.FC<SimplePendulumLabProps> = ({
  experiment,
  onBack,
  onSelectExperiment,
}) => {
  // Physical parameters state
  const [length, setLength] = useState<number>(0.80); // Default 0.80 m (80 cm)
  const [initialAngle, setInitialAngle] = useState<number>(10.0); // Default 10°
  const [targetOscillations, setTargetOscillations] = useState<number>(10); // Default 10

  // Simulation execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hasRecordedCurrent, setHasRecordedCurrent] = useState<boolean>(false);

  // Live dynamic animation state
  const [currentAngle, setCurrentAngle] = useState<number>(10.0);
  const [measuredTime, setMeasuredTime] = useState<number>(0.0);
  const [oscillations, setOscillations] = useState<number>(0);

  // Recorded observations
  const [observations, setObservations] = useState<PendulumObservation[]>([]);

  // Animation frame reference
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedElapsedRef = useRef<number>(0);

  // Theoretical period T = 2π√(L/g) where g = 9.81 m/s²
  const G_THEORETICAL = 9.81;
  const currentTheoreticalPeriod = 2 * Math.PI * Math.sqrt(length / G_THEORETICAL);

  // Animation and oscillation loop
  useEffect(() => {
    if (isRunning) {
      // Calculate target duration for N complete oscillations
      const targetDuration = targetOscillations * currentTheoreticalPeriod;
      startTimeRef.current = performance.now() - pausedElapsedRef.current * 1000;

      const loop = (now: number) => {
        const elapsedSec = (now - startTimeRef.current) / 1000;

        if (elapsedSec >= targetDuration) {
          // Exactly target oscillations completed!
          const finalTime = Number(targetDuration.toFixed(3));
          setMeasuredTime(finalTime);
          setOscillations(targetOscillations);
          setCurrentAngle(initialAngle); // Return cleanly to release angle
          setIsRunning(false);
          setIsCompleted(true);
          pausedElapsedRef.current = 0;
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
        } else {
          // Continuous SHM angle: θ(t) = θ₀ * cos(2π * t / T)
          const instantTheta = initialAngle * Math.cos((2 * Math.PI * elapsedSec) / currentTheoreticalPeriod);
          const completedN = Math.min(
            targetOscillations,
            Math.floor(elapsedSec / currentTheoreticalPeriod)
          );

          setCurrentAngle(instantTheta);
          setMeasuredTime(elapsedSec);
          setOscillations(completedN);

          animationFrameRef.current = requestAnimationFrame(loop);
        }
      };

      animationFrameRef.current = requestAnimationFrame(loop);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, length, initialAngle, targetOscillations, currentTheoreticalPeriod]);

  // Handlers
  const handleStart = () => {
    if (isRunning) return;
    if (isCompleted) {
      // Reset current measurement if completed earlier
      setMeasuredTime(0);
      setOscillations(0);
      setIsCompleted(false);
      setHasRecordedCurrent(false);
      pausedElapsedRef.current = 0;
    }
    setIsRunning(true);
  };

  const handleStop = () => {
    if (!isRunning) return;
    setIsRunning(false);
    pausedElapsedRef.current = measuredTime;
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setHasRecordedCurrent(false);
    pausedElapsedRef.current = 0;
    setMeasuredTime(0);
    setOscillations(0);
    setCurrentAngle(initialAngle);
  };

  const handleLengthChange = (newLen: number) => {
    if (isRunning) return;
    setLength(newLen);
    setIsCompleted(false);
    setHasRecordedCurrent(false);
    setMeasuredTime(0);
    setOscillations(0);
    pausedElapsedRef.current = 0;
  };

  const handleInitialAngleChange = (newAngle: number) => {
    if (isRunning) return;
    setInitialAngle(newAngle);
    setCurrentAngle(newAngle);
  };

  const handleTargetOscillationsChange = (newN: number) => {
    if (isRunning) return;
    setTargetOscillations(newN);
    setIsCompleted(false);
    setHasRecordedCurrent(false);
    setMeasuredTime(0);
    setOscillations(0);
    pausedElapsedRef.current = 0;
  };

  const handleRecordReading = () => {
    if (!isCompleted || hasRecordedCurrent) return;

    const period = Number((measuredTime / targetOscillations).toFixed(3));
    const periodSquared = Number((period * period).toFixed(3));

    const newObservation: PendulumObservation = {
      id: `obs-p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      srNo: observations.length + 1,
      length: Number(length.toFixed(2)),
      oscillations: targetOscillations,
      time: Number(measuredTime.toFixed(3)),
      period,
      periodSquared,
      timestamp: Date.now(),
    };

    setObservations((prev) => [...prev, newObservation]);
    setHasRecordedCurrent(true);
  };

  const handleDeleteObservation = (id: string) => {
    setObservations((prev) => prev.filter((o) => o.id !== id));
  };

  const handleClearObservations = () => {
    setObservations([]);
  };

  // Find other experiments for switcher
  const ohmsLawExp = EXPERIMENTS.find((e) => e.id === 'ohms-law' || e.slug === 'ohms-law');
  const hookesLawExp = EXPERIMENTS.find((e) => e.id === 'hookes-law' || e.slug === 'hookes-law');

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
                Experiment 02 &bull; Classes 9–11
              </span>
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                Simple Pendulum &bull; Determination of g
              </h1>
            </div>
          </div>

          {/* Quick experiment toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {ohmsLawExp && (
              <button
                onClick={() => onSelectExperiment(ohmsLawExp)}
                className="hidden md:inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                title="Switch to Experiment 01"
              >
                <span>Exp 01: Ohm's Law</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            {hookesLawExp && (
              <button
                onClick={() => onSelectExperiment(hookesLawExp)}
                className="hidden lg:inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                title="Switch to Experiment 03"
              >
                <span>Exp 03: Hooke's Law</span>
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
                  Mechanics &bull; Gravitation
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
                  Standard Secondary / Senior Secondary Syllabus
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-semibold">
                  Interactive Physics Simulation
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Simple Pendulum — Determination of g
              </h2>

              <div className="pt-2 text-sm sm:text-base text-slate-700 space-y-1">
                <p>
                  <strong className="text-slate-900 font-mono uppercase text-xs tracking-wider">Aim: </strong>
                  To determine the acceleration due to gravity (g) using a simple pendulum.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  Measure the time period of oscillation across different pendulum lengths, tabulate observation sets, and plot the <span className="font-mono font-semibold text-slate-900">T² versus L</span> linear graph to deduce the local gravitational acceleration <span className="font-mono font-semibold text-slate-900">g</span> from the least-squares slope.
                </p>
              </div>
            </div>

            {/* Quick Stats / Theoretical Constant Box */}
            <div className="shrink-0 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs space-y-2 min-w-[220px]">
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Standard Physical Constant
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Theoretical g (Earth):</div>
                <div className="text-lg font-extrabold text-indigo-700">
                  9.81 <span className="text-xs font-semibold text-slate-500">m/s²</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <div>Formula: <span className="text-indigo-600 font-bold">T = 2π√(L/g)</span></div>
                <div>Slope: <span className="text-emerald-600 font-bold">m = 4π²/g</span></div>
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
                <span>Fundamental Theory &bull; SHM Mechanics</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-2">
                Simple Harmonic Motion of a Suspended Bob
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans mb-4">
                {SIMPLE_PENDULUM_INFO.theory.statement}
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1 font-mono">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Physical Relationships:</div>
                <div className="text-indigo-700 font-bold text-sm">
                  {SIMPLE_PENDULUM_INFO.theory.formula} &nbsp;&equiv;&nbsp; {SIMPLE_PENDULUM_INFO.theory.squaredFormula}
                </div>
                <div className="text-slate-600 text-[11px] pt-1">
                  Squaring both sides linearizes the equation in the form <span className="font-bold">y = mx</span>, where <span className="font-bold">y = T²</span>, <span className="font-bold">x = L</span>, and slope <span className="font-bold">m = 4π²/g</span>.
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Small-Angle Limit: &theta; &le; 15&deg;</span>
              <span className="text-indigo-600 font-semibold">sin(&theta;) &asymp; &theta; (radians)</span>
            </div>
          </div>

          {/* Card 2: Variables & Graphical Determination of g (Span 5) */}
          <div className="md:col-span-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-800/60 text-indigo-200 text-xs font-mono font-bold uppercase mb-3 border border-indigo-700">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Slope Derivation</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                Evaluation of g from Slope
              </h3>
              
              <div className="space-y-3 font-mono text-xs my-4">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">Linear Graph Slope (m):</div>
                  <div className="text-indigo-300 font-bold text-sm">
                    m = &Delta;T² / &Delta;L = 4&pi;² / g
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">Rearranging for Gravity (g):</div>
                  <div className="text-emerald-400 font-bold text-sm">
                    g = 4&pi;² / m = 39.4784 / slope
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-sans leading-relaxed pt-2 border-t border-slate-800">
              Notice that the time period is completely independent of the mass of the bob and depends strictly on effective length and local gravitational acceleration.
            </div>
          </div>

        </div>

        {/* 4. MAIN INTERACTIVE VIRTUAL LABORATORY WORKSPACE */}
        <div id="virtual-apparatus-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Interactive Apparatus &bull; Live Oscillation Bench</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Virtual Laboratory Bench
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Manipulate length &amp; angle &bull; Record completed oscillation trials
            </div>
          </div>

          {/* Workbench Grid: Left = Apparatus Canvas (Span 7), Right = Controls & Readings (Span 5) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Interactive SVG Pendulum Canvas */}
            <div className="lg:col-span-7">
              <PendulumCanvas
                length={length}
                currentAngleDeg={currentAngle}
                initialAngleDeg={initialAngle}
                isRunning={isRunning}
                oscillations={oscillations}
                targetOscillations={targetOscillations}
                measuredTime={measuredTime}
              />
            </div>

            {/* Right: Controls & Real-Time Instrument Readings */}
            <div className="lg:col-span-5 space-y-6">
              {/* Actuators & Experiment Controls */}
              <PendulumControls
                length={length}
                onLengthChange={handleLengthChange}
                initialAngle={initialAngle}
                onInitialAngleChange={handleInitialAngleChange}
                targetOscillations={targetOscillations}
                onTargetOscillationsChange={handleTargetOscillationsChange}
                isRunning={isRunning}
                isCompleted={isCompleted}
                hasRecordedCurrent={hasRecordedCurrent}
                onStart={handleStart}
                onStop={handleStop}
                onReset={handleReset}
                onRecordReading={handleRecordReading}
              />

              {/* Digital Stopwatch & Instrument Readings */}
              <PendulumReadings
                length={length}
                oscillations={oscillations}
                targetOscillations={targetOscillations}
                measuredTime={measuredTime}
                isRunning={isRunning}
                isCompleted={isCompleted}
              />
            </div>

          </div>
        </div>

        {/* 5. OBSERVATION TABLE */}
        <PendulumObservationTable
          observations={observations}
          onDeleteObservation={handleDeleteObservation}
          onClearObservations={handleClearObservations}
          onRecordReading={handleRecordReading}
          isMeasurementReady={isCompleted}
          hasRecordedCurrent={hasRecordedCurrent}
          currentLength={length}
          currentN={targetOscillations}
          currentTime={measuredTime}
        />

        {/* 6. DYNAMIC GRAPH & LEAST-SQUARES ANALYSIS & RESULT */}
        <TLGraph
          observations={observations}
          theoreticalG={G_THEORETICAL}
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
              Standard physical hardware required for conducting this experiment in a secondary school laboratory.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SIMPLE_PENDULUM_APPARATUS.map((item) => (
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

        {/* 8. EXPERIMENTAL PROCEDURE (14 NUMBERED STEPS) */}
        <div id="procedure-section" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          <div className="pb-5 border-b border-slate-200 mb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Standard Operating Procedure</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Step-by-Step Laboratory Procedure (14 Steps)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Follow these sequential laboratory instructions to systematically gather timing observations and calculate g.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {SIMPLE_PENDULUM_PROCEDURE.map((step, index) => (
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
                Experimental Precautions
              </h3>
            </div>

            <div className="space-y-3.5">
              {SIMPLE_PENDULUM_PRECAUTIONS.map((item, idx) => (
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
                Sources of Error &amp; Mitigation
              </h3>
            </div>

            <div className="space-y-3.5">
              {SIMPLE_PENDULUM_COMMON_ERRORS.map((err, idx) => (
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
        <PendulumQuiz />

        {/* 11. VIVA VOCE PRACTICE (6 QUESTIONS) */}
        <PendulumViva />

        {/* 12. ASK A DOUBT / JOURNAL LOG */}
        <PendulumDoubt />

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
            {ohmsLawExp && (
              <button
                onClick={() => onSelectExperiment(ohmsLawExp)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Experiment 01: Ohm's Law</span>
              </button>
            )}
            {hookesLawExp && (
              <button
                onClick={() => onSelectExperiment(hookesLawExp)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Experiment 03: Hooke's Law</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
