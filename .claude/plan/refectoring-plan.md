# 리팩토링 계획: react-keycloak-demo → 프로덕션 품질 전환

## Context

현재 앱은 "Keycloak Demo" 수준 — 단일 App.jsx에 모든 로직이 뭉쳐있고, UI는 개발자용 debug 패널 형태. 고객(엔드유저)이 바로 마주치는 서비스 수준으로 UI와 구조를 전면 재설계한다. fetch endpoint는 환경변수로 관리하고, 3초 응답 없으면 명확한 에러 메시지를 출력한다.

---

## 1. 새 폴더 구조 (Feature-based)

```
src/
├── assets/
│   └── logo.svg                        # 앱 로고
├── components/                         # 재사용 UI 프리미티브
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   └── Toast.tsx                   # 모달 대신 토스트 알림
│   └── layout/
│       ├── Header.tsx                  # 로고 + 유저 메뉴
│       └── PageLayout.tsx              # 공통 레이아웃 래퍼
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginScreen.tsx         # 인증 전 전체화면 로그인 페이지
│   │   │   ├── UserProfileCard.tsx     # 유저 정보 카드
│   │   │   └── TokenInfoCard.tsx       # 토큰 표시 (마스킹 + 복사)
│   │   ├── hooks/
│   │   │   └── useAuth.ts              # Auth 상태 훅
│   │   └── index.ts
│   └── api-explorer/
│       ├── components/
│       │   ├── ApiExplorerCard.tsx     # API 호출 UI
│       │   └── ResponseViewer.tsx      # JSON 응답 표시
│       ├── hooks/
│       │   └── useApiCall.ts           # fetch 훅 (timeout 처리)
│       └── index.ts
├── lib/
│   ├── axios.ts                        # axios 인스턴스 (3초 timeout + 에러 인터셉터)
│   └── keycloak.ts                     # keycloak 인스턴스 (authManager.js 대체)
├── services/
│   └── api.ts                          # API 호출 함수 (env 기반 endpoint)
├── config/
│   └── env.ts                          # window.__ENV__ 타입 안전 접근
├── types/
│   └── index.ts                        # 공통 타입 정의
├── pages/
│   ├── DashboardPage.tsx               # 로그인 후 메인 페이지
│   └── LoadingPage.tsx                 # Keycloak 초기화 중 스피너
├── App.tsx                             # 루트 (auth 상태에 따라 분기)
├── main.tsx                            # 진입점 (기존 유지)
└── index.css                           # Tailwind (기존 유지)
```

---

## 2. 환경변수 설계 (config/env.ts)

`window.__ENV__`에서 타입 안전하게 읽기. `env-config.js.template`에 추가:

```
API_BASE_URL=${API_BASE_URL}
```

```typescript
// src/config/env.ts
interface AppEnv {
  KEYCLOAK_REALM: string;
  KEYCLOAK_AUTH_SERVER_URL: string;
  KEYCLOAK_CLIENT_ID: string;
  API_BASE_URL: string;          // 새로 추가 — 기본값: "/api"
}

export function getEnv(): AppEnv {
  const env = (window as any).__ENV__ ?? {};
  return {
    KEYCLOAK_REALM: env.KEYCLOAK_REALM ?? 'cnap',
    KEYCLOAK_AUTH_SERVER_URL: env.KEYCLOAK_AUTH_SERVER_URL ?? 'http://localhost:8080',
    KEYCLOAK_CLIENT_ID: env.KEYCLOAK_CLIENT_ID ?? 'react',
    API_BASE_URL: env.API_BASE_URL ?? '/api',
  };
}
```

---

## 3. Axios — 3초 타임아웃 + 에러 처리 (lib/axios.ts)

```typescript
// src/lib/axios.ts
import axios from 'axios';
import { getEnv } from '@/config/env';

const instance = axios.create({
  baseURL: getEnv().API_BASE_URL,
  timeout: 3000,   // 3초
});

// 요청 인터셉터: Bearer 토큰 주입
instance.interceptors.request.use(async (config) => {
  await authManager.updateToken(...);
  const token = authManager.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 응답 에러 인터셉터
instance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return Promise.reject(new Error('요청 시간이 초과되었습니다 (3초). 서버 상태를 확인해 주세요.'));
    }
    return Promise.reject(error);
  }
);

export default instance;
```

