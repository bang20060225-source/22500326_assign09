// 1. MockAPI 주소 (본인 Endpoint로 바꾸기)
const API_URL = "https://6adea7b04e88f1bba4a54018.mockapi.io/books";

// 서버에서 받아온 도서 목록 (화면 표시, 검색에만 사용 / 실제 저장은 MockAPI)
let books = [];

// 2. HTML 요소 가져오기
const form = document.getElementById("bookForm");
const formTitle = document.getElementById("formTitle");
const bookIdInput = document.getElementById("bookId");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const genreInput = document.getElementById("genre");
const yearInput = document.getElementById("year");
const ratingInput = document.getElementById("rating");
const isReadInput = document.getElementById("isRead");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

const bookList = document.getElementById("bookList");
const countText = document.getElementById("count");
const emptyText = document.getElementById("emptyText");
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");
const reloadBtn = document.getElementById("reloadBtn");
const messageBox = document.getElementById("message");



// 3. READ (GET) - 목록 불러오기
async function loadBooks() {
  // 서버 응답이 오기 전까지 안내 문구 표시 (성공하면 renderBooks()가 덮어씀)
  emptyText.textContent = "서버에서 불러오는 중...";
  emptyText.hidden = false;

  try {
    const response = await fetch(API_URL);

    // fetch는 404, 500이어도 실패로 처리하지 않으므로 직접 확인
    if (!response.ok) {
      throw new Error(`목록 조회 실패 (HTTP ${response.status})`);
    }

    books = await response.json(); // JSON → JavaScript 배열
    searchBooks(); // 검색 조건을 적용해서 화면에 출력
  } catch (error) {
    emptyText.textContent = "목록을 불러오지 못했습니다.";
    showMessage("오류: " + error.message, "error");
  }
}

// 화면에 표(table)로 출력
function renderBooks(list) {
  bookList.replaceChildren(); // 기존 목록 지우기

  list.forEach((book) => {
    const tr = document.createElement("tr");

    addCell(tr, book.title);
    addCell(tr, book.author);
    addCell(tr, book.genre);
    addCell(tr, book.year);
    addCell(tr, book.rating + "점");
    addCell(tr, book.isRead ? "완독" : "읽는 중");

    // 수정, 삭제 버튼
    const td = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.textContent = "수정";
    editBtn.className = "btn small";
    editBtn.addEventListener("click", () => startEdit(book.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "삭제";
    deleteBtn.className = "btn small danger";
    deleteBtn.addEventListener("click", () => removeBook(book.id, book.title));

    td.append(editBtn, deleteBtn);
    tr.append(td);
    bookList.append(tr);
  });

  countText.textContent = `(${list.length}권)`;
  emptyText.textContent = "표시할 도서가 없습니다.";
  emptyText.hidden = list.length > 0;
}

// td 한 칸 만들기 (textContent로 넣어서 HTML이 실행되지 않게 함)
function addCell(tr, text) {
  const td = document.createElement("td");
  td.textContent = text;
  tr.append(td);
}


// 4. CREATE (POST) - 도서 추가

async function addBook(book) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book), // JavaScript 객체 → JSON 문자열
  });

  if (!response.ok) {
    throw new Error(`등록 실패 (HTTP ${response.status})`);
  }

  await loadBooks(); // 서버 기준으로 목록 다시 조회
}


// 5. UPDATE (PUT) - 도서 수정


// 수정 버튼 클릭 → 서버에서 해당 도서를 다시 불러와 폼에 채움
async function startEdit(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`도서 조회 실패 (HTTP ${response.status})`);
    }

    const book = await response.json();

    bookIdInput.value = book.id;
    titleInput.value = book.title;
    authorInput.value = book.author;
    genreInput.value = book.genre;
    yearInput.value = book.year;
    ratingInput.value = book.rating;
    isReadInput.checked = book.isRead;

    // 폼을 "수정 모드"로 바꾸기
    formTitle.textContent = "도서 수정";
    submitBtn.textContent = "수정 저장";
    cancelBtn.hidden = false;
    titleInput.focus();
  } catch (error) {
    showMessage("오류: " + error.message, "error");
  }
}

