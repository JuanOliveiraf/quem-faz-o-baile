import { Plus, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Artist, Channel, ContentBundle, Decade, SiteContent, Source, TextAlignment, Topic, Work } from '../types/content';
import { getTextAlignment, getTextColor, withTextAlignment, withTextColor } from '../services/textFormatting';
import { useCms, type EditorTarget, type MediaDraft } from './CmsContext';
import { AddFieldButton, CheckboxGroup, ImageUpload, ReorderField, SelectField, StringListField, TextArea, TextField, ToggleField, imageFileToDraft } from './FormFields';

type EditableValue = Artist | Work | Decade | Topic | Source | SiteContent;

function selectedValue(content: ContentBundle, target: EditorTarget): EditableValue | null {
  if (target.collection === 'site') return content.site;
  const rows = content[target.collection] as Array<{ id: string }>;
  return rows.find(row => row.id === target.id) as EditableValue | null;
}

const decadeOptions = [
  { value: '1990', label: '1990s' }, { value: '2000', label: '2000s' },
  { value: '2010', label: '2010s' }, { value: '2020', label: '2020s' }
];

const experienceCountWords = ['ZERO', 'UMA', 'DUAS', 'TRÊS', 'QUATRO', 'CINCO', 'SEIS'];

function renumberChannels(channels: Channel[]): Channel[] {
  return channels.map((channel, index) => {
    const name = channel.label.replace(/^\s*\d+\s*\/\s*/, '').trim();
    return { ...channel, label: `${String(index + 1).padStart(2, '0')} / ${name}`.trimEnd() };
  });
}

function updateExperienceCount(eyebrow: string, count: number): string {
  const amount = experienceCountWords[count] || String(count);
  const noun = count === 1 ? 'EXPERIÊNCIA' : 'EXPERIÊNCIAS';
  return eyebrow.replace(/,\s*[^,]+\s+EXPERIÊNCIAS?\s*$/i, `, ${amount} ${noun}`);
}

