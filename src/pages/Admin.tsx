import { useEffect } from 'react';

const CMS_URL = 'https://app.pagescms.org';

export default function Admin() {
  useEffect(() => {
    window.location.replace(CMS_URL);
  }, []);

  return (
    <section className="section detail-page">
      <p className="eyebrow">CMS / ACERVO</p>
      <h1 className="detail-title">Abrindo o painel.</h1>
      <a className="button" href={CMS_URL}>Entrar no CMS</a>
    </section>
  );
}
