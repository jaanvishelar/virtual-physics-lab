import { QuizQuestion, VivaQuestionItem, ApparatusDetail } from '../types';

export const CONVEX_LENS_INFO = {
  header: {
    expNumber: '05',
    classes: 'Classes 10–12',
    category: 'Ray Optics',
    badge: 'Fully Interactive Laboratory Bench',
    title: 'Convex Lens & Focal Length',
  },
  aim: 'To determine the focal length of a convex lens by measuring the object distance and corresponding image distance, and to verify the lens formula.',
  theory: {
    overview:
      'A convex lens is thicker at the center than at the edges and can converge parallel rays of light to a real focus. When a real object is placed beyond the focal point of a convex lens, a real inverted image can be formed on the opposite side of the lens.',
    lensFormula: {
      formula: '1/f = 1/v - 1/u',
      focalLengthFormula: 'f = 1 / (1/v - 1/u)',
      magnificationFormula: 'm = v / u',
      explanation:
        'The fundamental thin-lens formula relates object distance u, image distance v, and focal length f under the Cartesian sign convention.',
    },
    signConvention: {
      title: 'Cartesian Sign Convention',
      points: [
        'All distances are measured from the optical center (O) of the lens along the principal axis.',
        'Distances measured in the direction of incident light (to the right of the lens) are taken as positive (+).',
        'Distances measured opposite to the direction of incident light (to the left of the lens) are taken as negative (−).',
        'For a real object placed to the left of the lens: Object distance u is negative (u < 0).',
        'For a real inverted image formed to the right of the lens: Image distance v is positive (v > 0).',
        'The focal length f of a converging (convex) lens is positive (f > 0).',
      ],
      warning:
        'Do not use 1/f = 1/u + 1/v when using the Cartesian sign convention. The authoritative thin-lens formula is 1/f = 1/v − 1/u.',
    },
    linearGraph: {
      equation: '1/v = 1/u + 1/f',
      explanation:
        'Rearranging the lens formula gives 1/v = (1) · (1/u) + (1/f). When 1/v is plotted against 1/u, the resulting graph is linear with slope m = 1 and Y-intercept c = 1/f. The experimental focal length is obtained from f = 1/intercept.',
    },
  },
  constants: {
    theoreticalFocalLength: 20.0, // cm
    minObjectDistance: 15, // cm magnitude
    maxObjectDistance: 100, // cm magnitude
    defaultObjectDistance: 60, // cm magnitude
    defaultScreenPos: 30, // cm
    minScreenPos: 15, // cm
    maxScreenPos: 120, // cm
    objectHeight: 25, // mm / visual units
  },
  modelLimitations:
    'This simulation uses an ideal thin-lens model. Real optical systems may show effects such as lens thickness, spherical aberration, chromatic aberration, and alignment errors, which are not fully represented here.',
};

