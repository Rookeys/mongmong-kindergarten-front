/*
 * 디자인시스템 컴포넌트 색을 화면에서 임시로 덮어쓰는 클래스 모음.
 *
 * Figma 화면은 Dark 색 모드인데, 지금 배포된 디자인시스템은 Light 테마 기준이라
 * 어두운 배경 위에서 글자가 어둡게 나오고 시트·모달 배경이 반투명하게 나온다.
 * 디자인시스템 feature/figma-parity-kojaem가 배포되면 앱을 data-theme="dark"로 바꾸고 이 파일을 지운다.
 */

/** 어두운 배경 위 ListRow·TopNavigation 글자 */
export const ON_DARK_TEXT = "[&_*]:text-text-primary!"

/** 어두운 배경 위 Result 글자 */
export const ON_DARK_SECONDARY_TEXT = "[&_*]:text-text-secondary!"

/** BottomSheet·Modal: 불투명 밝은 배경, 제목·설명 줄바꿈(\n) 유지 */
export const DIALOG_SURFACE = "bg-background-default! [&_h2]:whitespace-pre-line [&_p]:whitespace-pre-line"
