import { useRef, useState } from 'react';
import { useCms } from '../cms/CmsContext';
import { EditButton } from '../cms/EditControls';
import { getArtist } from '../services/content';
import ArtistCard from './ArtistCard';

export default function Timeline() {
  const { content } = useCms();
  const { decades, artists, site } = content;
  const [index, setIndex] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const decade = decades[index] || decades[0];
  function onKey(event: React.KeyboardEvent, current: number) {
    let next: number | undefined;
    if (event.key === 'ArrowRight') next = (current + 1) % decades.length;
    if (event.key === 'ArrowLeft') next = (current - 1 + decades.length) % decades.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = decades.length - 1;
    if (next !== undefined) { event.preventDefault(); setIndex(next); buttons.current[next]?.focus(); }
  }
  if (!decade) return null;
  return <section id="cronologia" className="timeline section cms-edit-host"><div className="section-heading"><div><p className="eyebrow">{site.timelineSection.eyebrow}</p><h2>{site.timelineSection.titleLines.map((line, lineIndex) => <span key={line}>{line}{lineIndex < site.timelineSection.titleLines.length - 1 && <br/>}</span>)}</h2></div><p>{site.timelineSection.descriptionLines.map((line, lineIndex) => <span key={line}>{line}{lineIndex < site.timelineSection.descriptionLines.length - 1 && <br/>}</span>)}</p></div>
    <div className="decades" role="tablist" aria-label="Décadas do acervo">{decades.map((item, itemIndex) => <button ref={element => { buttons.current[itemIndex] = element; }} key={item.id} role="tab" id={`decade-${item.id}`} aria-controls="decade-panel" aria-selected={index === itemIndex} tabIndex={index === itemIndex ? 0 : -1} onClick={() => setIndex(itemIndex)} onKeyDown={event => onKey(event, itemIndex)}>{item.label}</button>)}</div>
    <div role="tabpanel" id="decade-panel" aria-labelledby={`decade-${decade.id}`} className="cms-edit-host"><div className="decade-panel"><div className="year" aria-hidden="true">{decade.id}</div><div><p className="eyebrow">SALA / {decade.label}</p><h3>{decade.title}</h3><p>{decade.description}</p><p className="small">{site.timelineSection.note}</p></div></div><div className="artist-grid timeline-artists">{decade.artistIds.map((id, artistIndex) => { const artist = getArtist(id, artists); return artist ? <ArtistCard key={id} artist={artist} index={artistIndex} decadeId={decade.id} total={decade.artistIds.length}/> : null; })}</div><EditButton target={{ collection: 'decades', id: decade.id, label: `sala ${decade.label}` }}/></div>
    <EditButton target={{ collection: 'site', section: 'timeline', label: 'introdução da cronologia' }}/>
  </section>;
}
