const API = '/api/data';

async function load() {
  const res = await fetch(API);
  return res.json();
}

async function save(store) {
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(store, null, 2),
  });
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

function tableFor(resource) {
  const key = RESOURCE_TABLES[resource];
  if (!key) throw new Error(`Unknown resource: ${resource}`);
  return key;
}

export async function listItems(resource) {
  const store = await load();
  const table = tableFor(resource);
  return [...store[table]].sort((a, b) => b.id - a.id);
}

export async function getItem(resource, id) {
  const store = await load();
  const table = tableFor(resource);
  return store[table].find((item) => String(item.id) === String(id));
}

export async function createItem(resource, data) {
  const store = await load();
  const table = tableFor(resource);
  const stamp = nowStamp();
  const item = { id: nextId(store[table]), ...data, created_at: stamp, updated_at: stamp };
  store[table].push(item);
  await save(store);
  return item;
}

export async function updateItem(resource, id, data) {
  const store = await load();
  const table = tableFor(resource);
  const index = store[table].findIndex((item) => String(item.id) === String(id));
  if (index === -1) return null;
  const updated = { ...store[table][index], ...data, updated_at: nowStamp() };
  store[table][index] = updated;
  await save(store);
  return updated;
}

export async function deleteItem(resource, id) {
  const store = await load();
  const table = tableFor(resource);
  store[table] = store[table].filter((item) => String(item.id) !== String(id));
  await save(store);
}

export async function exportData() {
  const store = await load();
  return JSON.stringify(store, null, 2);
}

export async function importData(jsonString) {
  const parsed = JSON.parse(jsonString);
  await save(parsed);
}
