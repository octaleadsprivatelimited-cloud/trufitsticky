import { useEffect, useState } from 'react';
import { readCoverAsset } from '../../blog/images.mjs';
export default function InlineBlogImage({image,caption=''}) {
  const [asset,setAsset]=useState(null);
  const id=image.id;
  useEffect(()=>{
    let cancelled=false,url;
    readCoverAsset(id).then(blob=>{if(cancelled)return;if(blob)url=URL.createObjectURL(blob);setAsset({id,url});}).catch(()=>{if(!cancelled)setAsset({id,url:null});});
    return ()=>{cancelled=true;if(url)URL.revokeObjectURL(url);};
  },[id]);
  return <figure className="journal-inline-image">{asset?.id===id && asset.url?<img src={asset.url} alt={image.alt || 'Inline image preview'} width={image.width} height={image.height} loading="lazy"/>:<div className="journal-inline-placeholder" role="img" aria-label={image.alt || 'Inline image'}>{asset?.id===id?'Image unavailable in this browser.': 'Loading image…'}</div>}{caption&&<figcaption>{caption}</figcaption>}</figure>;
}
