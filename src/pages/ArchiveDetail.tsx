import { Link, useParams } from 'react-router-dom';
import { useCms } from '../cms/CmsContext';
import { EditButton } from '../cms/EditControls';
import MusicPlayer from '../components/MusicPlayer';
import SourceList from '../components/SourceList';
import { getArtistWorks } from '../services/content';
import { textAlignmentStyle } from '../services/textFormatting';
import NotFound from './NotFound';

export default function ArchiveDetail() {
  const { content } = useCms();
  const { artists, works } = content;
  const { slug } = useParams();
  const artist = artists.find(item => item.slug === slug);
  if (!artist) return <NotFound/>;
  const tracks = getArtistWorks(artist, works);
  const sourceIds = [...new Set(tracks.flatMap(work => work.sourceIds))];

  return <section className="section detail-page archive-detail cms-edit-host">
    <Link className="text-link" to="/catalogo">Voltar ao catálogo</Link>
    <p className="eyebrow detail-tag">ACERVO / {artist.decade}s · {artist.kind.toUpperCase()}</p>
    <h1 className="detail-title" style={textAlignmentStyle(artist, 'name')}>{artist.name}</h1>
    <EditButton target={{ collection: 'artists', id: artist.id, label: artist.name }}/>
    {artist.image && <figure><img className="detail-photo" src={artist.image.url} alt={artist.image.alt}/><figcaption>{artist.image.credit}</figcaption></figure>}
    <dl className="archive-facts"><div><dt>Década</dt><dd>{artist.decade}s</dd></div><div><dt>Formato</dt><dd>{artist.kind}</dd></div><div><dt>Obras disponíveis</dt><dd>{tracks.length}</dd></div></dl>
    <div className="external-links">{artist.instagramUrl && <a className="button" href={artist.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram do artista</a>}{artist.youtubeUrl && <a className="button" href={artist.youtubeUrl} target="_blank" rel="noopener noreferrer">Canal no YouTube</a>}</div>
    <h2 className="subheading">Obras no acervo</h2>
    {tracks.length ? tracks.map(work => <div className="cms-edit-host" key={work.id}><MusicPlayer work={work}/><EditButton target={{ collection: 'works', id: work.id, label: work.title }}/></div>) : <p className="empty-state">A seleção musical deste artista está em preparação.</p>}
    {sourceIds.length > 0 && <SourceList ids={sourceIds}/>}
  </section>;
}
