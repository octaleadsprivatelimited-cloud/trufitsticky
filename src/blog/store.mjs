import { validCoverImage } from './images.mjs';
import { articles, categories } from '../content/blog.mjs';
export const BLOG_KEY = 'trufit_blog_preview_v1';
export const BLOG_EVENT = 'trufit:blog-preview';
export const visuals = ['start', 'calendar', 'plate', 'plans', 'checkin', 'together'];
export function initialBlog() {
  return {version: 1, records: articles.map(article => ({id: article.slug, draft: structuredClone(article), published: structuredClone(article), updatedAt: null, publishedAt: null}))};
}
function validPostShape(post) {
  return post && validCoverImage(post.coverImage) && ['slug','title','excerpt','category','visual'].every(key=>typeof post[key] === 'string') &&
    Array.isArray(post.sections) && post.sections.length > 0 && post.sections.every(section=>typeof section.heading === 'string' && Array.isArray(section.paragraphs) && section.paragraphs.every(p=>typeof p === 'string'));
}
export function readBlog(storage) {
  try {
    const value = JSON.parse((storage || globalThis.localStorage).getItem(BLOG_KEY));
    if (value?.version === 1 && Array.isArray(value.records) && new Set(value.records.map(r=>r?.id)).size === value.records.length && value.records.every(r => typeof r?.id === 'string' && validPostShape(r.draft) && (!r.published || validPostShape(r.published)))) return value;
  } catch { /* A new browser starts with the published repository guides. */ }
  return initialBlog();
}
export function writeBlog(next) {
  localStorage.setItem(BLOG_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(BLOG_EVENT));
}
export const slugify = text => text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90).replace(/-$/,'');
export function blankPost() { return {slug:'', title:'', excerpt:'', category:'Getting started', visual:'start', coverImage:null, featured:false, sections:[{heading:'', paragraphs:[]}]}; }
export function validatePost(blog, id, post, publish = false) {
  if (!post.title.trim()) return 'Add a post title.';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) || post.slug.length > 90) return 'Use a URL slug with lowercase letters, numbers, and hyphens.';
  if (blog.records.some(r => r.id !== id && (r.draft.slug === post.slug || r.published?.slug === post.slug))) return 'That URL slug belongs to another post.';
  const current = blog.records.find(r => r.id === id);
  if ((current?.canonicalSlug || current?.published?.slug) && (current.canonicalSlug || current.published.slug) !== post.slug) return 'Keep the published URL unchanged so existing links continue working.';
  if (!categories.slice(1).includes(post.category) || !visuals.includes(post.visual)) return 'Choose an available topic and cover illustration.';
  if (!validCoverImage(post.coverImage)) return 'Choose a valid cover image or remove it.';
  if (publish && post.coverImage && !post.coverImage.alt.trim()) return 'Add an image description (alt text) before publishing.';
  if (publish && !post.excerpt.trim()) return 'Add a short description before publishing.';
  if (publish && (!post.sections.length || post.sections.some(s => !s.heading.trim() || !s.paragraphs.some(p => p.trim())))) return 'Give every section a heading and at least one paragraph before publishing.';
  return '';
}
export function savePost(blog, id, post, publish = false, now = new Date().toISOString()) {
  const error = validatePost(blog,id,post,publish);
  if (error) throw new Error(error);
  const draft = {...structuredClone(post), ...(post.coverImage?{coverImage:{...post.coverImage,alt:post.coverImage.alt.trim()}}:{}), title:post.title.trim(), excerpt:post.excerpt.trim(), sections:post.sections.map(s=>({heading:s.heading.trim(), paragraphs:s.paragraphs.map(p=>p.trim()).filter(Boolean)}))};
  const previous = blog.records.find(r=>r.id === id);
  const record = {...previous, id, draft, updatedAt:now, ...(publish ? {published:structuredClone(draft), publishedAt:now, canonicalSlug:previous?.canonicalSlug || draft.slug} : {})};
  let records = previous ? blog.records.map(r=>r.id === id ? record : r) : [record,...blog.records];
  if (publish && draft.featured) records = records.map(r=>r.id === id ? r : {...r, draft:{...r.draft, featured:false}, published:r.published ? {...r.published, featured:false} : null});
  return {...blog, records};
}
export function unpublishPost(blog, id) { return {...blog, records:blog.records.map(r=>r.id === id ? {...r,published:null,publishedAt:null} : r)}; }
export function visiblePosts(blog) { return blog.records.filter(r=>r.published).map(r=>({...r.published, localPreview:Boolean(r.updatedAt)})); }
export function postStatus(record) { return !record.published ? 'Draft' : JSON.stringify(record.draft) !== JSON.stringify(record.published) ? 'Unpublished changes' : 'Published'; }
