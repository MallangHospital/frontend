document.getElementById('email-select').addEventListener('change', function () {
  const emailDomain = document.getElementById('email-domain');
  emailDomain.value = this.value; // 선택된 옵션을 이메일 도메인 입력 필드에 설정
});

document.querySelector('.form').addEventListener('submit', function (event) {
  event.preventDefault(); // 폼 제출 막기

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;

  // 제목 확인
  if (!title) {
    showModal('제목이 입력되지 않았습니다. 다시 확인해 주세요.');
    return;
  }

  // 내용 확인
  if (!content) {
    showModal('내용란이 비어 있습니다. 내용을 입력해 주세요.');
    return;
  }

  // 이름 확인
  if (!name) {
    showModal('이름이 입력되지 않았습니다. 다시 확인해 주세요.');
    return;
  }

  // 휴대폰 번호 확인
  if (!phone) {
    showModal('휴대폰 번호가 입력되지 않았습니다. 다시 확인해 주세요.');
    return;
  }

  // 모든 필드가 입력되었으면 폼 제출 (페이지 이동 예시)
  window.location.href = 'submission_complete.html';
});

// 모달 창을 띄우는 함수
function showModal(message) {
  document.getElementById('modal-message').textContent = message;
  document.getElementById('modal').style.display = 'flex';
}

// 모달 창 닫기 버튼
document.getElementById('close-modal').addEventListener('click', function () {
  document.getElementById('modal').style.display = 'none';
});

function validateAndSubmit() {
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();

  // 제목 확인
  if (!title) {
    showModal('제목이 입력되지 않았습니다. 다시 확인해 주세요.');
    return false;
  }

  // 내용 확인
  if (!content) {
    showModal('내용이 입력되지 않았습니다. 내용을 입력해 주세요.');
    return false;
  }

  // 이름 확인
  if (!name) {
    showModal('이름이 입력되지 않았습니다. 다시 확인해 주세요.');
    return false;
  }

  // 휴대폰 번호 확인
  if (!phone) {
    showModal('휴대폰 번호가 입력되지 않았습니다. 다시 확인해 주세요.');
    return false;
  }

  // 모든 필드가 입력되었으면 'submission_complete.html'로 이동
  window.location.href = 'submission_complete.html';
  return false;
}
