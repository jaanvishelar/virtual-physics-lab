import { ReferenceItem } from '../types';

export const REFERENCE_ITEMS: ReferenceItem[] = [
  {
    id: 'ref-guides',
    title: 'Experiment Guides',
    subtitle: 'Structured Experiment Guides',
    description: 'Step-by-step experimental manuals outlining apparatus setup, procedural steps, precautions, and tabular data collection.',
    iconName: 'BookOpen',
    category: 'Laboratory Manuals',
    badge: 'Experiment Guide',
    details: {
      overview: 'Each experiment guide contains comprehensive lab checklists designed to emulate physical laboratory protocols before conducting digital or tabletop practicals.',
      keyPoints: [
        'Instrument Precision: Understanding scale divisions and measurement conventions in data collection.',
        'Zero Error Correction: Identifying positive and negative zero errors and applying corrections to raw data.',
        'Tabular Precision: Maintaining significant figures across observation columns and derived values.',
        'Graphical Analysis: Selecting scales, marking points with circled dots, and drawing lines of best fit.'
      ]
    }
  },
  {
    id: 'ref-formulas',
    title: 'Physics Formula Sheet',
    subtitle: 'Practical Equations & Constants',
    description: 'Standard physics equations used across mechanics, oscillations, optics, electricity, and thermodynamics practicals for Classes 9–12.',
    iconName: 'FileText',
    category: 'Equation Reference',
    badge: 'Formula Bank',
    details: {
      overview: 'Essential mathematical relationships and physical constants required for practical calculation and graph slope derivation.',
      keyPoints: [
        "Ohm's Law: V = I · R (Slope of V vs I gives R)",
        'Simple Pendulum: T = 2π√(L/g)  ⇒  g = 4π²(L/T²)',
        "Hooke's Law: F = -k · x  ⇒  k = (m·g) / x",
        'Lens Equation: 1/f = 1/v - 1/u  (Sign convention applied)',
        'Projectile Range: R = (v₀² sin 2θ) / g'
      ],
      sampleFormulasOrData: [
        { label: 'Acceleration due to gravity (g)', value: '9.80665', unit: 'm/s²' },
        { label: 'Permittivity of free space (ε₀)', value: '8.854 × 10⁻¹²', unit: 'F/m' },
        { label: 'Speed of light in vacuum (c)', value: '2.998 × 10⁸', unit: 'm/s' },
        { label: 'Elementary charge (e)', value: '1.602 × 10⁻¹⁹', unit: 'C' }
      ]
    }
  },
  {
    id: 'ref-si-units',
    title: 'SI Units Reference',
    subtitle: 'Base & Derived Physical Quantities',
    description: 'Comprehensive table of International System of Units (SI) definitions, dimensional formulas, and derived electrical/mechanical units.',
    iconName: 'Binary',
    category: 'Dimensional Analysis',
    badge: 'SI Units Reference',
    details: {
      overview: 'Complete reference for the 7 fundamental SI base units along with common derived units encountered in senior school practical physics.',
      keyPoints: [
        'Base Units: Meter (m), Kilogram (kg), Second (s), Ampere (A), Kelvin (K), Mole (mol), Candela (cd)',
        'Force: Newton (N) = kg·m·s⁻² [M L T⁻²]',
        'Energy & Work: Joule (J) = N·m = kg·m²·s⁻² [M L² T⁻²]',
        'Potential Difference: Volt (V) = W / A = kg·m²·s⁻³·A⁻¹ [M L² T⁻³ A⁻¹]',
        'Resistance: Ohm (Ω) = V / A = kg·m²·s⁻³·A⁻² [M L² T⁻³ A⁻²]'
      ],
      sampleFormulasOrData: [
        { label: 'Electric Current', value: 'Ampere', unit: 'A' },
        { label: 'Electric Potential', value: 'Volt', unit: 'V = W/A' },
        { label: 'Resistance', value: 'Ohm', unit: 'Ω = V/A' },
        { label: 'Frequency', value: 'Hertz', unit: 'Hz = s⁻¹' },
        { label: 'Force', value: 'Newton', unit: 'N = kg·m/s²' }
      ]
    }
  },
  {
    id: 'ref-converter',
    title: 'Unit Converter',
    subtitle: 'Laboratory Scale Conversion',
    description: 'Quick conversion tools for metric prefixes, centimeters to meters, milliamperes to amperes, and degrees to radians.',
    iconName: 'ArrowLeftRight',
    category: 'Measurement Tools',
    badge: 'Calculation Aid',
    details: {
      overview: 'Standard practical conversion factors to ensure experimental data is cleanly converted into SI units before numerical calculation.',
      keyPoints: [
        'Length: 1 mm = 10⁻³ m, 1 cm = 10⁻² m, 1 µm = 10⁻⁶ m',
        'Current: 1 mA = 10⁻³ A, 1 µA = 10⁻⁶ A',
        'Angles: θ(rad) = θ(deg) × (π / 180)',
        'Mass: 1 g = 10⁻³ kg, 50 g = 0.050 kg'
      ]
    }
  },
  {
    id: 'ref-precautions',
    title: 'Laboratory Precautions',
    subtitle: 'Safety & Systematic Error Minimization',
    description: 'Crucial laboratory guidelines to prevent apparatus damage, personal injury, and parallax or thermal systematic errors.',
    iconName: 'ShieldAlert',
    category: 'Lab Safety & Protocol',
    badge: 'Safety First',
    details: {
      overview: 'Standard precautionary measures enforced in academic physics laboratories to maintain instrument longevity and measurement integrity.',
      keyPoints: [
        'Electrical Safety: Ensure key is open while modifying circuit wiring. Never exceed maximum ammeter or voltmeter ratings.',
        'Optical Bench: Eliminate parallax by moving eye left to right; align needle tips along optical center height.',
        'Mechanics: Never overload springs beyond elastic limits. Keep oscillations strictly planar and small amplitude (< 5°).',
        'Environmental Control: Minimize draft/air currents when timing pendulum swings or delicate balances.'
      ]
    }
  },
  {
    id: 'ref-viva',
    title: 'Viva Preparation',
    subtitle: 'Practical Examination & Oral Defense',
    description: 'Curated sets of conceptual oral questions, apparatus identification drills, and error analysis queries for school practical assessments.',
    iconName: 'GraduationCap',
    category: 'Assessment Preparation',
    badge: 'Exam Readiness',
    details: {
      overview: 'Practice drills covering typical oral examiner questions regarding underlying laws, reasons for precautions, and graph interpretations.',
      keyPoints: [
        'Theoretical Foundation: Explain the law behind the experiment and state assumptions.',
        'Apparatus Justification: Explain why a specific component (rheostat, ammeter, lens holder) was required.',
        'Error Analysis: Distinguish between random human errors and systematic apparatus zero errors.',
        'Graphical Significance: Explain what intercepts and slopes physically represent.'
      ]
    }
  }
];
