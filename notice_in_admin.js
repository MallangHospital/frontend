const API_BASE_URL = "https://mallang-a85bb2ff492b.herokuapp.com/api/notice";

document.addEventListener("DOMContentLoaded", () => {
  loadNoticeDetails();

  // '목록' 버튼 클릭 시 이벤트
  document.getElementById("goBackButton").addEventListener("click", () => {
    window.location.href = "notice_admin.html";
  });

  // '글 작성 버튼' 클릭 이벤트 추가
  const writeButton = document.getElementById("writeButton2");
  writeButton.addEventListener("click", () => {
    // 현재 공지사항 ID를 쿼리 파라미터로 전달
    const urlParams = new URLSearchParams(window.location.search);
    const noticeId = urlParams.get("id");
    window.location.href = `announce_modify_admin.html?id=${noticeId}`;
  });
});

// 공지사항 상세 정보를 로드하는 함수
async function loadNoticeDetails() {
  // URL에서 ID 파라미터 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const noticeId = urlParams.get("id");

  if (!noticeId) {
    alert("유효하지 않은 요청입니다. ID가 없습니다.");
    return;
  }

  try {
    // 공지사항 데이터 가져오기
    const response = await fetch(`${API_BASE_URL}/${noticeId}`);
    if (!response.ok) {
      throw new Error("공지사항 정보를 불러오는 데 실패했습니다.");
    }
    const notice = await response.json();

    // HTML에 공지사항 데이터 렌더링
    document.getElementById("notice-title").textContent = notice.title;
    document.getElementById("notice-writer").textContent = `작성자: ${notice.noticeWriter}`;
    document.getElementById("notice-date").textContent = `등록일: ${notice.regDate}`;
    document.getElementById("notice-content").innerHTML = notice.content;

    // 이전글과 다음글 링크 렌더링
    renderPrevNextLinks(noticeId);
  } catch (error) {
    console.error("오류 발생:", error.message);
    alert("공지사항 정보를 불러오는 중 오류가 발생했습니다.");
  }
}

// 이전글 및 다음글 렌더링 함수
async function renderPrevNextLinks(currentId) {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error("공지사항 목록을 불러오는 데 실패했습니다.");
    }
    const notices = await response.json();

    // 현재 공지사항 ID를 기준으로 이전글과 다음글 찾기
    const currentIndex = notices.findIndex((notice) => notice.id == currentId);
    const prevNotice = notices[currentIndex - 1];
    const nextNotice = notices[currentIndex + 1];

    // 이전글 링크
    const prevNoticeElement = document.getElementById("prev-notice");
    if (prevNotice) {
      prevNoticeElement.innerHTML = `<span class="label">이전글</span> <a href="?id=${prevNotice.id}">${prevNotice.title}</a>`;
    } else {
      prevNoticeElement.textContent = "이전글이 없습니다.";
    }

    // 다음글 링크
    const nextNoticeElement = document.getElementById("next-notice");
    if (nextNotice) {
      nextNoticeElement.innerHTML = `<span class="label">다음글</span> <a href="?id=${nextNotice.id}">${nextNotice.title}</a>`;
    } else {
      nextNoticeElement.textContent = "다음글이 없습니다.";
    }
  } catch (error) {
    console.error("오류 발생:", error.message);
  }
}
