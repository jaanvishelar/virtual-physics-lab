import { ApparatusDetail, QuizQuestion, VivaQuestionItem } from '../types';

export const OHMS_LAW_INFO = {
  title: "Verification of Ohm's Law & Resistance",
  targetLevel: "Class 11",
  aim: "To study the relationship between potential difference and current through a conductor and determine its resistance.",
  theory: {
    statement: "At constant physical conditions (such as temperature, mechanical strain, and cross-sectional area), the current flowing through a conductor is directly proportional to the potential difference applied across its ends.",
    proportionality: "V ∝ I",
    equation: "V = IR",
    variables: [
      { symbol: "V", name: "Potential Difference", unit: "Volts (V)", description: "The work done per unit charge in moving it between two points in the circuit." },
      { symbol: "I", name: "Electric Current", unit: "Amperes (A)", description: "The rate of flow of electric charges through the conductor." },
      { symbol: "R", name: "Resistance", unit: "Ohms (Ω)", description: "The property of a conductor to oppose the flow of electric charges." },
    ],
    slopeNote: "For a V versus I graph (with V on the Y-axis and I on the X-axis), the slope ΔV / ΔI represents the resistance R of the conductor."
  },
  formulas: [
    { label: "Ohm's Law", formula: "V = I × R", notes: "Calculates voltage when current and resistance are known." },
    { label: "Current Calculation", formula: "I = V / R", notes: "Used by the simulation engine to compute current." },
    { label: "Resistance from Slope", formula: "R = ΔV / ΔI", notes: "Slope of the V versus I plot gives experimental resistance." }
  ]
};

export const OHMS_LAW_APPARATUS: ApparatusDetail[] = [
  {
    id: "power-supply",
    name: "DC Power Supply",
    role: "Provides variable direct current potential difference across the circuit.",
    connectionType: "Power",
    spec: "0.0 V – 12.0 V DC (Regulated output)"
  },
  {
    id: "switch-key",
    name: "Plug Key / Switch",
    role: "Completes or breaks the circuit path safely.",
    connectionType: "Control",
    spec: "One-way key with brass contacts"
  },
  {
    id: "ammeter",
    name: "Ammeter",
    role: "Measures current flowing through the circuit. Always connected in series.",
    connectionType: "Series",
    spec: "0 – 2.5 A (Low internal resistance)"
  },
  {
    id: "resistor",
    name: "Standard Resistor / Wire",
    role: "Test conductor whose resistance is to be verified and determined.",
    connectionType: "Conductor",
    spec: "Selectable: 2 Ω – 50 Ω (Manganin / Constantan)"
  },
  {
    id: "voltmeter",
    name: "Voltmeter",
    role: "Measures potential difference across the resistor. Always connected in parallel.",
    connectionType: "Parallel",
    spec: "0 – 15.0 V (High internal resistance)"
  },
  {
    id: "rheostat",
    name: "Rheostat",
    role: "Variable resistance used to adjust circuit current smoothly without changing supply voltage.",
    connectionType: "Series",
    spec: "0 – 50 Ω slider"
  },
  {
    id: "connecting-wires",
    name: "Connecting Wires",
    role: "Thick copper conductors that establish low-resistance electrical links between components.",
    connectionType: "Series",
    spec: "Thick insulated copper with terminal spade lugs"
  }
];

export const OHMS_LAW_PROCEDURE = [
  "Connect the virtual circuit correctly with the ammeter in series and the voltmeter in parallel across the resistor.",
  "Keep the switch OFF initially to ensure zero current flows before parameters are adjusted.",
  "Select a resistance value using the resistance slider or standard presets (e.g., 10 Ω).",
  "Switch ON the circuit by inserting the plug key.",
  "Set a potential difference using the voltage slider or quick preset buttons.",
  "Observe the ammeter reading (current I) and voltmeter reading (potential difference V).",
  "Record the observation into the observation table by clicking 'Record Observation'.",
  "Repeat the procedure for several different voltage values (at least 3–5 trials).",
  "Plot the V-I graph with Current I on the X-axis and Potential Difference V on the Y-axis.",
  "Determine resistance from the slope of the best-fit line (Slope = ΔV / ΔI = R)."
];

