import { useEffect, useRef, useState } from 'react';
import Film from '../../assets/hero-video.mp4';
import MobileFilm from '../../assets/hero-video-mobile.mp4';
import Poster from '../../assets/hero-video-poster.webp';
import './progressShowcase.css';

export default function ProgressShowcase() {
  const videoRef = useRef(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
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

    </section>
  );
}
