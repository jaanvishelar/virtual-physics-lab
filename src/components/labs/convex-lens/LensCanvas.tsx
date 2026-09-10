import React, { useMemo } from 'react';
import { Target, CheckCircle2, AlertCircle, Info, MoveHorizontal } from 'lucide-react';

interface LensCanvasProps {
  uMagnitude: number; // e.g. 60 (cm)
  screenPos: number; // e.g. 30 (cm)
  onScreenPosChange: (newPos: number) => void;
  onObjectDistanceChange: (newDist: number) => void;
  focalLength: number; // 20 (cm)
}

export const LensCanvas: React.FC<LensCanvasProps> = ({
  uMagnitude,
  screenPos,
  onScreenPosChange,
  onObjectDistanceChange,
  focalLength,
}) => {
  // Signed object distance
  const u = -uMagnitude;
  const f = focalLength;

  // Thin lens formula calculation: 1/v = 1/f + 1/u
  // v = (f * u) / (u + f)
  const isAtFocus = Math.abs(uMagnitude - f) < 0.001;
  const isVirtual = uMagnitude < f;

  const v = useMemo(() => {
    if (isAtFocus) return Infinity;
    return (f * u) / (u + f);
  }, [u, f, isAtFocus]);

  const magnification = useMemo(() => {
    if (isAtFocus) return Infinity;
    return v / u;
  }, [v, u, isAtFocus]);

  // Screen focus status (only applies to real images where v > 0)
  const isSharpFocus = !isVirtual && !isAtFocus && Math.abs(screenPos - v) <= 1.2;
  const focusDelta = !isVirtual && !isAtFocus ? screenPos - v : 0;

  // Coordinate system mapping for SVG (Width: 900, Height: 340)
  // Lens center O is at X = 450, Y = 170 (principal axis)
  // 1 cm = 3.8 pixels on bench
  const originX = 450;
  const originY = 170;
  const scale = 3.8; // px per cm
  const objectHeightCm = 8.0; // 8 cm object
  const objectHeightPx = objectHeightCm * scale; // 30.4 px

  // Object X coordinate
  const objectX = originX - uMagnitude * scale;
  const objectTopY = originY - objectHeightPx;

  // Image coordinates
  const imageX = isAtFocus ? 0 : originX + v * scale;
  const imageHeightPx = isAtFocus ? 0 : objectHeightPx * magnification; // Note: magnification is negative for inverted
  const imageTopY = originY + imageHeightPx; // Since magnification is negative for real image, imageHeightPx is negative, so originY + imageHeightPx goes down! Wait: let's check sign:
  // For u = -60, v = +30: m = +30 / -60 = -0.5.
  // Invert means arrow points DOWN.
  // In SVG, Y increases downward.
  // Upright object: from originY (base) up to originY - objectHeightPx (top).
  // Inverted real image: base at originY, tip points DOWN at originY + |m| * objectHeightPx.
  // Virtual erect image: base at originY, tip points UP at originY - |m| * objectHeightPx.

  // Reference points on axis
  const fLeftX = originX - f * scale; // -20 cm (F)
  const twoFLeftX = originX - 2 * f * scale; // -40 cm (2F)
  const fRightX = originX + f * scale; // +20 cm (F')
  const twoFRightX = originX + 2 * f * scale; // +40 cm (2F')
  const screenX = originX + screenPos * scale;

  // Ray paths calculation
  // Ray 1: From object tip parallel to principal axis to lens at (originX, objectTopY), then through F' (fRightX, originY)
  // Slope of refracted Ray 1: m1 = (originY - objectTopY) / (fRightX - originX) = objectHeightPx / (f * scale)
  const ray1LensX = originX;
  const ray1LensY = objectTopY;

  // Ray 2: From object tip through optical center (originX, originY) straight
  // Slope of Ray 2: m2 = (originY - objectTopY) / (originX - objectX) = objectHeightPx / (uMagnitude * scale)

  // Ray 3: Through left focus F (fLeftX, originY) to lens, then horizontal
  // Slope before lens: (originY - objectTopY) / (fLeftX - objectX)
  let ray3LensY = originY;
  if (!isAtFocus && uMagnitude > f) {
    const slope3 = (originY - objectTopY) / (fLeftX - objectX);
    ray3LensY = originY + slope3 * (originX - fLeftX);
  }

  // Extend rays to right edge (X = 880)
  const rightEdgeX = 880;

  return (
    <div className="space-y-4">
      {/* Simulation Header & Status Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-indigo-400 animate-pulse" />
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
              Virtual Optical Bench Simulator
            </span>
            <h4 className="text-sm font-bold text-white">
              Convex Lens (f = +20.0 cm) &bull; Paraxial Ray Tracing
            </h4>
          </div>
        </div>

        {/* Dynamic Focus Alignment Indicator */}
        <div className="flex items-center gap-2">
          {isVirtual ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <AlertCircle className="w-3.5 h-3.5" />
              Virtual Image (Cannot be received on screen)
            </span>
          ) : isAtFocus ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/40">
              <Info className="w-3.5 h-3.5" />
              Object at Focus (Refracted rays parallel to ∞)
            </span>
          ) : isSharpFocus ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Image Sharply Focused (v ≈ {v.toFixed(1)} cm)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              <MoveHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              Adjust screen ({focusDelta > 0 ? `move left ${(focusDelta).toFixed(1)} cm` : `move right ${(-focusDelta).toFixed(1)} cm`} to sharpen)
            </span>
          )}

          {!isVirtual && !isAtFocus && (
            <button
              onClick={() => onScreenPosChange(Math.max(15, Math.min(120, Number(v.toFixed(1)))))}
              className="px-2.5 py-1 text-xs font-mono font-semibold bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
              title="Snap screen to calculated image plane"
            >
              Auto-Focus Screen
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive SVG Ray Diagram Canvas */}
      <div className="relative w-full bg-slate-950 rounded-3xl border border-slate-800 shadow-inner overflow-hidden select-none">
        <svg
          viewBox="0 0 900 340"
          className="w-full h-auto block"
          style={{ minHeight: '260px' }}
        >
          <defs>
            {/* Grid background pattern */}
            <pattern id="lens-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>

            {/* Lens Gradient */}
            <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.15" />
            </linearGradient>

            {/* Arrow Marker for Ray 1 (Red/Pink) */}
            <marker id="ray1Arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e" />
            </marker>

            {/* Arrow Marker for Ray 2 (Amber) */}
            <marker id="ray2Arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
            </marker>

            {/* Arrow Marker for Ray 3 (Emerald) */}
            <marker id="ray3Arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
            </marker>
          </defs>

          {/* Background Grid */}
          <rect width="900" height="340" fill="url(#lens-grid)" />

          {/* Bench Bottom Bed Frame */}
          <rect x="20" y="275" width="860" height="28" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          
          {/* Bench Graduations on bottom track */}
          {Array.from({ length: 23 }).map((_, idx) => {
            const cmVal = -100 + idx * 10;
            const xCoord = originX + cmVal * scale;
            if (xCoord < 30 || xCoord > 870) return null;
            const isMajor = cmVal % 20 === 0;
            return (
              <g key={idx}>
                <line
                  x1={xCoord}
                  y1={275}
                  x2={xCoord}
                  y2={isMajor ? 287 : 281}
                  stroke={isMajor ? '#94a3b8' : '#475569'}
                  strokeWidth={isMajor ? '1.5' : '1'}
                />
                {isMajor && (
                  <text
                    x={xCoord}
                    y="300"
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {cmVal > 0 ? `+${cmVal}` : cmVal}
                  </text>
                )}
              </g>
            );
          })}
          <text x="450" y="320" fill="#475569" fontSize="9" fontFamily="monospace" textAnchor="middle">
            OPTICAL BENCH COORDINATES (cm relative to Optical Center O = 0)
          </text>

          {/* Principal Optical Axis */}
          <line x1="20" y1={originY} x2="880" y2={originY} stroke="#475569" strokeWidth="1.5" strokeDasharray="6 3" />

          {/* Reference Marks along Principal Axis */}
          {/* Optical Center O */}
          <circle cx={originX} cy={originY} r="3" fill="#ffffff" />
          <text x={originX} y={originY + 18} fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            O (0)
          </text>

          {/* F left (-20 cm) */}
          <circle cx={fLeftX} cy={originY} r="2.5" fill="#38bdf8" />
          <text x={fLeftX} y={originY + 18} fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            F (-20)
          </text>

          {/* 2F left (-40 cm) */}
          <circle cx={twoFLeftX} cy={originY} r="2.5" fill="#818cf8" />
          <text x={twoFLeftX} y={originY + 18} fill="#818cf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            2F (-40)
          </text>

          {/* F' right (+20 cm) */}
          <circle cx={fRightX} cy={originY} r="2.5" fill="#38bdf8" />
          <text x={fRightX} y={originY + 18} fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            F′ (+20)
          </text>

          {/* 2F' right (+40 cm) */}
          <circle cx={twoFRightX} cy={originY} r="2.5" fill="#818cf8" />
          <text x={twoFRightX} y={originY + 18} fill="#818cf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            2F′ (+40)
          </text>

          {/* CONVEX LENS STAND & OPTICAL CENTER VERTICAL AXIS */}
          {/* Lens Stand Base */}
          <path
            d={`M ${originX - 16} 275 L ${originX + 16} 275 L ${originX + 6} 240 L ${originX - 6} 240 Z`}
            fill="#334155"
            stroke="#64748b"
            strokeWidth="1"
          />
          <line x1={originX} y1={240} x2={originX} y2={originY + 70} stroke="#64748b" strokeWidth="4" />

          {/* Convex Lens Shape (Biconvex curved path) */}
          <g>
            {/* Symmetrical biconvex lens arcs */}
            <path
              d={`M ${originX} 35 Q ${originX + 22} ${originY} ${originX} 305 Q ${originX - 22} ${originY} ${originX} 35 Z`}
              fill="url(#lensGrad)"
              stroke="#38bdf8"
              strokeWidth="2"
              className="drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]"
            />
            {/* Center optical plane indicator */}
            <line x1={originX} y1="35" x2={originX} y2="305" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            
            {/* Lens top badge */}
            <rect x={originX - 35} y="15" width="70" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <text x={originX} y="27" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              CONVEX LENS
            </text>
          </g>

          {/* ILLUMINATED OBJECT (LEFT SIDE) */}
          {objectX >= 30 && (
            <g>
              {/* Stand on bench */}
              <line x1={objectX} y1={originY} x2={objectX} y2={275} stroke="#64748b" strokeWidth="2" />
              <rect x={objectX - 12} y="270" width="24" height="6" rx="2" fill="#475569" />

              {/* Object Arrow (Illuminated Upright Arrow pointing up from axis) */}
              {/* Arrow shaft */}
              <line
                x1={objectX}
                y1={originY}
                x2={objectX}
                y2={objectTopY}
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]"
              />
              {/* Arrow head */}
              <polygon
                points={`${objectX},${objectTopY - 7} ${objectX - 6},${objectTopY + 3} ${objectX + 6},${objectTopY + 3}`}
                fill="#34d399"
              />

              {/* Object Tag */}
              <rect x={objectX - 45} y={objectTopY - 26} width="90" height="18" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
              <text x={objectX} y={objectTopY - 14} fill="#a7f3d0" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                Object (u = {u.toFixed(1)} cm)
              </text>
            </g>
          )}

          {/* PRINCIPAL RAYS TRACING */}
          {/* Ray 1: Red/Pink (Parallel to axis -> through lens -> through F' -> image) */}
          {objectX >= 30 && (
            <g>
              {/* Segment 1: Object tip to lens */}
              <line
                x1={objectX}
                y1={objectTopY}
                x2={ray1LensX}
                y2={ray1LensY}
                stroke="#f43f5e"
                strokeWidth="1.8"
              />
              <line
                x1={objectX}
                y1={objectTopY}
                x2={(objectX + ray1LensX) / 2}
                y2={ray1LensY}
                stroke="#f43f5e"
                strokeWidth="1.8"
                markerEnd="url(#ray1Arrow)"
              />

              {/* Segment 2: Lens through F' and beyond */}
              {isAtFocus ? (
                // Emerges parallel to Ray 2
                <line
                  x1={ray1LensX}
                  y1={ray1LensY}
                  x2={rightEdgeX}
                  y2={ray1LensY + ((originY - objectTopY) / (f * scale)) * (rightEdgeX - ray1LensX)}
                  stroke="#f43f5e"
                  strokeWidth="1.8"
                />
              ) : isVirtual ? (
                <>
                  {/* Diverging forward */}
                  <line
                    x1={ray1LensX}
                    y1={ray1LensY}
                    x2={rightEdgeX}
                    y2={ray1LensY + ((originY - ray1LensY) / (fRightX - ray1LensX)) * (rightEdgeX - ray1LensX)}
                    stroke="#f43f5e"
                    strokeWidth="1.8"
                  />
                  {/* Virtual backwards trace (dashed) */}
                  <line
                    x1={ray1LensX}
                    y1={ray1LensY}
                    x2={imageX}
                    y2={originY - Math.abs(magnification) * objectHeightPx}
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                </>
              ) : (
                // Real image: passes through F' and image tip
                <>
                  <line
                    x1={ray1LensX}
                    y1={ray1LensY}
                    x2={Math.min(rightEdgeX, imageX + 50)}
                    y2={ray1LensY + ((imageTopY - ray1LensY) / (imageX - ray1LensX)) * (Math.min(rightEdgeX, imageX + 50) - ray1LensX)}
                    stroke="#f43f5e"
                    strokeWidth="1.8"
                  />
                  <line
                    x1={ray1LensX}
                    y1={ray1LensY}
                    x2={(ray1LensX + fRightX) / 2}
                    y2={(ray1LensY + originY) / 2}
                    stroke="#f43f5e"
                    strokeWidth="1.8"
                    markerEnd="url(#ray1Arrow)"
                  />
                </>
              )}
            </g>
          )}

          {/* Ray 2: Amber (Straight through optical center O) */}
          {objectX >= 30 && (
            <g>
              {/* Segment 1: Object tip to O */}
              <line
                x1={objectX}
                y1={objectTopY}
                x2={originX}
                y2={originY}
                stroke="#f59e0b"
                strokeWidth="1.8"
              />
              <line
                x1={objectX}
                y1={objectTopY}
                x2={(objectX + originX) / 2}
                y2={(objectTopY + originY) / 2}
                stroke="#f59e0b"
                strokeWidth="1.8"
                markerEnd="url(#ray2Arrow)"
              />

              {/* Segment 2: Continues through O */}
              {isAtFocus ? (
                <line
                  x1={originX}
                  y1={originY}
                  x2={rightEdgeX}
                  y2={originY + ((originY - objectTopY) / (originX - objectX)) * (rightEdgeX - originX)}
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                />
              ) : isVirtual ? (
                <>
                  {/* Diverges forward */}
                  <line
                    x1={originX}
                    y1={originY}
                    x2={rightEdgeX}
                    y2={originY + ((originY - objectTopY) / (originX - objectX)) * (rightEdgeX - originX)}
                    stroke="#f59e0b"
                    strokeWidth="1.8"
                  />
                  {/* Virtual backwards trace (dashed) */}
                  <line
                    x1={originX}
                    y1={originY}
                    x2={imageX}
                    y2={originY - Math.abs(magnification) * objectHeightPx}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                </>
              ) : (
                <>
                  <line
                    x1={originX}
                    y1={originY}
                    x2={Math.min(rightEdgeX, imageX + 50)}
                    y2={originY + ((imageTopY - originY) / (imageX - originX)) * (Math.min(rightEdgeX, imageX + 50) - originX)}
                    stroke="#f59e0b"
                    strokeWidth="1.8"
                  />
                  <line
                    x1={originX}
                    y1={originY}
                    x2={(originX + Math.min(rightEdgeX, imageX)) / 2}
                    y2={(originY + imageTopY) / 2}
                    stroke="#f59e0b"
                    strokeWidth="1.8"
                    markerEnd="url(#ray2Arrow)"
                  />
                </>
              )}
            </g>
          )}

          {/* Ray 3: Emerald (Through focal point F -> emerges parallel to axis) */}
          {objectX >= 30 && !isAtFocus && !isVirtual && uMagnitude > f && (
            <g>
              <line
                x1={objectX}
                y1={objectTopY}
                x2={originX}
                y2={ray3LensY}
                stroke="#10b981"
                strokeWidth="1.5"
                opacity="0.8"
              />
              <line
                x1={originX}
                y1={ray3LensY}
                x2={Math.min(rightEdgeX, imageX + 50)}
                y2={ray3LensY}
                stroke="#10b981"
                strokeWidth="1.5"
                opacity="0.8"
              />
              <line
                x1={originX}
                y1={ray3LensY}
                x2={(originX + Math.min(rightEdgeX, imageX)) / 2}
                y2={ray3LensY}
                stroke="#10b981"
                strokeWidth="1.5"
                markerEnd="url(#ray3Arrow)"
                opacity="0.8"
              />
            </g>
          )}

          {/* FORMED IMAGE ARROW */}
          {!isAtFocus && !isVirtual && imageX > originX && imageX <= 870 && (
            <g>
              {/* Image arrow (inverted pointing down) */}
              <line
                x1={imageX}
                y1={originY}
                x2={imageX}
                y2={imageTopY}
                stroke="#818cf8"
                strokeWidth="4"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]"
              />
              {/* Arrow head pointing downwards */}
              <polygon
                points={`${imageX},${imageTopY + 7} ${imageX - 6},${imageTopY - 3} ${imageX + 6},${imageTopY - 3}`}
                fill="#a5b4fc"
              />
              {/* Real Image Tag */}
              <rect x={imageX - 45} y={imageTopY + 12} width="90" height="18" rx="4" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
              <text x={imageX} y={imageTopY + 24} fill="#c7d2fe" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                Real Image (v = +{v.toFixed(1)} cm)
              </text>
            </g>
          )}

          {/* VIRTUAL IMAGE ARROW (DASHED, ERECT, ON LEFT) */}
          {isVirtual && imageX < originX && imageX >= 30 && (
            <g>
              {/* Virtual erect image */}
              <line
                x1={imageX}
                y1={originY}
                x2={imageX}
                y2={originY - Math.abs(magnification) * objectHeightPx}
                stroke="#fbbf24"
                strokeWidth="3.5"
                strokeDasharray="4 3"
                strokeLinecap="round"
              />
              <polygon
                points={`${imageX},${originY - Math.abs(magnification) * objectHeightPx - 6} ${imageX - 5},${originY - Math.abs(magnification) * objectHeightPx + 3} ${imageX + 5},${originY - Math.abs(magnification) * objectHeightPx + 3}`}
                fill="#fde047"
              />
              <rect x={imageX - 50} y={originY - Math.abs(magnification) * objectHeightPx - 24} width="100" height="18" rx="4" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
              <text x={imageX} y={originY - Math.abs(magnification) * objectHeightPx - 12} fill="#fef08a" fontSize="8.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                Virtual Image (v = {v.toFixed(1)} cm)
              </text>
            </g>
          )}

          {/* RECEIVING SCREEN (MOVABLE ON RIGHT) */}
          {screenX >= originX + 15 * scale && screenX <= 870 && (
            <g>
              {/* Screen Stand on bench */}
              <line x1={screenX} y1={originY + 80} x2={screenX} y2={275} stroke="#94a3b8" strokeWidth="2.5" />
              <rect x={screenX - 10} y="270" width="20" height="6" rx="2" fill="#64748b" />

              {/* Screen Surface (Vertical Plate) */}
              <rect
                x={screenX - 3}
                y="55"
                width="7"
                height="190"
                rx="2"
                fill={isSharpFocus ? '#f8fafc' : '#cbd5e1'}
                stroke={isSharpFocus ? '#10b981' : '#64748b'}
                strokeWidth={isSharpFocus ? '2.5' : '1.5'}
                className={isSharpFocus ? 'drop-shadow-[0_0_12px_rgba(16,185,129,0.7)]' : ''}
              />

              {/* Sharpness projection representation on screen */}
              {!isVirtual && !isAtFocus && (
                <g>
                  {isSharpFocus ? (
                    // In-focus sharp projection marker
                    <circle cx={screenX} cy={imageTopY} r="5" fill="#10b981" />
                  ) : (
                    // Out-of-focus blur disk
                    <circle
                      cx={screenX}
                      cy={originY + ((imageTopY - originY) * (screenPos / (v || 1)))}
                      r={Math.min(18, Math.max(4, Math.abs(focusDelta) * 0.4))}
                      fill="#818cf8"
                      opacity="0.35"
                    />
                  )}
                </g>
              )}

              {/* Screen Tag on Top */}
              <rect
                x={screenX - 35}
                y="35"
                width="70"
                height="18"
                rx="4"
                fill={isSharpFocus ? '#064e3b' : '#1e293b'}
                stroke={isSharpFocus ? '#10b981' : '#64748b'}
                strokeWidth="1"
              />
              <text
                x={screenX}
                y="47"
                fill={isSharpFocus ? '#6ee7b7' : '#e2e8f0'}
                fontSize="8.5"
                fontWeight="bold"
                fontFamily="monospace"
                textAnchor="middle"
              >
                Screen (+{screenPos.toFixed(1)})
              </text>
            </g>
          )}

          {/* Dimension indicator for focal length (O to F') */}
          <g>
            <line x1={originX} y1="75" x2={fRightX} y2="75" stroke="#38bdf8" strokeWidth="1" />
            <line x1={originX} y1="70" x2={originX} y2="80" stroke="#38bdf8" strokeWidth="1" />
            <line x1={fRightX} y1="70" x2={fRightX} y2="80" stroke="#38bdf8" strokeWidth="1" />
            <text x={(originX + fRightX) / 2} y="71" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle">
              f = +20 cm
            </text>
          </g>
        </svg>

        {/* Legend / Ray Explanation Bar at bottom */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 bg-slate-900/90 border-t border-slate-800 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-0.5 bg-rose-500 inline-block" />
              Ray 1: Parallel &rarr; Focus (F′)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-0.5 bg-amber-500 inline-block" />
              Ray 2: Undeviated through Optical Center (O)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-0.5 bg-emerald-500 inline-block" />
              Ray 3: Through Focus (F) &rarr; Parallel
            </span>
          </div>

          <div className="text-slate-400 text-[11px]">
            Incident light travels from left to right (+X direction)
          </div>
        </div>
      </div>
    </div>
  );
};
