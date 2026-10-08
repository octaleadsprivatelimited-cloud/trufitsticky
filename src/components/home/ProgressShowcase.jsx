import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Film from '../../assets/hero-video.mp4';
import MobileFilm from '../../assets/hero-video-mobile.mp4';
import Poster from '../../assets/hero-video-poster.webp';
import Transformation from '../../assets/transformation-ai-concept.png';
import './progressShowcase.css';

export default function ProgressShowcase() {
  const videoRef = useRef(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [rating, setRating] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const video = videoRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduceMotion && !manuallyPaused.current) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.15 });
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const toggleFilm = () => {
    const video = videoRef.current;
    manuallyPaused.current = !video.paused;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <section className="progress-showcase" aria-label="Movement and everyday progress">
      <div className="progress-film">
        <video ref={videoRef} autoPlay={!reduceMotion} muted loop playsInline preload="metadata" poster={Poster}
          controls={false} disablePictureInPicture tabIndex={-1} aria-hidden="true"
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
          <source src={MobileFilm} media="(max-width: 700px)" type="video/mp4" />
          <source src={Film} type="video/mp4" />
        </video>
        <div className="progress-film-copy"><span>In motion / Tru Fit</span><p>A little better.<br/><em>Every day.</em></p></div>
        <button type="button" className="film-accessible-toggle" onClick={toggleFilm}>
          {playing ? 'Pause background video' : 'Play background video'}
        </button>
      </div>
      <div className="progress-notes">
        <article className="progress-transformation">
          <div className="transformation-heading"><span className="progress-note-label">Beyond the before & after</span></div>
          <figure className="transformation-figure">
            <img src={Transformation} alt="AI-generated concept of the same fictional adult before and after a modest fitness transformation; not a customer result" />
            <figcaption><span>Before</span><span>After</span></figcaption>
          </figure>
          <div className="concept-rating">
            <span>Rate this concept</span>
            <div className="concept-stars" role="group" aria-label="Rate the AI concept image">
              {[1, 2, 3, 4, 5].map(star => <button type="button" key={star} aria-label={`Rate concept ${star} ${star === 1 ? 'star' : 'stars'}`} aria-pressed={rating === star}
                className={star <= rating ? 'is-rated' : ''} onClick={() => setRating(star)}>★</button>)}
            </div>
            <span className="rating-confirmation" aria-live="polite">{rating ? `${rating}/5` : ''}</span>
          </div>
        </article>
        <Link className="progress-note progress-note--lilac" to="/findmycoach"
          data-track="cta_click" data-source="home_next_chapter">
          <span className="progress-note-label">Your next chapter</span>
          <h2>Let’s find<br/><em>your starting point.</em></h2>
          <span className="progress-note-action">Find my coach <span aria-hidden="true">↗</span></span>
        </Link>
      </div>
    </section>
  );
}
