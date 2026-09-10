import { QuizQuestion, VivaQuestionItem, ApparatusDetail } from '../types';

export const PROJECTILE_MOTION_INFO = {
  header: {
    expNumber: '04',
    classes: 'Classes 11–12',
    category: 'Mechanics • Kinematics',
    badge: 'Fully Interactive Laboratory Bench',
    title: 'Projectile Motion — Range & Trajectory',
  },
  aim: "To study the trajectory of a projectile and investigate how its range depends on the initial velocity and angle of projection.",
  theory: {
    definition:
      "A projectile is any object launched into the air with an initial velocity at an angle to the horizontal, which subsequently moves under the sole influence of gravity, neglecting air resistance.",
    velocityComponents: {
      formulaUx: "ux = u cosθ",
      formulaUy: "uy = u sinθ",
      explanation: "Resolving initial velocity u at angle θ gives constant horizontal velocity ux and vertically decelerating initial velocity uy."
    },
    equationsOfMotion: {
      formulaX: "x(t) = u cosθ · t",
      formulaY: "y(t) = u sinθ · t − ½gt²",
      explanation: "Since gravity acts solely downwards, horizontal acceleration is zero (ax = 0) and vertical acceleration is constant (ay = -g)."
    },
    keyParameters: {
      timeOfFlight: "T = 2u sinθ / g",
      maxHeight: "H = u²sin²θ / (2g)",
      horizontalRange: "R = u²sin(2θ) / g",
    },
    optimalAngle: {
      value: 45,
      explanation:
        "The horizontal range R = (u² / g) · sin(2θ) reaches its theoretical maximum when sin(2θ) is maximum (sin(2θ) = 1), which occurs at 2θ = 90° ⇒ θ = 45°, assuming launch and landing heights are equal (y₀ = 0, y = 0) and air resistance is neglected.",
      complementaryNote:
        "Complementary angles (e.g. 15° and 75°, or 30° and 60°) yield equal theoretical ranges because sin(2(90° - θ)) = sin(180° - 2θ) = sin(2θ)."
    }
  },
  constants: {
    g: 9.81, // m/s²
    defaultVelocity: 20, // m/s
    defaultAngle: 45, // degrees
  },
  variablesInvestigation: [
    {
      variable: "Initial Velocity (u)",
      effect: "Directly magnifies all kinematic parameters: Time of flight T ∝ u, while both Maximum Height H ∝ u² and Horizontal Range R ∝ u² scale quadratically."
    },
    {
      variable: "Launch Angle (θ)",
      effect: "Steeper angles increase vertical time of flight and peak altitude, while flatter angles produce fast, shallow trajectories. Maximum horizontal range occurs at 45°."
    },
    {
      variable: "Optimal Angle (45°)",
      effect: "At θ = 45°, sin(2θ) = sin(90°) = 1.0, distributing kinetic energy optimally between horizontal traverse and vertical airtime on flat terrain."
    },
    {
      variable: "Gravitational Acceleration (g)",
      effect: "A stronger gravitational field pulls the projectile downward faster, inversely reducing both flight time (T ∝ 1/g) and range (R ∝ 1/g)."
    }
  ]
};

export const PROJECTILE_APPARATUS: ApparatusDetail[] = [
  {
    id: 'pa-1',
    name: 'Virtual Projectile Launcher',
    role: 'Adjustable virtual launcher used to set the initial velocity and projection angle.',
    connectionType: 'Control',
    spec: 'Adjustable initial velocity and projection angle'
  },
  {
    id: 'pa-2',
    name: 'Virtual Projectile',
    role: 'A virtual spherical object representing the projectile used in the simulation.',
    connectionType: 'Conductor',
    spec: 'Simulated point-mass spherical projectile'
  },
  {
    id: 'pa-3',
    name: 'Interactive Angle Control',
    role: 'Interactive angle control used to set the projection angle θ relative to the horizontal.',
    connectionType: 'Control',
    spec: 'Continuous angle setting relative to the horizontal'
  },
  {
    id: 'pa-4',
    name: 'Coordinate Grid',
    role: 'Displays the projectile trajectory and allows horizontal and vertical positions to be observed.',
    connectionType: 'Series',
    spec: 'Displays trajectory coordinates and positions'
  },
  {
    id: 'pa-5',
    name: 'Virtual Timer',
    role: 'Measures the simulated time of flight from launch until the projectile returns to ground level.',
    connectionType: 'Parallel',
    spec: 'Measures simulated flight duration'
  },
  {
    id: 'pa-6',
    name: 'Measurement Panel',
    role: 'Displays calculated velocity components, maximum height, time of flight, and horizontal range.',
    connectionType: 'Series',
    spec: 'Displays calculated kinematic parameters'
  }
];

