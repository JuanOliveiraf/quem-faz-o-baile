import { useState } from 'react';
import { artists, decades, normalize } from '../services/content';
import ArtistCard from '../components/ArtistCard';
export default function Catalog() {
 const [query,setQuery] = useState(''); const [decade,setDecade] = useState('all');
 const filtered = artists.filter(a => (decade === 'all' || a.decade === decade) && normalize(a.name).includes(normalize(query.trim())));
 return <section className="section"><p className="eyebrow">CATÁLOGO / TODO O ACERVO</p><h2>Artistas, vozes e encontros.</h2><p className="reading">Encontre um perfil para conhecer o recorte do projeto e acessar as músicas e links disponíveis.</p>
 <div className="catalog-controls"><label>Buscar artista<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Nome do artista"/></label><label>Década<select value={decade} onChange={e => setDecade(e.target.value)}><option value="all">Todas as décadas</option>{decades.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}</select></label><button className="reset-button" onClick={() => {setQuery('');setDecade('all')}}>Limpar filtros</button></div>
 <p className="results-count" role="status">{filtered.length} {filtered.length === 1 ? 'perfil encontrado' : 'perfis encontrados'}</p><div className="artist-grid">{filtered.map((a,i) => <ArtistCard key={a.id} artist={a} index={i}/>)}</div>{!filtered.length && <p className="empty-state">Nenhum artista encontrado. Tente outro nome ou limpe os filtros.</p>}
 </section>;
}
