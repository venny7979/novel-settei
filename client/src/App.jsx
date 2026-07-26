import { useRef } from 'react';
import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import CharactersPage from './pages/CharactersPage';
import WorldPage from './pages/WorldPage';
import EpisodesPage from './pages/EpisodesPage';
import FactionsPage from './pages/FactionsPage';
import { exportData, importData } from './storage';

export default function App() {
  const fileInputRef = useRef(null);

  function handleExport() {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settei-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (!confirm('현재 데이터를 불러온 JSON으로 덮어씁니다. 계속할까요?')) return;
      importData(reader.result);
      window.location.reload();
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="app-title">설정집</div>
        <NavLink to="/characters">캐릭터</NavLink>
        <NavLink to="/factions">세력</NavLink>
        <NavLink to="/world">세계관</NavLink>
        <NavLink to="/episodes">연재 기록</NavLink>
        <div className="app-nav-spacer" />
        <button type="button" onClick={handleExport}>
          JSON 내보내기
        </button>
        <button type="button" onClick={handleImportClick}>
          JSON 가져오기
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={handleImportFile}
        />
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
