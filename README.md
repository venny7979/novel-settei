# 설정집

소설 캐릭터/세력/세계관/연재 기록 관리 앱.

- `client/`: React + Vite 프론트엔드
- `client/dist/`: 빌드된 결과물 — 서버 없이 `index.html`을 더블클릭해서 바로 사용
- `data/settei.json`: 실제 데이터 (GitHub Contents API로 읽고 씀)

## 사용 방법

서버나 배포 없이, `client/dist/index.html` 파일을 브라우저로 직접 열면 됩니다.

## 로그인

이 저장소에 접근 가능한 GitHub Personal Access Token(Contents: Read/Write)으로
로그인합니다. 토큰은 브라우저 세션에만 저장되고 서버로 전송되지 않습니다.

## 코드를 수정한 경우

`client/`에서 `npm run build`를 실행하면 `client/dist/`가 갱신됩니다. 이 폴더도
저장소에 커밋되어 있으니, 빌드 후 커밋/푸시하면 됩니다.
