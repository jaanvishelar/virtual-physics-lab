import { QuizQuestion, VivaQuestionItem, ApparatusDetail } from '../types';

export const PROJECTILE_MOTION_INFO = {
  header: {
    expNumber: '04',
    classes: 'Class 11',
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
    title: 'Ensure Launch and Landing Heights are Clearly Identified',
    description: 'Ensure launch and landing heights are clearly identified; distinguish whether the projectile lands on flat ground (y = 0) or whether an elevated datum (h > 0) is being investigated.'
  },
  {
    title: 'Convert Angles to Radians before Applying Trigonometric Functions',
    description: 'Convert angles to radians before applying trigonometric functions in calculations: θ_rad = θ_deg × (π / 180).'
  },
  {
    title: 'Keep Velocity Constant when Testing the Effect of Angle',
    description: 'When investigating the effect of launch angle θ on horizontal range R, keep the initial velocity u strictly constant across all angle trials (e.g. u = 20 m/s).'
  },
  {
    title: 'Keep Angle Constant when Testing the Effect of Height',
    description: 'When investigating the effect of launch height h on time of flight and range, keep the launch angle θ and initial velocity u strictly constant (e.g. θ = 45°, u = 20 m/s).'
  },
  {
    title: 'Use Consistent Units',
    description: 'Always maintain consistent SI units: velocity in m/s, time in s, angles in degrees/radians, heights and ranges in m, and gravity in m/s².'
  },
  {
    title: 'Distinguish Ground Height from Launch Point Height',
    description: 'Distinguish between maximum height above the ground H_ground = h + u²sin²θ/(2g) and maximum height above the launch point H_launch = u²sin²θ/(2g).'
  },
  {
    title: 'Systematic Sampling across Quadrant',
    description: 'Test complementary angles (15° & 75°, 30° & 60°) to observe range symmetry on flat terrain.'
  }
];

export const PROJECTILE_COMMON_ERRORS = [
  {
    name: 'Air Resistance Neglected in Simulation',
    cause: 'In this idealized educational simulation, air resistance is neglected. In reality, wind and aerodynamic air drag can reduce horizontal range and peak height considerably.',
    prevention: 'Understand that virtual physics simulations demonstrate fundamental laws under vacuum approximations; real-world projectiles experience drag.'
  },
  {
    name: 'Real-World Floor Height Variations',
    cause: 'Assuming every real building has exactly 12 m between ground and 4th floor.',
    prevention: 'Recognize that a 4th floor is only approximately 12 m (assuming ~3 m per floor), and real architecture varies.'
  },
  {
    name: 'Angle Measurement Errors in Physical Setups',
    cause: 'Small physical protractor alignment errors or reading angle against vertical normal instead of horizontal ground.',
    prevention: 'Verify angle relative to horizontal ground line; small deviations near 45° significantly change range.'
  },
  {
    name: 'Ground Irregularities & Terrain Slope',
    cause: 'Assuming physical test fields are mathematically flat datums.',
    prevention: 'Real-world ground irregularities can affect impact times and landing positions.'
  },
  {
    name: 'Confusing Maximum Height Datum',
    cause: 'Reporting peak height above launch level when asked for peak height above the ground datum.',
    prevention: 'Remember H_ground = h + (u·sinθ)²/(2g), which includes the elevated launch tower height h.'
  },
  {
    name: 'Attempting Linear Regression on Range vs Angle',
    cause: 'Assuming range increases linearly with projection angle.',
    prevention: 'Range follows a sinusoidal curve R(θ) ∝ sin(2θ), peaking at 45° for level ground; linear slope calculation is physically invalid.'
  }
];

