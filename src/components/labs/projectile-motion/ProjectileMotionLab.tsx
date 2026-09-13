import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Experiment, ProjectileObservation } from '../../../types';
import { EXPERIMENTS } from '../../../data/experiments';
import {
  PROJECTILE_MOTION_INFO,
  PROJECTILE_APPARATUS,
  PROJECTILE_PROCEDURE,
  PROJECTILE_PRECAUTIONS,
  PROJECTILE_COMMON_ERRORS,
  STANDARD_ANGLE_TRIALS,
  PROJECTILE_APPARATUS_NOTE,
} from '../../../data/projectileMotionData';
import { ProjectileCanvas } from './ProjectileCanvas';
import { ProjectileControls } from './ProjectileControls';
import { ProjectileReadings } from './ProjectileReadings';
import { ProjectileObservationTable } from './ProjectileObservationTable';
import { RangeAngleGraph } from './RangeAngleGraph';
import { ProjectileQuiz } from './ProjectileQuiz';
import { ProjectileViva } from './ProjectileViva';
import { ProjectileDoubt } from './ProjectileDoubt';
import { ElevatedLaunchInvestigation } from './ElevatedLaunchInvestigation';
import { WhatDidYouLearn } from './WhatDidYouLearn';
import { SaveAttemptButton } from '../../common/SaveAttemptButton';
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
  Compass,
  Sliders,
  CheckCircle2,
  Info
} from 'lucide-react';

interface ProjectileMotionLabProps {
  experiment: Experiment;
  onBack: () => void;
  onSelectExperiment: (exp: Experiment) => void;
}

