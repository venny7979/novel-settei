const OWNER = 'venny7979';
const REPO = 'novel-settei';
const BRANCH = 'main';
const FILE_PATH = 'data/settei.json';

function encodeBase64Utf8(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function decodeBase64Utf8(base64) {
  const binary = atob(base64.replace(/\n/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function githubFetch(token, path, options = {}) {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`GitHub API 오류 (${res.status}): ${body.message ?? res.statusText}`);
  }
  return res.json();
}

export async function fetchFile(token) {
  const json = await githubFetch(token, `/contents/${FILE_PATH}?ref=${BRANCH}`);
  const content = decodeBase64Utf8(json.content);
  return { data: JSON.parse(content), sha: json.sha };
}

export async function saveFile(token, data, sha, message) {
  const content = encodeBase64Utf8(JSON.stringify(data, null, 2));
  const json = await githubFetch(token, `/contents/${FILE_PATH}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content, sha, branch: BRANCH }),
  });
  return json.content.sha;
}
