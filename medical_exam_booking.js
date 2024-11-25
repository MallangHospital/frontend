$(function () {
  $("#datepicker").datepicker({
    dateFormat: "yy-mm-dd",
    showOtherMonths: true,
    selectOtherMonths: true,
    showButtonPanel: true,
  });
});

// 팝업 표시/닫기 함수
function showCompletionPopup() {
  document.getElementById("completionPopup").style.display = "flex";
}
function closeCompletionPopup() {
  document.getElementById("completionPopup").style.display = "none";
  window.location.href = "home.html"; // 홈 페이지로 이동
}





// 팝업 테스트 버튼 이벤트
document.getElementById("testPopupBtn").addEventListener("click", function () {
  showCompletionPopup(); // 팝업 표시
});

function validateAndSubmitForm(event) {
  event.preventDefault();

  const date = document.getElementById('datepicker').value;
  const name = document.getElementById('name').value.trim();
  const phoneNo = document.getElementById('phoneNo').value.trim();
  const checkupCd = document.querySelector('input[name="checkupCd"]:checked');

  // 휴대폰 번호 정규식
  const phonePattern = /^01[016789]-\d{3,4}-\d{4}$/;

  // 유효성 검사
  if (!date) {
      alert("예약 날짜를 선택해 주세요.");
      return;
  }
  if (!name) {
      alert("이름을 입력해 주세요.");
      return;
  }
  if (!phoneNo) {
      alert("휴대폰번호를 입력해 주세요.");
      return;
  }
  if (!phonePattern.test(phoneNo)) {
      alert("휴대폰 번호를 010-0000-0000 형식으로 입력해주세요.");
      return;
  }
  if (!checkupCd) {
      alert("검진 구분을 선택해 주세요.");
      return;
  }

  // 서버로 전송할 데이터 준비
  const requestData = {
      name: name,
      phoneNumber: phoneNo,
      reserveDate: date,
      hType: checkupCd.value, // 백엔드의 HealthcareType에 맞게 전달
  };

  // 서버로 요청 전송
  $.ajax({
      url: "/healthcareReserve",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(requestData),
      success: function (response) {
          showCompletionPopup();
      },
      error: function (xhr) {
          alert("예약 처리 중 문제가 발생했습니다. 다시 시도해 주세요.");
      },
  });
}

$(document).ready(function () {
  $("#rFrm").on("submit", validateAndSubmitForm);
});
