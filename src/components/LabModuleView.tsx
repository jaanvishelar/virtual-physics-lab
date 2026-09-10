import React, { useState } from 'react';
import { Experiment } from '../types';
import { EXPERIMENTS } from '../data/experiments';
import { 
  ArrowLeft, Construction, Beaker, BookOpen, Calculator, LineChart, 
  HelpCircle, ShieldCheck, CheckCircle2, AlertTriangle, Play, HelpCircle as QuestionMark,
  Layers, ChevronRight, ChevronDown
} from 'lucide-react';

interface LabModuleViewProps {
  experiment: Experiment;
  onBack: () => void;
  onSelectExperiment: (exp: Experiment) => void;
  onOpenDoubtModal: (expTitle: string) => void;
}

export const LabModuleView: React.FC<LabModuleViewProps> = ({
  experiment,
  onBack,
  onSelectExperiment,
  onOpenDoubtModal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'simulation' | 'observations' | 'viva'>('overview');
  const [expandedVivaIndex, setExpandedVivaIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <button
            id="btn-back-to-catalogue"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Lab Catalogue</span>
          </button>

          {/* Quick experiment switcher */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-mono">
            <span className="px-2 text-slate-400">Switch Lab:</span>
            {EXPERIMENTS.map((exp) => (
              <button
                key={exp.id}
                id={`switch-to-${exp.slug}`}
                onClick={() => onSelectExperiment(exp)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  exp.id === experiment.id
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title={exp.title}
              >
                {exp.number}
              </button>
            ))}
          </div>
        </div>

        {/* Development Notification Banner */}
        <div 
          id="module-development-banner"
          className="mb-8 rounded-2xl bg-amber-50 border border-amber-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
              <Construction className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-amber-950 font-sans">
                  Virtual laboratory module under development.
                </h2>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-200/60 text-amber-900 rounded font-bold">
                  Curriculum Module
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900/80 mt-1 leading-relaxed">
                Explore interactive physics experiments designed for Classes 9–12. Review the apparatus checklist, theory, formula, and structured observation schema below.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-mono text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-lg border border-amber-200/70">
              Target: {experiment.classes}
            </span>
          </div>
        </div>

        {/* Experiment Title Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 mb-8 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              EXPERIMENT {experiment.number}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {experiment.classes}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {experiment.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {experiment.title}
          </h1>
          <p className="text-slate-600 mt-2 text-base leading-relaxed">
            {experiment.description}
          </p>

          {/* Key Formula Spotlight */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Governing Physical Relationship
              </div>
              <div className="text-lg font-mono font-bold text-indigo-300 mt-0.5">
                {experiment.formula}
              </div>
            </div>
            <div className="text-xs text-slate-300 sm:text-right max-w-md font-sans">
              {experiment.formulaMeaning}
            </div>
          </div>
        </div>

        {/* Tab Navigation for Module Sections */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto text-sm font-semibold">
          {[
            { id: 'overview', label: '1. Aim, Theory & Apparatus' },
            { id: 'simulation', label: '2. Interactive Simulation Wireframe' },
            { id: 'observations', label: '3. Observation Table & Graph' },
            { id: 'viva', label: '4. Precautions, Viva & Doubts' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`tab-module-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content 1: Aim, Theory, Variables & Apparatus */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in-50 duration-150">
            {/* Aim & Variables Bento */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold font-mono text-indigo-700 uppercase tracking-wider mb-3">
                  <BookOpen className="w-4 h-4" />
                  <span>Aim of the Experiment</span>
                </div>
                <p className="text-slate-800 text-base leading-relaxed font-medium">
                  {experiment.aim}
                </p>
              </div>

              <div className="md:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold font-mono text-indigo-700 uppercase tracking-wider mb-3">
                  <Calculator className="w-4 h-4" />
                  <span>Experimental Variables</span>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-900 font-mono shrink-0">Independent:</span>
                    <span className="text-slate-600">{experiment.variables.independent}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-900 font-mono shrink-0">Dependent:</span>
                    <span className="text-slate-600">{experiment.variables.dependent}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-900 font-mono shrink-0">Controlled:</span>
                    <span className="text-slate-600">{experiment.variables.controlled}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Apparatus Checklist */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-bold font-mono text-slate-700 uppercase tracking-wider">
                  <Beaker className="w-4 h-4 text-indigo-600" />
                  <span>Required Laboratory Apparatus</span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {experiment.apparatus.length} Verified Components
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {experiment.apparatus.map((appItem, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{appItem}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Procedure Workflow Outline */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Laboratory Procedure Steps
              </h3>
              <ol className="space-y-3 text-sm text-slate-700 list-decimal list-inside leading-relaxed">
                <li>Inspect all apparatus items and verify clean connections and baseline zero readings.</li>
                <li>Assemble the setup according to standard circuit or bench diagrams, ensuring all connections are rigid and clean.</li>
                <li>Set initial values for controlled variables and establish equilibrium or resting points.</li>
                <li>Vary the independent variable in uniform increments across the designated working range.</li>
                <li>Record at least 4 to 6 independent observation trials in the standardized observation table.</li>
                <li>Plot the relevant dependent vs independent variable graph and calculate the gradient to determine experimental constants.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab Content 2: Interactive Simulation Wireframe */}
        {activeTab === 'simulation' && (
          <div className="space-y-6 animate-in fade-in-50 duration-150">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Interactive Apparatus Canvas (Wireframe Preview)
                  </h3>
                  <p className="text-sm text-slate-500">
                    Module: /labs/{experiment.slug} &bull; WebGL / HTML5 Canvas Architecture
                  </p>
                </div>
                <span className="text-xs font-mono px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-semibold border border-amber-200">
                  Simulation In Development
                </span>
              </div>

              {/* Wireframe Canvas Placeholder */}
              <div className="w-full h-80 bg-slate-950 rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden lab-grid-bg">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center mb-4 text-indigo-400">
                  <Play className="w-8 h-8 ml-1 text-indigo-400 opacity-60" />
                </div>
                
                <h4 className="text-lg font-bold text-white mb-1">
                  {experiment.title} Simulation Workspace
                </h4>
                
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-5 leading-relaxed font-sans">
                  Explore interactive physics experiments designed for Classes 9–12. Interactive canvas controls are being configured for this experiment module.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-300">
                  <span className="px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700">
                    Physics Engine: Mathematical Modeling
                  </span>
                  <span className="px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700">
                    Sample Rate: 60 fps
                  </span>
                  <span className="px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700">
                    Standard Physics Calculations
                  </span>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500 flex items-center justify-between">
                <span>Standard Controls: Reset Apparatus, Adjust Variables, Record Trial</span>
                <span className="font-mono text-indigo-600">Interactive Physics Simulation</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: Observation Table & Graph */}
        {activeTab === 'observations' && (
          <div className="space-y-6 animate-in fade-in-50 duration-150">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Standard Observation Table
                  </h3>
                  <p className="text-sm text-slate-500">
                    Representative experimental data format for student records.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                  Format: Tabular Lab Record
                </span>
              </div>

              {/* Table Component */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 font-mono text-slate-700 font-semibold">
                    <tr>
                      {experiment.observationHeaders.map((header, idx) => (
                        <th key={idx} className="px-4 py-3 whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                    {experiment.sampleObservations.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-slate-50/80 transition-colors">
                        {experiment.observationHeaders.map((header, colIdx) => (
                          <td key={colIdx} className="px-4 py-3 whitespace-nowrap">
                            {row[header] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-slate-500 mt-3 font-mono">
                * Note: Sample trials shown above demonstrate mathematical alignment with theoretical relationships.
              </p>
            </div>

            {/* Graph Preview Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-indigo-700 uppercase tracking-wider mb-2">
                <LineChart className="w-4 h-4" />
                <span>Analytical Graph Representation</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                {experiment.graphType}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                In the full module, the platform automatically draws scale axes, plots student-entered coordinates, fits the linear regression or curve, and outputs the calculated slope value directly into the result section.
              </p>
            </div>
          </div>
        )}

        {/* Tab Content 4: Precautions, Viva & Doubts */}
        {activeTab === 'viva' && (
          <div className="space-y-6 animate-in fade-in-50 duration-150">
            {/* Precautions */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-amber-700 uppercase tracking-wider mb-4">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Laboratory Precautions &amp; Minimizing Errors</span>
              </div>
              <ul className="space-y-3">
                {experiment.precautions.map((precaution, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{precaution}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Viva Questions */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-bold font-mono text-indigo-700 uppercase tracking-wider">
                  <QuestionMark className="w-4 h-4" />
                  <span>Sample Viva Voce Practice</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {experiment.vivaQuestions.length} Questions
                </span>
              </div>

              <div className="space-y-3">
                {experiment.vivaQuestions.map((viva, idx) => {
                  const isOpen = expandedVivaIndex === idx;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedVivaIndex(isOpen ? null : idx)}
                        className="w-full text-left p-4 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between gap-3 text-sm font-semibold text-slate-900 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-indigo-600 font-mono">Q{idx + 1}:</span>
                          {viva.q}
                        </span>
                        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
                          <span className="font-semibold text-emerald-700 font-mono block mb-1">Answer / Explanation:</span>
                          {viva.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Doubt CTA */}
            <div className="rounded-2xl bg-indigo-50 border border-indigo-200/80 p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-bold text-indigo-950">
                  Have doubts about this experiment?
                </h4>
                <p className="text-sm text-indigo-800/80 mt-1 max-w-xl">
                  Not sure why your graph is non-linear or how to eliminate parallax? You can record your doubt in the prototype support log.
                </p>
              </div>
              <button
                id="btn-ask-doubt-from-module"
                onClick={() => onOpenDoubtModal(experiment.title)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all whitespace-nowrap"
              >
                Ask a Doubt on this Lab
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
