"use client";

import { useMemo } from "react";

type VizMode = "gear" | "speed";

interface TelemetrySample {
  distance: number;
  speed: number;
  gear?: number;
  relativeDistance?: number;
}

interface Props {
  trackPoints: { x: number; y: number }[];
  telemetry: TelemetrySample[];
  mode: VizMode;
  useImperial?: boolean;
}

const GEAR_COLORS: Record<number, string> = {
  0: "#7C879C", // N
  1: "#3B82F6",
  2: "#2563EB",
  3: "#14B8A6",
  4: "#06B6D4",
  5: "#84CC16",
  6: "#EAB308",
  7: "#F97316",
  8: "#EF4444",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const SPEED_BANDS_KMH = [
  { min: 0, max: 120, color: "#1D4ED8", label: "0-120" },
  { min: 121, max: 180, color: "#16A34A", label: "121-180" },
  { min: 181, max: 240, color: "#CA8A04", label: "181-240" },
  { min: 241, max: 300, color: "#EA580C", label: "241-300" },
  { min: 301, max: Infinity, color: "#B91C1C", label: "300+" },
] as const;

function speedBandColorFromKmh(speedKmh: number): string {
  const band = SPEED_BANDS_KMH.find((b) => speedKmh >= b.min && speedKmh <= b.max);
  return band?.color || SPEED_BANDS_KMH[SPEED_BANDS_KMH.length - 1].color;
}

function speedDeltaTint(delta: number): string {
  if (delta > 3) return "rgba(34, 197, 94, 0.55)"; // accelerating
  if (delta < -3) return "rgba(239, 68, 68, 0.55)"; // decelerating
  return "rgba(148, 163, 184, 0.35)"; // steady
}

export default function LapTrackMapCard({ trackPoints, telemetry, mode, useImperial = false }: Props) {
  const { transformedTrack, transformedSamples, speedMin, speedMax } = useMemo(() => {
    if (trackPoints.length < 2 || telemetry.length === 0) {
      return {
        transformedTrack: [] as { x: number; y: number }[],
        transformedSamples: [] as (TelemetrySample & { x: number; y: number })[],
        speedMin: 0,
        speedMax: 1,
      };
    }

    const minX = Math.min(...trackPoints.map((p) => p.x));
    const maxX = Math.max(...trackPoints.map((p) => p.x));
    const minY = Math.min(...trackPoints.map((p) => p.y));
    const maxY = Math.max(...trackPoints.map((p) => p.y));
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const scale = Math.max(rangeX, rangeY);
    const pad = 0.06;
    const canvasSpan = 1 - pad * 2;
    const offsetX = (scale - rangeX) / 2;
    const offsetY = (scale - rangeY) / 2;

    function normPoint(x: number, y: number): { x: number; y: number } {
      const nx = pad + (((x - minX) + offsetX) / scale) * canvasSpan;
      const ny = pad + (((maxY - y) + offsetY) / scale) * canvasSpan;
      return { x: nx, y: ny };
    }

    const normalizedTrack = trackPoints.map((p) => normPoint(p.x, p.y));

    const sampled = telemetry
      .filter((t) => typeof t.relativeDistance === "number")
      .map((t) => {
        const rel = clamp(t.relativeDistance ?? 0, 0, 1);
        const idx = clamp(Math.round(rel * (trackPoints.length - 1)), 0, trackPoints.length - 1);
        const point = normalizedTrack[idx];
        return { ...t, x: point.x, y: point.y };
      })
      .sort((a, b) => a.distance - b.distance);

    const speeds = telemetry.map((t) => t.speed).filter((v) => Number.isFinite(v));
    const minSpeed = speeds.length > 0 ? Math.min(...speeds) : 0;
    const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 1;

    return {
      transformedTrack: normalizedTrack,
      transformedSamples: sampled,
      speedMin: minSpeed,
      speedMax: maxSpeed,
    };
  }, [trackPoints, telemetry]);

  const trackPath = useMemo(() => {
    if (transformedTrack.length === 0) return "";
    const first = transformedTrack[0];
    const rest = transformedTrack.slice(1).map((p) => `L ${p.x * 1000} ${p.y * 1000}`).join(" ");
    return `M ${first.x * 1000} ${first.y * 1000} ${rest} Z`;
  }, [transformedTrack]);

  const segments = useMemo(() => {
    if (transformedSamples.length < 2) return [];
    const output: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      stroke: string;
      overlay?: string;
    }> = [];
    for (let i = 1; i < transformedSamples.length; i++) {
      const prev = transformedSamples[i - 1];
      const curr = transformedSamples[i];
      if (!Number.isFinite(prev.x) || !Number.isFinite(curr.x)) continue;
      const currSpeed = useImperial ? curr.speed * 0.6214 : curr.speed;
      const prevSpeed = useImperial ? prev.speed * 0.6214 : prev.speed;
      if (mode === "gear") {
        output.push({
          x1: prev.x,
          y1: prev.y,
          x2: curr.x,
          y2: curr.y,
          stroke: GEAR_COLORS[clamp(curr.gear ?? 0, 0, 8)] || "#9CA3AF",
        });
      } else {
        output.push({
          x1: prev.x,
          y1: prev.y,
          x2: curr.x,
          y2: curr.y,
          stroke: speedBandColorFromKmh(curr.speed),
          overlay: speedDeltaTint(currSpeed - prevSpeed),
        });
      }
    }
    return output;
  }, [transformedSamples, mode, speedMin, speedMax, useImperial]);

  const speedMinDisplay = useImperial ? speedMin * 0.6214 : speedMin;
  const speedMaxDisplay = useImperial ? speedMax * 0.6214 : speedMax;
  return (
    <div className="w-full h-full rounded border border-f1-border bg-f1-dark p-2 flex gap-2">
      <div className="flex-1 min-w-0">
        {transformedTrack.length === 0 || transformedSamples.length < 2 ? (
          <div className="h-full flex items-center justify-center text-[10px] text-f1-muted">
            No telemetry available for selected lap
          </div>
        ) : (
          <svg viewBox="0 0 1000 1000" className="w-full h-full">
            <path d={trackPath} fill="none" stroke="#2F3445" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
            <path d={trackPath} fill="none" stroke="#4B5563" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            {segments.map((seg, idx) => (
              <g key={`${mode}_${idx}`}>
                <line
                  x1={seg.x1 * 1000}
                  y1={seg.y1 * 1000}
                  x2={seg.x2 * 1000}
                  y2={seg.y2 * 1000}
                  stroke={seg.stroke}
                  strokeWidth={mode === "gear" ? 10 : 9}
                  strokeLinecap="round"
                />
                {mode === "speed" && seg.overlay && (
                  <line
                    x1={seg.x1 * 1000}
                    y1={seg.y1 * 1000}
                    x2={seg.x2 * 1000}
                    y2={seg.y2 * 1000}
                    stroke={seg.overlay}
                    strokeWidth={3.2}
                    strokeLinecap="round"
                  />
                )}
              </g>
            ))}
          </svg>
        )}
      </div>
      <div className="w-[64px] flex-shrink-0 border-l border-f1-border pl-1.5">
        <div className="text-[9px] font-bold text-f1-muted uppercase mb-1">Legend</div>
        {mode === "gear" ? (
          <div className="space-y-0.5">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((gear) => (
              <div key={gear} className="flex items-center gap-1 text-[9px] text-f1-muted">
                <span className="w-3 h-[3px] rounded" style={{ backgroundColor: GEAR_COLORS[gear] }} />
                <span>{gear === 0 ? "N" : `G${gear}`}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-[8px] text-f1-muted space-y-0.5">
              {SPEED_BANDS_KMH.map((band) => (
                <div key={band.label} className="flex items-center gap-1">
                  <span className="w-2.5 h-[3px] rounded" style={{ backgroundColor: band.color }} />
                  <span>{band.label}</span>
                </div>
              ))}
            </div>
            <div className="text-[8px] text-f1-muted border-t border-f1-border/70 pt-1">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-[3px] rounded bg-green-500" />
                <span>Accel</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-2.5 h-[3px] rounded bg-red-500" />
                <span>Brake</span>
              </div>
            </div>
            <div className="text-[8px] text-f1-muted/80 border-t border-f1-border/70 pt-1">
              {Math.round(speedMinDisplay)}-{Math.round(speedMaxDisplay)} {useImperial ? "mph" : "km/h"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
