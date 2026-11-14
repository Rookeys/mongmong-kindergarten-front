# TODO

## Figma에 디자인이 없는 화면·요소

백엔드 API는 준비되어 있고 디자인만 없는 항목이다. 근거: 백엔드 `docs/decisions-2026-10-18.md` 2·3장.

| 화면·요소 | 들어갈 위치 | API |
|---|---|---|
| 친구 초대 코드 입력칸 (선택 입력) | 온보딩 이름 작성 | `PATCH /auth/me` `{ nickname, friendInviteCode }` |
| 신고 사유 선택 (선택 입력) | 휴게실 다른 사람 일지 | `POST /letters/:id/reports` (`reasonType` 생략 가능) |
| 설정 메뉴와 설정 화면 (일지 공개, SNS 소개, 푸시, 언어) | 원장실 | `GET/PATCH /auth/me/settings` |
| 로그아웃 | 원장실 | `POST /auth/logout` |
| 탈퇴 (재가입 시 새 계정이 된다는 안내 포함) | 원장실 | `DELETE /auth/me` |
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
- 꾸미기: 옷·얼굴 아이템을 캐릭터 위 어디에 그릴지 기준이 없어 캐릭터 크기에 맞춰 겹쳤다. 아이템 탭은 백엔드 기준 옷/얼굴/배경 3개 (Figma 일부 화면은 장식·기타 포함).
- 지난 날짜 답장·아이템 구매의 "광고 보기"는 AdMob 연결 전까지 비활성.

## 디자인시스템 정합성

- Figma 화면은 다크 변수 모드 값(text/primary = 밝은 글자, fill/brand·text/brand = #6A62EA, 버튼 글자 = text/strong)을 쓴다. 디자인시스템은 라이트 테마에서 Figma처럼 보이도록 토큰을 골라 두어서, 앱에 `data-theme="dark"`를 켜면 Button(fill 글자 `text.inversePrimary`, weak 글자 `text.brandWeak`)과 Popover 제목(`text.primary`)이 Figma와 달라진다.
- 그래서 앱은 라이트 테마를 유지하고, 어두운 배경 위의 TopNavigation·ListRow·Result 글자색만 화면에서 덮어썼다 (`[&_*]:text-text-...!`).
- 해결: 디자인시스템 컴포넌트를 Figma 토큰 이름대로 맞추고(Button fill → `text.strong`, weak → `text.brand`, Popover 제목 → `text.inversePrimary`) 앱을 다크 테마로 바꾼 뒤 덮어쓴 부분을 지운다.
- BottomSheet·Modal 배경(`background.upper`)이 라이트 테마에서 반투명이라 화면에서 `bg-background-default!`로 덮어썼다 (`src/constants/dialog.ts`).
- 디자인시스템 수정은 `feature/dark-mode-parity-kojaem` 브랜치에 있다. 배포되면 `<html data-theme="dark">`로 바꾸고 덮어쓴 부분을 지운다.
- DatePicker wheel에 연·월만 고르는 옵션이 없어 일지 달 선택에서 일(day) 열도 보인다.
- `TextArea`는 디자인시스템 `feature/text-area-kojaem` 브랜치에 있다. 배포되면 답장 쓰기 화면의 임시 `<textarea>`를 교체한다.

## 정책 확인 필요

- 닉네임 허용 문자: 백엔드는 `^[a-z0-9가-힣]{2,8}$`만 허용한다. 일본어·영어 로케일 사용자도 일본어 닉네임을 쓸 수 없다. 프론트 검증은 백엔드 기준에 맞춰 두었다. 일본어 닉네임이 필요하면 백엔드 패턴부터 바꿔야 한다.

## 로그인

- 지금은 카카오만 백엔드와 연동한다. Google·Naver provider는 `src/auth.ts`에 남겨 두었고 `signIn` 콜백에서 막아 두었다. 백엔드에 `POST /auth/google`, `POST /auth/naver`가 생기면 연동한다.
- 비회원 시작 버튼은 아직 `alert("guest")`다. 비회원용 API는 `GET /questions/guest/today`.
