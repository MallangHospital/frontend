
const API_BASE_URL = "https://mallang-a85bb2ff492b.herokuapp.com/api/news";

document.addEventListener("DOMContentLoaded", () => {
  loadMagazines();

  // '글 작성하러 가기' 버튼 클릭 시 이벤트
  document.getElementById("writeButton").addEventListener("click", () => {
    window.location.href = "magazine_write_admin.html";
  });
});

// 건강매거진 데이터 로드 함수
async function loadMagazines() {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      credentials: "include", // 쿠키 포함
    });

    if (!response.ok) {
      throw new Error("건강매거진 데이터를 불러오는 데 실패했습니다.");
    }

    const magazines = await response.json();
    renderMagazines(magazines);
  } catch (error) {
    console.error("오류 발생:", error.message);
    alert("건강매거진 데이터를 불러오는 중 오류가 발생했습니다.");
  }
}

// 건강매거진 카드 렌더링 함수
function renderMagazines(magazines) {
  const container = document.getElementById("magazine-cards-container");
  container.innerHTML = ""; // 기존 내용 초기화

  magazines.forEach((magazine) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-img-container">
        <img src="${magazine.mainFile || 'placeholder.jpg'}" alt="${magazine.title}">
        <button class="close-btn" data-id="${magazine.id}">X</button>
      </div>
      <div class="card-content">
        <h3 class="card-subtitle">${magazine.newsWriter || "작성자 정보 없음"}</h3>
        <h2 class="card-title">${magazine.title}</h2>
        <p class="card-description">${truncateText(magazine.content, 100)}</p>
        <div class="card-info">
          <span>${magazine.regDate || "날짜 정보 없음"}</span>
        </div>
      </div>
    `;

    // 카드 클릭 이벤트 추가 (health_magazine_in_admin.html로 이동)
    card.addEventListener("click", () => {
      window.location.href = `health_magazine_in_admin.html?id=${magazine.id}`;
    });

    // 삭제 버튼 이벤트 추가
    card.querySelector(".close-btn").addEventListener("click", (event) => {
      event.stopPropagation(); // 클릭 이벤트 전파 방지
      handleDelete(magazine.id);
    });

    container.appendChild(card);
  });
}

// 텍스트 길이 제한 함수
function truncateText(text, maxLength) {
  if (!text) return "내용 없음";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

// 건강매거진 삭제 함수
async function handleDelete(id) {
  const confirmed = confirm("해당 건강매거진을 삭제하시겠습니까?");
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("건강매거진 삭제에 실패했습니다.");
    }

    alert("건강매거진이 삭제되었습니다.");
    loadMagazines(); // 삭제 후 데이터 갱신
  } catch (error) {
    console.error("오류 발생:", error.message);
    alert("건강매거진 삭제 중 오류가 발생했습니다.");
  }
}

