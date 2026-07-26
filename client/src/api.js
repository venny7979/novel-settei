const BASE = 'http://localhost:4000/api';

export async function listItems(resource) {
  const res = await fetch(`${BASE}/${resource}`);
  return res.json();
}

export async function getItem(resource, id) {
  const res = await fetch(`${BASE}/${resource}/${id}`);
  return res.json();
}

export async function createItem(resource, data) {
  const res = await fetch(`${BASE}/${resource}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateItem(resource, id, data) {
  const res = await fetch(`${BASE}/${resource}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteItem(resource, id) {
  await fetch(`${BASE}/${resource}/${id}`, { method: 'DELETE' });
}
