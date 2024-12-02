const API_BASE_URL = "https://mallang-a85bb2ff492b.herokuapp.com/api/news";

document.addEventListener("DOMContentLoaded", () => {
  loadNews();
});

// 건강매거진 데이터 로드
function loadNews() {
  fetch(API_BASE_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("건강매거진 데이터를 불러오는 데 실패했습니다.");
      }
      return response.json();
    })
    .then((data) => {
      renderNews(data);
    })
    .catch((error) => {
      console.error("오류 발생:", error);
      const container = document.getElementById("news-container");
      container.innerHTML = `<p class="error-message">건강매거진 데이터를 불러오는 중 오류가 발생했습니다.</p>`;
    });
}

// 건강매거진 데이터 렌더링
function renderNews(newsList) {
  const container = document.getElementById("news-container");
  container.innerHTML = ""; // 기존 내용을 초기화

  if (newsList.length === 0) {
    container.innerHTML = `<p class="error-message">등록된 건강매거진이 없습니다.</p>`;
    return;
  }

  newsList.forEach((news) => {
    const newsCard = document.createElement("div");
    newsCard.classList.add("card");

    newsCard.innerHTML = `
      <img src="${news.mainFile || 'assets/default.jpg'}" alt="${news.title}">
      <div class="card-content">
        <h3 class="card-subtitle">${news.newsWriter || '작성자 정보 없음'}</h3>
        <h2 class="card-title">${news.title}</h2>
        <p class="card-description">${truncateText(news.content, 100)}</p>
        <div class="card-info">
          <span>${news.createdAt}</span>
        </div>
      </div>
    `;

    // 카드에 클릭 이벤트 추가
    newsCard.addEventListener("click", () => {
      window.location.href = `health_magazine_in.html?id=${news.id}`;
    });

    container.appendChild(newsCard);
  });
}

// 본문 텍스트 길이 제한
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}
