const paths = {
  overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  customers:'M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-4M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  coaches:'M9 18h6M10 21h4M8 11a5 5 0 1 1 8 0l-2 4h-4l-2-4Z',
  blog:'M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8M8 16h6',
  products:'M6 8h12l2 13H4L6 8ZM9 8V6a3 3 0 0 1 6 0v2',
};
export default function WorkspaceIcon({name}) {return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]||paths.overview}/></svg>;}
