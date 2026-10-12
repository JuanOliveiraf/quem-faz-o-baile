import { ArrowLeft, ArrowRight, Pencil } from 'lucide-react';
import { useCms, type EditorTarget } from './CmsContext';

export function EditButton({ target, className = '' }: { target: EditorTarget; className?: string }) {
  const { authenticated, openEditor } = useCms();
  if (!authenticated) return null;
  return <button className={`cms-edit-button ${className}`} type="button" onClick={event => { event.preventDefault(); event.stopPropagation(); openEditor(target); }} title={`Editar ${target.label}`} aria-label={`Editar ${target.label}`}><Pencil size={16}/></button>;
}

export function ReorderControls({ decadeId, artistId, index, total }: { decadeId: string; artistId: string; index: number; total: number }) {
  const { authenticated, moveArtist, saving } = useCms();
  if (!authenticated) return null;
  return <div className="cms-reorder" aria-label="Alterar posição do card">
    <button type="button" disabled={saving || index === 0} onClick={event => { event.preventDefault(); event.stopPropagation(); void moveArtist(decadeId, artistId, -1); }} title="Mover para a esquerda" aria-label="Mover para a esquerda"><ArrowLeft size={15}/></button>
    <button type="button" disabled={saving || index === total - 1} onClick={event => { event.preventDefault(); event.stopPropagation(); void moveArtist(decadeId, artistId, 1); }} title="Mover para a direita" aria-label="Mover para a direita"><ArrowRight size={15}/></button>
  </div>;
}
