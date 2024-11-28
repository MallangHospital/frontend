// 폼 제출 이벤트 리스너
document
  .querySelector('#noticeForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault(); // 폼 제출 기본 동작 막기

    validateAndSubmit();
  });

async function validateAndSubmit() {
  const title = document.getElementById('title').value.trim();
  const noticeWriter = document.getElementById('newsWriter').value.trim();
  const password = document.getElementById('password').value.trim();
  const representativeImage = document.getElementById('main-file').files[0];
  const attachment = document.getElementById('attachment').files[0];
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
    showModal('비밀번호가 입력되지 않았습니다. 다시 확인해 주세요.');
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
  formData.append('password', password);

  // 파일이 존재하는 경우만 추가
  if (representativeImage) {
    formData.append('representativeImage', representativeImage);
  } else {
    console.warn(
      '대표 이미지가 제공되지 않았습니다. 가상 데이터를 추가합니다.'
    );
    const fakeImage = new Blob(['Fake image content'], { type: 'image/png' });
    formData.append('representativeImage', fakeImage, 'fake-image.png');
  }

  if (attachment) {
    formData.append('attachment', attachment);
  } else {
    console.warn('첨부파일이 제공되지 않았습니다. 가상 데이터를 추가합니다.');
    const fakeFile = new Blob(['Fake file content'], { type: 'text/plain' });
    formData.append('attachment', fakeFile, 'fake-file.txt');
  }

  formData.append('content', content);

  try {
    // 서버에 POST 요청
    const response = await fetch(
      'https://mallang-a85bb2ff492b.herokuapp.com/admin/magazines',
      {
        method: 'POST',
        body: formData,
      }
    );

    // 응답 처리
    if (response.ok) {
      const result = await response.text();
      console.log(formData);
      showModal(result); // 성공 메시지 표시
    } else {
      const error = await response.text();
      showModal(`등록 실패: ${error}`); // 서버 오류 메시지 표시
    }
  } catch (error) {
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
