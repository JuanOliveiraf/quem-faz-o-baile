import { useParams, Link } from 'react-router-dom';
import { topics } from '../services/content';
import SourceList from '../components/SourceList';
import NotFound from './NotFound';
export default function TopicDetail() {const {id}=useParams();const topic=topics.find(t=>t.id===id);if(!topic)return <NotFound/>;return <section className="section detail-page"><Link className="text-link" to="/#olhares">Voltar aos olhares</Link><p className="eyebrow detail-tag">ACERVO DE PESQUISAS</p><h2>{topic.title}</h2><p className="lead reading">{topic.subtitle}</p><div className="reading">{topic.text.map((p,i)=><p key={i}>{p}</p>)}</div><h3 className="subheading">Perguntas que orientam o percurso</h3><ul className="research-questions">{topic.questions.map(q=><li key={q}>{q}</li>)}</ul><SourceList ids={topic.sourceIds}/></section>}
