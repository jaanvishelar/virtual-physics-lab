import { QuizQuestion, VivaQuestionItem } from '../types';

export interface PendulumApparatusDetail {
  id: string;
  name: string;
  role: string;
  spec: string;
}

export const SIMPLE_PENDULUM_INFO = {
  title: 'Simple Pendulum — Determination of g',
  experimentNumber: '03',
  targetLevel: 'Class 11',
  aim: 'To determine the acceleration due to gravity (g) using a simple pendulum.',
  theory: {
    statement:
      'For small angular amplitudes, the motion of a simple pendulum closely approximates Simple Harmonic Motion (SHM). The restoring torque acting on the displaced bob is proportional to the angular displacement. The periodic time of oscillation is governed strictly by the effective pendulum length and local gravitational acceleration.',
    formula: 'T = 2π√(L/g)',
    squaredFormula: 'T² = (4π²/g)L',
    variables: [
      {
        symbol: 'T',
        name: 'Time Period',
        unit: 'seconds (s)',
        description: 'Time taken for the bob to complete one full oscillation back and forth.'
      },
      {
        symbol: 'L',
        name: 'Effective Length',
        unit: 'metres (m)',
        description: 'Distance measured from the rigid pivot suspension down to the centre of mass of the bob.'
      },
      {
        symbol: 'g',
        name: 'Gravitational Acceleration',
        unit: 'm/s²',
        description: 'Acceleration experienced by free-falling bodies under Earth’s gravity (~9.81 m/s²).'
      }
    ],
    slopeNote:
      'The experiment determines g from the slope of a graph of T² versus L. The theoretical slope is m = 4π²/g, which yields g = 4π²/m.'
  },
  theoreticalG: 9.81
};

export const SIMPLE_PENDULUM_APPARATUS: PendulumApparatusDetail[] = [
  {
    id: 'retort-stand',
    name: 'Retort Stand & Rigid Support',
    role: 'Provides an immovable, rigid point of suspension so the pendulum oscillates without pivot vibration.',
    spec: 'Cast-iron heavy base with upright steel pillar and split-cork clamp'
  },
  {
    id: 'light-string',
    name: 'Light Inextensible String',
    role: 'Suspends the pendulum bob without stretching under tension or adding significant inertia.',
    spec: 'Fine unspun cotton thread, length adjustable up to 1.50 m'
  },
  {
    id: 'pendulum-bob',
    name: 'Heavy Metallic Bob',
    role: 'Concentrates the pendulum mass into a compact spherical form to minimize air damping.',
    spec: 'Solid brass spherical bob with small suspension hook (mass ~70 g, diameter 2.5 cm)'
  },
  {
    id: 'metre-scale',
    name: 'Metre Ruler (Scale)',
    role: 'Measures the total effective length L from the lower split-cork edge to the centre of the bob.',
    spec: 'Rigid metre ruler with 1 mm metric graduations'
  },
  {
    id: 'stopwatch',
    name: 'Digital Precision Stopwatch',
    role: 'Measures total elapsed time for a chosen number of complete oscillations with millisecond accuracy.',
    spec: 'Digital electronic timer with start/stop/split functions'
  }
];

export const SIMPLE_PENDULUM_PROCEDURE: string[] = [
  'Set the pendulum to the required length.',
  'Measure the length from the point of suspension to the centre of the bob.',
  'Set a small initial angular displacement.',
  'Release the bob without pushing it.',
  'Start the timer and count complete oscillations.',
  'Stop the timer after the selected number of oscillations.',
  'Calculate the time period T = t/N.',
  'Calculate T².',
  'Repeat for different lengths.',
  'Record the observations.',
  'Plot T² against L.',
  'Determine the slope of the best-fit line.',
  'Calculate g = 4π²/slope.',
  'Compare the experimental value with 9.81 m/s².'
];

