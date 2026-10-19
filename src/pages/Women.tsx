import { Link } from 'react-router-dom';
import SourceList from '../components/SourceList';
import { useCms } from '../cms/CmsContext';
import { EditButton } from '../cms/EditControls';
import { textAlignmentStyle } from '../services/textFormatting';
export default function Women() {
 const {content}=useCms(); const {artists,site}=content;
 const women = artists.filter(a => a.womenHighlight);
 const decadeCount = new Set(women.map(artist => artist.decade)).size;
 const workCount = new Set(women.flatMap(artist => artist.workIds)).size;
 const stats = [
  { value: women.length, ...site.womenPage.stats[0] },
  { value: decadeCount, ...site.womenPage.stats[1] },
  { value: workCount, ...site.womenPage.stats[2] }
 ];
 return <><section className="section women-hero cms-edit-host"><div className="women-hero-copy"><p className="eyebrow">{site.womenPage.eyebrow}</p><h1 style={textAlignmentStyle(site, 'women.pageTitle')}>{site.womenTitle}</h1><p className="lead" style={textAlignmentStyle(site, 'women.intro')}>{site.womenIntro}</p></div><dl className="women-stats" aria-label="Números da exposição">{stats.map(stat => <div className="women-stat-item" key={stat.id}><dt>{stat.value}</dt><dd><strong>{stat.label}</strong><span>{stat.detail}</span></dd></div>)}</dl><EditButton target={{collection:'site',section:'women',label:'exposição Mulheres no Funk'}}/></section><section className="section women-directory cms-edit-host"><div className="women-directory-head"><div><p className="eyebrow">{site.womenPage.directoryEyebrow}</p><h2 style={textAlignmentStyle(site, 'women.directoryTitle')}>{site.womenPage.directoryTitle}</h2></div><p style={textAlignmentStyle(site, 'women.editorialNote')}>{site.womenEditorialNote}</p></div><div className="women-list">{women.map((artist,i) => <div className="cms-list-host" key={artist.id}><Link className="woman-row" to={`/artistas/${artist.slug}`}><span className="woman-index">{String(i + 1).padStart(2,'0')}</span>{artist.image && <img className="woman-row-photo" src={artist.image.url} alt="" loading="lazy"/>}<div><h3 style={textAlignmentStyle(artist, 'name')}>{artist.name}</h3><p style={textAlignmentStyle(artist, 'summary')}>{artist.summary}</p></div><span className="woman-meta">{artist.decade}s · {artist.kind}</span><b aria-hidden="true">↗</b></Link><EditButton target={{collection:'artists',id:artist.id,label:artist.name}}/></div>)}</div><SourceList ids={['projeto','azmina','empoderamento']}/><EditButton target={{collection:'site',section:'women',label:'cabeçalho da lista de artistas'}}/></section></>;
}
