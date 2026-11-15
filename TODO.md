# TODO

## 직접 확인할 것 (체크리스트)

- [ ] **카카오 실제 로그인 1회**: 로그인 → 이름 작성 → 브릿지 → 홈까지. 코드 쪽은 이메일 계정으로만 검증했다.
- [ ] **프론트 PR 머지**: `dev` ← `feat/temp-screens` 하나에 MVP 작업이 모두 들어 있다. 기능별로 커밋을 나눠 두었다. (CI용 `GH_PACKAGES_TOKEN` 시크릿은 등록됨)
- [ ] **`.env`의 `NEXT_PUBLIC_API_ROOT`**: 로컬은 `http://localhost:4000` (`/api/v1` 없이). 예전 `NEXT_PUBLIC_API_URL`은 쓰지 않는다.
- [ ] **디자이너에게 전달**: 아래 "Figma에 디자인이 없는 화면·요소" 표와 "임시 구현" 목록, 홈 오른쪽 위 아이콘 3개 용도, 꾸미기 옷·얼굴 아이템을 캐릭터 위 어디에 그릴지, 꾸미기 탭 장식·기타 여부.
- [ ] **(선택) 로컬 개발 DB 테스트 데이터 정리**: 검증·스크린샷용 테스트 계정(`*@test.dev`), 공개 답장, 졸업 카드 1개, 공지 1개.

## 임시 구현 (디자인·정책이 정해지면 교체)

Figma에 화면이나 동작 기준이 없어 프론트에서 먼저 만들어 둔 것이다. 코드에는 `TODO:` 주석으로 같은 내용을 남겼다.

| 무엇 | 지금 동작 | 파일 |
|---|---|---|
| 날짜 변경 | 답장 쓰기·휴게실 상단 "2026년 5월 5일 ˅"을 누르면 바텀시트 휠(연·월·일)에서 날짜 선택, 미래 날짜는 오늘로 맞춤. 디자인시스템 달력은 어두운 화면용(Figma 기준)이라 밝은 시트에는 휠을 씀 | `src/components/DateChangeTitle.tsx` |
| 질문 리스트 | 일지 탭 오른쪽 위 메뉴 → `/questions`. 질문 순번을 올해 날짜로 바꿔(1번 = 1월 1일, 평년 기준) 그 날짜 답장 쓰기로 이동, 미래 날짜는 비활성 | `src/app/[locale]/questions/` |
| 편지 도착 팝업 | 오늘 편지에 아직 답장하지 않았으면 홈에 들어올 때 하루 한 번 (기기별, localStorage) | `src/app/[locale]/(main)/LetterArrivalSheet.tsx` |
| 홈 답장 카드 | 오늘 답장한 뒤에는 질문 카드 대신 같은 질문의 다른 사람 공개 답장 1개 (Figma 홈 `5390:22240`). 공개 답장이 없으면 질문 카드 그대로 | `src/app/[locale]/(main)/HomeScreen.tsx` |
| 휴게실 작성자 | 공개 답장은 익명이라 "From. 익명"으로 고정 | `src/components/PublicLetterCard.tsx` |
| 꿈조각 이력 | 꿈 조각 공장의 "꿈 조각 N개" → `/rewards/history` (종류·날짜·수량 목록) | `src/app/[locale]/rewards/history/` |
| 광고 보기 | 지난 날짜 답장·아이템 구매·꿈 조각 공장·질문 리스트의 광고 버튼은 "AdMob 연동 필요" 알림만 띄운다. AdMob을 붙이면 보상은 백엔드 SSV 콜백으로 지급(백엔드 TODO) | 각 화면 (`adNotReady` 문구) |
| 친구 초대 코드 입력칸 | 이름 작성 화면 아래 선택 입력 | `src/app/[locale]/auth/components/InputNickname.tsx` |
| 신고 사유 | 휴게실 신고 시트의 칩 (선택 사항) | `src/components/ReportButton.tsx` |
| 설정·로그아웃·탈퇴 | `/office/settings` | `src/app/[locale]/office/settings/` |
| 원장실 메뉴 | 자주 묻는 질문·의견 보내기·플레이 스토어 리뷰 남기기·만든 사람들(Figma "서비스 팀원")은 메뉴만 있고, 누르면 "아직 만들고 있는 기능이에요" 알림 | `src/app/[locale]/(main)/office/OfficeScreen.tsx` |
| 홈 오른쪽 위 아이콘 3개 | Figma에 용도가 없어 임시 하트 아이콘. 누르면 "아직 만들고 있는 기능이에요" 알림 | `src/app/[locale]/(main)/HomeScreen.tsx` |
| 비회원 | 로그인 화면 "비회원으로 시작하기" → `/guest`. 오늘의 질문만 보여주고(`GET /questions/guest/today`), "답장 쓰기"를 누르면 카카오 로그인 안내 모달 | `src/app/[locale]/guest/` |

