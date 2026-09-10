import { QuizQuestion, VivaQuestionItem, ApparatusDetail } from '../types';

export const HOOKES_LAW_INFO = {
  id: 'hookes-law',
  title: "Hooke's Law — Verification & Spring Constant",
  tagline: "Verification of Linear Elasticity & Determination of Spring Constant",
  classes: 'Classes 9–11',
  category: 'Elasticity & Material Properties',
  aim: "To verify Hooke's Law by studying the relationship between the applied force and extension produced in a spring, and to determine the spring constant.",
  theory: {
    statement:
      "Hooke's Law states that, within the elastic limit, the extension produced in a spring is directly proportional to the applied force. As load is suspended from a vertical helical spring, the downward gravitational force acts as tensile stress, elongating the spring until restoring elastic force balances the weight.",
    formula: "F = k · x",
    rearranged: "k = F / x",
    slopeRelation: "Slope (ΔF / Δx) = k",
    units: "F in Newtons (N), x in metres (m), k in Newtons per metre (N/m)",
    elasticLimitNote:
      "Hooke's Law is valid only within the elastic limit of the spring. Beyond this limit, permanent deformation occurs and the force-extension relationship becomes non-linear."
  },
  constants: {
    theoreticalK: 20.0, // N/m
    g: 9.81 // m/s²
  }
};

export const HOOKES_LAW_APPARATUS: ApparatusDetail[] = [
  {
    id: 'retort-stand',
    name: 'Retort Stand with Clamp',
    role: 'Provides a rigid, vibration-free fixed support from which the upper end of the helical spring is suspended vertically.',
    connectionType: 'Power',
    spec: 'Cast-iron heavy rectangular base, 60 cm chrome vertical rod, universal clamp'
  },
  {
    id: 'helical-spring',
    name: 'Helical Spring',
    role: 'Uniform elastic steel/brass coil that undergoes linear tensile elongation upon application of suspended loads.',
    connectionType: 'Series',
    spec: 'Closely coiled steel wire, unloaded length ~12 cm, nominal stiffness k ≈ 20 N/m'
  },
  {
    id: 'weight-hanger',
    name: 'Slotted Masses & Hanger',
    role: 'Calibrated deadweights suspended from the lower hook of the spring to exert known downward gravitational force F = mg.',
    connectionType: 'Series',
    spec: 'Lightweight hanger with 50 g, 100 g, 150 g, 200 g, 250 g, 300 g slotted disc masses'
  },
  {
    id: 'metre-scale',
    name: 'Vertical Metre Scale',
    role: 'Rigid measuring rule mounted parallel to the spring to accurately determine the pointer position before and after loading.',
    connectionType: 'Conductor',
    spec: '0–50 cm scale graduated in 1 mm (0.1 cm) divisions with high-contrast markings'
  },
  {
    id: 'pointer',
    name: 'Index Pointer with Reference Mirror',
    role: 'Lightweight horizontal needle clamped to the bottom coil indicating exact position on the scale with parallax elimination.',
    connectionType: 'Control',
    spec: 'Aluminum pointer with anti-parallax mirrored scale backing'
  }
];

export const HOOKES_LAW_PROCEDURE: string[] = [
  "Suspend the helical spring vertically from the clamp of the rigid retort stand.",
  "Attach the lightweight index pointer to the lower loop of the spring, ensuring it moves freely along the vertical scale without rubbing.",
  "Align the vertical metre scale strictly parallel to the axis of the spring.",
  "Record the initial position of the pointer on the scale with no mass attached. This constitutes the zero/reference reading (x₀).",
  "Suspend a known mass (e.g., 50 g hanger) gently from the lower hook of the spring.",
  "Wait for vertical oscillations to dampen completely so that the suspended mass hangs in static equilibrium.",
  "Read the new position of the pointer on the scale, keeping the eye at the exact horizontal level of the pointer tip to avoid parallax error.",
  "Calculate the extension x = (pointer reading - reference reading x₀) in both centimetres and metres.",
  "Calculate the applied downward force using F = mg, taking g = 9.81 m/s² and mass in kilograms (m = grams / 1000).",
  "Record the observation in the laboratory table and calculate the individual stiffness ratio k = F / x for non-zero loads.",
  "Increase the load in progressive increments (e.g., 100 g, 150 g, 200 g, 250 g, 300 g) and record the corresponding extension at each step.",
  "Plot a Cartesian graph taking Extension (x in m) on the X-axis and Applied Force (F in N) on the Y-axis.",
  "Draw the least-squares line of best fit, evaluate the slope (m = ΔF/Δx), and confirm that the slope equals the experimental spring constant k."
];

