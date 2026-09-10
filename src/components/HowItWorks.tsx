import React from 'react';
import { BookOpen, Compass, Sliders, ClipboardList, LineChart, CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onExploreLabs: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onExploreLabs }) => {
  const steps = [
    {
      num: '01',
      title: 'Learn',
      subtitle: 'Aim, theory, formula and apparatus',
      description: 'Study the underlying physical principles, verify the mathematical relationship, and review the apparatus checklist before starting.',
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      tag: 'Preparation',
      bgClass: 'md:col-span-4'
    },
    {
      num: '02',
      title: 'Explore',
      subtitle: 'Interact with the virtual apparatus',
      description: 'Familiarize yourself with simulated instruments, circuit components, and interactive apparatus controls.',
      icon: <Compass className="w-5 h-5 text-indigo-600" />,
      tag: 'Orientation',
      bgClass: 'md:col-span-4'
    },
    {
      num: '03',
      title: 'Experiment',
      subtitle: 'Change variables and observe the result',
      description: 'Manipulate independent variables (such as circuit resistance, pendulum length, spring load, or launch angle) and observe direct physical responses.',
      icon: <Sliders className="w-5 h-5 text-emerald-600" />,
      tag: 'Execution',
      bgClass: 'md:col-span-4'
    },
    {
      num: '04',
      title: 'Record',
      subtitle: 'Enter experimental observations',
      description: 'Record observation readings directly into structured laboratory tables with automatic calculations and unit tracking.',
      icon: <ClipboardList className="w-5 h-5 text-amber-600" />,
      tag: 'Data Collection',
      bgClass: 'md:col-span-6'
    },
    {
      num: '05',
      title: 'Analyze',
      subtitle: 'Calculate values and generate graphs',
      description: 'Plot coordinates on standard Cartesian grids, compute regression slopes (such as Ohm’s law R or gravitational g), and assess percentage deviation.',
      icon: <LineChart className="w-5 h-5 text-violet-600" />,
      tag: 'Computation',
      bgClass: 'md:col-span-6'
    },
    {
      num: '06',
      title: 'Understand',
      subtitle: 'Review result, quiz and viva questions',
      description: 'Consolidate experimental conclusions, inspect systematic and random errors, and practice oral viva defense questions.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />,
      tag: 'Mastery',
      bgClass: 'md:col-span-12'
    },
  ];

  return (
    <section id="how-it-works-section" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 font-mono mb-3 border border-slate-200">
            <span>Student Learning Pathway</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How the Virtual Lab Works
          </h2>
          <p className="mt-3 text-lg text-slate-600 leading-relaxed">
            A structured six-stage practical workflow designed to emulate authentic laboratory methodology.
          </p>
        </div>

        {/* Bento Grid (6 steps) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              id={`how-it-works-step-${step.num}`}
              className={`${step.bgClass} glass-panel rounded-2xl p-6 sm:p-7 border border-slate-200/80 hover:border-indigo-300 transition-all shadow-xs flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {step.icon}
                    </div>
                    <span className="text-xs font-bold uppercase font-mono text-slate-400 tracking-wider">
                      Step {step.num}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60 font-mono">
                    {step.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
                  {step.num} — {step.title}
                </h3>

                <p className="text-sm font-semibold text-indigo-600 mb-3 font-sans">
                  {step.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {step.num === '06' && (
                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 font-mono">
                    Ready to practice your practical physics skills?
                  </div>
                  <button
                    onClick={onExploreLabs}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <span>View 5 Laboratory Previews</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
