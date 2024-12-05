document.addEventListener("DOMContentLoaded", () => {
    const noticeId = getNoticeIdFromUrl(); // URL에서 공지사항 ID 가져오기
    if (noticeId) {
      loadNotice(noticeId); // 공지사항 정보 불러오기
    }
  
    // 폼 제출 이벤트 처리
    document.getElementById("noticeForm").addEventListener("submit", (event) => {
      event.preventDefault(); // 기본 제출 동작을 막음
      updateNotice(noticeId); // 공지사항 수정 함수 호출
    });
  });
  
  // URL에서 공지사항 ID 추출하는 함수
  function getNoticeIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); // id 파라미터 값 반환
  }
  
  // 공지사항 정보 불러오기
  function loadNotice(id) {
    fetch(`https://mallang-a85bb2ff492b.herokuapp.com/api/notice/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("공지사항을 불러오는 데 실패했습니다.");
        }
        return response.json();
      })
      .then((data) => {
        populateForm(data); // 폼에 데이터 채우기
      })
      .catch((error) => {
        console.error("오류 발생:", error);
        showModal("공지사항 정보를 불러오는데 실패했습니다.");
      });
  }
  
  // 폼에 데이터 채우기
  function populateForm(notice) {
    document.getElementById("title").value = notice.title; // 제목
    document.getElementById("noticeWriter").value = notice.noticeWriter; // 작성자
    document.getElementById("content").value = notice.content; // 본문
    // 비밀번호는 수정 시에는 필요 없을 수 있으므로, 입력하지 않도록 처리할 수도 있습니다.
  }
  
  // 공지사항 수정
  function updateNotice(id) {
    const title = document.getElementById("title").value; // 제목 값
    const noticeWriter = document.getElementById("noticeWriter").value; // 작성자 값
    const password = document.getElementById("password").value; // 비밀번호 값
    const content = document.getElementById("content").value; // 본문 값
  
    const updatedNoticeData = {
      title: title,
      noticeWriter: noticeWriter,
      password: password,
      content: content,
    };
  
    // 입력값이 비어있는지 확인
    if (!title.trim() || !noticeWriter.trim() || !content.trim() || !password.trim()) {
      showModal("모든 필드를 입력해 주세요.");
      return;
    }
  
    // API로 수정된 공지사항 데이터 전송
    fetch(`https://mallang-a85bb2ff492b.herokuapp.com/api/notice/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // JSON 데이터 형식
      },
      body: JSON.stringify(updatedNoticeData), // 수정된 데이터 전송
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("공지사항 수정에 실패했습니다.");
        }
        return response.text(); // 응답 텍스트
      })
      .then((message) => {
        showModal("공지사항이 성공적으로 수정되었습니다.");
      })
      .catch((error) => {
        console.error("오류 발생:", error);
        showModal("공지사항 수정에 실패했습니다. 다시 시도해 주세요.");
      });
  }
  
  // 모달로 메시지 표시
  function showModal(message) {
    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modal-message");
    modalMessage.textContent = message;
    modal.style.display = "block"; // 모달을 화면에 표시
  
    // 모달 닫기 버튼 이벤트
    document.getElementById("close-modal").addEventListener("click", () => {
      modal.style.display = "none"; // 모달 닫기
    });
  }
  