export const OHMS_LAW_PRECAUTIONS = [
  {
    title: "Check Circuit Connections",
    description: "Verify all terminal polarities (+ to positive terminal, - to negative) before closing the switch key."
  },
  {
    title: "Keep Current Within Safe Simulated Range",
    description: "Avoid passing excessively high currents through small resistances to model realistic laboratory safety limits."
  },
  {
    title: "Take Readings Carefully",
    description: "Always view meter needles directly from the front perpendicular to the scale to avoid optical parallax error."
  },
  {
    title: "Avoid Unnecessary Heating Effects",
    description: "In a physical laboratory, only insert the key while taking a reading; remove it immediately after to prevent ohmic heating from altering resistance."
  },
  {
    title: "Ensure Proper Meter Connections",
    description: "An ammeter must always be wired in series (low resistance) and a voltmeter in parallel (high resistance)."
  },
  {
    title: "Maintain Constant Physical Conditions",
    description: "Ohm's Law holds true only when temperature, strain, and physical geometry of the conductor remain unchanged."
  }
];

export const OHMS_LAW_COMMON_ERRORS = [
  {
    name: "Loose Connections",
    cause: "Unsecured terminal binding screws introduce unwanted extra contact resistance.",
    prevention: "Clean wire tips with sandpaper and screw terminals tightly."
  },
  {
    name: "Instrumental / Zero Error",
    cause: "Pointer of voltmeter or ammeter does not rest at exact zero mark when disconnected.",
    prevention: "Note the initial zero deviation before starting and apply algebraic zero correction."
  },
  {
    name: "Reading Error (Parallax)",
    cause: "Observing the meter needle at an oblique angle instead of straight perpendicular.",
    prevention: "Position your line of sight directly in front of the mirror backing behind the needle."
  },
  {
    name: "Heating Effect of Current",
    cause: "Continuous prolonged current flow raises the temperature of the conductor ($H = I^2Rt$).",
    prevention: "Open the key between readings to allow the resistor to cool down to room temperature."
  },
  {
    name: "Resistance Variation",
    cause: "For pure metals, resistivity increases with temperature ($R_T = R_0(1 + \\alpha \\Delta T)$), causing the V-I curve to bend upward.",
    prevention: "Use standard alloys like Constantan or Manganin which have nearly zero temperature coefficient of resistance."
  },
  {
    name: "Incorrect Meter Connection",
    cause: "Connecting an ammeter in parallel causes a short circuit; connecting a voltmeter in series stops almost all current.",
    prevention: "Double check that the ammeter is in the main loop and the voltmeter straddles only the component."
  }
];