async function updateBook(id, book) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    throw new Error(`수정 실패 (HTTP ${response.status})`);
  }

  await loadBooks();
}



// 6. DELETE - 도서 삭제
async function deleteBook(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`삭제 실패 (HTTP ${response.status})`);
  }

  await loadBooks();
}

// 삭제 버튼 클릭 → confirm()으로 확인 후 삭제
async function removeBook(id, title) {
  if (!confirm(`"${title}"을(를) 삭제할까요?`)) {
    return; // 취소를 누르면 아무것도 안 함
  }

  try {
    await deleteBook(id);
    if (bookIdInput.value === id) resetForm(); // 수정 중이던 책이면 폼 비우기
    showMessage(`"${title}"이(가) 삭제되었습니다.`, "success");
  } catch (error) {
    showMessage("오류: " + error.message, "error");
  }
}


// 7. 입력값 검증 (등록, 수정 둘 다 사용)

function validateForm() {
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const genre = genreInput.value;
  const year = Number(yearInput.value);
  const rating = Number(ratingInput.value);
  const thisYear = new Date().getFullYear();

  if (title === "") return "제목을 입력하세요.";
  if (title.length > 50) return "제목은 50자 이하로 입력하세요.";
  if (author === "") return "저자를 입력하세요.";
  if (genre === "") return "장르를 선택하세요.";
  if (!Number.isInteger(year) || year < 1000 || year > thisYear) {
    return `출판연도는 1000 ~ ${thisYear} 사이로 입력하세요.`;
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return "평점은 1~5 사이 정수로 입력하세요.";
  }

  return ""; // 빈 문자열 = 오류 없음
}

// 폼 입력값을 객체로 만들기
function getFormData() {
  return {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    genre: genreInput.value,
    year: Number(yearInput.value),
    rating: Number(ratingInput.value),
    isRead: isReadInput.checked,
  };
}


// 8. 검색 (filter 사용)

function searchBooks() {
  const keyword = searchInput.value.trim();
  const genre = genreFilter.value;

  const result = books.filter((book) => {
    const matchKeyword =
      String(book.title).includes(keyword) || String(book.author).includes(keyword);
    const matchGenre = genre === "" || book.genre === genre;
    return matchKeyword && matchGenre;
  });

  renderBooks(result);
}



// 9. 이벤트 연결


// 등록 / 수정 버튼 (폼 제출)
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // 폼 제출 시 페이지 새로고침 막기

  const errorMessage = validateForm();
  if (errorMessage !== "") {
    showMessage(errorMessage, "error");
    return;
  }

  const book = getFormData();
  const id = bookIdInput.value; // 비어 있으면 등록, 값이 있으면 수정

  submitBtn.disabled = true; // 중복 클릭 방지
  try {
    if (id === "") {
      await addBook(book);
      showMessage(`"${book.title}"이(가) 등록되었습니다.`, "success");
    } else {
      await updateBook(id, book);
      showMessage(`"${book.title}"이(가) 수정되었습니다.`, "success");
    }
    resetForm();
  } catch (error) {
    showMessage("오류: " + error.message, "error");
  } finally {
    submitBtn.disabled = false;
  }
});

cancelBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", searchBooks);
genreFilter.addEventListener("change", searchBooks);
reloadBtn.addEventListener("click", loadBooks);



// 10. 기타 함수

function resetForm() {
  form.reset();
  bookIdInput.value = "";
  formTitle.textContent = "새 도서 등록";
  submitBtn.textContent = "등록";
  cancelBtn.hidden = true;
}

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = "message " + type; // success 또는 error
  messageBox.hidden = false;
}


loadBooks();