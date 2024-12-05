document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id'); // URL에서 id 추출
  if (id) {
    loadNews(id); // 뉴스 데이터를 로드
  } else {
    alert('유효한 뉴스 ID가 필요합니다.');
  }
});

// 뉴스 데이터 로드 함수
const loadNews = async (newsId) => {
  try {
    const response = await fetch(
      `https://mallang-a85bb2ff492b.herokuapp.com/api/news/${newsId}`
    );
    if (!response.ok) {
      throw new Error('뉴스를 불러오는 데 실패했습니다.');
    }
    const newsData = await response.json();
    populateForm(newsData); // 데이터를 폼에 채워넣기
  } catch (error) {
    console.error(error.message);
    alert('뉴스를 불러오는 데 문제가 발생했습니다.');
  }
};

// 폼에 데이터 채우기
const populateForm = (newsData) => {
  document.querySelector('#title').value = newsData.title || '';
  document.querySelector('#newsWriter').value = newsData.newsWriter || '';
  document.querySelector('#password').value = newsData.password || '';
  document.querySelector('#content').value = newsData.content || '';

  if (newsData.mainFileBase64) {
    // Base64 데이터를 표시하거나 다운로드 링크를 제공
    const mainFilePreview = document.createElement('img');
    mainFilePreview.src = `data:image/*;base64,${newsData.mainFileBase64}`;
    mainFilePreview.alt = '대표 이미지';
    mainFilePreview.style.maxWidth = '200px';
    document
      .querySelector('#main-file')
      .insertAdjacentElement('afterend', mainFilePreview);
  }

  if (newsData.attachmentBase64) {
    // Base64 첨부 파일을 다운로드 링크로 표시
    const attachmentLink = document.createElement('a');
    attachmentLink.href = `data:application/octet-stream;base64,${newsData.attachmentBase64}`;
    attachmentLink.download = '첨부파일';
    attachmentLink.textContent = '첨부 파일 다운로드';
    document
      .querySelector('#attachment')
      .insertAdjacentElement('afterend', attachmentLink);
  }
};

// 폼 제출 이벤트 리스너
document
  .querySelector('#noticeForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault(); // 폼 제출 기본 동작 막기

    validateAndSubmit();
  });

async function validateAndSubmit() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  const title = document.getElementById('title').value;
  const newsWriter = document.getElementById('newsWriter').value.trim();
  const password = document.getElementById('password').value.trim();
  const content = document.getElementById('content').value;
  const mainFile = document.getElementById('main-file').files[0];
  const attachment = document.getElementById('attachment').files[0];

  // 1. JSON 데이터 준비
  const newsDTO = {
    title,
    newsWriter,
    password,
    content,
  };

  const formData = new FormData();
  formData.append('newsDTO', JSON.stringify(newsDTO)); // JSON 문자열로 변환
  if (mainFile) formData.append('mainFile', mainFile); // 대표 이미지 파일 추가
  if (attachment) formData.append('attachment', attachment); // 첨부파일 추가

  try {
    // 서버에 POST 요청
    const response = await fetch(
      `https://mallang-a85bb2ff492b.herokuapp.com/api/news/${id}`,
      {
        method: 'PUT',
        body: formData, // FormData는 Content-Type 자동 설정
      }
    );

    // 응답 처리
    if (response.ok) {
      showModal('건강 매거진이 성공적으로 수정되었습니다!', function () {
        window.location.href = 'health_magazine_admin.html'; // 확인 버튼 누르면 이동
      });
    } else {
      const error = await response.text();
      showModal(`등록 실패: ${error}`); // 서버 오류 메시지 표시
    }
  } catch (error) {
    console.error('Network Error:', error.message);
    showModal('서버와의 통신에 실패했습니다. 다시 시도해 주세요.');
  }
}
// 모달 표시 함수 (Callback 사용)
function showModal(message, onCloseCallback = null) {
  const modal = document.getElementById('modal');
  const modalMessage = document.getElementById('modal-message');
  const closeButton = document.getElementById('close-modal'); // 확인 버튼

  modalMessage.textContent = message;
  modal.style.display = 'flex'; // 모달 표시

  // 확인 버튼 클릭 이벤트 등록
  closeButton.onclick = function () {
    modal.style.display = 'none'; // 모달 숨기기
    if (onCloseCallback) {
      onCloseCallback(); // 콜백 함수 실행
    }
  };
}