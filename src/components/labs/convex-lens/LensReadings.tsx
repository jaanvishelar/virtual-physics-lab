import React from 'react';
import { Activity, Binary, Eye, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LensReadingsProps {
  uMagnitude: number;
  focalLength: number;
  screenPos: number;
}

export const LensReadings: React.FC<LensReadingsProps> = ({
  uMagnitude,
  focalLength,
  screenPos,
}) => {
  const u = -uMagnitude;
  const f = focalLength;

  const isAtFocus = Math.abs(uMagnitude - f) < 0.001;
  const isVirtual = uMagnitude < f;

  // Thin-lens calculations
  const v = isAtFocus ? Infinity : (f * u) / (u + f);
  const magnification = isAtFocus ? Infinity : v / u;
  
  // Authoritative focal length calculation from 1 / (1/v - 1/u)
  const calculatedF = !isAtFocus && isFinite(v) && v !== 0 && (1 / v - 1 / u) !== 0
    ? 1 / (1 / v - 1 / u)
    : f;

  // Image Characteristics
  let imageType = 'Real';
  let orientation = 'Inverted';
  let sizeCategory = 'Same Size';

  if (isAtFocus) {
    imageType = 'At Infinity';
    orientation = 'Undefined';
    sizeCategory = 'Highly Magnified (Infinitely large)';
  } else if (isVirtual) {
    imageType = 'Virtual';
    orientation = 'Erect';
    sizeCategory = Math.abs(magnification) > 1 ? 'Magnified' : 'Diminished';
  } else {
    imageType = 'Real';
    orientation = 'Inverted';
    const absM = Math.abs(magnification);
    if (Math.abs(absM - 1.0) < 0.02) {
      sizeCategory = 'Same Size (|m| = 1.0)';
    } else if (absM < 1.0) {
      sizeCategory = 'Diminished (|m| < 1.0)';
    } else {
      sizeCategory = 'Magnified (|m| > 1.0)';
    }
  }

  const isSharp = !isVirtual && !isAtFocus && Math.abs(screenPos - v) <= 1.2;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Live Optical Measurement Panel
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Calculated from the lens formula
        </span>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Object Distance u */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
            Object Distance (u)
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-700">
            {u.toFixed(1)} <span className="text-xs font-normal text-slate-500">cm</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            u &lt; 0 (left of lens)
          </div>
        </div>

        {/* Image Distance v */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
            Image Distance (v)
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-indigo-700">
            {isAtFocus ? (
              <span className="text-lg">At &infin;</span>
            ) : (
              <>
                {v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1)}{' '}
                <span className="text-xs font-normal text-slate-500">cm</span>
              </>
            )}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            {v > 0 ? 'v > 0 (real, right of lens)' : 'v < 0 (virtual, left of lens)'}
          </div>
        </div>

        {/* Calculated Focal Length f */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
            Focal Length (f)
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900">
            +{calculatedF.toFixed(2)} <span className="text-xs font-normal text-slate-500">cm</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            f = 1 / (1/v − 1/u)
          </div>
        </div>

        {/* Linear Magnification m */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
            Magnification (m)
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-amber-700">
            {isAtFocus ? (
              <span className="text-lg">&infin;</span>
            ) : (
              magnification.toFixed(2)
            )}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            m = v / u {magnification < 0 ? '(inverted)' : '(erect)'}
          </div>
        </div>
      </div>

      {/* Screen Alignment Feedback Banner (Section 10 Requirement) */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isVirtual
          ? 'bg-amber-50/80 border-amber-200 text-amber-900'
          : isAtFocus
          ? 'bg-sky-50/80 border-sky-200 text-sky-900'
          : isSharp
          ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-xs'
          : 'bg-amber-50/70 border-amber-200/80 text-amber-950'
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {isVirtual ? (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            ) : isAtFocus ? (
              <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />
            ) : isSharp ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <div>
              <div className="font-bold text-sm">
                {isVirtual ? (
                  <span>Virtual Image: A real screen cannot capture the virtual image.</span>
                ) : isAtFocus ? (
                  <span>Object at Focus (u = -f): Refracted rays are parallel to infinity. A real screen cannot obtain a finite sharp image.</span>
                ) : isSharp ? (
                  <span className="text-emerald-900 font-extrabold flex items-center gap-1.5">
                    <span>Image sharply focused</span>
                    <span className="text-xs font-mono font-normal text-emerald-700">
                      (Screen at +{screenPos.toFixed(1)} cm matching image plane v = +{v.toFixed(1)} cm)
                    </span>
                  </span>
                ) : (
                  <span className="text-amber-900 font-semibold">
                    Adjust screen position to obtain a sharp image.
                  </span>
                )}
              </div>
              <p className="text-xs opacity-90 mt-0.5">
                {isVirtual
                  ? 'Refracted light rays diverge. A virtual magnified image is formed behind the lens on the object side, visible only through the lens directly (magnifying glass effect).'
                  : isAtFocus
                  ? 'Screen cannot intercept a finite focus; light forms parallel beam emerging from lens.'
                  : isSharp
                  ? 'The movable white screen coincides with the conjugate real focal plane.'
                  : `Current screen position is at +${screenPos.toFixed(1)} cm (calculated image distance v = +${v.toFixed(1)} cm, offset: ${Math.abs(screenPos - v).toFixed(1)} cm).`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Optical Characteristics Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 font-mono text-xs">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
            Image Type:
          </span>
          <span className="font-bold text-slate-900 text-sm">{imageType}</span>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
            Orientation:
          </span>
          <span className="font-bold text-slate-900 text-sm">{orientation}</span>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
            Size:
          </span>
          <span className="font-bold text-slate-900 text-sm">{sizeCategory}</span>
        </div>
      </div>
    </div>
  );
};
