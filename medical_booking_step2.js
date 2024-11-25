function submitReservation() {
    const date = $("#datepicker").val(); // 예약 날짜
    const selectedTime = document.querySelector('.time-button.active')?.innerText; // 예약 시간
    const symptoms = document.querySelector('.symptom-input').value; // 증상 설명

    // 로컬 스토리지에서 저장된 데이터 가져오기
    const doctorId = localStorage.getItem("selectedDoctorId");
    const departmentId = localStorage.getItem("selectedDepartment");

    // 유효성 검사
    if (!date) {
        alert("날짜를 선택해주세요.");
        return;
    }
    if (!selectedTime) {
        alert("시간을 선택해주세요.");
        return;
    }
    if (!symptoms) {
        alert("증상을 입력해주세요.");
        return;
    }

    // 예약 데이터 생성
    const requestData = {
        doctorId: doctorId,
        departmentId: departmentId,
        appointmentDate: date,
        appointmentTime: selectedTime,
        symptomDescription: symptoms
    };

    // 백엔드로 POST 요청
    fetch("/api/appointments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("예약 요청 실패");
            }
        })
        .then(data => {
            // 예약 완료 팝업 표시
            showPopup();
        })
        .catch(error => {
            alert("예약 처리 중 문제가 발생했습니다. 다시 시도해주세요.");
            console.error(error);
        });
}
