import React from 'react';
import { Atom, Award, Compass, HeartHandshake, ShieldCheck, Target, GraduationCap } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-slate-200/70 text-slate-700 font-mono mb-3 border border-slate-300/60">
            <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
            <span>Community Engagement Foundation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About the Virtual Physics Lab
          </h2>
          <p className="mt-3 text-lg text-slate-600 leading-relaxed">
            Practical Physics for Schools with Limited Laboratory Access &bull; University Community Engagement Project
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Statement (Span 8) */}
          <div className="md:col-span-8 bg-white rounded-2xl p-7 sm:p-9 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider mb-4">
                <Target className="w-4 h-4" />
                <span>Project Purpose &amp; Motivation</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
                Bridging the Experimental Science Divide
              </h3>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                The purpose of this project is to develop an accessible online physics laboratory for school students who may have limited or no access to physical laboratory equipment.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                In many educational settings, physical laboratory access is constrained by high apparatus replacement costs, fragile glassware, and limited laboratory class periods. Virtual Physics Lab provides an accessible digital simulation of selected physics experiments, giving students an opportunity to repeat trials, explore variables, and develop scientific understanding.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs sm:text-sm text-indigo-900 font-sans">
              <strong className="font-semibold">Target Audience:</strong> Indian school students from Classes 9–12 studying foundational and senior secondary physical sciences.
            </div>
          </div>

          {/* Platform Principles (Span 4) */}
          <div className="md:col-span-4 bg-slate-900 text-white rounded-2xl p-7 sm:p-9 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider mb-4">
                <ShieldCheck className="w-4 h-4" />
                <span>Academic Initiative</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mb-3">
                Educational Protocol
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Explore interactive physics experiments designed for Classes 9–12. This platform provides structured experiment workflows, scientific content architecture, and pedagogical sequencing.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <span>No commercial licensing or paywalls</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <span>Pure physics mathematical modeling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <span>Open educational community access</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 text-[11px] font-mono text-slate-400">
              University Community Engagement Initiative
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
