import { Link } from 'react-router-dom';
import { readMinutes } from '../../content/blog.mjs';
import BlogCover from './BlogCover';
export default function BlogCard({ article }) {
  return <article className="journal-card"><Link to={`/blog/${article.slug}`}>
    <div className="journal-card-art"><BlogCover article={article}/></div>
    <div className="journal-card-copy"><div className="journal-meta"><span>{article.category}</span><span>{readMinutes(article)} min read</span></div>
      <h3>{article.title}</h3><p>{article.excerpt}</p><span className="journal-read">Read guide</span></div>
  </Link></article>;
}
