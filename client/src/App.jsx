import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import CharactersPage from './pages/CharactersPage';
import WorldPage from './pages/WorldPage';
import EpisodesPage from './pages/EpisodesPage';
import FactionsPage from './pages/FactionsPage';

export default function App() {
  return (
    <div className="app">
      <nav className="app-nav">
        <div className="app-title">설정집</div>
        <NavLink to="/characters">캐릭터</NavLink>
        <NavLink to="/factions">세력</NavLink>
        <NavLink to="/world">세계관</NavLink>
        <NavLink to="/episodes">연재 기록</NavLink>
      </nav>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/characters" replace />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/factions" element={<FactionsPage />} />
          <Route path="/world" element={<WorldPage />} />
          <Route path="/episodes" element={<EpisodesPage />} />
        </Routes>
      </main>
    </div>
  );
}
