import { useState } from 'react';

export default function Login({ onLogin }) {
  const [token, setTokenValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    // GitHub PAT는 인쇄 가능한 ASCII 문자만 포함하므로, 복사 과정에서 섞여 들어온
    // 한글/공백 등 다른 문자는 전부 제거한다 (안 그러면 헤더 생성 시 브라우저가 에러를 던짐).
    const cleaned = token.replace(/[^\x21-\x7e]/g, '');
    if (!cleaned) return;
    setChecking(true);
    setError(null);
    try {
      await onLogin(cleaned);
    } catch (err) {
      setError(err.message ?? String(err));
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="login-screen">
      <form className="login-box" onSubmit={handleSubmit}>
        <h1>설정집</h1>
        <p>
          이 저장소(<code>venny7979/novel-settei</code>)에 접근 가능한 GitHub Personal
          Access Token을 입력하세요.
        </p>
        <p className="login-hint">
          Fine-grained token 기준 이 저장소 하나에만 Contents 읽기/쓰기 권한을 부여하는 것을
          추천합니다. 토큰은 이 브라우저 탭의 세션에만 저장되며 서버로 전송되지 않습니다.
        </p>
        <div className="login-input-row">
          <input
            type={visible ? 'text' : 'password'}
            placeholder="github_pat_..."
            value={token}
            onChange={(e) => setTokenValue(e.target.value)}
            autoComplete="off"
            autoFocus
          />
          <button type="button" className="login-toggle" onClick={() => setVisible((v) => !v)}>
            {visible ? '숨기기' : '보기'}
          </button>
        </div>
        {error && <p className="login-error">⚠️ {error}</p>}
        <button type="submit" disabled={checking}>
          {checking ? '확인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}
