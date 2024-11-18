// 이메일 선택 시 도메인 입력 필드 자동 설정
document.getElementById('email-select').addEventListener('change', function () {
  const emailDomain = document.getElementById('email-domain');
  emailDomain.value = this.value; // 선택된 옵션을 이메일 도메인 입력 필드에 설정
});

// 폼 제출 이벤트 리스너
document.querySelector('.form').addEventListener('submit', function (event) {
  event.preventDefault(); // 폼 제출 기본 동작 막기

  // 입력 값 가져오기
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const emailPrefix = document.getElementById('email-prefix').value.trim();
  const emailDomain = document.getElementById('email-domain').value.trim();

  // 이메일 정규식 선언
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 정규식

  // 입력 필드 검증
  if (!title) {
    showModal('제목이 입력되지 않았습니다. 다시 확인해 주세요.');
    return;
  }
  if (!content) {
    showModal('내용란이 비어 있습니다. 내용을 입력해 주세요.');
    return;
  }
  if (!name) {
    showModal('이름이 입력되지 않았습니다. 다시 확인해 주세요.');
    return;
  }
  if (!phone) {
    showModal('휴대폰 번호가 입력되지 않았습니다. 다시 확인해 주세요.');
    return;
  }

  // 이메일 검증
  let email = '';
  if (emailPrefix || emailDomain) {
    // 이메일 입력 시만 검증
    email = `${emailPrefix}@${emailDomain}`;
    if (!emailRegex.test(email)) {
      showModal('올바른 이메일 형식이 아닙니다. 다시 확인해 주세요.');
      return;
    }
    // 숨겨진 필드에 이메일 저장
    document.getElementById('email').value = email;
  }

  // 모든 필드가 입력되었으면 폼 제출
  window.location.href = 'submission_complete.html'; // 다음 페이지 이동
});

// 모달 창 표시 함수
function showModal(message) {
  document.getElementById('modal-message').textContent = message;
  document.getElementById('modal').style.display = 'flex';
}

// 모달 창 닫기 버튼
document.getElementById('close-modal').addEventListener('click', function () {
  document.getElementById('modal').style.display = 'none';
});
