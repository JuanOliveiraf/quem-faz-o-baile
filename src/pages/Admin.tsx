import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useCms } from '../cms/CmsContext';

export default function Admin() {
  const { authenticated, openLogin } = useCms();
  useEffect(() => { if (!authenticated) openLogin(); }, [authenticated, openLogin]);
  return <Navigate to="/" replace/>;
}