function SiteFields({ draft, setDraft, section, setMedia, previewUrl, setPreviewUrl }: { draft: SiteContent; setDraft: (value: SiteContent) => void; section?: string; setMedia: (media: MediaDraft | undefined) => void; previewUrl?: string; setPreviewUrl: (url: string) => void }) {
  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => setDraft({ ...draft, [key]: value });
  const format = (key: string) => ({ alignment: getTextAlignment(draft, key), onAlignmentChange: (alignment: TextAlignment) => setDraft(withTextAlignment(draft, key, alignment)), color: getTextColor(draft, key), onColorChange: (color?: string) => setDraft(withTextColor(draft, key, color)) });
  const current = section || 'general';
  if (current === 'navigation') return <>
    <p className="cms-form-note">Edite os nomes exibidos no cabeçalho. O destino de cada link permanece protegido.</p>
    <TextField label="Cronologia" value={draft.navigation.timeline} onChange={value => update('navigation', { ...draft.navigation, timeline: value })}/>
    <TextField label="Mulheres" value={draft.navigation.women} onChange={value => update('navigation', { ...draft.navigation, women: value })}/>
    <TextField label="Olhares" value={draft.navigation.topics} onChange={value => update('navigation', { ...draft.navigation, topics: value })}/>
    <TextField label="Catálogo" value={draft.navigation.catalog} onChange={value => update('navigation', { ...draft.navigation, catalog: value })}/>
  </>;
  if (current === 'hero') return <>
    <TextField label="Identificação" value={draft.hero.eyebrow} onChange={value => update('hero', { ...draft.hero, eyebrow: value })}/>
    <StringListField label="Linhas do título" values={draft.hero.titleLines} onChange={value => update('hero', { ...draft.hero, titleLines: value })} itemLabel="Linha" {...format('hero.title')}/>
    <TextField label="Palavra em destaque" value={draft.hero.accent} onChange={value => update('hero', { ...draft.hero, accent: value })}/>
    <TextArea label="Texto de abertura" value={draft.hero.intro} onChange={value => update('hero', { ...draft.hero, intro: value })} {...format('hero.intro')}/>
    <TextField label="Texto do botão" value={draft.hero.ctaLabel} onChange={value => update('hero', { ...draft.hero, ctaLabel: value })}/>
    <TextField label="Linha informativa" value={draft.hero.meta} onChange={value => update('hero', { ...draft.hero, meta: value })}/>
    <ImageUpload label="Imagem principal" currentUrl={draft.hero.imageUrl} previewUrl={previewUrl} onFile={file => { void imageFileToDraft(file, 'hero', 'site').then(result => { setMedia(result.media); setPreviewUrl(result.previewUrl); update('hero', { ...draft.hero, imageUrl: result.publicUrl }); }).catch(reason => window.alert(reason.message)); }}/>
    <TextArea label="Texto alternativo da imagem" value={draft.hero.imageAlt} onChange={value => update('hero', { ...draft.hero, imageAlt: value })}/>
    <TextField label="Crédito da imagem" value={draft.hero.imageCredit} onChange={value => update('hero', { ...draft.hero, imageCredit: value })}/>
    <StringListField label="Linhas do selo" values={draft.hero.stickerLines} onChange={value => update('hero', { ...draft.hero, stickerLines: value })} itemLabel="Linha"/>
    <TextField label="Texto da faixa animada" value={draft.ribbonText} onChange={value => update('ribbonText', value)}/>
  </>;
  if (current === 'timeline') return <>
    <TextField label="Identificação" value={draft.timelineSection.eyebrow} onChange={value => update('timelineSection', { ...draft.timelineSection, eyebrow: value })}/>
    <StringListField label="Linhas do título" values={draft.timelineSection.titleLines} onChange={value => update('timelineSection', { ...draft.timelineSection, titleLines: value })} itemLabel="Linha" {...format('timeline.title')}/>
    <StringListField label="Linhas da descrição" values={draft.timelineSection.descriptionLines} onChange={value => update('timelineSection', { ...draft.timelineSection, descriptionLines: value })} itemLabel="Linha" {...format('timeline.description')}/>
    <TextArea label="Nota curatorial" value={draft.timelineSection.note} onChange={value => update('timelineSection', { ...draft.timelineSection, note: value })} {...format('timeline.note')}/>
  </>;
  if (current === 'women') return <>
    <TextField label="Identificação" value={draft.womenSection.eyebrow} onChange={value => update('womenSection', { ...draft.womenSection, eyebrow: value })}/>
    <StringListField label="Linhas do título" values={draft.womenSection.titleLines} onChange={value => update('womenSection', { ...draft.womenSection, titleLines: value })} itemLabel="Linha" {...format('women.title')}/>
    <TextField label="Chamada" value={draft.womenSection.lead} onChange={value => update('womenSection', { ...draft.womenSection, lead: value })} {...format('women.lead')}/>
    <TextArea label="Introdução" value={draft.womenIntro} onChange={value => update('womenIntro', value)} {...format('women.intro')}/>
    <StringListField label="Legenda da estatística na página inicial" values={draft.womenSection.statLabelLines} onChange={value => update('womenSection', { ...draft.womenSection, statLabelLines: value })} itemLabel="Linha" {...format('women.stat')}/>
  </>;
  if (current === 'topics') return <>
    <TextField label="Identificação" value={draft.topicsSection.eyebrow} onChange={value => update('topicsSection', { ...draft.topicsSection, eyebrow: value })}/>
    <StringListField label="Linhas do título" values={draft.topicsSection.titleLines} onChange={value => update('topicsSection', { ...draft.topicsSection, titleLines: value })} itemLabel="Linha" {...format('topics.title')}/>
    <StringListField label="Linhas da descrição" values={draft.topicsSection.descriptionLines} onChange={value => update('topicsSection', { ...draft.topicsSection, descriptionLines: value })} itemLabel="Linha" {...format('topics.description')}/>
  </>;
  if (current === 'catalog') {
    const updateReference = (index: number, reference: SiteContent['catalogPage']['references'][number]) => update('catalogPage', { ...draft.catalogPage, references: draft.catalogPage.references.map((item, currentIndex) => currentIndex === index ? reference : item) });
    const removeReference = (index: number) => update('catalogPage', { ...draft.catalogPage, references: draft.catalogPage.references.filter((_, currentIndex) => currentIndex !== index) });
    const addReference = () => update('catalogPage', { ...draft.catalogPage, references: [...draft.catalogPage.references, { id: `catalogo-${Date.now().toString(36)}`, label: 'Nova referência', url: null }] });
    return <>
      <TextField label="Identificação" value={draft.catalogSection.eyebrow} onChange={value => update('catalogSection', { ...draft.catalogSection, eyebrow: value })}/>
      <StringListField label="Linhas do título" values={draft.catalogSection.titleLines} onChange={value => update('catalogSection', { ...draft.catalogSection, titleLines: value })} itemLabel="Linha" {...format('catalog.title')}/>
      <TextArea label="Descrição" value={draft.catalogSection.description} onChange={value => update('catalogSection', { ...draft.catalogSection, description: value })} {...format('catalog.description')}/>
      <TextField label="Texto do botão" value={draft.catalogSection.ctaLabel} onChange={value => update('catalogSection', { ...draft.catalogSection, ctaLabel: value })}/>
      <TextField label="Título da página do catálogo" value={draft.catalogPage.title} onChange={value => update('catalogPage', { ...draft.catalogPage, title: value })} {...format('catalog.pageTitle')}/>
      <TextArea label="Descrição da página do catálogo" value={draft.catalogPage.description} onChange={value => update('catalogPage', { ...draft.catalogPage, description: value })} {...format('catalog.pageDescription')}/>
      {draft.catalogPage.references.map((reference, index) => <fieldset className="cms-fieldset cms-subgroup" key={reference.id}><legend>Referência {index + 1}</legend><div className="cms-subgroup-heading"><strong>{reference.label || 'Sem identificação'}</strong><button type="button" className="cms-delete-button" onClick={() => removeReference(index)}><Trash2 size={16}/> Excluir referência</button></div><TextArea label="Referência" value={reference.label} onChange={value => updateReference(index, { ...reference, label: value })}/><TextField label="URL (opcional)" type="url" value={reference.url || ''} onChange={value => updateReference(index, { ...reference, url: value || null })}/></fieldset>)}
      <button type="button" className="cms-secondary-button" onClick={addReference}><Plus size={16}/> Adicionar referência</button>
    </>;
  }
  if (current === 'about') {
    const updateChannel = (index: number, channel: Channel) => update('aboutSection', { ...draft.aboutSection, channels: draft.aboutSection.channels.map((item, currentIndex) => currentIndex === index ? channel : item) });
    const setChannels = (channels: Channel[]) => update('aboutSection', {
      ...draft.aboutSection,
      eyebrow: updateExperienceCount(draft.aboutSection.eyebrow, channels.length),
      channels: renumberChannels(channels)
    });
    const removeChannel = (index: number) => setChannels(draft.aboutSection.channels.filter((_, currentIndex) => currentIndex !== index));
    const addChannel = () => setChannels([...draft.aboutSection.channels, {
      id: `canal-${Date.now().toString(36)}`,
      label: 'NOVA EXPERIÊNCIA',
      title: 'Nova experiência',
      text: '',
      linkLabel: null,
      linkUrl: null
    }]);
    const labels = Object.fromEntries(draft.aboutSection.channels.map(channel => [channel.id, channel.title]));
    return <>
      <TextField label="Identificação" value={draft.aboutSection.eyebrow} onChange={value => update('aboutSection', { ...draft.aboutSection, eyebrow: value })}/>
      <StringListField label="Linhas do título" values={draft.aboutSection.titleLines} onChange={value => update('aboutSection', { ...draft.aboutSection, titleLines: value })} itemLabel="Linha" {...format('about.title')}/>
      {draft.aboutSection.channels.length > 1 && <ReorderField label="Ordem das experiências" ids={draft.aboutSection.channels.map(channel => channel.id)} labels={labels} onChange={ids => setChannels(ids.map(id => draft.aboutSection.channels.find(channel => channel.id === id)!))}/>}
      {draft.aboutSection.channels.map((channel, index) => { const channelFormat = (key: string) => ({ alignment: getTextAlignment(channel, key), onAlignmentChange: (alignment: TextAlignment) => updateChannel(index, withTextAlignment(channel, key, alignment)), color: getTextColor(channel, key), onColorChange: (color?: string) => updateChannel(index, withTextColor(channel, key, color)) }); return <fieldset className="cms-fieldset cms-subgroup" key={channel.id}><legend>Experiência {index + 1}</legend><div className="cms-subgroup-heading"><strong>{channel.title || 'Sem título'}</strong><button type="button" className="cms-delete-button" onClick={() => removeChannel(index)}><Trash2 size={16}/> Excluir experiência</button></div><TextField label="Identificação" value={channel.label} onChange={value => updateChannel(index, { ...channel, label: value })}/><TextField label="Título" value={channel.title} onChange={value => updateChannel(index, { ...channel, title: value })} {...channelFormat('title')}/><TextArea label="Texto" value={channel.text} onChange={value => updateChannel(index, { ...channel, text: value })} {...channelFormat('text')}/><TextField label="Texto do link" value={channel.linkLabel || ''} onChange={value => updateChannel(index, { ...channel, linkLabel: value || null })}/><TextField label="URL do link" type="url" value={channel.linkUrl || ''} onChange={value => updateChannel(index, { ...channel, linkUrl: value || null })}/></fieldset>; })}
      <button type="button" className="cms-secondary-button" onClick={addChannel}><Plus size={16}/> Adicionar experiência</button>
    </>;
  }
  if (current === 'footer') return <>
    <TextField label="Projeto" value={draft.footer.project} onChange={value => update('footer', { ...draft.footer, project: value })} {...format('footer.project')}/>
    <TextField label="Assinatura" value={draft.footer.tagline} onChange={value => update('footer', { ...draft.footer, tagline: value })} {...format('footer.tagline')}/>
    <StringListField label="Notas" values={draft.footer.notes} onChange={value => update('footer', { ...draft.footer, notes: value })} itemLabel="Nota" {...format('footer.notes')}/>
  </>;
  return <>
    <TextField label="Título do site" value={draft.title} onChange={value => update('title', value)}/>
    <TextField label="Instagram" type="url" value={draft.instagramUrl} onChange={value => update('instagramUrl', value)}/>
    <TextField label="Nome da playlist" value={draft.playlistTitle} onChange={value => update('playlistTitle', value)}/>
    <TextField label="URL da playlist" type="url" value={draft.playlistUrl || ''} onChange={value => update('playlistUrl', value || null)}/>
  </>;
}

