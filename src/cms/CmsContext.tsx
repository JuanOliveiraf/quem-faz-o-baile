import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ContentBundle, ContentCollection } from '../types/content';
import { initialContent } from '../services/content';

export type EditorTarget = { collection: ContentCollection; id?: string; section?: string; label: string };
export type MediaDraft = { path: string; contentBase64: string };

type CmsContextValue = {
  content: ContentBundle;
  authenticated: boolean;
  checkingSession: boolean;
  localPreview: boolean;
  loginOpen: boolean;
  editor: EditorTarget | null;
  saving: boolean;
  notice: string | null;
  openLogin: () => void;
  closeLogin: () => void;
  login: (email: string, password: string) => Promise<void>;
  enterLocalPreview: () => void;
  logout: () => Promise<void>;
  openEditor: (target: EditorTarget) => void;
  closeEditor: () => void;
  saveChanges: (changes: Partial<ContentBundle>, media?: MediaDraft) => Promise<void>;
  saveCollection: <K extends ContentCollection>(collection: K, data: ContentBundle[K], media?: MediaDraft) => Promise<void>;
  moveArtist: (decadeId: string, artistId: string, direction: -1 | 1) => Promise<void>;
  clearNotice: () => void;
};

const CmsContext = createContext<CmsContextValue | null>(null);

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers }
  });
  const body = await response.json().catch(() => ({})) as { error?: string; details?: string[] } & T;
  if (!response.ok) {
    const detail = body.details?.length ? ` ${body.details.join(' ')}` : '';
    throw new Error(`${body.error || 'Não foi possível concluir a operação.'}${detail}`);
  }
  return body;
}

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentBundle>(() => structuredClone(initialContent));
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [localPreview, setLocalPreview] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [editor, setEditor] = useState<EditorTarget | null>(null);
  const [saving, setSaving] = useState(false);
  const [headSha, setHeadSha] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const loadLatest = useCallback(async () => {
    const latest = await api<{ sha: string; bundle: ContentBundle }>('/api/cms/content');
    setContent(latest.bundle);
    setHeadSha(latest.sha);
  }, []);

  useEffect(() => {
    if (import.meta.env.DEV && sessionStorage.getItem('qfb-cms-preview') === '1') {
      setAuthenticated(true);
      setLocalPreview(true);
      setCheckingSession(false);
      return;
    }
    api<{ authenticated: boolean }>('/api/cms/session')
      .then(async result => {
        if (result.authenticated) {
          setAuthenticated(true);
          await loadLatest();
        }
      })
      .catch(() => undefined)
      .finally(() => setCheckingSession(false));
  }, [loadLatest]);

  const login = useCallback(async (email: string, password: string) => {
    await api('/api/cms/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    await loadLatest();
    setAuthenticated(true);
    setLoginOpen(false);
    setNotice('Modo de edição ativado.');
  }, [loadLatest]);

  const enterLocalPreview = useCallback(() => {
    if (!import.meta.env.DEV) return;
    sessionStorage.setItem('qfb-cms-preview', '1');
    setLocalPreview(true);
    setAuthenticated(true);
    setLoginOpen(false);
    setNotice('Prévia local ativada. As alterações não serão publicadas.');
  }, []);

  const logout = useCallback(async () => {
    if (localPreview) sessionStorage.removeItem('qfb-cms-preview');
    else await api('/api/cms/logout', { method: 'POST', body: '{}' }).catch(() => undefined);
    setAuthenticated(false);
    setLocalPreview(false);
    setEditor(null);
    setContent(structuredClone(initialContent));
    setNotice('Você saiu do modo de edição.');
  }, [localPreview]);

  const saveChanges = useCallback(async (changes: Partial<ContentBundle>, media?: MediaDraft) => {
    setSaving(true);
    try {
      if (localPreview) {
        setContent(current => ({ ...current, ...structuredClone(changes) }));
        setNotice('Alteração aplicada somente na prévia local.');
      } else {
        const result = await api<{ sha: string }>('/api/cms/content', {
          method: 'PUT',
          body: JSON.stringify({ changes, baseSha: headSha, media })
        });
        setContent(current => ({ ...current, ...structuredClone(changes) }));
        setHeadSha(result.sha);
        setNotice('Alteração salva. A publicação na Vercel foi iniciada.');
      }
      setEditor(null);
    } finally {
      setSaving(false);
    }
  }, [headSha, localPreview]);

  const saveCollection = useCallback(async <K extends ContentCollection>(collection: K, data: ContentBundle[K], media?: MediaDraft) => {
    await saveChanges({ [collection]: data } as Partial<ContentBundle>, media);
  }, [saveChanges]);

  const moveArtist = useCallback(async (decadeId: string, artistId: string, direction: -1 | 1) => {
    const next = structuredClone(content.decades);
    const decade = next.find(item => item.id === decadeId);
    if (!decade) return;
    const index = decade.artistIds.indexOf(artistId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= decade.artistIds.length) return;
    [decade.artistIds[index], decade.artistIds[target]] = [decade.artistIds[target], decade.artistIds[index]];
    await saveCollection('decades', next);
  }, [content.decades, saveCollection]);

  const value = useMemo<CmsContextValue>(() => ({
    content, authenticated, checkingSession, localPreview, loginOpen, editor, saving, notice,
    openLogin: () => setLoginOpen(true),
    closeLogin: () => setLoginOpen(false),
    login, enterLocalPreview, logout,
    openEditor: setEditor,
    closeEditor: () => setEditor(null),
    saveChanges, saveCollection, moveArtist,
    clearNotice: () => setNotice(null)
  }), [authenticated, checkingSession, content, editor, enterLocalPreview, localPreview, login, loginOpen, logout, moveArtist, notice, saveChanges, saveCollection, saving]);

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const value = useContext(CmsContext);
  if (!value) throw new Error('useCms precisa estar dentro de CmsProvider.');
  return value;
}