export const ProjectileMotionLab: React.FC<ProjectileMotionLabProps> = ({
  experiment,
  onBack,
  onSelectExperiment,
}) => {
  // Physical parameters state
  const [velocity, setVelocity] = useState<number>(PROJECTILE_MOTION_INFO.constants.defaultVelocity); // u in m/s
  const [angle, setAngle] = useState<number>(PROJECTILE_MOTION_INFO.constants.defaultAngle); // θ in degrees
  const [launchHeight, setLaunchHeight] = useState<number>(0); // h in meters (0 for ground, 12 for assumed 4th floor)
  const G = PROJECTILE_MOTION_INFO.constants.g; // 9.81 m/s²

  // Theoretical physics values (instantaneous based on selected u, θ, and launchHeight h)
  const rad = (angle * Math.PI) / 180;
  const initialUx = velocity * Math.cos(rad);
  const initialUy = velocity * Math.sin(rad);

  // Time of flight solving quadratic: y(t) = h + uy*t - 0.5*g*t^2 = 0
  // t = (uy + sqrt(uy^2 + 2*g*h)) / g
  const timeOfFlight = useMemo(() => {
    const discriminant = (initialUy * initialUy) + (2 * G * launchHeight);
    return (initialUy + Math.sqrt(Math.max(0, discriminant))) / G;
  }, [initialUy, G, launchHeight]);

  // Maximum height reached above ground level datum: h + (uy^2)/(2*g)
  const maxHeight = useMemo(() => {
    return launchHeight + (initialUy * initialUy) / (2 * G);
  }, [launchHeight, initialUy, G]);

  // Horizontal range at impact with ground level datum: ux * timeOfFlight
  const theoreticalRange = useMemo(() => {
    return initialUx * timeOfFlight;
  }, [initialUx, timeOfFlight]);

  // Simulation execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Real-time kinematic coordinates
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentX, setCurrentX] = useState<number>(0);
  const [currentY, setCurrentY] = useState<number>(0);
  const [currentVx, setCurrentVx] = useState<number>(initialUx);
  const [currentVy, setCurrentVy] = useState<number>(initialUy);
  const [trajectoryPoints, setTrajectoryPoints] = useState<Array<{ x: number; y: number }>>([
    { x: 0, y: 0 },
  ]);

  // Animation frame reference
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Update initial velocities and height when slider changes while idle
  useEffect(() => {
    if (!isRunning && !isPaused && !isCompleted) {
      setCurrentVx(initialUx);
      setCurrentVy(initialUy);
      setCurrentY(launchHeight);
      setTrajectoryPoints([{ x: 0, y: launchHeight }]);
    }
  }, [initialUx, initialUy, launchHeight, isRunning, isPaused, isCompleted]);

  // Physics animation loop using requestAnimationFrame
  useEffect(() => {
    if (!isRunning || isPaused) {
      lastTimeRef.current = null;
      return;
    }

    const animate = (perfTime: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = perfTime;
      }

      const deltaMs = perfTime - lastTimeRef.current;
      lastTimeRef.current = perfTime;

      // Real-time progression (1s physical = 1s simulation)
      // Clamped to avoid massive jumps on background tab switches
      const deltaSec = Math.min(0.05, deltaMs / 1000);

      setCurrentTime((prevT) => {
        const nextT = prevT + deltaSec;

        if (nextT >= timeOfFlight) {
          // Touchdown achieved at ground datum (y = 0 m)
          const finalX = theoreticalRange;
          const finalVy = initialUy - G * timeOfFlight;
          setCurrentX(finalX);
          setCurrentY(0);
          setCurrentVx(initialUx);
          setCurrentVy(finalVy);
          setIsRunning(false);
          setIsCompleted(true);
          setTrajectoryPoints((prev) => [...prev, { x: finalX, y: 0 }]);
          return timeOfFlight;
        }

        // Mid-flight coordinates using y(t) = h + uy*t - 0.5*g*t^2
        const x = initialUx * nextT;
        const y = Math.max(0, launchHeight + initialUy * nextT - 0.5 * G * nextT * nextT);
        const vx = initialUx;
        const vy = initialUy - G * nextT;

        setCurrentX(x);
        setCurrentY(y);
        setCurrentVx(vx);
        setCurrentVy(vy);

        setTrajectoryPoints((prev) => {
          // Append point if moved noticeably to optimize path vertices
          const last = prev[prev.length - 1];
          if (!last || Math.hypot(x - last.x, y - last.y) > 0.4) {
            return [...prev, { x, y }];
          }
          return prev;
        });

        return nextT;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isRunning, isPaused, timeOfFlight, theoreticalRange, launchHeight, initialUx, initialUy, G]);

  // Control handlers
  const handleLaunch = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setCurrentTime(0);
    setCurrentX(0);
    setCurrentY(launchHeight);
    setCurrentVx(initialUx);
    setCurrentVy(initialUy);
    setTrajectoryPoints([{ x: 0, y: launchHeight }]);
    setIsCompleted(false);
    setIsPaused(false);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsPaused(false);
    setIsRunning(true);
  };

  const handleReset = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(false);
    setCurrentTime(0);
    setCurrentX(0);
    setCurrentY(launchHeight);
    setCurrentVx(initialUx);
    setCurrentVy(initialUy);
    setTrajectoryPoints([{ x: 0, y: launchHeight }]);
  };

  // Observation table state initialized empty for the student to record their own attempts
  const [observations, setObservations] = useState<ProjectileObservation[]>([]);

  // Reload standard 5-angle benchmark dataset (u = 20 m/s)
  const handleLoadStandardDataset = () => {
    setObservations(STANDARD_ANGLE_TRIALS);
  };

  // Duplicate check (same velocity, angle, and launch height)
  const isDuplicate = observations.some(
    (obs) => obs.velocity === velocity && obs.angle === angle && (obs.launchHeight || 0) === launchHeight
  );

  const handleRecordTrial = () => {
    if (!isCompleted || isDuplicate) return;

    const newObs: ProjectileObservation = {
      id: `proj-obs-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      srNo: observations.length + 1,
      velocity,
      angle,
      launchHeight,
      timeOfFlight: Number(timeOfFlight.toFixed(2)),
      maxHeight: Number(maxHeight.toFixed(2)),
      range: Number(currentX.toFixed(2)),
      timestamp: Date.now(),
    };

    setObservations((prev) => [...prev, newObs]);
  };

  const handleDeleteObservation = (id: string) => {
    setObservations((prev) => prev.filter((o) => o.id !== id));
  };

  const handleClearTable = () => {
    setObservations([]);
  };

  // Angle-analysis dataset strictly filtered to constant velocity u = 20 m/s
  // Excludes 10 m/s and 30 m/s trials from the angle-analysis calculation!
  const angleAnalysisTrials = useMemo(() => {
    return observations.filter((obs) => obs.velocity === 20);
  }, [observations]);

  // Best observation determined strictly within the constant velocity (u = 20 m/s) dataset
  const bestAngleObservation = useMemo(() => {
    if (angleAnalysisTrials.length === 0) return null;
    return angleAnalysisTrials.reduce(
      (best, curr) => (curr.range > (best?.range ?? -1) ? curr : best),
      angleAnalysisTrials[0]
    );
  }, [angleAnalysisTrials]);

  // Check if current configuration is already recorded
  const hasRecordedCurrent = observations.some(
    (obs) => obs.velocity === velocity && obs.angle === angle
  );

  // Switcher experiment links
  const ohmsLawExp = EXPERIMENTS.find((e) => e.slug === 'ohms-law');
  const pendulumExp = EXPERIMENTS.find((e) => e.slug === 'simple-pendulum');
  const hookesLawExp = EXPERIMENTS.find((e) => e.slug === 'hookes-law');

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
                Experiment 04 &bull; Class 11
              </span>
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                Projectile Motion &bull; Range &amp; Trajectory
              </h1>
            </div>
          </div>

          {/* Quick experiment toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {hookesLawExp && (
              <button
                onClick={() => onSelectExperiment(hookesLawExp)}
                className="hidden lg:inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
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
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-sky-50/50 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold uppercase tracking-wider">
                  EXPERIMENT 04 &bull; Class 11
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
                  Mechanics &bull; Kinematics
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-semibold">
                  Fully Interactive Laboratory Bench
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Projectile Motion — Range &amp; Trajectory
              </h2>

              <div className="pt-2 text-sm sm:text-base text-slate-700 space-y-1">
                <p>
                  <strong className="text-slate-900 font-mono uppercase text-xs tracking-wider">Aim: </strong>
                  To study the trajectory of a projectile and investigate how its range depends on the initial velocity and angle of projection.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  Launch a spherical projectile at varying elevations on level terrain, trace its parabolic trajectory under constant downward acceleration (g = 9.81 m/s²), tabulate flight times and maximum heights, and plot the <span className="font-mono font-semibold text-slate-900">Range (R) versus Angle (θ)</span> curve to identify the angle giving maximum horizontal reach.
                </p>
              </div>
            </div>

            {/* Quick Stats / Theoretical Constant Box */}
            <div className="shrink-0 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs space-y-2 min-w-[220px]">
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Kinematic Bench Parameters
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Earth Gravity g:</span>
                <span className="font-bold text-slate-900">9.81 m/s²</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Selected Velocity u:</span>
                <span className="font-bold text-indigo-700">{velocity} m/s</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Launch Elevation θ:</span>
                <span className="font-bold text-amber-700">{angle}°</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-slate-900 font-semibold">
                <span>Max Range Formula:</span>
                <span className="text-emerald-700 font-bold">R = u²sin(2θ)/g</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. THEORY & GOVERNING EQUATIONS */}
        <div id="theory-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Theoretical Foundation &amp; Governing Equations
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Box 1: Definition */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-indigo-700 font-mono uppercase tracking-wider block">
                1. Projectile Definition
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {PROJECTILE_MOTION_INFO.theory.definition}
              </p>
            </div>

            {/* Box 2: Velocity Components */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 font-mono text-xs">
              <span className="text-xs font-bold text-indigo-700 font-mono uppercase tracking-wider block font-sans">
                2. Velocity Vector Components
              </span>
              <div className="p-2 rounded bg-white border border-slate-200 text-indigo-900 font-bold space-y-1">
                <div>{PROJECTILE_MOTION_INFO.theory.velocityComponents.formulaUx}</div>
                <div>{PROJECTILE_MOTION_INFO.theory.velocityComponents.formulaUy}</div>
              </div>
              <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                Horizontal component uₓ remains constant (aₓ = 0); vertical component uᵧ decelerates at rate g.
              </p>
            </div>

            {/* Box 3: Parametric Position */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 font-mono text-xs">
              <span className="text-xs font-bold text-indigo-700 font-mono uppercase tracking-wider block font-sans">
                3. Instantaneous Coordinates
              </span>
              <div className="p-2 rounded bg-white border border-slate-200 text-sky-900 font-bold space-y-1">
                <div>{PROJECTILE_MOTION_INFO.theory.equationsOfMotion.formulaX}</div>
                <div>{PROJECTILE_MOTION_INFO.theory.equationsOfMotion.formulaY}</div>
              </div>
              <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                Yields the classic inverted parabolic trajectory equation: y = x·tan(θ) - [g·x² / (2u²cos²θ)].
              </p>
            </div>

            {/* Box 4: Time of Flight */}
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2 font-mono text-xs">
              <span className="text-xs font-bold text-indigo-950 font-mono uppercase tracking-wider block font-sans">
                4. Total Time of Flight (T)
              </span>
              <div className="p-2 rounded bg-white border border-indigo-200 text-indigo-700 font-bold">
                {PROJECTILE_MOTION_INFO.theory.keyParameters.timeOfFlight}
              </div>
              <p className="text-[11px] text-indigo-900/80 font-sans leading-relaxed">
                Time required for projectile to ascend to apex and return to ground datum (y = 0 m).
              </p>
            </div>

            {/* Box 5: Maximum Height */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 space-y-2 font-mono text-xs">
              <span className="text-xs font-bold text-amber-950 font-mono uppercase tracking-wider block font-sans">
                5. Maximum Trajectory Height (H)
              </span>
              <div className="p-2 rounded bg-white border border-amber-200 text-amber-700 font-bold">
                {PROJECTILE_MOTION_INFO.theory.keyParameters.maxHeight}
              </div>
              <p className="text-[11px] text-amber-900/80 font-sans leading-relaxed">
                Occurs at trajectory vertex (t = T/2) where vertical velocity component momentarily drops to zero (vᵧ = 0).
              </p>
            </div>

            {/* Box 6: Horizontal Range & 45° rule */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2 font-mono text-xs">
              <span className="text-xs font-bold text-emerald-950 font-mono uppercase tracking-wider block font-sans">
                6. Horizontal Range &amp; 45° Peak
              </span>
              <div className="p-2 rounded bg-white border border-emerald-200 text-emerald-700 font-bold">
                {PROJECTILE_MOTION_INFO.theory.keyParameters.horizontalRange}
              </div>
              <p className="text-[11px] text-emerald-900/80 font-sans leading-relaxed">
                {PROJECTILE_MOTION_INFO.theory.optimalAngle.explanation}
              </p>
            </div>

          </div>
        </div>

        {/* 4. HOW THE VARIABLES AFFECT MOTION (Section 16 of user request) */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              How the Physical Variables Affect Motion
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {PROJECTILE_MOTION_INFO.variablesInvestigation.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="font-bold text-indigo-700 font-mono block">
                  {item.variable}
                </span>
                <p className="text-slate-600 font-sans leading-relaxed">
                  {item.effect}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ELEVATED LAUNCH INVESTIGATION (Different Height Study) */}
        <ElevatedLaunchInvestigation
          velocity={velocity}
          angle={angle}
          currentLaunchHeight={launchHeight}
          onSetLaunchHeight={(h) => {
            setLaunchHeight(h);
            handleReset();
          }}
        />

        {/* 5. VIRTUAL LABORATORY SIMULATION WORKSPACE */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Virtual Laboratory Workspace
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {launchHeight === 0 ? 'Level Ground Launch Datum (y₀ = y = 0 m)' : `Elevated Datum (y₀ = ${launchHeight.toFixed(1)} m)`}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Visual Canvas (Span 7) */}
            <div className="lg:col-span-7">
              <ProjectileCanvas
                velocity={velocity}
                angle={angle}
                launchHeight={launchHeight}
                currentTime={currentTime}
                currentX={currentX}
                currentY={currentY}
                currentVx={currentVx}
                currentVy={currentVy}
                trajectoryPoints={trajectoryPoints}
                isRunning={isRunning}
                isPaused={isPaused}
                isCompleted={isCompleted}
                timeOfFlight={timeOfFlight}
                maxHeight={maxHeight}
                theoreticalRange={theoreticalRange}
              />
            </div>

            {/* Interactive Controls & Telemetry HUD (Span 5) */}
            <div className="lg:col-span-5 space-y-6">
              <ProjectileControls
                velocity={velocity}
                onVelocityChange={(v) => {
                  setVelocity(v);
                  handleReset();
                }}
                angle={angle}
                onAngleChange={(a) => {
                  setAngle(a);
                  handleReset();
                }}
                launchHeight={launchHeight}
                onLaunchHeightChange={(h) => {
                  setLaunchHeight(h);
                  handleReset();
                }}
                isRunning={isRunning}
                isPaused={isPaused}
                isCompleted={isCompleted}
                onLaunch={handleLaunch}
                onPause={handlePause}
                onResume={handleResume}
                onReset={handleReset}
                onRecordTrial={handleRecordTrial}
                isDuplicate={isDuplicate}
                hasRecordedCurrent={hasRecordedCurrent}
              />

              <ProjectileReadings
                velocity={velocity}
                angle={angle}
                launchHeight={launchHeight}
                gravity={G}
                currentTime={currentTime}
                currentX={currentX}
                currentY={currentY}
                currentVx={currentVx}
                currentVy={currentVy}
                timeOfFlight={timeOfFlight}
                maxHeight={maxHeight}
                theoreticalRange={theoreticalRange}
                isCompleted={isCompleted}
              />
            </div>

          </div>
        </div>

        {/* 6. EXPERIMENTAL OBSERVATION TABLE */}
        <ProjectileObservationTable
          observations={observations}
          onDeleteObservation={handleDeleteObservation}
          onClearTable={handleClearTable}
          onLoadStandardDataset={handleLoadStandardDataset}
          bestObservation={bestAngleObservation}
        />

        {/* 7. DYNAMIC GRAPH & THEORETICAL CURVE */}
        <RangeAngleGraph
          observations={observations}
          currentVelocity={velocity}
        />

        {/* SAVE EXPERIMENT PROGRESS FOR STUDENTS */}
        <div className="flex justify-end pt-2 pb-2">
          <SaveAttemptButton
            experimentSlug="projectile-motion"
            experimentTitle="Projectile Motion — Range & Trajectory"
            inputs={{
              velocity: `${velocity} m/s`,
              angle: `${angle}°`,
              launchHeight: `${launchHeight} m (${launchHeight === 0 ? 'Ground level datum' : 'Elevated launch / 4th-floor assumed'})`,
              gravity: '9.81 m/s²',
            }}
            calculatedResults={{
              timeOfFlight: `${timeOfFlight.toFixed(2)} s`,
              horizontalRange: `${theoreticalRange.toFixed(2)} m`,
              maxHeight: `${maxHeight.toFixed(2)} m`,
            }}
            observations={observations}
          />
        </div>

        {/* 8. VIRTUAL APPARATUS */}
        <div id="apparatus-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Virtual Apparatus
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROJECTILE_APPARATUS.map((app) => (
              <div key={app.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                  <span className="font-bold text-slate-900 text-sm">{app.name}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans pl-4">{app.role}</p>
              </div>
            ))}
          </div>

          {/* Educational Simulation Note */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 font-sans leading-relaxed">
            <span className="font-bold text-slate-700">Note: </span>
            {PROJECTILE_APPARATUS_NOTE.replace(/^Note:\s*/i, '')}
          </div>
        </div>

        {/* 9. EXPERIMENTAL PROCEDURE */}
        <div id="procedure-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-5">
            <ListOrdered className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Virtual Laboratory Procedure (14 Steps)
            </h3>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
            {PROJECTILE_PROCEDURE.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/60 border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed font-sans">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* 10. PRECAUTIONS & SOURCES OF ERROR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Precautions */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-5">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Laboratory Precautions
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              {PROJECTILE_PRECAUTIONS.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-100">
                  <h4 className="font-bold text-emerald-950 font-sans text-xs sm:text-sm mb-1">
                    &bull; {item.title}
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Errors & Limitations */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-5">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Sources of Error &amp; Model Limitations
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              {PROJECTILE_COMMON_ERRORS.map((err, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-50/40 border border-amber-100">
                  <h4 className="font-bold text-amber-950 font-sans text-xs sm:text-sm mb-1">
                    &bull; {err.name}
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed font-sans mb-1">
                    <strong>Cause:</strong> {err.cause}
                  </p>
                  <p className="text-amber-900 text-xs leading-relaxed font-sans">
                    <strong>Mitigation:</strong> {err.prevention}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 11. WHAT DID YOU LEARN? (CORE TAKEAWAYS) */}
        <WhatDidYouLearn />

        {/* 12. FORMATIVE CONCEPT ASSESSMENT (QUIZ) */}
        <ProjectileQuiz />

        {/* 13. ORAL EXAM VIVA VOCE PRACTICE */}
        <ProjectileViva />

        {/* 14. STUDENT DOUBT & NOTEBOOK */}
        <ProjectileDoubt />

        {/* 15. FOOTER INTER-LABORATORY NAVIGATION */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                <span>Exp 01: Ohm's Law</span>
              </button>
            )}
            {pendulumExp && (
              <button
                onClick={() => onSelectExperiment(pendulumExp)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Exp 02: Simple Pendulum</span>
              </button>
            )}
            {hookesLawExp && (
              <button
                onClick={() => onSelectExperiment(hookesLawExp)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Exp 03: Hooke's Law</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
