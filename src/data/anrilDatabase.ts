export type PolyaStage =
  | 'Understanding Task'
  | 'Devising a Plan'
  | 'Carrying Out the Plan'
  | 'Looking Back';

export type MeetingId = 'meeting-8' | 'meeting-7';

export interface VerificationCheckItem {
  methodCode: string;
  methodName: string;
  explanation: string;
  passed: boolean;
}

export interface AnrilQuestionItem {
  id: string;
  meetingId: MeetingId;
  meetingLabel: string;
  theoremCode: string;
  number: number;
  stage: PolyaStage;
  questionText: string;
  lisanShort: string;
  tunjukSimbol: string;
  tertulisFormal: string;
  dariManaTahunya: string;
  socraticTrapNote: string;
  coretanVisual: string;
  mathSkillChecks: VerificationCheckItem[];
  expectedKeywords: string[];
}

export interface DynamicProofStep {
  stepNumber: number;
  title: string;
  relatedQuestions: number[];
  formalStatement: string;
  buDeaNarrative: string;
  whyJustification: string;
  visualFocus: 'corridor-setup' | 'k1-k2-bound' | 'shift-w' | 'squeeze-inequality' | 'conclusion-qed';
}

export const SQUEEZE_PROOF_STEPS: DynamicProofStep[] = [
  {
    stepNumber: 1,
    title: 'Ambil Sembarang ε > 0 & Tetapkan Limit Bersama w',
    relatedQuestions: [1, 2, 4, 5, 8],
    formalStatement: 'Misalkan w := lim(xₙ) = lim(zₙ). Diberikan sembarang ε > 0.',
    buDeaNarrative:
      'Karena kita ingin membuktikan Y = (yₙ) konvergen ke w menggunakan Definisi 3.1.3 yang berbunyi "Untuk setiap ε > 0...", maka langkah pertama wajib dimulai dengan: Ambil sembarang ε > 0 ( membentuk radius koridor/persekitaran V_ε(w) ).',
    whyJustification:
      'Kuantor universal (∀ε > 0) pada Definisi 3.1.3 hanya sah dibuktikan jika ε diambil sembarang (arbitrary), bukan memilih satu angka ε tertentu.',
    visualFocus: 'corridor-setup',
  },
  {
    stepNumber: 2,
    title: 'Konstruksi Indeks Bersama K = max(K₁, K₂) ∈ ℕ',
    relatedQuestions: [3, 6, 7, 9],
    formalStatement:
      'Karena lim(xₙ) = w dan lim(zₙ) = w, ∃K₁, K₂ ∈ ℕ. Pilih K := max{K₁, K₂} ∈ ℕ sehingga ∀n ≥ K berlaku |xₙ - w| < ε dan |zₙ - w| < ε.',
    buDeaNarrative:
      'Dari premis P, barisan X dan Z keduanya konvergen ke w. Artinya X punya batas ekor K₁ dan Z punya batas ekor K₂. Supaya kedua ekor barisan masuk ke dalam koridor V_ε(w) secara serentak, kita ambil K = max{K₁, K₂}!',
    whyJustification:
      'Jika hanya memilih K₁ atau min(K₁, K₂), salah satu barisan mungkin belum masuk ke dalam koridor ε. Dengan K = max(K₁, K₂), untuk setiap n ≥ K otomatis berlaku n ≥ K₁ dan n ≥ K₂.',
    visualFocus: 'k1-k2-bound',
  },
  {
    stepNumber: 3,
    title: 'Kurangi Ketiga Ruas Hipotesis dengan w',
    relatedQuestions: [3, 10],
    formalStatement:
      'Karena xₙ ≤ yₙ ≤ zₙ untuk semua n ∈ ℕ, maka xₙ - w ≤ yₙ - w ≤ zₙ - w untuk semua n ∈ ℕ.',
    buDeaNarrative:
      'Kita punya sifat ketaksamaan di premis P: xₙ ≤ yₙ ≤ zₙ. Agar muncul bentuk selisih terhadap pusat limit w, ketiga ruas sama-sama kita kurangi dengan w.',
    whyJustification:
      'Sifat Urutan Bilangan Real (Invariansi terhadap Penjumlahan): menambahkan (-w) pada setiap ruas ketaksamaan tidak mengubah arah tanda ≤.',
    visualFocus: 'shift-w',
  },
  {
    stepNumber: 4,
    title: 'Jembatan (Why?): Penjabaran Nilai Mutlak & Transitivitas',
    relatedQuestions: [7, 11],
    formalStatement:
      'Untuk semua n ≥ K: -ε < xₙ - w ≤ yₙ - w ≤ zₙ - w < ε  ⟹  -ε < yₙ - w < ε.',
    buDeaNarrative:
      'Perhatikan pertanyaan "(why?)" di PDF! Dari |xₙ - w| < ε kita ambil sisi kirinya: -ε < xₙ - w. Dari |zₙ - w| < ε kita ambil sisi kanannya: zₙ - w < ε. Karena yₙ - w terjepit di tengah, maka otomatis -ε < yₙ - w < ε!',
    whyJustification:
      'Sifat nilai mutlak |a| < ε ⟺ -ε < a < ε dikombinasikan dengan sifat transitif ketaksamaan: (-ε < xₙ - w) ∧ (xₙ - w ≤ yₙ - w) ⟹ -ε < yₙ - w, serta (yₙ - w ≤ zₙ - w) ∧ (zₙ - w < ε) ⟹ yₙ - w < ε.',
    visualFocus: 'squeeze-inequality',
  },
  {
    stepNumber: 5,
    title: 'Kesimpulan Akhir: |yₙ - w| < ε & lim(yₙ) = w (Q.E.D.)',
    relatedQuestions: [4, 12, 13, 14],
    formalStatement:
      'Karena -ε < yₙ - w < ε ⟺ |yₙ - w| < ε untuk semua n ≥ K, dan ε > 0 sembarang, maka lim(yₙ) = w = lim(xₙ) = lim(zₙ). Q.E.D.',
    buDeaNarrative:
      'Bentuk -ε < yₙ - w < ε kita kembalikan ke bentuk nilai mutlak |yₙ - w| < ε (beri kotak!). Karena berlaku untuk semua n ≥ K dan ε > 0 sembarang, maka terbukti Y = (yₙ) konvergen ke w!',
    whyJustification:
      'Memenuhi secara lengkap Definisi 3.1.3 (Convergent of a sequence of real numbers) dan menutup rantai Bukti Langsung P ⟹ Q.',
    visualFocus: 'conclusion-qed',
  },
];

export const BUKTI_BERCERITA_BU_DEA = {
  title: 'Bukti Formal Gaya "Bercerita" Tinta Biru Ibu Dea (Teorema 3.2.7 Squeeze Theorem)',
  subtitle: 'Salin format ini untuk catatan buku / coretan layar (Annotate) saat ditanya bukti utuh',
  lines: [
    'Bukti (Direct Proof):',
    'Diberikan X = (xₙ), Y = (yₙ), dan Z = (zₙ) barisan bilangan real.',
    'Misalkan xₙ ≤ yₙ ≤ zₙ untuk setiap n ∈ ℕ, dan misalkan w := lim(xₙ) = lim(zₙ).',
    'Akan ditunjukkan bahwa Y = (yₙ) konvergen ke w (yaitu ∀ε > 0, ∃K ∈ ℕ ∋ ∀n ≥ K berlaku |yₙ - w| < ε).',
    'Ambil sembarang ε > 0.',
    'Karena X = (xₙ) konvergen ke w, maka ∃K₁ ∈ ℕ ∋ ∀n ≥ K₁ berlaku |xₙ - w| < ε  ⟺  -ε < xₙ - w < ε.',
    'Karena Z = (zₙ) konvergen ke w, maka ∃K₂ ∈ ℕ ∋ ∀n ≥ K₂ berlaku |zₙ - w| < ε  ⟺  -ε < zₙ - w < ε.',
    'Pilih K := max{K₁, K₂} ∈ ℕ. Maka untuk setiap n ≥ K berlaku kedua sifat sekaligus:',
    '   (i)  -ε < xₙ - w < ε   dan   (ii)  -ε < zₙ - w < ε.',
    'Berdasarkan premis xₙ ≤ yₙ ≤ zₙ ∀n ∈ ℕ, kurangi ketiga ruas dengan w sehingga diperoleh:',
    '   xₙ - w ≤ yₙ - w ≤ zₙ - w   untuk semua n ∈ ℕ.',
    'Akibatnya, untuk setiap n ≥ K berlaku rantai ketaksamaan:',
    '   -ε < xₙ - w ≤ yₙ - w ≤ zₙ - w < ε',
    'Dengan sifat transitif ketaksamaan diperoleh:  [ -ε < yₙ - w < ε ]  ⟺  [ |yₙ - w| < ε ]  untuk setiap n ≥ K.',
    'Karena ε > 0 sembarang, berdasarkan Definisi 3.1.3 terbukti bahwa Y = (yₙ) konvergen ke w, atau lim(xₙ) = lim(yₙ) = lim(zₙ). (Terbukti / Q.E.D.)',
  ],
};

