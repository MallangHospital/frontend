// 비밀번호 확인용 상수 (하드코딩 예시)
const CORRECT_PASSWORD = '1234'; // 실제 구현에서는 서버와 통신 필요

// 폼 제출 이벤트 리스너
document
  .querySelector('#noticeForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault(); // 폼 제출 기본 동작 막기

    const title = document.getElementById('title').value.trim();
    const noticeWriter = document.getElementById('noticeWriter').value.trim();
    const password = document.getElementById('password').value.trim();
    const content = document.getElementById('content').value.trim();

    // 제목 확인
    if (!title) {
      showModal('제목이 입력되지 않았습니다. 다시 확인해 주세요.');
      return;
    }

    // 작성자 확인
    if (!noticeWriter) {
      showModal('작성자가 입력되지 않았습니다. 다시 확인해 주세요.');
      return;
    }

    // 비밀번호 확인
    const isPasswordValid = await checkPassword(password);
    if (!isPasswordValid) {
      showModal('비밀번호가 올바르지 않습니다. 다시 확인해 주세요.');
      return;
    }

    // 본문 확인
    if (!content) {
      showModal('본문이 입력되지 않았습니다. 내용을 입력해 주세요.');
      return;
    }

    // 성공적으로 제출되었을 경우
    showModal('공지사항이 성공적으로 등록되었습니다!');
  });

// 비밀번호 확인 함수
async function checkPassword(inputPassword) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(inputPassword === CORRECT_PASSWORD); // 입력된 비밀번호를 확인
    }, 500); // 서버 응답 시간 시뮬레이션 (0.5초)
  });
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
