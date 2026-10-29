import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCalories, ACTIVITY_LEVELS } from './core.mjs';
const example = { weightKg: 70, heightCm: 175, age: 30, sex: 'male', activity: 'sedentary', eligible: true };

test('rounded Mifflin equation and lifestyle bands yield a maintenance range', () => {
  const result = calculateCalories(example);
  assert.equal(result.restingCalories, 1649);
  assert.equal(result.maintenanceMin, 2310);
  assert.equal(result.maintenanceMax, 2790);
  assert.equal(result.maintenanceCalories, 2550);
});
test('female equation uses its stated coefficient', () => {
  assert.equal(calculateCalories({ ...example, sex: 'female' }).restingCalories, 1483);
});
test('activity changes maintenance without changing the resting estimate', () => {
  const results = ACTIVITY_LEVELS.map(level => calculateCalories({ ...example, activity: level.key }));
  assert.ok(results[1].maintenanceMin > results[0].maintenanceMin);
  assert.ok(results[2].maintenanceMax > results[1].maintenanceMax);
  assert.equal(new Set(results.map(result => result.restingCalories)).size, 1);
});
test('invalid, child, unconfirmed and unsuitable measurements do not produce targets', () => {
  for (const patch of [{ age: 17 }, { age: 81 }, { age: 30.5 }, { age: '' }, { weightKg: Infinity }, { heightCm: 0 }, { weightKg: true }, { sex: '' }, { activity: 'unknown' }, { eligible: false }, { eligible: 'true' }, { weightKg: 45 }]) {
    assert.throws(() => calculateCalories({ ...example, ...patch }));
  }
});
test('equivalent metric and imperial values produce identical energy estimates', () => {
  const imperial = calculateCalories({ ...example, weightKg: 160 * 0.45359237, heightCm: 69 * 2.54 });
  const metric = calculateCalories({ ...example, weightKg: 72.5747792, heightCm: 175.26 });
  assert.equal(imperial.maintenanceCalories, metric.maintenanceCalories);
  assert.equal(imperial.restingCalories, metric.restingCalories);
});
