import { useState } from 'react';

export default function Login({ onLogin }) {
  const [token, setTokenValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!token.trim()) return;
    onLogin(token.trim());
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
        <input
          type="password"
          placeholder="github_pat_..."
          value={token}
          onChange={(e) => setTokenValue(e.target.value)}
          autoFocus
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}
