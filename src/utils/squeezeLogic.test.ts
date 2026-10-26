import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SEQUENCE_PRESETS,
  simulateSqueezeTheorem,
  calculateActivityZone,
  evaluateStudentAnswer,
} from './squeezeLogic';
import { ANRIL_QUESTIONS_DB, SQUEEZE_PROOF_STEPS } from '../data/anrilDatabase';

test('ANRIL Meeting VIII database contains all 14 Squeeze Theorem questions and 6 Reference 3.1.5 questions', () => {
  const m8Questions = ANRIL_QUESTIONS_DB.filter((q) => q.meetingId === 'meeting-8');
  const m7Questions = ANRIL_QUESTIONS_DB.filter((q) => q.meetingId === 'meeting-7');

  assert.equal(m8Questions.length, 14, 'Should have exactly 14 questions for ANRIL Meeting VIII');
  assert.equal(m7Questions.length, 6, 'Should have 6 benchmark questions for Teorema 3.1.5');

  for (let i = 1; i <= 14; i++) {
    const q = m8Questions.find((item) => item.number === i);
    assert.ok(q, `Question number ${i} must exist in Meeting VIII`);
    assert.ok(q.lisanShort.length > 5, `Question ${i} must have lisanShort answer`);
    assert.ok(q.tertulisFormal.length > 20, `Question ${i} must have tertulisFormal answer`);
    assert.ok(q.dariManaTahunya.length > 10, `Question ${i} must have dariManaTahunya explanation`);
    assert.ok(q.mathSkillChecks.length >= 2, `Question ${i} must have at least 2 Math.skill verification checks`);
    assert.ok(q.mathSkillChecks.every((c) => c.passed), `All Math.skill checks for Question ${i} must pass`);
  }
});

test('Squeeze Theorem mathematical simulation verifies -epsilon < xn - w <= yn - w <= zn - w < epsilon for all n >= K', () => {
  const classicPreset = SEQUENCE_PRESETS.find((p) => p.id === 'classic-sin')!;
  const result = simulateSqueezeTheorem(classicPreset, 0.2, 25);

  assert.equal(result.K1, 6);
  assert.equal(result.K2, 6);
  assert.equal(result.K, 6);
  assert.equal(result.allOrderHolds, true);
  assert.equal(result.allTailYnInCorridor, true);

  for (const term of result.terms) {
    assert.ok(term.xn <= term.yn + 1e-12 && term.yn <= term.zn + 1e-12);
    if (term.n >= result.K) {
      assert.ok(term.xnMinusW > -0.2 && term.xnMinusW < 0.2);
      assert.ok(term.ynMinusW > -0.2 && term.ynMinusW < 0.2);
      assert.ok(term.znMinusW > -0.2 && term.znMinusW < 0.2);
    }
  }
});

test('Asymmetric K1 != K2 preset chooses K = max(K1, K2) and guarantees convergence for n >= K', () => {
  const asymPreset = SEQUENCE_PRESETS.find((p) => p.id === 'asymmetric-k')!;
  const result = simulateSqueezeTheorem(asymPreset, 0.5, 30);

  // K1 = floor(2 / 0.5) + 1 = 5, K2 = floor(5 / 0.5) + 1 = 11 => K = max(5, 11) = 11
  assert.equal(result.K1, 5);
  assert.equal(result.K2, 11);
  assert.equal(result.K, 11);
  assert.equal(result.allTailYnInCorridor, true);
});

test('Counterexample divergent preset correctly fails tail corridor condition when lim(xn) != lim(zn)', () => {
  const counterPreset = SEQUENCE_PRESETS.find((p) => p.id === 'counterexample-divergent')!;
  const result = simulateSqueezeTheorem(counterPreset, 0.5, 20);

  assert.equal(result.isConvergentSample, false);
  assert.equal(result.allOrderHolds, true);
  assert.equal(result.allTailYnInCorridor, false);
});

test('Activity zone scoring transitions accurately from Zona Merah to Zona Hijau', () => {
  const z0 = calculateActivityZone([]);
  assert.equal(z0.totalPoints, 0);
  assert.equal(z0.zoneName, 'Zona Merah');

  const z4 = calculateActivityZone(['m8-q1', 'm8-q2', 'm8-q3', 'm8-q4']);
  assert.equal(z4.totalPoints, 200);
  assert.equal(z4.zoneName, 'Zona Oranye');

  const z14 = calculateActivityZone(
    Array.from({ length: 14 }, (_, idx) => `m8-q${idx + 1}`)
  );
  assert.equal(z14.totalPoints, 700);
  assert.equal(z14.zoneName, 'Zona Hijau');
});

test('Socratic answer evaluator detects Bu Dea traps and rewards concise accurate answers', () => {
  const trapResult = evaluateStudentAnswer(
    'Untuk setiap epsilon lebih dari nol terdapat bilangan asli',
    ['konvergen', 'limit', 'xn', 'yn', 'zn'],
    3
  );
  assert.equal(trapResult.isAccurate, false);
  assert.ok(trapResult.socraticWarning?.includes('Jebakan Sokratik Bu Dea'));

  const goodResult = evaluateStudentAnswer(
    'Sifat P: keterurutan xn <= yn <= zn dan konvergen ke limit yang sama. Sifat Q: konvergen.',
    ['konvergen', 'limit', 'xn', 'yn', 'zn'],
    3
  );
  assert.equal(goodResult.isAccurate, true);
  assert.equal(goodResult.socraticWarning, null);
});

test('Dynamic proof steps cover all 14 questions of Meeting VIII', () => {
  assert.equal(SQUEEZE_PROOF_STEPS.length, 5);
  const covered = new Set<number>();
  for (const step of SQUEEZE_PROOF_STEPS) {
    for (const qNum of step.relatedQuestions) {
      covered.add(qNum);
    }
  }
  assert.equal(covered.size, 14, 'All 14 questions must be linked to the 5 dynamic proof steps');
});
