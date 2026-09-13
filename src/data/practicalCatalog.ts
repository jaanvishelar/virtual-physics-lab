import { Experiment } from '../types';
import { EXPERIMENTS } from './experiments';

export type ClassStandard = 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';

export const CLASS_STANDARDS: ClassStandard[] = [
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

/**
 * Normalizes any variation of class grade string into a canonical ClassStandard.
 * Handles inputs like "Class 11", "11", "Grade 11", "Std 11", etc.
 */
export function normalizeClassGrade(rawGrade?: string | null): ClassStandard {
  if (!rawGrade) return 'Class 11';
  const clean = rawGrade.trim().toLowerCase();

  if (clean.includes('11')) return 'Class 11';
  if (clean.includes('12')) return 'Class 12';
  if (clean.includes('10')) return 'Class 10';
  if (clean.includes('9') || clean.includes('8')) return 'Class 9';

  return 'Class 11';
}

/**
 * The Virtual Physics Lab project contains EXACTLY THESE 5 practicals:
 *
 * 1. CLASS 9: Hooke's Law & Spring Constant ('hookes-law')
 * 2. CLASS 11: Ohm's Law & Resistance ('ohms-law')
 * 3. CLASS 11: Simple Pendulum & Acceleration Due to Gravity ('simple-pendulum')
 * 4. CLASS 11: Projectile Motion — Range & Trajectory ('projectile-motion')
 * 5. CLASS 12: Convex Lens & Focal Length ('convex-lens')
 *
 * No extra experiments, mock items, or "Coming Soon" experiments exist in this project.
 */
export const PRACTICAL_CATALOGUE: Experiment[] = EXPERIMENTS;

/**
 * Standard-Specific Practical Slug Mapping:
 *
 * Class 9: Exactly 1 practical ('hookes-law')
 * Class 10: 0 practicals (empty array)
 * Class 11: Exactly 3 practicals ('ohms-law', 'simple-pendulum', 'projectile-motion')
 * Class 12: Exactly 1 practical ('convex-lens')
 */
export const CLASS_PRACTICALS_MAP: Record<ClassStandard, string[]> = {
  'Class 9': ['hookes-law'],
  'Class 10': [],
  'Class 11': ['ohms-law', 'simple-pendulum', 'projectile-motion'],
  'Class 12': ['convex-lens'],
};

/**
 * Get assigned practical slugs for a student's class
 */
export function getPracticalSlugsForClass(classGrade?: string | null): string[] {
  const standard = normalizeClassGrade(classGrade);
  return CLASS_PRACTICALS_MAP[standard] || CLASS_PRACTICALS_MAP['Class 11'];
}

/**
 * Get all practicals assigned to a class standard from the project catalogue
 */
export function getPracticalsForClass(classGrade?: string | null): Experiment[] {
  const standard = normalizeClassGrade(classGrade);
  const stdNum = parseInt(standard.replace('Class ', ''), 10);
  return PRACTICAL_CATALOGUE.filter(
    (exp) => exp.classes === standard || exp.standard === stdNum
  );
}

/**
 * Get only working/implemented experiments assigned to a student's class
 */
export function getAssignedWorkingPracticals(classGrade?: string | null): Experiment[] {
  return getPracticalsForClass(classGrade).filter((p) => p.status === 'available');
}

/**
 * Check if a specific practical is assigned to the student's class
 */
export function isPracticalAssignedToClass(
  slug: string,
  classGrade?: string | null
): boolean {
  const slugs = getPracticalSlugsForClass(classGrade);
  return slugs.includes(slug);
}

/**
 * Returns the exact class standard that includes this practical
 */
export function getClassesForPractical(slug: string): ClassStandard[] {
  const item = PRACTICAL_CATALOGUE.find((p) => p.slug === slug);
  if (item && item.classes) {
    return [normalizeClassGrade(item.classes)];
  }
  for (const std of CLASS_STANDARDS) {
    if (CLASS_PRACTICALS_MAP[std].includes(slug)) {
      return [std];
    }
  }
  return ['Class 11'];
}

/**
 * Returns the exact standard label for a practical card.
 * Every practical belongs to one exact standard:
 * - Hooke's Law -> Class 9
 * - Ohm's Law -> Class 11
 * - Simple Pendulum -> Class 11
 * - Projectile Motion -> Class 11
 * - Convex Lens -> Class 12
 */
export function getDisplayStandardForPractical(
  slug: string,
  activeStandard?: string | null
): string {
  const item = PRACTICAL_CATALOGUE.find((p) => p.slug === slug);
  if (item && item.classes) {
    return item.classes;
  }
  const assigned = getClassesForPractical(slug);
  return assigned[0] || 'Class 11';
}
