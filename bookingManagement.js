document.addEventListener("DOMContentLoaded", async function () {
    const appointmentList = document.getElementById("appointment-list");
    const apiUrl = "https://mallang-a85bb2ff492b.herokuapp.com/api/appointments";

    // 예약 정보 로드 함수
    async function loadAppointments() {
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const appointments = await response.json();
                renderAppointments(appointments);
            } else {
                alert("예약 정보를 불러오는 데 실패했습니다.");
                console.error("Error:", response.statusText);
            }
        } catch (error) {
            alert("서버 요청 중 문제가 발생했습니다.");
            console.error("Error:", error);
        }
    }

    // 예약 정보를 테이블에 렌더링
    function renderAppointments(appointments) {
        appointmentList.innerHTML = ""; // 기존 내용 초기화
        appointments.forEach((appointment) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${appointment.patientName}</td>
                <td>${appointment.appointmentDate} ${appointment.appointmentTime}</td>
                <td>${appointment.doctorName}</td>
                <td class="status">${appointment.appointmentType}</td>
                <td><a href="booking_detail_admin.html?id=${appointment.id}">상세보기</a></td>
            `;

            appointmentList.appendChild(row);
        });
    }

    // 초기 데이터 로드
    loadAppointments();
});
