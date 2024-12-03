const API_BASE_URL = "https://mallang-a85bb2ff492b.herokuapp.com/api/my-reservations";

document.addEventListener("DOMContentLoaded", () => {
  initializePage();
});

// 초기화 함수
function initializePage() {
  loadReservations();

  // 건강검진 예약 전체 취소 버튼 이벤트 연결
  const deleteAllButton = document.getElementById("deleteAllButton");
  if (deleteAllButton) {
    deleteAllButton.addEventListener("click", cancelSelectedHealthChecks);
  }
}

// 예약 정보 로드
async function loadReservations() {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`, // JWT 토큰을 헤더에 추가
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`서버 응답 실패: ${errorText || response.status}`);
    }

    const data = await response.json();

    if (!data.appointments || !data.healthChecks) {
      throw new Error("서버 응답 데이터가 올바르지 않습니다.");
    }

    renderDetailedReservations(data.appointments);
    renderHealthChecks(data.healthChecks);
  } catch (error) {
    console.error("예약 정보 로드 오류:", error.message);
    alert("로그인 후 이용가능한 서비스입니다.");
  }
}

// 진료 예약 정보 렌더링
function renderDetailedReservations(appointments) {
  const tbody = document.getElementById("detailed-reservation-tbody");
  if (!tbody) {
    console.error("진료 예약 정보를 렌더링할 테이블을 찾을 수 없습니다.");
    return;
  }

  tbody.innerHTML = ""; // 초기화

  appointments.forEach((appointment) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${appointment.id || "정보 없음"}</td>
      <td>${appointment.doctorId || "정보 없음"}</td>
      <td>${appointment.departmentId || "정보 없음"}</td>
      <td>${appointment.patientName || "정보 없음"}</td>
      <td>${appointment.phoneNum || "정보 없음"}</td>
      <td>${appointment.doctorName || "정보 없음"}</td>
      <td>${appointment.appointmentType || "정보 없음"}</td>
      <td>${appointment.appointmentDate || "정보 없음"}</td>
      <td>${appointment.appointmentTime || "정보 없음"}</td>
      <td>${appointment.symptomDescription || "정보 없음"}</td>
      <td>${appointment.status || "정보 없음"}</td>
    `;
    tbody.appendChild(row);
  });
}

// 건강검진 예약 정보 렌더링
function renderHealthChecks(healthChecks) {
  const tbody = document.getElementById("summary-reservation-tbody");
  if (!tbody) {
    console.error("건강검진 예약 정보를 렌더링할 테이블을 찾을 수 없습니다.");
    return;
  }

  tbody.innerHTML = ""; // 초기화

  healthChecks.forEach((healthCheck) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${healthCheck.hId || "정보 없음"}</td>
      <td>${healthCheck.name || "정보 없음"}</td>
      <td>${healthCheck.memberId || "정보 없음"}</td>
      <td>${healthCheck.phoneNumber || "정보 없음"}</td>
      <td>${healthCheck.reserveDate || "정보 없음"}</td>
      <td>${healthCheck.hType || "정보 없음"}</td>
      <td>${healthCheck.status || "정보 없음"}</td>
      <td>
        <input type="checkbox" class="health-check-checkbox" data-id="${healthCheck.hid}">
      </td>
    `;
    tbody.appendChild(row);
  });
}

// 선택된 건강검진 예약 취소
async function cancelSelectedHealthChecks() {
  const selectedCheckboxes = document.querySelectorAll(".health-check-checkbox:checked");
  const idsToCancel = Array.from(selectedCheckboxes).map((checkbox) => checkbox.getAttribute("data-id"));

  if (idsToCancel.length === 0) {
    alert("취소할 예약을 선택해주세요.");
    return;
  }

  try {
    const cancelPromises = idsToCancel.map((id) =>
        fetch(`${API_BASE_URL}/health-check/${id}/cancel`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`, // JWT 토큰 필요 시 추가
            "Content-Type": "application/json",
          },
          
        })
      );
      

    const responses = await Promise.all(cancelPromises);

    const failedResponses = responses.filter((response) => !response.ok);
    if (failedResponses.length > 0) {
      throw new Error(`일부 예약 취소 실패 (${failedResponses.length}건).`);
    }

    alert("선택된 예약이 성공적으로 취소되었습니다.");
    loadReservations(); // 예약 목록 갱신
  } catch (error) {
    console.error("예약 취소 오류:", error.message);
    alert("예약 취소 중 오류가 발생했습니다. 콘솔을 확인하세요.");
  }
}
