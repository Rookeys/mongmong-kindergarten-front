# TODO

## 직접 확인할 것 (체크리스트)

- [ ] **카카오 실제 로그인 1회**: 로그인 → 이름 작성 → 브릿지 → 홈까지. 코드 쪽은 이메일 계정으로만 검증했다.
- [ ] **GitHub 시크릿 `GH_PACKAGES_TOKEN` 등록** (프론트 레포 Settings → Secrets and variables → Actions): `read:packages` 권한 PAT. CI가 `@kojaem/mongmong`을 받을 때 쓴다.
- [ ] **프론트 PR 머지**: `dev` ← `feat/temp-screens` 하나에 MVP 작업이 모두 들어 있다. 기능별로 커밋을 나눠 두었다.
- [ ] **백엔드 `feat/nickname-japanese` 머지**: 프론트 PR과 같이 (일본어 닉네임).
- [ ] **디자이너에게 전달**: 아래 "Figma에 디자인이 없는 화면·요소" 표, 홈 오른쪽 위 아이콘 3개 용도, 꾸미기 옷·얼굴 아이템을 캐릭터 위 어디에 그릴지, 꾸미기 탭 장식·기타 여부.
- [ ] **(선택) 로컬 개발 DB 테스트 데이터 정리**: 검증하며 넣은 테스트 계정(`*@test.dev`), 공개 답장, 졸업 카드 1개, 공지 1개, 테스트 계정 꿈조각 20개.
- [ ] **`pnpm lint` 고장**: `eslint-plugin-tailwindcss`가 Tailwind v4를 지원하지 않아 실행 자체가 안 된다 (이번 작업 전부터).

## Figma에 디자인이 없는 화면·요소

백엔드 API는 준비되어 있고 디자인만 없는 항목이다. 근거: 백엔드 `docs/decisions-2026-10-18.md` 2·3장.
**(임시 구현)** 표시는 디자인시스템 컴포넌트로 먼저 만들어 둔 것이다. 디자인이 나오면 교체한다.

| 화면·요소 | 들어갈 위치 | API |
|---|---|---|
| 친구 초대 코드 입력칸 (선택 입력) **(임시 구현)** | 온보딩 이름 작성 | `PATCH /auth/me` `{ nickname, friendInviteCode }` |
| 신고 사유 선택 (선택 입력) **(임시 구현)** | 휴게실 다른 사람 일지 | `POST /letters/:id/reports` (`reasonType` 생략 가능) |
| 설정 메뉴와 설정 화면 (일지 공개, SNS 소개, 푸시, 언어) **(임시 구현, /office/settings)** | 원장실 | `GET/PATCH /auth/me/settings` |
| 로그아웃 **(임시 구현)** | 원장실 | `POST /auth/logout` |
| 탈퇴 (재가입 시 새 계정이 된다는 안내 포함) **(임시 구현)** | 원장실 | `DELETE /auth/me` |
| 캐릭터 종류별(몽몽이·햄몽이·빼몽이) × 레벨별(Lv1~4) 이미지 | 캐릭터 홈, 졸업 앨범 | `GET /characters/me` (`characterType`, `level`) |
| 졸업 연출과 새 캐릭터 소개 | 캐릭터 홈 (`canGraduate`가 true일 때) | `POST /characters/graduate` |
| 에러 안내 문구: 이미 신고한 글, 판매 중지된 아이템, 졸업일 전 등 | 각 화면 | 에러 코드는 백엔드 `docs/error-codes.md` |

## 홈 화면에서 비워 둔 것

- 상단 오른쪽 아이콘 3개: Figma에 용도가 없고 임시 하트 아이콘이다. 출석체크·공지사항·친구 초대 중 무엇인지 정해지면 연결한다.
- 하단 광고 배너: Figma는 임시 이미지다. AdMob 붙일 때 넣는다.
- 답장 카드 상태(Figma 홈 `5390:22240`, "From. 익명 닉네임"): 휴게실·답장 작업 때 붙인다.
- 캐릭터 이미지: 백엔드 `characterType.imageUrl`이 없으면 임시 알 이미지를 쓴다. 종류·레벨별 이미지는 위 표 참고.

## 휴게실·일지에서 비워 둔 것

- 휴게실 카드의 "From. 익명 닉네임": 백엔드 공개 일지 응답에 닉네임이 없어 "익명의 선생님"으로 고정했다.
- 날짜 변경(Figma "날짜 변경"), 질문 리스트(일지 상단 메뉴), 편지 도착 팝업(홈)은 아직 없다.
- 원장실: 자주 묻는 질문·의견 보내기·스토어 리뷰·서비스 팀원은 연결할 주소가 없어 메뉴에서 뺐다. 졸업 카드 "저장하기"는 카드를 이미지로 만드는 방법이 정해지면 붙인다(공유는 글로만).
- 꿈 조각 공장: 홈 상단 꿈조각 수를 누르면 들어간다. 꿈조각 이력 화면(GET /rewards/history)은 Figma에 없어 아직 없다.
- 꾸미기: 옷·얼굴 아이템을 캐릭터 위 어디에 그릴지 기준이 없어 캐릭터 크기에 맞춰 겹쳤다. 아이템 탭은 백엔드 기준 옷/얼굴/배경 3개 (Figma 일부 화면은 장식·기타 포함).
- 지난 날짜 답장·아이템 구매의 "광고 보기"는 AdMob 연결 전까지 비활성.

## 디자인시스템에 요청할 것

앱은 `<html data-theme="dark">`(Figma Dark 색 모드)로 디자인시스템 컴포넌트를 그대로 쓴다. 아래만 화면에서 보완했다.

- Popover `kind="popover"`가 폭 260px 고정이라, 홈·졸업 카드의 짧은 말풍선은 `className="w-auto!"`로 덮어썼다 → 자동 폭 옵션 필요
- BottomSheet·Modal 제목이 줄바꿈(`\n`)을 그대로 보여주지 않는다 (Figma는 두 줄) → 제목에 `white-space: pre-line` 필요
- DatePicker wheel에 연·월만 고르는 옵션이 없어 일지 달 선택에서 일(day) 열도 보인다
- Dark 테마에서 Chip 선택 색이 Figma와 같은지 확인 필요 (꾸미기 탭, 설정 언어)

## 정책 확인 필요

- 닉네임에 일본어(히라가나·가타카나·한자)를 허용하기로 했다. 백엔드 `feat/nickname-japanese`와 프론트 PR을 같이 머지해야 한다 (프론트만 먼저 나가면 일본어 닉네임이 서버에서 거절된다).

## 로그인

- 지금은 카카오만 백엔드와 연동한다. Google·Naver provider는 `src/auth.ts`에 남겨 두었고 `signIn` 콜백에서 막아 두었다. 백엔드에 `POST /auth/google`, `POST /auth/naver`가 생기면 연동한다.
- 비회원 시작 버튼은 아직 `alert("guest")`다. 비회원용 API는 `GET /questions/guest/today`.
