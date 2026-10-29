import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBmi } from './core.mjs';

test('BMI uses kilograms divided by metres squared', () => {
  const result = calculateBmi({ weightKg: 73, heightCm: 175, adult: true });
  assert.equal(result.bmi, 23.8);
  assert.equal(result.category.key, 'healthy');
});
test('adult categories are consistent at displayed boundaries', () => {
  for (const [weight, bmi, category] of [[60,15,'underweight'],[74,18.5,'healthy'],[99.6,24.9,'healthy'],[100,25,'overweight'],[119.6,29.9,'overweight'],[120,30,'obesity']]) {
    const result = calculateBmi({ weightKg: weight, heightCm: 200, adult: true });
    assert.equal(result.bmi, bmi);
    assert.equal(result.category.key, category);
  }
  assert.equal(calculateBmi({ weightKg: 99.96, heightCm: 200, adult: true }).category.key, 'overweight');
});
test('invalid measurements and unconfirmed adult status do not produce a report', () => {
  for (const weightKg of ['', ' ', NaN, Infinity, 0, -1, 19, 501, true, [], null]) {
    assert.throws(() => calculateBmi({ weightKg, heightCm: 175, adult: true }));
  }
  for (const heightCm of ['', 0, 99, 251, Infinity, null]) {
    assert.throws(() => calculateBmi({ weightKg: 73, heightCm, adult: true }));
  }
  for (const adult of [false, undefined, 'true', 1]) {
    assert.throws(() => calculateBmi({ weightKg: 73, heightCm: 175, adult }));
  }
});
test('equivalent metric and imperial inputs produce the same result', () => {
  const imperial = calculateBmi({ weightKg: 160 * 0.45359237, heightCm: (5 * 12 + 9) * 2.54, adult: true });
  const metric = calculateBmi({ weightKg: 72.5747792, heightCm: 175.26, adult: true });
  assert.equal(imperial.bmi, metric.bmi);
  assert.deepEqual(imperial.category, metric.category);
});
