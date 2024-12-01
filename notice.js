const API_BASE_URL = "https://mallang-a85bb2ff492b.herokuapp.com/api/notice";

document.addEventListener("DOMContentLoaded", () => {
  loadNotices();

  // 검색 버튼 클릭 이벤트 추가
  const searchButton = document.querySelector(".search-button");
  searchButton.addEventListener("click", handleSearch);
});

// 공지사항 목록 로드
async function loadNotices() {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      credentials: "include", // 쿠키 포함
    });

    if (!response.ok) {
      throw new Error("공지사항 불러오기 실패");
    }

    const notices = await response.json();
    renderNotices(notices);
  } catch (error) {
    console.error("공지사항 데이터를 가져오는 중 오류 발생:", error.message);
    alert("공지사항 데이터를 불러오는 중 오류가 발생했습니다.");
  }
}

// 검색 핸들러
async function handleSearch() {
  const searchInput = document.getElementById("search").value.trim(); // 검색창 입력 값 가져오기
  if (!searchInput) {
    alert("검색어를 입력하세요.");
    return;
  }

  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      credentials: "include", // 쿠키 포함
    });

    if (!response.ok) {
      throw new Error("공지사항 불러오기 실패");
    }

    const notices = await response.json();
    const filteredNotices = notices.filter(notice =>
      notice.title.includes(searchInput)
    ); // 제목으로 필터링
    renderNotices(filteredNotices);
  } catch (error) {
    console.error("검색 오류:", error.message);
    alert("검색 중 오류가 발생했습니다.");
  }
}

// 공지사항 데이터 렌더링
function renderNotices(notices) {
  const tableBody = document.querySelector(".announcement-table tbody");
  tableBody.innerHTML = ""; // 기존 내용을 초기화

  if (notices.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="centered-text">검색된 공지사항이 없습니다.</td>
      </tr>`;
    return;
  }

  notices.forEach((notice, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td class="centered-text">
        <a href="notice_in.html?id=${notice.id}">${notice.title}</a>
      </td>
      <td>공고</td>
      <td>${notice.writeDate}</td>
    `;
    tableBody.appendChild(row);
  });
}
