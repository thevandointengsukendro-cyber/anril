import React, { useState } from 'react';
import {
  ANRIL_QUESTIONS_DB,
  AnrilQuestionItem,
  MeetingId,
  PolyaStage,
} from '../data/anrilDatabase';
import {
  evaluateStudentAnswer,
  StudentCheckFeedback,
} from '../utils/squeezeLogic';
import { MathText } from './MathText';
import {
  Search,
  CheckCircle2,
  Copy,
  Check,
  HelpCircle,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

interface QuestionDatabasePanelProps {
  masteredIds: string[];
  onToggleMastered: (id: string) => void;
  onMasterAllMeeting8: () => void;
  highlightedQuestionNumber: number | null;
  onClearHighlight: () => void;
}

type DisplayMode = 'full' | 'lisan-quick' | 'socratic-drill';

export const QuestionDatabasePanel: React.FC<QuestionDatabasePanelProps> = ({
  masteredIds,
  onToggleMastered,
  onMasterAllMeeting8,
  highlightedQuestionNumber,
  onClearHighlight,
}) => {
  const [selectedMeeting, setSelectedMeeting] = useState<'all' | MeetingId>('meeting-8');
  const [selectedStage, setSelectedStage] = useState<'all' | PolyaStage>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('full');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Per-question practice inputs and feedbacks
  const [studentInputs, setStudentInputs] = useState<Record<string, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, StudentCheckFeedback>>({});
  const [openPracticeIds, setOpenPracticeIds] = useState<Record<string, boolean>>({});

  const filteredQuestions = ANRIL_QUESTIONS_DB.filter((item) => {
    if (selectedMeeting !== 'all' && item.meetingId !== selectedMeeting) {
      return false;
    }
    if (selectedStage !== 'all' && item.stage !== selectedStage) {
      return false;
    }
    if (highlightedQuestionNumber !== null && item.meetingId === 'meeting-8') {
      if (item.number !== highlightedQuestionNumber) {
        return false;
      }
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchText =
        item.questionText.toLowerCase().includes(q) ||
        item.lisanShort.toLowerCase().includes(q) ||
        item.tertulisFormal.toLowerCase().includes(q) ||
        item.dariManaTahunya.toLowerCase().includes(q) ||
        `soal ${item.number}`.includes(q) ||
        `nomor ${item.number}`.includes(q);
      if (!matchText) return false;
    }
    return true;
  });

  const handleCopyQuestion = (item: AnrilQuestionItem) => {
    const formatted = [
      `[${item.meetingLabel} - ${item.stage}]`,
      `Soal ${item.number}) ${item.questionText}`,
      ``,
      `1. Jawaban Singkat (Lisan Bu Dea):`,
      item.lisanShort,
      ``,
      `2. Jawaban Tertulis Formal (Standar Fiks Bu Dea):`,
      item.tertulisFormal,
      ``,
      `3. Antisipasi "Dari Mana Tahunya?":`,
      item.dariManaTahunya,
      ``,
      `4. Panduan Coretan Layar (Annotate):`,
      item.coretanVisual,
    ].join('\n');

    navigator.clipboard?.writeText(formatted);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCheckStudentAnswer = (item: AnrilQuestionItem) => {
    const input = studentInputs[item.id] || '';
    const result = evaluateStudentAnswer(input, item.expectedKeywords, item.number);
    setFeedbacks((prev) => ({ ...prev, [item.id]: result }));
    if (result.isAccurate && !masteredIds.includes(item.id)) {
      onToggleMastered(item.id);
    }
  };

  const handleResetFilters = () => {
    setSelectedMeeting('meeting-8');
    setSelectedStage('all');
    setSearchQuery('');
    onClearHighlight();
  };

  return (
    <section
      id="database-soal"
      aria-label="Database Soal & Kunci Jawaban Fiks ANRIL"
      className="space-y-6"
    >
      {/* Filter & Search Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Database Terintegrasi</span>
              <span aria-hidden="true">·</span>
              <span>14 Soal Meeting VIII (3.2.7) + 6 Soal Referensi (3.1.5)</span>
              <span aria-hidden="true">·</span>
              <span>Cross-Checked Math.skill</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Lembar Kerja Tugas Kelompok &amp; Kunci Jawaban Standar Ibu Dea
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onMasterAllMeeting8}
              className="px-3.5 py-2 text-xs font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors whitespace-nowrap shrink-0"
            >
              Tandai Semua 14 Soal Meeting VIII Paham (+700 Poin)
            </button>
          </div>
        </div>

        {/* Row 1: Meeting Filter + Display Mode + Search Input */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Meeting Tabs */}
          <div className="lg:col-span-5 flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setSelectedMeeting('meeting-8');
                onClearHighlight();
              }}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedMeeting === 'meeting-8'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Meeting VIII · 3.2.7 (14 Soal)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedMeeting('meeting-7');
                onClearHighlight();
              }}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedMeeting === 'meeting-7'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Referensi 3.1.5 (6 Soal)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedMeeting('all');
                onClearHighlight();
              }}
              className={`py-1.5 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedMeeting === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua (20)
            </button>
          </div>

          {/* Display Mode Selector */}
          <div className="lg:col-span-4 flex items-center gap-2">
            <label htmlFor="display-mode-select" className="text-xs font-medium text-slate-600 shrink-0">
              Tampilan:
            </label>
            <select
              id="display-mode-select"
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
            >
              <option value="full">Mode Lengkap (Lisan + Tertulis + Verifikasi)</option>
              <option value="lisan-quick">Mode Respon Cepat Zoom (Lisan + Tunjuk Simbol)</option>
              <option value="socratic-drill">Mode Latihan Sokratik (Uji Jawaban Mandiri)</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="lg:col-span-3 relative">
            <label htmlFor="search-soal-input" className="sr-only">
              Cari soal atau kata kunci
            </label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-soal-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor soal, kata kunci..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
            />
          </div>
        </div>

        {/* Row 2: Polya Stage Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500 mr-1">Tahap Polya:</span>
            {[
              { id: 'all', label: 'Semua Tahap' },
              { id: 'Understanding Task', label: '1. Understanding Task (No. 1–4)' },
              { id: 'Devising a Plan', label: '2. Devising a Plan (No. 5–7)' },
              { id: 'Carrying Out the Plan', label: '3. Carrying Out the Plan (No. 8–12)' },
              { id: 'Looking Back', label: '4. Looking Back (No. 13–14)' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  setSelectedStage(st.id as 'all' | PolyaStage);
                  onClearHighlight();
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                  selectedStage === st.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 font-mono-tabular">
            {highlightedQuestionNumber !== null && (
              <button
                type="button"
                onClick={onClearHighlight}
                className="inline-flex items-center gap-1 text-sky-700 font-medium hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tampilkan Semua Soal (Reset Filter No. {highlightedQuestionNumber})</span>
              </button>
            )}
            <span>Menampilkan {filteredQuestions.length} soal</span>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredQuestions.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-800">
            Tidak ada soal yang cocok dengan filter atau kata kunci pencarian &quot;{searchQuery}&quot;.
          </p>
          <p className="text-xs text-slate-500">
            Coba reset filter tahap Polya atau kata kunci pencarian untuk menampilkan seluruh 14 soal ANRIL Meeting VIII.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Reset Filter &amp; Tampilkan Semua Soal
          </button>
        </div>
      )}

      {/* Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.map((item) => {
          const isMastered = masteredIds.includes(item.id);
          const isPracticeOpen =
            displayMode === 'socratic-drill' || Boolean(openPracticeIds[item.id]);
          const fb = feedbacks[item.id];

          return (
            <article
              key={item.id}
              id={`question-card-${item.id}`}
              className="bg-white border border-slate-200 rounded-xl p-6 transition-shadow hover:shadow-xs space-y-4"
            >
              {/* Card Top Metadata & Action Row (Strict Zero-Pill Inline Metadata) */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono-tabular">
                    <span className="font-semibold text-slate-800">
                      Soal {String(item.number).padStart(2, '0')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-sky-800 font-medium">{item.stage}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.meetingLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-800 font-medium">
                      {item.mathSkillChecks.length} Metode Verifikasi Math.skill Lulus
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.number}) <MathText text={item.questionText} />
                  </h3>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenPracticeIds((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }))
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{isPracticeOpen ? 'Tutup Uji Mandiri' : 'Uji Jawabanmu'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyQuestion(item)}
                    aria-label={`Salin jawaban soal ${item.number}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleMastered(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                      isMastered
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isMastered ? 'Paham (+50 Poin)' : 'Tandai Paham (+50)'}</span>
                  </button>
                </div>
              </div>

              {/* Interactive Socratic Self-Check Box (When Open or in Socratic Drill Mode) */}
              {isPracticeOpen && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={`practice-input-${item.id}`}
                      className="text-xs font-bold text-slate-900"
                    >
                      Simulasi Ditanya Bu Dea di Zoom — Ketik Jawaban Singkat / Tertulismu untuk Soal {item.number}):
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Otomatis mendeteksi Jebakan Sokratik Bu Dea
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      id={`practice-input-${item.id}`}
                      type="text"
                      value={studentInputs[item.id] || ''}
                      onChange={(e) =>
                        setStudentInputs((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                      placeholder="Contoh: Konvergen, pilih K = max(K1, K2) sehingga |yn - w| < epsilon..."
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleCheckStudentAnswer(item)}
                      className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                    >
                      Periksa Jawaban
                    </button>
                  </div>

                  {fb && (
                    <div
                      className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                        fb.isAccurate
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-amber-50 border-amber-300 text-amber-950'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        {fb.isAccurate ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                        )}
                        <span>{fb.buDeaVerdict}</span>
                      </div>
                      {fb.socraticWarning && (
                        <p className="text-rose-800 font-medium">
                          <MathText text={fb.socraticWarning} />
                        </p>
                      )}
                      <p className="text-slate-700 font-mono-tabular">
                        Kata kunci terdeteksi:{' '}
                        {fb.matchedKeywords.length > 0 ? fb.matchedKeywords.join(', ') : 'Belum ada'}{' '}
                        {fb.missingKeywords.length > 0 &&
                          `| Perlu ditambahkan: ${fb.missingKeywords.join(', ')}`}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Main Answer Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* 1. Jawaban Singkat Lisan & Tunjuk Simbol (Always Visible) */}
                <div
                  className={
                    displayMode === 'lisan-quick'
                      ? 'lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4'
                      : 'lg:col-span-5 space-y-3'
                  }
                >
                  <div className="bg-sky-50/70 border border-sky-200 rounded-lg p-3.5 space-y-1.5">
                    <div className="text-xs font-bold text-sky-950">
                      Jawaban Singkat (Lisan Zoom Bu Dea — Aturan 1):
                    </div>
                    <p className="text-xs text-slate-900 font-medium leading-relaxed">
                      &ldquo;<MathText text={item.lisanShort} />&rdquo;
                    </p>
                    <div className="pt-1.5 border-t border-sky-200/70 text-[11px] text-sky-900">
                      <strong>Tunjuk / Lingkari di Layar: </strong>
                      <MathText text={item.tunjukSimbol} />
                    </div>
                  </div>

                  <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-3.5 space-y-1.5">
                    <div className="text-xs font-bold text-amber-950">
                      Siap Ditanya Susulan: &ldquo;Dari Mana Kamu Tahu?&rdquo; (Aturan 2 &amp; 4):
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      <MathText text={item.dariManaTahunya} />
                    </p>
                    <p className="text-[11px] text-amber-900 pt-1 border-t border-amber-200/70">
                      <strong>Waspada Jebakan Sokratik: </strong>
                      <MathText text={item.socraticTrapNote} />
                    </p>
                  </div>
                </div>

                {/* 2. Jawaban Tertulis Formal & Coretan Visual + Math.skill Verification */}
                {displayMode !== 'lisan-quick' && (
                  <div className="lg:col-span-7 space-y-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                      <div className="text-xs font-bold text-slate-900">
                        Jawaban Tertulis Formal (Standar Fiks Buku Catatan &amp; Lembar Kerja Bu Dea):
                      </div>
                      <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                        <MathText text={item.tertulisFormal} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Panduan Coretan Layar */}
                      <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                        <div className="text-xs font-bold text-slate-900">
                          Panduan Coretan Layar (Annotate):
                        </div>
                        <div className="text-[11px] text-slate-700 font-mono-tabular whitespace-pre-wrap leading-relaxed">
                          <MathText text={item.coretanVisual} />
                        </div>
                      </div>

                      {/* Cross-Check Verifikasi Math.skill */}
                      <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5">
                        <div className="text-xs font-bold text-emerald-900">
                          Cross-Check Verifikasi Math.skill:
                        </div>
                        <div className="space-y-1.5">
                          {item.mathSkillChecks.map((chk, idx) => (
                            <div key={idx} className="text-[11px] text-slate-700 leading-snug">
                              <span className="font-mono-tabular font-semibold text-emerald-800">
                                [Lulus] {chk.methodCode} (<MathText text={chk.methodName} />):{' '}
                              </span>
                              <MathText text={chk.explanation} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
