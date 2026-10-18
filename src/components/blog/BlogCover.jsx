import { useEffect, useState } from 'react';
import { readCoverAsset } from '../../blog/images.mjs';
import JournalArt from './JournalArt';
export default function BlogCover({ article, priority = false }) {
  const id=article.coverImage?.id;
  const [image,setImage]=useState(null);
  useEffect(()=>{
    if(!id) return;
    let cancelled=false, url;
    readCoverAsset(id).then(blob=>{
      if(cancelled || !blob) return;
      url=URL.createObjectURL(blob);setImage({id,url});
    }).catch(()=>{/* Keep the illustration if this browser's image is unavailable. */});
    return ()=>{cancelled=true;if(url)URL.revokeObjectURL(url);};
  },[id]);
  return id && image?.id===id ? <img className="journal-cover-image" src={image.url} alt={article.coverImage.alt || 'Blog cover preview'} width={article.coverImage.width} height={article.coverImage.height} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':undefined}/> : <JournalArt visual={article.visual}/>;
}
