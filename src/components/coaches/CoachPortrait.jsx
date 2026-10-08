import { useState } from 'react';
import SampleFilm from '../../assets/hero-video.mp4';
import './coachPortrait.css';

export default function CoachPortrait({ coach }) {
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const video = coach.video_url || SampleFilm;
  const stop = () => { setActive(false); setReady(false); };
  const preview = event => {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setActive(true);
  };
  return <div className="coach-portrait-media" onPointerEnter={preview} onPointerLeave={stop}>
    {coach.image ? <img src={coach.image} alt={coach.name} loading="lazy" /> :
      <span className="portrait-initials">{coach.name.split(' ').map(name => name[0]).slice(0, 2).join('')}</span>}
    {active && <>
      <video className={ready ? 'is-playing' : ''} src={video} autoPlay muted loop playsInline controls={false}
        disablePictureInPicture preload="none" aria-hidden="true" tabIndex={-1}
        onPlaying={() => setReady(true)} onError={stop} />
      {ready && !coach.video_url && <span className="coach-sample-label">Sample preview</span>}
    </>}
  </div>;
}
