import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialWorkspace, updateDiet, validateDiet, publishedProducts, updateProduct, validateProduct } from './store.mjs';
import { affiliateLink } from '../portal/products.mjs';

const plan = () => ({ title: 'Sample coach plan', startDate: '2026-10-17', reviewDate: '2026-10-24', notes: 'Sample notes', meals: [{ id: 'one', label: 'Breakfast', time: '08:00', food: 'Sample guidance provided by the team.' }] });
const product = () => ({ id: 'sample-test-product', name: 'Sample training kit', description: 'Team-provided example.', category: 'Strength', icon: 'bands', note: '', affiliateUrl: 'https://shop.example.com/item?affiliate=team', customerIds: ['demo-member'] });

test('diet drafts remain private while a previously published version stays visible', () => {
  const initial = initialWorkspace(), original = plan();
  const published = updateDiet(initial, 'demo-member', original, true);
  original.meals[0].food = 'Changed outside the workspace';
  assert.equal(published.diets['demo-member'].published.meals[0].food, 'Sample guidance provided by the team.');
  const revised = { ...plan(), title: 'Revision kept in draft' };
  const drafted = updateDiet(published, 'demo-member', revised, false);
  assert.equal(drafted.diets['demo-member'].published.title, 'Sample coach plan');
  assert.equal(drafted.diets['demo-member'].draft.title, 'Revision kept in draft');
  assert.deepEqual(initial.diets, {});
  const next = updateDiet(drafted, 'demo-jamie', plan(), true);
  assert.equal(next.diets['demo-member'].draft.title, 'Revision kept in draft');
  assert.equal(next.diets['demo-jamie'].published.title, 'Sample coach plan');
});
test('publishing a diet needs complete meal guidance and coherent review dates', () => {
  assert.equal(validateDiet(plan()), '');
  assert.ok(validateDiet({ ...plan(), title: '  ' }));
  assert.ok(validateDiet({ ...plan(), meals: [] }));
  assert.ok(validateDiet({ ...plan(), meals: [{ label: 'Lunch', food: ' ' }] }));
  assert.ok(validateDiet({ ...plan(), reviewDate: '2026-10-16' }));
});
test('only published products assigned to a customer appear in that customer view', () => {
  const initial = initialWorkspace();
  const drafted = updateProduct(initial, product(), false);
  assert.equal(publishedProducts(drafted, 'demo-member').length, 0);
  const published = updateProduct(drafted, product(), true);
  assert.equal(publishedProducts(published, 'demo-member').length, 1);
  assert.equal(publishedProducts(published, 'demo-jamie').length, 0);
  const shared = updateProduct(published, { ...product(), customerIds: [] }, true);
  assert.equal(publishedProducts(shared, 'demo-jamie').length, 1);
  const archived = { ...shared, products: shared.products.map(item => ({ ...item, status: 'archived' })) };
  assert.equal(publishedProducts(archived, 'demo-member').length, 0);
});
test('unsafe affiliate links cannot be published and supplied affiliate parameters are preserved', () => {
  for (const link of ['', 'javascript:alert(1)', 'http://example.com', '//example.com', 'https://user:secret@example.com']) {
    assert.ok(validateProduct({ ...product(), affiliateUrl: link }, true));
    assert.equal(affiliateLink(link), null);
  }
  assert.equal(validateProduct({ ...product(), affiliateUrl: '' }, false), '');
  assert.equal(validateProduct(product(), true), '');
  assert.equal(affiliateLink(product().affiliateUrl).href, product().affiliateUrl);
  assert.equal(publishedProducts(initialWorkspace(), 'demo-member').length, 0);
});
