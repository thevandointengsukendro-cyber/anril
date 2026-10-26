export interface SequencePreset {
  id: string;
  name: string;
  formulaLabel: string;
  xnFormula: string;
  ynFormula: string;
  znFormula: string;
  limitW: number;
  isConvergentSample: boolean;
  description: string;
  computeXn: (n: number) => number;
  computeYn: (n: number) => number;
  computeZn: (n: number) => number;
  computeK1: (epsilon: number) => number;
  computeK2: (epsilon: number) => number;
}

export interface TermEvaluation {
  n: number;
  xn: number;
  yn: number;
  zn: number;
  w: number;
  xnMinusW: number;
  ynMinusW: number;
  znMinusW: number;
  absXnMinusW: number;
  absYnMinusW: number;
  absZnMinusW: number;
  orderHolds: boolean; // xn <= yn <= zn
  xnInCorridor: boolean; // |xn - w| < epsilon
  ynInCorridor: boolean; // |yn - w| < epsilon
  znInCorridor: boolean; // |zn - w| < epsilon
  isTailAfterK: boolean; // n >= K
}

export interface SqueezeSimulationSummary {
  epsilon: number;
  limitW: number;
  K1: number;
  K2: number;
  K: number;
  isConvergentSample: boolean;
  allTailYnInCorridor: boolean;
  allOrderHolds: boolean;
  terms: TermEvaluation[];
}

export const SEQUENCE_PRESETS: SequencePreset[] = [
  {
    id: 'classic-sin',
    name: 'Klasik Apit: (-1/n) ≤ sin(n)/n ≤ (1/n)',
    formulaLabel: 'xₙ = -1/n,  yₙ = sin(n)/n,  zₙ = 1/n  →  w = 0',
    xnFormula: '-1/n',
    ynFormula: 'sin(n)/n',
    znFormula: '1/n',
    limitW: 0,
    isConvergentSample: true,
    description:
      'Contoh kanonik Teorema Apit: yₙ = sin(n)/n berosilasi namun terjepit di antara xₙ = -1/n dan zₙ = 1/n yang keduanya konvergen ke w = 0.',
    computeXn: (n: number) => -1 / n,
    computeYn: (n: number) => Math.sin(n) / n,
    computeZn: (n: number) => 1 / n,
    computeK1: (eps: number) => Math.max(1, Math.floor(1 / eps) + 1),
    computeK2: (eps: number) => Math.max(1, Math.floor(1 / eps) + 1),
  },
  {
    id: 'asymmetric-k',
    name: 'Asimetris K₁ ≠ K₂: (2 - 2/n) ≤ yₙ ≤ (2 + 5/n)',
    formulaLabel: 'xₙ = 2 - 2/n,  yₙ = 2 + (-1)ⁿ/n,  zₙ = 2 + 5/n  →  w = 2',
    xnFormula: '2 - 2/n',
    ynFormula: '2 + (-1)^n / n',
    znFormula: '2 + 5/n',
    limitW: 2,
    isConvergentSample: true,
    description:
      'Menunjukkan mengapa kita wajib memilih K = max(K₁, K₂): zₙ = 2 + 5/n membutuhkan indeks K₂ yang lebih besar daripada K₁ milik xₙ = 2 - 2/n agar keduanya masuk ke koridor V_ε(2).',
    computeXn: (n: number) => 2 - 2 / n,
    computeYn: (n: number) => 2 + (n % 2 === 0 ? 1 : -1) / n,
    computeZn: (n: number) => 2 + 5 / n,
    computeK1: (eps: number) => Math.max(1, Math.floor(2 / eps) + 1),
    computeK2: (eps: number) => Math.max(1, Math.floor(5 / eps) + 1),
  },
  {
    id: 'quadratic-squeeze',
    name: 'Konvergensi Cepat: (1 - 4/n²) ≤ yₙ ≤ (1 + 6/n²)',
    formulaLabel: 'xₙ = 1 - 4/n²,  yₙ = 1 + cos(n)/n²,  zₙ = 1 + 6/n²  →  w = 1',
    xnFormula: '1 - 4/n²',
    ynFormula: '1 + cos(n)/n²',
    znFormula: '1 + 6/n²',
    limitW: 1,
    isConvergentSample: true,
    description:
      'Kecepatan konvergensi kuadratik: K₁(ε) = ⌊√(4/ε)⌋ + 1 dan K₂(ε) = ⌊√(6/ε)⌋ + 1. Untuk semua n ≥ K = max(K₁, K₂), berlaku -ε < xₙ - 1 ≤ yₙ - 1 ≤ zₙ - 1 < ε.',
    computeXn: (n: number) => 1 - 4 / (n * n),
    computeYn: (n: number) => 1 + Math.cos(n) / (n * n),
    computeZn: (n: number) => 1 + 6 / (n * n),
    computeK1: (eps: number) => Math.max(1, Math.floor(Math.sqrt(4 / eps)) + 1),
    computeK2: (eps: number) => Math.max(1, Math.floor(Math.sqrt(6 / eps)) + 1),
  },
  {
    id: 'counterexample-divergent',
    name: 'Kasus Gagal (Counterexample): lim(xₙ) ≠ lim(zₙ)',
    formulaLabel: 'xₙ = -1 - 1/n → -1,  yₙ = (-1)ⁿ (Divergen),  zₙ = 1 + 1/n → 1',
    xnFormula: '-1 - 1/n',
    ynFormula: '(-1)^n',
    znFormula: '1 + 1/n',
    limitW: 0,
    isConvergentSample: false,
    description:
      'Ilustrasi Catatan Kritis Bu Dea & Math.skill Method I (Counterexample): Meskipun xₙ ≤ yₙ ≤ zₙ berlaku untuk semua n ∈ ℕ, karena lim(xₙ) = -1 ≠ 1 = lim(zₙ), kita TIDAK BISA menemukan K(ε) untuk ε = 0.5 sehingga ekor barisan yₙ masuk ke koridor V_ε(0).',
    computeXn: (n: number) => -1 - 1 / n,
    computeYn: (n: number) => (n % 2 === 0 ? 1 : -1),
    computeZn: (n: number) => 1 + 1 / n,
    computeK1: () => 999,
    computeK2: () => 999,
  },
];

