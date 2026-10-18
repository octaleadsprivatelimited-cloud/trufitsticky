import test from 'node:test';
import assert from 'node:assert/strict';
import { articles, categories, filterArticles, relatedArticles, readMinutes, blogSeoPages } from './blog.mjs';
test('published guides have unique routable content and SEO entries', () => {
  assert.equal(new Set(articles.map(a => a.slug)).size, articles.length);
  assert.equal(articles.filter(a => a.featured).length, 1);
  for (const a of articles) {
    assert.match(a.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(categories.includes(a.category));
    assert.ok(a.sections.length > 0 && a.sections.every(s => s.heading && s.paragraphs.length));
    assert.equal(blogSeoPages['/blog/' + a.slug].heading, a.title);
    assert.ok(Number.isInteger(readMinutes(a)) && readMinutes(a) >= 1);
  }
});
test('search is trimmed, case insensitive, and includes article body', () => {
  assert.deepEqual(filterArticles('  CALENDAR  '), filterArticles('calendar'));
  assert.ok(filterArticles('calendar').some(a => a.slug === 'make-room-for-training'));
  assert.equal(filterArticles('unfindable word xyz').length, 0);
  assert.equal(filterArticles('  ').length, articles.length);
});
test('category and search filters work together', () => {
  assert.ok(filterArticles('', 'Coaching').every(a => a.category === 'Coaching'));
  assert.equal(filterArticles('food preferences', 'Training').length, 0);
  assert.ok(filterArticles('food preferences', 'Nutrition').length > 0);
});
test('related reads exclude the current guide and prioritize its topic', () => {
  const related = relatedArticles('compare-coaching-programs');
  assert.equal(related.length, 3);
  assert.ok(related.every(a => a.slug !== 'compare-coaching-programs'));
  assert.equal(related[0].category, 'Getting started');
});