export const PROJECTILE_APPARATUS_NOTE = "These are virtual laboratory components used for educational simulation. They represent the physical concepts of projectile motion rather than claiming to reproduce a specific physical laboratory apparatus.";

export const PROJECTILE_PROCEDURE: string[] = [
  "Set the initial launch velocity (u) to the desired test value (e.g. 20 m/s) using the velocity actuator.",
  "Set the projection angle θ using the interactive angle control.",
  "Confirm that the virtual launcher and landing surface are at the same reference level (y₀ = 0 m).",
  "Click [LAUNCH] to fire the projectile along its ballistic trajectory.",
  "Observe the projectile trace a parabolic arc across the coordinate grid under constant gravitational acceleration.",
  "Track the elapsed time of flight (t) until the projectile touches down at ground level (y = 0 m).",
  "Observe and record the maximum vertical height (H) attained at the trajectory vertex.",
  "Observe and record the final horizontal range (R) at ground contact.",
  "Repeat the launch for different projection angles (e.g. 30°, 45°, 60°, and 75°) while maintaining constant velocity u.",
  "Record each completed trial in the Experimental Observation Table.",
  "Inspect the dynamic Range (R) versus Angle (θ) graph generated from your recorded observations.",
  "Compare your observed data points against the continuous theoretical range curve R(θ) = u²sin(2θ)/g.",
  "Identify the angle giving approximately maximum range on flat terrain.",
  "Verify that complementary angles (e.g. 30° and 60°) produce equal ranges within simulated precision, confirming the sin(2θ) symmetry."
];

export const PROJECTILE_PRECAUTIONS = [
  {
    title: 'Equal Launch and Landing Levels',
    description: 'Ensure the launch nozzle origin and the landing target lie on the exact same horizontal datum plane (y₀ = 0 m); any elevation difference shifts the maximum-range angle away from 45°.'
  },
  {
    title: 'Correct Angle Measurement',
    description: 'Verify the protractor reading against the horizontal ground line rather than the vertical normal to avoid angle complement confusion.'
  },
  {
    title: 'Consistent System of Units',
    description: 'Always calculate with velocities in meters per second (m/s), angles converted to radians for trigonometric functions, and distances in meters (m).'
  },
  {
    title: 'Ideal Model Assumptions & Air Resistance',
    description: 'The simulation operates on ideal model conditions: air resistance is neglected, crosswind is neglected, launch and landing heights are equal, and gravity is constant at 9.81 m/s². Air resistance can alter real-world projectile trajectories and reduce range.'
  },
  {
    title: 'Controlled Velocity Across Trials',
    description: 'When investigating the effect of launch angle θ on range R, keep the initial velocity u strictly constant across all angle trials.'
  },
  {
    title: 'Systematic Angular Sampling',
    description: 'Test both low and high angles (15°, 30°, 45°, 60°, 75°) across the full quadrant to observe the symmetric rise and fall of the range curve.'
  },
  {
    title: 'Record Actual Simulation Coordinates',
    description: 'Tabulate values generated directly from the simulation rather than guessing or transcribing from memory.'
  },
  {
    title: 'Distinguish Maximum Height from Range',
    description: 'Do not confuse peak vertical displacement H (at t = T/2) with total horizontal traverse R (at t = T).'
  }
];

