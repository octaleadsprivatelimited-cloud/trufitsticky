import BlogCover from './BlogCover';
import { readMinutes } from '../../content/blog.mjs';
export default function ArticleContent({ article, preview = false }) {
  return <><header className="journal-post-header"><div><div className="journal-meta"><span>{article.category}</span><span>{readMinutes(article)} min read</span>{preview && <span>Draft preview</span>}</div><h1>{article.title || 'Your post title'}</h1><p>{article.excerpt || 'Your short description appears here.'}</p></div><div className="journal-post-art"><BlogCover article={article}/></div></header><article className="journal-body" aria-label={article.title || 'Post preview'}>{article.sections.map((s,i)=><section id={`guide-${i+1}`} key={i}><span className="journal-section-number" aria-hidden="true">{String(i+1).padStart(2,'0')}</span><h2>{s.heading || 'Section heading'}</h2>{s.paragraphs.length ? s.paragraphs.map((p,j)=><p key={j}>{p}</p>) : <p>Your section content appears here.</p>}</section>)}</article></>;
}
