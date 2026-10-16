import test from 'node:test';
import assert from 'node:assert/strict';
import { demoAccount, daysSince, programProgress, formatMoney, invoiceFilename } from './data.mjs';
import { createSampleInvoice } from './invoice.mjs';

test('membership days use the member calendar date at midnight, including join day', () => {
  assert.equal(daysSince('2026-07-12', new Date('2026-07-11T18:30:00Z')), 1);
  assert.equal(daysSince('2026-07-12', new Date('2026-07-12T18:29:59Z')), 1);
  assert.equal(daysSince('2026-07-12', new Date('2026-07-12T18:30:00Z')), 2);
  assert.equal(daysSince('2026-07-12', '2026-07-10'), 0);
  assert.equal(daysSince('2026-02-30', '2026-10-16'), 0);
});
test('program progress has no negative days and stops at the end date', () => {
  const program = demoAccount.programs[0];
  assert.deepEqual(programProgress(program, '2026-10-16'), { total: 168, elapsed: 97, remaining: 71, percent: 58 });
  assert.deepEqual(programProgress(program, '2026-06-01'), { total: 168, elapsed: 0, remaining: 168, percent: 0 });
  assert.deepEqual(programProgress(program, '2027-01-01'), { total: 168, elapsed: 168, remaining: 0, percent: 100 });
});
test('currency minor units and filenames are handled without floating point totals', () => {
  assert.match(formatMoney(2500000, 'INR'), /25,000\.00/);
  assert.equal(formatMoney(1250, 'USD'), '$12.50');
  assert.match(formatMoney(1250, 'JPY'), /1,250/);
  assert.equal(invoiceFilename({ id: '../bad/name' }), '---bad-name.pdf');
});
test('only paid sample invoices produce a one-page PDF with no active content', () => {
  const document = createSampleInvoice(demoAccount.invoices[0], demoAccount);
  assert.equal(document.getNumberOfPages(), 1);
  const output = document.output();
  assert(output.startsWith('%PDF-'));
  assert(!output.includes('/JavaScript'));
  assert(!output.includes('/Launch'));
  assert.throws(() => createSampleInvoice({ ...demoAccount.invoices[0], id: 'REAL-123' }, demoAccount));
  assert.throws(() => createSampleInvoice({ ...demoAccount.invoices[0], status: 'unpaid' }, demoAccount));
});
