import { Link, useParams } from 'react-router-dom';
import SourceList from '../components/SourceList';
import NotFound from './NotFound';
import { useCms } from '../cms/CmsContext';
import { EditButton } from '../cms/EditControls';
import { textAlignmentStyle } from '../services/textFormatting';
export default function ArtistDetail() {
 const { content } = useCms(); const {artists}=content;
 const { slug } = useParams(); const artist = artists.find(a => a.slug === slug); if(!artist) return <NotFound/>;
 const hasSources = content.sources.some(source => artist.sourceIds.includes(source.id));
 return <section className="section detail-page cms-edit-host"><Link className="text-link" to="/#cronologia">Voltar à cronologia</Link><p className="eyebrow detail-tag">PESQUISA / {artist.decade}s{artist.kind.trim() && ` · ${artist.kind.toUpperCase()}`}</p><h1 className="detail-title" style={textAlignmentStyle(artist, 'name')}>{artist.name}</h1>{artist.summary.trim() && <p className="detail-summary" style={textAlignmentStyle(artist, 'summary')}>{artist.summary}</p>}<EditButton target={{collection:'artists',id:artist.id,label:artist.name}}/>
 {artist.image && <figure><img className="detail-photo" src={artist.image.url} alt={artist.image.alt}/><figcaption>{artist.image.credit}</figcaption></figure>}
 {artist.editorialStatus === 'inicial' && <p className="editorial-note"><strong>Conteúdo ainda não pesquisado.</strong> Este texto registra apenas a seleção do projeto e não deve ser tratado como biografia.</p>}
 {artist.editorialStatus === 'pesquisado' && <p className="editorial-note"><strong>Perfil pesquisado.</strong> O texto foi elaborado a partir das {hasSources ? <a href="#fontes">fontes listadas ao final da página</a> : 'fontes da pesquisa'} e ainda aguarda a revisão editorial do grupo.</p>}
 {artist.paragraphs.length > 0 && <><h2 className="subheading">Trajetória pesquisada</h2><div className="reading" style={textAlignmentStyle(artist, 'paragraphs')}>{artist.paragraphs.map((text,i) => <p key={i}>{text}</p>)}</div></>}
 <div className="external-links">{artist.instagramUrl && <a className="button" href={artist.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram do artista</a>}<Link className="button" to={`/acervo/${artist.slug}`}>Conhecer catálogo do artista</Link></div>
 <SourceList ids={artist.sourceIds}/>
 </section>;
}
