import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import CmsChrome, { CmsAccountButton } from './cms/CmsChrome';
import { useCms } from './cms/CmsContext';
import { EditButton } from './cms/EditControls';
import ArtistDetail from './pages/ArtistDetail';
import Catalog from './pages/Catalog';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import TopicDetail from './pages/TopicDetail';
import Women from './pages/Women';
import Admin from './pages/Admin';
import { textAlignmentStyle } from './services/textFormatting';

function RouteEffects() {
  const { pathname, hash } = useLocation();
  const { content } = useCms();
  useEffect(() => {
    const artist = content.artists.find(item => pathname === `/artistas/${item.slug}`);
    const topic = content.topics.find(item => pathname === `/olhares/${item.id}`);
    const title = artist?.name ?? topic?.title ?? (pathname === '/catalogo' ? 'Catálogo' : pathname === '/mulheres' ? 'Mulheres no funk' : '');
    document.title = title ? `${title} | ${content.site.title}` : content.site.title;
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    else window.scrollTo(0, 0);
  }, [content.artists, content.site.title, content.topics, hash, pathname]);
  return null;
}

export default function App() {
  const { content } = useCms();
  const { site } = content;
  return <>
    <RouteEffects/>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header>
      <Link className="brand" to="/">QUEM FAZ<br/><span>O BAILE</span><i>CONHEÇA O GRAVE</i></Link>
      <nav aria-label="Navegação principal"><Link to="/#cronologia">Cronologia</Link><Link to="/mulheres">Mulheres</Link><Link to="/#olhares">Olhares</Link><Link to="/catalogo">Catálogo</Link></nav>
      <CmsAccountButton/>
    </header>
    <main id="conteudo"><Routes><Route path="/" element={<Home/>}/><Route path="/catalogo" element={<Catalog/>}/><Route path="/artistas/:slug" element={<ArtistDetail/>}/><Route path="/mulheres" element={<Women/>}/><Route path="/olhares/:id" element={<TopicDetail/>}/><Route path="/admin" element={<Admin/>}/><Route path="*" element={<NotFound/>}/></Routes></main>
    <footer className="cms-edit-host"><Link className="brand" to="/">QUEM FAZ<br/><span>O BAILE</span></Link><div><p style={textAlignmentStyle(site, 'footer.project')}>{site.footer.project}</p><p style={textAlignmentStyle(site, 'footer.tagline')}>{site.footer.tagline}</p></div><p className="footer-note" style={textAlignmentStyle(site, 'footer.notes')}>{site.footer.notes.map(note => <span key={note}>{note}<br/></span>)}</p><EditButton target={{ collection: 'site', section: 'footer', label: 'rodapé' }}/></footer>
    <CmsChrome/>
  </>;
}