export const HOOKES_LAW_PRECAUTIONS = [
  {
    title: 'Stay Within Elastic Limit',
    description: 'Do not overload the spring beyond its designed elastic limit, as permanent plastic deformation will destroy linearity.'
  },
  {
    title: 'Add Loads Gradually',
    description: 'Place slotted weights onto the hanger gently without dropping or jerking to avoid sudden dynamic shock loads.'
  },
  {
    title: 'Measure from Unloaded Reference',
    description: 'Always measure extension strictly relative to the zero-load pointer position, rather than recording total spring length.'
  },
  {
    title: 'Ensure True Vertical Alignment',
    description: 'Both the spring and the measuring scale must be kept strictly vertical and parallel to eliminate trigonometric skew.'
  },
  {
    title: 'Avoid Lateral Oscillations',
    description: 'Ensure the hanger does not swing like a pendulum; damp any horizontal or conical motion before taking a reading.'
  },
  {
    title: 'Allow Spring to Settle',
    description: 'Wait until the spring is completely at rest in static equilibrium before reading the pointer position.'
  },
  {
    title: 'Eliminate Parallax Error',
    description: 'Keep your line of sight strictly horizontal with the pointer tip and align it with its reflection on the mirrored scale.'
  },
  {
    title: 'Consistent SI Units',
    description: 'Always convert mass in grams to kilograms (÷ 1000) and extension in centimetres to metres (÷ 100) before computing force and spring constant.'
  }
];

export const HOOKES_LAW_COMMON_ERRORS = [
  {
    name: 'Incorrect Zero / Reference Position',
    cause: 'Failing to note the initial unloaded pointer reading or assuming the zero mark starts at the clamp.',
    prevention: 'Always record the baseline pointer position under zero load (x₀) before adding any weights, and compute extension as Δx = x - x₀.'
  },
  {
    name: 'Parallax in Reading the Scale',
    cause: 'Viewing the pointer from above or below horizontal eye level, creating apparent displacement on the scale graduations.',
    prevention: 'Position your eye horizontally level with the pointer tip, or align the pointer with its reflection in the scale mirror.'
  },
  {
    name: 'Using Grams Instead of Kilograms in F = mg',
    cause: 'Directly multiplying mass in grams by g = 9.81 m/s² leads to a 1000-fold overestimation of applied force.',
    prevention: 'Convert mass to standard SI units: m (kg) = mass (g) / 1000 before evaluating F = mg.'
  },
  {
    name: 'Measuring Total Length Instead of Extension',
    cause: 'Confusing the extended total length of the spring coils with the actual elongation relative to equilibrium.',
    prevention: 'Only record extension x = length - original length (or pointer position - initial position).'
  },
  {
    name: 'Exceeding the Elastic Limit',
    cause: 'Applying excessive mass that stretches the coil wires beyond their yield point, permanently distorting the spring.',
    prevention: 'Keep masses within the calibrated range (0–500 g) and confirm the pointer returns to x₀ upon unloading.'
  },
  {
    name: 'Recording While Spring is Still Oscillating',
    cause: 'Taking the reading prematurely while the mass is still bobbing up and down.',
    prevention: 'Gently steady the mass hanger with fingertips and allow vertical oscillation to damp completely before reading.'
  },
  {
    name: 'Loose or Yielding Retort Support',
    cause: 'A loose clamp or tipping stand deflects under heavier loads, introducing false additional elongation.',
    prevention: 'Ensure the base is heavy, clamp thumbscrews are firmly tightened, and the stand does not tilt under load.'
  }
];

