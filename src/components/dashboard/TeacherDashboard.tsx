import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ExperimentSubmission, UserProfile } from '../../types';
import { getAllSubmissions } from '../../services/submissionService';
import { getAllStudents } from '../../services/authService';
import { EXPERIMENTS } from '../../data/experiments';
import { exportSubmissionsToCSV } from '../../utils/exportCsv';
import {
  ShieldCheck,
  Users,
  FlaskConical,
  Download,
  Search,
  Filter,
  Eye,
  X,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';

interface TeacherDashboardProps {
  onNavigateHome: () => void;
}

export function TeacherDashboard({ onNavigateHome }: TeacherDashboardProps) {
  const { profile, isConfigured } = useAuth();
  const [submissions, setSubmissions] = useState<ExperimentSubmission[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<'submissions' | 'students'>('submissions');
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [experimentFilter, setExperimentFilter] = useState('All');

  // Selected modal for inspector
  const [selectedSubmission, setSelectedSubmission] = useState<ExperimentSubmission | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!isConfigured) {
        setLoading(false);
        return;
      }
      // Strictly prevent student accounts from executing privileged collection-wide queries
      if (profile?.role !== 'teacher') {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [subs, stus] = await Promise.all([
          getAllSubmissions(),
          getAllStudents(),
        ]);
        setSubmissions(subs);
        setStudents(stus);
      } catch (err) {
        console.error('Error loading teacher data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isConfigured, profile?.role]);

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchesSearch =
        searchQuery === '' ||
        sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.experimentTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesClass =
        classFilter === 'All' || sub.classGrade === classFilter;

      const matchesExp =
        experimentFilter === 'All' || sub.experimentSlug === experimentFilter;

      return matchesSearch && matchesClass && matchesExp;
    });
  }, [submissions, searchQuery, classFilter, experimentFilter]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      const matchesSearch =
        searchQuery === '' ||
        stu.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stu.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesClass =
        classFilter === 'All' || stu.classGrade === classFilter;

      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, classFilter]);

  // Map student submissions
  const studentStatsMap = useMemo(() => {
    const map: Record<string, { totalAttempts: number; completedSlugs: Set<string>; lastActive: string }> = {};
    submissions.forEach((s) => {
      if (!map[s.studentId]) {
        map[s.studentId] = {
          totalAttempts: 0,
          completedSlugs: new Set(),
          lastActive: s.submittedAt,
        };
      }
      map[s.studentId].totalAttempts += 1;
      map[s.studentId].completedSlugs.add(s.experimentSlug);
    });
    return map;
  }, [submissions]);

  if (profile?.role !== 'teacher') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mx-auto mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Teacher & Faculty Access Required</h2>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            This dashboard contains institutional student practical records and is restricted to verified teachers.
            {profile?.role === 'student' ? ' You are currently signed in with a Student account.' : ' Please sign in with an authorized teacher account.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="#student-dashboard"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Go to Student Dashboard
            </a>
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Teacher Welcome Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Teacher & Faculty Administration
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Authorized Faculty
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Monitor student practical submissions, verify apparatus inputs and calculations, and export institutional records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => exportSubmissionsToCSV(filteredSubmissions)}
              disabled={filteredSubmissions.length === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Export displayed records to CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV ({filteredSubmissions.length})</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium border border-slate-200 rounded-xl px-3 py-2 cursor-pointer bg-slate-50 hover:bg-slate-100"
            >
              ← Homepage
            </button>
          </div>
        </div>

        {/* Aggregate Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Enrolled Students
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {students.length}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Classes 8–12</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Lab Submissions
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {submissions.length}
            </div>
            <div className="text-xs text-emerald-600 font-medium mt-0.5">Live database records</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Virtual Practicals
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {EXPERIMENTS.length}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Curriculum modules</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Latest Submission
            </div>
            <div className="text-sm font-bold text-slate-900 mt-2 truncate">
              {submissions.length > 0
                ? `${submissions[0].studentName} (${submissions[0].experimentSlug})`
                : 'No submissions yet'}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {submissions.length > 0
                ? new Date(submissions[0].submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Awaiting student submissions'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs and Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 border-b sm:border-b-0 border-slate-200 pb-2 sm:pb-0">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'submissions'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Experiment Submissions ({submissions.length})
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Registered Students ({students.length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Class Filter */}
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium cursor-pointer"
          >
            <option value="All">All Classes (8–12)</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 12">Class 12</option>
          </select>

          {/* Experiment Filter */}
          {activeTab === 'submissions' && (
            <select
              value={experimentFilter}
              onChange={(e) => setExperimentFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium cursor-pointer"
            >
              <option value="All">All Experiments</option>
              {EXPERIMENTS.map((e) => (
                <option key={e.slug} value={e.slug}>
                  {e.title}
                </option>
              ))}
            </select>
          )}

          {(classFilter !== 'All' || experimentFilter !== 'All' || searchQuery !== '') && (
            <button
              onClick={() => {
                setClassFilter('All');
                setExperimentFilter('All');
                setSearchQuery('');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
            <span>Loading records from Firestore...</span>
          </div>
        ) : activeTab === 'submissions' ? (
          /* Submissions Table */
          filteredSubmissions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No experiment records found matching current filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Student & Class</th>
                    <th className="px-4 py-3">Experiment</th>
                    <th className="px-3 py-3 text-center">Attempt</th>
                    <th className="px-4 py-3">Input Parameters</th>
                    <th className="px-4 py-3">Calculated Output</th>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-3 py-3 text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredSubmissions.map((s) => (
                    <tr key={s.id || s.submittedAt} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-sans">
                        <div className="font-semibold text-slate-900">{s.studentName}</div>
                        <div className="text-[11px] text-slate-400">
                          {s.classGrade} (Div {s.division}) • {s.studentEmail}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-sans font-medium text-slate-800">
                        {s.experimentTitle}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-sans text-[11px] font-semibold">
                          #{s.attemptNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-600 max-w-xs truncate">
                        {Object.entries(s.inputs || {})
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(' | ')}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-indigo-600 font-semibold max-w-xs truncate">
                        {Object.entries(s.calculatedResults || {})
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(' | ')}
                      </td>
                      <td className="px-4 py-3 font-sans text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(s.submittedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        {new Date(s.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-3 py-3 text-right font-sans">
                        <button
                          onClick={() => setSelectedSubmission(s)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors text-xs cursor-pointer font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* Students Directory Tab */
          filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No registered students found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Class & Division</th>
                    <th className="px-4 py-3">Email Address</th>
                    <th className="px-3 py-3 text-center">Practicals Completed</th>
                    <th className="px-3 py-3 text-center">Total Attempts</th>
                    <th className="px-4 py-3">Enrolled Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st) => {
                    const stats = studentStatsMap[st.uid] || {
                      totalAttempts: 0,
                      completedSlugs: new Set(),
                      lastActive: '',
                    };
                    return (
                      <tr key={st.uid} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {st.displayName}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-700">
                          {st.classGrade || 'N/A'} - {st.division || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                          {st.email}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {stats.completedSlugs.size} / {EXPERIMENTS.length}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center font-mono">
                          {stats.totalAttempts}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-[11px]">
                          {st.createdAt ? new Date(st.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Modal Inspector for Teacher */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-wider">
                  Teacher Review • Attempt #{selectedSubmission.attemptNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedSubmission.experimentTitle}
                </h3>
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
                  <div className="text-slate-400">Email</div>
                  <div className="font-semibold text-slate-900 truncate">{selectedSubmission.studentEmail}</div>
                </div>
                <div>
                  <div className="text-slate-400">Date Recorded</div>
                  <div className="font-semibold text-slate-900">
                    {new Date(selectedSubmission.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Input Parameters */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Student Applied Inputs
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
                  Physics Calculations & Derived Quantities
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                  {Object.entries(selectedSubmission.calculatedResults || {}).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                      <span className="text-emerald-700 block text-[10px] font-sans uppercase font-semibold">{key}</span>
                      <span className="font-bold text-emerald-950">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observation Table Snapshot */}
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
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
