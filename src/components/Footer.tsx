import React from 'react';
import { Atom } from 'lucide-react';
import { ActiveNavSection } from '../types';

interface FooterProps {
  onNavigate: (section: ActiveNavSection) => void;
  onOpenLabs: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLabs }) => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Subtitle */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Atom className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Virtual Physics Lab
              </span>
            </div>

            <p className="text-sm text-indigo-300 font-mono">
              "University Community Engagement Project Prototype"
            </p>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed font-normal">
              Designed as an educational prototype to improve access to practical physics learning for students and schools with limited laboratory apparatus.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Laboratory Platform
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={onOpenLabs}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Virtual Labs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('mentoring')}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Mentoring &amp; Doubt Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Resources &amp; Reference Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional / Educational context */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Engagement Context
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About the Project
                </button>
              </li>
              <li className="text-xs text-slate-400 pt-1 font-mono leading-relaxed">
                Targeted for Indian school students (Classes 9–12) across physics practical domains.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal / Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; 2026 Virtual Physics Lab. All rights reserved.
          </p>
          <p className="font-mono text-[11px] text-slate-500">
            University Community Engagement Project Prototype
          </p>
        </div>

      </div>
    </footer>
  );
};