function EditorForm({ target }: { target: EditorTarget }) {
  const { content, saveChanges, saving, closeEditor } = useCms();
  const original = selectedValue(content, target);
  const [draft, setDraft] = useState<EditableValue | null>(() => original ? structuredClone(original) : null);
  const [media, setMedia] = useState<MediaDraft>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [error, setError] = useState('');
  const [opened, setOpened] = useState<string[]>([]);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  if (!draft) return null;
  const isOpen = (key: string, value: string) => value.trim() !== '' || opened.includes(key);
  const openField = (key: string) => setOpened([...opened, key]);
  const closeField = (key: string) => setOpened(opened.filter(item => item !== key));
  const format = (key: string) => ({ alignment: getTextAlignment(draft, key), onAlignmentChange: (alignment: TextAlignment) => setDraft(withTextAlignment(draft, key, alignment)), color: getTextColor(draft, key), onColorChange: (color?: string) => setDraft(withTextColor(draft, key, color)) });

  const save = async () => {
    setError('');
    try {
      if (target.collection === 'site') {
        await saveChanges({ site: draft as SiteContent }, media);
        return;
      }
      if (target.collection === 'artists') {
        const artist = { ...(draft as Artist), paragraphs: (draft as Artist).paragraphs.filter(text => text.trim()) };
        const artists = content.artists.map(item => item.id === artist.id ? artist : item);
        const works = content.works.map(work => {
          const selected = artist.workIds.includes(work.id);
          return { ...work, artistIds: selected ? [...new Set([...work.artistIds, artist.id])] : work.artistIds.filter(id => id !== artist.id) };
        });
        await saveChanges({ artists, works }, media);
        return;
      }
      if (target.collection === 'works') {
        const work = draft as Work;
        const works = content.works.map(item => item.id === work.id ? work : item);
        const artists = content.artists.map(artist => {
          const selected = work.artistIds.includes(artist.id);
          return { ...artist, workIds: selected ? [...new Set([...artist.workIds, work.id])] : artist.workIds.filter(id => id !== work.id) };
        });
        await saveChanges({ works, artists });
        return;
      }
      const rows = content[target.collection] as Array<{ id: string }>;
      const saved = target.collection === 'topics' ? { ...(draft as Topic), text: (draft as Topic).text.filter(text => text.trim()), questions: (draft as Topic).questions.filter(text => text.trim()) } : draft;
      const next = rows.map(row => row.id === target.id ? saved : row);
      await saveChanges({ [target.collection]: next } as Partial<ContentBundle>);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível salvar.');
    }
  };

  let fields: React.ReactNode;
  if (target.collection === 'site') {
    fields = <SiteFields draft={draft as SiteContent} setDraft={setDraft} section={target.section} setMedia={setMedia} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl}/>;
  } else if (target.collection === 'artists') {
    const artist = draft as Artist;
    fields = <>
      <TextField label="ID" value={artist.id} readOnly onChange={() => undefined} help="O ID conecta este perfil ao restante do acervo."/>
      <TextField label="Nome" value={artist.name} onChange={value => setDraft({ ...artist, name: value })} {...format('name')}/>
      <SelectField label="Década" value={artist.decade} options={decadeOptions} onChange={() => undefined} disabled help="A década é protegida porque também define a sala cronológica deste perfil."/>
      {isOpen('kind', artist.kind)
        ? <TextField label="Tipo" value={artist.kind} onChange={value => setDraft({ ...artist, kind: value })} onRemove={() => { closeField('kind'); setDraft({ ...artist, kind: '' }); }}/>
        : <AddFieldButton label="Tipo" onAdd={() => openField('kind')}/>}
      {isOpen('summary', artist.summary)
        ? <TextArea label="Resumo" value={artist.summary} onChange={value => setDraft({ ...artist, summary: value })} onRemove={() => { closeField('summary'); setDraft({ ...artist, summary: '' }); }} {...format('summary')}/>
        : <AddFieldButton label="Resumo" onAdd={() => openField('summary')}/>}
      <StringListField label="Biografia" values={artist.paragraphs} onChange={value => setDraft({ ...artist, paragraphs: value })} itemLabel="Parágrafo" allowEmpty {...format('paragraphs')}/>
      <SelectField label="Estado editorial" value={artist.editorialStatus} options={[{ value: 'inicial', label: 'Inicial' }, { value: 'pesquisado', label: 'Pesquisado' }, { value: 'revisado', label: 'Revisado' }]} onChange={value => setDraft({ ...artist, editorialStatus: value as Artist['editorialStatus'] })}/>
      <ToggleField label="Destacar em Mulheres no Funk" checked={artist.womenHighlight} onChange={value => setDraft({ ...artist, womenHighlight: value })}/>
      <SelectField label="Música do perfil" value={artist.workIds[0] || ''} options={content.works.map(work => ({ value: work.id, label: work.title }))} onChange={value => setDraft({ ...artist, workIds: [value] })}/>
      <CheckboxGroup label="Fontes" values={content.sources.map(source => ({ value: source.id, label: source.title }))} selected={artist.sourceIds} onChange={value => setDraft({ ...artist, sourceIds: value })}/>
      <TextField label="Instagram" type="url" value={artist.instagramUrl || ''} onChange={value => setDraft({ ...artist, instagramUrl: value || null })}/>
      <TextField label="YouTube" type="url" value={artist.youtubeUrl || ''} onChange={value => setDraft({ ...artist, youtubeUrl: value || null })}/>
      {artist.image && <><ImageUpload label="Foto do perfil" currentUrl={artist.image.url} previewUrl={previewUrl} onFile={file => { void imageFileToDraft(file, artist.id).then(result => { setMedia(result.media); setPreviewUrl(result.previewUrl); setDraft({ ...artist, image: { ...artist.image!, url: result.publicUrl } }); }).catch(reason => setError(reason.message)); }}/><TextArea label="Texto alternativo" value={artist.image.alt} onChange={value => setDraft({ ...artist, image: { ...artist.image!, alt: value } })}/><TextArea label="Crédito da imagem" value={artist.image.credit} onChange={value => setDraft({ ...artist, image: { ...artist.image!, credit: value } })}/></>}
    </>;
  } else if (target.collection === 'works') {
    const work = draft as Work;
    fields = <>
      <TextField label="ID" value={work.id} readOnly onChange={() => undefined}/>
      <TextField label="Título" value={work.title} onChange={value => setDraft({ ...work, title: value })} {...format('title')}/>
      <SelectField label="Década" value={work.decade} options={decadeOptions} onChange={value => setDraft({ ...work, decade: value as Work['decade'] })}/>
      <TextField label="Tipo" value={work.type} onChange={value => setDraft({ ...work, type: value })}/>
      <TextArea label="Contexto" value={work.context} onChange={value => setDraft({ ...work, context: value })} {...format('context')}/>
      <SelectField label="Perfil relacionado" value={work.artistIds[0] || ''} options={content.artists.map(artist => ({ value: artist.id, label: artist.name }))} onChange={value => setDraft({ ...work, artistIds: [value] })}/>
      <CheckboxGroup label="Fontes" values={content.sources.map(source => ({ value: source.id, label: source.title }))} selected={work.sourceIds} onChange={value => setDraft({ ...work, sourceIds: value })}/>
      <ToggleField label="Conteúdo explícito" checked={work.explicit} onChange={value => setDraft({ ...work, explicit: value })}/>
      <TextField label="ID do vídeo no YouTube" value={work.youtube.id} onChange={value => setDraft({ ...work, youtube: { ...work.youtube, id: value } })} help="Use os 11 caracteres que aparecem depois de v= na URL do vídeo."/>
      <TextField label="Rótulo do vídeo" value={work.youtube.label} onChange={value => setDraft({ ...work, youtube: { ...work.youtube, label: value } })}/>
    </>;
  } else if (target.collection === 'decades') {
    const decade = draft as Decade;
    fields = <><TextField label="Década" value={decade.id} readOnly onChange={() => undefined}/><TextField label="Rótulo" value={decade.label} onChange={value => setDraft({ ...decade, label: value })}/><TextField label="Título" value={decade.title} onChange={value => setDraft({ ...decade, title: value })} {...format('title')}/><TextArea label="Descrição" value={decade.description} onChange={value => setDraft({ ...decade, description: value })} {...format('description')}/><ReorderField label="Ordem dos quatro artistas" ids={decade.artistIds} labels={Object.fromEntries(content.artists.map(artist => [artist.id, artist.name]))} onChange={value => setDraft({ ...decade, artistIds: value })}/></>;
  } else if (target.collection === 'topics') {
    const topic = draft as Topic;
    fields = <><TextField label="ID" value={topic.id} readOnly onChange={() => undefined}/><TextField label="Título" value={topic.title} onChange={value => setDraft({ ...topic, title: value })} {...format('title')}/>{isOpen('subtitle', topic.subtitle) ? <TextArea label="Pergunta de abertura" value={topic.subtitle} onChange={value => setDraft({ ...topic, subtitle: value })} onRemove={() => { closeField('subtitle'); setDraft({ ...topic, subtitle: '' }); }} {...format('subtitle')}/> : <AddFieldButton label="Pergunta de abertura" onAdd={() => openField('subtitle')}/>}<StringListField label="Texto" values={topic.text} onChange={value => setDraft({ ...topic, text: value })} itemLabel="Parágrafo" allowEmpty {...format('text')}/><StringListField label="Perguntas" values={topic.questions} onChange={value => setDraft({ ...topic, questions: value })} itemLabel="Pergunta" allowEmpty {...format('questions')}/><CheckboxGroup label="Fontes" values={content.sources.map(source => ({ value: source.id, label: source.title }))} selected={topic.sourceIds} onChange={value => setDraft({ ...topic, sourceIds: value })}/></>;
  } else {
    const source = draft as Source;
    fields = <><TextField label="ID" value={source.id} readOnly onChange={() => undefined}/><TextField label="Título" value={source.title} onChange={value => setDraft({ ...source, title: value })} {...format('title')}/><TextArea label="Crédito bibliográfico" value={source.credit} onChange={value => setDraft({ ...source, credit: value })} {...format('credit')}/><TextField label="URL" type="url" value={source.url || ''} onChange={value => setDraft({ ...source, url: value || null })}/></>;
  }

  return <div className="cms-panel-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !saving) closeEditor(); }}><aside className="cms-panel" role="dialog" aria-modal="true" aria-labelledby="cms-editor-title"><header><div><span>EDIÇÃO VISUAL</span><h2 id="cms-editor-title">{target.label}</h2></div><button type="button" className="cms-icon-button" onClick={closeEditor} disabled={saving} title="Fechar" aria-label="Fechar editor"><X/></button></header><form onSubmit={event => { event.preventDefault(); void save(); }}><div className="cms-panel-body">{fields}{error && <p className="cms-error" role="alert">{error}</p>}</div><footer><button type="button" className="cms-secondary-button" onClick={closeEditor} disabled={saving}>Cancelar</button><button type="submit" className="cms-save-button" disabled={saving}><Save size={17}/>{saving ? 'Salvando...' : 'Salvar e publicar'}</button></footer></form></aside></div>;
}

export default function EditorPanel() {
  const { editor } = useCms();
  return editor ? <EditorForm key={`${editor.collection}:${editor.id || editor.section || 'root'}`} target={editor}/> : null;
}
