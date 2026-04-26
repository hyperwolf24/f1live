"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { ReplayDriver } from "@/hooks/useReplaySocket";
import { LapEntry } from "@/components/Leaderboard";
import { TYRE_COLORS, TYRE_SHORT } from "@/lib/constants";
import { apiFetch } from "@/lib/api";
import PiPWindow from "@/components/PiPWindow";
import LapTrackMapCard from "@/components/LapTrackMapCard";

interface Props {
  laps: LapEntry[];
  drivers: ReplayDriver[];
  currentLap: number;
  replayYear: number;
  replayRound: number;
  sessionType: string;
  trackPoints: { x: number; y: number }[];
  corners: { x: number; y: number; number: number; letter: string; angle: number }[];
  useImperial?: boolean;
  onClose?: () => void;
}

interface LapTelemetry {
  driver: string;
  lap: number;
  distance: number[];
  speed: number[];
  gear?: number[];
  relative_distance?: number[];
}

interface SpeedPoint {
  distance: number;
  lapA: number | null;
  lapB: number | null;
}

type SectionKey =
  | "lapTimes"
  | "speedTrace"
  | "positionChanges"
  | "gearTrack"
  | "speedHeatmap"
  | "lapList";

type PipCardKey = "lapTimes" | "speedTrace" | "positionChanges" | "gearTrack" | "speedHeatmap" | "lapList";

function parseLapTime(timeStr: string): number | null {
  if (!timeStr) return null;
  const parts = timeStr.split(":");
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseFloat(parts[1]);
  }
  const val = parseFloat(parts[0]);
  return isNaN(val) ? null : val;
}

function formatSeconds(secs: number): string {
  const mins = Math.floor(secs / 60);
  const remainder = secs - mins * 60;
  return `${mins}:${remainder.toFixed(3).padStart(6, "0")}`;
}

function kmhToPreferred(speedKmh: number, useImperial: boolean): number {
  return useImperial ? speedKmh * 0.6214 : speedKmh;
}

function normalizeLapTrace(telemetry: LapTelemetry | undefined, useImperial: boolean): [number, number][] {
  if (!telemetry || telemetry.distance.length === 0 || telemetry.speed.length === 0) return [];
  const trace = telemetry.distance.map((distance, i) => [distance, kmhToPreferred(telemetry.speed[i] ?? 0, useImperial)] as [number, number]);
  const startDistance = trace[0][0];
  return trace.map(([distance, speed]) => [Math.max(0, distance - startDistance), speed]);
}

function mergeSpeedTraces(
  lapATrace: [number, number][],
  lapBTrace: [number, number][],
): SpeedPoint[] {
  const distanceSet = new Set<number>();
  for (const [d] of lapATrace) distanceSet.add(Number(d.toFixed(1)));
  for (const [d] of lapBTrace) distanceSet.add(Number(d.toFixed(1)));
  const distances = Array.from(distanceSet).sort((a, b) => a - b);

  function nearestValue(trace: [number, number][], target: number): number | null {
    if (trace.length === 0) return null;
    let best: [number, number] | null = null;
    let minDelta = Infinity;
    for (const point of trace) {
      const delta = Math.abs(point[0] - target);
      if (delta < minDelta) {
        minDelta = delta;
        best = point;
      }
      if (point[0] > target && delta > minDelta) break;
    }
    return best && minDelta <= 40 ? best[1] : null;
  }

  return distances.map((distance) => ({
    distance,
    lapA: nearestValue(lapATrace, distance),
    lapB: nearestValue(lapBTrace, distance),
  }));
}

function buildCornerMarkers(
  trackPoints: { x: number; y: number }[],
  corners: { x: number; y: number; number: number; letter: string; angle: number }[],
  maxDistance: number,
): { distance: number; label: string }[] {
  if (trackPoints.length < 2 || corners.length === 0 || maxDistance <= 0) return [];

  const cumulative: number[] = [0];
  for (let i = 1; i < trackPoints.length; i++) {
    const dx = trackPoints[i].x - trackPoints[i - 1].x;
    const dy = trackPoints[i].y - trackPoints[i - 1].y;
    cumulative.push(cumulative[i - 1] + Math.hypot(dx, dy));
  }
  const total = cumulative[cumulative.length - 1] || 1;

  return corners
    .map((corner) => {
      let nearestIdx = 0;
      let nearestDist = Infinity;
      for (let i = 0; i < trackPoints.length; i++) {
        const dx = trackPoints[i].x - corner.x;
        const dy = trackPoints[i].y - corner.y;
        const d = dx * dx + dy * dy;
        if (d < nearestDist) {
          nearestDist = d;
          nearestIdx = i;
        }
      }
      const ratio = cumulative[nearestIdx] / total;
      return {
        distance: ratio * maxDistance,
        label: corner.letter ? `T${corner.number}${corner.letter}` : `T${corner.number}`,
      };
    })
    .sort((a, b) => a.distance - b.distance);
}

function DriverDropdown({ value, onChange, drivers, placeholder, getColor }: {
  value: string | null;
  onChange: (abbr: string | null) => void;
  drivers: ReplayDriver[];
  placeholder: string;
  getColor: (abbr: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selected = drivers.find((d) => d.abbr === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 bg-f1-dark border border-f1-border rounded px-2 py-1.5 text-left hover:border-f1-muted transition-colors"
      >
        {selected ? (
          <>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getColor(selected.abbr) }} />
            <span className="text-xs font-bold text-white">{selected.abbr}</span>
            <span className="text-[10px] text-f1-muted truncate">{selected.team}</span>
          </>
        ) : (
          <span className="text-xs text-f1-muted">{placeholder}</span>
        )}
        <svg className={`w-3 h-3 ml-auto text-f1-muted flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-f1-dark border border-f1-border rounded shadow-xl z-50 max-h-[200px] overflow-y-auto">
          {value && (
            <button
              onClick={() => { onChange(null); setOpen(false); }}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-f1-muted hover:bg-white/5 transition-colors"
            >
              Clear
            </button>
          )}
          {drivers.map((d) => (
            <button
              key={d.abbr}
              onClick={() => { onChange(d.abbr); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 transition-colors ${
                d.abbr === value ? "bg-white/10" : ""
              }`}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-[10px] font-bold text-f1-muted w-4 text-right">{d.position}</span>
              <span className="text-xs font-bold text-white">{d.abbr}</span>
              <span className="text-[10px] text-f1-muted truncate">{d.team}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const LAP_RANGES = [
  { label: "All", value: 0 },
  { label: "Last 5", value: 5 },
  { label: "Last 10", value: 10 },
  { label: "Last 20", value: 20 },
] as const;

const TRACK_LAP_MODES = [
  { value: "last", label: "Last Lap" },
  { value: "fastest", label: "Fastest Lap" },
  { value: "specific", label: "Specific Lap" },
] as const;

const PIP_CARD_LABEL: Record<PipCardKey, string> = {
  lapTimes: "Lap Times",
  speedTrace: "Speed Trace",
  positionChanges: "Position Changes",
  gearTrack: "Gear on Track",
  speedHeatmap: "Speed Heatmap",
  lapList: "Lap List",
};

function PipIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <rect x="13" y="10" width="6" height="6" rx="1.2" />
    </svg>
  );
}

