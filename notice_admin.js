const API_BASE_URL = "https://mallang-a85bb2ff492b.herokuapp.com/api/notice";

document.addEventListener("DOMContentLoaded", () => {
  loadNotices();

  // 삭제 버튼 클릭 이벤트 추가
  const deleteAllButton = document.getElementById("deleteAllButton");
  deleteAllButton.addEventListener("click", handleDelete);

  // 글 작성 버튼 클릭 이벤트 추가
  const writeButton = document.getElementById("writeButton");
  writeButton.addEventListener("click", () => {
    window.location.href = 'anounce_write_admin.html';
  });

  // 검색 버튼 클릭 이벤트 추가
  const searchButton = document.querySelector(".search-button");
  searchButton.addEventListener("click", handleSearch);
});

// 공지사항 로드 함수
async function loadNotices() {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "GET",
      credentials: "include", // 쿠키 포함
    });

    if (!response.ok) {
      throw new Error("공지사항 불러오기 실패");
    }

    const notices = await response.json();
    renderNotices(notices);
  } catch (error) {
    console.error("공지사항 로드 오류:", error.message);
    alert("공지사항을 불러오는 중 오류가 발생했습니다.");
  }
}

// 공지사항 렌더링 함수
function renderNotices(notices) {
  const tbody = document.querySelector(".announcement-table tbody");
  tbody.innerHTML = ""; // 기존 내용 초기화

  notices.forEach((notice, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td class="centered-text"><a href="notice_in_admin.html?id=${notice.id}">${notice.title}</a></td>
      <td>공고</td>
      <td>${notice.regDate}</td>
      <td class="checkbox-column"><input type="checkbox" data-id="${notice.id}"></td>
    `;
    tbody.appendChild(row);
  });
}

// 검색 핸들러
async function handleSearch() {
  const searchInput = document.getElementById("search").value.trim(); // 검색창 입력 값 가져오기
  if (!searchInput) {
    alert("검색어를 입력하세요.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "GET",
      credentials: "include", // 쿠키 포함
    });

    if (!response.ok) {
      throw new Error("공지사항 불러오기 실패");
    }

    const notices = await response.json();
    const filteredNotices = notices.filter(notice => notice.title.includes(searchInput)); // 제목으로 필터링
    renderNotices(filteredNotices);
  } catch (error) {
    console.error("검색 오류:", error.message);
    alert("검색 중 오류가 발생했습니다.");
  }
}

// 공지사항 삭제 핸들러
async function handleDelete() {
  const checkboxes = document.querySelectorAll("input[type='checkbox']:checked");

  if (checkboxes.length === 0) {
    alert("삭제할 공지사항을 선택하세요.");
    return;
  }

  const confirmed = confirm("선택한 공지사항을 정말 삭제하시겠습니까?");
  if (!confirmed) return;

  const jwtToken = localStorage.getItem("jwtToken");

  if (!jwtToken) {
    alert("로그인이 필요합니다.");
    window.location.href = "/login.html"; // 로그인 페이지로 이동
    return;
  }

  // 관리자 권한 확인
  const isAdmin = await checkAdminStatus(jwtToken);

  if (!isAdmin) {
    // 비밀번호 입력받기
    const password = prompt("공지사항을 삭제하려면 비밀번호를 입력하세요:");

    if (!password) {
      alert("비밀번호를 입력해야 삭제할 수 있습니다.");
      return;
    }

    // 비밀번호를 body에 포함시켜 요청
    await deleteNotices(checkboxes, jwtToken, password);
  } else {
    // 관리자라면 비밀번호 입력 없이 삭제
    await deleteNotices(checkboxes, jwtToken);
  }
}

// 관리자 권한 체크 함수
async function checkAdminStatus(jwtToken) {
  try {
    const response = await fetch("/api/user/check-admin", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      return false; // 관리자가 아닌 경우
    }

    const data = await response.json();
    return data.isAdmin; // 서버에서 관리자인지 여부를 반환
  } catch (error) {
    console.error("관리자 권한 확인 오류:", error.message);
    return false;
  }
}

// 공지사항 삭제 함수
async function deleteNotices(checkboxes, jwtToken, password = null) {
  try {
    for (const checkbox of checkboxes) {
      const noticeId = checkbox.getAttribute("data-id");

      if (!noticeId) {
        console.error("삭제 오류: ID가 정의되지 않았습니다.");
        continue;
      }

      const bodyData = password ? JSON.stringify({ password }) : null; // 비밀번호가 있으면 포함, 없으면 null

      const response = await fetch(`${API_BASE_URL}/${noticeId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: bodyData, // 비밀번호가 있을 때만 body에 포함
      });

      if (!response.ok) {
        const errorText = await response.json(); // error message를 JSON으로 받기
        console.error("삭제 오류:", errorText);
        alert(`삭제 실패: ${errorText.message || errorText}`); // 응답 메시지 표시
        return;
      }
    }

    alert("선택한 공지사항이 삭제되었습니다.");
    loadNotices(); // 삭제 후 공지사항 다시 불러오기
  } catch (error) {
    console.error("삭제 오류:", error.message);
    alert("공지사항 삭제 중 오류가 발생했습니다.");
  }
}
