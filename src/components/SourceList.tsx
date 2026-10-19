import { useCms } from '../cms/CmsContext';
import { EditButton } from '../cms/EditControls';
import { textAlignmentStyle } from '../services/textFormatting';
export default function SourceList({ ids }: { ids: string[] }) {
 const {content}=useCms(); const {sources}=content;
 const selected = sources.filter(s => ids.includes(s.id));
 return <aside className="sources" id="fontes"><p className="eyebrow">PESQUISA / REFERÊNCIAS</p><h3>Fontes consultadas</h3>{selected.map(s => <div className="cms-source-host" key={s.id}><p>{s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" style={textAlignmentStyle(s, 'title')}>{s.title}</a> : <strong style={textAlignmentStyle(s, 'title')}>{s.title}</strong>}<span style={textAlignmentStyle(s, 'credit')}>{s.credit}</span></p><EditButton target={{collection:'sources',id:s.id,label:s.title}}/></div>)}</aside>;
}
