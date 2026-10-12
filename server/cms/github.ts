import type { ContentBundle, ContentCollection } from '../../src/types/content';

const paths: Record<ContentCollection, string> = {
  artists: 'src/data/artists.json',
  works: 'src/data/works.json',
  decades: 'src/data/decades.json',
  topics: 'src/data/topics.json',
  sources: 'src/data/sources.json',
  site: 'src/data/site.json'
};

type GitHubFile = { content: string; encoding: string };
type GitRef = { object: { sha: string } };
type GitCommit = { tree: { sha: string } };

function config() {
  return {
    owner: process.env.CMS_GITHUB_OWNER || 'JuanOliveiraf',
    repo: process.env.CMS_GITHUB_REPO || 'quem-faz-o-baile',
    branch: process.env.CMS_GITHUB_BRANCH || 'main',
    token: process.env.CMS_GITHUB_TOKEN || ''
  };
}

async function github<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { token } = config();
  if (!token) throw new Error('Configuração ausente: CMS_GITHUB_TOKEN');
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...init.headers
    }
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub respondeu ${response.status}: ${body.slice(0, 300)}`);
  }
  return response.json() as Promise<T>;
}

function repoPath(path: string) {
  const { owner, repo } = config();
  return `/repos/${owner}/${repo}${path}`;
}

async function headSha() {
  const { branch } = config();
  const ref = await github<GitRef>(repoPath(`/git/ref/heads/${encodeURIComponent(branch)}`));
  return ref.object.sha;
}

async function readJsonFile<T>(path: string) {
  const { branch } = config();
  const file = await github<GitHubFile>(repoPath(`/contents/${path}?ref=${encodeURIComponent(branch)}`));
  if (file.encoding !== 'base64') throw new Error(`Codificação inesperada em ${path}.`);
  return JSON.parse(Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf8')) as T;
}

export async function loadContentBundle() {
  const [sha, artists, works, decades, topics, sources, site] = await Promise.all([
    headSha(),
    readJsonFile<ContentBundle['artists']>(paths.artists),
    readJsonFile<ContentBundle['works']>(paths.works),
    readJsonFile<ContentBundle['decades']>(paths.decades),
    readJsonFile<ContentBundle['topics']>(paths.topics),
    readJsonFile<ContentBundle['sources']>(paths.sources),
    readJsonFile<ContentBundle['site']>(paths.site)
  ]);
  return { sha, bundle: { artists, works, decades, topics, sources, site } satisfies ContentBundle };
}

export type MediaUpload = { path: string; contentBase64: string };

export async function commitContent(changes: Partial<ContentBundle>, baseSha: string, media?: MediaUpload) {
  const currentSha = await headSha();
  if (currentSha !== baseSha) {
    const conflict = new Error('O acervo mudou desde que esta edição foi aberta. Recarregue os dados antes de salvar.');
    conflict.name = 'ContentConflict';
    throw conflict;
  }

  const currentCommit = await github<GitCommit>(repoPath(`/git/commits/${currentSha}`));
  const entries = Object.entries(changes) as Array<[ContentCollection, ContentBundle[ContentCollection]]>;
  const tree = await Promise.all(entries.map(async ([collection, data]) => {
    const jsonContent = `${JSON.stringify(data, null, 2)}\n`;
    const jsonBlob = await github<{ sha: string }>(repoPath('/git/blobs'), {
      method: 'POST',
      body: JSON.stringify({ content: Buffer.from(jsonContent).toString('base64'), encoding: 'base64' })
    });
    return { path: paths[collection], mode: '100644', type: 'blob', sha: jsonBlob.sha };
  }));
  if (media) {
    const mediaBlob = await github<{ sha: string }>(repoPath('/git/blobs'), {
      method: 'POST',
      body: JSON.stringify({ content: media.contentBase64, encoding: 'base64' })
    });
    tree.push({ path: media.path, mode: '100644', type: 'blob', sha: mediaBlob.sha });
  }

  const nextTree = await github<{ sha: string }>(repoPath('/git/trees'), {
    method: 'POST',
    body: JSON.stringify({ base_tree: currentCommit.tree.sha, tree })
  });
  const commit = await github<{ sha: string }>(repoPath('/git/commits'), {
    method: 'POST',
    body: JSON.stringify({ message: entries.length === 1 ? `cms: atualiza ${entries[0][0]}` : 'cms: atualiza conteúdo relacionado', tree: nextTree.sha, parents: [currentSha] })
  });
  const { branch } = config();
  await github(repoPath(`/git/refs/heads/${encodeURIComponent(branch)}`), {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha, force: false })
  });
  return commit.sha;
}