export const ANRIL_QUESTIONS_DB: AnrilQuestionItem[] = [
  // ============================================================================
  // ANRIL MEETING VIII — TUGAS KELOMPOK (3.2.7 SQUEEZE THEOREM) — SOAL 1 s/d 14
  // ============================================================================
  {
    id: 'm8-q1',
    meetingId: 'meeting-8',
    meetingLabel: 'Meeting VIII · Squeeze Theorem 3.2.7',
    theoremCode: 'Teorema 3.2.7 (Squeeze Theorem)',
    number: 1,
    stage: 'Understanding Task',
    questionText: 'Buatlah kalimat implikasi 3.2.7 Squeeze Theorem!',
    lisanShort:
      'Ganti kata "Suppose that" menjadi "Jika" (If) dan kata "Then" menjadi "Maka", Bu!',
    tunjukSimbol:
      'Lingkari kata "Suppose that" di baris pertama teorema (tulis: JIKA P) dan lingkari kata "Then" di baris ketiga (tulis: MAKA Q).',
    tertulisFormal:
      'Jika X = (xₙ), Y = (yₙ), dan Z = (zₙ) adalah barisan bilangan real sedemikian sehingga xₙ ≤ yₙ ≤ zₙ untuk semua n ∈ ℕ dan lim(xₙ) = lim(zₙ), maka Y = (yₙ) adalah barisan yang konvergen dan lim(xₙ) = lim(yₙ) = lim(zₙ).',
    dariManaTahunya:
      'Karena dalam struktur logika teorema matematika, kalimat setelah "Suppose that / Misalkan" adalah hipotesis pengandaian (Jika P), sedangkan kalimat setelah "Then" adalah kesimpulan yang dihasilkan (Maka Q).',
    socraticTrapNote:
      'Jangan mengubah isi simbol matematika saat membuat kalimat implikasi! Pastikan kedua syarat di hipotesis (xₙ ≤ yₙ ≤ zₙ ∀n ∈ ℕ DAN lim(xₙ) = lim(zₙ)) tetap tertulis lengkap sebelum kata "maka".',
    coretanVisual:
      'Tulis skema panah implikasi besar: [ P: (xₙ), (yₙ), (zₙ) ⊂ ℝ, xₙ ≤ yₙ ≤ zₙ ∀n∈ℕ, lim(xₙ)=lim(zₙ) ] ⟹ [ Q: (yₙ) konvergen ∧ lim(xₙ)=lim(yₙ)=lim(zₙ) ].',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'Formal Logic Check (Struktur Implikasi P ⟹ Q)',
        explanation:
          'Pernyataan teorema telah diubah secara ekuivalen ke bentuk implikasi kanonik (P₁ ∧ P₂ ∧ P₃) ⟹ (Q₁ ∧ Q₂) tanpa mengubah kuantor ∀n ∈ ℕ.',
        passed: true,
      },
      {
        methodCode: 'Method B',
        methodName: 'Domain Check (Semesta Barisan Real)',
        explanation:
          'Semesta pembicaraan X, Y, Z sebagai barisan bilangan real (xₙ, yₙ, zₙ ∈ ℝ untuk n ∈ ℕ) dipertahankan secara eksplisit di dalam anteseden.',
        passed: true,
      },
    ],
    expectedKeywords: ['jika', 'maka', 'xn', 'yn', 'zn', 'konvergen', 'lim'],
  },
  {
    id: 'm8-q2',
    meetingId: 'meeting-8',
    meetingLabel: 'Meeting VIII · Squeeze Theorem 3.2.7',
    theoremCode: 'Teorema 3.2.7 (Squeeze Theorem)',
    number: 2,
    stage: 'Understanding Task',
    questionText: 'Tentukan Premis P dan Konklusi Q dari jawaban nomor 1)!',
    lisanShort:
      'Premis P setelah kata "Jika" (xₙ ≤ yₙ ≤ zₙ ∀n∈ℕ dan lim(xₙ)=lim(zₙ)), Konklusi Q setelah kata "Maka" (Y konvergen dan lim(xₙ)=lim(yₙ)=lim(zₙ)), Bu.',
    tunjukSimbol:
      'Garis bawahi warna biru kalimat di antara "Jika... maka" sebagai Premis P, dan garis bawahi warna hijau kalimat setelah "maka..." sebagai Konklusi Q.',
    tertulisFormal:
      '• Premis P:\n  (1) X = (xₙ), Y = (yₙ), dan Z = (zₙ) adalah barisan bilangan real,\n  (2) xₙ ≤ yₙ ≤ zₙ untuk semua n ∈ ℕ, dan\n  (3) lim(xₙ) = lim(zₙ) (artinya X dan Z konvergen ke nilai limit yang sama).\n\n• Konklusi Q:\n  (1) Barisan Y = (yₙ) adalah barisan yang konvergen, dan\n  (2) lim(xₙ) = lim(yₙ) = lim(zₙ).',
    dariManaTahunya:
      'Tahu itu Premis P karena letaknya di kalimat implikasi nomor 1) setelah kata "Jika" dan sebelum kata "Maka". Tahu itu Konklusi Q karena letaknya setelah kata "Maka" (Then).',
    socraticTrapNote:
      'Hati-hati! Premis P bukan cuma "xₙ ≤ yₙ ≤ zₙ", melainkan ada DUA syarat utama: (1) xₙ ≤ yₙ ≤ zₙ ∀n ∈ ℕ, dan (2) lim(xₙ) = lim(zₙ). Begitu juga Konklusi Q punya dua bagian: Y konvergen DAN limitnya sama.',
    coretanVisual:
      'Buat tabel 2 kolom: Kolom Kiri [PREMIS P (Diketahui)] berisi 3 poin syarat; Kolom Kanan [KONKLUSI Q (Akan Dibuktikan)] berisi 2 poin target.',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'Formal Logic Check (Pemisahan Anteseden & Konsekuen)',
        explanation:
          'Anteseden P memuat 3 proposisi konjungtif (P₁ ∧ P₂ ∧ P₃) dan konsekuen Q memuat 2 proposisi konjungtif (Q₁ ∧ Q₂). Tidak ada syarat yang tertinggal.',
        passed: true,
      },
      {
        methodCode: 'Method I',
        methodName: 'Counterexample Check (Kebutuhan Seluruh Premis)',
        explanation:
          'Jika salah satu bagian P dihapus (misal lim(xₙ) ≠ lim(zₙ) seperti xₙ=-1, yₙ=(-1)ⁿ, zₙ=1), maka Q gagal. Ini membuktikan seluruh komponen P wajib dicantumkan.',
        passed: true,
      },
    ],
    expectedKeywords: ['premis', 'konklusi', 'xn', 'yn', 'zn', 'lim', 'konvergen'],
  },
  {
    id: 'm8-q3',
    meetingId: 'meeting-8',
    meetingLabel: 'Meeting VIII · Squeeze Theorem 3.2.7',
    theoremCode: 'Teorema 3.2.7 (Squeeze Theorem)',
    number: 3,
    stage: 'Understanding Task',
    questionText: 'Sebutkan sifat-sifat P dan Q!',
    lisanShort:
      'Sifat P: Keterurutan suku (xₙ ≤ yₙ ≤ zₙ) dan Konvergen ke limit yang sama (lim xₙ = lim zₙ = w). Sifat Q: Konvergen ke limit yang sama (lim yₙ = w), Bu!',
    tunjukSimbol:
      'Tunjuk ketaksamaan "xₙ ≤ yₙ ≤ zₙ" dan persamaan "lim(xₙ) = lim(zₙ)" untuk sifat P; tunjuk kata "convergent" dan "lim(xₙ) = lim(yₙ) = lim(zₙ)" untuk sifat Q.',
    tertulisFormal:
      '• Sifat-sifat yang dimiliki Premis P:\n  1. Sifat keterurutan/ketaksamaan suku: untuk setiap n ∈ ℕ berlaku xₙ ≤ yₙ ≤ zₙ (suku yₙ selalu berada di antara xₙ dan zₙ).\n  2. Sifat kekonvergenan & kesamaan limit: barisan X = (xₙ) konvergen dan Z = (zₙ) konvergen ke satu nilai limit real yang sama, misalkan w := lim(xₙ) = lim(zₙ).\n     (Berdasarkan Definisi 3.1.3, artinya ∀ε > 0, ∃K₁, K₂ ∈ ℕ sehingga ∀n ≥ K₁ berlaku |xₙ - w| < ε dan ∀n ≥ K₂ berlaku |zₙ - w| < ε).\n\n• Sifat-sifat yang dimiliki Konklusi Q:\n  1. Barisan Y = (yₙ) memiliki sifat KONVERGEN.\n  2. Nilai limit barisan Y sama dengan nilai limit X dan Z, yaitu lim(yₙ) = w = lim(xₙ) = lim(zₙ).',
    dariManaTahunya:
      'Dari bunyi hipotesis di Premis P ("xₙ ≤ yₙ ≤ zₙ" adalah sifat urutan, dan Notation "lim(xₙ) = lim(zₙ)" menurut Definisi 3.1.3 menyatakan kata konvergen sering disebut limit).',
    socraticTrapNote:
      'ATURAN 1 BU DEA: Saat ditanya lisan "Apa sifat P dan Q?", JANGAN langsung membaca panjang lebar "Untuk setiap epsilon lebih dari nol...". Sebutkan dulu kata kuncinya: "Konvergen dan terurut xₙ ≤ yₙ ≤ zₙ, Bu!" Baru jabarkan definisinya jika diminta.',
    coretanVisual:
      'Tulis di layar: P ⟶ (1) Urutan: xₙ ≤ yₙ ≤ zₙ ∀n∈ℕ, (2) Konvergen: lim(xₙ) = lim(zₙ) = w. Q ⟶ Konvergen: lim(yₙ) = w.',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'Formal Logic Check (Ekstraksi Sifat & Definisi 3.1.3)',
        explanation:
          'Catatan di PDF ("Kata konvergen sering disebut limit") memastikan bahwa notasi lim(xₙ) = lim(zₙ) secara implisit memuat sifat bahwa X dan Z keduanya konvergen ke suatu bilangan real w ∈ ℝ.',
        passed: true,
      },
      {
        methodCode: 'Method B',
        methodName: 'Domain & Order Property Check',
        explanation:
          'Relasi urutan total (≤) pada ℝ dan eksistensi limit w ∈ ℝ terdefinisi dengan baik untuk seluruh n ∈ ℕ.',
        passed: true,
      },
    ],
    expectedKeywords: ['konvergen', 'limit', 'xn', 'yn', 'zn'],
  },
  {
    id: 'm8-q4',
    meetingId: 'meeting-8',
    meetingLabel: 'Meeting VIII · Squeeze Theorem 3.2.7',
    theoremCode: 'Teorema 3.2.7 (Squeeze Theorem)',
    number: 4,
    stage: 'Understanding Task',
    questionText: 'Apa yang harus ditunjukkan agar Q benar!',
    lisanShort:
      'Menunjukkan bahwa untuk setiap ε > 0 terdapat bilangan asli K sehingga untuk semua n ≥ K berlaku |yₙ - w| < ε (atau -ε < yₙ - w < ε), Bu!',
    tunjukSimbol:
      'Kotaki rumus "|xₙ - x| < ε" pada Definisi 3.1.3 di bagian atas PDF, lalu ganti xₙ menjadi yₙ dan x menjadi w: kotak "[ |yₙ - w| < ε ]".',
    tertulisFormal:
      'Misalkan w := lim(xₙ) = lim(zₙ). Berdasarkan Definisi 3.1.3 (Barisan Konvergen), agar Konklusi Q benar (yaitu barisan Y = (yₙ) konvergen ke w), kita harus menunjukkan bahwa:\n\nUntuk setiap ε > 0, terdapat suatu bilangan asli K (atau K(ε) ∈ ℕ) sedemikian sehingga untuk semua n ≥ K berlaku:\n   |yₙ - w| < ε   (yang ekuivalen dengan  -ε < yₙ - w < ε).',
    dariManaTahunya:
      'Dari Definisi 3.1.3 di atas teorema! Pada Definisi 3.1.3, barisan X = (xₙ) konvergen ke x jika ∀ε > 0, ∃K(ε) ∈ ℕ ∋ ∀n ≥ K(ε) berlaku |xₙ - x| < ε. Karena di Konklusi Q barisannya adalah Y = (yₙ) dan limitnya adalah w, maka xₙ diganti yₙ dan x diganti w.',
    socraticTrapNote:
      'Ingat Aturan 3 Bu Dea (Pemetaan Peran Variabel Antar-Definisi): Jangan menulis |xₙ - x| < ε mentah-mentah! Di Konklusi Q yang mau dibuktikan konvergen adalah barisan Y = (yₙ) menuju limit w, sehingga wajib ditulis |yₙ - w| < ε.',
    coretanVisual:
      'Petakan panah dari Definisi 3.1.3 ke Konklusi Q:\n• X = (xₙ)  ──diganti──►  Y = (yₙ)\n• limit x   ──diganti──►  w := lim(xₙ) = lim(zₙ)\n• Target Q  ──menjadi──►  ∀ε > 0, ∃K ∈ ℕ ∋ ∀n ≥ K,  [ |yₙ - w| < ε ].',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'Quantifier Order Check (∀ε > 0, ∃K ∈ ℕ, ∀n ≥ K)',
        explanation:
          'Urutan kuantor dijaga ketat: ∀ε > 0 diikuti ∃K(ε) ∈ ℕ (K bergantung pada ε), diikuti ∀n ≥ K(ε) berlaku |yₙ - w| < ε.',
        passed: true,
      },
      {
        methodCode: 'Method D',
        methodName: 'Reverse Derivation (Ekuivalensi Definisi Limit)',
        explanation:
          'Pernyataan ∀ε > 0, ∃K ∈ ℕ, ∀n ≥ K: |yₙ - w| < ε adalah definisi(iff) dari lim(yₙ) = w, sehingga langsung membuktikan Y konvergen dan lim(yₙ) = w.',
        passed: true,
      },
    ],
    expectedKeywords: ['epsilon', 'bilangan asli', 'k', 'yn', 'w'],
  },
  {
    id: 'm8-q5',
    meetingId: 'meeting-8',
    meetingLabel: 'Meeting VIII · Squeeze Theorem 3.2.7',
    theoremCode: 'Teorema 3.2.7 (Squeeze Theorem)',
    number: 5,
    stage: 'Devising a Plan',
    questionText: 'Lihat bukti di atas! Apa jenis pembuktiannya?',
    lisanShort: 'Bukti Langsung (Direct Proof), Bu!',
    tunjukSimbol:
      'Tunjuk kalimat pertama Proof ("Let w := lim(xₙ) = lim(zₙ)...") sebagai awal asumsi Premis P, dan kalimat terakhir ("this implies that lim(yₙ) = w") sebagai Konklusi Q.',
    tertulisFormal:
      'Jenis pembuktiannya adalah Pembuktian Langsung (Direct Proof).\n\nAlasan: Pembuktian dimulai dengan mengasumsikan semua pernyataan pada Premis P bernilai benar (yaitu memisalkan w := lim(xₙ) = lim(zₙ) dan menggunakan hipotesis xₙ ≤ yₙ ≤ zₙ), kemudian melalui langkah-langkah deduktif menggunakan Definisi 3.1.3 dan sifat urutan bilangan real, secara langsung menghasilkan kebenaran Konklusi Q (yaitu lim(yₙ) = w) tanpa pengandaian ingkaran/kontradiksi.',
    dariManaTahunya:
      'Karena di dalam paragraf Proof tidak ada pengandaian "Andaikan Y tidak konvergen" (bukan bukti kontradiksi) dan tidak menggunakan kontraposisi (~Q ⟹ ~P), melainkan bergerak lurus dari Premis P menuju Konklusi Q (P ⟹ Q).',
    socraticTrapNote:
      'Sesuai Mindset 1 di SKILL.MD Bu Dea: Kerangka berpikir standar modul Bu Dea untuk teorema berbentuk "Jika P maka Q" adalah Direct Proof (Bukti Langsung).',
    coretanVisual:
      'Gambar alur lurus: [ Asumsikan Premis P Benar ] ──(Definisi 3.1.3 + Sifat Ketaksamaan)──► [ Diperoleh |yₙ - w| < ε ] ──► [ Konklusi Q Terbukti (Direct Proof) ].',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'Proof Structure Check (Direct Deduction P ⟹ Q)',
        explanation:
          'Struktur bukti diverifikasi sebagai implikasi langsung (modus ponens berantai) dari premis P ke konklusi Q.',
        passed: true,
      },
      {
        methodCode: 'Method D',
        methodName: 'Step-by-Step Validity Verification',
        explanation:
          'Setiap transisi di dalam teks Proof bersifat deduktif langsung tanpa asumsi negasi konklusi.',
        passed: true,
      },
    ],
    expectedKeywords: ['langsung', 'direct', 'premis', 'konklusi'],
  },
  {
    id: 'm8-q6',
    meetingId: 'meeting-8',
    meetingLabel: 'Meeting VIII · Squeeze Theorem 3.2.7',
    theoremCode: 'Teorema 3.2.7 (Squeeze Theorem)',
    number: 6,
    stage: 'Devising a Plan',
    questionText:
      'Lihat bukti di atas! Jika diberikan ε > 0, apa yang harus kita cari? Berikan alasan!',
    lisanShort:
      'Kita harus mencari bilangan asli K (atau K(ε) ∈ ℕ), Bu! Alasannya karena menurut Definisi 3.1.3, setelah diberikan ε > 0, kita wajib menunjukkan keberadaan bilangan asli K.',
    tunjukSimbol:
      'Lingkari frasa "there exists a natural number K" pada baris ke-2 di paragraf Proof.',
    tertulisFormal:
      'Jika diberikan ε > 0, yang harus kita cari adalah suatu bilangan asli K (atau K(ε) ∈ ℕ).\n\nAlasan:\nBerdasarkan Definisi 3.1.3 (Barisan Konvergen), untuk membuktikan bahwa barisan Y = (yₙ) konvergen ke w, setelah ε > 0 diberikan secara sembarang ("for every ε > 0"), syarat definisi mengharuskan kita menemukan/menunjukkan keberadaan suatu bilangan asli K ("there exists a natural number K(ε)") yang menjadi batas mulai berlakunya ekor barisan (n ≥ K) di dalam persekitaran ε dari w.',
    dariManaTahunya:
      'Dari bunyi Definisi 3.1.3 dan kalimat di baris ke-2 Proof: "If ε > 0 is given, then it follows... that there exists a natural number K". Kata "there exists" (∃) dalam bukti konstruktif berarti objek K itulah yang harus kita cari/temukan.',
    socraticTrapNote:
      'Jangan menjawab "Mencari nilai ε"! Nilai ε > 0 itu DIBERIKAN (given/arbitrary), sedangkan tugas kita adalah MENCARI bilangan asli K (batas indeks mulai ekor barisan masuk koridor).',
    coretanVisual:
      'Gambar garis vertikal pembatas K pada grafik 2D: tulis "Diberikan lebar koridor ε > 0 ⟹ Cari posisi pagar vertikal K ∈ ℕ sehingga untuk n ≥ K semua titik masuk koridor!".',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'Existential Instantiation Check (∃K ∈ ℕ)',
        explanation:
          'Dalam pembuktian pernyataan ∀ε > 0 ∃K ∈ ℕ P(ε, K), setelah ε > 0 difiksasi secara sembarang, kewajiban pembuktian adalah mengkonstruksi objek eksistensial K ∈ ℕ.',
        passed: true,
      },
      {
        methodCode: 'Method E',
        methodName: 'Numerical Sampling Verification',
        explanation:
          'Misal untuk yₙ = sin(n)/n dan ε = 0.25, kita mencari bilangan asli K = ⌊1/0.25⌋ + 1 = 5 ∈ ℕ sehingga ∀n ≥ 5 berlaku |yₙ - 0| < 0.25.',
        passed: true,
      },
    ],
    expectedKeywords: ['bilangan asli', 'k', 'natural number', 'definisi', 'konvergen'],
  },
  {
    id: 'm8-q7',
    meetingId: 'meeting-8',
    meetingLabel: 'Meeting VIII · Squeeze Theorem 3.2.7',
    theoremCode: 'Teorema 3.2.7 (Squeeze Theorem)',
    number: 7,
    stage: 'Devising a Plan',
    questionText: 'Apa sifat-sifat objek yang kita cari pada jawaban 6)? Jelaskan alasanmu!',
    lisanShort:
      'Sifat bilangan asli K adalah jika n ≥ K maka berlaku |xₙ - w| < ε dan |zₙ - w| < ε secara bersamaan, sehingga mengakibatkan -ε < yₙ - w < ε (atau |yₙ - w| < ε), Bu!',
    tunjukSimbol:
      'Lingkari bagian "such that if n ≥ K then |xₙ - w| < ε and |zₙ - w| < ε" serta "-ε < yₙ - w < ε for all n ≥ K" pada Proof.',
    tertulisFormal:
      'Objek yang kita cari yaitu bilangan asli K ∈ ℕ memiliki sifat-sifat berikut:\n1. K adalah bilangan asli bersama yang dipilih dari K := max{K₁, K₂}, di mana K₁ adalah batas indeks konvergensi barisan X = (xₙ) dan K₂ adalah batas indeks konvergensi barisan Z = (zₙ).\n2. Untuk semua indeks n ≥ K, berlaku secara serentak:\n   • |xₙ - w| < ε  dan  |zₙ - w| < ε, serta\n   • -ε < yₙ - w < ε  (ekuivalen dengan |yₙ - w| < ε).\n\nAlasan:\nKarena barisan X dan Z masing-masing konvergen ke w, Definisi 3.1.3 menjamin adanya K₁ ∈ ℕ (untuk X) dan K₂ ∈ ℕ (untuk Z). Dengan memilih K = max{K₁, K₂}, maka untuk setiap n ≥ K kedua syarat |xₙ - w| < ε dan |zₙ - w| < ε terpenuhi sekaligus, yang bersama hipotesis xₙ ≤ yₙ ≤ zₙ menjamin suku yₙ ikut terkurung memenuhi |yₙ - w| < ε.',
    dariManaTahunya:
      'Dari kata penghubung "such that" (sedemikian sehingga) di dalam Proof setelah "there exists a natural number K": kalimat setelah "such that" selalu menjelaskan sifat yang dimiliki oleh objek K tersebut!',
    socraticTrapNote:
      'Pertanyaan favorit Bu Dea: "Kenapa di bukti tertulis satu K saja, padahal ada dua barisan X dan Z?" Jawab: "Karena K itu adalah maksimum dari K₁ milik X dan K₂ milik Z (K = max{K₁, K₂}), Bu! Kalau sudah melewati yang paling besar, otomatis keduanya sudah masuk koridor."',
    coretanVisual:
      'Gambar sumbu indeks n: tandai titik K₁ (mulai xₙ masuk koridor) dan titik K₂ di kanannya (mulai zₙ masuk koridor). Lingkari K = K₂ = max{K₁, K₂} sebagai batas mulai KEDUA barisan berada di dalam koridor V_ε(w).',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'Conjunction of Tail Conditions (K = max(K₁, K₂))',
        explanation:
          'Jika P(n) berlaku ∀n ≥ K₁ dan R(n) berlaku ∀n ≥ K₂, maka P(n) ∧ R(n) dijamin berlaku ∀n ≥ max(K₁, K₂).',
        passed: true,
      },
      {
        methodCode: 'Method E',
        methodName: 'Numerical Asymmetric Check (K₁ ≠ K₂)',
        explanation:
          'Pada xₙ = 2 - 2/n dan zₙ = 2 + 5/n dengan ε = 0.5: K₁ = 5 sedangkan K₂ = 11. Maka K = max(5, 11) = 11 menjamin kedua syarat berlaku untuk n ≥ 11.',
        passed: true,
      },
    ],
    expectedKeywords: ['n >= k', 'xn', 'zn', 'yn', 'max', 'epsilon'],
  },
  {
    id: 'm8-q8',
    meetingId: 'meeting-8',
    meetingLabel: 'Meeting VIII · Squeeze Theorem 3.2.7',
    theoremCode: 'Teorema 3.2.7 (Squeeze Theorem)',
    number: 8,
    stage: 'Carrying Out the Plan',
    questionText: 'Kenapa dimulai dari Diberikan ε > 0?',
    lisanShort:
      'Karena menurut Definisi 3.1.3, syarat barisan konvergen diawali kuantor "Untuk setiap ε > 0" (∀ε > 0), sehingga bukti wajib dimulai dengan mengambil sembarang ε > 0, Bu!',
    tunjukSimbol:
      'Tarik garis penghubung dari "for every ε > 0" di Definisi 3.1.3 ke kalimat "If ε > 0 is given" di baris pertama Proof.',
    tertulisFormal:
      'Pembuktian dimulai dari "Diberikan ε > 0" ("If ε > 0 is given") karena tujuan kita di Konklusi Q adalah membuktikan bahwa barisan Y = (yₙ) konvergen ke w.\n\nBerdasarkan Definisi 3.1.3, kalimat definisi konvergen diawali oleh kuantor universal "untuk setiap ε > 0" (∀ε > 0). Dalam pembuktian langsung (direct proof), untuk membuktikan suatu sifat berlaku bagi setiap ε > 0, langkah pertama yang wajib dilakukan adalah mengambil/menetapkan sembarang bilangan real ε > 0.',
    dariManaTahunya:
      'Dari kalimat terakhir Proof: "Since ε > 0 is arbitrary, this implies that lim(yₙ) = w" yang merujuk langsung pada syarat "for every ε > 0" di Definisi 3.1.3.',
    socraticTrapNote:
      'Jangan menjawab "Supaya ada angkanya". Tekankan bahwa ε > 0 diambil SEMBARANG (arbitrary) untuk mewakili kuantor "untuk setiap ε > 0" (∀ε > 0) pada Definisi 3.1.3!',
    coretanVisual:
      'Tulis simbol kuantor: [ Definisi 3.1.3: ∀ε > 0 ] ──(Cara Buktikan)──► [ Ambil/Diberikan sembarang ε > 0 ].',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'Universal Generalization Rule (∀-Introduction)',
        explanation:
          'Dalam kalkulus predikat, aturan inferensi Universal Generalization mensyaratkan deklarasi variabel bebas sembarang ε > 0 di awal sub-bukti.',
        passed: true,
      },
      {
        methodCode: 'Method B',
        methodName: 'Domain of Radius ε > 0',
        explanation:
          'Radius persekitaran/koridor wajib bernilai positif ketat (ε > 0) agar interval terbuka (w - ε, w + ε) tidak kosong.',
        passed: true,
      },
    ],
    expectedKeywords: ['definisi', 'setiap', 'sembarang', 'konvergen', 'epsilon'],
  },
  {
    id: 'm8-q9',
    meetingId: 'meeting-8',
    meetingLabel: 'Meeting VIII · Squeeze Theorem 3.2.7',
    theoremCode: 'Teorema 3.2.7 (Squeeze Theorem)',
    number: 9,
    stage: 'Carrying Out the Plan',
    questionText:
      'Lihat bukti di atas! Darimana diperoleh |xₙ - w| < ε dan |zₙ - w| < ε?',
    lisanShort:
      'Dari Premis P bahwa X dan Z konvergen ke w (lim xₙ = lim zₙ = w) dan penerapan Definisi 3.1.3 untuk n ≥ K = max{K₁, K₂}, Bu!',
    tunjukSimbol:
      'Tunjuk frasa "it follows from the convergence of X and Z to w" pada baris 1–2 Proof dan hubungkan ke "|xₙ - x| < ε" di Definisi 3.1.3.',
    tertulisFormal:
      'Ketaksamaan |xₙ - w| < ε dan |zₙ - w| < ε diperoleh dari:\n1. Premis P yang menyatakan bahwa lim(xₙ) = lim(zₙ) = w, artinya barisan X = (xₙ) konvergen ke w dan barisan Z = (zₙ) konvergen ke w.\n2. Penerapan Definisi 3.1.3 (Barisan Konvergen) untuk ε > 0 yang diberikan:\n   • Karena X konvergen ke w, terdapat K₁ ∈ ℕ sehingga ∀n ≥ K₁ berlaku |xₙ - w| < ε.\n   • Karena Z konvergen ke w, terdapat K₂ ∈ ℕ sehingga ∀n ≥ K₂ berlaku |zₙ - w| < ε.\n3. Dengan mengambil K := max{K₁, K₂} ∈ ℕ, maka untuk semua n ≥ K (yang memenuhi n ≥ K₁ sekaligus n ≥ K₂), kedua ketaksamaan |xₙ - w| < ε dan |zₙ - w| < ε berlaku secara serentak.',
    dariManaTahunya:
      'Tertulis eksplisit di kalimat bukti: "it follows from the convergence of X and Z to w" (diperoleh dari kekonvergenan X dan Z ke w) berdasarkan Definisi 3.1.3.',
    socraticTrapNote:
      'Jika Bu Dea bertanya: "Kenapa di situ pakainya huruf w, bukan x seperti di Definisi 3.1.3?" Jawab: "Karena di kalimat pertama Proof sudah dimisalkan w := lim(xₙ) = lim(zₙ), sehingga w berperan sebagai titik pusat limit menggantikan x di Definisi 3.1.3, Bu!"',
    coretanVisual:
      'Tulis pemetaan:\n• X konvergen ke w ──(Def 3.1.3)──► ∀n ≥ K₁, |xₙ - w| < ε\n• Z konvergen ke w ──(Def 3.1.3)──► ∀n ≥ K₂, |zₙ - w| < ε\n• Ambil K = max{K₁, K₂} ──► ∀n ≥ K berlaku keduanya!',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'Definition Instantiation Check',
        explanation:
          'Substitusi variabel limit x ↦ w pada Definisi 3.1.3 diterapkan secara konsisten untuk barisan (xₙ) dan (zₙ).',
        passed: true,
      },
      {
        methodCode: 'Method K',
        methodName: 'Index Consistency Check (n ≥ max(K₁, K₂))',
        explanation:
          'Irisan dua himpunan ekor {n ∈ ℕ : n ≥ K₁} ∩ {n ∈ ℕ : n ≥ K₂} adalah {n ∈ ℕ : n ≥ max(K₁, K₂)}.',
        passed: true,
      },
    ],
    expectedKeywords: ['premis', 'konvergen', 'definisi', 'x', 'z', 'w'],
  },
  {
    id: 'm8-q10',
    meetingId: 'meeting-8',
    meetingLabel: 'Meeting VIII · Squeeze Theorem 3.2.7',
    theoremCode: 'Teorema 3.2.7 (Squeeze Theorem)',
    number: 10,
    stage: 'Carrying Out the Plan',
    questionText:
      'Lihat bukti di atas! Darimana diperoleh xₙ - w ≤ yₙ - w ≤ zₙ - w?',
    lisanShort:
      'Dari hipotesis/premis P yaitu xₙ ≤ yₙ ≤ zₙ untuk semua n ∈ ℕ, yang ketiga ruasnya sama-sama dikurangi w (atau ditambah -w), Bu!',
    tunjukSimbol:
      'Tunjuk rumus "xₙ ≤ yₙ ≤ zₙ for all n ∈ ℕ" di Teorema 3.2.7, lalu tarik panah bertuliskan "ketiga ruas dikurangi w" menuju "xₙ - w ≤ yₙ - w ≤ zₙ - w".',
    tertulisFormal:
      'Ketaksamaan xₙ - w ≤ yₙ - w ≤ zₙ - w diperoleh dari hipotesis pada Premis P, yaitu:\n   xₙ ≤ yₙ ≤ zₙ   untuk semua n ∈ ℕ,\nkemudian ketiga ruas ketaksamaan tersebut dikurangi dengan bilangan real yang sama yaitu w (atau ditambahkan dengan -w).\n\nBerdasarkan sifat urutan bilangan real (invariansi ketaksamaan terhadap penjumlahan: jika a ≤ b maka a + c ≤ b + c untuk setiap c ∈ ℝ), pengurangan ketiga ruas dengan w menghasilkan:\n   xₙ - w ≤ yₙ - w ≤ zₙ - w   untuk semua n ∈ ℕ.',
    dariManaTahunya:
      'Dari kalimat di Proof: "Since the hypothesis implies that xₙ - w ≤ yₙ - w ≤ zₙ - w for all n ∈ ℕ". Kata "hypothesis" merujuk pada syarat xₙ ≤ yₙ ≤ zₙ di Premis P.',
    socraticTrapNote:
      'Jika Bu Dea bertanya: "Kenapa harus dikurangi w? Kenapa tidak dibiarkan xₙ ≤ yₙ ≤ zₙ saja?" Jawab: "Karena kita ingin menghubungkannya dengan |xₙ - w| < ε dan |zₙ - w| < ε serta membentuk target akhir -ε < yₙ - w < ε yang semuanya memiliki bentuk selisih terhadap w, Bu!"',
    coretanVisual:
      'Tulis transformasi aljabar:\n   xₙ      ≤      yₙ      ≤      zₙ\n  (-w)           (-w)           (-w)\n──────────────────────────────────────\n xₙ - w   ≤   yₙ - w   ≤   zₙ - w   (∀n ∈ ℕ)',
    mathSkillChecks: [
      {
        methodCode: 'Method D',
        methodName: 'Reversible Algebraic Transformation',
        explanation:
          'Operasi pengurangan dengan konstanta real w bersifat ekuivalen (reversibel): xₙ ≤ yₙ ≤ zₙ ⟺ xₙ - w ≤ yₙ - w ≤ zₙ - w.',
        passed: true,
      },
      {
        methodCode: 'Method B',
        methodName: 'Order Axiom Preservation on ℝ',
        explanation:
          'Berdasarkan aksioma lapangan terurut ℝ, penjumlahan dengan elemen (-w) ∈ ℝ mempertahankan arah relasi ≤ untuk semua n ∈ ℕ.',
        passed: true,
      },
    ],
    expectedKeywords: ['hipotesis', 'premis', 'dikurangi w', 'ketaksamaan', 'ruas'],
  },
  {
    id: 'm8-q11',
    meetingId: 'meeting-8',
    meetingLabel: 'Meeting VIII · Squeeze Theorem 3.2.7',
    theoremCode: 'Teorema 3.2.7 (Squeeze Theorem)',
    number: 11,
    stage: 'Carrying Out the Plan',
    questionText:
      'Lihat bukti di atas! Darimana diperoleh -ε < yₙ - w < ε untuk semua n ≥ K?',
    lisanShort:
      'Dari penjabaran nilai mutlak pada jawaban 9) yaitu -ε < xₙ - w dan zₙ - w < ε, yang digabungkan dengan jawaban 10) (xₙ - w ≤ yₙ - w ≤ zₙ - w) menggunakan sifat transitif ketaksamaan, Bu!',
    tunjukSimbol:
      'Lingkari kata "(why?)" di Proof, lalu tulis rantai: "-ε < xₙ - w ≤ yₙ - w ≤ zₙ - w < ε" dan coret jembatan tengahnya hingga tersisa "-ε < yₙ - w < ε".',
    tertulisFormal:
      'Ketaksamaan -ε < yₙ - w < ε untuk semua n ≥ K (jawaban atas pertanyaan "(why?)" di teks bukti) diperoleh melalui 3 langkah berikut:\n\n1. Penjabaran sifat nilai mutlak pada hasil nomor 9) untuk semua n ≥ K:\n   • |xₙ - w| < ε  ⟺  -ε < xₙ - w < ε   (ambil bagian kiri:  -ε < xₙ - w)\n   • |zₙ - w| < ε  ⟺  -ε < zₙ - w < ε   (ambil bagian kanan:  zₙ - w < ε)\n\n2. Menggabungkan batas di atas dengan ketaksamaan nomor 10) (xₙ - w ≤ yₙ - w ≤ zₙ - w) untuk semua n ≥ K:\n   -ε < xₙ - w ≤ yₙ - w ≤ zₙ - w < ε\n\n3. Menggunakan Sifat Transitif Ketaksamaan pada ℝ:\n   • Dari -ε < xₙ - w dan xₙ - w ≤ yₙ - w diperoleh  -ε < yₙ - w.\n   • Dari yₙ - w ≤ zₙ - w dan zₙ - w < ε diperoleh  yₙ - w < ε.\n   Sehingga terbukti bahwa:  -ε < yₙ - w < ε  untuk semua n ≥ K.',
    dariManaTahunya:
      'Dari sifat nilai mutlak |a| < ε ⟺ -ε < a < ε (Standar Gaya Annisa & Gagah yang disetujui Bu Dea) dan sifat transitif ketaksamaan (jika a < b dan b ≤ c maka a < c).',
    socraticTrapNote:
      'Pertanyaan Jebakan Bu Dea: "Di tengah kan tandanya kurang dari sama dengan (≤), kok hasil akhirnya menjadi kurang dari murni (<) tanpa sama dengan?" Jawab Fiks: "Karena di ujung kiri (-ε < xₙ - w) dan ujung kanan (zₙ - w < ε) tandanya kurang dari murni (<), Bu! Berdasarkan sifat transitif, jika a < b dan b ≤ c, maka a pasti kurang dari murni c (a < c)."',
    coretanVisual:
      'Gambar Garis Bilangan 1D (Standar Bu Dea):\n• Ujung kiri: -ε (bulatan kosong ○)\n• Ujung kanan: +ε (bulatan kosong ○)\n• Di dalamnya berturut-turut: titik (xₙ - w) ≤ titik (yₙ - w) ≤ titik (zₙ - w).\n• Karena (yₙ - w) terjepit di antara (xₙ - w) dan (zₙ - w) yang keduanya di dalam (-ε, ε), maka (yₙ - w) otomatis berada di dalam (-ε, ε)!',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'Strict vs Non-Strict Transitivity Check',
        explanation:
          'Transitivitas campuran diverifikasi: (-ε < xₙ - w) ∧ (xₙ - w ≤ yₙ - w) ⟹ (-ε < yₙ - w), dan (yₙ - w ≤ zₙ - w) ∧ (zₙ - w < ε) ⟹ (yₙ - w < ε).',
        passed: true,
      },
      {
        methodCode: 'Method E',
        methodName: 'Numerical Sampling Verification',
        explanation:
          'Misal ε = 0.2, xₙ - w = -0.1, yₙ - w = 0.05, zₙ - w = 0.1. Berlaku -0.2 < -0.1 ≤ 0.05 ≤ 0.1 < 0.2 ⟹ -0.2 < 0.05 < 0.2 ✓.',
        passed: true,
      },
    ],
    expectedKeywords: ['nilai mutlak', 'transitif', '-epsilon', 'xn - w', 'zn - w'],
  },
  {
    id: 'm8-q12',
    meetingId: 'meeting-8',
    meetingLabel: 'Meeting VIII · Squeeze Theorem 3.2.7',
    theoremCode: 'Teorema 3.2.7 (Squeeze Theorem)',
    number: 12,
    stage: 'Carrying Out the Plan',
    questionText:
      'Jika diperoleh -ε < yₙ - w < ε untuk semua n ≥ K, apa kesimpulan ini?',
    lisanShort:
      'Kesimpulannya berlaku |yₙ - w| < ε untuk semua n ≥ K, sehingga menurut Definisi 3.1.3 barisan Y = (yₙ) konvergen ke w, yaitu lim(yₙ) = w = lim(xₙ) = lim(zₙ), Bu!',
    tunjukSimbol:
      'Tunjuk kalimat terakhir Proof: "Since ε > 0 is arbitrary, this implies that lim(yₙ) = w. Q.E.D."',
    tertulisFormal:
      'Jika diperoleh -ε < yₙ - w < ε untuk semua n ≥ K, maka kesimpulannya adalah:\n\n1. Berdasarkan sifat nilai mutlak, ketaksamaan tersebut ekuivalen dengan:\n   |yₙ - w| < ε   untuk semua n ≥ K\n   (atau dalam notasi persekitaran: yₙ ∈ V_ε(w) untuk semua n ≥ K).\n\n2. Karena ε > 0 diambil secara sembarang (arbitrary), maka berdasarkan Definisi 3.1.3 (Barisan Konvergen), disimpulkan bahwa barisan Y = (yₙ) KONVERGEN ke w, sehingga:\n   lim(yₙ) = w = lim(xₙ) = lim(zₙ).   (Terbukti / Q.E.D.)',
    dariManaTahunya:
      'Dari ekuivalensi nilai mutlak (-ε < yₙ - w < ε ⟺ |yₙ - w| < ε) dan Definisi 3.1.3 yang menyatakan bahwa jika ∀ε > 0, ∃K ∈ ℕ ∋ ∀n ≥ K berlaku |yₙ - w| < ε, maka Y = (yₙ) konvergen ke w.',
    socraticTrapNote:
      'Pastikan menyebutkan DUA kesimpulan sesuai Konklusi Q di teorema: (1) Y = (yₙ) adalah barisan yang KONVERGEN, dan (2) nilai limitnya adalah lim(yₙ) = w = lim(xₙ) = lim(zₙ).',
    coretanVisual:
      'Beri kotak tebal seperti gaya Bu Dea:\n[ -ε < yₙ - w < ε ]  ⟺  [ |yₙ - w| < ε ]  (∀n ≥ K)\n──(Definisi 3.1.3, ε > 0 sembarang)──►  [ Y = (yₙ) konvergen & lim(yₙ) = w ].',
    mathSkillChecks: [
      {
        methodCode: 'Method D',
        methodName: 'Absolute Value Equivalence & Limit Definition Closure',
        explanation:
          'Bentuk -ε < yₙ - w < ε dikonversi kembali secara eksak menjadi |yₙ - w| < ε, yang menutup seluruh hipotesis Definisi 3.1.3.',
        passed: true,
      },
      {
        methodCode: 'Method J',
        methodName: 'Completeness of Conclusion Q',
        explanation:
          'Baik eksistensi limit (Y konvergen) maupun kesamaan nilai limit (lim xₙ = lim yₙ = lim zₙ) keduanya terjawab tuntas.',
        passed: true,
      },
    ],
    expectedKeywords: ['nilai mutlak', 'konvergen', 'lim', 'yn', 'w'],
  },
  {
    id: 'm8-q13',
    meetingId: 'meeting-8',
    meetingLabel: 'Meeting VIII · Squeeze Theorem 3.2.7',
    theoremCode: 'Teorema 3.2.7 (Squeeze Theorem)',
    number: 13,
    stage: 'Looking Back',
    questionText: 'Cocokkan jawaban nomor 4) dengan nomor 6).',
    lisanShort:
      'Sangat cocok, Bu! Nomor 4 merumuskan target definisi (∀ε > 0, ∃K ∈ ℕ sehingga ∀n ≥ K berlaku |yₙ - w| < ε), sedangkan nomor 6 adalah langkah mencari bilangan asli K ∈ ℕ tersebut setelah ε > 0 diberikan.',
    tunjukSimbol:
      'Sandarkan jawaban nomor 4 ("∀ε > 0, ∃K ∈ ℕ...") dengan jawaban nomor 6 ("Diberikan ε > 0, cari K ∈ ℕ") dan beri tanda centang cocok (✓).',
    tertulisFormal:
      'Hasil pencocokan antara jawaban nomor 4) dan nomor 6) menunjukkan bahwa keduanya SANGAT COCOK dan saling berkesinambungan:\n\n• Pada Jawaban Nomor 4) (Understanding Task): Kita merumuskan apa yang harus ditunjukkan agar Konklusi Q benar menurut Definisi 3.1.3, yaitu menunjukkan bahwa untuk setiap ε > 0, terdapat bilangan asli K ∈ ℕ sedemikian sehingga untuk semua n ≥ K berlaku |yₙ - w| < ε.\n• Pada Jawaban Nomor 6) (Devising a Plan): Ketika ε > 0 sudah diberikan di awal pembuktian, objek yang harus kita cari adalah bilangan asli K ∈ ℕ tersebut (beserta sifatnya di nomor 7 yaitu ∀n ≥ K berlaku |yₙ - w| < ε).\n\nDengan demikian, jawaban nomor 6) adalah eksekusi rencana langsung untuk memenuhi kuantor eksistensial (∃K ∈ ℕ) yang dituntut oleh jawaban nomor 4).',
    dariManaTahunya:
      'Karena dalam struktur Definisi 3.1.3 terdapat pasangan kuantor "∀ε > 0, ∃K(ε) ∈ ℕ": nomor 4) menuliskan keseluruhan pernyataan definisi yang harus dibuktikan, sedangkan nomor 6) mengidentifikasi objek K(ε) ∈ ℕ yang wajib dicari begitu ε > 0 diberikan.',
    socraticTrapNote:
      'Saat Looking Back, Bu Dea menilai apakah mahasiswa sadar hubungan antar-tahap Polya: Understanding Task (No. 4: Apa targetnya?) harus nyambung 100% dengan Devising a Plan (No. 6–7: Apa yang dicari untuk mencapai target itu?).',
    coretanVisual:
      'Gambar diagram kecocokan:\n[ No. 4 (Target Q): ∀ε > 0, ∃K ∈ ℕ ∋ ∀n ≥ K, |yₙ - w| < ε ]\n          ▲                        ▲\n          │ (Diberikan ε > 0)       │ (Objek yang dicari di No. 6 & sifatnya di No. 7)\n          └────────────────────────┘  ──► COCOK 100% ✓',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'Polya Plan-to-Goal Alignment Check',
        explanation:
          'Target pembuktian di tahap Understanding Task (No. 4) selaras satu-satu dengan sasaran konstruksi objek K di tahap Devising a Plan (No. 6).',
        passed: true,
      },
      {
        methodCode: 'Method D',
        methodName: 'Bidirectional Consistency Check',
        explanation:
          'Keberhasilan menemukan K ∈ ℕ pada nomor 6–7 secara langsung memenuhi kewajiban eksistensial pada nomor 4.',
        passed: true,
      },
    ],
    expectedKeywords: ['cocok', 'sesuai', 'nomor 4', 'nomor 6', 'bilangan asli', 'k'],
  },
  {
    id: 'm8-q14',
    meetingId: 'meeting-8',
    meetingLabel: 'Meeting VIII · Squeeze Theorem 3.2.7',
    theoremCode: 'Teorema 3.2.7 (Squeeze Theorem)',
    number: 14,
    stage: 'Looking Back',
    questionText: 'Apakah jawaban nomor 4) sesuai dengan jawaban 8)-12)?',
    lisanShort:
      'Ya, sangat sesuai, Bu! Rangkaian langkah 8) sampai 12) secara berurutan telah membuktikan seluruh syarat pada jawaban nomor 4), mulai dari mengambil ε > 0 (No. 8), menemukan K (No. 9), menjepit yₙ - w (No. 10–11), hingga memperoleh |yₙ - w| < ε untuk semua n ≥ K (No. 12).',
    tunjukSimbol:
      'Tunjuk berurutan No. 8 (∀ε > 0) ⟶ No. 9 (∃K ∈ ℕ) ⟶ No. 10 & 11 (-ε < yₙ - w < ε) ⟶ No. 12 (|yₙ - w| < ε ⟹ lim yₙ = w) yang persis memenuhi kalimat No. 4.',
    tertulisFormal:
      'Ya, jawaban nomor 4) SANGAT SESUAI dengan rangkaian jawaban nomor 8) sampai 12). Rincian kesesuaiannya adalah sebagai berikut:\n\n1. Target pada Jawaban 4): Menunjukkan bahwa ∀ε > 0, ∃K ∈ ℕ sedemikian sehingga ∀n ≥ K berlaku |yₙ - w| < ε (atau -ε < yₙ - w < ε).\n2. Kesesuaian dengan Jawaban 8)–12) (Carrying Out the Plan):\n   • Jawaban 8) memenuhi bagian "∀ε > 0" dengan memulai bukti dari pengambilan sembarang ε > 0.\n   • Jawaban 9) memenuhi bagian "∃K ∈ ℕ" dengan menemukan bilangan asli K = max{K₁, K₂} dari kekonvergenan X dan Z ke w sehingga ∀n ≥ K berlaku |xₙ - w| < ε dan |zₙ - w| < ε.\n   • Jawaban 10) menggunakan hipotesis xₙ ≤ yₙ ≤ zₙ untuk memperoleh xₙ - w ≤ yₙ - w ≤ zₙ - w.\n   • Jawaban 11) menggabungkan hasil 9) dan 10) untuk membuktikan berlakunya -ε < yₙ - w < ε untuk semua n ≥ K.\n   • Jawaban 12) menyimpulkan bahwa -ε < yₙ - w < ε ekuivalen dengan |yₙ - w| < ε untuk semua n ≥ K, yang persis merupakan target pada jawaban nomor 4), sehingga sah disimpulkan Y = (yₙ) konvergen ke w dan lim(xₙ) = lim(yₙ) = lim(zₙ).',
    dariManaTahunya:
      'Dengan memeriksa setiap komponen pada jawaban nomor 4): kuantor ∀ε > 0 dijawab oleh nomor 8), kuantor ∃K ∈ ℕ dijawab oleh nomor 9), proses penjepitan untuk semua n ≥ K dijawab oleh nomor 10)–11), dan ketaksamaan target |yₙ - w| < ε beserta kesimpulan konvergennya dijawab tuntas oleh nomor 12).',
    socraticTrapNote:
      'Tambahkan Catatan Kritis Looking Back ala Bu Dea: "Bagaimana jika salah satu syarat di premis P tidak terpenuhi, misalnya lim(xₙ) ≠ lim(zₙ)?" Maka pada langkah 9), titik pusat X (yaitu w₁) dan titik pusat Z (yaitu w₂) berbeda, sehingga pada langkah 11) koridornya terpisah dan tidak bisa menjepit yₙ menuju satu nilai limit w!',
    coretanVisual:
      'Buat matriks checklist verifikasi akhir:\n[✓] ∀ε > 0         ──► Terpenuhi di No. 8\n[✓] ∃K ∈ ℕ         ──► Terpenuhi di No. 9 (K = max{K₁, K₂})\n[✓] ∀n ≥ K         ──► Terpenuhi di No. 9, 10, 11\n[✓] |yₙ - w| < ε   ──► Terpenuhi di No. 11 & 12  ⟹  Q TERBUKTI!',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'End-to-End Deductive Completeness Check',
        explanation:
          'Rantai deduksi 8 ⟶ 9 ⟶ 10 ⟶ 11 ⟶ 12 terbukti lengkap, bebas penalaran melingkar (no circular reasoning), dan memenuhi seluruh syarat pada nomor 4.',
        passed: true,
      },
      {
        methodCode: 'Method I',
        methodName: 'Counterexample Boundary Analysis (Looking Back)',
        explanation:
          'Jika lim(xₙ) = -1 dan lim(zₙ) = 1 dengan yₙ = (-1)ⁿ, langkah 9 gagal menghasilkan pusat tunggal w, membuktikan keharusan hipotesis lim(xₙ) = lim(zₙ).',
        passed: true,
      },
    ],
    expectedKeywords: ['sesuai', 'nomor 8', 'nomor 9', 'nomor 10', 'nomor 11', 'nomor 12', 'konvergen'],
  },

  // ============================================================================
  // REFERENSI PEMBANDING DARI SKILL.MD BU DEA (TEOREMA 3.1.5 — 6 SOAL FIKS)
  // ============================================================================
  {
    id: 'm7-q1',
    meetingId: 'meeting-7',
    meetingLabel: 'Referensi SKILL Bu Dea · Teorema 3.1.5',
    theoremCode: 'Teorema 3.1.5 (Persekitaran & Barisan Konvergen)',
    number: 1,
    stage: 'Understanding Task',
    questionText: 'Tentukan sifat / Apa sifat yang dimiliki oleh premis P? (Teorema 3.1.5)',
    lisanShort: 'Konvergen, Bu!',
    tunjukSimbol: 'Lingkari satu kata "converges" (konvergen) setelah kata "if" dan sebelum kata "then".',
    tertulisFormal:
      'Barisan X = (xₙ) konvergen ke x (terletak setelah kata "if" dan sebelum kata "then" pada Teorema 3.1.5).',
    dariManaTahunya:
      'Karena letaknya di Teorema setelah kata "Jika" (If) dan sebelum kata "Maka" (Then), Bu.',
    socraticTrapNote:
      'Jangan membaca definisi "Untuk setiap epsilon lebih dari nol..." seperti kesalahan di menit 16:35! Cukup jawab singkat: "Konvergen, Bu."',
    coretanVisual: 'Lingkari kata "converges to x" pada kalimat Teorema 3.1.5.',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'Formal Logic Check (Identifikasi Premis P)',
        explanation: 'Mengidentifikasi sifat utama pada anteseden implikasi P ⟹ Q.',
        passed: true,
      },
    ],
    expectedKeywords: ['konvergen'],
  },
  {
    id: 'm7-q2',
    meetingId: 'meeting-7',
    meetingLabel: 'Referensi SKILL Bu Dea · Teorema 3.1.5',
    theoremCode: 'Teorema 3.1.5 (Persekitaran & Barisan Konvergen)',
    number: 2,
    stage: 'Understanding Task',
    questionText: 'Apa sifat yang dimiliki oleh konklusi Q? (Teorema 3.1.5)',
    lisanShort:
      'Suku xₙ berada di dalam persekitaran V_ε(x) (atau jarak xₙ ke x kurang dari ε), Bu!',
    tunjukSimbol: 'Lingkari simbol "xₙ ∈ V_ε(x)" setelah kata "then".',
    tertulisFormal:
      'Untuk setiap persekitaran-ε V_ε(x) dari x, terdapat bilangan asli K sehingga untuk semua n ≥ K, suku-suku xₙ termuat di dalam V_ε(x) (yaitu xₙ ∈ V_ε(x)).',
    dariManaTahunya:
      'Karena letaknya setelah kata "Maka" (Then) pada Teorema 3.1.5, Bu.',
    socraticTrapNote:
      'Ingat bahwa xₙ berperan sebagai u di dalam definisi persekitaran V_ε(x) = {u ∈ ℝ : |u - x| < ε}, sedangkan x berperan sebagai titik pusat.',
    coretanVisual: 'Gambar koridor pita V_ε(x) dari x - ε sampai x + ε yang memuat titik-titik xₙ untuk n ≥ K.',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'Set Membership & Neighborhood Equivalence',
        explanation: 'xₙ ∈ V_ε(x) ⟺ |xₙ - x| < ε ⟺ x - ε < xₙ < x + ε.',
        passed: true,
      },
    ],
    expectedKeywords: ['persekitaran', 'xn', 'jarak', 'epsilon'],
  },
  {
    id: 'm7-q3',
    meetingId: 'meeting-7',
    meetingLabel: 'Referensi SKILL Bu Dea · Teorema 3.1.5',
    theoremCode: 'Teorema 3.1.5 (Persekitaran & Barisan Konvergen)',
    number: 3,
    stage: 'Devising a Plan',
    questionText: 'Apa yang dicari agar sifat di konklusi Q benar, menurut definisi? (Teorema 3.1.5)',
    lisanShort:
      'Mencari bilangan asli K (atau K(ε) ∈ ℕ) sehingga untuk semua n ≥ K berlaku xₙ ∈ V_ε(x), Bu!',
    tunjukSimbol: 'Lingkari "there exists a natural number K" pada konklusi teorema.',
    tertulisFormal:
      'Mencari bilangan asli K (atau K(ε) ∈ ℕ) sedemikian sehingga untuk semua n ≥ K berlaku xₙ ∈ V_ε(x) (yaitu memenuhi syarat jarak |xₙ - x| < ε).',
    dariManaTahunya:
      'Dari definisi persekitaran V_ε(x) dan tuntutan kuantor eksistensial "terdapat bilangan asli K" pada konklusi Q.',
    socraticTrapNote:
      'Kita tidak peduli suku-suku sebelum K_ε apakah di dalam atau di luar persekitaran; yang kita pedulikan hanyalah untuk semua n ≥ K_ε wajib masuk ke dalam V_ε(x).',
    coretanVisual: 'Tandai batas vertikal K_ε pada sumbu horizontal n.',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'Existential Target Identification',
        explanation: 'Target konstruksi adalah indeks ambang K(ε) ∈ ℕ.',
        passed: true,
      },
    ],
    expectedKeywords: ['bilangan asli', 'k', 'persekitaran', 'xn'],
  },
  {
    id: 'm7-q4',
    meetingId: 'meeting-7',
    meetingLabel: 'Referensi SKILL Bu Dea · Teorema 3.1.5',
    theoremCode: 'Teorema 3.1.5 (Persekitaran & Barisan Konvergen)',
    number: 4,
    stage: 'Devising a Plan',
    questionText: 'Tuliskan langkah-langkah cara mencari pertanyaan 3) di atas (direct proof)! (Teorema 3.1.5)',
    lisanShort:
      'Asumsikan P benar ((xₙ) konvergen ke x) ⟶ ambil sembarang ε > 0 ⟶ jabarkan definisi konvergen hingga ketemu K ∈ ℕ dengan |xₙ - x| < ε ⟶ gunakan definisi V_ε(x) ⟶ simpulkan xₙ ∈ V_ε(x), Bu!',
    tunjukSimbol: 'Tulis 5 langkah berurutan dari Premis P ke Konklusi Q.',
    tertulisFormal:
      '1. Mengasumsikan premis P bernilai benar, yaitu memisalkan barisan (xₙ) konvergen ke x.\n2. Mengambil sembarang ε > 0 untuk membentuk persekitaran V_ε(x).\n3. Menjabarkan arti definisi (xₙ) konvergen ke x sehingga ditemukan bilangan asli K ∈ ℕ di mana untuk setiap n ≥ K berlaku |xₙ - x| < ε.\n4. Memperhatikan definisi persekitaran V_ε(x) = {u ∈ ℝ : |u - x| < ε}.\n5. Menyimpulkan bahwa karena |xₙ - x| < ε untuk n ≥ K, maka xₙ ∈ V_ε(x).',
    dariManaTahunya:
      'Dari gabungan alur bukti langsung (Direct Proof) Rofa, Tias, dan Ibu Dea yang menghubungkan Definisi Konvergen ke Definisi Persekitaran.',
    socraticTrapNote:
      'Pastikan langkah ke-4 menyebutkan definisi persekitaran sebagai jembatan dari |xₙ - x| < ε menuju xₙ ∈ V_ε(x).',
    coretanVisual: 'Gambar jembatan bukti: [ |xₙ - x| < ε ] ──(Definisi V_ε(x))──► [ xₙ ∈ V_ε(x) ].',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'Direct Proof Plan Verification',
        explanation: '5 langkah deduktif terstruktur dari hipotesis ke konklusi.',
        passed: true,
      },
    ],
    expectedKeywords: ['premis', 'epsilon', 'definisi', 'persekitaran', 'konvergen'],
  },
  {
    id: 'm7-q5',
    meetingId: 'meeting-7',
    meetingLabel: 'Referensi SKILL Bu Dea · Teorema 3.1.5',
    theoremCode: 'Teorema 3.1.5 (Persekitaran & Barisan Konvergen)',
    number: 5,
    stage: 'Carrying Out the Plan',
    questionText:
      'Temukanlah apa yang dicari pertanyaan nomor 3) sesuai dengan langkah-langkah seperti jawaban nomor 4)! (Teorema 3.1.5)',
    lisanShort:
      'Tulis bukti formal "Bercerita" dengan memberi kotak pada |xₙ - x| < ε dan xₙ ∈ V_ε(x) sebagai jembatan bukti, Bu!',
    tunjukSimbol: 'Beri kotak pada "[ |xₙ - x| < ε ]" dan "[ xₙ ∈ V_ε(x) ]".',
    tertulisFormal:
      'Bukti:\nDiberikan (xₙ) barisan bilangan real, dan x ∈ ℝ.\nMisal (xₙ) konvergen ke x.\nArtinya, ∀ε > 0, ∃K_ε ∈ ℕ ∋ ∀n ≥ K_ε berlaku [ |xₙ - x| < ε ].\nBerdasarkan definisi persekitaran V_ε(x) = {u ∈ ℝ : |u - x| < ε}, karena [ |xₙ - x| < ε ] untuk setiap n ≥ K_ε, maka [ xₙ ∈ V_ε(x) ]. (Terbukti).',
    dariManaTahunya:
      'Persis tulisan tangan tinta biru Ibu Dea (Menit 28:53): menggunakan alur "Bercerita", kuantor lengkap, dan memberi kotak pada jembatan pembuktian.',
    socraticTrapNote:
      'Jangan lupa memberi kotak pada |xₙ - x| < ε dan xₙ ∈ V_ε(x) untuk menunjukkan kunci/jembatan pembuktiannya!',
    coretanVisual:
      'Tulis bukti tinta biru lengkap dengan dua kotak jembatan: [ |xₙ - x| < ε ] ⟹ [ xₙ ∈ V_ε(x) ].',
    mathSkillChecks: [
      {
        methodCode: 'Method J',
        methodName: 'Formal Quantifier & Bridge Verification',
        explanation: 'Kuantor ∀ε > 0, ∃K_ε ∈ ℕ, ∀n ≥ K_ε tertulis lengkap dan sah.',
        passed: true,
      },
    ],
    expectedKeywords: ['bukti', 'konvergen', 'persekitaran', 'terbukti'],
  },
  {
    id: 'm7-q6',
    meetingId: 'meeting-7',
    meetingLabel: 'Referensi SKILL Bu Dea · Teorema 3.1.5',
    theoremCode: 'Teorema 3.1.5 (Persekitaran & Barisan Konvergen)',
    number: 6,
    stage: 'Looking Back',
    questionText:
      'Buktikanlah apa yang kamu temukan pada pertanyaan nomor 5) benar (memenuhi definisi)! (Teorema 3.1.5)',
    lisanShort:
      'Temuan K = K(ε) ∈ ℕ sudah memenuhi definisi persekitaran karena xₙ bertindak sebagai u yang memenuhi |xₙ - x| < ε. Jika barisan tidak konvergen (misal (-1)ⁿ), V_ε(x) tetap ada tetapi K_ε tidak akan pernah ditemukan, Bu!',
    tunjukSimbol: 'Petakan xₙ ↦ u pada V_ε(x) = {u ∈ ℝ : |u - x| < ε}.',
    tertulisFormal:
      '• Verifikasi Definisi: Temuan K = K(ε) ∈ ℕ dari definisi konvergen sudah memenuhi definisi persekitaran karena untuk semua n ≥ K, suku xₙ memenuhi |xₙ - x| < ε. Jika dipetakan ke definisi V_ε(x) = {u ∈ ℝ : |u - x| < ε}, suku xₙ bertindak sebagai u, sehingga sah bahwa xₙ ∈ V_ε(x).\n• Catatan Kritis (Kasus Tidak Konvergen): Definisi konvergen dan definisi persekitaran adalah dua hal yang berdiri sendiri. Jika barisan tidak konvergen (misalnya xₙ = (-1)ⁿ yang melompat naik-turun atau xₙ = n yang terus naik), persekitaran V_ε(x) tetap ada, tetapi kita tidak akan bisa menemukan batas K_ε yang menjamin semua suku setelahnya masuk ke dalam koridor persekitaran tersebut.',
    dariManaTahunya:
      'Dari pemetaan peran variabel (Aturan 3 Bu Dea) dan uji kasus barisan divergen xₙ = (-1)ⁿ.',
    socraticTrapNote:
      'Pahami bedanya: Persekitaran V_ε(x) selalu ada untuk titik x ∈ ℝ mana pun, tetapi batas ekor K_ε hanya ada jika barisannya KONVERGEN ke x!',
    coretanVisual:
      'Gambar perbandingan 2 grafik: Grafik Kiri (Konvergen: setelah K_ε semua titik di dalam koridor) vs Grafik Kanan (xₙ = (-1)ⁿ: titik terus melompat keluar koridor, K_ε tidak ada).',
    mathSkillChecks: [
      {
        methodCode: 'Method I',
        methodName: 'Counterexample Analysis (Divergent Sequence xₙ = (-1)ⁿ)',
        explanation:
          'Untuk xₙ = (-1)ⁿ dan ε = 0.5, tidak ada K ∈ ℕ yang membuat ∀n ≥ K berlaku |(-1)ⁿ - x| < 0.5.',
        passed: true,
      },
    ],
    expectedKeywords: ['memenuhi', 'definisi', 'persekitaran', 'tidak konvergen', 'k'],
  },
];
