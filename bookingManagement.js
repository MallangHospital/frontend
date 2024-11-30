document.addEventListener("DOMContentLoaded", async function () {
  const jwtToken = localStorage.getItem("jwtToken"); // JWT 토큰 가져오기

  // JWT 토큰 없으면 로그인 페이지로 리다이렉트
  if (!jwtToken) {
    alert("관리자 로그인이 필요합니다.");
    window.location.href = "/login.html";
    return;
  }

  // 진료 예약 테이블
  const appointmentTableBody = document.querySelector("#appointment-list");
  const appointmentApiUrl = "https://mallang-a85bb2ff492b.herokuapp.com/api/appointments";

  // 건강검진 예약 테이블
  const healthcareTableBody = document.querySelector("section:nth-of-type(3) tbody");
  const healthcareApiUrl = "https://mallang-a85bb2ff492b.herokuapp.com/healthcareReserve";

  // 진료 예약 데이터 로드
  async function loadAppointments() {
    try {
      const response = await fetch(appointmentApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`, // JWT 토큰 추가
        },
      });

      console.log("진료 예약 응답 상태 코드:", response.status);

      if (response.ok) {
        const appointments = await response.json();
        console.log("진료 예약 응답 데이터:", appointments);
        renderAppointments(appointments);
      } else {
        alert("진료 예약 정보를 불러오는 데 실패했습니다.");
        console.error("Error:", response.status, response.statusText);
      }
    } catch (error) {
      alert("서버 요청 중 문제가 발생했습니다.");
      console.error("Error:", error);
    }
  }

  function renderAppointments(appointments) {
    appointmentTableBody.innerHTML = ""; // 기존 내용 초기화
    appointments.forEach((appointment) => {
      const row = document.createElement("tr");

      const statusClass = appointment.status === "취소" ? "canceled" : "reserved";

    row.innerHTML = `
      <td>${appointment.patientName}</td>
      <td>${appointment.appointmentDate} ${appointment.appointmentTime}</td>
      <td>${appointment.doctorName}</td>
      <td class="${statusClass}">${appointment.status}</td>
      <td>
        <button class="view-details" data-id="${appointment.id}">상세 보기</button>
      </td> `;

      appointmentTableBody.appendChild(row);
    });

    // 상세 보기 버튼에 이벤트 리스너 추가
    document.querySelectorAll(".view-details").forEach((button) => {
      button.addEventListener("click", function () {
        const appointmentId = this.dataset.id; // 버튼의 data-id 값
        console.log(`"상세 보기" 버튼 클릭: 예약 ID = ${appointmentId}`); // 로그 추가
        viewAppointmentDetails(appointmentId); // 상세 보기 함수 호출
      });
    });
  }

  function viewAppointmentDetails(id) {
    console.log(`상세보기 페이지로 이동: 예약 ID = ${id}`); // 로그 추가
    // 상세 정보 페이지로 이동하며, 예약 ID를 URL에 포함
    window.location.href = `/booking_detail_admin.html?id=${id}`;
  }

  // 건강검진 예약 데이터 로드
  async function loadHealthcareReservations() {
    try {
      const response = await fetch(healthcareApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${jwtToken}`, // JWT 토큰 추가
        },
      });

      console.log("건강검진 예약 응답 상태 코드:", response.status);

      if (response.ok) {
        const reservations = await response.json();
        console.log("건강검진 예약 응답 데이터:", reservations);
        renderHealthcareReservations(reservations);
      } else {
        alert("건강검진 예약 정보를 불러오는 데 실패했습니다.");
        console.error("Error:", response.status, response.statusText);
      }
    } catch (error) {
      alert("서버 요청 중 문제가 발생했습니다.");
      console.error("Error:", error);
    }
  }

  function renderHealthcareReservations(reservations) {
    healthcareTableBody.innerHTML = ""; // 기존 내용 초기화
    reservations.forEach((reservation) => {
      const row = document.createElement("tr");
      const statusClass = reservation.status === "취소" ? "canceled" : "reserved";

      row.innerHTML = `
        <td>${reservation.name}</td>
        <td>${reservation.reserveDate}</td>
        <td>${reservation.phoneNumber}</td>
        <td>${reservation.htype}</td>
        <td class="${statusClass}">${reservation.status}</td>
      `;

      healthcareTableBody.appendChild(row);
    });
  }

  // 초기 데이터 로드
  loadAppointments();
  loadHealthcareReservations();
});
