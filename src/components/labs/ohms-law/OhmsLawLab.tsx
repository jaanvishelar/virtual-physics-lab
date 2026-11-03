import React, { useState } from 'react';
import { Experiment, ObservationReading, OhmsLawMode } from '../../../types';
import { EXPERIMENTS } from '../../../data/experiments';
import {
  OHMS_LAW_INFO,
  OHMS_LAW_APPARATUS,
  OHMS_LAW_PROCEDURE,
  OHMS_LAW_PRECAUTIONS,
  OHMS_LAW_COMMON_ERRORS,
  OHMS_LAW_MODES,
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
  Compass,
  Gauge,
  Activity,
  CheckCircle2,
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
  // Active experiment mode: Mode 1, Mode 2, or Mode 3
  const [activeMode, setActiveMode] = useState<OhmsLawMode>('find-current');

  // Independent inputs state
  // Mode 1 (Find Current): student adjusts voltage and resistance
  const [m1Voltage, setM1Voltage] = useState<number>(4.0);
  const [m1Resistance, setM1Resistance] = useState<number>(10.0);

  // Mode 2 (Find Resistance): student adjusts voltage and current independently
  const [m2Voltage, setM2Voltage] = useState<number>(4.0);
  const [m2Current, setM2Current] = useState<number>(0.40);

  // Mode 3 (Find Voltage): student adjusts current and resistance
  const [m3Current, setM3Current] = useState<number>(0.50);
  const [m3Resistance, setM3Resistance] = useState<number>(10.0);

  // Rheostat fine adjustment (used across all modes)
  const [rheostatResistance, setRheostatResistance] = useState<number>(5.0);

  // Master circuit switch (Key)
  const [isSwitchOn, setIsSwitchOn] = useState<boolean>(true);

  // Separate observation logs for each mode so observations never mix
  const [observationsByMode, setObservationsByMode] = useState<Record<OhmsLawMode, ObservationReading[]>>({
    'find-current': [],
    'find-resistance': [],
    'find-voltage': [],
  });

  // Mode configurations
  const activeConfig = OHMS_LAW_MODES[activeMode];

  // Derive live physical quantities according to active mode
  let liveVoltage = 0;
  let liveCurrent = 0;
  let liveResistance = 0;

  if (activeMode === 'find-current') {
    // Mode 1: I = V / R
    liveVoltage = m1Voltage;
    liveResistance = Math.max(1.0, m1Resistance);
    liveCurrent = isSwitchOn ? liveVoltage / liveResistance : 0.0;
  } else if (activeMode === 'find-resistance') {
    // Mode 2: R = V / I
    liveVoltage = m2Voltage;
    liveCurrent = isSwitchOn ? m2Current : 0.0;
    const safeCurrent = Math.max(0.01, m2Current);
    liveResistance = liveVoltage / safeCurrent;
  } else {
    // Mode 3: V = I * R
    liveCurrent = isSwitchOn ? m3Current : 0.0;
    liveResistance = Math.max(1.0, m3Resistance);
    liveVoltage = m3Current * liveResistance;
  }

  // Active observations
  const currentObservations = observationsByMode[activeMode];

  // Mode count summary
  const modeCounts: Record<OhmsLawMode, number> = {
    'find-current': observationsByMode['find-current'].length,
    'find-resistance': observationsByMode['find-resistance'].length,
    'find-voltage': observationsByMode['find-voltage'].length,
  };

  // Add observation handler
  const handleAddObservation = () => {
    if (!isSwitchOn) return;

    // Actual recorded physical values
    const recordedVoltage = Number(liveVoltage.toFixed(2));
    const recordedCurrent = Number(
      (activeMode === 'find-current'
        ? liveVoltage / liveResistance
        : activeMode === 'find-resistance'
        ? m2Current
        : m3Current
      ).toFixed(3)
    );
    const recordedResistance = Number(
      (activeMode === 'find-resistance'
        ? liveVoltage / Math.max(0.01, m2Current)
        : liveResistance
      ).toFixed(2)
    );

    const newReading: ObservationReading = {
      id: `obs-${activeMode}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      srNo: currentObservations.length + 1,
      voltage: recordedVoltage,
      current: recordedCurrent,
      resistance: recordedResistance,
      mode: activeMode,
      timestamp: Date.now(),
    };

    setObservationsByMode((prev) => ({
      ...prev,
      [activeMode]: [...prev[activeMode], newReading],
    }));
  };

  // Delete individual observation
  const handleDeleteObservation = (id: string) => {
    setObservationsByMode((prev) => ({
      ...prev,
      [activeMode]: prev[activeMode].filter((o) => o.id !== id),
    }));
  };

  // Clear observations for selected mode
  const handleClearObservations = (modeToClear: OhmsLawMode) => {
    setObservationsByMode((prev) => ({
      ...prev,
      [modeToClear]: [],
    }));
  };

  // Load preset handler for current mode
  const handleLoadPreset = (presetV: number, presetI: number, presetR: number) => {
    if (activeMode === 'find-current') {
      setM1Voltage(presetV);
      setM1Resistance(presetR);
    } else if (activeMode === 'find-resistance') {
      setM2Voltage(presetV);
      setM2Current(presetI);
    } else if (activeMode === 'find-voltage') {
      setM3Current(presetI);
      setM3Resistance(presetR);
    }
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
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none cursor-pointer"
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
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
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
              EXPERIMENT 01
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {OHMS_LAW_INFO.targetLevel} (Classes 8–12)
            </span>
            <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Multi-Mode Interactive Laboratory Bench
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
              "{activeConfig.objective}"
            </p>
          </div>

          {/* 3. THREE DISTINCT EXPERIMENT MODES SELECTOR */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                Select Laboratory Investigation Mode:
              </span>
              <span className="text-[11px] font-mono text-indigo-600 font-semibold">
                3 Interactive Modes Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(['find-current', 'find-resistance', 'find-voltage'] as OhmsLawMode[]).map((modeKey) => {
                const cfg = OHMS_LAW_MODES[modeKey];
                const isSelected = activeMode === modeKey;
                const readingCount = observationsByMode[modeKey].length;

                return (
                  <button
                    key={modeKey}
                    id={`mode-select-${modeKey}`}
                    onClick={() => setActiveMode(modeKey)}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {cfg.tag}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {readingCount} {readingCount === 1 ? 'Reading' : 'Readings'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        {cfg.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {cfg.formulaNote}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Slope:</span>
                      <span className={`font-semibold ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                        {cfg.slopeLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. ACTIVE MODE THEORY & FORMULA SPOTLIGHT */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6">
            
            {/* Active Mode Theory (Span 8) */}
            <div className="md:col-span-8 p-5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs sm:text-sm text-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-indigo-700">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Theory for {activeConfig.shortName}</span>
              </div>
              <p className="leading-relaxed text-slate-800 font-normal">
                {activeConfig.theorySummary}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="px-2.5 py-1 rounded bg-indigo-100/90 text-indigo-950 font-mono font-bold text-xs">
                  Inputs: {activeConfig.independentVariables}
                </span>
                <span className="font-mono text-xs text-slate-600">&rarr;</span>
                <span className="px-2.5 py-1 rounded bg-indigo-600 text-white font-mono font-bold text-xs shadow-2xs">
                  Output: {activeConfig.dependentVariable}
                </span>
              </div>
            </div>

            {/* Formula Variables Spotlight (Span 4) */}
            <div className="md:col-span-4 p-5 rounded-xl bg-slate-900 text-white flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-bold mb-2">
                  Active Mathematical Formulation
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center my-2">
                  <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">
                    {activeConfig.formula}
                  </span>
                </div>
                <div className="space-y-1 font-mono text-[11px] text-slate-300">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">X-Axis:</span>
                    <span>{activeConfig.xAxisLabel} ({activeConfig.xAxisUnit})</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Y-Axis:</span>
                    <span>{activeConfig.yAxisLabel} ({activeConfig.yAxisUnit})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Physical Slope:</span>
                    <span className="text-amber-300 font-bold">{activeConfig.slopeLabel}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-[10px] font-mono text-slate-400">
                Units: Volt (V), Ampere (A), Ohm (Ω)
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================
            MAIN TWO-COLUMN LABORATORY BENCH
            LEFT: Virtual Circuit Schematic & Apparatus
            RIGHT: Controls + Live Readings
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-start">
          
          {/* LEFT: VIRTUAL APPARATUS & CIRCUIT (Span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <OhmsLawCircuit
              voltage={liveVoltage}
              resistance={liveResistance}
              current={liveCurrent}
              isSwitchOn={isSwitchOn}
              onToggleSwitch={() => setIsSwitchOn((prev) => !prev)}
              rheostatResistance={rheostatResistance}
              mode={activeMode}
            />

            {/* LIVE DUAL ANALOG INSTRUMENTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnalogMeter
                id="meter-ammeter"
                type="ammeter"
                value={liveCurrent}
                max={2.5}
                unit="A"
                label="Series Ammeter (I)"
                isActive={isSwitchOn}
              />
              <AnalogMeter
                id="meter-voltmeter"
                type="voltmeter"
                value={isSwitchOn ? liveVoltage : 0}
                max={15.0}
                unit="V"
                label="Parallel Voltmeter (V)"
                isActive={isSwitchOn}
              />
            </div>
          </div>

          {/* RIGHT: EXPERIMENT CONTROLS + LIVE READINGS (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Experiment Controls Card */}
            <div id="controls-panel" className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    {activeConfig.shortName} Controls
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                  {activeConfig.tag}
                </span>
              </div>

              {/* 1. Circuit Key (Switch) Toggle */}
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
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

              {/* 2. MODE-SPECIFIC SLIDERS */}
              {/* MODE 1: Student adjusts Voltage V and Resistance R */}
              {activeMode === 'find-current' && (
                <>
                  {/* Voltage Slider */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                        Potential Difference V
                      </label>
                      <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                        {m1Voltage.toFixed(1)} V
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="12.0"
                      step="0.5"
                      value={m1Voltage}
                      onChange={(e) => setM1Voltage(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                      aria-label="Adjust potential difference in volts"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                      <span>0.5 V</span>
                      <span>6.0 V</span>
                      <span>12.0 V</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {[2.0, 4.0, 6.0, 8.0, 10.0].map((vVal) => (
                        <button
                          key={vVal}
                          onClick={() => setM1Voltage(vVal)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                            m1Voltage === vVal
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {vVal} V
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resistance Slider */}
                  <div className="mb-5 pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                        Conductor Resistance R
                      </label>
                      <span className="text-sm font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                        {m1Resistance.toFixed(1)} Ω
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2.0"
                      max="50.0"
                      step="1.0"
                      value={m1Resistance}
                      onChange={(e) => setM1Resistance(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
                      aria-label="Adjust resistance in ohms"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                      <span>2.0 Ω</span>
                      <span>25.0 Ω</span>
                      <span>50.0 Ω</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {[5.0, 10.0, 15.0, 20.0, 25.0].map((rVal) => (
                        <button
                          key={rVal}
                          onClick={() => setM1Resistance(rVal)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                            m1Resistance === rVal
                              ? 'bg-amber-600 text-white font-bold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {rVal} Ω
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* MODE 2: Student adjusts Voltage V and Current I independently */}
              {activeMode === 'find-resistance' && (
                <>
                  {/* Voltage Slider */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                        Potential Difference V
                      </label>
                      <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                        {m2Voltage.toFixed(1)} V
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="12.0"
                      step="0.5"
                      value={m2Voltage}
                      onChange={(e) => setM2Voltage(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                      aria-label="Adjust potential difference in volts"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                      <span>0.5 V</span>
                      <span>6.0 V</span>
                      <span>12.0 V</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {[1.0, 2.0, 3.0, 4.0, 5.0, 6.0].map((vVal) => (
                        <button
                          key={vVal}
                          onClick={() => setM2Voltage(vVal)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                            m2Voltage === vVal
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {vVal} V
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Current Slider */}
                  <div className="mb-5 pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                        Electric Current I
                      </label>
                      <span className="text-sm font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        {m2Current.toFixed(2)} A
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="2.00"
                      step="0.05"
                      value={m2Current}
                      onChange={(e) => setM2Current(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
                      aria-label="Adjust current in amperes"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                      <span>0.05 A</span>
                      <span>1.00 A</span>
                      <span>2.00 A</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {[0.10, 0.20, 0.30, 0.40, 0.50].map((iVal) => (
                        <button
                          key={iVal}
                          onClick={() => setM2Current(iVal)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                            m2Current === iVal
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {iVal.toFixed(2)} A
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* MODE 3: Student adjusts Current I and Resistance R */}
              {activeMode === 'find-voltage' && (
                <>
                  {/* Current Slider */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                        Electric Current I
                      </label>
                      <span className="text-sm font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        {m3Current.toFixed(2)} A
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="2.00"
                      step="0.05"
                      value={m3Current}
                      onChange={(e) => setM3Current(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
                      aria-label="Adjust current in amperes"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                      <span>0.05 A</span>
                      <span>1.00 A</span>
                      <span>2.00 A</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {[0.25, 0.50, 0.75, 1.00, 1.25].map((iVal) => (
                        <button
                          key={iVal}
                          onClick={() => setM3Current(iVal)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                            m3Current === iVal
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {iVal.toFixed(2)} A
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resistance Slider */}
                  <div className="mb-5 pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                        Conductor Resistance R
                      </label>
                      <span className="text-sm font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                        {m3Resistance.toFixed(1)} Ω
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2.0"
                      max="40.0"
                      step="1.0"
                      value={m3Resistance}
                      onChange={(e) => setM3Resistance(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
                      aria-label="Adjust resistance in ohms"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                      <span>2.0 Ω</span>
                      <span>20.0 Ω</span>
                      <span>40.0 Ω</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {[4.0, 8.0, 12.0, 16.0, 20.0].map((rVal) => (
                        <button
                          key={rVal}
                          onClick={() => setM3Resistance(rVal)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                            m3Resistance === rVal
                              ? 'bg-amber-600 text-white font-bold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {rVal} Ω
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Rheostat Fine Adjustment */}
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

            {/* LIVE READINGS DASHBOARD CARD */}
            <div id="live-readings-card" className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-mono font-bold tracking-wider uppercase text-slate-200">
                    Live Circuit Readings
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold">
                  Mode: {activeConfig.shortName}
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {/* Potential Difference */}
                <div
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    activeMode === 'find-voltage'
                      ? 'bg-indigo-950/70 border-indigo-500/50 ring-1 ring-indigo-500/30'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <span className="text-slate-400">
                    Potential Difference {activeMode === 'find-voltage' ? '(V = I × R):' : '(V):'}
                  </span>
                  <span className="text-base font-bold text-indigo-300">
                    {isSwitchOn ? liveVoltage.toFixed(2) : '0.00'}{' '}
                    <span className="text-xs text-slate-400 font-normal">V</span>
                  </span>
                </div>

                {/* Electric Current */}
                <div
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    activeMode === 'find-current'
                      ? 'bg-emerald-950/70 border-emerald-500/50 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <span className="text-slate-400">
                    Electric Current {activeMode === 'find-current' ? '(I = V / R):' : '(I):'}
                  </span>
                  <span className="text-lg font-bold text-emerald-400">
                    {isSwitchOn ? liveCurrent.toFixed(3) : '0.000'}{' '}
                    <span className="text-xs text-slate-400 font-normal">A</span>
                  </span>
                </div>

                {/* Resistance */}
                <div
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    activeMode === 'find-resistance'
                      ? 'bg-amber-950/70 border-amber-500/50 ring-1 ring-amber-500/30'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <span className="text-slate-400">
                    Conductor Resistance {activeMode === 'find-resistance' ? '(R = V / I):' : '(R):'}
                  </span>
                  <span className="text-base font-bold text-amber-300">
                    {liveResistance.toFixed(2)}{' '}
                    <span className="text-xs text-slate-400 font-normal">Ω</span>
                  </span>
                </div>
              </div>

              {/* Action: Log to table */}
              <div className="mt-5">
                <button
                  id="btn-log-reading"
                  onClick={handleAddObservation}
                  disabled={!isSwitchOn}
                  className={`w-full py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSwitchOn
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:bg-indigo-700'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  <span>
                    {isSwitchOn
                      ? `Record Reading (${liveVoltage.toFixed(1)}V, ${liveCurrent.toFixed(3)}A, ${liveResistance.toFixed(1)}Ω) to ${activeConfig.shortName}`
                      : 'Turn Switch ON to Record Observation'}
                  </span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================
            BELOW WORKSPACE: OBSERVATION TABLE, GRAPH & SAVE RECORD
            ======================================================== */}
        <div className="space-y-10 mb-16">
          
          {/* OBSERVATION TABLE */}
          <ObservationTable
            observations={currentObservations}
            mode={activeMode}
            onSelectMode={(m) => setActiveMode(m)}
            onAddObservation={handleAddObservation}
            onDeleteObservation={handleDeleteObservation}
            onClearObservations={handleClearObservations}
            isSwitchOn={isSwitchOn}
            currentVoltage={liveVoltage}
            currentResistance={liveResistance}
            currentCurrent={liveCurrent}
            onLoadPreset={handleLoadPreset}
            modeCounts={modeCounts}
          />

          {/* GRAPH & MATHEMATICAL ANALYSIS */}
          <VIGraph
            observations={currentObservations}
            mode={activeMode}
            theoreticalResistance={liveResistance}
            theoreticalCurrent={liveCurrent}
            theoreticalVoltage={liveVoltage}
          />

          {/* SAVE EXPERIMENT PROGRESS FOR STUDENTS */}
          <div className="flex justify-end pt-2 pb-2">
            <SaveAttemptButton
              experimentSlug="ohms-law"
              experimentTitle={`Ohm's Law Lab - ${activeConfig.name}`}
              inputs={{
                mode: activeMode,
                voltage: `${liveVoltage.toFixed(2)} V`,
                current: `${liveCurrent.toFixed(3)} A`,
                resistance: `${liveResistance.toFixed(2)} Ω`,
                rheostatResistance: `${rheostatResistance.toFixed(2)} Ω`,
                circuitSwitch: isSwitchOn ? 'CLOSED (Active)' : 'OPEN (Isolated)',
              }}
              calculatedResults={{
                modeFormula: activeConfig.formula,
                liveVoltage: `${liveVoltage.toFixed(2)} V`,
                liveCurrent: `${liveCurrent.toFixed(3)} A`,
                liveResistance: `${liveResistance.toFixed(2)} Ω`,
              }}
              observations={currentObservations}
            />
          </div>

        </div>

        {/* ========================================================
            PEDAGOGICAL DOCUMENTATION (Apparatus, Procedure, Precautions, Errors)
            ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          
          {/* APPARATUS (Span 6) */}
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

          {/* PROCEDURE (Span 6) */}
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

        {/* PRECAUTIONS & COMMON ERRORS */}
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
          {/* QUIZ */}
          <QuizSection />

          {/* VIVA QUESTIONS */}
          <VivaSection />

          {/* ASK A DOUBT */}
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
