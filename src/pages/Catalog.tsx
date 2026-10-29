import { useState } from 'react';
import { normalize } from '../services/content';
import ArtistCard from '../components/ArtistCard';
import { useCms } from '../cms/CmsContext';
import { EditButton } from '../cms/EditControls';
import { textAlignmentStyle } from '../services/textFormatting';
export default function Catalog() {
 const {content} = useCms(); const {artists,decades,site}=content;
 const [query,setQuery] = useState(''); const [decade,setDecade] = useState('all');
 const filtered = artists.filter(a => (decade === 'all' || a.decade === decade) && normalize(a.name).includes(normalize(query.trim())));
 return <section className="section cms-edit-host"><p className="eyebrow">{site.catalogPage.eyebrow}</p><h2 style={textAlignmentStyle(site, 'catalog.pageTitle')}>{site.catalogPage.title}</h2><p className="reading" style={textAlignmentStyle(site, 'catalog.pageDescription')}>{site.catalogPage.description}</p><EditButton target={{collection:'site',section:'catalog',label:'página do catálogo'}}/>
 <div className="catalog-controls"><label>Buscar artista<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Nome do artista"/></label><label>Década<select value={decade} onChange={e => setDecade(e.target.value)}><option value="all">Todas as décadas</option>{decades.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}</select></label><button className="reset-button" onClick={() => {setQuery('');setDecade('all')}}>Limpar filtros</button></div>
 <p className="results-count" role="status">{filtered.length} {filtered.length === 1 ? 'perfil encontrado' : 'perfis encontrados'}</p><div className="artist-grid">{filtered.map((a,i) => <ArtistCard key={a.id} artist={a} index={i} destination="catalog"/>)}</div>{!filtered.length && <p className="empty-state">Nenhum artista encontrado. Tente outro nome ou limpe os filtros.</p>}
 {site.catalogPage.references.length > 0 && <aside className="catalog-references"><p className="eyebrow">PESQUISA / REFERÊNCIAS</p><h3>Referências do catálogo</h3><ol>{site.catalogPage.references.map(reference => <li key={reference.id}>{reference.url ? <a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.label}</a> : reference.label}</li>)}</ol></aside>}
 </section>;
}
