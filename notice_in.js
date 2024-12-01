const API_BASE_URL = "https://mallang-a85bb2ff492b.herokuapp.com/api/notice";

// URL에서 공지사항 ID 추출
function getNoticeIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

document.addEventListener("DOMContentLoaded", () => {
  const noticeId = getNoticeIdFromURL();
  if (noticeId) {
    loadNoticeDetails(noticeId);
  } else {
    alert("공지사항 ID가 없습니다.");
  }
});

// 공지사항 상세 정보 로드
function loadNoticeDetails(id) {
  fetch(`${API_BASE_URL}/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("공지사항을 불러오는 데 실패했습니다.");
      }
      return response.json();
    })
    .then((data) => {
      renderNoticeDetails(data);
    })
    .catch((error) => {
      console.error("오류 발생:", error);
      document.querySelector(".notice-container").innerHTML = `
        <p class="error-message">공지사항을 불러오는 중 오류가 발생했습니다.</p>
      `;
    });
}

// 공지사항 데이터 렌더링
function renderNoticeDetails(notice) {
  document.getElementById("notice-title").textContent = notice.title;
  document.getElementById("notice-writer").textContent = `작성자: ${notice.noticeWriter}`;
  document.getElementById("notice-date").textContent = `등록일: ${notice.writeDate}`;
  document.getElementById("notice-content").innerHTML = notice.content;
}
