import React, { useState, useMemo } from 'react';
import { Experiment, ConvexLensObservation } from '../../../types';
import { EXPERIMENTS } from '../../../data/experiments';
import {
  CONVEX_LENS_INFO,
  CONVEX_LENS_APPARATUS,
  CONVEX_LENS_PROCEDURE,
  CONVEX_LENS_PRECAUTIONS,
  CONVEX_LENS_COMMON_ERRORS,
  STANDARD_CONVEX_LENS_TRIALS,
} from '../../../data/convexLensData';
import { LensCanvas } from './LensCanvas';
import { LensControls } from './LensControls';
import { LensReadings } from './LensReadings';
import { LensObservationTable } from './LensObservationTable';
import { LensGraph } from './LensGraph';
import { LensQuiz } from './LensQuiz';
import { LensViva } from './LensViva';
import { LensDoubt } from './LensDoubt';
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
  Award,
  Target,
  Sliders,
  CheckCircle2,
  Info,
  Compass,
  Calculator,
} from 'lucide-react';

interface ConvexLensLabProps {
  experiment: Experiment;
  onBack: () => void;
  onSelectExperiment: (exp: Experiment) => void;
}

export const ConvexLensLab: React.FC<ConvexLensLabProps> = ({
  experiment,
  onBack,
  onSelectExperiment,
}) => {
  const FOCAL_LENGTH = CONVEX_LENS_INFO.constants.theoreticalFocalLength; // 20.0 cm

  // Optical bench state
  const [uMagnitude, setUMagnitude] = useState<number>(CONVEX_LENS_INFO.constants.defaultObjectDistance); // 60 cm
  const [screenPos, setScreenPos] = useState<number>(CONVEX_LENS_INFO.constants.defaultScreenPos); // 30 cm

  // Signed positions
  const u = -uMagnitude;
  const isAtFocus = Math.abs(uMagnitude - FOCAL_LENGTH) < 0.001;
  const isVirtual = uMagnitude < FOCAL_LENGTH;

  // Thin lens calculations: 1/v = 1/f + 1/u => v = (f * u) / (u + f)
  const v = useMemo(() => {
    if (isAtFocus) return Infinity;
    return (FOCAL_LENGTH * u) / (u + FOCAL_LENGTH);
  }, [u, FOCAL_LENGTH, isAtFocus]);

  const magnification = useMemo(() => {
    if (isAtFocus) return Infinity;
    return v / u;
  }, [v, u, isAtFocus]);

  // Initial observations from standard benchmark trials
  const [observations, setObservations] = useState<ConvexLensObservation[]>(() => {
    return STANDARD_CONVEX_LENS_TRIALS.map((trial, index) => ({
      id: `convex-obs-${index + 1}`,
      trialNo: trial.trialNo,
      u: trial.u,
      v: trial.v,
      oneOverU: 1 / trial.u,
      oneOverV: 1 / trial.v,
      focalLength: trial.focalLength,
      magnification: trial.magnification,
      nature: trial.nature,
      timestamp: Date.now() - (4 - index) * 60000,
    }));
  });

  // Record current live reading
  const handleRecordReading = () => {
    if (isAtFocus || isVirtual) return;

    let nature = 'Real, Inverted';
    const absM = Math.abs(magnification);
    if (Math.abs(absM - 1.0) < 0.02) {
      nature += ', Same Size';
    } else if (absM < 1.0) {
      nature += ', Diminished';
    } else {
      nature += ', Magnified';
    }

    const calculatedF = 1 / (1 / v - 1 / u);

    const newObs: ConvexLensObservation = {
      id: `convex-obs-${Date.now()}`,
      trialNo: observations.length + 1,
      u,
      v,
      oneOverU: 1 / u,
      oneOverV: 1 / v,
      focalLength: calculatedF,
      magnification,
      nature,
      timestamp: Date.now(),
    };

    setObservations((prev) => [...prev, newObs]);
  };

  const handleDeleteReading = (id: string) => {
    setObservations((prev) => prev.filter((o) => o.id !== id));
  };

  const handleClearTable = () => {
    setObservations([]);
  };

  const handleLoadStandardTrials = () => {
    const loaded: ConvexLensObservation[] = STANDARD_CONVEX_LENS_TRIALS.map((trial, index) => ({
      id: `convex-obs-std-${Date.now()}-${index}`,
      trialNo: index + 1,
      u: trial.u,
      v: trial.v,
      oneOverU: 1 / trial.u,
      oneOverV: 1 / trial.v,
      focalLength: trial.focalLength,
      magnification: trial.magnification,
      nature: trial.nature,
      timestamp: Date.now(),
    }));
    setObservations(loaded);
  };

  const handleResetBench = () => {
    setUMagnitude(60);
    setScreenPos(30);
  };

  const projectileExp = EXPERIMENTS.find((e) => e.slug === 'projectile-motion');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 1. TOP SUB-NAVBAR & BREADCRUMBS */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Return to Experiment Catalogue"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalogue</span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <span>/</span>
              <span className="text-slate-500">Virtual Labs</span>
              <span>/</span>
              <span className="text-indigo-600 font-semibold font-mono">
                Exp 05
              </span>
              <span>/</span>
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                Convex Lens &bull; Focal Length
              </h1>
            </div>
          </div>

          {/* Quick experiment toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {projectileExp && (
              <button
                onClick={() => onSelectExperiment(projectileExp)}
                className="hidden lg:inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                title="Switch to Experiment 04: Projectile Motion"
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
                  EXPERIMENT 05 &bull; Classes 10–12
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
                  Ray Optics &bull; Thin-Lens Formulation
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-semibold">
                  Fully Interactive Laboratory Bench
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Convex Lens &bull; Determination of Focal Length &amp; Lens Formula Verification
              </h2>

              <div className="pt-2 text-sm sm:text-base text-slate-700 space-y-1">
                <p>
                  <strong className="text-slate-900 font-mono uppercase text-xs tracking-wider">Aim: </strong>
                  To determine the focal length of a convex lens by measuring the object distance and corresponding image distance, and to verify the lens formula.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  Mount a thin converging biconvex lens on an optical bench, translate an illuminated object arrow across varying conjugate positions (beyond 2F, at 2F, and between F and 2F), focus the resulting real inverted image sharply on the movable screen, verify the authoritative thin-lens relation <span className="font-mono font-semibold text-slate-900">1/f = 1/v − 1/u</span>, and perform linear regression on the <span className="font-mono font-semibold text-slate-900">1/v versus 1/u</span> coordinate plot to estimate focal length.
                </p>
              </div>
            </div>

            {/* Quick Stats / Theoretical Constant Box */}
            <div className="shrink-0 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs space-y-2 min-w-[240px]">
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Optical Bench Baseline
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Theoretical f:</span>
                <span className="font-bold text-slate-900">+{FOCAL_LENGTH.toFixed(2)} cm</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Current Object u:</span>
                <span className="font-bold text-emerald-700">{u.toFixed(1)} cm</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Calculated Image v:</span>
                <span className="font-bold text-indigo-700">
                  {isAtFocus ? '∞' : `${v > 0 ? '+' : ''}${v.toFixed(1)} cm`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-slate-900 font-semibold">
                <span>Lens Formula:</span>
                <span className="text-indigo-700 font-bold">1/f = 1/v − 1/u</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. THEORY & GOVERNING EQUATIONS */}
        <div id="theory-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Theoretical Foundation &bull; Ray Optics Principles
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* Overview & Lens Formula */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider">
                  Lens Definition &amp; Behavior
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  A convex lens is thicker at the center than at the edges and can converge parallel rays of light. When a real object is placed beyond the focal point of a convex lens, a real inverted image can be formed on the opposite side of the lens. Changing the object position changes the image position.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2.5">
                <span className="text-xs font-mono font-bold text-indigo-900 uppercase tracking-wider">
                  Thin-Lens Formula &amp; Expressions
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center py-1">
                  <div className="p-2 rounded-xl bg-white/80 border border-indigo-100">
                    <span className="text-[10px] font-mono text-indigo-700 block">Lens Formula</span>
                    <span className="text-base font-mono font-extrabold text-indigo-950">
                      1/f = 1/v &minus; 1/u
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/80 border border-indigo-100">
                    <span className="text-[10px] font-mono text-indigo-700 block">Focal Length</span>
                    <span className="text-base font-mono font-extrabold text-indigo-950">
                      f = uv / (u + v)
                    </span>
                  </div>
                </div>
                <div className="text-xs font-mono text-indigo-900 space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span>Linear Magnification:</span>
                    <span className="font-bold">m = v / u = hᵢ / hₒ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Authoritative calculation:</span>
                    <span className="font-bold">f = 1 / (1/v &minus; 1/u)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cartesian Sign Convention */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
                  Cartesian Sign Convention
                </span>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 font-sans leading-relaxed">
                  <li>All distances are measured from the optical center (O) along the principal axis.</li>
                  <li>Distances in the direction of incident light (right) are positive (+).</li>
                  <li>Distances against incident light (left) are negative (&minus;).</li>
                  <li>
                    Real object on the left: <strong className="text-slate-900 font-mono">u &lt; 0</strong> (e.g. u = -60 cm).
                  </li>
                  <li>
                    Real inverted image on the right: <strong className="text-slate-900 font-mono">v &gt; 0</strong> (e.g. v = +30 cm).
                  </li>
                  <li>
                    Convex lens focal length: <strong className="text-slate-900 font-mono">f &gt; 0</strong> (positive for converging lenses).
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-900 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold font-mono text-[11px] uppercase tracking-wider text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Crucial Sign Convention Warning</span>
                </div>
                <p className="leading-relaxed font-sans">
                  Do not use <span className="font-mono font-bold">1/f = 1/u + 1/v</span> when using the Cartesian sign convention. The plus sign applies to spherical mirrors, whereas the authoritative thin-lens formula is strictly <span className="font-mono font-bold">1/f = 1/v &minus; 1/u</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Reference Table for Conjugate Positions */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider block">
              Image Formation Summary for Thin Convex Lens (f = +20 cm)
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left font-mono">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Object Position</th>
                    <th className="py-2 px-3">Image Position</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Orientation</th>
                    <th className="py-2 px-3">Relative Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">Beyond 2F (|u| &gt; 40 cm)</td>
                    <td className="py-2 px-3 text-indigo-700">Between F′ and 2F′ (20 &lt; v &lt; 40 cm)</td>
                    <td className="py-2 px-3 text-emerald-700 font-bold">Real</td>
                    <td className="py-2 px-3">Inverted</td>
                    <td className="py-2 px-3">Diminished (|m| &lt; 1)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">At 2F (|u| = 40 cm)</td>
                    <td className="py-2 px-3 text-indigo-700">At 2F′ (v = +40 cm)</td>
                    <td className="py-2 px-3 text-emerald-700 font-bold">Real</td>
                    <td className="py-2 px-3">Inverted</td>
                    <td className="py-2 px-3 font-bold text-amber-800">Same Size (|m| = 1)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">Between F and 2F (20 &lt; |u| &lt; 40 cm)</td>
                    <td className="py-2 px-3 text-indigo-700">Beyond 2F′ (v &gt; 40 cm)</td>
                    <td className="py-2 px-3 text-emerald-700 font-bold">Real</td>
                    <td className="py-2 px-3">Inverted</td>
                    <td className="py-2 px-3">Magnified (|m| &gt; 1)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">At F (|u| = 20 cm)</td>
                    <td className="py-2 px-3 text-indigo-700">At Infinity (v = &infin;)</td>
                    <td className="py-2 px-3 text-sky-700">Parallel rays</td>
                    <td className="py-2 px-3">&mdash;</td>
                    <td className="py-2 px-3">Highly Magnified</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">Inside F (|u| &lt; 20 cm)</td>
                    <td className="py-2 px-3 text-amber-700">Same side as object (v &lt; 0)</td>
                    <td className="py-2 px-3 text-amber-700 font-bold">Virtual</td>
                    <td className="py-2 px-3">Erect</td>
                    <td className="py-2 px-3">Magnified (Magnifying glass)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4. VIRTUAL APPARATUS & COMPONENTS */}
        <div id="apparatus-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Virtual Apparatus &amp; Optical Bench Components
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Virtual laboratory components representing physical apparatus
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONVEX_LENS_APPARATUS.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold">
                    {item.connectionType}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {item.role}
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-200/60">
                  {item.spec}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100/70 border border-slate-200 text-slate-600 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Note:</strong> These components represent a physical optical bench experiment conducted in standard secondary and senior secondary school laboratories.
            </span>
          </div>
        </div>

        {/* 5. INTERACTIVE OPTICAL BENCH SIMULATION */}
        <div id="simulation-bench" className="space-y-6">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Interactive Ray Optics Simulation Bench
            </h3>
          </div>

          {/* SVG Optical Bench Visual */}
          <LensCanvas
            uMagnitude={uMagnitude}
            screenPos={screenPos}
            onScreenPosChange={setScreenPos}
            onObjectDistanceChange={setUMagnitude}
            focalLength={FOCAL_LENGTH}
          />

          {/* Sliders & Preset Controls */}
          <LensControls
            uMagnitude={uMagnitude}
            screenPos={screenPos}
            onObjectDistanceChange={setUMagnitude}
            onScreenPosChange={setScreenPos}
            onRecordReading={handleRecordReading}
            onReset={handleResetBench}
            calculatedV={v}
            isVirtual={isVirtual}
            isAtFocus={isAtFocus}
          />

          {/* Live Readings Panel */}
          <LensReadings
            uMagnitude={uMagnitude}
            focalLength={FOCAL_LENGTH}
            screenPos={screenPos}
          />
        </div>

        {/* 6. OBSERVATION TABLE */}
        <div id="observation-table">
          <LensObservationTable
            observations={observations}
            onDeleteReading={handleDeleteReading}
            onClearTable={handleClearTable}
            onLoadStandardTrials={handleLoadStandardTrials}
          />
        </div>

        {/* 7. GRAPH & EXPERIMENTAL VERIFICATION */}
        <div id="graph-analysis">
          <LensGraph
            observations={observations}
            theoreticalFocalLength={FOCAL_LENGTH}
          />
        </div>

        {/* 8. EXPERIMENTAL PROCEDURE */}
        <div id="procedure-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
            <ListOrdered className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Virtual Laboratory Procedure (11 Steps)
            </h3>
          </div>

          <div className="space-y-3">
            {CONVEX_LENS_PROCEDURE.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-700"
              >
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed font-sans">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 9. PRECAUTIONS & COMMON ERRORS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Precautions */}
          <div id="precautions-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Experimental Precautions (7 Guidelines)
              </h3>
            </div>
            <ul className="space-y-2.5">
              {CONVEX_LENS_PRECAUTIONS.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed font-sans"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Errors */}
          <div id="errors-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Common Student Errors &amp; Pitfalls
              </h3>
            </div>
            <ul className="space-y-2.5">
              {CONVEX_LENS_COMMON_ERRORS.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed font-sans"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 10. MODEL LIMITATIONS */}
        <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Optical Model Scope &amp; Physical Assumptions</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {CONVEX_LENS_INFO.modelLimitations}
          </p>
        </div>

        {/* 11. FORMATIVE CONCEPT QUIZ */}
        <LensQuiz />

        {/* 12. ORAL EXAM & VIVA VOCE */}
        <LensViva />

        {/* 13. ASK A PHYSICS DOUBT */}
        <LensDoubt />
      </div>
    </div>
  );
};
