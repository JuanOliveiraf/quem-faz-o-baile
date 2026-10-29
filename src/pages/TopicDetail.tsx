import { useParams, Link } from 'react-router-dom';
import SourceList from '../components/SourceList';
import NotFound from './NotFound';
import { useCms } from '../cms/CmsContext';
import { EditButton } from '../cms/EditControls';
import { textAlignmentStyle } from '../services/textFormatting';
export default function TopicDetail() {const {content}=useCms();const {id}=useParams();const topic=content.topics.find(t=>t.id===id);if(!topic)return <NotFound/>;return <section className="section detail-page cms-edit-host"><Link className="text-link" to="/#olhares">Voltar aos olhares</Link><p className="eyebrow detail-tag">ACERVO DE PESQUISAS</p><h2 style={textAlignmentStyle(topic, 'title')}>{topic.title}</h2>{topic.subtitle.trim() && <p className="lead reading" style={textAlignmentStyle(topic, 'subtitle')}>{topic.subtitle}</p>}{topic.text.length > 0 && <div className="reading" style={textAlignmentStyle(topic, 'text')}>{topic.text.map((p,i)=><p key={i}>{p}</p>)}</div>}{topic.questions.length > 0 && <><h3 className="subheading">Perguntas que orientam o percurso</h3><ul className="research-questions" style={textAlignmentStyle(topic, 'questions')}>{topic.questions.map((q,i)=><li key={i}>{q}</li>)}</ul></>}<SourceList ids={topic.sourceIds}/><EditButton target={{collection:'topics',id:topic.id,label:topic.title}}/></section>}
