$(document).ready(function () {
    // Datepicker 설정
    $(function () {
        $("#datepicker").datepicker({
            dateFormat: "yy-mm-dd",
            showOtherMonths: true,
            selectOtherMonths: true,
            showButtonPanel: true,
            onSelect: function (selectedDate) {
                const selectedDateObj = new Date(selectedDate);
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0); // 현재 날짜의 시간 초기화
    
                // 과거 날짜인 경우 경고 메시지 띄우고 선택 초기화
                if (selectedDateObj < currentDate) {
                    alert("현재 날짜 이후의 날짜를 선택해주세요.");
                    $("#datepicker").val(""); // 선택된 값 초기화
                }
            }
        });
    });
    

    // 시간 버튼 클릭 시 active 상태 관리
    $(".time-button").click(function () {
        $(".time-button").removeClass("active"); // 기존 활성화 제거
        $(this).addClass("active"); // 클릭한 버튼 활성화
    });
});

// 예약 처리 함수
function submitReservation() {
    const date = $("#datepicker").val(); // 선택한 날짜
    const selectedTime = document.querySelector(".time-button.active")?.innerText; // 선택한 시간
    const symptoms = document.querySelector(".symptom-input").value.trim(); // 증상 설명

    // 로컬 스토리지에서 데이터 가져오기
    const doctorId = localStorage.getItem("doctorId");
    const departmentId = localStorage.getItem("departmentId");
    const appointmentType = localStorage.getItem("appointmentType");

    // 유효성 검사
    if (!date) {
        alert("예약 날짜를 선택해주세요.");
        return;
    }
    if (!selectedTime) {
        alert("예약 시간을 선택해주세요.");
        return;
    }
    if (!symptoms) {
        alert("증상을 입력해주세요.");
        return;
    }

    // 예약 데이터 구성
    const requestData = {
        doctorId: parseInt(doctorId, 10), // 의사 ID
        departmentId: parseInt(departmentId, 10), // 진료과 ID
        appointmentType: appointmentType, // 진료 유형
        appointmentDate: date, // 예약 날짜
        appointmentTime: selectedTime, // 예약 시간
        symptomDescription: symptoms, // 증상 설명
    };


    // 백엔드로 데이터 전송
    fetch("https://mallang-a85bb2ff492b.herokuapp.com/api/appointments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("예약 요청에 실패했습니다.");
            }
        })
        .then((data) => {
            // 예약 성공 팝업 표시
            showPopup();
        })
        .catch((error) => { 
            alert("예약 처리 중 문제가 발생했습니다. 다시 시도해주세요.");
            console.error(error);
        });
}

// 예약 완료 팝업 열기
function showPopup() {
    document.getElementById("reservationPopup").style.display = "flex";
}

// 예약 완료 팝업 닫기 및 리다이렉트
function closePopup() {
    document.getElementById("reservationPopup").style.display = "none";
    window.location.href = "home.html"; // 확인 후 홈 화면으로 이동
}