export const PROJECTILE_COMMON_ERRORS = [
  {
    name: 'Neglecting Air Drag in Real-World Comparisons',
    cause: 'Students often expect actual physical objects to match ideal vacuum projectile ranges exactly.',
    prevention: 'Clarify that air resistance can alter real-world projectile trajectories and reduce range compared to the ideal theoretical model.'
  },
  {
    name: 'Trigonometric Degree versus Radian Mismatch',
    cause: 'Passing raw degree values into standard mathematical sine and cosine functions expecting correct ratios.',
    prevention: 'Always convert θ_rad = θ_deg × (π / 180) prior to evaluating trigonometric functions.'
  },
  {
    name: 'Confusing sin²(θ) with sin(2θ)',
    cause: 'Mixing up the vertical maximum height formula H = u²sin²θ/(2g) with the horizontal range formula R = u²sin(2θ)/g.',
    prevention: 'Emphasize that range depends on the double-angle sin(2θ), which peaks at θ = 45°, whereas peak height depends on sin²θ, which peaks at θ = 90°.'
  },
  {
    name: 'Unequal Launch and Landing Heights',
    cause: 'Firing from an elevated table down to the floor while expecting the 45° rule to hold.',
    prevention: 'Remind students that firing from an elevation (y₀ > 0) favors a lower launch angle (< 45°) for maximum horizontal travel.'
  },
  {
    name: 'Prematurely Recording In-Flight Readings',
    cause: 'Clicking to record data before the projectile has completed its full trajectory and landed on the ground.',
    prevention: 'The lab bench locks trial recording until touchdown (y = 0 m) is confirmed.'
  },
  {
    name: 'Attempting Straight-Line Linear Regression on R vs θ',
    cause: 'Assuming every experimental graph must be fitted with a straight line y = mx + c.',
    prevention: 'Highlight that Range vs Angle is inherently sinusoidal (non-linear); linear least-squares regression is mathematically invalid here.'
  }
];

export const PROJECTILE_QUIZ: QuizQuestion[] = [
  {
    id: 'pq-1',
    question: 'What is projectile motion in classical mechanics?',
    options: [
      'Motion in a straight line with constantly increasing acceleration',
      'Two-dimensional motion under the sole influence of gravity, neglecting air resistance',
      'Circular motion governed by a central centripetal force',
      'One-dimensional vertical free fall with zero initial velocity'
    ],
    correctIndex: 1,
    explanation: 'A projectile is launched into space and follows a parabolic trajectory governed solely by downward gravitational acceleration g, with zero horizontal acceleration when drag is neglected.'
  },
  {
    id: 'pq-2',
    question: 'When air resistance is neglected, what happens to the horizontal component of velocity (uₓ) during flight?',
    options: [
      'It steadily decreases to zero at the highest point',
      'It increases continuously due to gravity',
      'It remains strictly constant throughout the entire flight',
      'It fluctuates sinusoidally with time'
    ],
    correctIndex: 2,
    explanation: 'Because gravity acts strictly in the vertical direction (aᵧ = -g) and there are no horizontal forces (aₓ = 0), the horizontal velocity vₓ = u cos(θ) remains unchanged throughout the motion.'
  },
  {
    id: 'pq-3',
    question: 'What is the theoretical formula for the horizontal range (R) when launch and landing heights are equal?',
    options: [
      'R = (u² · sin²(θ)) / (2g)',
      'R = (2u · sin(θ)) / g',
      'R = (u² · sin(2θ)) / g',
      'R = (u · cos(θ)) / g'
    ],
    correctIndex: 2,
    explanation: 'Horizontal range is given by R = uₓ · T = (u cos θ) · (2u sin θ / g) = (u² · 2 sin θ cos θ) / g = u² sin(2θ) / g.'
  },
  {
    id: 'pq-4',
    question: 'For a fixed initial velocity under ideal conditions (equal heights, no drag), at what projection angle is horizontal range maximum?',
    options: [
      '30°',
      '45°',
      '60°',
      '90°'
    ],
    correctIndex: 1,
    explanation: 'Since R = (u²/g) · sin(2θ), maximum range occurs when sin(2θ) is maximized (sin(2θ) = 1), which occurs at 2θ = 90° or θ = 45°.'
  },
  {
    id: 'pq-5',
    question: 'What happens to the trajectory if the initial launch velocity (u) is doubled while keeping the angle θ constant?',
    options: [
      'Both range and maximum height double',
      'Range doubles, but maximum height quadruples',
      'Both horizontal range and maximum height quadruple (4×)',
      'Flight time quadruples while range doubles'
    ],
    correctIndex: 2,
    explanation: 'Both maximum height H = u²sin²θ/(2g) and horizontal range R = u²sin(2θ)/g depend on the square of initial velocity (u²). Doubling u increases both H and R by a factor of 2² = 4.'
  }
];

