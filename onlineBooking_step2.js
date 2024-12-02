function submitReservation() {
  // 증상 입력값 확인
  const symptomInput = document.querySelector('.symptom-input').value.trim();

  if (!symptomInput) {
      alert("증상을 입력해 주세요.");
      return; // 증상이 비었으면 요청을 보내지 않음
  }

  // 현재 날짜와 시간을 구하기
  const now = new Date();
  const registrationDate = now.toISOString().split("T")[0]; // YYYY-MM-DD 형식
  const registrationTime = now.toTimeString().split(" ")[0].slice(0, 5); // HH:mm 형식

  // 예약 데이터 구성
  const registrationData = {
      visitType: localStorage.getItem("appointmentType"),
      department: localStorage.getItem("department"),
      doctorName: localStorage.getItem("doctorName"),
      registrationDate: registrationDate, // 접수 날짜 (오늘 날짜)
      registrationTime: registrationTime, // 접수 시간 (현재 시간)
  };

  console.log("전송할 예약 데이터:", registrationData);

  // 백엔드로 데이터 전송
  fetch("https://mallang-a85bb2ff492b.herokuapp.com/api/registrations", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
  })
      .then((response) => {
          if (response.ok) {
              return response.json(); // JSON 응답 처리
          } else {
              throw new Error("예약 요청에 실패했습니다.");
          }
      })
      .then((data) => {
          console.log("백엔드 응답:", data);
          showPopup(); // 성공 시 팝업 표시
      })
      .catch((error) => {
          console.error("예약 처리 중 오류 발생:", error);
          alert("예약 처리 중 문제가 발생했습니다. 다시 시도해 주세요.");
      });
}

function closePopup() {
  // 팝업창 숨기기
  document.getElementById('reservationPopup').style.display = 'none';
  window.location.href = "/"; // 확인 후 메인 페이지로 리다이렉트
}

function showPopup() {
  document.getElementById('reservationPopup').style.display = 'flex';
}

