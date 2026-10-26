import React, { useState } from 'react';
import { BUKTI_BERCERITA_BU_DEA } from '../data/anrilDatabase';
import { MathText } from './MathText';
import { Copy, Check, FileText, Eye } from 'lucide-react';

type HighlightLayer = 'all' | 'premis-konklusi' | 'objek-k' | 'jembatan-why';

interface AnnotatedTheoremSheetProps {
  onJumpToQuestion: (qNum: number) => void;
}

export const AnnotatedTheoremSheet: React.FC<AnnotatedTheoremSheetProps> = ({
  onJumpToQuestion,
}) => {
  const [highlightLayer, setHighlightLayer] = useState<HighlightLayer>('all');
  const [copiedProof, setCopiedProof] = useState<boolean>(false);
  const [showPdfPreview, setShowPdfPreview] = useState<boolean>(false);

  const handleCopyProof = () => {
    const text = BUKTI_BERCERITA_BU_DEA.lines.join('\n');
    navigator.clipboard?.writeText(text);
    setCopiedProof(true);
    setTimeout(() => setCopiedProof(false), 2000);
  };

  const isHighlighted = (layer: HighlightLayer) =>
    highlightLayer === 'all' || highlightLayer === layer;

  return (
    <section
      id="bukti-dan-coretan"
      aria-label="Bedah Teks Bukti & Coretan Layar Standar Bu Dea"
      className="bg-white border border-slate-200 rounded-xl p-6 space-y-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Bedah Modul ANRIL Meeting VIII</span>
            <span aria-hidden="true">·</span>
            <span>Mode Annotate / Coretan Layar Zoom</span>
            <span aria-hidden="true">·</span>
            <span>Standar Tinta Biru Bu Dea</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Anatomi Teorema 3.2.7 (Squeeze Theorem) &amp; Bukti Formal &quot;Bercerita&quot;
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPdfPreview((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-100 text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showPdfPreview ? 'Tutup Dokumen PDF Asli' : 'Lihat Dokumen PDF Asli'}</span>
          </button>
          <a
            href="/assets/aistudio/ANRIL_MEETING-VIII_7cad9b6b.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Buka PDF di Tab Baru</span>
          </a>
        </div>
      </div>

      {/* Optional Embedded PDF Viewer */}
      {showPdfPreview && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">
              Pratinjau Dokumen Asli: ANRIL_MEETING-VIII.pdf (Halaman 1 &amp; 2)
            </span>
            <button
              type="button"
              onClick={() => setShowPdfPreview(false)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Sembunyikan
            </button>
          </div>
          <iframe
            src="/assets/aistudio/ANRIL_MEETING-VIII_7cad9b6b.pdf"
            title="Dokumen PDF ANRIL Meeting VIII"
            className="w-full h-96 border border-slate-300 rounded bg-white"
          />
        </div>
      )}

      {/* Filter Layer Controls for Screen Annotation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
        <span className="text-xs font-semibold text-slate-700">
          Pilih Lapisan Coretan Layar (Annotate Saat Ditanya Bu Dea):
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Tampilkan Semua Coretan' },
            { id: 'premis-konklusi', label: 'Premis P & Konklusi Q (Soal 1–4)' },
            { id: 'objek-k', label: 'Eksistensi & Sifat K(ε) (Soal 6–9)' },
            { id: 'jembatan-why', label: 'Jembatan (why?) & Transitif (Soal 10–12)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setHighlightLayer(tab.id as HighlightLayer)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                highlightLayer === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Column Annotated Document + Bukti Bercerita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Column 1: Annotated Theorem & Proof from PDF (6 cols) */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <div className="text-xs font-bold text-sky-800">
                DEFINISI 3.1.3: Convergent of a sequence of real number
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                A sequence{' '}
                <span className="font-mono-tabular">
                  X = (x<sub>n</sub>)
                </span>{' '}
                in <strong>R</strong> is said to{' '}
                <strong className="underline decoration-sky-600">
                  converge to x ∈ <strong>R</strong>
                </strong>
                , if{' '}
                <span
                  className={
                    isHighlighted('objek-k')
                      ? 'bg-amber-100 text-amber-950 px-1 py-0.5 rounded font-medium'
                      : ''
                  }
                >
                  for every ε &gt; 0 there exists a natural number K(ε)
                </span>{' '}
                such that for all <span className="font-mono-tabular">n ≥ K(ε)</span> the terms{' '}
                <span className="font-mono-tabular">
                  x<sub>n</sub>
                </span>{' '}
                satisfy{' '}
                <span className="inline-block border-2 border-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-mono-tabular font-bold text-sky-900">
                  |x<sub>n</sub> - x| &lt; ε
                </span>
                .
              </p>
              <p className="text-[11px] text-slate-500 italic mt-1">
                Catatan Modul: &quot;Kata konvergen sering disebut limit.&quot; (Kunci menjawab Soal No. 3 &amp; 9)
              </p>
            </div>

            {/* 3.2.7 Squeeze Theorem Statement with Interactive Highlights */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  3.2.7 Squeeze Theorem (Teorema Apit)
                </span>
                <button
                  type="button"
                  onClick={() => onJumpToQuestion(1)}
                  className="text-[11px] font-medium text-sky-700 hover:underline"
                >
                  Soal 1, 2, 3, 4 →
                </button>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed">
                <span
                  className={
                    isHighlighted('premis-konklusi')
                      ? 'bg-sky-100 text-sky-950 px-1.5 py-0.5 rounded font-semibold'
                      : ''
                  }
                >
                  <MathText text="[JIKA / PREMIS P]: Suppose that X = (xₙ), Y = (yₙ), and Z = (zₙ) are sequences of real numbers such that xₙ ≤ yₙ ≤ zₙ for all n ∈ ℕ, and that lim(xₙ) = lim(zₙ)." />
                </span>{' '}
                <span
                  className={
                    isHighlighted('premis-konklusi')
                      ? 'bg-emerald-100 text-emerald-950 px-1.5 py-0.5 rounded font-semibold'
                      : ''
                  }
                >
                  <MathText text="[MAKA / KONKLUSI Q]: Then Y = (yₙ) is convergent and lim(xₙ) = lim(yₙ) = lim(zₙ)." />
                </span>
              </p>
            </div>

            {/* Proof Paragraph with Interactive Callout Tags */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Proof (Bukti Langsung / Direct Proof — Soal 5 s/d 12)
                </span>
                <button
                  type="button"
                  onClick={() => onJumpToQuestion(11)}
                  className="text-[11px] font-medium text-emerald-700 hover:underline"
                >
                  Bedah (why?) Soal 11 →
                </button>
              </div>

              <div className="text-xs text-slate-800 leading-relaxed space-y-2">
                <p>
                  Let{' '}
                  <span className="font-mono-tabular font-semibold">
                    w := lim(x<sub>n</sub>) = lim(z<sub>n</sub>)
                  </span>
                  .{' '}
                  <span
                    className={
                      isHighlighted('objek-k')
                        ? 'bg-amber-100 text-amber-950 px-1 py-0.5 rounded'
                        : ''
                    }
                  >
                    <MathText text="If ε > 0 is given (Soal 8), then it follows from the convergence of X and Z to w that there exists a natural number K (Soal 6: K = max{K₁,K₂}) such that if n ≥ K then" />
                  </span>
                </p>

                <div className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded text-center font-mono-tabular font-semibold text-slate-900">
                  |x<sub>n</sub> - w| &lt; ε &nbsp;&nbsp;and&nbsp;&nbsp; |z<sub>n</sub> - w| &lt; ε &nbsp;&nbsp;
                  <span className="text-[11px] text-sky-700 font-normal">(Soal 7 &amp; 9)</span>
                </div>

                <p>Since the hypothesis implies that</p>

                <div className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded text-center font-mono-tabular font-semibold text-slate-900">
                  x<sub>n</sub> - w ≤ y<sub>n</sub> - w ≤ z<sub>n</sub> - w &nbsp;for all n ∈ <strong>N</strong> &nbsp;&nbsp;
                  <span className="text-[11px] text-amber-700 font-normal">
                    (Soal 10: ketiga ruas dikurangi w)
                  </span>
                </div>

                <p>
                  it follows{' '}
                  <strong className="text-rose-700 underline">(why? — Soal 11)</strong> that
                </p>

                <div
                  className={`py-2 px-3 rounded text-center font-mono-tabular font-bold border-2 ${
                    isHighlighted('jembatan-why')
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  -ε &lt; x<sub>n</sub> - w ≤ y<sub>n</sub> - w ≤ z<sub>n</sub> - w &lt; ε &nbsp;=&gt;&nbsp; [ -ε &lt; y<sub>n</sub> - w &lt; ε ]
                </div>

                <p>
                  for all <span className="font-mono-tabular">n ≥ K</span>. Since{' '}
                  <span className="font-mono-tabular">ε &gt; 0</span> is arbitrary, this implies that{' '}
                  <span className="inline-block border-2 border-slate-900 px-1.5 py-0.5 rounded font-mono-tabular font-bold">
                    lim(y<sub>n</sub>) = w
                  </span>{' '}
                  <span className="text-slate-500">(Soal 12). Q.E.D.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Klik tombol soal di setiap bagian untuk melompat ke kartu jawaban detail.</span>
            <span className="font-mono-tabular font-semibold text-slate-800">14 Soal Terpetakan</span>
          </div>
        </div>

        {/* Column 2: Bukti Bercerita Tinta Biru Bu Dea (6 cols) */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {BUKTI_BERCERITA_BU_DEA.title}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {BUKTI_BERCERITA_BU_DEA.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyProof}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              >
                {copiedProof ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Bukti Bercerita</span>
                  </>
                )}
              </button>
            </div>

            {/* Handwritten Blue-Ink Style Container */}
            <div className="bg-white border border-sky-200 rounded-lg p-4 space-y-2 text-xs text-sky-950 leading-relaxed">
              {BUKTI_BERCERITA_BU_DEA.lines.map((line, idx) => {
                const isBoxedLine = line.includes('[ -ε < yₙ - w < ε ]');
                return (
                  <p
                    key={idx}
                    className={
                      idx === 0
                        ? 'font-bold text-sky-900 underline'
                        : isBoxedLine
                        ? 'p-2 bg-sky-50 border-2 border-sky-700 rounded font-bold text-sky-950'
                        : ''
                    }
                  >
                    <MathText text={line} />
                  </p>
                );
              })}
            </div>
          </div>

          {/* Micro-Rules Reminder Box */}
          <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-1.5">
            <div className="text-xs font-bold text-slate-900">
              Checklist Standar Coretan &amp; Lisan Ibu Dea:
            </div>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>
                <strong>Kotaki Jembatan Bukti:</strong> Selalu beri kotak pada{' '}
                <span className="font-mono-tabular text-slate-900">
                  |x<sub>n</sub> - w| &lt; ε
                </span>
                ,{' '}
                <span className="font-mono-tabular text-slate-900">
                  -ε &lt; y<sub>n</sub> - w &lt; ε
                </span>
                , dan{' '}
                <span className="font-mono-tabular text-slate-900">
                  |y<sub>n</sub> - w| &lt; ε
                </span>
                .
              </li>
              <li>
                <strong>Analogi Dunia Nyata:</strong> Koridor{' '}
                <span className="font-mono-tabular text-slate-900">
                  V<sub>ε</sub>(w)
                </span>{' '}
                adalah radius gempa bumi dengan pusat episentrum{' '}
                <span className="font-mono-tabular">w</span> dan radius{' '}
                <span className="font-mono-tabular">ε</span>; mulai indeks{' '}
                <span className="font-mono-tabular">n ≥ K</span>, barisan atas{' '}
                <span className="font-mono-tabular">
                  z<sub>n</sub>
                </span>{' '}
                dan bawah{' '}
                <span className="font-mono-tabular">
                  x<sub>n</sub>
                </span>{' '}
                masuk radius gempa sehingga{' '}
                <span className="font-mono-tabular">
                  y<sub>n</sub>
                </span>{' '}
                di tengahnya ikut masuk!
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