export function simulateSqueezeTheorem(
  preset: SequencePreset,
  epsilon: number,
  maxN: number = 30
): SqueezeSimulationSummary {
  const safeEps = Math.max(0.02, Math.min(2.0, epsilon));
  const K1 = preset.computeK1(safeEps);
  const K2 = preset.computeK2(safeEps);
  const K = Math.max(K1, K2);
  const w = preset.limitW;

  const terms: TermEvaluation[] = [];
  for (let n = 1; n <= maxN; n++) {
    const xn = preset.computeXn(n);
    const yn = preset.computeYn(n);
    const zn = preset.computeZn(n);
    const xnMinusW = xn - w;
    const ynMinusW = yn - w;
    const znMinusW = zn - w;
    const absXnMinusW = Math.abs(xnMinusW);
    const absYnMinusW = Math.abs(ynMinusW);
    const absZnMinusW = Math.abs(znMinusW);

    const orderHolds = xn <= yn + 1e-12 && yn <= zn + 1e-12;
    const xnInCorridor = absXnMinusW < safeEps;
    const ynInCorridor = absYnMinusW < safeEps;
    const znInCorridor = absZnMinusW < safeEps;
    const isTailAfterK = preset.isConvergentSample && n >= K;

    terms.push({
      n,
      xn,
      yn,
      zn,
      w,
      xnMinusW,
      ynMinusW,
      znMinusW,
      absXnMinusW,
      absYnMinusW,
      absZnMinusW,
      orderHolds,
      xnInCorridor,
      ynInCorridor,
      znInCorridor,
      isTailAfterK,
    });
  }

  const tailTerms = terms.filter((t) => t.n >= K);
  const allTailYnInCorridor =
    preset.isConvergentSample &&
    tailTerms.length > 0 &&
    tailTerms.every((t) => t.ynInCorridor);
  const allOrderHolds = terms.every((t) => t.orderHolds);

  return {
    epsilon: safeEps,
    limitW: w,
    K1,
    K2,
    K,
    isConvergentSample: preset.isConvergentSample,
    allTailYnInCorridor,
    allOrderHolds,
    terms,
  };
}

export interface ActivityZoneStatus {
  totalPoints: number;
  masteredCount: number;
  totalQuestions: number;
  zoneName: 'Zona Merah' | 'Zona Oranye' | 'Zona Kuning' | 'Zona Hijau';
  zoneTarget: number;
  progressPercent: number;
  statusDescription: string;
}