export const OHMS_LAW_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "According to Ohm's Law, what is the mathematical relationship between Potential Difference (V) and Electric Current (I) at constant temperature?",
    options: [
      "V is inversely proportional to I (V ∝ 1/I)",
      "V is directly proportional to I (V ∝ I)",
      "V is proportional to the square of I (V ∝ I²)",
      "V is completely independent of I"
    ],
    correctIndex: 1,
    explanation: "Ohm's Law states that at constant temperature and physical conditions, the current flowing through a conductor is directly proportional to the potential difference across it (V ∝ I, so V = IR)."
  },
  {
    id: "q2",
    question: "If a potential difference of 6.0 V is applied across a 10.0 Ω resistor, what is the electric current flowing through it?",
    options: [
      "60.0 A",
      "1.67 A",
      "0.60 A",
      "0.06 A"
    ],
    correctIndex: 2,
    explanation: "Using Ohm's Law rearranged for current: I = V / R = 6.0 V / 10.0 Ω = 0.60 A."
  },
  {
    id: "q3",
    question: "What is the SI unit of electrical resistance?",
    options: [
      "Volt (V)",
      "Ampere (A)",
      "Ohm (Ω)",
      "Coulomb (C)"
    ],
    correctIndex: 2,
    explanation: "The SI unit of electrical resistance is the Ohm, symbolized by the Greek capital letter omega (Ω). 1 Ω = 1 Volt / 1 Ampere."
  },
  {
    id: "q4",
    question: "On a graph where Potential Difference V is plotted on the Y-axis and Current I on the X-axis, what does the slope (ΔV / ΔI) of the straight line represent?",
    options: [
      "Electrical Conductance (1/R)",
      "Electrical Resistance (R)",
      "Electric Power (P)",
      "Capacitance (C)"
    ],
    correctIndex: 1,
    explanation: "Slope = (Change in Y) / (Change in X) = ΔV / ΔI. Since V = IR, ΔV / ΔI = R. Therefore, the slope of a V versus I graph directly represents the resistance R of the conductor."
  },
  {
    id: "q5",
    question: "Why is an ammeter always connected in series and a voltmeter in parallel across a circuit component?",
    options: [
      "An ammeter has very high resistance and a voltmeter has zero resistance",
      "An ammeter has very low resistance to avoid reducing current, while a voltmeter has very high resistance to avoid drawing current",
      "Series and parallel connections can be swapped without affecting circuit measurements",
      "To prevent electromagnetic induction between the meter coils"
    ],
    correctIndex: 1,
    explanation: "An ideal ammeter has 0 Ω resistance so connecting it in series doesn't alter the total loop current. An ideal voltmeter has infinite resistance so connecting it in parallel across a component draws negligible current away from that component."
  }
];

export const OHMS_LAW_VIVA: VivaQuestionItem[] = [
  {
    id: "viva-1",
    question: "1. State Ohm's Law.",
    answer: "Ohm's Law states that the current flowing through a conductor is directly proportional to the potential difference across its ends, provided the physical state of the conductor—such as its temperature, mechanical strain, and dimensions—remains constant. Mathematically, V ∝ I, which gives V = IR.",
    concept: "Fundamental Circuit Law"
  },
  {
    id: "viva-2",
    question: "2. What is the SI unit of resistance?",
    answer: "The SI unit of electrical resistance is the Ohm (symbol: Ω). One ohm is defined as the resistance of a conductor such that a potential difference of 1 Volt across its ends produces a current of 1 Ampere through it (1 Ω = 1 V / 1 A).",
    concept: "SI Units & Dimensional Analysis"
  },
  {
    id: "viva-3",
    question: "3. Why is an ammeter connected in series?",
    answer: "An ammeter measures the rate of charge flow (current) passing through a branch. It must be connected in series so that the entire current to be measured passes directly through it. An ammeter is constructed with very low internal resistance so it introduces negligible additional resistance into the circuit.",
    concept: "Instrumentation Principles"
  },
  {
    id: "viva-4",
    question: "4. Why is a voltmeter connected in parallel?",
    answer: "A voltmeter measures the potential difference (voltage drop) between two points in a circuit. It is connected in parallel across those two points. It is designed with extremely high internal resistance so that it diverts an imperceptible fraction of the total circuit current, ensuring the actual voltage across the component remains unaffected.",
    concept: "Voltage Measurement"
  },
  {
    id: "viva-5",
    question: "5. What does the slope of a V-I graph represent?",
    answer: "When Potential Difference V is plotted on the Y-axis and Current I on the X-axis, the slope is given by ΔV / ΔI. According to Ohm's Law (V = IR), ΔV / ΔI equals the resistance R of the conductor. If the axes are reversed (I on Y, V on X), the slope would represent conductance (1/R).",
    concept: "Graphical Data Analysis"
  },
  {
    id: "viva-6",
    question: "6. What happens to current if resistance increases at constant voltage?",
    answer: "From Ohm's Law rearranged as I = V / R, current is inversely proportional to resistance when potential difference V remains constant. Therefore, if the resistance is doubled, the current will be halved; if resistance increases, the current decreases proportionally.",
    concept: "Inverse Proportionality"
  }
];
