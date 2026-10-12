import { Link } from 'react-router-dom';
import SourceList from '../components/SourceList';
import { artists, site } from '../services/content';
export default function Women() {
 const women = artists.filter(a => a.womenHighlight);
 const decadeCount = new Set(women.map(artist => artist.decade)).size;
 const workCount = new Set(women.flatMap(artist => artist.workIds)).size;
 const stats = [
  { value: women.length, label: 'trajetórias pesquisadas', detail: 'artistas e grupos' },
  { value: decadeCount, label: 'décadas representadas', detail: '2000, 2010 e 2020' },
  { value: workCount, label: 'obras no acervo', detail: 'com player disponível' }
 ];
 return <><section className="section women-hero"><div className="women-hero-copy"><p className="eyebrow">EXPOSIÇÃO / MULHERES NO FUNK</p><h1>{site.womenTitle}</h1><p className="lead">{site.womenIntro}</p></div><dl className="women-stats" aria-label="Números da exposição">{stats.map(stat => <div className="women-stat-item" key={stat.label}><dt>{stat.value}</dt><dd><strong>{stat.label}</strong><span>{stat.detail}</span></dd></div>)}</dl></section><section className="section women-directory"><div className="women-directory-head"><div><p className="eyebrow">AS ARTISTAS / O ACERVO</p><h2>Conheça cada trajetória.</h2></div><p>{site.womenEditorialNote}</p></div><div className="women-list">{women.map((artist,i) => <Link className="woman-row" key={artist.id} to={`/artistas/${artist.slug}`}><span className="woman-index">{String(i + 1).padStart(2,'0')}</span>{artist.image && <img className="woman-row-photo" src={artist.image.url} alt="" loading="lazy"/>}<div><h3>{artist.name}</h3><p>{artist.summary}</p></div><span className="woman-meta">{artist.decade}s · {artist.kind}</span><b aria-hidden="true">↗</b></Link>)}</div><SourceList ids={['projeto','azmina','empoderamento']}/></section></>;
}