function PipToggleButton({
  active,
  onClick,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-bold transition-colors ${
        active
          ? "bg-f1-red border-f1-red text-white"
          : "border-f1-border text-f1-muted hover:text-white"
      }`}
      title={title}
    >
      <PipIcon />
      <span>PiP</span>
    </button>
  );
}

function getPipGridClass(count: number): string {
  if (count === 1) return "grid-cols-1";
  if (count === 2 || count === 4) return "grid-cols-2";
  if (count === 3) return "grid-cols-4";
  if (count === 5 || count === 6) return "grid-cols-6";
  if (count === 7) return "grid-cols-8";
  return "grid-cols-4";
}

function getPipItemClass(count: number, index: number): string {
  if (count === 3) {
    return index === 2 ? "col-span-2 col-start-2" : "col-span-2";
  }
  if (count === 5) {
    return index === 4 ? "col-span-2 col-start-3" : "col-span-2";
  }
  if (count === 6) return "col-span-2";
  if (count === 7) {
    return index === 6 ? "col-span-2 col-start-4" : "col-span-2";
  }
  if (count === 8) return "col-span-1";
  return "col-span-1";
}

export default function LapAnalysisPanel({
  laps,
  drivers,
  currentLap,
  replayYear,
  replayRound,
  sessionType,
  trackPoints,
  corners,
  useImperial = false,
  onClose,
}: Props) {
  const [selectedDrivers, setSelectedDrivers] = useState<[string | null, string | null]>([null, null]);
  const [lapRange, setLapRange] = useState<number>(0); // 0 = all
  const [lapOrder, setLapOrder] = useState<"asc" | "desc">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("f1replay_lap_order") as "asc" | "desc") || "asc";
    }
    return "asc";
  });
  const [traceDriver, setTraceDriver] = useState<string | null>(null);
  const [traceLapA, setTraceLapA] = useState<number | null>(null);
  const [traceLapB, setTraceLapB] = useState<number | null>(null);
  const [trackVizDriver, setTrackVizDriver] = useState<string | null>(null);
  const [trackVizLapMode, setTrackVizLapMode] = useState<"last" | "fastest" | "specific">("last");
  const [trackVizSpecificLap, setTrackVizSpecificLap] = useState<number | null>(null);
  const [positionHoverDriver, setPositionHoverDriver] = useState<string | null>(null);
  const [lapTelemetryCache, setLapTelemetryCache] = useState<Record<string, LapTelemetry>>({});
  const [singlePipCard, setSinglePipCard] = useState<PipCardKey | null>(null);
  const [lapCardsPipOpen, setLapCardsPipOpen] = useState(false);
  const [pipCards, setPipCards] = useState<Record<PipCardKey, boolean>>({
    lapTimes: true,
    speedTrace: true,
    positionChanges: true,
    gearTrack: false,
    speedHeatmap: false,
    lapList: false,
  });
  const [sectionOpen, setSectionOpen] = useState<Record<SectionKey, boolean>>({
    lapTimes: true,
    speedTrace: true,
    positionChanges: true,
    gearTrack: false,
    speedHeatmap: false,
    lapList: true,
  });
  const persistKey = `f1replay_lap_analysis_${replayYear}_${replayRound}_${sessionType}`;

  const sortedDrivers = useMemo(
    () => [...drivers].sort((a, b) => (a.position ?? 999) - (b.position ?? 999)),
    [drivers],
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(persistKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        selectedDrivers?: [string | null, string | null];
        traceDriver?: string | null;
        lapRange?: number;
        lapOrder?: "asc" | "desc";
        sectionOpen?: Record<SectionKey, boolean>;
      };
      if (parsed.selectedDrivers) setSelectedDrivers(parsed.selectedDrivers);
      if (typeof parsed.traceDriver === "string" || parsed.traceDriver === null) setTraceDriver(parsed.traceDriver ?? null);
      if (typeof parsed.lapRange === "number") setLapRange(parsed.lapRange);
      if (parsed.lapOrder === "asc" || parsed.lapOrder === "desc") setLapOrder(parsed.lapOrder);
      if (parsed.sectionOpen) setSectionOpen((prev) => ({ ...prev, ...parsed.sectionOpen }));
    } catch {
      // Ignore malformed persisted state
    }
  }, [persistKey]);

  useEffect(() => {
    try {
      localStorage.setItem(
        persistKey,
        JSON.stringify({
          selectedDrivers,
          traceDriver,
          lapRange,
          lapOrder,
          sectionOpen,
        }),
      );
    } catch {
      // Ignore persistence errors (private mode/storage full)
    }
  }, [persistKey, selectedDrivers, traceDriver, lapRange, lapOrder, sectionOpen]);

  // Build per-driver lap arrays
  const driverLaps = useMemo(() => {
    const map = new Map<string, LapEntry[]>();
    for (const lap of laps) {
      let arr = map.get(lap.driver);
      if (!arr) {
        arr = [];
        map.set(lap.driver, arr);
      }
      arr.push(lap);
    }
    // Sort each by lap number
    for (const arr of map.values()) {
      arr.sort((a, b) => a.lap_number - b.lap_number);
    }
    return map;
  }, [laps]);

  const traceDriverOptions = useMemo(
    () => [...sortedDrivers].filter((d) => (driverLaps.get(d.abbr) || []).some((lap) => lap.lap_number <= currentLap && !!lap.lap_time)),
    [sortedDrivers, driverLaps, currentLap],
  );

  useEffect(() => {
    if (traceDriver && traceDriverOptions.some((d) => d.abbr === traceDriver)) return;
    const preferred = selectedDrivers[0] && traceDriverOptions.some((d) => d.abbr === selectedDrivers[0])
      ? selectedDrivers[0]
      : traceDriverOptions[0]?.abbr ?? null;
    setTraceDriver(preferred);
  }, [selectedDrivers, traceDriver, traceDriverOptions]);

  const traceLapOptions = useMemo(() => {
    if (!traceDriver) return [];
    return (driverLaps.get(traceDriver) || [])
      .filter((l) => l.lap_number <= currentLap && !!l.lap_time)
      .map((l) => l.lap_number);
  }, [traceDriver, driverLaps, currentLap]);

  useEffect(() => {
    if (traceLapOptions.length === 0) {
      setTraceLapA(null);
      setTraceLapB(null);
      return;
    }
    // Always compare the latest completed lap vs the lap before it
    const last = traceLapOptions[traceLapOptions.length - 1];
    const prev = traceLapOptions.length > 1 ? traceLapOptions[traceLapOptions.length - 2] : last;
    setTraceLapA(last);
    setTraceLapB(prev);
  }, [traceLapOptions]);

  const trackVizDriverOptions = useMemo(
    () => [...sortedDrivers].filter((d) => (driverLaps.get(d.abbr) || []).some((lap) => lap.lap_number <= currentLap && !!lap.lap_time)),
    [sortedDrivers, driverLaps, currentLap],
  );

  useEffect(() => {
    if (trackVizDriver && trackVizDriverOptions.some((d) => d.abbr === trackVizDriver)) return;
    setTrackVizDriver(trackVizDriverOptions[0]?.abbr ?? null);
  }, [trackVizDriver, trackVizDriverOptions]);

  const trackVizLapOptions = useMemo(() => {
    if (!trackVizDriver) return [];
    return (driverLaps.get(trackVizDriver) || [])
      .filter((l) => l.lap_number <= currentLap && !!l.lap_time)
      .map((l) => l.lap_number);
  }, [trackVizDriver, driverLaps, currentLap]);

  const trackVizFastestLap = useMemo(() => {
    if (!trackVizDriver) return null;
    const lapsForDriver = (driverLaps.get(trackVizDriver) || [])
      .filter((l) => l.lap_number <= currentLap && !!l.lap_time);
    if (lapsForDriver.length === 0) return null;
    let bestLap: number | null = null;
    let bestTime = Infinity;
    for (const lap of lapsForDriver) {
      const secs = parseLapTime(lap.lap_time || "");
      if (secs != null && secs < bestTime) {
        bestTime = secs;
        bestLap = lap.lap_number;
      }
    }
    return bestLap;
  }, [trackVizDriver, driverLaps, currentLap]);

  useEffect(() => {
    if (trackVizLapOptions.length === 0) {
      setTrackVizSpecificLap(null);
      return;
    }
    if (trackVizSpecificLap && trackVizLapOptions.includes(trackVizSpecificLap)) return;
    setTrackVizSpecificLap(trackVizLapOptions[trackVizLapOptions.length - 1]);
  }, [trackVizLapOptions, trackVizSpecificLap]);

  const selectedTrackVizLap = useMemo(() => {
    if (trackVizLapOptions.length === 0) return null;
    if (trackVizLapMode === "last") return trackVizLapOptions[trackVizLapOptions.length - 1];
    if (trackVizLapMode === "fastest") return trackVizFastestLap;
    return trackVizSpecificLap;
  }, [trackVizLapMode, trackVizFastestLap, trackVizSpecificLap, trackVizLapOptions]);

  async function ensureLapTelemetry(driver: string, lap: number) {
    const key = `${driver}_${lap}`;
    if (lapTelemetryCache[key]) return;
    try {
      const telemetry = await apiFetch<LapTelemetry>(
        `/api/sessions/${replayYear}/${replayRound}/telemetry?type=${sessionType}&driver=${driver}&lap=${lap}`,
      );
      setLapTelemetryCache((prev) => ({ ...prev, [key]: telemetry }));
    } catch {
      // Keep UI responsive even if a specific lap telemetry is unavailable
    }
  }

  useEffect(() => {
    if (!traceDriver) return;
    if (traceLapA) void ensureLapTelemetry(traceDriver, traceLapA);
    if (traceLapB) void ensureLapTelemetry(traceDriver, traceLapB);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traceDriver, traceLapA, traceLapB, replayYear, replayRound, sessionType]);

  useEffect(() => {
    if (!trackVizDriver || !selectedTrackVizLap) return;
    void ensureLapTelemetry(trackVizDriver, selectedTrackVizLap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackVizDriver, selectedTrackVizLap, replayYear, replayRound, sessionType]);

  // Chart data: merged by lap number for up to 2 drivers
  const { chartData, slowBands, pitBands, yDomain } = useMemo(() => {
    const active = selectedDrivers.filter((d): d is string => d !== null);
    if (active.length === 0) return { chartData: [], slowBands: [], pitBands: [], yDomain: [0, 0] as [number, number] };

    const maxLap = Math.max(...active.map((d) => {
      const dl = driverLaps.get(d);
      if (!dl) return 0;
      const filtered = dl.filter((l) => l.lap_number <= currentLap);
      return filtered.length > 0 ? filtered[filtered.length - 1].lap_number : 0;
    }));

    // Collect pit laps across all active drivers
    const pitLapSet = new Set<number>();
    for (const d of active) {
      const dl = driverLaps.get(d) || [];
      for (const l of dl) {
        if (l.pit_in || l.pit_out) pitLapSet.add(l.lap_number);
      }
    }

    // First pass: collect all clean lap times to compute median (skip lap 1 and pit laps)
    const allCleanTimes: number[] = [];
    for (let lap = 2; lap <= maxLap; lap++) {
      if (pitLapSet.has(lap)) continue;
      for (const d of active) {
        const dl = driverLaps.get(d);
        const entry = dl?.find((l) => l.lap_number === lap);
        if (entry?.lap_time && lap <= currentLap) {
          const secs = parseLapTime(entry.lap_time);
          if (secs !== null) allCleanTimes.push(secs);
        }
      }
    }
    allCleanTimes.sort((a, b) => a - b);
    const median = allCleanTimes.length > 0 ? allCleanTimes[Math.floor(allCleanTimes.length / 2)] : 0;
    const slowThreshold = median * 1.07; // 7% slower than median = likely SC/VSC/slow lap

    // Second pass: build chart data, detect slow laps
    const slowLapSet = new Set<number>();
    let minTime = Infinity;
    let maxTime = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any>[] = [];
    for (let lap = 1; lap <= maxLap; lap++) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const point: Record<string, any> = { lap };
      const isPit = pitLapSet.has(lap);
      const isFirstLap = lap === 1;

      // Check if this lap is slow for any driver (also flag lap 1)
      let isSlow = false;
      if (!isPit && !isFirstLap) {
        for (const d of active) {
          const dl = driverLaps.get(d);
          const entry = dl?.find((l) => l.lap_number === lap);
          if (entry?.lap_time && lap <= currentLap) {
            const secs = parseLapTime(entry.lap_time);
            if (secs !== null && secs > slowThreshold) { isSlow = true; break; }
          }
        }
      }
      if (isSlow) slowLapSet.add(lap);

      // Store band type for tooltip
      point._bandType = isPit ? "pit" : isSlow ? "slow" : isFirstLap ? "lap1" : null;
      // Invisible hover target — must be within Y domain so it doesn't distort the axis
      point._hover = null;

      // Exclude pit laps, slow laps, and lap 1 from the line + Y-axis scaling
      const excludeFromLine = isPit || isSlow || isFirstLap;

      for (const d of active) {
        const dl = driverLaps.get(d);
        const entry = dl?.find((l) => l.lap_number === lap);
        // Always store the actual time for tooltip display
        if (entry?.lap_time && lap <= currentLap) {
          const secs = parseLapTime(entry.lap_time);
          if (secs !== null) {
            point[`_time_${d}`] = secs;
          }
        }
        if (entry?.lap_time && !excludeFromLine && lap <= currentLap) {
          const secs = parseLapTime(entry.lap_time);
          if (secs !== null) {
            point[d] = secs;
            if (secs < minTime) minTime = secs;
            if (secs > maxTime) maxTime = secs;
          } else {
            point[d] = null;
          }
        } else {
          point[d] = null;
        }
      }
      data.push(point);
    }

    // Build contiguous bands for slow laps and pit laps
    function buildBands(lapSet: Set<number>): { x1: number; x2: number }[] {
      const sorted = Array.from(lapSet).sort((a, b) => a - b);
      const bands: { x1: number; x2: number }[] = [];
      let i = 0;
      while (i < sorted.length) {
        const start = sorted[i];
        let end = start;
        while (i + 1 < sorted.length && sorted[i + 1] === end + 1) {
          i++;
          end = sorted[i];
        }
        bands.push({ x1: start - 0.5, x2: end + 0.5 });
        i++;
      }
      return bands;
    }

    // Set _hover to midpoint of Y range so tooltip triggers on every lap without distorting Y axis
    const mid = minTime < Infinity ? (minTime + maxTime) / 2 : 0;
    for (const point of data) {
      point._hover = mid;
    }

    const padding = (maxTime - minTime) * 0.1 || 2;
    return {
      chartData: data,
      slowBands: buildBands(slowLapSet),
      pitBands: buildBands(pitLapSet),
      yDomain: [Math.max(0, minTime - padding), maxTime + padding] as [number, number],
    };
  }, [selectedDrivers, driverLaps, currentLap]);

  const activeDrivers = selectedDrivers.filter((d): d is string => d !== null);

  // Filter chart data by lap range
  const { visibleChartData, visibleYDomain, visibleSlowBands, visiblePitBands } = useMemo(() => {
    if (lapRange === 0 || chartData.length === 0) {
      return { visibleChartData: chartData, visibleYDomain: yDomain, visibleSlowBands: slowBands, visiblePitBands: pitBands };
    }
    const minLap = Math.max(1, currentLap - lapRange);
    const filtered = chartData.filter((d) => (d.lap as number) >= minLap && (d.lap as number) <= currentLap);

    // Recompute Y domain for visible range
    let min = Infinity;
    let max = 0;
    for (const point of filtered) {
      for (const d of activeDrivers) {
        const v = point[d];
        if (v !== null && typeof v === "number") {
          if (v < min) min = v;
          if (v > max) max = v;
        }
      }
    }
    const padding = (max - min) * 0.1 || 2;
    const vYDomain: [number, number] = min < Infinity ? [Math.max(0, min - padding), max + padding] : yDomain;

    // Filter bands to visible range
    const filterBands = (bands: { x1: number; x2: number }[]) =>
      bands.filter((b) => b.x2 >= minLap && b.x1 <= currentLap)
        .map((b) => ({ x1: Math.max(b.x1, minLap), x2: Math.min(b.x2, currentLap) }));

    return {
      visibleChartData: filtered,
      visibleYDomain: vYDomain,
      visibleSlowBands: filterBands(slowBands),
      visiblePitBands: filterBands(pitBands),
    };
  }, [chartData, yDomain, slowBands, pitBands, lapRange, currentLap, activeDrivers]);

  const SECOND_DRIVER_COLOR = "#06B6D4"; // cyan to contrast any team colour

  function getDriverColor(abbr: string): string {
    const teamColor = drivers.find((d) => d.abbr === abbr)?.color || "#888";
    // If two drivers selected and they share a team colour, use a distinct colour for the second
    if (activeDrivers.length === 2 && abbr === activeDrivers[1]) {
      const firstColor = drivers.find((d) => d.abbr === activeDrivers[0])?.color || "#888";
      if (firstColor.toLowerCase() === teamColor.toLowerCase()) {
        return SECOND_DRIVER_COLOR;
      }
    }
    return teamColor;
  }

  function getTeamColor(abbr: string): string {
    return drivers.find((d) => d.abbr === abbr)?.color || "#888";
  }

  const lapATelemetry = traceDriver && traceLapA ? lapTelemetryCache[`${traceDriver}_${traceLapA}`] : undefined;
  const lapBTelemetry = traceDriver && traceLapB ? lapTelemetryCache[`${traceDriver}_${traceLapB}`] : undefined;
  const trackVizTelemetry = trackVizDriver && selectedTrackVizLap
    ? lapTelemetryCache[`${trackVizDriver}_${selectedTrackVizLap}`]
    : undefined;

  const trackVizSamples = useMemo(() => {
    if (!trackVizTelemetry) return [];
    const distance = trackVizTelemetry.distance || [];
    const speed = trackVizTelemetry.speed || [];
    const gear = trackVizTelemetry.gear || [];
    const relativeDistance = trackVizTelemetry.relative_distance || [];
    return distance.map((d, i) => ({
      distance: d,
      speed: speed[i] ?? 0,
      gear: gear[i] ?? 0,
      relativeDistance: relativeDistance[i],
    }));
  }, [trackVizTelemetry]);

  const speedTraceData = useMemo(() => {
    const lapATrace = normalizeLapTrace(lapATelemetry, useImperial);
    const lapBTrace = normalizeLapTrace(lapBTelemetry, useImperial);

    const maxDistance = Math.max(
      lapATrace.length > 0 ? lapATrace[lapATrace.length - 1][0] : 0,
      lapBTrace.length > 0 ? lapBTrace[lapBTrace.length - 1][0] : 0,
      1,
    );
    const merged = mergeSpeedTraces(lapATrace, lapBTrace);

    let minSpeed = Infinity;
    let maxSpeed = 0;
    for (const row of merged) {
      const values = [row.lapA, row.lapB].filter((v): v is number => v != null);
      for (const value of values) {
        minSpeed = Math.min(minSpeed, value);
        maxSpeed = Math.max(maxSpeed, value);
      }
    }
    const pad = maxSpeed > 0 ? Math.max(8, (maxSpeed - minSpeed) * 0.12) : 15;
    const domain: [number, number] = minSpeed < Infinity ? [Math.max(0, minSpeed - pad), maxSpeed + pad] : [0, 380];

    const cornerMarkers = buildCornerMarkers(trackPoints, corners, maxDistance);
    return { merged, domain, cornerMarkers, maxDistance };
  }, [lapATelemetry, lapBTelemetry, useImperial, trackPoints, corners]);

  const positionChangeData = useMemo(() => {
    const all = sortedDrivers.map((d) => d.abbr);
    if (all.length === 0) return { data: [], maxDrivers: 1 };
    const maxLap = Math.max(
      1,
      ...all.map((abbr) => {
        const dl = driverLaps.get(abbr) || [];
        const filtered = dl.filter((l) => l.lap_number <= currentLap);
        return filtered.length > 0 ? filtered[filtered.length - 1].lap_number : 1;
      }),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any>[] = [];
    for (let lap = 1; lap <= maxLap; lap++) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const point: Record<string, any> = { lap };
      for (const abbr of all) {
        const entry = (driverLaps.get(abbr) || []).find((l) => l.lap_number === lap && l.lap_number <= currentLap);
        point[abbr] = entry?.position ?? null;
      }
      data.push(point);
    }
    return { data, maxDrivers: Math.max(all.length, 1) };
  }, [sortedDrivers, driverLaps, currentLap]);

  const positionLineLabels = useMemo(() => {
    if (positionChangeData.data.length === 0) return [];
    const latestLap = positionChangeData.data[positionChangeData.data.length - 1]?.lap;
    if (typeof latestLap !== "number") return [];
    const labels = sortedDrivers
      .map((d) => {
        for (let i = positionChangeData.data.length - 1; i >= 0; i--) {
          const row = positionChangeData.data[i] as Record<string, unknown>;
          const value = row[d.abbr];
          if (typeof value === "number") {
            return {
              abbr: d.abbr,
              lap: Number(row.lap ?? latestLap),
              pos: value,
              color: getTeamColor(d.abbr),
            };
          }
        }
        return null;
      })
      .filter((x): x is { abbr: string; lap: number; pos: number; color: string } => x !== null)
      .sort((a, b) => a.pos - b.pos);
    return labels;
  }, [positionChangeData.data, sortedDrivers, drivers]);

  const allSectionsClosed =
    !sectionOpen.lapTimes &&
    !sectionOpen.speedTrace &&
    !sectionOpen.positionChanges &&
    !sectionOpen.gearTrack &&
    !sectionOpen.speedHeatmap &&
    !sectionOpen.lapList;

  function toggleSection(key: SectionKey) {
    setSectionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function togglePipCard(key: PipCardKey) {
    setPipCards((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function openSinglePipCard(key: PipCardKey) {
    setSinglePipCard(key);
  }

  const selectedPipCards = (Object.keys(pipCards) as PipCardKey[]).filter((key) => pipCards[key]);

  function renderPositionTooltip(
    active: boolean | undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any[] | undefined,
    label: string | number | undefined,
  ) {
    if (!active || !payload || payload.length === 0) return null;
    const preferred = positionHoverDriver
      ? payload.find((p) => String(p.dataKey) === positionHoverDriver && typeof p.value === "number")
      : null;
    const fallback = payload.find((p) => typeof p.value === "number");
    const target = preferred ?? fallback;
    if (!target) return null;
    const abbr = String(target.dataKey);
    const color = String(target.color || getTeamColor(abbr));
    const pos = Number(target.value);
    return (
      <div className="bg-[#1A1A26] border border-f1-border rounded-md px-2 py-1 text-[10px] shadow-xl">
        <div className="text-white font-bold mb-0.5">Lap {label}</div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-f1-muted">{abbr}</span>
          <span className="text-white ml-auto">P{pos}</span>
        </div>
      </div>
    );
  }

  function renderPipCard(key: PipCardKey, inPip = false) {
    if (key === "lapTimes") {
      return visibleChartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visibleChartData} margin={{ top: 6, right: 12, left: -6, bottom: 8 }}>
            <XAxis dataKey="lap" type="number" domain={["dataMin", "dataMax"]} allowDecimals={false} tick={{ fill: "#6B7280", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "#374151" }} />
            <YAxis domain={visibleYDomain} allowDataOverflow={true} tick={{ fill: "#6B7280", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "#374151" }} tickFormatter={(v: number) => formatSeconds(v)} />
            <Tooltip />
            {visibleSlowBands.map((band, i) => (
              <ReferenceArea key={`pip-slow-${i}`} x1={band.x1} x2={band.x2} y1={visibleYDomain[0]} y2={visibleYDomain[1]} fill="#EAB308" fillOpacity={0.14} stroke="#EAB308" strokeOpacity={0.28} strokeDasharray="3 3" ifOverflow="extendDomain" />
            ))}
            {visiblePitBands.map((band, i) => (
              <ReferenceArea key={`pip-pit-${i}`} x1={band.x1} x2={band.x2} y1={visibleYDomain[0]} y2={visibleYDomain[1]} fill="#FFFFFF" fillOpacity={0.06} stroke="#6B7280" strokeOpacity={0.28} strokeDasharray="3 3" ifOverflow="extendDomain" />
            ))}
            {activeDrivers.map((abbr) => (
              <Line key={`pip_${abbr}`} type="monotone" dataKey={abbr} stroke={getDriverColor(abbr)} strokeWidth={2} dot={false} connectNulls={false} name={abbr} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : <div className="h-full flex items-center justify-center text-[10px] text-f1-muted">Select one or two drivers</div>;
    }

    if (key === "speedTrace") {
      return speedTraceData.merged.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={speedTraceData.merged} margin={{ top: 6, right: 12, left: -8, bottom: 8 }}>
            <XAxis dataKey="distance" type="number" domain={[0, speedTraceData.maxDistance]} tick={{ fill: "#6B7280", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "#374151" }} tickFormatter={(v: number) => `${Math.round(v)} m`} />
            <YAxis domain={speedTraceData.domain} tick={{ fill: "#6B7280", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "#374151" }} tickFormatter={(v: number) => `${Math.round(v)}`} />
            <Tooltip />
            {speedTraceData.cornerMarkers.map((corner) => (
              <ReferenceLine key={`${inPip ? "pip-" : ""}${corner.label}`} x={corner.distance} stroke="#374151" strokeDasharray="2 4" strokeOpacity={0.6} label={{ value: corner.label, position: "insideTop", fill: "#6B7280", fontSize: 9 }} />
            ))}
            <Line type="monotone" dataKey="lapA" stroke="#FCD34D" strokeWidth={2} dot={false} connectNulls={false} />
            <Line type="monotone" dataKey="lapB" stroke="#22D3EE" strokeWidth={2} dot={false} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      ) : <div className="h-full flex items-center justify-center text-[10px] text-f1-muted">Select speed-trace driver</div>;
    }

    if (key === "positionChanges") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={positionChangeData.data} margin={{ top: 6, right: 42, left: -4, bottom: 8 }}>
            <XAxis dataKey="lap" type="number" domain={["dataMin", "dataMax"]} allowDecimals={false} tick={{ fill: "#6B7280", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "#374151" }} />
            <YAxis type="number" domain={[positionChangeData.maxDrivers, 1]} allowDecimals={false} tick={{ fill: "#6B7280", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "#374151" }} />
            <Tooltip content={({ active, payload, label }) => renderPositionTooltip(active, payload, label)} />
            {sortedDrivers.map((d) => (
              <Line
                key={`pip_pos_${d.abbr}`}
                type="monotone"
                dataKey={d.abbr}
                stroke={getTeamColor(d.abbr)}
                strokeWidth={positionHoverDriver === d.abbr ? 2.6 : 1.6}
                opacity={positionHoverDriver && positionHoverDriver !== d.abbr ? 0.2 : 1}
                dot={false}
                connectNulls={false}
                isAnimationActive={false}
                onMouseEnter={() => setPositionHoverDriver(d.abbr)}
                onMouseLeave={() => setPositionHoverDriver(null)}
              />
            ))}
            {positionLineLabels.map((item) => (
              <ReferenceDot
                key={`pip_lbl_${item.abbr}`}
                x={item.lap}
                y={item.pos}
                r={2.5}
                fill={item.color}
                stroke={item.color}
                ifOverflow="extendDomain"
                label={{
                  value: ` ${item.abbr}`,
                  position: "right",
                  fill: item.color,
                  fontSize: 9,
                  fontWeight: 800,
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (key === "gearTrack") {
      return (
        <LapTrackMapCard
          trackPoints={trackPoints}
          telemetry={trackVizSamples}
          mode="gear"
          useImperial={useImperial}
        />
      );
    }

    if (key === "speedHeatmap") {
      return (
        <LapTrackMapCard
          trackPoints={trackPoints}
          telemetry={trackVizSamples}
          mode="speed"
          useImperial={useImperial}
        />
      );
    }

    if (activeDrivers.length === 0) {
      return <div className="h-full flex items-center justify-center text-[10px] text-f1-muted">Select a driver to view laps.</div>;
    }

    const maxLap = Math.max(
      ...activeDrivers.map((d) => {
        const dl = driverLaps.get(d) || [];
        const filtered = dl.filter((l) => l.lap_number <= currentLap);
        return filtered.length > 0 ? filtered[filtered.length - 1].lap_number : 0;
      }),
    );
    const lapRows = [];
    const startLap = lapOrder === "desc" ? maxLap : 1;
    const endLap = lapOrder === "desc" ? 1 : maxLap;
    const step = lapOrder === "desc" ? -1 : 1;
    for (let lap = startLap; lapOrder === "desc" ? lap >= endLap : lap <= endLap; lap += step) {
      lapRows.push(lap);
      if (lapRows.length >= 60) break;
    }

    return (
      <div className="h-full overflow-auto pr-1">
        <div className="sticky top-0 bg-[#10131C] border-b border-f1-border pb-1 mb-1 text-[9px] text-f1-muted font-bold flex items-center gap-2 z-[1]">
          <span className="w-7">LAP</span>
          {activeDrivers.map((abbr) => <span key={abbr} className="flex-1">{abbr}</span>)}
          {activeDrivers.length === 2 && <span className="w-12 text-right">DELTA</span>}
        </div>
        <div className="space-y-0.5">
          {lapRows.map((lap) => (
            <div key={lap} className="text-[10px] flex items-center gap-2 text-white/90">
              <span className="w-7 text-f1-muted">{lap}</span>
              {activeDrivers.map((abbr) => {
                const entry = (driverLaps.get(abbr) || []).find((l) => l.lap_number === lap);
                const compound = entry?.compound;
                const tyreColor = compound ? TYRE_COLORS[compound] || "#888" : undefined;
                const tyreLabel = compound ? TYRE_SHORT[compound] || "?" : null;
                const isPit = entry?.pit_in || entry?.pit_out;
                return (
                  <span key={`${abbr}_${lap}`} className="flex-1 tabular-nums inline-flex items-center gap-1">
                    <span>{entry?.lap_time || "—"}</span>
                    {isPit && <span className="text-[8px] font-bold text-yellow-400">PIT</span>}
                    {tyreLabel && (
                      <span
                        className="w-3 h-3 rounded-full flex items-center justify-center text-[6px] font-extrabold leading-none border flex-shrink-0"
                        style={{ borderColor: tyreColor, color: tyreColor }}
                      >
                        {tyreLabel}
                      </span>
                    )}
                  </span>
                );
              })}
              {activeDrivers.length === 2 && (() => {
                const dl0 = driverLaps.get(activeDrivers[0]) || [];
                const dl1 = driverLaps.get(activeDrivers[1]) || [];
                const e0 = dl0.find((l) => l.lap_number === lap);
                const e1 = dl1.find((l) => l.lap_number === lap);
                const t0 = e0?.lap_time ? parseLapTime(e0.lap_time) : null;
                const t1 = e1?.lap_time ? parseLapTime(e1.lap_time) : null;
                if (t0 === null || t1 === null) return <span className="w-12 text-right text-f1-muted">—</span>;
                const delta = t0 - t1;
                const sign = delta > 0.001 ? "+" : delta < -0.001 ? "-" : "";
                const absDelta = Math.abs(delta).toFixed(3);
                const color = delta < -0.001 ? "text-green-400" : delta > 0.001 ? "text-red-400" : "text-f1-muted";
                return <span className={`w-12 text-right tabular-nums font-bold ${color}`}>{sign}{absDelta}</span>;
              })()}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const trackVizLapLabel = selectedTrackVizLap ? `Lap ${selectedTrackVizLap}` : "No lap selected";

  return (
    <div className="h-full flex flex-col bg-f1-card overflow-hidden">
      {/* Header - only shown on desktop (mobile has its own collapsible header) */}
      {onClose && (
        <div className="px-3 py-2 border-b border-f1-border flex-shrink-0 flex items-center justify-between">
          <span className="text-[10px] font-bold text-f1-muted uppercase tracking-wider">Lap Analysis</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLapCardsPipOpen(true)}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-f1-card/90 border border-f1-border rounded text-[9px] font-bold text-f1-muted hover:text-white transition-colors"
              title="Open Lap Analysis cards in PiP"
            >
              <PipIcon />
              <span>Cards PiP</span>
            </button>
            <button onClick={onClose} className="px-2 py-0.5 bg-f1-card/90 border border-f1-border rounded text-[9px] font-bold text-f1-muted hover:text-white transition-colors">
              Hide
            </button>
          </div>
        </div>
      )}

      {/* Driver selectors */}
      <div className="px-3 py-2 space-y-1.5 flex-shrink-0 border-b border-f1-border">
        <DriverDropdown
          value={selectedDrivers[0]}
          onChange={(abbr) => setSelectedDrivers((prev) => [abbr, prev[1]])}
          drivers={sortedDrivers}
          placeholder="Select driver..."
          getColor={getDriverColor}
        />
        <DriverDropdown
          value={selectedDrivers[1]}
          onChange={(abbr) => setSelectedDrivers((prev) => [prev[0], abbr])}
          drivers={sortedDrivers}
          placeholder="Compare with..."
          getColor={getDriverColor}
        />
      </div>

      {/* Compact section toggle row */}
      <div className="px-2 py-1.5 border-b border-f1-border flex items-center gap-1 overflow-x-auto">
        {([
          ["lapTimes", "Lap Times"],
          ["speedTrace", "Speed"],
          ["positionChanges", "Positions"],
          ["gearTrack", "Gear Map"],
          ["speedHeatmap", "Speed Map"],
          ["lapList", "Lap List"],
        ] as [SectionKey, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => toggleSection(key)}
            className={`px-2 py-0.5 rounded text-[9px] font-bold whitespace-nowrap transition-colors ${
              sectionOpen[key]
                ? "bg-f1-red text-white"
                : "bg-f1-dark border border-f1-border text-f1-muted hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => {
            const shouldOpenAll = allSectionsClosed;
            setSectionOpen({
              lapTimes: shouldOpenAll,
              speedTrace: shouldOpenAll,
              positionChanges: shouldOpenAll,
              gearTrack: shouldOpenAll,
              speedHeatmap: shouldOpenAll,
              lapList: shouldOpenAll,
            });
          }}
          className="ml-auto px-2 py-0.5 rounded text-[9px] font-bold whitespace-nowrap bg-f1-dark border border-f1-border text-f1-muted hover:text-white transition-colors"
        >
          {allSectionsClosed ? "Open All" : "Close All"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {activeDrivers.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-f1-muted">
            Select a driver to view lap times
          </div>
        ) : (
          <>
            {allSectionsClosed && (
              <div className="px-3 py-4 text-center text-[10px] text-f1-muted">
                All cards are minimized. Use the toggle row to reopen sections.
              </div>
            )}
            {/* Lap range toggle + Chart */}
            {sectionOpen.lapTimes && chartData.length > 0 && (
              <div className="px-2 pt-2 pb-1 flex-shrink-0">
                <div className="flex items-center gap-1 mb-2">
                  <button
                    onClick={() => toggleSection("lapTimes")}
                    className="px-1.5 py-0.5 rounded border border-f1-border text-[9px] font-bold text-f1-muted hover:text-white transition-colors"
                    title="Minimize Lap Times"
                  >
                    _
                  </button>
                  {LAP_RANGES.map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => setLapRange(value)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold transition-colors ${
                        lapRange === value
                          ? "bg-f1-red text-white"
                          : "bg-f1-dark border border-f1-border text-f1-muted hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                  <div className="ml-auto">
                    <PipToggleButton
                      onClick={() => openSinglePipCard("lapTimes")}
                      title="Open lap times in PiP"
                    />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={170}>
                  <LineChart data={visibleChartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                    <XAxis
                      dataKey="lap"
                      type="number"
                      domain={["dataMin", "dataMax"]}
                      tick={{ fill: "#6B7280", fontSize: 7 }}
                      tickLine={false}
                      axisLine={{ stroke: "#374151" }}
                      allowDecimals={false}
                      ticks={visibleChartData.map((d) => d.lap as number)}
                    />
                    <YAxis
                      domain={visibleYDomain}
                      allowDataOverflow={true}
                      tick={{ fill: "#6B7280", fontSize: 9 }}
                      tickLine={false}
                      axisLine={{ stroke: "#374151" }}
                      tickFormatter={(v: number) => formatSeconds(v)}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload || payload.length === 0) return null;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const point = payload[0]?.payload as Record<string, any> | undefined;
                        if (!point) return null;
                        const bandType = point._bandType as string | null;
                        const bandLabel = bandType === "pit" ? "Pit Stop" : bandType === "slow" ? "Yellow Flag / Slow Lap" : bandType === "lap1" ? "Formation / Lap 1" : null;
                        return (
                          <div className="bg-[#1A1A26] border border-f1-border rounded-md px-2.5 py-1.5 text-[11px] shadow-xl">
                            <div className="font-bold text-white mb-0.5">Lap {label}</div>
                            {bandLabel && (
                              <div className={`font-bold mb-0.5 ${bandType === "slow" ? "text-yellow-400" : "text-f1-muted"}`}>
                                {bandLabel}
                              </div>
                            )}
                            {activeDrivers.map((abbr) => {
                              const time = point[`_time_${abbr}`];
                              const lineVal = point[abbr];
                              return (
                                <div key={abbr} className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getDriverColor(abbr) }} />
                                  <span className="text-f1-muted">{abbr}:</span>
                                  <span className={lineVal != null ? "text-white" : "text-f1-muted"}>
                                    {time != null ? formatSeconds(time) : "—"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      }}
                    />
                    {/* Slow lap bands (safety car / yellow flag) */}
                    {visibleSlowBands.map((band, i) => (
                      <ReferenceArea
                        key={`slow-${i}`}
                        x1={band.x1}
                        x2={band.x2}
                        y1={visibleYDomain[0]}
                        y2={visibleYDomain[1]}
                        fill="#EAB308"
                        fillOpacity={0.15}
                        stroke="#EAB308"
                        strokeOpacity={0.3}
                        strokeDasharray="3 3"
                        ifOverflow="extendDomain"
                      />
                    ))}
                    {/* Pit lap bands */}
                    {visiblePitBands.map((band, i) => (
                      <ReferenceArea
                        key={`pit-${i}`}
                        x1={band.x1}
                        x2={band.x2}
                        y1={visibleYDomain[0]}
                        y2={visibleYDomain[1]}
                        fill="#FFFFFF"
                        fillOpacity={0.06}
                        stroke="#6B7280"
                        strokeOpacity={0.3}
                        strokeDasharray="3 3"
                        ifOverflow="extendDomain"
                      />
                    ))}
                    {/* Invisible line to enable tooltip on every lap including banded laps */}
                    <Line
                      type="monotone"
                      dataKey="_hover"
                      stroke="transparent"
                      strokeWidth={0}
                      dot={false}
                      activeDot={false}
                      name="_hover"
                      legendType="none"
                    />
                    {activeDrivers.map((abbr) => (
                      <Line
                        key={abbr}
                        type="monotone"
                        dataKey={abbr}
                        stroke={getDriverColor(abbr)}
                        strokeWidth={1.5}
                        dot={false}
                        connectNulls={false}
                        name={abbr}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Speed trace: latest completed lap vs previous lap */}
            {sectionOpen.speedTrace && (
            <div className="px-2 pt-1 pb-2 border-t border-f1-border/70">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleSection("speedTrace")}
                    className="px-1.5 py-0.5 rounded border border-f1-border text-[9px] font-bold text-f1-muted hover:text-white transition-colors"
                    title="Minimize Speed Trace"
                  >
                    _
                  </button>
                  <div className="text-[9px] font-bold text-f1-muted uppercase">Speed Trace</div>
                </div>
                <PipToggleButton
                  onClick={() => openSinglePipCard("speedTrace")}
                  title="Open speed trace in PiP"
                />
              </div>
              <div className="grid grid-cols-1 gap-1 mb-2">
                <select
                  value={traceDriver ?? ""}
                  onChange={(e) => setTraceDriver(e.target.value || null)}
                  className="bg-f1-dark border border-f1-border rounded px-1.5 py-1 text-[10px] text-white"
                >
                  <option value="">Driver</option>
                  {traceDriverOptions.map((d) => (
                    <option key={d.abbr} value={d.abbr}>{d.abbr}</option>
                  ))}
                </select>
              </div>
              <div className="text-[9px] text-f1-muted mb-1">
                Comparing: {traceLapA ? `Lap ${traceLapA}` : "—"} vs {traceLapB ? `Lap ${traceLapB}` : "—"} (latest completed laps)
              </div>
              {speedTraceData.merged.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={speedTraceData.merged} margin={{ top: 4, right: 6, left: -10, bottom: 6 }}>
                      <XAxis
                        dataKey="distance"
                        type="number"
                        domain={[0, speedTraceData.maxDistance]}
                        tick={{ fill: "#6B7280", fontSize: 8 }}
                        tickLine={false}
                        axisLine={{ stroke: "#374151" }}
                        tickFormatter={(v: number) => `${Math.round(v)}`}
                      />
                      <YAxis
                        domain={speedTraceData.domain}
                        tick={{ fill: "#6B7280", fontSize: 8 }}
                        tickLine={false}
                        axisLine={{ stroke: "#374151" }}
                        tickFormatter={(v: number) => `${Math.round(v)}`}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload || payload.length === 0) return null;
                          const row = payload[0]?.payload as SpeedPoint | undefined;
                          if (!row) return null;
                          const unit = useImperial ? "mph" : "km/h";
                          return (
                            <div className="bg-[#1A1A26] border border-f1-border rounded-md px-2 py-1 text-[10px] shadow-xl">
                              <div className="text-white font-bold mb-0.5">{Math.round(Number(label || 0))} m</div>
                              {traceLapA && (
                                <div className="text-f1-muted">
                                  <span className="text-yellow-300">Lap {traceLapA}:</span>{" "}
                                  <span className="text-white">{row.lapA != null ? `${Math.round(row.lapA)} ${unit}` : "—"}</span>
                                </div>
                              )}
                              {traceLapB && (
                                <div className="text-f1-muted">
                                  <span className="text-cyan-300">Lap {traceLapB}:</span>{" "}
                                  <span className="text-white">{row.lapB != null ? `${Math.round(row.lapB)} ${unit}` : "—"}</span>
                                </div>
                              )}
                            </div>
                          );
                        }}
                      />
                      {speedTraceData.cornerMarkers.map((corner) => (
                        <ReferenceLine
                          key={corner.label}
                          x={corner.distance}
                          stroke="#374151"
                          strokeDasharray="2 4"
                          strokeOpacity={0.6}
                          label={{ value: corner.label, position: "insideTop", fill: "#6B7280", fontSize: 8 }}
                        />
                      ))}
                      <Line type="monotone" dataKey="lapA" stroke="#FCD34D" strokeWidth={1.6} dot={false} connectNulls={false} />
                      <Line type="monotone" dataKey="lapB" stroke="#22D3EE" strokeWidth={1.6} dot={false} connectNulls={false} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-3 text-[9px] text-f1-muted mt-1">
                    {traceLapA && <span className="inline-flex items-center gap-1"><span className="w-2 h-[2px] bg-yellow-300" />Lap {traceLapA}</span>}
                    {traceLapB && <span className="inline-flex items-center gap-1"><span className="w-2 h-[2px] bg-cyan-300" />Lap {traceLapB}</span>}
                  </div>
                </>
              ) : (
                <div className="py-3 text-center text-[10px] text-f1-muted">
                  Select driver and laps to plot speed traces
                </div>
              )}
            </div>
            )}

            {/* Position changes card (all drivers, updates with replay progress) */}
            {sectionOpen.positionChanges && (
            <div className="px-2 pt-1 pb-2 border-t border-f1-border/70">
              <div className="flex items-center gap-1 mb-1">
                <button
                  onClick={() => toggleSection("positionChanges")}
                  className="px-1.5 py-0.5 rounded border border-f1-border text-[9px] font-bold text-f1-muted hover:text-white transition-colors"
                  title="Minimize Position Changes"
                >
                  _
                </button>
                <div className="text-[9px] font-bold text-f1-muted uppercase">Position Changes</div>
                <div className="ml-auto">
                  <PipToggleButton
                    onClick={() => openSinglePipCard("positionChanges")}
                    title="Open position changes in PiP"
                  />
                </div>
              </div>
              <div className="h-[220px] min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={positionChangeData.data} margin={{ top: 6, right: 38, left: -6, bottom: 6 }}>
                    <XAxis
                      dataKey="lap"
                      type="number"
                      domain={["dataMin", "dataMax"]}
                      allowDecimals={false}
                      tick={{ fill: "#6B7280", fontSize: 8 }}
                      tickLine={false}
                      axisLine={{ stroke: "#374151" }}
                    />
                    <YAxis
                      type="number"
                      domain={[positionChangeData.maxDrivers, 1]}
                      allowDecimals={false}
                      tick={{ fill: "#6B7280", fontSize: 8 }}
                      tickLine={false}
                      axisLine={{ stroke: "#374151" }}
                    />
                    <Tooltip content={({ active, payload, label }) => renderPositionTooltip(active, payload, label)} />
                    {sortedDrivers.map((d) => (
                      <Line
                        key={`pos_${d.abbr}`}
                        type="monotone"
                        dataKey={d.abbr}
                        stroke={getTeamColor(d.abbr)}
                        strokeWidth={positionHoverDriver === d.abbr ? 2.2 : 1.2}
                        opacity={positionHoverDriver && positionHoverDriver !== d.abbr ? 0.2 : 1}
                        dot={false}
                        connectNulls={false}
                        isAnimationActive={false}
                        onMouseEnter={() => setPositionHoverDriver(d.abbr)}
                        onMouseLeave={() => setPositionHoverDriver(null)}
                      />
                    ))}
                    {positionLineLabels.map((item) => (
                      <ReferenceDot
                        key={`lbl_${item.abbr}`}
                        x={item.lap}
                        y={item.pos}
                        r={2.3}
                        fill={item.color}
                        stroke={item.color}
                        ifOverflow="extendDomain"
                        label={{
                          value: ` ${item.abbr}`,
                          position: "right",
                          fill: item.color,
                          fontSize: 9,
                          fontWeight: 800,
                        }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            )}

            {/* Gear usage on track */}
            {sectionOpen.gearTrack && (
              <div className="px-2 pt-1 pb-2 border-t border-f1-border/70">
                <div className="flex items-center gap-1 mb-1">
                  <button
                    onClick={() => toggleSection("gearTrack")}
                    className="px-1.5 py-0.5 rounded border border-f1-border text-[9px] font-bold text-f1-muted hover:text-white transition-colors"
                    title="Minimize Gear on Track"
                  >
                    _
                  </button>
                  <div className="text-[9px] font-bold text-f1-muted uppercase">Gear on Track</div>
                  <div className="ml-auto">
                    <PipToggleButton
                      onClick={() => openSinglePipCard("gearTrack")}
                      title="Open gear map in PiP"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 mb-1">
                  <select
                    value={trackVizDriver ?? ""}
                    onChange={(e) => setTrackVizDriver(e.target.value || null)}
                    className="bg-f1-dark border border-f1-border rounded px-1.5 py-1 text-[10px] text-white"
                  >
                    <option value="">Driver</option>
                    {trackVizDriverOptions.map((d) => (
                      <option key={d.abbr} value={d.abbr}>{d.abbr}</option>
                    ))}
                  </select>
                  <select
                    value={trackVizLapMode}
                    onChange={(e) => setTrackVizLapMode(e.target.value as "last" | "fastest" | "specific")}
                    className="bg-f1-dark border border-f1-border rounded px-1.5 py-1 text-[10px] text-white"
                  >
                    {TRACK_LAP_MODES.map((mode) => (
                      <option key={mode.value} value={mode.value}>{mode.label}</option>
                    ))}
                  </select>
                  <select
                    value={trackVizSpecificLap ?? ""}
                    onChange={(e) => setTrackVizSpecificLap(e.target.value ? Number(e.target.value) : null)}
                    disabled={trackVizLapMode !== "specific"}
                    className="bg-f1-dark border border-f1-border rounded px-1.5 py-1 text-[10px] text-white disabled:opacity-40"
                  >
                    <option value="">Lap</option>
                    {trackVizLapOptions.map((lap) => (
                      <option key={lap} value={lap}>{lap}</option>
                    ))}
                  </select>
                </div>
                <div className="text-[9px] text-f1-muted mb-1">{trackVizDriver ? `${trackVizDriver} - ${trackVizLapLabel}` : "Select driver and lap mode"}</div>
                <div className="h-[190px]">
                  <LapTrackMapCard
                    trackPoints={trackPoints}
                    telemetry={trackVizSamples}
                    mode="gear"
                    useImperial={useImperial}
                  />
                </div>
              </div>
            )}

            {/* Speed heatmap on track */}
            {sectionOpen.speedHeatmap && (
              <div className="px-2 pt-1 pb-2 border-t border-f1-border/70">
                <div className="flex items-center gap-1 mb-1">
                  <button
                    onClick={() => toggleSection("speedHeatmap")}
                    className="px-1.5 py-0.5 rounded border border-f1-border text-[9px] font-bold text-f1-muted hover:text-white transition-colors"
                    title="Minimize Speed Heatmap"
                  >
                    _
                  </button>
                  <div className="text-[9px] font-bold text-f1-muted uppercase">Speed Heatmap</div>
                  <div className="ml-auto">
                    <PipToggleButton
                      onClick={() => openSinglePipCard("speedHeatmap")}
                      title="Open speed heatmap in PiP"
                    />
                  </div>
                </div>
                <div className="text-[9px] text-f1-muted mb-1">{trackVizDriver ? `${trackVizDriver} - ${trackVizLapLabel}` : "Select driver and lap mode"}</div>
                <div className="grid grid-cols-3 gap-1 mb-1">
                  <select
                    value={trackVizDriver ?? ""}
                    onChange={(e) => setTrackVizDriver(e.target.value || null)}
                    className="bg-f1-dark border border-f1-border rounded px-1.5 py-1 text-[10px] text-white"
                  >
                    <option value="">Driver</option>
                    {trackVizDriverOptions.map((d) => (
                      <option key={d.abbr} value={d.abbr}>{d.abbr}</option>
                    ))}
                  </select>
                  <select
                    value={trackVizLapMode}
                    onChange={(e) => setTrackVizLapMode(e.target.value as "last" | "fastest" | "specific")}
                    className="bg-f1-dark border border-f1-border rounded px-1.5 py-1 text-[10px] text-white"
                  >
                    {TRACK_LAP_MODES.map((mode) => (
                      <option key={mode.value} value={mode.value}>{mode.label}</option>
                    ))}
                  </select>
                  <select
                    value={trackVizSpecificLap ?? ""}
                    onChange={(e) => setTrackVizSpecificLap(e.target.value ? Number(e.target.value) : null)}
                    disabled={trackVizLapMode !== "specific"}
                    className="bg-f1-dark border border-f1-border rounded px-1.5 py-1 text-[10px] text-white disabled:opacity-40"
                  >
                    <option value="">Lap</option>
                    {trackVizLapOptions.map((lap) => (
                      <option key={lap} value={lap}>{lap}</option>
                    ))}
                  </select>
                </div>
                <div className="h-[190px]">
                  <LapTrackMapCard
                    trackPoints={trackPoints}
                    telemetry={trackVizSamples}
                    mode="speed"
                    useImperial={useImperial}
                  />
                </div>
              </div>
            )}

            {/* Lap list */}
            {sectionOpen.lapList && (
            <div className="px-3 pb-2 border-t border-f1-border/70">
              {/* Header row */}
              <div className="flex items-center gap-1 py-1 border-b border-f1-border">
                <button
                  onClick={() => toggleSection("lapList")}
                  className="px-1.5 py-0.5 rounded border border-f1-border text-[9px] font-bold text-f1-muted hover:text-white transition-colors"
                  title="Minimize Lap List"
                >
                  _
                </button>
                <PipToggleButton
                  onClick={() => openSinglePipCard("lapList")}
                  title="Open lap list in PiP"
                />
                <button
                  onClick={() => {
                    const next = lapOrder === "asc" ? "desc" : "asc";
                    setLapOrder(next);
                    try { localStorage.setItem("f1replay_lap_order", next); } catch {}
                  }}
                  className="w-8 text-[9px] font-bold text-f1-muted hover:text-white transition-colors flex items-center gap-0.5"
                  title={lapOrder === "asc" ? "Show latest first" : "Show earliest first"}
                >
                  LAP
                  <svg className={`w-2.5 h-2.5 transition-transform ${lapOrder === "desc" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDrivers.map((abbr) => (
                  <div key={abbr} className="flex-1 flex items-center gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getDriverColor(abbr) }}
                    />
                    <span className="text-[9px] font-bold text-f1-muted">{abbr}</span>
                  </div>
                ))}
                {activeDrivers.length === 2 && (
                  <span className="w-14 text-[9px] font-bold text-f1-muted text-right flex-shrink-0">DELTA</span>
                )}
              </div>

              {/* Lap rows */}
              {(() => {
                const maxLap = Math.max(
                  ...activeDrivers.map((d) => {
                    const dl = driverLaps.get(d) || [];
                    const filtered = dl.filter((l) => l.lap_number <= currentLap);
                    return filtered.length > 0 ? filtered[filtered.length - 1].lap_number : 0;
                  }),
                );
                const rows = [];
                const startLap = lapOrder === "desc" ? maxLap : 1;
                const endLap = lapOrder === "desc" ? 1 : maxLap;
                const step = lapOrder === "desc" ? -1 : 1;
                for (let lap = startLap; lapOrder === "desc" ? lap >= endLap : lap <= endLap; lap += step) {
                  rows.push(
                    <div
                      key={lap}
                      className={`flex items-center gap-1 py-0.5 ${lap === currentLap ? "bg-white/5" : ""}`}
                    >
                      <span className="w-8 text-[10px] font-bold text-f1-muted tabular-nums">{lap}</span>
                      {activeDrivers.map((abbr) => {
                        const dl = driverLaps.get(abbr) || [];
                        const entry = dl.find((l) => l.lap_number === lap);
                        const isPit = entry?.pit_in || entry?.pit_out;
                        const compound = entry?.compound;
                        const tyreColor = compound ? TYRE_COLORS[compound] || "#888" : undefined;
                        const tyreLabel = compound ? TYRE_SHORT[compound] || "?" : null;

                        return (
                          <div key={abbr} className="flex-1 flex items-center gap-1">
                            <span
                              className={`text-[10px] tabular-nums ${
                                isPit ? "text-yellow-400" : "text-white"
                              }`}
                            >
                              {entry?.lap_time || "—"}
                            </span>
                            {isPit && (
                              <span className="text-[8px] font-bold text-yellow-400">PIT</span>
                            )}
                            {tyreLabel && (
                              <span
                                className="w-3 h-3 rounded-full flex items-center justify-center text-[6px] font-extrabold leading-none border flex-shrink-0"
                                style={{ borderColor: tyreColor, color: tyreColor }}
                              >
                                {tyreLabel}
                              </span>
                            )}
                          </div>
                        );
                      })}
                      {activeDrivers.length === 2 && (() => {
                        const dl0 = driverLaps.get(activeDrivers[0]) || [];
                        const dl1 = driverLaps.get(activeDrivers[1]) || [];
                        const e0 = dl0.find((l) => l.lap_number === lap);
                        const e1 = dl1.find((l) => l.lap_number === lap);
                        const t0 = e0?.lap_time ? parseLapTime(e0.lap_time) : null;
                        const t1 = e1?.lap_time ? parseLapTime(e1.lap_time) : null;
                        if (t0 === null || t1 === null) return <span className="w-14 flex-shrink-0" />;
                        // Delta from driver 1's perspective: positive = driver 1 slower, negative = driver 1 faster
                        const delta = t0 - t1;
                        const absDelta = Math.abs(delta);
                        const sign = delta > 0.001 ? "+" : delta < -0.001 ? "-" : "";
                        const color = delta < -0.001 ? "text-green-400" : delta > 0.001 ? "text-red-400" : "text-f1-muted";
                        return (
                          <span className={`w-14 flex-shrink-0 text-[10px] font-bold tabular-nums text-right ${color}`}>
                            {sign}{absDelta.toFixed(3)}
                          </span>
                        );
                      })()}
                    </div>,
                  );
                }
                return rows;
              })()}
            </div>
            )}
          </>
        )}
      </div>
      {singlePipCard && (
        <PiPWindow onClose={() => setSinglePipCard(null)} width={980} height={620}>
          <div className="h-full bg-f1-card p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-f1-muted uppercase tracking-wider">{PIP_CARD_LABEL[singlePipCard]}</span>
              <button
                onClick={() => setSinglePipCard(null)}
                className="px-2 py-1 rounded border border-f1-border text-[10px] font-bold text-f1-muted hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
            <div className="flex-1 min-h-0 rounded border border-f1-border bg-[#10131C] p-2">
              {renderPipCard(singlePipCard, true)}
            </div>
          </div>
        </PiPWindow>
      )}
      {lapCardsPipOpen && (
        <PiPWindow onClose={() => setLapCardsPipOpen(false)} width={1180} height={760}>
          <div className="h-full bg-f1-card p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-f1-muted uppercase tracking-wider">Lap Analysis PiP</span>
              <div className="flex items-center gap-1">
                {(Object.keys(PIP_CARD_LABEL) as PipCardKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => togglePipCard(key)}
                    className={`px-1.5 py-0.5 rounded border text-[9px] font-bold transition-colors ${
                      pipCards[key]
                        ? "bg-f1-red border-f1-red text-white"
                        : "border-f1-border text-f1-muted hover:text-white"
                    }`}
                  >
                    {PIP_CARD_LABEL[key]}
                  </button>
                ))}
                <button
                  onClick={() => setLapCardsPipOpen(false)}
                  className="px-2 py-1 rounded border border-f1-border text-[10px] font-bold text-f1-muted hover:text-white transition-colors ml-1"
                >
                  Close
                </button>
              </div>
            </div>
            {selectedPipCards.length > 0 ? (
              <div className={`flex-1 min-h-0 grid gap-2 ${getPipGridClass(selectedPipCards.length)}`}>
                {selectedPipCards.map((key, index) => (
                  <div key={key} className={`min-h-0 min-w-0 rounded border border-f1-border bg-[#10131C] p-2 flex flex-col ${getPipItemClass(selectedPipCards.length, index)}`}>
                    <div className="text-[10px] font-bold text-f1-muted uppercase mb-1">{PIP_CARD_LABEL[key]}</div>
                    <div className="flex-1 min-h-0">{renderPipCard(key, true)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-f1-muted">
                Select at least one card to display in PiP.
              </div>
            )}
          </div>
        </PiPWindow>
      )}
    </div>
  );
}