export const HOOKES_LAW_QUIZ: QuizQuestion[] = [
  {
    id: 'hl-q1',
    question: "What does Hooke's Law state for an ideal spring?",
    options: [
      "Extension is directly proportional to applied force within the elastic limit",
      "Applied force is inversely proportional to extension",
      "Extension depends quadratically on the applied mass",
      "Spring constant increases linearly with applied load"
    ],
    correctIndex: 0,
    explanation:
      "Hooke's Law states that within the elastic limit, extension (x) produced in an elastic body is directly proportional to the applied tensile force (F = kx)."
  },
  {
    id: 'hl-q2',
    question: "What is the SI unit of the spring constant (k)?",
    options: [
      "Newton-metre (N·m)",
      "Newton per metre (N/m)",
      "Newton per metre squared (N/m²)",
      "Kilogram per metre (kg/m)"
    ],
    correctIndex: 1,
    explanation:
      "Since k = F / x, the SI unit of force is newtons (N) and extension is metres (m), giving newtons per metre (N/m or N·m⁻¹)."
  },
  {
    id: 'hl-q3',
    question: "What physical quantity does the slope of a Force (F) vs Extension (x) graph represent?",
    options: [
      "Work done on the spring",
      "Acceleration due to gravity",
      "Spring constant (stiffness) k",
      "Elastic potential energy"
    ],
    correctIndex: 2,
    explanation:
      "From F = kx, the slope ΔF / Δx directly represents the spring constant k (stiffness). A steeper slope indicates a stiffer spring."
  },
  {
    id: 'hl-q4',
    question: "Within the elastic limit, what happens to the extension if the suspended mass is doubled?",
    options: [
      "The extension doubles in direct linear proportion",
      "The extension increases four-fold (quadratically)",
      "The extension remains unchanged",
      "The extension halves"
    ],
    correctIndex: 0,
    explanation:
      "Because F = mg and x = F/k, doubling the mass doubles the force, which doubles the extension linearly within the elastic limit."
  },
  {
    id: 'hl-q5',
    question: "Why must the elastic limit of the spring not be exceeded during the experiment?",
    options: [
      "The mass of the spring changes permanently",
      "The spring undergoes permanent plastic deformation and ceases to obey Hooke's Law",
      "The value of gravitational acceleration changes",
      "The scale pointer loses electrical conductivity"
    ],
    correctIndex: 1,
    explanation:
      "Beyond the elastic limit, atomic bonds experience irreversible slip (plastic deformation). The spring will not return to its original length upon removal of the load and Hooke's Law no longer holds."
  }
];

export const HOOKES_LAW_VIVA: VivaQuestionItem[] = [
  {
    id: 'hl-v1',
    question: "State Hooke's Law in words and mathematical form.",
    answer:
      "Hooke's Law states that within the elastic limit of a material, the extension produced is directly proportional to the applied tensile force. Mathematically: F = kx (or restoring force F_restoring = -kx), where F is applied force in Newtons, x is extension in metres, and k is the spring constant in N/m.",
    concept: "Fundamental Law of Elasticity"
  },
  {
    id: 'hl-v2',
    question: "What is meant by the spring constant (k) of a helical spring?",
    answer:
      "The spring constant (k), also known as spring stiffness, is the force required to produce unit extension (1 metre) in the spring: k = F / x. It is an intrinsic measure of how resistant the spring is to deformation. A larger k value denotes a stiffer spring.",
    concept: "Physical Significance of k"
  },
  {
    id: 'hl-v3',
    question: "What is the SI unit and dimensional formula of spring constant?",
    answer:
      "The SI unit is newtons per metre (N/m or N·m⁻¹). In base SI units, 1 N/m = 1 kg·s⁻². The dimensional formula is [M L⁰ T⁻²] or [M T⁻²], which is the same as that of surface tension.",
    concept: "Units and Dimensional Analysis"
  },
  {
    id: 'hl-v4',
    question: "What does the slope of an F versus x graph represent, and what if x is plotted against F?",
    answer:
      "In a graph of Force (F) on the Y-axis against Extension (x) on the X-axis, the slope ΔF/Δx equals the spring constant k. If Extension (x) is plotted on the Y-axis and Force (F) on the X-axis, the slope is Δx/ΔF = 1/k.",
    concept: "Graphical Representation"
  },
  {
    id: 'hl-v5',
    question: "What is the elastic limit and what occurs beyond it?",
    answer:
      "The elastic limit is the upper boundary of stress beyond which a material exhibits permanent plastic deformation. If loaded beyond this limit, the spring yields, will not return to its initial unloaded length when freed, and the relationship between F and x ceases to be linear.",
    concept: "Elastic Limit & Plasticity"
  },
  {
    id: 'hl-v6',
    question: "Why must the spring be allowed to come to static equilibrium before taking a reading?",
    answer:
      "Adding a mass sets the spring into vertical simple harmonic oscillation. During oscillation, the pointer continuously moves between extreme turning points. One must wait for air resistance and internal damping to bring the system to static rest, where downward gravitational force (mg) exactly balances upward restoring tension (kx).",
    concept: "Static Equilibrium & Precision"
  }
];
