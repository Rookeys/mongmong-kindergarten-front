# 몽몽유치원 프론트엔드

Next.js(App Router) + next-auth(카카오 로그인) + next-intl(ko/en/ja) + 디자인시스템 `@kojaem/mongmong`.

## 시작하기

```bash
cp .env.example .env   # 값 채우기 (NEXT_PUBLIC_API_ROOT=http://localhost:4000)
pnpm install           # @kojaem/* 설치에 GitHub Packages 토큰이 든 .npmrc 필요
pnpm dev
```

## API 코드 (orval)

백엔드 Swagger(`openapi.json`)로 API 함수·타입·react-query 훅을 `src/apis/generated/`에 만든다. 생성 파일은 직접 고치지 않는다.

```bash
pnpm api:sync      # 로컬 백엔드(localhost:4000)에서 openapi.json을 받아 와 생성. 다른 주소는 API_DOCS_URL=...
pnpm api:generate  # 레포의 openapi.json으로 다시 생성
```

- 요청은 `src/apis/instance.ts`(axios) 하나로 나간다. 브라우저에서만 쓰며, next-auth 세션의 토큰을 붙이고 401이면 세션을 갱신해 한 번 다시 보낸다.
- 화면 데이터는 클라이언트 컴포넌트에서 생성된 훅(`useXxx`)으로 가져온다. 서버 컴포넌트(`page.tsx`)는 `requireSession()`으로 로그인만 확인한다.
- 조회 실패는 `src/app/[locale]/error.tsx`가 보여주고, 저장(mutation) 실패는 각 화면에서 `getErrorMessage(error)`로 보여준다.

## 폴더

- `src/app/[locale]/(main)/` 하단 탭바가 있는 탭 화면 (홈·일지·꾸미기·휴게실·원장실)
- `src/app/[locale]/…/XxxScreen.tsx` 화면 본체 (클라이언트), 같은 폴더의 작은 컴포넌트는 그 화면 전용
- `src/components/` 여러 화면이 같이 쓰는 컴포넌트
- `src/messages/` 번역 문구

남은 일과 확인할 것은 `TODO.md`.
