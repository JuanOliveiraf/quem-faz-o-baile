import { Link } from 'react-router-dom';
import { EditButton, ReorderControls } from '../cms/EditControls';
import type { Artist } from '../types/content';
export default function ArtistCard({ artist, index = 0, decadeId, total = 0 }: { artist: Artist; index?: number; decadeId?: string; total?: number }) {
 return <div className="cms-card-host artist-host"><Link className={`artist a${index % 4 + 1}`} to={`/artistas/${artist.slug}`} aria-label={`Conhecer ${artist.name}`}>
  <span className="eyebrow">{artist.kind.toUpperCase()} / {artist.decade}s</span>
  {artist.image && <img className="artist-photo" src={artist.image.url} alt={artist.image.alt} loading="lazy" />}
  <strong>{artist.name}</strong><span className="artist-bottom">Conhecer o perfil <b aria-hidden="true">+</b></span>
 </Link><EditButton target={{ collection: 'artists', id: artist.id, label: artist.name }}/>{decadeId && <ReorderControls decadeId={decadeId} artistId={artist.id} index={index} total={total}/>}</div>;
}
