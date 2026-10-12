import { Link } from 'react-router-dom';
import type { Artist } from '../types/content';
export default function ArtistCard({ artist, index = 0 }: { artist: Artist; index?: number }) {
 return <Link className={`artist a${index % 4 + 1}`} to={`/artistas/${artist.slug}`} aria-label={`Conhecer ${artist.name}`}>
  <span className="eyebrow">{artist.kind.toUpperCase()} / {artist.decade}s</span>
  {artist.image && <img className="artist-photo" src={artist.image.url} alt={artist.image.alt} loading="lazy" />}
  <strong>{artist.name}</strong><span className="artist-bottom">Conhecer o perfil <b aria-hidden="true">+</b></span>
 </Link>;
}
