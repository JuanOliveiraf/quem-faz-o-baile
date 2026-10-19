import { AlignCenter, AlignJustify, AlignLeft, AlignRight, ArrowDown, ArrowUp, Plus, Trash2, Upload } from 'lucide-react';
import { useId } from 'react';
import type { MediaDraft } from './CmsContext';
import type { TextAlignment } from '../types/content';

type Option = { value: string; label: string };
type FormattingProps = { alignment?: TextAlignment; onAlignmentChange?: (alignment: TextAlignment) => void };

const alignmentOptions = [
  { value: 'left' as const, label: 'Alinhar à esquerda', Icon: AlignLeft },
  { value: 'center' as const, label: 'Centralizar', Icon: AlignCenter },
  { value: 'right' as const, label: 'Alinhar à direita', Icon: AlignRight },
  { value: 'justify' as const, label: 'Justificar', Icon: AlignJustify }
];

function AlignmentToolbar({ value = 'left', onChange }: { value?: TextAlignment; onChange?: (alignment: TextAlignment) => void }) {
  if (!onChange) return null;
  return <div className="cms-alignment-toolbar" role="group" aria-label="Alinhamento do texto">{alignmentOptions.map(({ value: option, label, Icon }) => <button type="button" key={option} aria-pressed={value === option} title={label} aria-label={label} onClick={() => onChange(option)}><Icon size={19}/></button>)}</div>;
}

export function TextField({ label, value, onChange, type = 'text', readOnly = false, help, alignment, onAlignmentChange }: { label: string; value: string; onChange: (value: string) => void; type?: 'text' | 'url'; readOnly?: boolean; help?: string } & FormattingProps) {
  const id = useId();
  return <div className="cms-field"><label htmlFor={id}>{label}</label><AlignmentToolbar value={alignment} onChange={onAlignmentChange}/><input id={id} type={type} value={value} readOnly={readOnly} style={onAlignmentChange ? { textAlign: alignment } : undefined} onChange={event => onChange(event.target.value)}/>{help && <small>{help}</small>}</div>;
}

export function TextArea({ label, value, onChange, rows = 4, alignment, onAlignmentChange }: { label: string; value: string; onChange: (value: string) => void; rows?: number } & FormattingProps) {
  const id = useId();
  return <div className="cms-field"><label htmlFor={id}>{label}</label><AlignmentToolbar value={alignment} onChange={onAlignmentChange}/><textarea id={id} value={value} rows={rows} style={{ textAlign: alignment }} onChange={event => onChange(event.target.value)}/></div>;
}

export function SelectField({ label, value, options, onChange, disabled = false, help }: { label: string; value: string; options: Option[]; onChange: (value: string) => void; disabled?: boolean; help?: string }) {
  return <label className="cms-field"><span>{label}</span><select value={value} disabled={disabled} onChange={event => onChange(event.target.value)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{help && <small>{help}</small>}</label>;
}

export function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="cms-toggle"><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)}/><span>{label}</span></label>;
}

export function StringListField({ label, values, onChange, itemLabel = 'Item', alignment, onAlignmentChange }: { label: string; values: string[]; onChange: (values: string[]) => void; itemLabel?: string } & FormattingProps) {
  const update = (index: number, value: string) => onChange(values.map((item, current) => current === index ? value : item));
  return <fieldset className="cms-fieldset"><legend>{label}</legend><AlignmentToolbar value={alignment} onChange={onAlignmentChange}/>{values.map((value, index) => <div className="cms-list-row" key={index}><textarea aria-label={`${itemLabel} ${index + 1}`} value={value} rows={3} style={{ textAlign: alignment }} onChange={event => update(index, event.target.value)}/><button type="button" className="cms-icon-button" onClick={() => onChange(values.filter((_, current) => current !== index))} disabled={values.length === 1} title="Remover" aria-label={`Remover ${itemLabel.toLowerCase()}`}><Trash2 size={16}/></button></div>)}<button type="button" className="cms-secondary-button" onClick={() => onChange([...values, ''])}><Plus size={16}/> Adicionar {itemLabel.toLowerCase()}</button></fieldset>;
}

export function CheckboxGroup({ label, values, selected, onChange }: { label: string; values: Option[]; selected: string[]; onChange: (selected: string[]) => void }) {
  const toggle = (value: string) => onChange(selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value]);
  return <fieldset className="cms-fieldset"><legend>{label}</legend><div className="cms-checkbox-grid">{values.map(option => <label key={option.value}><input type="checkbox" checked={selected.includes(option.value)} onChange={() => toggle(option.value)}/><span>{option.label}</span></label>)}</div></fieldset>;
}

export function ReorderField({ label, ids, labels, onChange }: { label: string; ids: string[]; labels: Record<string, string>; onChange: (ids: string[]) => void }) {
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    const next = [...ids];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  return <fieldset className="cms-fieldset"><legend>{label}</legend><ol className="cms-order-list">{ids.map((id, index) => <li key={id}><span>{labels[id] || id}</span><div><button type="button" className="cms-icon-button" disabled={index === 0} onClick={() => move(index, -1)} title="Mover para cima" aria-label={`Mover ${labels[id] || id} para cima`}><ArrowUp size={16}/></button><button type="button" className="cms-icon-button" disabled={index === ids.length - 1} onClick={() => move(index, 1)} title="Mover para baixo" aria-label={`Mover ${labels[id] || id} para baixo`}><ArrowDown size={16}/></button></div></li>)}</ol></fieldset>;
}

export async function imageFileToDraft(file: File, id: string, folder = 'artists'): Promise<{ media: MediaDraft; publicUrl: string; previewUrl: string }> {
  if (file.size > 3 * 1024 * 1024) throw new Error('A imagem deve ter no máximo 3 MB.');
  const extension = file.name.split('.').pop()?.toLowerCase().replace('jpeg', 'jpg');
  if (!extension || !['jpg', 'png', 'webp'].includes(extension)) throw new Error('Use uma imagem JPG, PNG ou WebP.');
  const contentBase64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.readAsDataURL(file);
  });
  const filename = `${id}.${extension}`;
  return {
    media: { path: `public/${folder}/${filename}`, contentBase64 },
    publicUrl: `/${folder}/${filename}`,
    previewUrl: URL.createObjectURL(file)
  };
}

export function ImageUpload({ currentUrl, previewUrl, onFile, label = 'Imagem' }: { currentUrl: string; previewUrl?: string; onFile: (file: File) => void; label?: string }) {
  return <label className="cms-image-upload"><span>{label}</span><img src={previewUrl || currentUrl} alt="Prévia da imagem selecionada"/><span className="cms-secondary-button"><Upload size={16}/> Escolher imagem</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => { const file = event.target.files?.[0]; if (file) onFile(file); }}/><small>JPG, PNG ou WebP, até 3 MB.</small></label>;
}
