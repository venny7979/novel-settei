const express = require('express');
const db = require('./db');

function crudRouter(table, columns, defaults = {}) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const rows = db.prepare(`SELECT * FROM ${table} ORDER BY id DESC`).all();
    res.json(rows);
  });

  router.get('/:id', (req, res) => {
    const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: 'not found' });
    res.json(row);
  });

  router.post('/', (req, res) => {
    const values = columns.map((c) => {
      const v = req.body[c];
      return v === undefined || v === null || v === '' ? defaults[c] ?? null : v;
    });
    const placeholders = columns.map(() => '?').join(', ');
    const result = db
      .prepare(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`)
      .run(...values);
    const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(result.lastInsertRowid);
    res.status(201).json(row);
  });

  router.put('/:id', (req, res) => {
    const values = columns.map((c) => {
      const v = req.body[c];
      return v === undefined || v === null || v === '' ? defaults[c] ?? null : v;
    });
    const setClause = columns.map((c) => `${c} = ?`).join(', ');
    db.prepare(`UPDATE ${table} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(
      ...values,
      req.params.id
    );
    const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: 'not found' });
    res.json(row);
  });

  router.delete('/:id', (req, res) => {
    db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(req.params.id);
    res.status(204).end();
  });

  return router;
}

const characterColumns = [
  'name',
  'aliases',
  'age',
  'status',
  'faction_id',
  'position',
  'specialty',
  'characteristic',
  'personality',
  'skills',
];

const worldEntryColumns = ['category', 'title', 'content', 'tags'];

const factionColumns = ['name', 'leader', 'territory', 'goal', 'description'];

const episodeColumns = [
  'number',
  'title',
  'content',
  'published_date',
  'plot_notes',
  'reader_feedback',
];

module.exports = {
  characters: crudRouter('characters', characterColumns, { status: '생존', skills: '[]' }),
  worldEntries: crudRouter('world_entries', worldEntryColumns),
  episodes: crudRouter('episodes', episodeColumns),
  factions: crudRouter('factions', factionColumns),
};
