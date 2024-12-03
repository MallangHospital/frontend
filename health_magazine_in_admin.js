const API_BASE_URL = "https://mallang-a85bb2ff492b.herokuapp.com/api/news";

document.addEventListener("DOMContentLoaded", () => {
  loadMagazineDetails();

  // 글 수정하러 가기 버튼 클릭 이벤트 추가
  document.getElementById("edit-button").addEventListener("click", () => {
    redirectToEditPage();
  });
});

// 건강매거진 상세 정보 로드 함수
async function loadMagazineDetails() {
  // URL에서 ID 파라미터 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const magazineId = urlParams.get("id");

  if (!magazineId) {
    alert("유효하지 않은 요청입니다. ID가 없습니다.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${magazineId}`, {
      method: "GET",
      credentials: "include", // 쿠키 포함
    });

    if (!response.ok) {
      throw new Error("건강매거진 정보를 불러오는 데 실패했습니다.");
    }

    const magazine = await response.json();

    // 데이터 렌더링
    document.getElementById("magazine-title").textContent = magazine.title;
    document.getElementById("magazine-writer").textContent = `작성자: ${magazine.newsWriter}`;
    document.getElementById("magazine-date").textContent = `등록일: ${magazine.regDate}`;
    document.getElementById("magazine-content").innerHTML = magazine.content;

    const magazineImageContainer = document.getElementById("magazine-image-container");
    if (magazine.mainFile) {
      magazineImageContainer.innerHTML = `<img src="${magazine.mainFile}" alt="${magazine.title}">`;
    } else {
      magazineImageContainer.innerHTML = `<img src="placeholder.jpg" alt="이미지 없음">`;
    }

    // 수정 버튼에 ID 저장
    document.getElementById("edit-button").setAttribute("data-id", magazine.id);
  } catch (error) {
    console.error("오류 발생:", error.message);
    alert("건강매거진 정보를 불러오는 중 오류가 발생했습니다.");
  }
}

// 글 수정 페이지로 리다이렉트
function redirectToEditPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const magazineId = urlParams.get("id");

  if (!magazineId) {
    alert("수정할 매거진 ID를 찾을 수 없습니다.");
    return;
  }

  // 수정 페이지로 이동
  window.location.href = `magazine_write_admin.html?id=${magazineId}`;
}
