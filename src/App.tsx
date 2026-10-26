import React, { useState, useEffect } from 'react';
import { SqueezeVisualizer } from './components/SqueezeVisualizer';
import { AnnotatedTheoremSheet } from './components/AnnotatedTheoremSheet';
import { QuestionDatabasePanel } from './components/QuestionDatabasePanel';
import { ANRIL_QUESTIONS_DB } from './data/anrilDatabase';
import { calculateActivityZone } from './utils/squeezeLogic';
import { Printer, CheckCircle2, BookOpen, Compass, Layers, Award } from 'lucide-react';

const STORAGE_KEY = 'anrillab_mastered_questions_v1';

export default function App() {
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    // Default seed: first 4 Understanding Task questions marked mastered (200 poin)
    return ['m8-q1', 'm8-q2', 'm8-q3', 'm8-q4'];
  });

  const [highlightedQuestionNumber, setHighlightedQuestionNumber] = useState<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(masteredIds));
    } catch {
      // ignore storage errors
    }
  }, [masteredIds]);

  const handleToggleMastered = (id: string) => {
    setMasteredIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleMasterAllMeeting8 = () => {
    const m8Ids = ANRIL_QUESTIONS_DB.filter((q) => q.meetingId === 'meeting-8').map((q) => q.id);
    setMasteredIds((prev) => Array.from(new Set([...prev, ...m8Ids])));
  };

  const handleJumpToQuestion = (questionNum: number) => {
    setHighlightedQuestionNumber(questionNum);
    const el = document.getElementById('database-soal');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activityStatus = calculateActivityZone(masteredIds, ANRIL_QUESTIONS_DB.length);
  const m8MasteredCount = masteredIds.filter((id) => id.startsWith('m8-')).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-3.5 no-print">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            AnrilLab · Standar Bu Dea
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#ringkasan-kelas"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Tabungan Poin
            </a>
            <a
              href="#visualisasi-koridor"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Visualisasi Koridor
            </a>
            <a
              href="#bukti-dan-coretan"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Bukti &amp; Coretan
            </a>
            <a
              href="#database-soal"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              14 Soal Meeting VIII
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Lembar Jawaban</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main id="top" className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero & Activity Score Bank Section */}
        <section
          id="ringkasan-kelas"
          aria-label="Konteks Kelas Analisis Real & Tabungan Skor Keaktifan"
          className="bg-white border border-slate-200 rounded-xl p-6 space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: Course Context & Method Overview (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>Analisis Real (Anril) · Dosen Pengampu: Ibu Dea</span>
                  <span aria-hidden="true">·</span>
                  <span>Meeting VIII: Menentukan Strategi &amp; Menuliskan Pembuktian</span>
                  <span aria-hidden="true">·</span>
                  <span>Verifikasi Berlapis Math.skill</span>
                </div>
                <h1
                  className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Penyelesaian 14 Soal Teorema Apit (3.2.7 Squeeze Theorem) Standar Fiks Ibu Dea
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                  Disusun mengikuti empat tahap Polya (<em>Understanding Task</em>,{' '}
                  <em>Devising a Plan</em>, <em>Carrying Out the Plan</em>, dan{' '}
                  <em>Looking Back</em>), dilengkapi panduan jawab lisan singkat (1 kata / tunjuk
                  simbol), antisipasi pertanyaan susulan <em>&ldquo;Dari mana kamu tahu?&rdquo;</em>,
                  bukti bercerita tinta biru, serta verifikasi formal <strong>Math.skill</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#database-soal"
                  className="px-4 py-2.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                >
                  Buka Kunci Jawaban 14 Soal Meeting VIII
                </a>
                <a
                  href="#visualisasi-koridor"
                  className="px-4 py-2.5 text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
                >
                  Eksplorasi Grafik Koridor V_ε(w) &amp; Garis Bilangan
                </a>
              </div>
            </div>

            {/* Right Column: Tabungan Skor Keaktifan Card (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">
                    Simulasi Tabungan Skor Keaktifan (Tanpa UTS &amp; UAS)
                  </span>
                  <span className="text-xs font-mono-tabular font-bold text-emerald-800">
                    Status: {activityStatus.zoneName}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold font-mono-tabular text-slate-900">
                    {activityStatus.totalPoints}{' '}
                    <span className="text-xs font-normal text-slate-500">
                      / {activityStatus.zoneTarget} Poin Target Zona Hijau
                    </span>
                  </div>
                  <span className="text-xs font-mono-tabular text-slate-600">
                    {m8MasteredCount}/14 Soal Meeting VIII
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-200"
                    style={{ width: `${activityStatus.progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activityStatus.statusDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span>Target per pertemuan: 50 poin × 4 = 200 poin</span>
                <button
                  type="button"
                  onClick={handleMasterAllMeeting8}
                  className="font-semibold text-sky-700 hover:underline whitespace-nowrap"
                >
                  Klaim Semua 14 Soal →
                </button>
              </div>
            </div>
          </div>

          {/* Full-Width 4-Column Polya Stage Quick Navigation Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => handleJumpToQuestion(1)}
              className="text-left p-3.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-800">1. Understanding Task</span>
                <BookOpen className="w-4 h-4 text-sky-700" />
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono-tabular">
                Soal No. 1 – 4
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Kalimat implikasi, Premis P, Konklusi Q, sifat &amp; target |y<sub>n</sub> - w| &lt; ε
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleJumpToQuestion(5)}
              className="text-left p-3.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-800">2. Devising a Plan</span>
                <Compass className="w-4 h-4 text-amber-700" />
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono-tabular">
                Soal No. 5 – 7
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Bukti langsung (Direct Proof), pencarian K = max(K<sub>1</sub>, K<sub>2</sub>) ∈ <strong>N</strong> &amp; sifatnya
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleJumpToQuestion(8)}
              className="text-left p-3.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-800">3. Carrying Out Plan</span>
                <Layers className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono-tabular">
                Soal No. 8 – 12
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Alasan ε &gt; 0, pengurangan w, jawaban (why?) -ε &lt; y<sub>n</sub> - w &lt; ε &amp; Q.E.D.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleJumpToQuestion(13)}
              className="text-left p-3.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-800">4. Looking Back</span>
                <Award className="w-4 h-4 text-slate-800" />
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono-tabular">
                Soal No. 13 – 14
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Kesesuaian target No. 4 dengan rencana No. 6 dan eksekusi No. 8–12
              </p>
            </button>
          </div>
        </section>

        {/* Interactive Visual Sandbox Section */}
        <SqueezeVisualizer onSelectQuestionNumber={handleJumpToQuestion} />

        {/* Annotated Theorem & Bukti Bercerita Section */}
        <AnnotatedTheoremSheet onJumpToQuestion={handleJumpToQuestion} />

        {/* Complete 14+6 Question Database & Interactive Socratic Practice Section */}
        <QuestionDatabasePanel
          masteredIds={masteredIds}
          onToggleMastered={handleToggleMastered}
          onMasterAllMeeting8={handleMasterAllMeeting8}
          highlightedQuestionNumber={highlightedQuestionNumber}
          onClearHighlight={() => setHighlightedQuestionNumber(null)}
        />
      </main>

      {/* Clean Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-5 mt-12 no-print">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>
              AnrilLab · Kunci Jawaban &amp; Visualisasi Interaktif ANRIL Meeting VIII (Teorema 3.2.7 Squeeze Theorem)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#top" className="hover:text-slate-900">
              Kembali ke Atas ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
