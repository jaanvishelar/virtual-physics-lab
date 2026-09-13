import { ExperimentSubmission } from '../types';

/**
 * Converts experiment submissions array to a CSV string and triggers browser download
 */
export function exportSubmissionsToCSV(submissions: ExperimentSubmission[], filename = 'physics_lab_submissions.csv') {
  if (!submissions.length) {
    return;
  }

  const headers = [
    'Submission ID',
    'Student Name',
    'Student Email',
    'Class',
    'Division',
    'Experiment',
    'Attempt #',
    'Submitted Date & Time',
    'Key Inputs',
    'Calculated Results',
    'Observations Count',
    'Student Notes',
  ];

  const rows = submissions.map((s) => {
    const formattedInputs = Object.entries(s.inputs || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');

    const formattedOutputs = Object.entries(s.calculatedResults || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');

    const dateStr = s.submittedAt ? new Date(s.submittedAt).toLocaleString() : '';

    return [
      `"${s.id || ''}"`,
      `"${(s.studentName || '').replace(/"/g, '""')}"`,
      `"${(s.studentEmail || '').replace(/"/g, '""')}"`,
      `"${s.classGrade || ''}"`,
      `"${s.division || ''}"`,
      `"${(s.experimentTitle || s.experimentSlug || '').replace(/"/g, '""')}"`,
      s.attemptNumber || 1,
      `"${dateStr}"`,
      `"${formattedInputs.replace(/"/g, '""')}"`,
      `"${formattedOutputs.replace(/"/g, '""')}"`,
      s.observations?.length || 0,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