export const SIMPLE_PENDULUM_PRECAUTIONS = [
  {
    title: 'Use small angular displacement',
    description: 'Keep the amplitude strictly below 10°–15° so the small-angle approximation sin(θ) ≈ θ remains valid and motion is simple harmonic.'
  },
  {
    title: 'Measure length up to the centre of the bob',
    description: 'The effective length L must be measured from the suspension point (split cork) to the centre of gravity of the bob (thread length + hook + bob radius).'
  },
  {
    title: 'Release the bob gently without applying a push',
    description: 'Displace the bob sideways and release from rest without imparting any initial velocity, spin, or circular motion.'
  },
  {
    title: 'Count complete oscillations carefully',
    description: 'Ensure a complete oscillation is counted only when the bob moves from the initial release extreme, across to the opposite extreme, and returns to the initial extreme.'
  },
  {
    title: 'Keep the support fixed',
    description: 'Firmly tighten the clamp on the retort stand so the pivot does not wobble or vibrate during swinging.'
  },
  {
    title: 'Avoid disturbing the pendulum during measurement',
    description: 'Conduct the experiment in still air away from open windows or fans to prevent draft-induced air damping or elliptical swings.'
  }
];

export const SIMPLE_PENDULUM_COMMON_ERRORS = [
  {
    name: 'Measuring length incorrectly',
    cause: 'Measuring only the length of the cotton thread and omitting the hook and radius of the bob.',
    prevention: 'Always add the thread length, hook length, and half the spherical bob diameter to determine true effective length L.'
  },
  {
    name: 'Counting oscillations incorrectly',
    cause: 'Counting every half-swing (equilibrium crossing) as a full oscillation, resulting in half the true time period.',
    prevention: 'Start the count at 0 upon release and count 1 only when the bob returns completely to the starting release extreme.'
  },
  {
    name: 'Using a large angular displacement',
    cause: 'Pulling the bob to 30° or 45° where restoring torque is no longer linear with angular displacement.',
    prevention: 'Keep displacement small (5° to 15°) to ensure simple harmonic motion equations remain valid.'
  },
  {
    name: 'Starting/stopping the timer late',
    cause: 'Human visual reflex delay when attempting to sync button clicks with single swing extremes.',
    prevention: 'Time 10 or 20 oscillations instead of 1, dividing timing error by N for high statistical accuracy.'
  },
  {
    name: 'Releasing the bob with a push',
    cause: 'Imparting initial kinetic energy or tangential momentum, generating an irregular elliptical orbit.',
    prevention: 'Release the bob gently from rest between two fingers without applying force.'
  },
  {
    name: 'Disturbing the support',
    cause: 'A lightweight or loose stand that flexes in counter-phase with the bob, absorbing energy and skewing the period.',
    prevention: 'Use a heavy retort base and secure all screw clamps tightly to a rigid bench.'
  }
];

