import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Experiment, ExperimentSubmission } from '../../types';
import { EXPERIMENTS } from '../../data/experiments';
import {
  getPracticalsForClass,
  normalizeClassGrade,
  CLASS_STANDARDS,
  ClassStandard,
} from '../../data/practicalCatalog';
import { getStudentSubmissions } from '../../services/submissionService';
import {
  GraduationCap,
  FlaskConical,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  History,
  AlertCircle,
  Eye,
  X,
  FileText,
  Settings,
  Check,
  BookOpen,
} from 'lucide-react';

interface StudentDashboardProps {
  onStartExperiment: (exp: Experiment) => void;
  onNavigateHome: () => void;
}

export function StudentDashboard({
  onStartExperiment,
  onNavigateHome,
}: StudentDashboardProps) {
  const { profile, user, isConfigured, updateStudentClass } = useAuth();
  const [submissions, setSubmissions] = useState<ExperimentSubmission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ExperimentSubmission | null>(null);

  // Class & Division Verification Edit State
  const [isEditingClass, setIsEditingClass] = useState(false);
  const [tempClassGrade, setTempClassGrade] = useState<ClassStandard>(
    normalizeClassGrade(profile?.classGrade)
  );
  const [tempDivision, setTempDivision] = useState(profile?.division || 'A');
  const [isSavingClass, setIsSavingClass] = useState(false);
  const [classSaveSuccess, setClassSaveSuccess] = useState(false);

  // Sync temp state with profile
  useEffect(() => {
    if (profile?.classGrade) {
      setTempClassGrade(normalizeClassGrade(profile.classGrade));
    }
    if (profile?.division) {
      setTempDivision(profile.division);
    }
  }, [profile?.classGrade, profile?.division]);

  useEffect(() => {
    async function loadRecords() {
      if (!user?.uid || !isConfigured) {
        setIsLoadingSubmissions(false);
        return;
      }
      setIsLoadingSubmissions(true);
      try {
        const records = await getStudentSubmissions(user.uid);
        setSubmissions(records);
      } catch (err) {
        console.error('Failed to load student experiment submissions:', err);
      } finally {
        setIsLoadingSubmissions(false);
      }
    }
    loadRecords();
  }, [user?.uid, isConfigured]);

  const currentStandard = normalizeClassGrade(profile?.classGrade);
  // Practicals strictly assigned to this student's class
  const classPracticals = getPracticalsForClass(currentStandard);

  // Determine completed unique experiments
  const completedExperimentSlugs = new Set(submissions.map((s) => s.experimentSlug));

  // Count completed practicals that belong to the student's assigned class
  const completedInClassCount = classPracticals.filter((p) =>
    completedExperimentSlugs.has(p.slug)
  ).length;

  const syllabusProgressPercent =
    classPracticals.length > 0
      ? Math.round((completedInClassCount / classPracticals.length) * 100)
      : 0;

  // Compute attempts count per experiment
  const attemptsPerExperiment = submissions.reduce((acc, s) => {
    acc[s.experimentSlug] = (acc[s.experimentSlug] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleSaveClassDivision = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingClass(true);
    try {
      await updateStudentClass(tempClassGrade, tempDivision.trim().toUpperCase() || 'A');
      setClassSaveSuccess(true);
      setTimeout(() => {
        setClassSaveSuccess(false);
        setIsEditingClass(false);
      }, 1000);
    } catch (err) {
      console.error('Error updating student class & division:', err);
    } finally {
      setIsSavingClass(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Welcome Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Welcome, {profile?.displayName || 'Student'}!
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {currentStandard} — Division {profile?.division || 'A'}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Student Portal: Official curriculum practicals, real-time simulations, and verified laboratory records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsEditingClass(!isEditingClass)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold border border-indigo-200 rounded-xl px-3.5 py-2 cursor-pointer bg-indigo-50/50 hover:bg-indigo-50 flex items-center gap-1.5 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Verify / Change Standard</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium border border-slate-200 rounded-xl px-3 py-2 cursor-pointer bg-slate-50 hover:bg-slate-100"
            >
              Public Home
            </button>
          </div>
        </div>

        {/* Profile / Class Confirmation Dialog/Block */}
        {isEditingClass && (
          <form
            onSubmit={handleSaveClassDivision}
            className="mt-6 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-700 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold text-indigo-950 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Confirm or Update Class & Division</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingClass(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Your Virtual Lab view automatically filters experiments based on your standard curriculum.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Enrolled Class
                </label>
                <select
                  value={tempClassGrade}
                  onChange={(e) => setTempClassGrade(e.target.value as ClassStandard)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {CLASS_STANDARDS.map((std) => (
                    <option key={std} value={std}>
                      {std}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Division / Section
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={tempDivision}
                  onChange={(e) => setTempDivision(e.target.value.toUpperCase())}
                  placeholder="e.g. A"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs uppercase focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={isSavingClass}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {classSaveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Updated!</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingClass(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Progress Counters strictly calculated for Student's Class */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {currentStandard} Practicals
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {completedInClassCount} <span className="text-sm font-normal text-slate-400">/ {classPracticals.length}</span>
            </div>
            <div className="text-xs text-indigo-600 font-medium mt-0.5">
              {syllabusProgressPercent}% Syllabus Covered
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Attempts Saved
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {submissions.length}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Across all recorded modules
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Last Recorded Lab
            </div>
            <div className="text-sm font-bold text-slate-900 mt-2 truncate">
              {submissions.length > 0
                ? submissions[0].experimentTitle
                : 'No submissions yet'}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {submissions.length > 0
                ? new Date(submissions[0].submittedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Start an experiment below'}
            </div>
          </div>
        </div>
      </div>

      {/* Class-Specific Practicals Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                {currentStandard} Virtual Practicals
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {classPracticals.length} Assigned {classPracticals.length === 1 ? 'Module' : 'Modules'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly filtered to the official {currentStandard} physics syllabus. Non-{currentStandard} experiments are excluded.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classPracticals.map((exp) => {
            const isCompleted = completedExperimentSlugs.has(exp.slug);
            const attemptsCount = attemptsPerExperiment[exp.slug] || 0;

            return (
              <div
                key={exp.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {currentStandard}
                    </span>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Completed ({attemptsCount} {attemptsCount === 1 ? 'attempt' : 'attempts'})
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                        Not Started
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1.5">{exp.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {exp.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {exp.category}
                  </span>
                  <button
                    onClick={() => onStartExperiment(exp)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>{isCompleted ? 'Launch Again' : 'Start Lab'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Experiment History / Attempts Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Your Experiment Submission History</h2>
          </div>
          <span className="text-xs text-slate-400">
            {submissions.length} Total Saved {submissions.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>

        {isLoadingSubmissions ? (
          <div className="py-12 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
            <span>Loading lab records from Firestore...</span>
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-12 text-center px-4 rounded-xl bg-slate-50/70 border border-dashed border-slate-200">
            <FlaskConical className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No experiment attempts recorded yet</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
              When you perform an experiment, adjust parameters, and click "Save Attempt to Lab Record", your readings and calculated outputs will appear here automatically.
            </p>
            {classPracticals.length > 0 && (
              <button
                onClick={() => onStartExperiment(classPracticals[0])}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
              >
                Start {classPracticals[0].title}
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Experiment</th>
                  <th className="px-3 py-3 text-center">Attempt</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Key Parameters</th>
                  <th className="px-4 py-3">Calculated Output</th>
                  <th className="px-3 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {submissions.map((item) => (
                  <tr key={item.id || item.submittedAt} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-sans font-semibold text-slate-900">
                      {item.experimentTitle}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-sans text-[11px] font-semibold">
                        #{item.attemptNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-sans text-xs">
                      {new Date(item.submittedAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-600 max-w-xs truncate">
                      {Object.entries(item.inputs || {})
                        .slice(0, 3)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(' | ')}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-indigo-600 font-semibold max-w-xs truncate">
                      {Object.entries(item.calculatedResults || {})
                        .slice(0, 3)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(' | ')}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => setSelectedSubmission(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors font-sans text-xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Submission Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                  Attempt #{selectedSubmission.attemptNumber} Record
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedSubmission.experimentTitle}</h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <div className="text-slate-400">Student</div>
                  <div className="font-semibold text-slate-900">{selectedSubmission.studentName}</div>
                </div>
                <div>
                  <div className="text-slate-400">Class & Div</div>
                  <div className="font-semibold text-slate-900">
                    {selectedSubmission.classGrade} - {selectedSubmission.division}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Timestamp</div>
                  <div className="font-semibold text-slate-900">
                    {new Date(selectedSubmission.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Date</div>
                  <div className="font-semibold text-slate-900">
                    {new Date(selectedSubmission.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Input Parameters */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Experimental Inputs & Parameters
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                  {Object.entries(selectedSubmission.inputs || {}).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block text-[10px] font-sans uppercase">{key}</span>
                      <span className="font-bold text-slate-900">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculated Outputs */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Calculated Physics Results
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                  {Object.entries(selectedSubmission.calculatedResults || {}).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100">
                      <span className="text-indigo-600 block text-[10px] font-sans uppercase font-semibold">{key}</span>
                      <span className="font-bold text-indigo-950">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observation Table Snapshot if present */}
              {selectedSubmission.observations && selectedSubmission.observations.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                    Observation Table Snapshot ({selectedSubmission.observations.length} readings)
                  </h4>
                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                        <tr>
                          {Object.keys(selectedSubmission.observations[0])
                            .filter((k) => k !== 'id' && k !== 'timestamp')
                            .map((colKey) => (
                              <th key={colKey} className="px-3 py-2 uppercase tracking-wider text-[10px]">
                                {colKey}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                        {selectedSubmission.observations.map((obs, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60">
                            {Object.entries(obs)
                              .filter(([k]) => k !== 'id' && k !== 'timestamp')
                              .map(([k, v]) => (
                                <td key={k} className="px-3 py-2 text-slate-700">
                                  {typeof v === 'number' ? Number(v.toFixed(3)) : String(v)}
                                </td>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
