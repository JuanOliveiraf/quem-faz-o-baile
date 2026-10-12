import { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ArtistDetail from './pages/ArtistDetail';
import Women from './pages/Women';
import TopicDetail from './pages/TopicDetail';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import { artists, topics, site } from './services/content';
function RouteEffects() {
 const {pathname,hash} = useLocation();
 useEffect(() => {const artist=artists.find(a=>pathname===`/artistas/${a.slug}`);const topic=topics.find(t=>pathname===`/olhares/${t.id}`);const title=artist?.name??topic?.title??(pathname==='/catalogo'?'Catálogo':pathname==='/mulheres'?'Mulheres no funk':'');document.title=title?`${title} | ${site.title}`:site.title;
 if(hash){requestAnimationFrame(()=>document.getElementById(hash.slice(1))?.scrollIntoView());}else{window.scrollTo(0,0);} },[pathname,hash]);return null;
}
export default function App() {return <><RouteEffects/><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><header><Link className="brand" to="/">QUEM FAZ<br/><span>O BAILE</span><i>CONHEÇA O GRAVE</i></Link><nav aria-label="Navegação principal"><Link to="/#cronologia">Cronologia</Link><Link to="/mulheres">Mulheres</Link><Link to="/#olhares">Olhares</Link><Link to="/catalogo">Catálogo</Link></nav><Link className="visit" to="/catalogo">Explorar o acervo</Link></header><main id="conteudo"><Routes><Route path="/" element={<Home/>}/><Route path="/catalogo" element={<Catalog/>}/><Route path="/artistas/:slug" element={<ArtistDetail/>}/><Route path="/mulheres" element={<Women/>}/><Route path="/olhares/:id" element={<TopicDetail/>}/><Route path="/admin" element={<Admin/>}/><Route path="*" element={<NotFound/>}/></Routes></main><footer><Link className="brand" to="/">QUEM FAZ<br/><span>O BAILE</span></Link><p>Projeto Omnia · FAPCOM · 2026<br/>Memória, cultura e expressão.</p><p className="footer-note">Seleção e textos iniciais baseados na proposta do grupo.<br/>Painel visual: referências reunidas pelo grupo Omnia.<br/>Biografias, curadoria e créditos individuais em preparação.</p></footer></>}