export const SIMPLE_PENDULUM_QUIZ: QuizQuestion[] = [
  {
    id: 'pq-1',
    question: 'What is the theoretical formula for the time period (T) of a simple pendulum of length L?',
    options: [
      'T = 2π√(g / L)',
      'T = 2π√(L / g)',
      'T = 4π²(L / g)',
      'T = 2π(L / g)'
    ],
    correctIndex: 1,
    explanation: 'The time period of a simple pendulum executing small angular oscillations in simple harmonic motion is given by T = 2π√(L/g).'
  },
  {
    id: 'pq-2',
    question: 'What happens to the time period (T) of a simple pendulum if its length (L) is increased?',
    options: [
      'Time period decreases proportionally',
      'Time period remains completely unchanged',
      'Time period increases proportionally to √L',
      'Time period immediately drops to zero'
    ],
    correctIndex: 2,
    explanation: 'Since T = 2π√(L/g), time period is directly proportional to the square root of effective length (T ∝ √L). Increasing length increases the time period.'
  },
  {
    id: 'pq-3',
    question: 'When plotting Time Period Squared (T²) on the Y-axis versus Length (L) on the X-axis, what does the slope of the best-fit line represent?',
    options: [
      'g / (4π²)',
      '4π² / g',
      '2π / √g',
      'Local gravity g directly'
    ],
    correctIndex: 1,
    explanation: 'Squaring the period equation gives T² = (4π²/g)L. In the linear form y = mx, y = T² and x = L, which means the slope m = 4π²/g. Hence, g = 4π²/m.'
  },
  {
    id: 'pq-4',
    question: 'What is the standard SI unit of acceleration due to gravity (g)?',
    options: [
      'm/s',
      'm/s²',
      'kg·m/s',
      'N/m'
    ],
    correctIndex: 1,
    explanation: 'Acceleration due to gravity is the rate of change of velocity per unit time, measured in metres per second squared (m/s²).'
  },
  {
    id: 'pq-5',
    question: 'Why must the angular displacement of a simple pendulum be kept small (less than 15°) during this experiment?',
    options: [
      'To keep the string tension from exceeding the breaking limit',
      'To ensure the small-angle approximation sin(θ) ≈ θ holds, keeping the restoring torque linear for SHM',
      'Because gravity only attracts the bob when the angle is small',
      'To make the pendulum swing faster so the student finishes the practical quickly'
    ],
    correctIndex: 1,
    explanation: 'The restoring force is F = -mg sin(θ). For small angles (θ in radians), sin(θ) ≈ θ, which makes F ≈ -(mg/L)x. This linear proportionality with displacement is the exact condition for Simple Harmonic Motion.'
  }
];

export const SIMPLE_PENDULUM_VIVA: VivaQuestionItem[] = [
  {
    id: 'pv-1',
    question: '1. What is a simple pendulum?',
    answer:
      'An idealized simple pendulum consists of a heavy, concentrated point-mass bob suspended from a rigid, frictionless pivot by a light, inextensible, perfectly flexible string of length L.',
    concept: 'Idealized Mechanics Definition'
  },
  {
    id: 'pv-2',
    question: '2. What factors affect its time period?',
    answer:
      'The time period depends strictly on the effective length of the pendulum (L) and the local acceleration due to gravity (g). It is completely independent of the mass of the bob, the material of the bob, and the amplitude (for small angular oscillations).',
    concept: 'Variables & Invariance'
  },
  {
    id: 'pv-3',
    question: '3. Why is a small amplitude used?',
    answer:
      'The restoring force is F = -mg sin(θ). Only when the angle θ is small (less than 10°–15°) can we use the Taylor approximation sin(θ) ≈ θ (in radians). This gives F ≈ -(mg/L)x, which satisfies the fundamental condition of Simple Harmonic Motion (restoring force proportional to displacement directed towards the mean position).',
    concept: 'Small Angle Approximation'
  },
  {
    id: 'pv-4',
    question: '4. What does the slope of T² vs L represent?',
    answer:
      'From T² = (4π²/g)L, a plot with T² on the Y-axis and L on the X-axis yields a straight line through the origin with slope m = 4π²/g. We rearrange this slope to determine experimental acceleration due to gravity: g = 4π² / slope.',
    concept: 'Linear Regression & Slope'
  },
  {
    id: 'pv-5',
    question: '5. What is the approximate value of g near Earth\'s surface?',
    answer:
      'Near the surface of the Earth, standard gravitational acceleration is approximately 9.81 m/s² (or 980 cm/s²). It varies slightly with latitude (higher at the poles, lower at the equator) and altitude above sea level.',
    concept: 'Standard Physical Constants'
  },
  {
    id: 'pv-6',
    question: '6. Why do we measure several oscillations instead of only one?',
    answer:
      'Human reaction time when starting and stopping a manual stopwatch has an intrinsic uncertainty of around 0.2 to 0.3 seconds. By timing N complete oscillations (such as 10 or 20) and dividing the total time t by N (T = t/N), the reaction uncertainty is divided by N, drastically reducing fractional error in the calculated period T.',
    concept: 'Experimental Error Reduction'
  }
];
