const jwtToken = localStorage.getItem('jwtToken');
if (!jwtToken) {
  alert('로그인이 필요합니다.');
  window.location.href = '/login.html'; // 로그인 페이지로 리다이렉트
  return; // 이후 코드 실행을 막습니다.
}

// 이메일 선택 시 도메인 입력 필드 자동 설정
document.getElementById('email-select').addEventListener('change', function () {
  const emailDomain = document.getElementById('email-domain');
  emailDomain.value = this.value; // 선택된 옵션을 이메일 도메인 입력 필드에 설정
});

async function validateAndSubmit() {
  // 입력 값 가져오기
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const emailPrefix = document.getElementById('email-prefix').value.trim();
  const emailDomain = document.getElementById('email-domain').value.trim();

  // 이메일 정규식 선언
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 정규식

  const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;

  if (!phoneRegex.test(phone)) {
    showModal(
      '전화번호 형식이 올바르지 않습니다. 000-0000-0000 형식으로 입력해주세요.'
    );
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

  // 서버로 전송할 데이터 객체 생성
  const feedback = {
    title,
    content,
    name,
    phoneNumber: phone,
    email,
  };

  try {
    // 서버에 POST 요청
    const response = await fetch(
      'https://mallang-a85bb2ff492b.herokuapp.com/api/feedback',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      }
    );

    // 응답 처리
    if (response.ok) {
      window.location.href = 'submission_complete.html';
    } else {
      const error = await response.text();
      showModal(error); // 서버에서 반환된 오류 메시지 표시
    }
  } catch (error) {
    // 네트워크 오류 처리
    console.error('Network Error:', error.message);
    showModal('서버와의 통신에 실패했습니다. 다시 시도해 주세요.');
  }
}

// 폼 제출 이벤트 리스너
document
  .querySelector('.form')
  .addEventListener('submit', async function (event) {
    event.preventDefault(); // 폼 제출 기본 동작 막기
    validateAndSubmit();
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
