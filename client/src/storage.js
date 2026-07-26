import { fetchFile, saveFile } from './github';
import { getToken } from './auth';

// 매 저장 전에 매번 GitHub에서 새로 읽어오면 왕복이 늘어나 느려지므로,
// 마지막으로 알고 있는 파일 상태(sha 포함)를 캐싱해두고 재사용한다.
// 캐시가 낡아서 충돌(409)이 나면 EntityManager의 재시도 로직이 강제로
// 다시 읽어오도록(forceRefresh) 만든다.
let cache = null;

async function load(forceRefresh = false) {
  if (cache && !forceRefresh) return cache;
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');
  cache = await fetchFile(token);
  return cache;
}

async function save(data, sha, message) {
  const token = getToken();
  const newSha = await saveFile(token, data, sha, message);
  cache = { data, sha: newSha };
}

function nowStamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function nextId(list) {
  return list.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

const RESOURCE_TABLES = {
  characters: 'characters',
  'world-entries': 'world_entries',
  episodes: 'episodes',
  factions: 'factions',
};

const RESOURCE_LABELS = {
  characters: '캐릭터',
  'world-entries': '세계관',
  episodes: '연재 기록',
  factions: '세력',
};

function tableFor(resource) {
  const key = RESOURCE_TABLES[resource];
  if (!key) throw new Error(`Unknown resource: ${resource}`);
  return key;
}

function labelOf(item) {
  return item.name ?? item.title ?? `#${item.id}`;
}

export async function listItems(resource, forceRefresh = false) {
  const { data } = await load(forceRefresh);
  const table = tableFor(resource);
  return [...data[table]].sort((a, b) => b.id - a.id);
}

export async function getItem(resource, id) {
  const { data } = await load();
  const table = tableFor(resource);
  return data[table].find((item) => String(item.id) === String(id));
}

export async function createItem(resource, payload, forceRefresh = false) {
  const { data, sha } = await load(forceRefresh);
  const table = tableFor(resource);
  const stamp = nowStamp();
  const item = { id: nextId(data[table]), ...payload, created_at: stamp, updated_at: stamp };
  data[table].push(item);
  await save(data, sha, `${RESOURCE_LABELS[resource]} 추가: ${labelOf(item)}`);
  return item;
}

export async function updateItem(resource, id, payload, forceRefresh = false) {
  const { data, sha } = await load(forceRefresh);
  const table = tableFor(resource);
  const index = data[table].findIndex((item) => String(item.id) === String(id));
  if (index === -1) return null;
  const updated = { ...data[table][index], ...payload, updated_at: nowStamp() };
  data[table][index] = updated;
  await save(data, sha, `${RESOURCE_LABELS[resource]} 수정: ${labelOf(updated)}`);
  return updated;
}

export async function deleteItem(resource, id, forceRefresh = false) {
  const { data, sha } = await load(forceRefresh);
  const table = tableFor(resource);
  const target = data[table].find((item) => String(item.id) === String(id));
  data[table] = data[table].filter((item) => String(item.id) !== String(id));
  await save(data, sha, `${RESOURCE_LABELS[resource]} 삭제: ${target ? labelOf(target) : id}`);
}

export async function exportData() {
  const { data } = await load();
  return JSON.stringify(data, null, 2);
}

export async function importData(jsonString) {
  const { sha } = await load();
  const parsed = JSON.parse(jsonString);
  await save(parsed, sha, 'JSON 가져오기로 전체 데이터 교체');
}
