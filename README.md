# Huddling 7team

React + TypeScript + Tailwind CSS (Vite) 기반 웹 서비스

## 시작하기

> Node 24 이상 필요 (`nvm use` 로 맞출 수 있음). VS Code 로 열면 추천 확장 설치 안내가 뜹니다.

```bash
npm install
cp .env.example .env   # 실제 API 정보는 .env 에 입력 (커밋되지 않음)
npm run dev            # http://localhost:5173
```

## 스크립트

| 명령어            | 설명                                |
| ----------------- | ----------------------------------- |
| `npm run dev`     | 개발 서버 실행                      |
| `npm run build`   | 타입 체크 + 프로덕션 빌드 (`dist/`) |
| `npm run preview` | 빌드 결과 미리보기                  |

## 폴더 구조

```
├── index.html          # 진입 HTML
├── public/             # 정적 파일 (그대로 복사됨)
├── src/
│   ├── main.tsx        # React 진입점
│   ├── App.tsx         # 최상위 레이아웃
│   ├── style.css       # Tailwind + 전역 스타일/디자인 토큰
│   ├── components/     # 공통 컴포넌트
│   ├── pages/          # 페이지 단위 컴포넌트
│   ├── lib/            # env, api 등 유틸
│   └── assets/         # 이미지 등 (import 해서 사용)
├── .env.example        # 환경 변수 템플릿 (커밋됨)
└── .env                # 실제 키 (gitignore — 커밋 안 됨)
```

## 환경 변수 / API 키

- `.env` 파일은 `.gitignore` 에 등록되어 있어 GitHub 에 올라가지 않습니다.
- 새 변수를 추가하면 `.env.example`, `src/vite-env.d.ts`, `src/lib/env.ts` 에도 같이 추가해 주세요.
- ⚠️ `VITE_` 로 시작하는 변수는 브라우저 번들에 포함되어 누구나 볼 수 있습니다. 비밀 키는 백엔드에서만 사용하세요.

## 브랜치 규칙

- `main` — 배포 가능한 안정 버전
- `feat/<기능명>` — 기능 개발 후 PR 로 `main` 에 병합

## 배포 (Vercel)

1. Vercel 에서 이 GitHub 레포를 Import → Framework 는 **Vite** 로 자동 인식됩니다 (`vercel.json` 포함).
2. **Settings → Environment Variables** 에 `.env` 와 같은 키(`VITE_API_BASE_URL` 등)를 등록합니다. `.env` 파일은 업로드되지 않기 때문에 여기서 따로 넣어야 합니다.
3. `main` 에 병합되면 Production, 다른 브랜치나 PR 은 Preview 로 자동 배포됩니다.
4. `vercel.json` 의 rewrites 설정 덕분에 새로고침해도 SPA 라우팅이 404 없이 동작합니다.
5. 비밀 키가 필요한 API 는 `api/` 폴더에 Vercel Serverless Function 을 만들어 서버에서 호출하세요 (`VITE_` 없는 변수는 서버에서만 읽힙니다).
