# 도서 관리 CRUD (Fetch API + MockAPI)

## 1. Deployment

| 항목 | 주소 |
|---|---|
| GitHub (제출) | https://github.com/2026-2-OSS/assign09-c01-22500326 |
| GitHub (배포용) | https://github.com/bang20060225-source/22500326_assign09 |
| Vercel | https://22500326assign09-git-main-bang20060225-source.vercel.app |
| MockAPI | https://6adea7b04e88f1bba4a54018.mockapi.io/books |

## 2. Service

- 주제: 도서 관리
- Resource: `books`
- Field (7개): id, title, author, genre, year, rating, isRead

| 기능 | Method | 설명 |
|---|---|---|
| 목록 조회 | GET `/books` | 페이지에 들어오면 책 목록을 불러와서 표로 보여줌 |
| 추가 | POST `/books` | 폼에 입력한 책을 서버에 저장 |
| 수정 | PUT `/books/:id` | 수정 버튼을 누르면 기존 데이터를 불러오고, 고친 내용을 저장 |
| 삭제 | DELETE `/books/:id` | confirm으로 한 번 확인하고 삭제 |

- 검색: 제목/저자 검색, 장르 필터 (`filter()` 사용)
- 입력 검사 (등록, 수정 둘 다 적용)
  - 제목 필수, 50자 이하
  - 저자 필수
  - 장르 선택 필수
  - 출판연도 1000 ~ 올해
  - 평점 1 ~ 5
- 기타: 요청 실패 시 오류 메시지, 불러오는 중 문구, 성공 메시지는 3초 뒤 사라짐

## 3. Key Learning

1. fetch는 404나 500이 와도 catch로 넘어가지 않는다. 그래서 `response.ok`를 확인하고 직접 `throw` 해야 한다.
2. 서버에 보낼 때는 `JSON.stringify()`로 문자열로 바꾸고, 받을 때는 `response.json()`으로 다시 객체로 바꾼다.
3. PUT은 전체 수정, PATCH는 일부 수정이다. 처음에 PATCH를 썼는데 MockAPI에서 CORS 때문에 막혀서 PUT으로 바꿨다. CORS는 서버 쪽 설정이라 내 코드로는 못 바꾼다는 걸 알게 됐다.

## 4. AI / Search Usage

| 항목 | 내용 |
|---|---|
| 도구 | Claude |
| 사용 목적 | 과제 코드 작성, 오류 원인 찾기, Git / Vercel 사용법 |
| 참고·반영한 기능 | CRUD 함수(fetch), 입력 검사, 검색, 로딩 문구, 메시지 자동 숨김, CSS, README 초안 |
| 직접 한 것 | MockAPI 리소스 생성과 주소 연결, 수정 오류(PATCH) 확인 후 PUT으로 변경, 로컬·배포 테스트, 레포 구성과 Vercel 배포 |
| 배운 점 | 코드를 받아서 붙이는 것보다 Network 탭에서 요청을 하나씩 확인하는 게 문제를 찾는 데 더 중요했다 |
| 본인 추정 AI 코드 기여율 | 50% |

- 검색: MockAPI 공식 문서 (PUT/PATCH 지원 확인), Vercel 커뮤니티 (Organization Private 레포 배포 제한)

## 5. Problem & Solution

| 문제 | 해결 |
|---|---|
| 수정 저장 시 `Failed to fetch` | MockAPI가 CORS에서 PATCH를 허용하지 않아서 PUT으로 변경 |
| MockAPI 주소에 `/api/v1`이 필요한지 헷갈림 | 프로젝트에 prefix가 없어서 대시보드에 나온 주소 그대로 사용 |
| `git push` 할 때 rejected 에러 | 같은 레포를 두 곳에 clone 해둔 게 원인. 새로 clone 해서 한 폴더에서만 작업 |
| 커밋했는데 과제 파일이 안 올라감 | 파일이 다른 폴더에 복사돼 있었음. `git status`로 확인하고 다시 커밋 |
| 엉뚱한 레포에 커밋됨 | VS Code가 다른 폴더를 열고 있었음. 커밋 전에 `pwd`, `git status` 확인 |
| Vercel에서 Organization Private 레포 배포 안 됨 | 개인 레포를 remote로 추가해서 제출용, 배포용 두 곳에 push |

## 6. Reflection

이전 과제는 배열에만 저장해서 새로고침하면 데이터가 사라졌는데, 이번에는 서버에 저장되니까 새로고침해도 남아 있는 게 신기했다. 코드보다 Git 폴더랑 레포를 헷갈려서 시간을 더 많이 썼다. 다음부터는 작업 전에 `pwd`랑 `git status`부터 확인해야겠다.