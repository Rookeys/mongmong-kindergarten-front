import { defineConfig } from "orval"

/**
 * 백엔드 Swagger(openapi.json)로 API 함수·타입·react-query 훅을 만든다.
 *   pnpm api:sync      로컬 백엔드에서 openapi.json을 받아 와 생성 (백엔드 API가 바뀌었을 때)
 *   pnpm api:generate  레포에 있는 openapi.json으로 다시 생성
 * openapi.json을 커밋해 두어, PR diff에서 API 변경이 보이고 백엔드 없이도 생성할 수 있다.
 */
export default defineConfig({
  mongmong: {
    input: { target: "./openapi.json" },
    output: {
      mode: "tags-split",
      target: "src/apis/generated",
      schemas: "src/apis/generated/model",
      client: "react-query",
      httpClient: "axios",
      clean: true,
      formatter: "prettier",
      override: {
        mutator: { path: "src/apis/instance.ts", name: "apiInstance" },
        // GET은 useQuery, 나머지는 useMutation (orval 기본값)
        query: {
          // 무한 스크롤 API가 생기면 operations에서 그 API만 켠다
          useInfinite: false,
          signal: true
        }
      }
    }
  }
})
