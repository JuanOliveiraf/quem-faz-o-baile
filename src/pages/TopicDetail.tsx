import { useParams, Link } from 'react-router-dom';
import SourceList from '../components/SourceList';
import NotFound from './NotFound';
import { useCms } from '../cms/CmsContext';
import { EditButton } from '../cms/EditControls';
export default function TopicDetail() {const {content}=useCms();const {id}=useParams();const topic=content.topics.find(t=>t.id===id);if(!topic)return <NotFound/>;return <section className="section detail-page cms-edit-host"><Link className="text-link" to="/#olhares">Voltar aos olhares</Link><p className="eyebrow detail-tag">ACERVO DE PESQUISAS</p><h2>{topic.title}</h2><p className="lead reading">{topic.subtitle}</p><div className="reading">{topic.text.map((p,i)=><p key={i}>{p}</p>)}</div><h3 className="subheading">Perguntas que orientam o percurso</h3><ul className="research-questions">{topic.questions.map(q=><li key={q}>{q}</li>)}</ul><SourceList ids={topic.sourceIds}/><EditButton target={{collection:'topics',id:topic.id,label:topic.title}}/></section>}