export const PROJECTILE_QUIZ: QuizQuestion[] = [
  {
    id: 'pq-1',
    question: 'What happens to the horizontal component of velocity during ideal projectile motion?',
    options: [
      'It steadily decreases to zero at the maximum height',
      'It increases continuously due to downward gravitational acceleration',
      'It remains strictly constant throughout the entire flight',
      'It oscillates sinusoidally with the angle of elevation'
    ],
    correctIndex: 2,
    explanation: 'Because gravity acts strictly downwards (ay = -g) and air drag is neglected (ax = 0), there is no horizontal acceleration. Thus, the horizontal velocity ux = u cos(θ) remains strictly constant throughout flight.'
  },
  {
    id: 'pq-2',
    question: 'What happens to the vertical velocity at maximum height?',
    options: [
      'It reaches its maximum positive value',
      'It becomes momentarily zero (vy = 0)',
      'It becomes equal to the launch speed u',
      'It reverses direction instantaneously without reaching zero'
    ],
    correctIndex: 1,
    explanation: 'As the projectile ascends, downward gravitational acceleration decelerates the vertical velocity until vy = 0 at the highest point (apex), after which the projectile begins accelerating downwards.'
  },
  {
    id: 'pq-3',
    question: 'What is the effect of increasing launch height?',
    options: [
      'It decreases both time of flight and horizontal range',
      'It increases both the time of flight and the horizontal range for the same initial velocity and angle',
      'It only increases maximum height but has zero effect on flight duration',
      'It causes the trajectory to become linear instead of parabolic'
    ],
    correctIndex: 1,
    explanation: 'Launching from an elevated platform (h > 0) means the projectile has extra vertical distance to descend to reach the ground datum (y = 0). This extends flight duration and increases total horizontal range.'
  },
  {
    id: 'pq-4',
    question: 'Under what condition does 45 degrees give maximum range?',
    options: [
      'Under all launch conditions regardless of elevation or air drag',
      'When launch and landing heights are equal and air resistance is neglected',
      'Only when launching from high elevation cliffs into deep valleys',
      'Only when gravitational acceleration g is equal to zero'
    ],
    correctIndex: 1,
    explanation: 'The standard range formula R = (u²/g) sin(2θ) peaks at θ = 45° because sin(90°) = 1. This applies strictly when launch and landing heights are equal (y0 = y = 0) and air drag is negligible.'
  },
  {
    id: 'pq-5',
    question: 'Which equation is used for vertical displacement when launch height is non-zero?',
    options: [
      'y(t) = h + u·sin(θ)·t − ½·g·t²',
      'y(t) = u·sin(θ)·t − ½·g·t²',
      'y(t) = h + u·cos(θ)·t',
      'y(t) = h − g·t'
    ],
    correctIndex: 0,
    explanation: 'When launching from an initial elevation h above the ground datum, the vertical kinematic equation is y(t) = h + uy·t - ½gt² = h + u sin(θ) t - ½ g t².'
  },
  {
    id: 'pq-6',
    question: 'What happens to time of flight when launch height is increased while other parameters remain fixed?',
    options: [
      'Time of flight increases because the projectile must descend an extra vertical distance to reach ground level',
      'Time of flight decreases because gravity pulls harder from greater heights',
      'Time of flight remains unchanged because vertical launch velocity is fixed',
      'Time of flight becomes zero as landing occurs immediately'
    ],
    correctIndex: 0,
    explanation: 'Solving ½gt² − u sin(θ)t − h = 0 shows that increasing launch height h increases the positive time root, extending the duration of flight before touchdown at y = 0.'
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
    question: 'What is projectile motion?',
    answer: 'Projectile motion is the two-dimensional motion of an object projected into the air with an initial velocity at an angle to the horizontal, moving under the constant downward acceleration of gravity alone while neglecting air resistance.',
    concept: 'Kinematic Definition'
  },
  {
    id: 'pv-2',
    question: 'What are the horizontal and vertical components of velocity?',
    answer: 'For a launch speed u at angle θ above the horizontal, the initial horizontal component is ux = u cos(θ) and the initial vertical component is uy = u sin(θ). In ideal motion, ux remains constant while uy changes at rate -g.',
    concept: 'Vector Resolution of Velocity'
  },
  {
    id: 'pv-3',
    question: 'Why is the horizontal velocity constant in ideal projectile motion?',
    answer: 'Because gravity acts solely in the downward vertical direction (ay = -g) and air resistance is neglected, there is no horizontal force acting on the projectile (Fx = 0, ax = 0). By Newton\'s first law of motion, the horizontal velocity ux remains strictly constant throughout the flight.',
    concept: 'Newtonian Force & Acceleration'
  },
  {
    id: 'pv-4',
    question: 'Why does the vertical velocity become zero at maximum height?',
    answer: 'As the projectile ascends, the downward gravitational acceleration g decelerates the upward vertical velocity uy. At the trajectory vertex (maximum height H), the vertical velocity momentarily drops to zero (vy = 0) before the projectile begins its downward descent.',
    concept: 'Apex Kinematics'
  },
  {
    id: 'pv-5',
    question: 'What is the significance of 45 degrees?',
    answer: 'For equal launch and landing heights (y0 = y = 0) in the absence of air drag, horizontal range is given by R = (u²/g) sin(2θ). Because the maximum value of sin(2θ) is 1.0 when 2θ = 90°, the projection angle that yields maximum horizontal range is θ = 45°.',
    concept: 'Equal-Height Optimal Angle'
  },
  {
    id: 'pv-6',
    question: 'Does 45 degrees always give maximum range?',
    answer: 'No. The 45° rule applies strictly when launch and landing heights are identical and air drag is neglected. When launched from an elevation (h > 0), the optimal angle for maximum range drops below 45° (typically 35°–42° depending on launch height and speed) because the projectile has extra time to travel forward while falling.',
    concept: 'Elevated Launch Departure'
  },
  {
    id: 'pv-7',
    question: 'What changes when the projectile is launched from a height?',
    answer: 'When launched from a height h > 0, the projectile lands at a level below its launch point (y = 0 while y0 = h). This alters the landing condition: time of flight must be solved from ½gt² - (u sin θ)t - h = 0, extending flight duration, increasing horizontal range, and shifting the maximum height above ground to H_ground = h + (u² sin²θ)/(2g).',
    concept: 'Elevated Vertical Displacement'
  },
  {
    id: 'pv-8',
    question: 'Why does an elevated projectile generally remain in the air longer?',
    answer: 'Because the projectile does not touch down when it returns to its launch elevation (y = h); it continues falling through the additional vertical distance h to reach the ground datum (y = 0), adding extra flight time Δt during which it continues traveling horizontally.',
    concept: 'Extended Flight Duration'
  },
  {
    id: 'pv-9',
    question: 'What assumptions are made in ideal projectile motion?',
    answer: 'The ideal model assumes: (1) Air resistance and aerodynamic drag are negligible, (2) Acceleration due to gravity g is constant in magnitude and direction (9.81 m/s²), (3) Earth curvature and rotational Coriolis effects are negligible, and (4) The projectile is treated as a point mass without aerodynamic lift or spin.',
    concept: 'Ideal Physical Assumptions'
  }
];
