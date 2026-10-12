import { useState, useRef } from 'react';
import { decades, getArtist } from '../services/content';
import ArtistCard from './ArtistCard';
export default function Timeline() {
 const [index, setIndex] = useState(0); const buttons = useRef<(HTMLButtonElement | null)[]>([]); const decade = decades[index];
 function onKey(event: React.KeyboardEvent, i: number) { let next: number | undefined; if(event.key === 'ArrowRight') next = (i + 1) % decades.length; if(event.key === 'ArrowLeft') next = (i - 1 + decades.length) % decades.length; if(event.key === 'Home') next = 0; if(event.key === 'End') next = decades.length - 1; if(next !== undefined) { event.preventDefault(); setIndex(next); buttons.current[next]?.focus(); } }
 return <section id="cronologia" className="timeline section"><div className="section-heading"><div><p className="eyebrow">01 / PERCURSO HISTÓRICO</p><h2>Um gênero.<br/>Muitas gerações.</h2></div><p>Escolha uma década.<br/>Conheça os nomes selecionados pelo grupo.</p></div>
 <div className="decades" role="tablist" aria-label="Décadas do acervo">{decades.map((d,i) => <button ref={el => { buttons.current[i] = el; }} key={d.id} role="tab" id={`decade-${d.id}`} aria-controls="decade-panel" aria-selected={index === i} tabIndex={index === i ? 0 : -1} onClick={() => setIndex(i)} onKeyDown={e => onKey(e,i)}>{d.label}</button>)}</div>
 <div role="tabpanel" id="decade-panel" aria-labelledby={`decade-${decade.id}`}><div className="decade-panel"><div className="year" aria-hidden="true">{decade.id}</div><div><p className="eyebrow">SALA / {decade.label}</p><h3>{decade.title}</h3><p>{decade.description}</p><p className="small">Seleção curatorial do projeto; as trajetórias podem atravessar várias décadas.</p></div></div><div className="artist-grid timeline-artists">{decade.artistIds.map((id,i) => { const artist = getArtist(id); return artist ? <ArtistCard key={id} artist={artist} index={i}/> : null; })}</div></div>
 </section>;
}
