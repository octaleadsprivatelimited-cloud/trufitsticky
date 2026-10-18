import { useEffect, useState } from 'react';
import { BLOG_KEY, BLOG_EVENT, readBlog, writeBlog } from './store.mjs';
export default function useBlog() {
  const [blog, setBlog] = useState(()=>readBlog());
  useEffect(()=>{
    const refresh = event => {if (!event.key || event.key === BLOG_KEY) setBlog(readBlog());};
    window.addEventListener(BLOG_EVENT,refresh); window.addEventListener('storage',refresh);
    return ()=>{window.removeEventListener(BLOG_EVENT,refresh);window.removeEventListener('storage',refresh);};
  },[]);
  return [blog, next=>{writeBlog(next);setBlog(next);}];
}
