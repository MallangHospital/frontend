const API_BASE_URL = 'https://mallang-a85bb2ff492b.herokuapp.com/api/news';

// URL에서 매거진 ID 추출
function getMagazineIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

document.addEventListener('DOMContentLoaded', () => {
  const magazineId = getMagazineIdFromURL();
  if (!magazineId) {
    alert('건강매거진 ID가 없습니다.');
    return;
  }

  loadMagazineDetails(magazineId);
});

// 건강매거진 상세 정보 로드
function loadMagazineDetails(id) {
  fetch(`${API_BASE_URL}/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('건강매거진 데이터를 불러오는 데 실패했습니다.');
      }
      return response.json();
    })
    .then((data) => {
      renderMagazineDetails(data);
      console.log(data);
    })
    .catch((error) => {
      console.error('오류 발생:', error);
      const content = document.getElementById('magazine-content');
      content.innerHTML = `<p class="error-message">건강매거진을 불러오는 중 오류가 발생했습니다.</p>`;
    });
}

// 건강매거진 데이터 렌더링
function renderMagazineDetails(news) {
  // 제목
  document.getElementById('magazine-title').textContent =
    news.title || '제목 정보 없음';

  // 작성자 및 날짜
  document.getElementById('magazine-writer').textContent = `작성자: ${
    news.newsWriter || '정보 없음'
  }`;
  document.getElementById('magazine-date').textContent = `작성일: ${
    news.regDate || '날짜 없음'
  }`;

  // 본문
  const body = document.getElementById('magazine-body');
  body.innerHTML = news.content || '<p>본문 정보가 없습니다.</p>';

  // 대표 이미지
  const mainImage = document.getElementById('main-image');
  if (news.mainFile) {
    mainImage.src = news.mainFile;
    mainImage.alt = news.title;
  } else {
    mainImage.src = 'assets/default.jpg';
    mainImage.alt = '기본 이미지';
  }

  // 첨부파일
  const attachmentContainer = document.getElementById('magazine-attachment');
  if (news.attachment) {
    attachmentContainer.innerHTML = `
      <a href="${news.attachment}" target="_blank">첨부파일 다운로드</a>
    `;
  } else {
    attachmentContainer.innerHTML = '<p>첨부파일이 없습니다.</p>';
  }
}
