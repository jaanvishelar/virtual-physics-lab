import React, { useMemo } from 'react';
import { ConvexLensObservation } from '../../../types';
import { LineChart, Binary, CheckCircle2, TrendingUp, Info } from 'lucide-react';

interface LensGraphProps {
  observations: ConvexLensObservation[];
  theoreticalFocalLength: number; // 20.0 cm
}

export const LensGraph: React.FC<LensGraphProps> = ({
  observations,
  theoreticalFocalLength,
}) => {
  // Compute least squares linear regression on points: X = 1/u, Y = 1/v
  const regression = useMemo(() => {
    if (observations.length < 2) return null;

    const n = observations.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    for (const obs of observations) {
      const x = obs.oneOverU; // negative, e.g. -0.0167 to -0.0333
      const y = obs.oneOverV; // positive, e.g. +0.0167 to +0.0333
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
      sumY2 += y * y;
    }

    const denominator = n * sumX2 - sumX * sumX;
    if (Math.abs(denominator) < 1e-12) return null;

    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    // R² coefficient of determination
    const meanY = sumY / n;
    let ssTot = 0;
    let ssRes = 0;
    for (const obs of observations) {
      const x = obs.oneOverU;
      const y = obs.oneOverV;
      const yPred = slope * x + intercept;
      ssTot += (y - meanY) ** 2;
      ssRes += (y - yPred) ** 2;
    }

    const rSquared = ssTot > 1e-12 ? Math.max(0, Math.min(1, 1 - ssRes / ssTot)) : 1.0;

    // Experimental focal length from intercept: f_exp = 1 / intercept
    const experimentalF = intercept > 0.0001 ? 1 / intercept : null;
    const percentageDeviation =
      experimentalF !== null
        ? (Math.abs(experimentalF - theoreticalFocalLength) / theoreticalFocalLength) * 100
        : null;

    return {
      slope,
      intercept,
      rSquared,
      experimentalF,
      percentageDeviation,
      count: n,
    };
  }, [observations, theoreticalFocalLength]);

  // Coordinate mapping for SVG Graph
  // X-axis: 1/u from -0.05 to 0.00 cm⁻¹
  // Y-axis: 1/v from 0.00 to 0.06 cm⁻¹
  const graphWidth = 600;
  const graphHeight = 320;
  const padding = { top: 30, right: 30, bottom: 50, left: 65 };

  const plotWidth = graphWidth - padding.left - padding.right;
  const plotHeight = graphHeight - padding.top - padding.bottom;

  // Domain for 1/u (X): [-0.05, 0.00]
  const minX = -0.05;
  const maxX = 0.00;

  // Range for 1/v (Y): [0.00, 0.06]
  const minY = 0.00;
  const maxY = 0.06;

  const scaleX = (x: number) => {
    return padding.left + ((x - minX) / (maxX - minX)) * plotWidth;
  };

  const scaleY = (y: number) => {
    return padding.top + plotHeight - ((y - minY) / (maxY - minY)) * plotHeight;
  };

  // Regression line coordinates across X domain
  const regLineStart = {
    x: scaleX(-0.045),
    y: regression ? scaleY(regression.slope * -0.045 + regression.intercept) : scaleY(-0.045 + 0.05),
  };
  const regLineEnd = {
    x: scaleX(0.00),
    y: regression ? scaleY(regression.intercept) : scaleY(0.05),
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <LineChart className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Graphical Verification &bull; 1/v versus 1/u
          </h3>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
          Linear Lens Formula: 1/v = (1)&middot;(1/u) + (1/f)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Plot Column (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner select-none">
          <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-auto block">
            {/* Background Grid Lines */}
            {/* Horizontal Grid lines (Y = 0.01, 0.02, 0.03, 0.04, 0.05, 0.06) */}
            {[0.01, 0.02, 0.03, 0.04, 0.05, 0.06].map((val) => {
              const yPos = scaleY(val);
              return (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={yPos}
                    x2={padding.left + plotWidth}
                    y2={yPos}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 8}
                    y={yPos + 3}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    +{val.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Vertical Grid lines (X = -0.04, -0.03, -0.02, -0.01, 0.00) */}
            {[-0.05, -0.04, -0.03, -0.02, -0.01, 0.00].map((val) => {
              const xPos = scaleX(val);
              return (
                <g key={val}>
                  <line
                    x1={xPos}
                    y1={padding.top}
                    x2={xPos}
                    y2={padding.top + plotHeight}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={xPos}
                    y={padding.top + plotHeight + 16}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {val === 0 ? '0' : val.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Solid Coordinate Axes */}
            {/* X-axis (Y = 0) */}
            <line
              x1={padding.left}
              y1={scaleY(0)}
              x2={padding.left + plotWidth}
              y2={scaleY(0)}
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            {/* Y-axis (X = 0, at right side of domain!) */}
            <line
              x1={scaleX(0)}
              y1={padding.top}
              x2={scaleX(0)}
              y2={padding.top + plotHeight}
              stroke="#94a3b8"
              strokeWidth="1.5"
            />

            {/* Axis Titles */}
            <text
              x={padding.left + plotWidth / 2}
              y={graphHeight - 8}
              fill="#94a3b8"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              1/u (cm⁻¹) &rarr; Signed Object Distance
            </text>

            <text
              x={18}
              y={padding.top + plotHeight / 2}
              fill="#94a3b8"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
              transform={`rotate(-90 18 ${padding.top + plotHeight / 2})`}
            >
              1/v (cm⁻¹) &rarr; Signed Image Distance
            </text>

            {/* Theoretical Line of Fit (Reference: slope = 1, intercept = 1/20 = 0.05) */}
            <line
              x1={scaleX(-0.045)}
              y1={scaleY(-0.045 + 0.05)}
              x2={scaleX(0.00)}
              y2={scaleY(0.05)}
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.5"
            />

            {/* Regression Line from Recorded Data */}
            {regression && (
              <line
                x1={regLineStart.x}
                y1={regLineStart.y}
                x2={regLineEnd.x}
                y2={regLineEnd.y}
                stroke="#818cf8"
                strokeWidth="2.5"
                className="drop-shadow-[0_0_8px_rgba(129,140,248,0.7)]"
              />
            )}

            {/* Y-intercept marker (0, 1/f) */}
            <circle
              cx={scaleX(0)}
              cy={scaleY(regression ? regression.intercept : 0.05)}
              r="4.5"
              fill="#ec4899"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <text
              x={scaleX(0) - 10}
              y={scaleY(regression ? regression.intercept : 0.05) - 6}
              fill="#ec4899"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="end"
            >
              Intercept = 1/f ({regression ? regression.intercept.toFixed(4) : '0.0500'})
            </text>

            {/* Data Points from Observations */}
            {observations.map((obs, idx) => {
              const cx = scaleX(obs.oneOverU);
              const cy = scaleY(obs.oneOverV);
              return (
                <g key={obs.id}>
                  {/* Outer glow ring */}
                  <circle cx={cx} cy={cy} r="6" fill="#818cf8" opacity="0.3" />
                  {/* Core point */}
                  <circle cx={cx} cy={cy} r="3.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                  <text
                    x={cx}
                    y={cy - 8}
                    fill="#cbd5e1"
                    fontSize="8.5"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    #{idx + 1}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2 px-1">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-indigo-400 inline-block" />
              Solid Line: Experimental Regression
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-sky-400/50 border-t border-dashed inline-block" />
              Dashed: Theoretical Model (f = 20.0 cm)
            </span>
          </div>
        </div>

        {/* Analytics & Mathematical Regression Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 font-mono text-xs">
            <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-slate-200">
              <span>Regression Analysis</span>
              <span className="text-[10px] text-slate-400">Least-Squares Fit</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-slate-700">
                <span>Governing Form:</span>
                <span className="font-bold text-slate-900">1/v = m·(1/u) + c</span>
              </div>

              <div className="flex justify-between items-center text-slate-700">
                <span>Regression Equation:</span>
                <span className="font-bold text-indigo-700">
                  {regression
                    ? `1/v = ${regression.slope.toFixed(3)}·(1/u) + ${regression.intercept.toFixed(4)}`
                    : '1/v = 1.000·(1/u) + 0.0500 (Theory)'}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-700">
                <span>Observed Slope (m):</span>
                <span className="font-bold text-slate-900">
                  {regression ? regression.slope.toFixed(4) : '1.0000'} (Theory = 1.0)
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-700">
                <span>Y-Intercept (c = 1/f):</span>
                <span className="font-bold text-pink-700">
                  {regression ? `${regression.intercept.toFixed(4)} cm⁻¹` : '0.0500 cm⁻¹'}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-700">
                <span>Goodness of Fit (R²):</span>
                <span className="font-bold text-emerald-700">
                  {regression ? regression.rSquared.toFixed(4) : '1.0000'}
                </span>
              </div>
            </div>
          </div>

          {/* Result Card (Section 14 & 23 Requirements) */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
            <div className="flex items-center gap-2 text-indigo-900">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
              <h4 className="text-sm font-bold tracking-tight">
                {observations.length > 0 ? 'Experimental Result' : 'Theoretical Baseline (No Readings Recorded Yet)'}
              </h4>
            </div>

            <div className="space-y-1.5 font-sans">
              {observations.length === 0 ? (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Theoretical focal length = <strong className="font-bold font-mono text-indigo-950">20.00 cm</strong>.
                  Record observations from the optical bench to calculate the experimental focal length and linear regression.
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  The experimental focal length of the convex lens is approximately{' '}
                  <strong className="font-bold text-indigo-950 font-mono text-base">
                    {regression && regression.experimentalF !== null
                      ? `+${regression.experimentalF.toFixed(2)} cm`
                      : `+${(observations.reduce((acc, o) => acc + o.focalLength, 0) / observations.length).toFixed(2)} cm`}
                  </strong>
                  .
                </p>
              )}

              <div className="pt-2 border-t border-indigo-200/60 font-mono text-xs text-indigo-900 space-y-1">
                <div className="flex justify-between">
                  <span>Theoretical focal length:</span>
                  <span className="font-bold">+{theoreticalFocalLength.toFixed(2)} cm</span>
                </div>
                {observations.length >= 2 && regression ? (
                  <div className="flex justify-between">
                    <span>Calculated from:</span>
                    <span className="font-bold">f = 1 / Intercept</span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span>Percentage deviation:</span>
                  <span className="font-bold text-emerald-700">
                    {observations.length === 0
                      ? 'N/A'
                      : regression && regression.percentageDeviation !== null
                      ? `${regression.percentageDeviation.toFixed(2)}%`
                      : `${(
                          (Math.abs(
                            observations.reduce((acc, o) => acc + o.focalLength, 0) / observations.length -
                              theoreticalFocalLength
                          ) /
                            theoreticalFocalLength) *
                          100
                        ).toFixed(2)}%`}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-mono pt-1">
              {observations.length === 0 ? (
                <span>* Use "Record Current Reading" on the bench or "Load Standard Trials".</span>
              ) : observations.length === 1 ? (
                <span>* 1 observation recorded. Add at least 1 more reading to generate the linear regression line.</span>
              ) : (
                <span className="text-emerald-700 font-semibold">
                  &bull; Verified with {observations.length} experimental observation data points.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
