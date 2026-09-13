import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ExperimentSubmission } from '../types';

export interface SaveSubmissionParams {
  studentId: string;
  studentName: string;
  studentEmail: string;
  classGrade: string;
  division: string;
  experimentSlug: string;
  experimentTitle: string;
  inputs: Record<string, number | string | boolean>;
  calculatedResults: Record<string, number | string>;
  observations?: Array<Record<string, any>>;
  notes?: string;
}

/**
 * Save an experiment submission to Firestore.
 * Automatically computes the student's attempt number for this experiment.
 */
export async function saveExperimentSubmission(
  params: SaveSubmissionParams
): Promise<ExperimentSubmission> {
  if (!db) {
    throw new Error('Firestore database is not configured. Please check your environment variables.');
  }

  // Calculate attempt number by querying previous submissions of this experiment by this student
  let attemptNumber = 1;
  try {
    const prevQuery = query(
      collection(db, 'submissions'),
      where('studentId', '==', params.studentId),
      where('experimentSlug', '==', params.experimentSlug)
    );
    const prevSnap = await getDocs(prevQuery);
    attemptNumber = prevSnap.size + 1;
  } catch (err) {
    console.warn('Could not determine previous attempts count, defaulting to 1:', err);
  }

  const submission: ExperimentSubmission = {
    studentId: params.studentId,
    studentName: params.studentName,
    studentEmail: params.studentEmail,
    classGrade: params.classGrade,
    division: params.division,
    experimentSlug: params.experimentSlug,
    experimentTitle: params.experimentTitle,
    attemptNumber,
    inputs: params.inputs,
    calculatedResults: params.calculatedResults,
    observations: params.observations || [],
    notes: params.notes || '',
    submittedAt: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, 'submissions'), submission);
  return {
    ...submission,
    id: docRef.id,
  };
}

/**
 * Get all experiment submissions for a specific student
 */
export async function getStudentSubmissions(studentId: string): Promise<ExperimentSubmission[]> {
  if (!db) return [];

  try {
    const q = query(
      collection(db, 'submissions'),
      where('studentId', '==', studentId)
    );
    const snapshot = await getDocs(q);
    const results: ExperimentSubmission[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ExperimentSubmission, 'id'>),
    }));

    // Sort in memory by submittedAt descending in case composite index is not yet built
    return results.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  } catch (err) {
    console.error('Error fetching student submissions:', err);
    return [];
  }
}

/**
 * Get all submissions across all students (for Teacher Dashboard)
 */
export async function getAllSubmissions(): Promise<ExperimentSubmission[]> {
  if (!db) return [];

  try {
    const q = query(collection(db, 'submissions'));
    const snapshot = await getDocs(q);
    const results: ExperimentSubmission[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ExperimentSubmission, 'id'>),
    }));

    return results.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  } catch (err) {
    console.error('Error fetching all submissions:', err);
    return [];
  }
}
