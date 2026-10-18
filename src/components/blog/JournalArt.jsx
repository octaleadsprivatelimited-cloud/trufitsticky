export default function JournalArt({ visual = 'start' }) {
  return <svg className={`journal-art journal-art-${visual}`} viewBox="0 0 400 230" fill="none" aria-hidden="true">
    <circle cx="334" cy="36" r="108" fill="currentColor" opacity=".06"/><circle cx="48" cy="218" r="110" fill="currentColor" opacity=".05"/>
    <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      {visual === 'calendar' ? <><rect x="126" y="47" width="150" height="142" rx="17" fill="white"/><path d="M126 89h150M165 36v25m72-25v25"/>{[0,1,2].map(r => [0,1,2].map(c => <rect key={`${r}-${c}`} x={150+c*35} y={108+r*24} width="13" height="10" rx="3" fill="currentColor" opacity={r===1&&c===1?1:.2}/>))}<path d="m257 152 12 12 28-31" strokeWidth="7"/></> :
      visual === 'plate' ? <><circle cx="208" cy="116" r="75" fill="white"/><circle cx="208" cy="116" r="53" opacity=".35"/><path d="M99 59v58m-13-58v32q13 20 26 0V59m-13 58v60M311 59c-19 18-20 47 0 51v67M208 63v53l45 27"/><path d="M175 112q21-34 34-25-5 39-34 25Z" fill="currentColor" opacity=".2"/></> :
      visual === 'plans' ? <><rect x="84" y="72" width="101" height="119" rx="15" fill="white"/><rect x="207" y="41" width="110" height="150" rx="15" fill="white"/><path d="M106 102h36m-36 24h56m-56 22h40m83-72h57m-57 25h35m-35 25h57m-57 25h40" opacity=".5"/><path d="m280 165 9 9 19-24"/></> :
      visual === 'checkin' ? <><path d="M113 51h179a16 16 0 0 1 16 16v89a16 16 0 0 1-16 16h-98l-48 29v-29h-33a16 16 0 0 1-16-16V67a16 16 0 0 1 16-16Z" fill="white"/><path d="m130 110 26 23 41-47" strokeWidth="7"/><path d="M224 91h48m-48 27h36m-132 35h144" opacity=".4"/></> :
      visual === 'together' ? <><circle cx="159" cy="76" r="26" fill="white"/><circle cx="245" cy="76" r="26" fill="white"/><path d="M109 183v-38a50 50 0 0 1 100 0v38M196 183v-38a50 50 0 0 1 100 0v38" fill="white"/><path d="m182 136 20 18 21-18"/></> :
      <><path d="M98 184h204M126 183v-35h49v-39h49V70h52v113" fill="white"/><path d="m119 105 41-37 37 7 62-43m-22 0h22v22"/><circle cx="300" cy="91" r="14" opacity=".25"/></>}
    </g>
    <path d="M57 77h18m-9-9v18M325 179h14m-7-7v14" stroke="currentColor" strokeWidth="3" opacity=".45"/>
  </svg>;
}
