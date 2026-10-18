import { useEffect, useRef, useState } from 'react';
import { importCoverImage } from '../blog/images.mjs';
import BlogCover from '../components/blog/BlogCover';
export default function CoverImageInput({ article, onChange, onBusy }) {
  const input=useRef(null), requestId=useRef(0);
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  useEffect(()=>()=>{requestId.current+=1;},[]);
  async function upload(event) {
    const file=event.target.files?.[0];event.target.value='';
    if(!file)return;
    const current=++requestId.current;
    setBusy(true);onBusy(true);setError('');
    try {const cover=await importCoverImage(file);if(current===requestId.current) onChange({...cover,alt:article.coverImage?.alt || ''});}
    catch(failure){if(current===requestId.current)setError(failure.message || 'Could not upload this image. Please try again.');}
    finally{if(current===requestId.current){setBusy(false);onBusy(false);}}
  }
  return <section className="workspace-cover-upload" aria-labelledby="cover-upload-title" aria-busy={busy}><h3 id="cover-upload-title">Cover image</h3><p className="team-fine-print">JPG, PNG or WebP · up to 8 MB. Images stay in this browser.</p><input ref={input} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Choose blog cover image" onChange={upload} disabled={busy}/>{article.coverImage && <><div className="workspace-upload-preview"><BlogCover article={article} priority/></div><p className="workspace-cover-filename" title={article.coverImage.name}>{article.coverImage.name}</p></>}<div className="workspace-cover-actions"><button type="button" className="team-button team-button-outline" disabled={busy} onClick={()=>input.current?.click()}>{busy?'Preparing image…':article.coverImage?'Replace image':'Upload cover image'}</button>{article.coverImage&&<button type="button" className="team-text-button" disabled={busy} onClick={()=>{onChange(null);setError('');}}>Remove image</button>}</div>{busy&&<p role="status" className="team-fine-print">Preparing your cover image…</p>}{error&&<p role="alert" className="workspace-cover-error">{error}</p>}{article.coverImage&&<label className="team-field workspace-cover-alt">Image description (alt text)<textarea rows={2} aria-describedby="cover-alt-help" maxLength={240} value={article.coverImage.alt} onChange={event=>onChange({...article.coverImage,alt:event.target.value})} placeholder="Describe what the image shows"/></label>}{article.coverImage&&<p id="cover-alt-help" className="workspace-cover-help">Required when publishing. Helps people using screen readers.</p>}</section>;
}
