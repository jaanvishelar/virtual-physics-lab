import React, { useState, useMemo } from 'react';
import { ExperimentCard } from './ExperimentCard';
import { Experiment } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  PRACTICAL_CATALOGUE,
  getPracticalsForClass,
  ClassStandard,
} from '../data/practicalCatalog';
import {
  Layers,
  Filter,
  Lock,
  LogIn,
  UserPlus,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface LabPreviewProps {
  onOpenLab: (exp: Experiment) => void;
}

export const LabPreview: React.FC<LabPreviewProps> = ({ onOpenLab }) => {
  const { user, profile } = useAuth();
  const isStudent = Boolean(user && profile?.role === 'student' && profile?.classGrade);

  // The public catalogue allows visitors and students to filter by class
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Determine active standard to pass to ExperimentCard for badge rendering
  const activeClassStandard: ClassStandard | null =
    selectedFilter !== 'all' ? (`Class ${selectedFilter}` as ClassStandard) : null;

  // Complete public catalogue filtered according to selected standard
  const displayedExperiments = useMemo(() => {
    if (selectedFilter === 'all') {
      return PRACTICAL_CATALOGUE;
    }
    return getPracticalsForClass(`Class ${selectedFilter}` as ClassStandard);
  }, [selectedFilter]);

  return (
    <section
      id="virtual-labs-section"
      className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 font-mono mb-3 border border-indigo-200/60">
              <Layers className="w-3.5 h-3.5" />
              <span>Physics Practical Catalogue</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Virtual Physics Laboratory
            </h2>
            <p className="mt-2.5 text-base sm:text-lg text-slate-600">
              Interactive practical modules with live apparatus simulations, experimental observation tables, and analytical graphing.
            </p>
          </div>

          {/* Public Class Filter Bar (Always visible for all visitors and students) */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-x-auto text-xs font-medium">
            <span className="px-2.5 py-1 text-slate-400 font-mono flex items-center gap-1 text-[11px]">
              <Filter className="w-3 h-3" /> Class:
            </span>
            {[
              { label: 'All Experiments', val: 'all' },
              { label: 'Class 9', val: '9' },
              { label: 'Class 10', val: '10' },
              { label: 'Class 11', val: '11' },
              { label: 'Class 12', val: '12' },
            ].map((tab) => (
              <button
                key={tab.val}
                id={`filter-class-${tab.val}`}
                onClick={() => setSelectedFilter(tab.val)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === tab.val
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Informational Banner: Unauthenticated vs Authenticated */}
        {!user ? (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 text-sm">
                  Student Login Required for Laboratory Access
                </h4>
                <p className="text-amber-800/90 mt-0.5 leading-relaxed text-xs">
                  Public visitors can browse all five project practicals. Performing live simulations, recording observations, and saving practical reports requires student authentication.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
              <a
                href="#login"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In to Access</span>
              </a>
              <a
                href="#register"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 text-xs font-semibold shadow-2xs transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </a>
            </div>
          </div>
        ) : isStudent ? (
          <div className="mb-8 p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-900 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Signed in as <strong className="text-slate-900">{profile?.displayName || user.displayName || 'Student'}</strong> — Enrolled in <strong className="text-indigo-700">{profile?.classGrade || 'Class 11'} (Division {profile?.division || 'A'})</strong>.
              </span>
            </div>
            <a
              href="#student-dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 hover:underline shrink-0"
            >
              <span>Go to My Student Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : null}

        {/* Experiment Cards Grid or Clean Empty State */}
        {displayedExperiments.length === 0 ? (
          <div
            id="empty-class-message"
            className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              {selectedFilter === '10' ? 'No Practical Assigned' : 'No Experiments Available'}
            </h3>
            <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {selectedFilter === '10'
                ? 'No virtual practical is currently assigned to Class 10 in this project.'
                : 'No practicals match the selected filter.'}
            </p>
            <button
              onClick={() => setSelectedFilter('all')}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              <span>View All 5 Project Practicals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {displayedExperiments.map((exp) => (
              <ExperimentCard
                key={exp.id}
                experiment={exp}
                onOpenLab={onOpenLab}
                classStandard={activeClassStandard}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
