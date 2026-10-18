import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories, filterArticles, readMinutes } from '../content/blog.mjs';
import BlogCard from '../components/blog/BlogCard';
import useBlog from '../blog/useBlog';
import { visiblePosts } from '../blog/store.mjs';
import JournalArt from '../components/blog/JournalArt';
import Image from '../assets/about-hero.webp';
import '../styles/blog.css';
export default function BlogPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [blog] = useBlog();
  const articles = visiblePosts(blog);
  const featured = articles.find(a => a.featured) || articles[0];
  const results = filterArticles(query, category, articles);
  const reset = () => {setQuery(''); setCategory('All');};
  return <div className="journal wrap">
    <header className="journal-hero"><div><p className="journal-kicker">The Tru Fit journal</p><h1>Small reads.<br/><span>Forward steps.</span></h1><p>Coaching, everyday routines, and a little clarity for your next step.</p></div><div className="journal-hero-symbol" aria-hidden="true"><span>✳</span><p>A little better.<br/>Every day.</p></div></header>
    {blog.records.some(r=>r.updatedAt || !r.published) && <p className="journal-local-notice">Browser preview · your local publishing changes are shown here only.</p>}
    {featured && <section className="journal-feature" aria-labelledby="featured-guide"><div className="journal-feature-photo">{featured.slug === 'getting-started-with-a-coach' && !featured.localPreview ? <img src={Image} alt="People joining hands before an outdoor workout" fetchPriority="high"/> : <JournalArt visual={featured.visual}/>}</div><div className="journal-feature-copy"><div className="journal-meta"><span>Featured guide</span><span>{readMinutes(featured)} min read</span></div><h2 id="featured-guide">{featured.title}</h2><p>{featured.excerpt}</p><Link className="button" to={`/blog/${featured.slug}`}>Read the guide</Link></div></section>}
    <section className="journal-library" aria-labelledby="journal-library-title"><div className="journal-library-top"><div><p className="journal-kicker">Find your next read</p><h2 id="journal-library-title">A little guidance goes a long way.</h2></div><label className="journal-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><span className="journal-sr-only">Search guides</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search guides…"/></label></div>
      <div className="journal-filters" aria-label="Filter guides by topic">{categories.map(c => <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div>
      <p className="journal-results" role="status">{results.length} {results.length === 1 ? 'guide' : 'guides'}{category !== 'All' ? ` in ${category.toLowerCase()}` : ' to explore'}{query.trim() ? ` matching “${query.trim()}”` : ''}</p>
      {results.length ? <div className="journal-grid">{results.map(a => <BlogCard key={a.slug} article={a}/>)}</div> : <div className="journal-empty"><h3>No guides found</h3><p>Try a different word or explore all topics.</p><button className="button" onClick={reset}>Clear filters</button></div>}
    </section>
    <aside className="journal-cta"><div><p className="journal-kicker">Your next chapter</p><h2>Ready for guidance that’s personal?</h2><p>Explore our coaches and choose a plan that fits your life.</p></div><Link className="button" to="/coaches">Meet your coach</Link></aside>
  </div>;
}