export function calculateActivityZone(masteredIds: string[], totalQuestions: number = 20): ActivityZoneStatus {
  const masteredCount = masteredIds.length;
  const totalPoints = masteredCount * 50; // 50 poin per soal sesuai sistem tabungan Bu Dea
  let zoneName: ActivityZoneStatus['zoneName'] = 'Zona Merah';
  let statusDescription = 'Awal tabungan poin (< 300 poin). Tandai soal yang telah dipahami untuk naik zona.';

  if (totalPoints >= 700) {
    zoneName = 'Zona Hijau';
    statusDescription = 'Target Tercapai! Tabungan poin keaktifan aman (Standar >700–1000 poin Tanpa UTS/UAS).';
  } else if (totalPoints >= 450) {
    zoneName = 'Zona Kuning';
    statusDescription = 'Hampir masuk Zona Hijau! Selesaikan beberapa soal lagi untuk mengamankan nilai A.';
  } else if (totalPoints >= 200) {
    zoneName = 'Zona Oranye';
    statusDescription = 'Target minimal 1 pertemuan (200 poin) terlampaui. Lanjutkan ke tahap Carrying Out & Looking Back.';
  }

  const progressPercent = Math.min(100, Math.round((totalPoints / 1000) * 100));

  return {
    totalPoints,
    masteredCount,
    totalQuestions,
    zoneName,
    zoneTarget: 1000,
    progressPercent,
    statusDescription,
  };
}

export interface StudentCheckFeedback {
  isAccurate: boolean;
  matchedKeywords: string[];
  missingKeywords: string[];
  socraticWarning: string | null;
  buDeaVerdict: string;
}

export function evaluateStudentAnswer(
  studentInput: string,
  expectedKeywords: string[],
  questionNumber: number
): StudentCheckFeedback {
  const normalized = studentInput.trim().toLowerCase();
  if (!normalized) {
    return {
      isAccurate: false,
      matchedKeywords: [],
      missingKeywords: expectedKeywords,
      socraticWarning: 'Jawaban masih kosong. Tuliskan kata kunci singkat atau simbol matematikanya.',
      buDeaVerdict: 'Belum dijawab.',
    };
  }

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of expectedKeywords) {
    if (normalized.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  // Detect Socratic Traps specific to Bu Dea's class
  let socraticWarning: string | null = null;
  if (
    questionNumber === 3 &&
    normalized.includes('untuk setiap epsilon') &&
    !normalized.includes('konvergen')
  ) {
    socraticWarning =
      'Jebakan Sokratik Bu Dea (Aturan 1): Jangan membaca ulang isi definisi "Untuk setiap epsilon..." saat ditanya SIFAT! Jawab singkat kata kuncinya: ketaksamaan suku (xₙ ≤ yₙ ≤ zₙ) dan sifat KONVERGEN ke batas yang sama.';
  } else if (questionNumber === 6 && !normalized.includes('k')) {
    socraticWarning =
      'Jebakan Sokratik Bu Dea: Jika diberikan ε > 0, objek yang wajib dicari adalah bilangan asli K (atau K(ε) ∈ ℕ), bukan mencari ε lagi!';
  } else if (
    questionNumber === 11 &&
    normalized.includes('<=') &&
    !normalized.includes('<')
  ) {
    socraticWarning =
      'Perhatikan tanda ketaksamaan ketat (<) di ujung kiri -ε dan ujung kanan +ε karena berasal dari definisi nilai mutlak |xₙ - w| < ε dan |zₙ - w| < ε!';
  }

  const ratio = expectedKeywords.length > 0 ? matchedKeywords.length / expectedKeywords.length : 1;
  const isAccurate = ratio >= 0.5 && !socraticWarning;

  const buDeaVerdict = isAccurate
    ? 'Fiks Benar (+50 Poin)! Jawabanmu singkat, tepat sasaran, dan siap menghadapi pertanyaan susulan "Dari mana tahunya?".'
    : 'Masih perlu dipertajam sesuai standar Fiks Bu Dea. Cek kata kunci dan hindari bertele-tele.';

  return {
    isAccurate,
    matchedKeywords,
    missingKeywords,
    socraticWarning,
    buDeaVerdict,
  };
}
