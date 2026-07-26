const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/characters', routes.characters);
app.use('/api/world-entries', routes.worldEntries);
app.use('/api/episodes', routes.episodes);
app.use('/api/factions', routes.factions);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`설정집 서버 실행 중: http://localhost:${PORT}`);
});
