// 폼 제출 이벤트 리스너
document
  .querySelector('#noticeForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault(); // 폼 제출 기본 동작 막기
    validateAndSubmit();
  });

async function validateAndSubmit() {
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
  if (!password) {
    showModal('비밀번호가 입력되지 않았습니다. 다시 확인해주세요');
    return;
  }

  // 본문 확인
  if (!content) {
    showModal('본문이 입력되지 않았습니다. 내용을 입력해 주세요.');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('writer', noticeWriter);
  formData.append('email', 'test@example.com'); // 이메일 필드 예시
  formData.append('password', password);
  formData.append('isSecret', true); // 비밀글 여부 예시
  // 임의의 대표 이미지 생성
  const representativeImageBlob = new Blob(['This is a fake image content'], {
    type: 'image/png',
  });
  formData.append(
    'representativeImage',
    representativeImageBlob,
    'fake-image.png'
  );

  // 임의의 첨부 파일 생성
  const attachmentBlob = new Blob(['This is a fake attachment content'], {
    type: 'text/plain',
  });
  formData.append('attachment', attachmentBlob, 'fake-file.txt');
  formData.append('content', content);
  formData.append('link', 'http://example.com'); // 링크 필드 예시
  formData.append('captcha', '12345'); // CAPTCHA 예시

  console.log(formData);

  try {
    // 서버에 POST 요청
    const response = await fetch(
      'https://mallang-a85bb2ff492b.herokuapp.com/admin/notices',
      {
        method: 'POST',
        body: formData,
      }
    );

    // 응답 처리
    if (response.ok) {
      const result = await response.text();
      showModal(result); // 성공 메시지 표시
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