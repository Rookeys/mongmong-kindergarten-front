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

## 정책 확인 필요

- 닉네임 허용 문자: 백엔드는 `^[a-z0-9가-힣]{2,8}$`만 허용한다. 일본어·영어 로케일 사용자도 일본어 닉네임을 쓸 수 없다. 프론트 검증은 백엔드 기준에 맞춰 두었다. 일본어 닉네임이 필요하면 백엔드 패턴부터 바꿔야 한다.

## 로그인

- 지금은 카카오만 백엔드와 연동한다. Google·Naver provider는 `src/auth.ts`에 남겨 두었고 `signIn` 콜백에서 막아 두었다. 백엔드에 `POST /auth/google`, `POST /auth/naver`가 생기면 연동한다.
- 비회원 시작 버튼은 아직 `alert("guest")`다. 비회원용 API는 `GET /questions/guest/today`.
