import React, { useState } from 'react';
import {
  SEQUENCE_PRESETS,
  SequencePreset,
  simulateSqueezeTheorem,
} from '../utils/squeezeLogic';
import { SQUEEZE_PROOF_STEPS } from '../data/anrilDatabase';
import { MathText, formatSafeMathString } from './MathText';
import { Play, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SqueezeVisualizerProps {
  onSelectQuestionNumber: (questionNum: number) => void;
}

export const SqueezeVisualizer: React.FC<SqueezeVisualizerProps> = ({
  onSelectQuestionNumber,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('classic-sin');
  const [epsilon, setEpsilon] = useState<number>(0.25);
  const [selectedN, setSelectedN] = useState<number>(6);
  const [activeProofStep, setActiveProofStep] = useState<number>(1);
  const [numberLineMode, setNumberLineMode] = useState<'shifted' | 'original'>('shifted');
  const [zoomCorridor, setZoomCorridor] = useState<boolean>(true);

  const preset: SequencePreset =
    SEQUENCE_PRESETS.find((p) => p.id === selectedPresetId) || SEQUENCE_PRESETS[0];

  const maxN = 24;
  const sim = simulateSqueezeTheorem(preset, epsilon, maxN);
  const currentTerm =
    sim.terms.find((t) => t.n === selectedN) || sim.terms[Math.min(sim.K - 1, sim.terms.length - 1)];

  const currentStepObj =
    SQUEEZE_PROOF_STEPS.find((s) => s.stepNumber === activeProofStep) || SQUEEZE_PROOF_STEPS[0];

  const handlePresetChange = (newPresetId: string) => {
    setSelectedPresetId(newPresetId);
    const nextPreset =
      SEQUENCE_PRESETS.find((p) => p.id === newPresetId) || SEQUENCE_PRESETS[0];
    const nextSim = simulateSqueezeTheorem(nextPreset, epsilon, maxN);
    if (nextPreset.isConvergentSample && nextSim.K <= maxN) {
      setSelectedN(nextSim.K);
    } else {
      setSelectedN(6);
    }
  };

  const handleJumpToK = () => {
    if (sim.isConvergentSample && sim.K <= maxN) {
      setSelectedN(sim.K);
    } else {
      setSelectedN(10);
    }
  };

  // SVG Coordinate helpers for 2D Corridor Chart
  const svgWidth = 720;
  const svgHeight = 310;
  const padLeft = 62;
  const padRight = 24;
  const padTop = 24;
  const padBottom = 38;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  // Determine vertical Y range around w (focused on corridor vs full range)
  const fullDeviation = Math.max(
    epsilon * 2.2,
    ...sim.terms.map((t) =>
      Math.max(Math.abs(t.xn - sim.limitW), Math.abs(t.zn - sim.limitW), Math.abs(t.yn - sim.limitW))
    )
  );
  const focusedDeviation = Math.max(epsilon * 2.1, 0.45);
  const activeDeviation = zoomCorridor ? focusedDeviation : fullDeviation * 1.08;

  const yMin = sim.limitW - activeDeviation;
  const yMax = sim.limitW + activeDeviation;

  const mapX = (n: number) => padLeft + ((n - 1) / (maxN - 1)) * plotWidth;
  const mapY = (val: number) => {
    const clampedVal = Math.max(yMin, Math.min(yMax, val));
    return padTop + plotHeight - ((clampedVal - yMin) / (yMax - yMin)) * plotHeight;
  };

  const yCorridorTop = mapY(sim.limitW + epsilon);
  const yCorridorBottom = mapY(sim.limitW - epsilon);
  const yLimitCenter = mapY(sim.limitW);

  // 1D Number Line mapping (-range to +range)
  const nlRange = Math.max(
    epsilon * 1.45,
    Math.abs(currentTerm.xnMinusW) * 1.25,
    Math.abs(currentTerm.znMinusW) * 1.25,
    0.35
  );
  const map1D = (offsetFromW: number) => {
    const clamped = Math.max(-nlRange, Math.min(nlRange, offsetFromW));
    return 50 + (clamped / nlRange) * 42; // percentage 8% to 92%
  };

  return (
    <section
      id="visualisasi-koridor"
      aria-label="Simulasi Visual Interaktif Squeeze Theorem"
      className="bg-white border border-slate-200 rounded-xl p-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Visualisasi Standar Bu Dea</span>
            <span aria-hidden="true">·</span>
            <span>
              Grafik 2D Koridor Pita V<sub>ε</sub>(w) &amp; Garis Bilangan 1D
            </span>
            <span aria-hidden="true">·</span>
            <span>Teorema 3.2.7</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Laboratorium Visual Teorema Apit (Squeeze Theorem)
          </h2>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="preset-select" className="text-xs font-medium text-slate-600">
            Model Barisan:
          </label>
          <select
            id="preset-select"
            value={selectedPresetId}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
          >
            {SEQUENCE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {formatSafeMathString(p.name)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Two-Zone Sandbox Layout (65% Visual Stage / 35% Control & Proof Step Deck) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-start">
        {/* LEFT ZONE: 2D Corridor + 1D Number Line (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 2D Corridor Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  1. Grafik Kartesius 2D: Koridor Persekitaran V<sub>ε</sub>(w) &amp; Ekor Barisan (n ≥ K)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  <MathText text={preset.formulaLabel} />
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-sky-700 font-medium font-mono-tabular">
                  ■ z<sub>n</sub> (Atas)
                </span>
                <span className="text-emerald-700 font-semibold font-mono-tabular">
                  ● y<sub>n</sub> (Tengah)
                </span>
                <span className="text-amber-700 font-medium font-mono-tabular">
                  ▲ x<sub>n</sub> (Bawah)
                </span>
                <button
                  type="button"
                  onClick={() => setZoomCorridor((prev) => !prev)}
                  className="px-2 py-1 text-[11px] font-medium bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 whitespace-nowrap"
                >
                  {zoomCorridor ? 'Skala Fokus Koridor' : 'Skala Penuh'}
                </button>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto bg-white border border-slate-200 rounded"
                role="img"
                aria-label="Grafik 2D Koridor Konvergensi Squeeze Theorem"
                data-testid="squeeze-2d-corridor-svg"
              >
                {/* Shaded Corridor V_epsilon(w) = (w - eps, w + eps) */}
                <rect
                  x={padLeft}
                  y={Math.min(yCorridorTop, yCorridorBottom)}
                  width={plotWidth}
                  height={Math.abs(yCorridorBottom - yCorridorTop)}
                  fill="#E0F2FE"
                  opacity={0.7}
                />

                {/* Shaded Tail Zone n >= K */}
                {sim.isConvergentSample && sim.K <= maxN && (
                  <rect
                    x={mapX(sim.K)}
                    y={padTop}
                    width={svgWidth - padRight - mapX(sim.K)}
                    height={plotHeight}
                    fill="#DCFCE7"
                    opacity={0.4}
                  />
                )}

                {/* Upper and Lower Corridor Boundary Lines (w + eps, w - eps) */}
                <line
                  x1={padLeft}
                  y1={yCorridorTop}
                  x2={svgWidth - padRight}
                  y2={yCorridorTop}
                  stroke="#0284C7"
                  strokeWidth={1.5}
                  strokeDasharray="5 3"
                />
                <text
                  x={padLeft - 6}
                  y={yCorridorTop + 4}
                  textAnchor="end"
                  className="text-[10px] fill-sky-700 font-mono-tabular"
                >
                  w+ε={(sim.limitW + epsilon).toFixed(2)}
                </text>

                <line
                  x1={padLeft}
                  y1={yCorridorBottom}
                  x2={svgWidth - padRight}
                  y2={yCorridorBottom}
                  stroke="#0284C7"
                  strokeWidth={1.5}
                  strokeDasharray="5 3"
                />
                <text
                  x={padLeft - 6}
                  y={yCorridorBottom + 4}
                  textAnchor="end"
                  className="text-[10px] fill-sky-700 font-mono-tabular"
                >
                  w-ε={(sim.limitW - epsilon).toFixed(2)}
                </text>

                {/* Center Limit w Line */}
                <line
                  x1={padLeft}
                  y1={yLimitCenter}
                  x2={svgWidth - padRight}
                  y2={yLimitCenter}
                  stroke="#0F172A"
                  strokeWidth={1.2}
                  strokeDasharray="3 3"
                />
                <text
                  x={padLeft - 6}
                  y={yLimitCenter + 3}
                  textAnchor="end"
                  className="text-[10px] fill-slate-900 font-semibold font-mono-tabular"
                >
                  w={sim.limitW.toFixed(2)}
                </text>

                {/* Vertical K1, K2, and K = max(K1, K2) Boundary Lines */}
                {sim.isConvergentSample && sim.K1 <= maxN && sim.K1 !== sim.K && (
                  <g>
                    <line
                      x1={mapX(sim.K1)}
                      y1={padTop}
                      x2={mapX(sim.K1)}
                      y2={svgHeight - padBottom}
                      stroke="#D97706"
                      strokeWidth={1.2}
                      strokeDasharray="2 2"
                    />
                    <text
                      x={mapX(sim.K1)}
                      y={padTop + 12}
                      textAnchor="middle"
                      className="text-[10px] fill-amber-700 font-mono-tabular"
                    >
                      K1={sim.K1}
                    </text>
                  </g>
                )}

                {sim.isConvergentSample && sim.K <= maxN && (
                  <g>
                    <line
                      x1={mapX(sim.K)}
                      y1={padTop}
                      x2={mapX(sim.K)}
                      y2={svgHeight - padBottom}
                      stroke="#059669"
                      strokeWidth={2}
                    />
                    <text
                      x={mapX(sim.K) + 5}
                      y={padTop + 13}
                      textAnchor="start"
                      className="text-[11px] fill-emerald-800 font-bold font-mono-tabular"
                    >
                      K(ε)={sim.K} (Ekor n ≥ K)
                    </text>
                  </g>
                )}

                {/* Selected N Highlight Line */}
                <line
                  x1={mapX(currentTerm.n)}
                  y1={padTop}
                  x2={mapX(currentTerm.n)}
                  y2={svgHeight - padBottom}
                  stroke="#64748B"
                  strokeWidth={1}
                />

                {/* Plot points for xn, yn, zn */}
                {sim.terms.map((t) => {
                  const cx = mapX(t.n);
                  const cyX = mapY(t.xn);
                  const cyY = mapY(t.yn);
                  const cyZ = mapY(t.zn);
                  const isSelected = t.n === currentTerm.n;

                  return (
                    <g
                      key={t.n}
                      onClick={() => setSelectedN(t.n)}
                      className="cursor-pointer"
                    >
                      {/* Vertical squeeze connector segment between xn and zn */}
                      <line
                        x1={cx}
                        y1={cyZ}
                        x2={cx}
                        y2={cyX}
                        stroke={isSelected ? '#0F172A' : '#CBD5E1'}
                        strokeWidth={isSelected ? 2 : 1}
                      />
                      {/* zn point (top, blue square) */}
                      <rect
                        x={cx - (isSelected ? 4 : 2.5)}
                        y={cyZ - (isSelected ? 4 : 2.5)}
                        width={isSelected ? 8 : 5}
                        height={isSelected ? 8 : 5}
                        fill="#0284C7"
                      />
                      {/* xn point (bottom, amber circle) */}
                      <circle
                        cx={cx}
                        cy={cyX}
                        r={isSelected ? 4 : 2.5}
                        fill="#D97706"
                      />
                      {/* yn point (middle squeezed, emerald circle) */}
                      <circle
                        cx={cx}
                        cy={cyY}
                        r={isSelected ? 5.5 : 3.5}
                        fill={t.ynInCorridor ? '#059669' : '#DC2626'}
                        stroke="#FFFFFF"
                        strokeWidth={1}
                      />
                      {/* X-axis tick label */}
                      {(t.n === 1 || t.n % 2 === 0 || t.n === sim.K) && (
                        <text
                          x={cx}
                          y={svgHeight - 12}
                          textAnchor="middle"
                          className={`text-[10px] font-mono-tabular ${
                            isSelected ? 'fill-slate-900 font-bold' : 'fill-slate-500'
                          }`}
                        >
                          {t.n}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Axes */}
                <line
                  x1={padLeft}
                  y1={svgHeight - padBottom}
                  x2={svgWidth - padRight}
                  y2={svgHeight - padBottom}
                  stroke="#94A3B8"
                  strokeWidth={1}
                />
                <line
                  x1={padLeft}
                  y1={padTop}
                  x2={padLeft}
                  y2={svgHeight - padBottom}
                  stroke="#94A3B8"
                  strokeWidth={1}
                />
              </svg>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
              <span>
                Klik titik pada grafik atau geser slider indeks <strong>n</strong> untuk menginspeksi penjepitan suku ke-n.
              </span>
              <span className="font-mono-tabular text-slate-800">
                Koridor V<sub>ε</sub>(w) = ({(sim.limitW - epsilon).toFixed(3)}, {(sim.limitW + epsilon).toFixed(3)})
              </span>
            </div>
          </div>

          {/* 1D Number Line Card (Gaya Annisa, Gagah & Bu Dea) */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  2. Garis Bilangan 1D (Visualisasi Soal No. 10 &amp; 11 pada Suku ke-n = {currentTerm.n})
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Menjawab pertanyaan{' '}
                  <em>
                    &quot;it follows (why?) that -ε &lt; y<sub>n</sub> - w &lt; ε&quot;
                  </em>{' '}
                  di halaman 1–2 PDF
                </p>
              </div>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setNumberLineMode('shifted')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                    numberLineMode === 'shifted'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Selisih (y<sub>n</sub> - w) ∈ (-ε, ε)
                </button>
                <button
                  type="button"
                  onClick={() => setNumberLineMode('original')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                    numberLineMode === 'original'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Posisi Asli y<sub>n</sub> ∈ (w-ε, w+ε)
                </button>
              </div>
            </div>

            {/* 1D Number Line Visual Track */}
            <div className="relative h-24 bg-white border border-slate-200 rounded-lg px-6 flex items-center">
              {/* Base horizontal line */}
              <div className="w-full h-0.5 bg-slate-300 relative">
                {/* Active Open Interval (-eps, +eps) */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-2.5 bg-sky-100 border-y border-sky-400"
                  style={{
                    left: `${map1D(-epsilon)}%`,
                    width: `${Math.max(0, map1D(epsilon) - map1D(-epsilon))}%`,
                  }}
                />

                {/* Left boundary -epsilon (Open Circle per Bu Dea Aturan 1: simbol < tanpa =) */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${map1D(-epsilon)}%` }}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-sky-600" title="Simbol < (terbuka)" />
                  <span className="mt-1.5 text-[11px] font-mono-tabular font-semibold text-sky-800 whitespace-nowrap">
                    {numberLineMode === 'shifted'
                      ? `-ε (${(-epsilon).toFixed(2)})`
                      : `w-ε (${(sim.limitW - epsilon).toFixed(2)})`}
                  </span>
                </div>

                {/* Center 0 or w */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: '50%' }}
                >
                  <div className="w-2 h-2 rounded-full bg-slate-900" />
                  <span className="mt-2 text-[10px] font-mono-tabular text-slate-600 whitespace-nowrap">
                    {numberLineMode === 'shifted' ? '0 (Pusat)' : `w = ${sim.limitW}`}
                  </span>
                </div>

                {/* Right boundary +epsilon (Open Circle) */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${map1D(epsilon)}%` }}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-sky-600" title="Simbol < (terbuka)" />
                  <span className="mt-1.5 text-[11px] font-mono-tabular font-semibold text-sky-800 whitespace-nowrap">
                    {numberLineMode === 'shifted'
                      ? `+ε (+${epsilon.toFixed(2)})`
                      : `w+ε (${(sim.limitW + epsilon).toFixed(2)})`}
                  </span>
                </div>

                {/* Point xn - w */}
                <div
                  className="absolute bottom-2 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${map1D(currentTerm.xnMinusW)}%` }}
                >
                  <span className="text-[10px] font-mono-tabular font-semibold text-amber-800 bg-amber-50 border border-amber-300 rounded px-1 whitespace-nowrap">
                    {numberLineMode === 'shifted' ? (
                      <>
                        x<sub>n</sub>-w={currentTerm.xnMinusW.toFixed(3)}
                      </>
                    ) : (
                      <>
                        x<sub>n</sub>={currentTerm.xn.toFixed(3)}
                      </>
                    )}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-600 mt-0.5" />
                </div>

                {/* Point yn - w */}
                <div
                  className="absolute bottom-7 -translate-x-1/2 flex flex-col items-center z-10"
                  style={{ left: `${map1D(currentTerm.ynMinusW)}%` }}
                >
                  <span className="text-[10px] font-mono-tabular font-bold text-emerald-900 bg-emerald-50 border border-emerald-400 rounded px-1.5 py-0.5 whitespace-nowrap shadow-xs">
                    {numberLineMode === 'shifted' ? (
                      <>
                        y<sub>n</sub>-w={currentTerm.ynMinusW.toFixed(3)}
                      </>
                    ) : (
                      <>
                        y<sub>n</sub>={currentTerm.yn.toFixed(3)}
                      </>
                    )}
                  </span>
                  <div className="w-3 h-3 rounded-full bg-emerald-600 mt-0.5 ring-2 ring-white" />
                </div>

                {/* Point zn - w */}
                <div
                  className="absolute bottom-2 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${map1D(currentTerm.znMinusW)}%` }}
                >
                  <span className="text-[10px] font-mono-tabular font-semibold text-sky-800 bg-sky-50 border border-sky-300 rounded px-1 whitespace-nowrap">
                    {numberLineMode === 'shifted' ? (
                      <>
                        z<sub>n</sub>-w={currentTerm.znMinusW.toFixed(3)}
                      </>
                    ) : (
                      <>
                        z<sub>n</sub>={currentTerm.zn.toFixed(3)}
                      </>
                    )}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-600 mt-0.5" />
                </div>
              </div>
            </div>

            {/* Live Inequality Chain Readout */}
            <div className="mt-3 bg-white border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-xs font-mono-tabular text-slate-800">
                <span className="font-semibold text-slate-600">Rantai Suku n={currentTerm.n}: </span>
                <span className="text-sky-700">{(-epsilon).toFixed(3)}</span>
                <span> {currentTerm.xnInCorridor ? '<' : '≮'} </span>
                <span className="text-amber-700 font-semibold">{currentTerm.xnMinusW.toFixed(3)}</span>
                <span> ≤ </span>
                <span className="text-emerald-700 font-bold">{currentTerm.ynMinusW.toFixed(3)}</span>
                <span> ≤ </span>
                <span className="text-sky-700 font-semibold">{currentTerm.znMinusW.toFixed(3)}</span>
                <span> {currentTerm.znInCorridor ? '<' : '≮'} </span>
                <span className="text-sky-700">+{epsilon.toFixed(3)}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-medium">
                {currentTerm.ynInCorridor && currentTerm.xnInCorridor && currentTerm.znInCorridor ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Terjepit di dalam (-ε, ε)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-700">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      {sim.isConvergentSample
                        ? `Suku awal (n < K=${sim.K}), belum wajib di dalam koridor`
                        : 'Kasus Gagal: lim(x_n) ≠ lim(z_n)'}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT ZONE: Interactive Sliders & 5-Step Dynamic Proof Deck (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Parameter Controls */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Panel Kontrol Parameter (ε &amp; Indeks Ekor K)
            </h3>

            {/* Epsilon Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="epsilon-slider" className="font-medium text-slate-700">
                  Radius Persekitaran / Koridor (ε &gt; 0):
                </label>
                <span className="font-mono-tabular font-bold text-sky-700">
                  ε = {epsilon.toFixed(2)}
                </span>
              </div>
              <input
                id="epsilon-slider"
                type="range"
                min={0.05}
                max={0.8}
                step={0.01}
                value={epsilon}
                onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex items-center justify-between gap-1.5 mt-2">
                {[0.5, 0.25, 0.15, 0.08].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setEpsilon(val)}
                    className={`flex-1 py-1 px-2 text-xs font-mono-tabular rounded border transition-colors whitespace-nowrap ${
                      Math.abs(epsilon - val) < 0.005
                        ? 'bg-sky-600 text-white border-sky-600 font-semibold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ε={val}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected n Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="index-n-slider" className="font-medium text-slate-700">
                  Inspeksi Indeks Suku ke-n (n ∈ <strong>N</strong>):
                </label>
                <span className="font-mono-tabular font-bold text-slate-900">
                  n = {currentTerm.n}{' '}
                  {currentTerm.n >= sim.K && sim.isConvergentSample ? '(≥ K [Masuk Koridor])' : '(< K)'}
                </span>
              </div>
              <input
                id="index-n-slider"
                type="range"
                min={1}
                max={maxN}
                step={1}
                value={currentTerm.n}
                onChange={(e) => setSelectedN(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex items-center justify-between gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleJumpToK}
                  className="px-3 py-1.5 text-xs font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors whitespace-nowrap shrink-0"
                >
                  Lompat ke Ambang Ekor K(ε) = {sim.K}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEpsilon(0.25);
                    setSelectedN(5);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Computed K1, K2, K Summary Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center">
              <div className="bg-white border border-slate-200 rounded p-2">
                <div className="text-[11px] text-slate-500">
                  Batas X (K<sub>1</sub>)
                </div>
                <div className="text-sm font-bold font-mono-tabular text-amber-700">
                  {sim.isConvergentSample ? sim.K1 : '—'}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded p-2">
                <div className="text-[11px] text-slate-500">
                  Batas Z (K<sub>2</sub>)
                </div>
                <div className="text-sm font-bold font-mono-tabular text-sky-700">
                  {sim.isConvergentSample ? sim.K2 : '—'}
                </div>
              </div>
              <div className="bg-white border border-emerald-300 rounded p-2">
                <div className="text-[11px] text-emerald-800 font-medium">
                  K = max(K<sub>1</sub>,K<sub>2</sub>)
                </div>
                <div className="text-sm font-bold font-mono-tabular text-emerald-700">
                  {sim.isConvergentSample ? sim.K : 'Tidak Ada'}
                </div>
              </div>
            </div>
          </div>

          {/* 5-Step Dynamic Proof Walkthrough Player */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Alur Pembuktian Dinamis (Langkah {currentStepObj.stepNumber} dari 5)
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Langkah bukti sebelumnya"
                  onClick={() => setActiveProofStep((prev) => (prev > 1 ? prev - 1 : 5))}
                  className="p-1.5 bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Langkah bukti selanjutnya"
                  onClick={() => setActiveProofStep((prev) => (prev < 5 ? prev + 1 : 1))}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 whitespace-nowrap"
                >
                  <Play className="w-3 h-3" />
                  <span>Langkah Berikutnya</span>
                </button>
                <button
                  type="button"
                  aria-label="Maju satu langkah"
                  onClick={() => setActiveProofStep((prev) => (prev < 5 ? prev + 1 : 1))}
                  className="p-1.5 bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Step Selector Dots/Numbers */}
            <div className="grid grid-cols-5 gap-1.5">
              {SQUEEZE_PROOF_STEPS.map((st) => (
                <button
                  key={st.stepNumber}
                  type="button"
                  onClick={() => setActiveProofStep(st.stepNumber)}
                  className={`py-1.5 text-xs font-mono-tabular font-semibold rounded border transition-colors ${
                    st.stepNumber === activeProofStep
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Tahap {st.stepNumber}
                </button>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2.5">
              <h4 className="text-sm font-bold text-slate-900">
                {currentStepObj.stepNumber}. <MathText text={currentStepObj.title} />
              </h4>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono-tabular text-xs text-slate-900">
                <MathText text={currentStepObj.formalStatement} />
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Penjelasan Gaya Bu Dea: </strong>
                <MathText text={currentStepObj.buDeaNarrative} />
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-800">Alasan Matematis (Math.skill): </strong>
                <MathText text={currentStepObj.whyJustification} />
              </p>

              {/* Linked Questions */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500">Menjawab Soal Meeting VIII:</span>
                {currentStepObj.relatedQuestions.map((qNum) => (
                  <button
                    key={qNum}
                    type="button"
                    onClick={() => onSelectQuestionNumber(qNum)}
                    className="px-2 py-0.5 text-xs font-mono-tabular font-medium bg-sky-50 text-sky-800 border border-sky-200 rounded hover:bg-sky-100 transition-colors whitespace-nowrap"
                  >
                    Lihat Soal No. {qNum}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
