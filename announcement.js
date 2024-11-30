// 폼 제출 이벤트 리스너
document
  .querySelector('#noticeForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault(); // 폼 제출 기본 동작 막기
    validateAndSubmit();
  });

async function validateAndSubmit() {
  const title = document.getElementById('title').value;
  const noticeWriter = document.getElementById('noticeWriter').value.trim();
  const password = document.getElementById('password').value.trim();
  const content = document.getElementById('content').value;

  const noticeData = {
    title,
    noticeWriter,
    password,
    content,
  };

  try {
    // 서버에 POST 요청
    const response = await fetch(
      'https://mallang-a85bb2ff492b.herokuapp.com/api/notice',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Content-Type 헤더 설정
        },
        body: JSON.stringify(noticeData),
      }
    );

    // 응답 처리
    if (response.ok) {
      showModal('공지사항이 성공적으로 등록되었습니다!');
      window.location.href = 'notice_admin.html';
    } else {
      const error = await response.text();
      showModal(`${error}`); // 서버에서 반환된 오류 메시지 표시
    }
  } catch (error) {
    // 네트워크 오류 처리
    console.error('Network Error:', error.message);
    showModal('서버와의 통신에 실패했습니다. 다시 시도해 주세요.');
  }
}

// 모달 표시 함수
function showModal(message) {
  const modal = document.getElementById('modal');
  const modalMessage = document.getElementById('modal-message');
  modalMessage.textContent = message;
  modal.style.display = 'flex'; // 모달 표시
}

// 모달 닫기 이벤트
document.getElementById('close-modal').addEventListener('click', function () {
  const modal = document.getElementById('modal');
  modal.style.display = 'none'; // 모달 숨기기
});