## Figma에 디자인이 없는 화면·요소

백엔드 API는 준비되어 있고 디자인만 없는 항목이다. 근거: 백엔드 `docs/decisions-2026-10-18.md` 2·3장. 임시 구현한 것은 위 표에 있다.

| 화면·요소 | 들어갈 위치 | API |
|---|---|---|
| 캐릭터 종류별(몽몽이·햄몽이·빼몽이) × 레벨별(Lv1~4) 이미지 | 캐릭터 홈, 졸업 앨범 | `GET /characters/me` (`characterType`, `level`) |
| 졸업 연출과 새 캐릭터 소개 | 캐릭터 홈 (`canGraduate`가 true일 때) | `POST /characters/graduate` |
| 에러 안내 문구: 이미 신고한 글, 판매 중지된 아이템, 졸업일 전 등 | 각 화면 | 에러 코드는 백엔드 `docs/error-codes.md` |

## 정해진 규칙

- 비회원은 오늘의 질문만 볼 수 있고, 답장을 쓰려면 로그인해야 한다. 기획에 정해진 것이 없어 프론트에서 이렇게 정했으니 팀원들과 공유해야 한다.
- 2월 29일은 질문이 없는 쉬는 날이다. 백엔드는 이날 질문을 주지 않고(`QUESTION_NOT_FOUND`), 프론트는 API를 부르지 않고 "2월 29일은 하루 쉬는 날이에요."를 보여준다 (홈·편지·답장 쓰기·휴게실, 일지 캘린더에서는 누를 수 없음). 백엔드 `feat/leap-day-no-question`과 같이 나가야 한다.

## 아직 비워 둔 것

- 토큰 갱신 공유: 같은 Refresh Token으로 동시에 갱신하지 않도록 진행 중인 갱신을 서버 메모리에서 공유한다(`src/app/api/auth/refreshAccessToken.ts`). 프론트 서버를 여러 대 띄우면 Redis 같은 공유 저장소로 옮겨야 한다.

- 홈·화면 하단 광고 배너: Figma는 임시 이미지다. AdMob 붙일 때 넣는다.
- 캐릭터 이미지: 백엔드 `characterType.imageUrl`이 없으면 임시 알 이미지를 쓴다.
- 꾸미기: 옷·얼굴 아이템을 캐릭터 위 어디에 그릴지 기준이 없어 캐릭터 크기에 맞춰 겹쳤다. 아이템 탭은 백엔드 기준 옷/얼굴/배경 3개 (Figma 일부 화면은 장식·기타 포함).
- 졸업 카드 저장·공유: html-to-image로 카드를 PNG로 만든다. 움직이는 캐릭터는 찍는 순간 한 프레임만 들어가고, 다른 도메인 이미지(`cardImageUrl` 등)는 그 서버가 CORS를 허용해야 찍힌다.

## 디자인시스템

백엔드 할 일은 백엔드 레포 `TODO.md`에 있다. 프론트 할 일은 이 파일 하나로 본다.

앱은 `<html data-theme="dark">`(Figma Dark 색 모드)로 `@kojaem/mongmong`(0.0.8) 컴포넌트를 그대로 쓴다. 화면에서 덮어쓰는 색·크기는 없다.
부족한 점이 생기면 프론트에서 덮어쓰지 말고 여기에 적은 뒤 디자인시스템에서 고친다.

- Figma Dark `Text/Brand`(#8e87f7)와 맞추려고 `globals.css`의 `--color-text-brand`를 `purple-400`으로 먼저 바꿨다. 디자인시스템 PR(`feature/text-brand-token-kojaem`)이 배포되면 이 줄을 지운다.
- Figma 기준으로 DatePicker 달력은 어두운 화면 위에, 밝은 바텀시트 안에는 휠을 쓴다
- Modal: 버튼 두 개가 모달 폭을 채우지 않고 글자가 길면 줄바꿈되며("로그인하기"), 밝은 모달 위 제목·설명 글자색이 흐리게 보인다 → Figma Modal과 비교 확인 필요

## 로그인

- 지금은 카카오만 백엔드와 연동한다. Google·Naver provider는 `src/auth.ts`에 남겨 두었고 `signIn` 콜백에서 막아 두었다. 백엔드에 `POST /auth/google`, `POST /auth/naver`가 생기면 연동한다.
- 비회원 화면은 `/guest` (위 "임시 구현" 표). 비회원용 API는 `GET /questions/guest/today`.