export const CONSTANT_ANALYSIS_VELOCITY = 20; // m/s

export const STANDARD_ANGLE_TRIALS = [
  {
    id: 'proj-obs-std-15',
    srNo: 1,
    velocity: 20,
    angle: 15,
    timeOfFlight: 1.05,
    maxHeight: 1.37,
    range: 20.39,
    timestamp: 1700000001000,
  },
  {
    id: 'proj-obs-std-30',
    srNo: 2,
    velocity: 20,
    angle: 30,
    timeOfFlight: 2.04,
    maxHeight: 5.10,
    range: 35.31,
    timestamp: 1700000002000,
  },
  {
    id: 'proj-obs-std-45',
    srNo: 3,
    velocity: 20,
    angle: 45,
    timeOfFlight: 2.88,
    maxHeight: 10.19,
    range: 40.77,
    timestamp: 1700000003000,
  },
  {
    id: 'proj-obs-std-60',
    srNo: 4,
    velocity: 20,
    angle: 60,
    timeOfFlight: 3.53,
    maxHeight: 15.29,
    range: 35.31,
    timestamp: 1700000004000,
  },
  {
    id: 'proj-obs-std-75',
    srNo: 5,
    velocity: 20,
    angle: 75,
    timeOfFlight: 3.94,
    maxHeight: 19.02,
    range: 20.39,
    timestamp: 1700000005000,
  },
];

export const PROJECTILE_VIVA: VivaQuestionItem[] = [
  {
    id: 'pv-1',
    question: 'What is projectile motion and what shape does its path take?',
    answer: 'Projectile motion is the two-dimensional motion of an object thrown obliquely into the air that moves under gravity alone. Its trajectory is a parabola, derived from eliminating time t between x = (u cos θ)t and y = (u sin θ)t - ½gt² to yield y = x tan θ - gx²/(2u² cos²θ).',
    concept: 'Kinematic Definition & Trajectory Equation'
  },
  {
    id: 'pv-2',
    question: 'What are the horizontal and vertical components of the initial velocity?',
    answer: 'For a launch speed u at angle θ above the horizontal, the initial horizontal component is uₓ = u cos(θ) and the vertical component is uᵧ = u sin(θ). uₓ remains constant while uᵧ decreases at rate g.',
    concept: 'Vector Resolution of Velocity'
  },
  {
    id: 'pv-3',
    question: 'How is the total time of flight (T) derived?',
    answer: 'The projectile returns to ground level when y = 0. Setting y = (u sin θ)T - ½gT² = 0 gives T(u sin θ - ½gT) = 0. Discounting launch instant T = 0 gives T = (2u sin θ) / g.',
    concept: 'Time of Flight Derivation'
  },
  {
    id: 'pv-4',
    question: 'What is the formula for maximum height (H) and where does it occur?',
    answer: 'At the apex of the trajectory, vertical velocity momentarily becomes zero: vᵧ = 0. Using vᵧ² = uᵧ² - 2gH gives 0 = (u sin θ)² - 2gH, yielding H = (u² sin²θ) / (2g). This occurs at half the total flight time t = T/2.',
    concept: 'Apex Kinematics & Maximum Height'
  },
  {
    id: 'pv-5',
    question: 'Why do complementary angles (e.g. 30° and 60°) produce the identical horizontal range?',
    answer: 'Range depends on sin(2θ). For complementary angle (90° - θ), sin(2(90° - θ)) = sin(180° - 2θ) = sin(2θ). Therefore, pairs such as 15° and 75°, or 30° and 60°, land at the exact same horizontal distance, though the higher angle has greater peak altitude and longer flight time.',
    concept: 'Complementary Angle Symmetry'
  },
  {
    id: 'pv-6',
    question: 'What simplifying assumptions are made in the ideal projectile-motion model?',
    answer: 'The ideal model assumes: (1) Air resistance and aerodynamic lift are negligible; (2) Gravitational acceleration g is constant in magnitude and direction; (3) Earth curvature and rotation (Coriolis force) are negligible; and (4) Launch and landing heights are identical.',
    concept: 'Ideal Physical Assumptions'
  }
];