export const CONVEX_LENS_APPARATUS: ApparatusDetail[] = [
  {
    id: 'cla-1',
    name: 'Virtual Optical Bench',
    role: 'A rigid graduated horizontal track providing a stable reference scale for mounting and aligning the lens, object, and screen.',
    connectionType: 'Control',
    spec: 'Simulated horizontal optical bench track with cm graduations',
  },
  {
    id: 'cla-2',
    name: 'Convex Lens',
    role: 'A converging biconvex glass lens mounted perpendicularly to the bench with a theoretical focal length f = +20.0 cm.',
    connectionType: 'Series',
    spec: 'Thin converging biconvex lens, f = +20.0 cm',
  },
  {
    id: 'cla-3',
    name: 'Lens Stand',
    role: 'A vertical mount centered on the bench that holds the convex lens at a fixed optical height aligned with the principal axis.',
    connectionType: 'Control',
    spec: 'Upright optical mount with vertical leveling',
  },
  {
    id: 'cla-4',
    name: 'Illuminated Object / Object Arrow',
    role: 'An illuminated upright object placed on the left side of the lens emitting light rays toward the lens.',
    connectionType: 'Conductor',
    spec: 'Virtual illuminated arrow with adjustable bench position',
  },
  {
    id: 'cla-5',
    name: 'Screen',
    role: 'A movable white receiving screen on the right side of the lens used to intercept and display the real focused image.',
    connectionType: 'Parallel',
    spec: 'Movable receiving surface with real-time focus detection',
  },
  {
    id: 'cla-6',
    name: 'Distance Scale',
    role: 'A linear metric scale marked along the principal axis measuring coordinates relative to the optical center (O = 0 cm).',
    connectionType: 'Control',
    spec: 'Millimeter/centimeter coordinate grid and reference markers',
  },
  {
    id: 'cla-7',
    name: 'Object Position Control',
    role: 'Interactive slider to translate the object along the optical axis, varying object distance u.',
    connectionType: 'Control',
    spec: 'Object position range from |u| = 15 cm to 100 cm',
  },
  {
    id: 'cla-8',
    name: 'Screen Position Control',
    role: 'Interactive slider to adjust the screen location to find the plane of sharpest image focus.',
    connectionType: 'Control',
    spec: 'Adjustable screen distance from 15 cm to 120 cm',
  },
  {
    id: 'cla-9',
    name: 'Measurement Panel',
    role: 'Live digital display computing signed u, signed v, calculated focal length f, magnification m, and image nature.',
    connectionType: 'Control',
    spec: 'Real-time ray tracing and thin-lens equation solver',
  },
];

export const CONVEX_LENS_PROCEDURE = [
  'Place the virtual convex lens at the zero/reference position on the optical bench.',
  'Place the illuminated object on the left side of the lens.',
  'Set the object position using the object-distance control.',
  'Move the virtual screen on the opposite side of the lens.',
  'Adjust the screen until the image is sharply focused for a real image.',
  'Record the signed object distance u and image distance v.',
  'Calculate the focal length using the lens formula: f = 1 / (1/v - 1/u).',
  'Repeat the experiment for several object positions.',
  'Record the observations in the table.',
  'Plot 1/v against 1/u and analyze the intercept to estimate focal length.',
  'Compare the experimental result with the theoretical focal length.',
];

export const CONVEX_LENS_PRECAUTIONS = [
  'Use consistent units (centimetres throughout) in all calculations.',
  'Follow the Cartesian sign convention consistently: u < 0, v > 0 for real image, f > 0.',
  'Measure all distances strictly from the optical center of the lens.',
  'Keep the object, lens, and screen aligned with the principal axis.',
  'Obtain a sharp image before recording the image distance v.',
  'Avoid placing the object exactly at the focal point (u = -f) when attempting to form a real image on the screen.',
  'Take multiple readings across different object regions (beyond 2F, at 2F, between F and 2F) for reliable graphical regression.',
];

export const CONVEX_LENS_COMMON_ERRORS = [
  'Incorrect sign convention: treating u as positive or swapping signs in the lens formula.',
  'Measuring distance from the edge or stand base instead of the optical center of the lens.',
  'Misalignment of object, lens, and screen off the horizontal principal axis.',
  'Recording screen position before obtaining a sharp image focus.',
  'Confusing real and virtual images (attempting to capture a virtual image on a physical screen).',
  'Incorrect substitution into the lens formula, such as mistakenly using 1/f = 1/u + 1/v.',
  'Mixing centimetres and metres within the same calculation.',
];

