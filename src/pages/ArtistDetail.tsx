import { Link, useParams } from 'react-router-dom';
import { getArtistWorks } from '../services/content';
import MusicPlayer from '../components/MusicPlayer';
import SourceList from '../components/SourceList';
import NotFound from './NotFound';
import { useCms } from '../cms/CmsContext';
import { EditButton } from '../cms/EditControls';
export default function ArtistDetail() {
 const { content } = useCms(); const {artists,works}=content;
 const { slug } = useParams(); const artist = artists.find(a => a.slug === slug); if(!artist) return <NotFound/>;
 const tracks = getArtistWorks(artist,works);
 return <section className="section detail-page cms-edit-host"><Link className="text-link" to="/catalogo">Voltar ao catálogo</Link><p className="eyebrow detail-tag">PERFIL / {artist.decade}s · {artist.kind.toUpperCase()}</p><h1 className="detail-title">{artist.name}</h1><p className="detail-summary">{artist.summary}</p><EditButton target={{collection:'artists',id:artist.id,label:artist.name}}/>
 {artist.image && <figure><img className="detail-photo" src={artist.image.url} alt={artist.image.alt}/><figcaption>{artist.image.credit}</figcaption></figure>}
 {artist.editorialStatus === 'inicial' && <p className="editorial-note"><strong>Conteúdo ainda não pesquisado.</strong> Este texto registra apenas a seleção do projeto e não deve ser tratado como biografia.</p>}
 {artist.editorialStatus === 'pesquisado' && <p className="editorial-note"><strong>Perfil pesquisado.</strong> O texto foi elaborado a partir das <a href="#fontes">fontes listadas ao final da página</a> e ainda aguarda a revisão editorial do grupo.</p>}
 <div className="reading">{artist.paragraphs.map((text,i) => <p key={i}>{text}</p>)}</div>
 <div className="external-links">{artist.instagramUrl && <a className="button" href={artist.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram do artista</a>}{artist.youtubeUrl && <a className="button" href={artist.youtubeUrl} target="_blank" rel="noopener noreferrer">Canal no YouTube</a>}{!artist.youtubeUrl && <a className="text-link" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(artist.name)}`} target="_blank" rel="noopener noreferrer">Buscar {artist.name} no YouTube</a>}</div>
 <h2 className="subheading">Ouça o acervo</h2>{tracks.length ? tracks.map(w => <div className="cms-edit-host" key={w.id}><MusicPlayer work={w}/><EditButton target={{collection:'works',id:w.id,label:w.title}}/></div>) : <p className="empty-state">A seleção musical deste perfil está em preparação.</p>}
 <SourceList ids={[...new Set([...artist.sourceIds, ...tracks.flatMap(w => w.sourceIds)])]}/>
 </section>;
}
