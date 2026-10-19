import SectionContent from '../components/blog/SectionContent';
import { Link, useParams } from 'react-router-dom';
import { readMinutes, relatedArticles } from '../content/blog.mjs';
import useBlog from '../blog/useBlog';
import { visiblePosts } from '../blog/store.mjs';
import BlogCard from '../components/blog/BlogCard';
import BlogCover from '../components/blog/BlogCover';
import '../styles/blog.css';
export default function BlogPostPage() {
  const { slug } = useParams();
  const [blog] = useBlog();
  const articles = visiblePosts(blog);
  const article = articles.find(a => a.slug === slug);
  if (!article) return <div className="journal wrap journal-not-found"><p className="journal-kicker">The Tru Fit journal</p><h1>We couldn’t find that guide.</h1><p>Explore the journal to find your next read.</p><Link className="button" to="/blog">Back to the blog</Link></div>;
  return <div className="journal wrap">
    {article.localPreview && <p className="journal-local-notice">Published browser preview · visible on this device only.</p>}
    <nav className="journal-breadcrumb" aria-label="Breadcrumb"><Link to="/blog">The Tru Fit journal</Link><span aria-hidden="true">/</span><span>{article.category}</span></nav>
    <header className="journal-post-header"><div><div className="journal-meta"><span>{article.category}</span><span>{readMinutes(article)} min read</span></div><h1>{article.title}</h1><p>{article.excerpt}</p></div><div className="journal-post-art"><BlogCover article={article}/></div></header>
    <div className="journal-reading"><aside className="journal-contents"><p className="journal-kicker">In this guide</p><nav aria-label="In this guide">{article.sections.map((s,i) => <a href={`#guide-${i+1}`} key={i}>{s.heading}</a>)}</nav><Link className="journal-back" to="/blog">Back to all guides</Link></aside>
      <article className="journal-body" aria-label={article.title}>{article.sections.map((s,i) => <section key={i} id={`guide-${i+1}`}><span className="journal-section-number" aria-hidden="true">0{i+1}</span><h2>{s.heading}</h2><SectionContent section={s}/></section>)}<div className="journal-article-cta"><h2>Take the next step with a coach.</h2><p>See available programs, prices, and reviews on each coach’s profile.</p><Link className="button" to="/coaches">Explore our coaches</Link></div></article>
    </div>
    <section className="journal-related" aria-labelledby="related-title"><div className="journal-related-top"><h2 id="related-title">Keep your momentum.</h2><Link to="/blog">View all guides</Link></div><div className="journal-grid">{relatedArticles(slug, articles).map(a => <BlogCard key={a.slug} article={a}/>)}</div></section>
  </div>;
}
