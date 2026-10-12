import { LogIn, LogOut, Pencil, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCms } from './CmsContext';
import EditorPanel from './EditorPanel';

export function CmsAccountButton() {
  const { authenticated, checkingSession, openLogin, logout } = useCms();
  if (checkingSession) return <span className="cms-account-loading" aria-label="Verificando acesso">...</span>;
  if (!authenticated) return <button className="cms-login-trigger" type="button" onClick={openLogin}><LogIn size={17}/> Entrar</button>;
  return <div className="cms-account"><span><Pencil size={15}/> Editando</span><button type="button" onClick={() => void logout()} title="Sair do modo de edição" aria-label="Sair do modo de edição"><LogOut size={17}/></button></div>;
}

function LoginModal() {
  const { loginOpen, closeLogin, login, enterLocalPreview } = useCms();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (!loginOpen) return null;
  const submit = async () => {
    setLoading(true); setError('');
    try { await login(email, password); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Não foi possível entrar.'); }
    finally { setLoading(false); }
  };
  return <div className="cms-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !loading) closeLogin(); }}><div className="cms-login-modal" role="dialog" aria-modal="true" aria-labelledby="cms-login-title"><button type="button" className="cms-icon-button cms-modal-close" onClick={closeLogin} title="Fechar" aria-label="Fechar"><X/></button><p className="eyebrow">ACESSO EDITORIAL</p><h2 id="cms-login-title">Entrar no modo de edição</h2><p>Use a conta administrativa configurada para este museu.</p><form onSubmit={event => { event.preventDefault(); void submit(); }}><label className="cms-field"><span>E-mail</span><input type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)}/></label><label className="cms-field"><span>Senha</span><input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)}/></label>{error && <p className="cms-error" role="alert">{error}</p>}<button className="cms-save-button" type="submit" disabled={loading}><LogIn size={17}/>{loading ? 'Entrando...' : 'Entrar'}</button>{import.meta.env.DEV && <button className="cms-secondary-button cms-preview-login" type="button" onClick={enterLocalPreview}>Abrir prévia local</button>}</form></div></div>;
}

function Notice() {
  const { notice, clearNotice } = useCms();
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(clearNotice, 5500);
    return () => window.clearTimeout(timeout);
  }, [clearNotice, notice]);
  return notice ? <div className="cms-notice" role="status"><span>{notice}</span><button type="button" onClick={clearNotice} title="Fechar aviso" aria-label="Fechar aviso"><X size={16}/></button></div> : null;
}

export default function CmsChrome() {
  return <><LoginModal/><EditorPanel/><Notice/></>;
}