export const STANDARD_CONVEX_LENS_TRIALS = [
  {
    trialNo: 1,
    uMagnitude: 60, // u = -60 cm
    u: -60.0,
    v: 30.0,
    focalLength: 20.0,
    magnification: -0.5,
    nature: 'Real, Inverted, Diminished (between F′ and 2F′)',
  },
  {
    trialNo: 2,
    uMagnitude: 50, // u = -50 cm
    u: -50.0,
    v: 33.33,
    focalLength: 20.0,
    magnification: -0.67,
    nature: 'Real, Inverted, Diminished (between F′ and 2F′)',
  },
  {
    trialNo: 3,
    uMagnitude: 40, // u = -40 cm (at 2F)
    u: -40.0,
    v: 40.0,
    focalLength: 20.0,
    magnification: -1.0,
    nature: 'Real, Inverted, Same Size (at 2F′)',
  },
  {
    trialNo: 4,
    uMagnitude: 30, // u = -30 cm (between F and 2F)
    u: -30.0,
    v: 60.0,
    focalLength: 20.0,
    magnification: -2.0,
    nature: 'Real, Inverted, Magnified (beyond 2F′)',
  },
];

export const CONVEX_LENS_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'clq-1',
    question: 'Under the standard Cartesian sign convention, what are the signs of u, v, and f for a real object and real image with a convex lens?',
    options: [
      'u is positive, v is negative, f is positive',
      'u is negative, v is positive, f is positive',
      'u is negative, v is negative, f is negative',
      'u is positive, v is positive, f is negative',
    ],
    correctIndex: 1,
    explanation:
      'Because the real object is placed to the left of the lens against incident light, u < 0. The real image is formed to the right in the direction of light, so v > 0. A convex lens converges light, so its focal length f is positive.',
  },
  {
    id: 'clq-2',
    question: 'What is the correct thin-lens formula relating u, v, and f under the Cartesian sign convention?',
    options: [
      '1/f = 1/u + 1/v',
      '1/f = 1/v - 1/u',
      '1/f = 1/u - 1/v',
      'f = u + v',
    ],
    correctIndex: 1,
    explanation:
      'The authoritative thin-lens equation is 1/f = 1/v − 1/u. Using 1/f = 1/u + 1/v is the mirror formula and incorrect for lenses under this convention.',
  },
  {
    id: 'clq-3',
    question: 'An object is placed at a distance of 40 cm in front of a convex lens of focal length 20 cm (u = -40 cm). Where is the image formed?',
    options: [
      'At infinity',
      'At v = +20 cm (at focus F′)',
      'At v = +40 cm (at 2F′), same size and inverted',
      'At v = -40 cm (virtual)',
    ],
    correctIndex: 2,
    explanation:
      'From 1/v = 1/f + 1/u = 1/20 + 1/(-40) = 1/20 - 1/40 = 1/40 ⇒ v = +40 cm. When the object is at 2F, the real inverted image is formed exactly at 2F′ with magnification m = +40 / -40 = -1 (same size).',
  },
  {
    id: 'clq-4',
    question: 'When an object is placed between the focal point F and 2F of a convex lens, what is the nature of the image formed?',
    options: [
      'Virtual, erect, and diminished',
      'Real, inverted, and diminished',
      'Real, inverted, and magnified (beyond 2F′)',
      'Virtual, erect, and magnified',
    ],
    correctIndex: 2,
    explanation:
      'For an object between F and 2F (e.g. u = -30 cm for f = 20 cm), light converges beyond 2F′ (v = +60 cm), forming a real, inverted, and magnified image (|m| > 1).',
  },
  {
    id: 'clq-5',
    question: 'What occurs when the object is placed inside the principal focus (between optical center O and F, |u| < f)?',
    options: [
      'A real inverted image is formed at 2F′',
      'A virtual, erect, and magnified image is formed on the same side as the object',
      'A sharp image is captured on the screen',
      'No light rays pass through the lens',
    ],
    correctIndex: 1,
    explanation:
      'When |u| < f, the refracted rays diverge on the right. When projected backwards, they intersect on the left, forming a virtual, erect, and magnified image that cannot be received on a physical screen (acting like a magnifying glass).',
  },
  {
    id: 'clq-6',
    question: 'In a graph of 1/v plotted against 1/u for a convex lens, what does the Y-axis intercept represent?',
    options: [
      'The focal length f',
      'The reciprocal of the focal length (1/f)',
      'The magnification m',
      'The object distance u',
    ],
    correctIndex: 1,
    explanation:
      'Rearranging the lens equation gives 1/v = (1)·(1/u) + (1/f). This is of the linear form Y = mX + c with slope 1 and intercept c = 1/f. Therefore, f = 1/intercept.',
  },
];

