import React from 'react';
import { BookOpen, CheckCircle, Sparkles, Target, Compass, Building2, TrendingUp } from 'lucide-react';

export const WhatDidYouLearn: React.FC = () => {
  const takeaways = [
    {
      icon: Compass,
      title: 'Independence of Horizontal & Vertical Kinematics',
      summary: 'Horizontal and vertical motions occur simultaneously but completely independently.',
      detail: 'Gravitational acceleration acts solely downwards (ay = -g), leaving the horizontal velocity ux = u cos(θ) strictly constant throughout the entire trajectory in the absence of air drag.',
    },
    {
      icon: Target,
      title: 'Condition for 45° Maximum Range',
      summary: '45° gives maximum range strictly under equal launch and landing heights.',
      detail: 'Because R = (u²/g)·sin(2θ), maximum range occurs when sin(2θ) = 1 (2θ = 90°, θ = 45°). If launched from an elevated height (h > 0), the optimal angle drops below 45°.',
    },
    {
      icon: Building2,
      title: 'Physical Effect of Launch Elevation (h > 0)',
      summary: 'Elevating the launch point extends flight duration and increases horizontal range.',
      detail: 'When launched from a height h (such as an assumed 4th floor at 12 m), the projectile must descend through the additional vertical height h before ground impact, remaining airborne longer and traveling farther forward.',
    },
    {
      icon: TrendingUp,
      title: 'Non-Linear Sinusoidal Physics vs Linear Models',
      summary: 'Range follows a sinusoidal curve, not a linear proportional relationship.',
      detail: 'Unlike linear systems (Ohm\'s law V=IR or Hooke\'s law F=kx), projectile range rises to a peak at 45° and drops toward 90°. Linear regression slope is therefore physically inappropriate.',
    },
    {
      icon: Sparkles,
      title: 'Complementary Angle Symmetry Principle',
      summary: 'Complementary angle pairs produce identical horizontal ranges on level ground.',
      detail: 'For any angle pair summing to 90° (e.g. 15° & 75°, or 30° & 60°), sin(2θ) = sin(2(90° - θ)). Both land at the exact same horizontal distance, though the steeper angle achieves a greater peak height and flight time.',
    },
  ];

  return (
    <div id="what-did-you-learn-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              What Did You Learn? (Core Takeaways)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Summary of foundational physical concepts demonstrated in this virtual projectile laboratory.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
          Laboratory Synthesis
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {takeaways.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center gap-2 mb-2 text-indigo-700">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200/70 flex items-center justify-center shrink-0">
                    <IconComponent className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs font-semibold text-slate-700 mb-1 leading-snug">
                  {item.summary}
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  {item.detail}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[10px] text-emerald-700 font-medium">
                <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Concept Verified in Lab</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
