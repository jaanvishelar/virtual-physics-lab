import React from 'react';
import { AlertCircle, Sliders, CheckCircle2, MessageSquareText, Sparkles, Scale, BookOpen, Microscope } from 'lucide-react';

export const Mission: React.FC = () => {
  return (
    <section id="mission-section" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 font-mono mb-3 border border-slate-200">
            <Microscope className="w-3.5 h-3.5 text-indigo-600" />
            <span>Problem &amp; Educational Mission</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Making Practical Physics More Accessible
          </h2>
          <p className="mt-3 text-lg text-slate-600 leading-relaxed">
            Hands-on experimentation is fundamental to learning scientific laws. This community initiative addresses resource constraints through digital laboratory environments.
          </p>
        </div>

        {/* Bento Grid Layout (4 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: THE CHALLENGE (Span 7) */}
          <div 
            id="mission-card-challenge"
            className="md:col-span-7 glass-panel rounded-2xl p-7 sm:p-8 relative overflow-hidden group hover:border-slate-300 transition-all shadow-sm"
          >
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/5 rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold font-mono tracking-wider uppercase bg-amber-50 text-amber-800 border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                THE CHALLENGE
              </span>
              <span className="text-xs font-mono text-slate-400">Context 01</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
              Limited Laboratory Equipment &amp; Consumables
            </h3>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6">
              "Some schools have limited access to laboratory equipment, consumables, or enough apparatus for every student to perform practical experiments."
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                High student-to-apparatus ratios
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Fragile glassware &amp; sensitive meters
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Restricted weekly lab session hours
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Theory memorization replacing hands-on practice
              </div>
            </div>
          </div>

          {/* Card 2: OUR APPROACH (Span 5) */}
          <div 
            id="mission-card-approach"
            className="md:col-span-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-2xl p-7 sm:p-8 relative overflow-hidden shadow-md"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-bl-full pointer-events-none" />

            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold font-mono tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                OUR APPROACH
              </span>
              <span className="text-xs font-mono text-indigo-300/60">Solution 02</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
              Interactive Digital Apparatus &amp; Scientific Precision
            </h3>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
              "Virtual experiments allow students to explore variables, observe physical relationships, record measurements, and practice scientific analysis digitally."
            </p>

            <div className="space-y-2 text-xs text-indigo-200/90 font-mono pt-4 border-t border-indigo-800/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Repeatable digital experimentation &amp; tear</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Repeatable parameter trials anytime</span>
              </div>
            </div>
          </div>

          {/* Card 3: LEARNING (Span 6) */}
          <div 
            id="mission-card-learning"
            className="md:col-span-6 glass-panel rounded-2xl p-7 sm:p-8 relative overflow-hidden group hover:border-slate-300 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold font-mono tracking-wider uppercase bg-blue-50 text-blue-800 border border-blue-200">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                LEARNING
              </span>
              <span className="text-xs font-mono text-slate-400">Methodology 03</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
              Experiment-Based Learning Workflow
            </h3>

            <p className="text-slate-700 text-base leading-relaxed mb-5">
              "Students learn through an experiment-based workflow rather than only reading theoretical explanations."
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 font-mono text-xs text-slate-600 space-y-1.5">
              <div className="font-semibold text-slate-800">Complete Experimental Loop:</div>
              <p className="text-slate-600">
                Aim &rarr; Theory &rarr; Virtual Apparatus &rarr; Variable Controls &rarr; Data Collection &rarr; Analysis &rarr; Error Review
              </p>
            </div>
          </div>

          {/* Card 4: MENTORING (Span 6) */}
          <div 
            id="mission-card-mentoring"
            className="md:col-span-6 glass-panel rounded-2xl p-7 sm:p-8 relative overflow-hidden group hover:border-slate-300 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold font-mono tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                <MessageSquareText className="w-3.5 h-3.5 text-emerald-600" />
                MENTORING
              </span>
              <span className="text-xs font-mono text-slate-400">Support 04</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
              Concept &amp; Practical Guidance
            </h3>

            <p className="text-slate-700 text-base leading-relaxed mb-5">
              "Students can record doubts about concepts, calculations, observations, and experimental errors and access guidance."
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 font-mono text-xs text-slate-600 space-y-1.5">
              <div className="font-semibold text-slate-800">Target Doubt Categories:</div>
              <p className="text-slate-600">
                Graph Anomalies &bull; Parallax Errors &bull; Unit Consistency &bull; Viva Examination Defense
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
