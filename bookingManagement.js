document.addEventListener("DOMContentLoaded", async function () {
  const jwtToken = localStorage.getItem("jwtToken"); // JWT 토큰 가져오기

  if (!jwtToken) {
    alert("관리자 로그인이 필요합니다.");
    window.location.href = "/login.html";
    return;
  }

  const appointmentTableBody = document.querySelector("#appointment-list");
  const appointmentApiUrl = "https://mallang-a85bb2ff492b.herokuapp.com/api/appointments";

  const healthcareTableBody = document.querySelector("section:nth-of-type(3) tbody");
  const healthcareApiUrl = "https://mallang-a85bb2ff492b.herokuapp.com/healthcareReserve";

  async function loadAppointments() {
    try {
      console.log("진료 예약 요청 시작:", appointmentApiUrl);
      const response = await fetch(appointmentApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      console.log("진료 예약 응답 상태 코드:", response.status);
      const responseBody = await response.text(); // 응답을 텍스트로 먼저 읽음
      console.log("진료 예약 응답 원본 데이터:", responseBody);

      if (response.ok) {
        const appointments = JSON.parse(responseBody);
        console.log("진료 예약 파싱된 데이터:", appointments);
        renderAppointments(appointments);
      } else {
        alert("진료 예약 정보를 불러오는 데 실패했습니다.");
        console.error("진료 예약 요청 실패 상태:", response.status, response.statusText);
      }
    } catch (error) {
      alert("진료 예약 데이터 요청 중 문제가 발생했습니다.");
      console.error("진료 예약 요청 중 오류:", error);
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
        </td>`;

      appointmentTableBody.appendChild(row);
    });

    document.querySelectorAll(".view-details").forEach((button) => {
      button.addEventListener("click", function () {
        const appointmentId = this.dataset.id; // id를 가져옴
        console.log(`"상세 보기" 버튼 클릭: 예약 ID = ${appointmentId}`);
        viewAppointmentDetails(appointmentId);
      });
    });
  }

  function viewAppointmentDetails(appointmentId) {
    console.log(`상세보기 페이지로 이동: 예약 ID = ${appointmentId}`);
    window.location.href = `/booking_detail_admin.html?id=${appointmentId}`;
  }

  async function loadHealthcareReservations() {
    try {
      console.log("건강검진 예약 요청 시작:", healthcareApiUrl);
      const response = await fetch(healthcareApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("건강검진 예약 응답 상태 코드:", response.status);
      const responseBody = await response.text(); // 응답을 텍스트로 먼저 읽음
      console.log("건강검진 예약 응답 원본 데이터:", responseBody);

      if (response.ok) {
        const reservations = JSON.parse(responseBody);
        console.log("건강검진 예약 파싱된 데이터:", reservations);
        renderHealthcareReservations(reservations);
      } else {
        alert("건강검진 예약 정보를 불러오는 데 실패했습니다.");
        console.error("건강검진 예약 요청 실패 상태:", response.status, response.statusText);
      }
    } catch (error) {
      alert("건강검진 예약 데이터 요청 중 문제가 발생했습니다.");
      console.error("건강검진 예약 요청 중 오류:", error);
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

  loadAppointments();
  loadHealthcareReservations();
});