---

## 4. UI 재설계 — 고객 대면 프로 SaaS 룩

### 레이아웃
- **Header**: 왼쪽 로고/앱명 + 오른쪽 유저 아바타/로그아웃 드롭다운
- **Main**: 중앙 정렬 카드 그리드 (max-w-5xl)

### 색상 팔레트 (Tailwind)
- 배경: `slate-50` (밝고 깔끔)
- 헤더: `slate-900` (진한 네이비)
- 강조색: `blue-600`
- 성공: `emerald-500`, 경고: `amber-500`, 에러: `red-500`

### 페이지별 UI

#### LoginScreen (비로그인 상태)
- 중앙 정렬 로그인 카드
- 앱 로고 + 설명 + "로그인" 버튼 (blue-600, 풀 width)
- 아이콘 포함 (shield/lock)

#### DashboardPage (로그인 후)
```
┌─────────────────────────────────────────────────────┐
│  [로고] 앱 이름              [아바타] 이름 ▼ [로그아웃] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────┐  ┌────────────────────────┐  │
│  │  👤 사용자 정보   │  │  🔑 토큰 상태          │  │
│  │  이름: hong      │  │  상태: [유효 ●]        │  │
│  │  프로필 링크 →   │  │  만료: 2026-03-15 ...  │  │
│  │                  │  │  [토큰 보기] [갱신]    │  │
│  └──────────────────┘  └────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  🌐 API Explorer                             │   │
│  │  Endpoint: /ip            [요청 보내기 →]   │   │
│  │  ─────────────────────────────────────────   │   │
│  │  응답 (200 OK)  ·  142ms                   │   │
│  │  { "origin": "..." }                        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- **Toast 알림**: 화면 우하단 슬라이드인 (모달 제거)
- **토큰 표시**: 기본 마스킹 `eyJ...` 클릭시 전체 표시 + 복사 버튼
- **응답 상태**: 200/4xx/5xx/timeout 별 색상 배지
- **로딩**: 버튼 내부 스피너 (전체 화면 블로킹 없음)

---

## 5. 수정 대상 기존 파일

| 파일 | 처리 |
|------|------|
| `src/App.jsx` | → `src/App.tsx`로 대체 |
| `src/authManager.js` | → `src/lib/keycloak.ts`로 대체 |
| `src/axiosConfig.js` | → `src/lib/axios.ts`로 대체 |
| `src/main.tsx` | 최소 수정 (import 경로만) |
| `src/index.css` | 유지 |
| `env-config.js.template` | `API_BASE_URL` 추가 |
| `public/env-config.js` | `API_BASE_URL` 추가 |

---

## 6. 구현 순서

1. `src/config/env.ts` — 환경변수 config
2. `src/lib/keycloak.ts` — authManager 대체
3. `src/lib/axios.ts` — 3초 timeout + 에러 인터셉터
4. `src/services/api.ts` — API 호출 함수
5. `src/types/index.ts` — 공통 타입
6. `src/components/ui/` — Button, Card, Badge, Spinner, Toast
7. `src/components/layout/` — Header, PageLayout
8. `src/features/auth/` — useAuth 훅, LoginScreen, UserProfileCard, TokenInfoCard
9. `src/features/api-explorer/` — useApiCall 훅, ApiExplorerCard, ResponseViewer
10. `src/pages/` — DashboardPage, LoadingPage
11. `src/App.tsx` — 루트 조합
12. `src/main.tsx` — import 경로 수정
13. `env-config.js.template` + `public/env-config.js` — API_BASE_URL 추가
14. 기존 파일 삭제 (App.jsx, authManager.js, axiosConfig.js)

---

## 7. 검증

```bash
pnpm dev
```
- 로그인 전: LoginScreen 표시
- 로그인 후: DashboardPage 카드 레이아웃
- "요청 보내기": 응답 JSON 표시
- 서버 느릴 때: 3초 후 "요청 시간이 초과되었습니다" 토스트
- 토큰 갱신/만료 확인 동작
- Docker 빌드: `API_BASE_URL` 환경변수 주입 확인