export const CONVEX_LENS_VIVA_QUESTIONS: VivaQuestionItem[] = [
  {
    id: 'clv-1',
    question: 'What is a convex lens?',
    answer:
      'A convex lens is an optical element made of a transparent refracting medium bounded by two spherical surfaces (or one spherical and one planar surface) that is thicker at the center than at the edges. It converges parallel incident rays of light to a real focal point.',
    concept: 'Lens Geometry & Refraction',
  },
  {
    id: 'clv-2',
    question: 'What is the lens formula and what do the symbols represent?',
    answer:
      'The lens formula is 1/f = 1/v − 1/u, where u is the object distance measured from the optical center, v is the image distance measured from the optical center, and f is the focal length of the lens. Distances are signed according to the Cartesian convention.',
    concept: 'Thin-Lens Equation',
  },
  {
    id: 'clv-3',
    question: 'Why is the focal length of a convex lens positive under the Cartesian sign convention?',
    answer:
      'Parallel rays incident from the left converge to the principal focus F′ on the right side of the lens. Because F′ lies in the direction of the incident light, the focal length f is measured along the positive X-direction from the optical center, making f > 0.',
    concept: 'Cartesian Sign Convention',
  },
  {
    id: 'clv-4',
    question: 'Where is the image formed when the object is placed beyond 2F?',
    answer:
      'When the object is placed beyond 2F (|u| > 2f), the image is formed on the opposite side between the principal focus F′ and 2F′ (f < v < 2f). The image is real, inverted, and diminished (|m| < 1).',
    concept: 'Ray Optics Conjugate Foci',
  },
  {
    id: 'clv-5',
    question: 'What happens when the object is placed between F and 2F?',
    answer:
      'When the object is between F and 2F (f < |u| < 2f), the refracted rays converge beyond 2F′ (v > 2f). The resulting image is real, inverted, and magnified (|m| > 1). This is the optical arrangement utilized in slide projectors and movie projectors.',
    concept: 'Image Magnification',
  },
  {
    id: 'clv-6',
    question: 'Why cannot a virtual image be obtained on a physical screen?',
    answer:
      'A virtual image is formed where refracted light rays only appear to diverge from a point when traced backwards; no real light rays actually converge or intersect at that position. Therefore, placing a physical screen there intercepts no focused energy, and no image can be captured.',
    concept: 'Real vs Virtual Images',
  },
  {
    id: 'clv-7',
    question: 'Why should distances always be measured from the optical center of the lens?',
    answer:
      'In the paraxial thin-lens approximation, the lens thickness is negligible compared to the object and image distances, and refraction occurs symmetrically across the principal plane passing through the optical center (O). Measuring from O ensures mathematical consistency with the thin-lens equation.',
    concept: 'Optical Center Reference',
  },
  {
    id: 'clv-8',
    question: 'Why should the illuminated object, lens, and screen be aligned along a single axis?',
    answer:
      'Paraxial ray equations assume all components share a common optical axis. If the object, lens, or screen are tilted or vertically displaced, off-axis aberrations such as coma, astigmatism, and distortion arise, preventing the formation of a symmetrical sharp image.',
    concept: 'Apparatus Alignment & Paraxial Optics',
  },
];

export const CONVEX_LENS_DOUBT_CATEGORIES = [
  'Lens Formula',
  'Sign Convention',
  'Ray Diagrams',
  'Image Formation',
  'Graph & Calculation',
  'Experimental Errors',
] as const;
