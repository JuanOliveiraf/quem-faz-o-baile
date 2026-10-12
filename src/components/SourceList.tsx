import { sources } from '../services/content';
export default function SourceList({ ids }: { ids: string[] }) {
 const selected = sources.filter(s => ids.includes(s.id));
 return <aside className="sources" id="fontes"><p className="eyebrow">PESQUISA / REFERÊNCIAS</p><h3>Fontes consultadas</h3>{selected.map(s => <p key={s.id}>{s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a> : <strong>{s.title}</strong>}<br/><span>{s.credit}</span></p>)}</aside>;
}
