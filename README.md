# 📚 My Bookshelf — Fetch API + MockAPI CRUD

## 1. Deployment

| 항목 | URL |
| GitHub (제출) | https://github.com/2026-2-OSS/assign09-c01-22500326 |
| GitHub (배포용) | https://github.com/bang20060225-source/22500326_assign09 |
| Vercel | https://22500326assign09-git-main-bang20060225-source.vercel.app |
| MockAPI Endpoint | https://6adea7b04e88f1bba4a54018.mockapi.io/books |


## 2. Service

- **주제**: 도서 관리 (나만의 독서 기록장)
- **Resource**: `books`
- **Field (id 포함 7개)**

| Field | Type | 설명 |
|---|---|---|
| id | String (MockAPI 자동 생성) | 식별자 |
| title | String | 제목 |
| author | String | 저자 |
| genre | String | 장르 (소설/에세이/자기계발/과학/IT/역사/기타) |
| year | Number | 출판연도 |
| rating | Number | 평점 (1~5) |
| isRead | Boolean | 완독 여부 |

- **CRUD 기능**

| 기능 | Method | Endpoint | 동작 |
|---|---|---|---|
| Read | GET | `/books` | 페이지 시작 시 목록 조회 후 표로 출력 |
| Read One | GET | `/books/:id` | 수정 버튼 클릭 시 기존 데이터를 불러와 폼에 채움 |
| Create | POST | `/books` | 폼 검증 통과 시 추가 → 목록 재조회 |
| Update | PATCH | `/books/:id` | 폼에서 수정한 값을 서버에 반영 → 목록 재조회 |
| Delete | DELETE | `/books/:id` | `confirm()` 확인 후 삭제 → 목록 재조회 |

- **Validation (Create·Update 공통 6가지)**
  1. 제목 필수
  2. 제목 50자 이하
  3. 저자 필수
  4. 장르 선택 필수
  5. 출판연도 1000 ~ 올해 사이 정수
  6. 평점 1~5 사이 정수
- **검색**: 제목·저자 키워드 검색 + 장르 필터 (`filter()`)
- **오류 처리**: `response.ok` 확인 후 실패 시 화면 상단에 오류 메시지, 성공 시 목록 갱신
- **기타**: 요청 중 등록 버튼 비활성화(중복 클릭 방지)

### 파일 구조
```
├── index.html      # 서비스 소개 + crud.html 이동
├── crud.html       # 등록/수정 폼 + 목록/검색
├── css/style.css
└── js/app.js       # fetch CRUD, 검증, 검색, 화면 출력
```

## 3. Key Learning

1. **fetch() + response.ok**: fetch는 404·500 응답에도 Promise를 reject하지 않기 때문에 `response.ok`를 직접 확인하고 `throw`해야 `catch`에서 오류를 처리할 수 있다.
2. **JSON 변환**: 요청 시 `JSON.stringify()`로 JS 객체를 JSON 문자열로 바꾸고 `Content-Type: application/json` 헤더를 붙이며, 응답은 `response.json()`으로 JS 값으로 바꾼다.
3. **REST API와 PATCH/PUT**: 같은 `/books/:id` URL이라도 HTTP Method에 따라 조회·수정·삭제가 달라진다. PUT은 전체 교체, PATCH는 바꿀 필드만 보내는 부분 수정에 사용한다.

## 4. AI / Search Usage

| 항목 | 내용 |
|---|---|
| 도구 | (작성) |
| 사용 목적 | (작성) |
| 참고 또는 반영한 기능 | (작성) |
| 직접 수정한 내용 | (작성) |
| 배운 점 | (작성) |
| **본인 추정 AI 코드 기여율** | **(작성) %** |

- 검색 참고: MockAPI 공식 문서 (https://github.com/mockapi-io/docs/wiki) — PUT/PATCH 지원 여부 확인

## 5. Problem & Solution / Reflection

| 문제 | 해결 |
|---|---|
| (작성) | (작성) |

**Reflection**: (작성)
