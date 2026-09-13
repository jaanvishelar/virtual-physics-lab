import React, { useState } from 'react';
import { Experiment, ObservationReading } from '../../../types';
import { EXPERIMENTS } from '../../../data/experiments';
import {
  OHMS_LAW_INFO,
  OHMS_LAW_APPARATUS,
  OHMS_LAW_PROCEDURE,
  OHMS_LAW_PRECAUTIONS,
  OHMS_LAW_COMMON_ERRORS,
} from '../../../data/ohmsLawData';
import { OhmsLawCircuit } from './OhmsLawCircuit';
import { AnalogMeter } from './AnalogMeter';
import { ObservationTable } from './ObservationTable';
import { VIGraph } from './VIGraph';
import { QuizSection } from './QuizSection';
import { VivaSection } from './VivaSection';
import { DoubtSection } from './DoubtSection';
import { SaveAttemptButton } from '../../common/SaveAttemptButton';
import {
  ArrowLeft,
  Sliders,
  Zap,
  BookOpen,
  ListOrdered,
  Layers,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Calculator,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

interface OhmsLawLabProps {
  experiment: Experiment;
  onBack: () => void;
  onSelectExperiment: (exp: Experiment) => void;
}

export const OhmsLawLab: React.FC<OhmsLawLabProps> = ({
  experiment,
  onBack,
  onSelectExperiment,
}) => {
  // State for experimental parameters
  const [voltage, setVoltage] = useState<number>(2.0); // Default to Case 1
  const [resistance, setResistance] = useState<number>(10.0); // Default 10 Ω
  const [rheostatResistance, setRheostatResistance] = useState<number>(5.0);
  const [isSwitchOn, setIsSwitchOn] = useState<boolean>(true);

  // Observations logged by the student
  const [observations, setObservations] = useState<ObservationReading[]>([]);

  // Physics calculation: I = V / R
  // Prevent division by zero (minimum resistance clamped to 1.0 Ω)
  const safeResistance = Math.max(1.0, resistance);
  const current = isSwitchOn ? voltage / safeResistance : 0.0;

  // Add observation handler
  const handleAddObservation = () => {
    if (!isSwitchOn) return;

    const newReading: ObservationReading = {
      id: `obs-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      srNo: observations.length + 1,
      voltage: Number(voltage.toFixed(2)),
      current: Number((voltage / safeResistance).toFixed(4)),
      resistance: Number(safeResistance.toFixed(2)),
      timestamp: Date.now(),
    };

    setObservations((prev) => [...prev, newReading]);
  };

  const handleDeleteObservation = (id: string) => {
    setObservations((prev) => prev.filter((o) => o.id !== id));
  };

  const handleClearObservations = () => {
    setObservations([]);
  };

  const handleLoadPreset = (presetV: number, presetR: number) => {
    setVoltage(presetV);
    setResistance(presetR);
    setIsSwitchOn(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb Bar & Quick Lab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <button
            id="btn-back-to-catalogue"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Lab Catalogue</span>
          </button>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs font-mono">
            <span className="px-2 text-slate-400">Switch Lab:</span>
            {EXPERIMENTS.map((exp) => (
              <button
                key={exp.id}
                id={`switch-to-${exp.slug}`}
                onClick={() => onSelectExperiment(exp)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  exp.slug === 'ohms-law'
                    ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title={exp.title}
              >
                {exp.number}
              </button>
            ))}
          </div>
        </div>

        {/* 1. EXPERIMENT HEADER */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 mb-8 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
              EXPERIMENT 02
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {OHMS_LAW_INFO.targetLevel}
            </span>
            <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Fully Interactive Laboratory Bench
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {OHMS_LAW_INFO.title}
          </h1>

          {/* 2. AIM */}
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-1">
              Aim of the Experiment
            </div>
            <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
              "{OHMS_LAW_INFO.aim}"
            </p>
          </div>

          {/* 3. THEORY & 4. FORMULA BENTO CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
            
            {/* Theory Card (Span 8) */}
            <div className="md:col-span-8 p-5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs sm:text-sm text-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-indigo-700">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Underlying Theory</span>
              </div>
              <p className="leading-relaxed text-slate-800 font-normal">
                {OHMS_LAW_INFO.theory.statement}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="px-2.5 py-1 rounded bg-indigo-100/80 text-indigo-950 font-mono font-bold text-xs">
                  {OHMS_LAW_INFO.theory.proportionality}
                </span>
                <span className="font-mono text-xs text-slate-600">&rarr;</span>
                <span className="px-2.5 py-1 rounded bg-indigo-600 text-white font-mono font-bold text-xs shadow-2xs">
                  {OHMS_LAW_INFO.theory.equation}
                </span>
              </div>
            </div>

            {/* Formula Variables Spotlight (Span 4) */}
            <div className="md:col-span-4 p-5 rounded-xl bg-slate-900 text-white flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-bold mb-2">
                  Standard SI Formulations
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">V (Volts):</span>
                    <span className="font-bold text-indigo-300">V = I &times; R</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">I (Amperes):</span>
                    <span className="font-bold text-emerald-400">I = V / R</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">R (Ohms):</span>
                    <span className="font-bold text-amber-300">R = V / I</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-[10px] font-mono text-slate-400">
                Slope (V vs I) = Resistance R (Ω)
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================
            MAIN TWO-COLUMN LABORATORY WORKSPACE (Desktop: 2 Columns)
            LEFT: Virtual apparatus / Simulation
            RIGHT: Controls + Live Readings
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-start">
          
          {/* LEFT: 7. VIRTUAL APPARATUS / SIMULATION (Span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <OhmsLawCircuit
              voltage={voltage}
              resistance={safeResistance}
              current={current}
              isSwitchOn={isSwitchOn}
              onToggleSwitch={() => setIsSwitchOn((prev) => !prev)}
              rheostatResistance={rheostatResistance}
            />

            {/* LIVE DUAL ANALOG INSTRUMENTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnalogMeter
                id="meter-ammeter"
                type="ammeter"
                value={current}
                max={2.5}
                unit="A"
                label="Series Ammeter (I)"
                isActive={isSwitchOn}
              />
              <AnalogMeter
                id="meter-voltmeter"
                type="voltmeter"
                value={isSwitchOn ? voltage : 0}
                max={15.0}
                unit="V"
                label="Parallel Voltmeter (V)"
                isActive={isSwitchOn}
              />
            </div>
          </div>

          {/* RIGHT: 8. CONTROLS + 9. LIVE READINGS (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Experiment Controls Card */}
            <div id="controls-panel" className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Experiment Controls
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Real-time Adjustment
                </span>
              </div>

              {/* 1. Circuit Master Switch Toggle */}
              <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Circuit Key (Switch)
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {isSwitchOn ? 'Closed (Key inserted & conducting)' : 'Open (Key unplugged, 0 A current)'}
                  </div>
                </div>

                <button
                  id="btn-toggle-switch-panel"
                  onClick={() => setIsSwitchOn((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    isSwitchOn
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-2xs'
                      : 'bg-slate-300 text-slate-700 hover:bg-slate-400'
                  }`}
                >
                  {isSwitchOn ? (
                    <>
                      <ToggleRight className="w-4 h-4" />
                      <span>ON</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4" />
                      <span>OFF</span>
                    </>
                  )}
                </button>
              </div>

              {/* 2. Potential Difference (Voltage) Slider */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                    Potential Difference V
                  </label>
                  <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                    {voltage.toFixed(1)} V
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="12.0"
                  step="0.5"
                  value={voltage}
                  onChange={(e) => setVoltage(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                  aria-label="Adjust potential difference in volts"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>0.5 V</span>
                  <span>6.0 V</span>
                  <span>12.0 V</span>
                </div>

                {/* Quick Voltage Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {[2.0, 4.0, 6.0, 8.0, 10.0].map((vVal) => (
                    <button
                      key={vVal}
                      onClick={() => setVoltage(vVal)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors ${
                        voltage === vVal
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {vVal} V
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Resistance Slider */}
              <div className="mb-5 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                    Test Conductor Resistance R
                  </label>
                  <span className="text-sm font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    {resistance.toFixed(1)} Ω
                  </span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="50.0"
                  step="1.0"
                  value={resistance}
                  onChange={(e) => setResistance(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
                  aria-label="Adjust resistance in ohms"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>2.0 Ω</span>
                  <span>25.0 Ω</span>
                  <span>50.0 Ω</span>
                </div>

                {/* Quick Resistance Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {[5.0, 10.0, 15.0, 20.0, 25.0].map((rVal) => (
                    <button
                      key={rVal}
                      onClick={() => setResistance(rVal)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors ${
                        resistance === rVal
                          ? 'bg-amber-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {rVal} Ω
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Rheostat Fine Slider */}
              <div className="mb-2 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-mono font-semibold text-slate-600 uppercase">
                    Rheostat Resistance (Fine Tuning)
                  </label>
                  <span className="text-xs font-mono text-slate-500">
                    {rheostatResistance.toFixed(0)} Ω
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={rheostatResistance}
                  onChange={(e) => setRheostatResistance(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600 focus:outline-none"
                  aria-label="Adjust rheostat in ohms"
                />
              </div>

            </div>

            {/* 9. LIVE READINGS DASHBOARD CARD */}
            <div id="live-readings-card" className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-mono font-bold tracking-wider uppercase text-slate-200">
                    Live Circuit Readings
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Idealized Physics Engine
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {/* Potential Difference */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400">Potential Difference:</span>
                  <span className="text-base font-bold text-indigo-300">
                    {isSwitchOn ? voltage.toFixed(2) : '0.00'}{' '}
                    <span className="text-xs text-slate-400 font-normal">V</span>
                  </span>
                </div>

                {/* Conductor Resistance */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400">Selected Resistance:</span>
                  <span className="text-base font-bold text-amber-300">
                    {safeResistance.toFixed(2)}{' '}
                    <span className="text-xs text-slate-400 font-normal">Ω</span>
                  </span>
                </div>

                {/* Electric Current */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400">Electric Current (I = V/R):</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {isSwitchOn ? current.toFixed(3) : '0.000'}{' '}
                    <span className="text-xs text-slate-400 font-normal">A</span>
                  </span>
                </div>
              </div>

              {/* Action: Log to table */}
              <div className="mt-5">
                <button
                  onClick={handleAddObservation}
                  disabled={!isSwitchOn}
                  className={`w-full py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isSwitchOn
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  <span>
                    {isSwitchOn
                      ? `Log Reading (${voltage.toFixed(1)}V, ${current.toFixed(3)}A) to Table`
                      : 'Turn Switch ON to Log Reading'}
                  </span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================
            BELOW WORKSPACE: OBSERVATION TABLE, GRAPH & RESULT
            ======================================================== */}
        <div className="space-y-10 mb-16">
          
          {/* 10. OBSERVATION TABLE */}
          <ObservationTable
            observations={observations}
            onAddObservation={handleAddObservation}
            onDeleteObservation={handleDeleteObservation}
            onClearObservations={handleClearObservations}
            isSwitchOn={isSwitchOn}
            currentVoltage={voltage}
            currentResistance={safeResistance}
            currentCurrent={current}
            onLoadPreset={handleLoadPreset}
          />

          {/* 11. GRAPH & ANALYSIS & 12. RESULT */}
          <VIGraph
            observations={observations}
            theoreticalResistance={safeResistance}
          />

          {/* SAVE EXPERIMENT PROGRESS FOR STUDENTS */}
          <div className="flex justify-end pt-2 pb-2">
            <SaveAttemptButton
              experimentSlug="ohms-law"
              experimentTitle="Verification of Ohm's Law (V = IR)"
              inputs={{
                voltage: `${voltage.toFixed(2)} V`,
                fixedResistance: `${safeResistance.toFixed(2)} Ω`,
                rheostatResistance: `${rheostatResistance.toFixed(2)} Ω`,
                circuitSwitch: isSwitchOn ? 'CLOSED (Active)' : 'OPEN (Isolated)',
              }}
              calculatedResults={{
                circuitCurrent: `${current.toFixed(4)} A`,
                calculatedResistance: `${(voltage / (current || 0.0001)).toFixed(2)} Ω`,
              }}
              observations={observations}
            />
          </div>

        </div>

        {/* ========================================================
            PEDAGOGICAL DOCUMENTATION (Apparatus, Procedure, Precautions, Errors)
            ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          
          {/* 5. APPARATUS (Span 6) */}
          <div className="md:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Experimental Apparatus &amp; Specifications
              </h3>
            </div>

            <div className="space-y-3">
              {OHMS_LAW_APPARATUS.map((app) => (
                <div key={app.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm font-sans">
                      {app.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-semibold">
                      {app.connectionType}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-sans mb-1.5">
                    {app.role}
                  </p>
                  <div className="text-[11px] font-mono text-indigo-700 bg-indigo-50/70 px-2 py-1 rounded inline-block">
                    Spec: {app.spec}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. PROCEDURE (Span 6) */}
          <div className="md:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-5">
              <ListOrdered className="w-4 h-4 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Standard Experimental Procedure
              </h3>
            </div>

            <ol className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-sans">
              {OHMS_LAW_PROCEDURE.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50/80 border border-slate-200/60">
                  <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

        </div>

        {/* 13. PRECAUTIONS & 14. COMMON ERRORS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          
          {/* Precautions (Span 6) */}
          <div className="md:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Laboratory Precautions
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              {OHMS_LAW_PRECAUTIONS.map((item, idx) => (
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

          {/* Common Errors (Span 6) */}
          <div className="md:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Common Experimental Errors &amp; Sources of Deviation
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              {OHMS_LAW_COMMON_ERRORS.map((err, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-50/40 border border-amber-100">
                  <h4 className="font-bold text-amber-950 font-sans text-xs sm:text-sm mb-1">
                    {idx + 1}. {err.name}
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed font-sans mb-1">
                    <strong className="text-slate-700">Cause:</strong> {err.cause}
                  </p>
                  <p className="text-xs text-indigo-900 font-mono bg-white/70 p-1.5 rounded border border-amber-200/50">
                    Fix: {err.prevention}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================
            ASSESSMENT & SUPPORT (Quiz, Viva, Doubt)
            ======================================================== */}
        <div className="space-y-10">
          {/* 15. QUIZ */}
          <QuizSection />

          {/* 16. VIVA QUESTIONS */}
          <VivaSection />

          {/* 17. ASK A DOUBT */}
          <DoubtSection />

          {/* Footer Navigation */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Laboratory Portal</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              {EXPERIMENTS.find((e) => e.slug === 'simple-pendulum') && (
                <button
                  onClick={() => {
                    const pExp = EXPERIMENTS.find((e) => e.slug === 'simple-pendulum');
                    if (pExp) onSelectExperiment(pExp);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>Exp 02: Simple Pendulum</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              {EXPERIMENTS.find((e) => e.slug === 'hookes-law') && (
                <button
                  onClick={() => {
                    const hExp = EXPERIMENTS.find((e) => e.slug === 'hookes-law');
                    if (hExp) onSelectExperiment(hExp);
                  }}
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
    </div>
  );
};
