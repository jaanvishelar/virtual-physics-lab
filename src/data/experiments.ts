import { Experiment } from '../types';

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-01',
    number: '01',
    slug: 'ohms-law',
    title: "Ohm's Law & Resistance",
    classes: 'Classes 9–12',
    category: 'Current Electricity & Circuitry',
    description:
      'Verify the direct proportionality between potential difference and electric current through a conductor at constant temperature, and calculate resistance.',
    aim: 'To determine the resistance per unit length of a given wire by plotting a graph of potential difference versus current (V vs I).',
    formula: 'V = I · R  ⇒  R = V / I',
    formulaMeaning: 'V = Potential difference across conductor (Volts), I = Current flowing through conductor (Amperes), R = Electrical Resistance (Ohms, Ω)',
    apparatus: [
      'Virtual DC Power Supply',
      'Virtual Resistance Wire',
      'Virtual Voltmeter',
      'Virtual Ammeter',
      'Virtual Rheostat',
      'Virtual Circuit Key'
    ],
    variables: {
      independent: 'Current (I) adjusted via rheostat',
      dependent: 'Potential Difference (V) measured across wire',
      controlled: 'Wire length, cross-sectional area, temperature'
    },
    observationHeaders: ['Trial No.', 'Ammeter Reading I (A)', 'Voltmeter Reading V (V)', 'Calculated R = V/I (Ω)', 'Deviation (Ω)'],
    sampleObservations: [
      { 'Trial No.': '1', 'Ammeter Reading I (A)': '0.20', 'Voltmeter Reading V (V)': '0.64', 'Calculated R = V/I (Ω)': '3.20', 'Deviation (Ω)': '0.00' },
      { 'Trial No.': '2', 'Ammeter Reading I (A)': '0.40', 'Voltmeter Reading V (V)': '1.28', 'Calculated R = V/I (Ω)': '3.20', 'Deviation (Ω)': '0.00' },
      { 'Trial No.': '3', 'Ammeter Reading I (A)': '0.60', 'Voltmeter Reading V (V)': '1.92', 'Calculated R = V/I (Ω)': '3.20', 'Deviation (Ω)': '0.00' },
      { 'Trial No.': '4', 'Ammeter Reading I (A)': '0.80', 'Voltmeter Reading V (V)': '2.56', 'Calculated R = V/I (Ω)': '3.20', 'Deviation (Ω)': '0.00' },
    ],
    graphType: 'Linear V vs I plot passing through origin (slope = Resistance R)',
    precautions: [
      'Clean terminal contacts with sandpaper before connecting to eliminate contact resistance.',
      'Always connect the ammeter in series and voltmeter in parallel with the test resistor.',
      'Insert key only while taking observations to avoid heating of the resistance wire.',
      'Ensure zero error is recorded and corrected for both meters.'
    ],
    vivaQuestions: [
      {
        q: 'Why does the temperature of the conductor need to remain constant?',
        a: 'The resistance of metallic conductors increases with temperature due to increased lattice vibrations. A constant temperature ensures a strictly linear V-I relation.'
      },
      {
        q: 'Why is an ammeter connected in series and a voltmeter in parallel?',
        a: 'An ammeter has very low internal resistance so it does not alter the circuit current. A voltmeter has very high internal resistance so it draws negligible current from the branch.'
      }
    ]
  },
  {
    id: 'exp-02',
    number: '02',
    slug: 'simple-pendulum',
    title: 'Simple Pendulum & Acceleration Due to Gravity',
    classes: 'Classes 9–11',
    category: 'Mechanics & Oscillations',
    description:
      'Determine the acceleration due to gravity (g) using a simple pendulum simulation and analyze the T²–L relationship to estimate the experimental value of g.',
    aim: 'To determine the acceleration due to gravity (g) using a simple pendulum simulation and plot length (L) versus the square of time period (T²).',
    formula: 'T = 2π √(L / g)  ⇒  g = 4π² (L / T²)',
    formulaMeaning: 'T = Periodic time for 1 oscillation (s), L = Effective length of pendulum from suspension to center of mass (m), g = Acceleration due to gravity (9.81 m/s²)',
    apparatus: [
      'Virtual Pendulum Bob',
      'Virtual Suspension Stand',
      'Adjustable Length Control',
      'Virtual Stopwatch Timer',
      'Oscillation Counter',
      'Angular Displacement Scale'
    ],
    variables: {
      independent: 'Effective length of pendulum (L = thread length + hook length + radius of bob)',
      dependent: 'Time period for 20 oscillations (t) and single oscillation period (T)',
      controlled: 'Bob mass, small angular amplitude (< 5°), still air environment'
    },
    observationHeaders: ['Length L (cm)', 'Time for 20 Osc. t₁ (s)', 'Time for 20 Osc. t₂ (s)', 'Mean t (s)', 'Period T = t/20 (s)', 'T² (s²)', 'L / T² (cm/s²)'],
    sampleObservations: [
      { 'Length L (cm)': '60.0', 'Time for 20 Osc. t₁ (s)': '31.10', 'Time for 20 Osc. t₂ (s)': '31.14', 'Mean t (s)': '31.12', 'Period T = t/20 (s)': '1.556', 'T² (s²)': '2.421', 'L / T² (cm/s²)': '24.78' },
      { 'Length L (cm)': '70.0', 'Time for 20 Osc. t₁ (s)': '33.56', 'Time for 20 Osc. t₂ (s)': '33.60', 'Mean t (s)': '33.58', 'Period T = t/20 (s)': '1.679', 'T² (s²)': '2.819', 'L / T² (cm/s²)': '24.83' },
      { 'Length L (cm)': '80.0', 'Time for 20 Osc. t₁ (s)': '35.88', 'Time for 20 Osc. t₂ (s)': '35.92', 'Mean t (s)': '35.90', 'Period T = t/20 (s)': '1.795', 'T² (s²)': '3.222', 'L / T² (cm/s²)': '24.83' }
    ],
    graphType: 'L vs T² linear straight line graph through origin (slope = g / 4π²)',
    precautions: [
      'Amplitude of swing must be kept small (less than 4° to 5°) so sin(θ) ≈ θ holds true.',
      'Ensure the bob swings in a clean vertical plane without conical rotation.',
      'Measure effective length from rigid point of suspension to the center of gravity of the bob.'
    ],
    vivaQuestions: [
      {
        q: 'Does the time period of a simple pendulum depend on the mass of the bob?',
        a: 'No. The period formula T = 2π√(L/g) is independent of the bob mass, provided the dimensions of the bob are negligible compared to string length.'
      },
      {
        q: 'Why should the angular displacement be kept small?',
        a: 'The simple harmonic motion approximation applies only when sin(θ) ≈ θ in radians, valid when θ is small.'
      }
    ]
  },
  {
    id: 'exp-03',
    number: '03',
    slug: 'hookes-law',
    title: "Hooke's Law & Spring Constant",
    classes: 'Classes 9–11',
    category: 'Elasticity & Material Properties',
    description:
      'Investigate the relationship between load suspended from a helical spring and the resulting elongation within its elastic limit, and determine spring constant k.',
    aim: 'To determine the spring constant (k) of a helical spring by plotting a load versus extension graph (F vs x).',
    formula: 'F = k · x  ⇒  k = ΔF / Δx = (Δm · g) / Δx',
    formulaMeaning: 'F = Applied force (N), k = Spring stiffness constant (N/m), x = Extension produced in spring (m), m = Suspended mass (kg), g = 9.81 m/s²',
    apparatus: [
      'Virtual Helical Spring',
      'Virtual Rigid Stand',
      'Slotted Mass Selector',
      'Virtual Millimeter Scale',
      'Deflection Pointer'
    ],
    variables: {
      independent: 'Mass added to hanger (m in grams/kg)',
      dependent: 'Extension / elongation of spring (x in cm/meters)',
      controlled: 'Spring material, initial unloaded equilibrium length, ambient temperature'
    },
    observationHeaders: ['Load on Hanger m (g)', 'Pointer Reading Loading (cm)', 'Pointer Reading Unloading (cm)', 'Mean Reading (cm)', 'Extension x (cm)', 'k = mg/x (N/m)'],
    sampleObservations: [
      { 'Load on Hanger m (g)': '50', 'Pointer Reading Loading (cm)': '14.2', 'Pointer Reading Unloading (cm)': '14.2', 'Mean Reading (cm)': '14.2', 'Extension x (cm)': '2.1', 'k = mg/x (N/m)': '23.3' },
      { 'Load on Hanger m (g)': '100', 'Pointer Reading Loading (cm)': '16.3', 'Pointer Reading Unloading (cm)': '16.3', 'Mean Reading (cm)': '16.3', 'Extension x (cm)': '4.2', 'k = mg/x (N/m)': '23.3' },
      { 'Load on Hanger m (g)': '150', 'Pointer Reading Loading (cm)': '18.4', 'Pointer Reading Unloading (cm)': '18.4', 'Mean Reading (cm)': '18.4', 'Extension x (cm)': '6.3', 'k = mg/x (N/m)': '23.3' }
    ],
    graphType: 'Load (F) vs Extension (x) straight line graph passing through origin (slope = spring constant k)',
    precautions: [
      'Do not load the spring beyond its elastic limit, which would cause permanent deformation.',
      'Record pointer readings both during progressive loading and unloading to verify absence of hysteresis.',
      'Ensure the pointer moves freely along the scale without scraping against the ruler.'
    ],
    vivaQuestions: [
      {
        q: 'What is the elastic limit of a spring?',
        a: 'The maximum stress or tensile force that a spring can withstand without suffering permanent plastic deformation.'
      },
      {
        q: 'What does the slope of a Force vs Extension graph represent?',
        a: 'The slope (ΔF / Δx) represents the spring constant k (stiffness) in Newtons per meter.'
      }
    ]
  },
  {
    id: 'exp-04',
    number: '04',
    slug: 'projectile-motion',
    title: 'Projectile Motion — Range & Trajectory',
    classes: 'Classes 11–12',
    category: 'Mechanics • Kinematics',
    description:
      'Analyze two-dimensional parabolic trajectory under constant gravity (g = 9.81 m/s²), relating launch angle and initial velocity to time of flight, maximum height, and horizontal range.',
    aim: 'To study the trajectory of a projectile and investigate how its range depends on the initial velocity and angle of projection.',
    formula: 'R = (u² · sin(2θ)) / g  |  H = (u² · sin²θ) / (2g)  |  T = (2u · sinθ) / g',
    formulaMeaning: 'R = Horizontal Range (m), H = Maximum Height (m), T = Time of Flight (s), u = Initial Velocity (m/s), θ = Angle of Projection (°), g = 9.81 m/s²',
    apparatus: [
      'Virtual Projectile Launcher',
      'Virtual Projectile',
      'Interactive Angle Control',
      'Coordinate Grid',
      'Virtual Timer',
      'Measurement Panel'
    ],
    variables: {
      independent: 'Angle of projection θ (15°, 30°, 45°, 60°, 75°) and initial velocity u',
      dependent: 'Horizontal range R, maximum height H, and total time of flight T',
      controlled: 'Earth gravitational acceleration g = 9.81 m/s², launch and landing height datum (y₀ = y = 0 m)'
    },
    observationHeaders: ['Trial No.', 'Velocity u (m/s)', 'Angle θ (°)', 'Flight Time T (s)', 'Max Height H (m)', 'Range R (m)'],
    sampleObservations: [
      { 'Trial No.': '1', 'Velocity u (m/s)': '20.0', 'Angle θ (°)': '15', 'Flight Time T (s)': '1.05', 'Max Height H (m)': '1.36', 'Range R (m)': '20.39' },
      { 'Trial No.': '2', 'Velocity u (m/s)': '20.0', 'Angle θ (°)': '30', 'Flight Time T (s)': '2.04', 'Max Height H (m)': '5.10', 'Range R (m)': '35.31' },
      { 'Trial No.': '3', 'Velocity u (m/s)': '20.0', 'Angle θ (°)': '45', 'Flight Time T (s)': '2.88', 'Max Height H (m)': '10.19', 'Range R (m)': '40.77' },
      { 'Trial No.': '4', 'Velocity u (m/s)': '20.0', 'Angle θ (°)': '60', 'Flight Time T (s)': '3.53', 'Max Height H (m)': '15.29', 'Range R (m)': '35.31' },
      { 'Trial No.': '5', 'Velocity u (m/s)': '20.0', 'Angle θ (°)': '75', 'Flight Time T (s)': '3.94', 'Max Height H (m)': '19.01', 'Range R (m)': '20.39' }
    ],
    graphType: 'Non-linear sinusoidal Range R vs Angle θ curve peaking at approximately 45°',
    precautions: [
      'Ensure launch and landing heights are strictly equal (y₀ = y = 0 m).',
      'Keep initial velocity u constant across all angle trials for a given series.',
      'Record actual simulated coordinates after projectile completes touchdown.'
    ],
    vivaQuestions: [
      {
        q: 'Why do complementary launch angles (e.g. 30° and 60°) produce the same horizontal range?',
        a: 'Because sin(2θ) = sin(2(90° - θ)) = sin(180° - 2θ) = sin(2θ). While the range is identical, the 60° trajectory achieves higher peak elevation and longer flight time.'
      },
      {
        q: 'At what angle is maximum horizontal range achieved on flat ground?',
        a: 'At 45°, because sin(2 · 45°) = sin(90°) = 1, which is the maximum possible value of the sine function.'
      }
    ]
  },
  {
    id: 'exp-05',
    number: '05',
    slug: 'convex-lens',
    title: 'Convex Lens & Focal Length',
    classes: 'Classes 10–12',
    category: 'Ray Optics',
    description:
      'Determine the focal length of a convex lens by measuring object distance (u) and image distance (v), and verify the lens formula.',
    aim: 'To determine the focal length of a convex lens by measuring the object distance and corresponding image distance, and to verify the lens formula.',
    formula: '1/f = 1/v - 1/u',
    formulaMeaning: 'f = Focal length of convex lens, u = Object distance from optical center (u < 0), v = Image distance from optical center (v > 0 for real image)',
    apparatus: [
      'Virtual Optical Bench',
      'Convex Lens',
      'Lens Stand',
      'Illuminated Object / Object Arrow',
      'Screen',
      'Distance Scale',
      'Object Position Control',
      'Screen Position Control',
      'Measurement Panel'
    ],
    variables: {
      independent: 'Object distance (u) from optical center of lens',
      dependent: 'Real image distance (v) focused on the screen',
      controlled: 'Lens focal length (f = +20.0 cm), paraxial alignment along optical axis'
    },
    observationHeaders: ['Trial', 'u (cm)', 'v (cm)', '1/u (cm⁻¹)', '1/v (cm⁻¹)', 'f (cm)', 'm = v/u', 'Image Nature'],
    sampleObservations: [
      { 'Trial': '1', 'u (cm)': '-60.0', 'v (cm)': '+30.0', '1/u (cm⁻¹)': '-0.0167', '1/v (cm⁻¹)': '+0.0333', 'f (cm)': '20.00', 'm = v/u': '-0.50', 'Image Nature': 'Real, Inverted, Diminished' },
      { 'Trial': '2', 'u (cm)': '-50.0', 'v (cm)': '+33.33', '1/u (cm⁻¹)': '-0.0200', '1/v (cm⁻¹)': '+0.0300', 'f (cm)': '20.00', 'm = v/u': '-0.67', 'Image Nature': 'Real, Inverted, Diminished' },
      { 'Trial': '3', 'u (cm)': '-40.0', 'v (cm)': '+40.0', '1/u (cm⁻¹)': '-0.0250', '1/v (cm⁻¹)': '+0.0250', 'f (cm)': '20.00', 'm = v/u': '-1.00', 'Image Nature': 'Real, Inverted, Same Size' },
      { 'Trial': '4', 'u (cm)': '-30.0', 'v (cm)': '+60.0', '1/u (cm⁻¹)': '-0.0333', '1/v (cm⁻¹)': '+0.0167', 'f (cm)': '20.00', 'm = v/u': '-2.00', 'Image Nature': 'Real, Inverted, Magnified' }
    ],
    graphType: 'Linear graph of 1/v versus 1/u with slope = 1 and Y-intercept = 1/f',
    precautions: [
      'Use consistent units (centimetres throughout) in all calculations.',
      'Follow the Cartesian sign convention consistently: u < 0, v > 0 for real image, f > 0.',
      'Measure all distances strictly from the optical center of the lens.',
      'Keep the object, lens, and screen aligned with the principal axis.',
      'Obtain a sharp image before recording the image distance v.'
    ],
    vivaQuestions: [
      {
        q: 'What is the thin-lens formula under the Cartesian sign convention?',
        a: 'The thin-lens formula is 1/f = 1/v − 1/u, where u is the signed object distance (negative for real object), v is the signed image distance (positive for real image), and f is the positive focal length for a convex lens.'
      },
      {
        q: 'What does the Y-intercept represent in a graph of 1/v vs 1/u for a convex lens?',
        a: 'Rearranging the lens equation gives 1/v = (1)·(1/u) + (1/f). The graph is a straight line of slope 1, and the Y-intercept represents 1/f. Thus, the experimental focal length is 1/intercept.'
      }
    ]
  }
];
