$(document).ready(function () {
    const baseUrl = "https://mallang-a85bb2ff492b.herokuapp.com"; // API Base URL
    const doctorId = localStorage.getItem("doctorId"); // 로컬 스토리지에서 의사 ID 가져오기

    // 캘린더 초기화
    initializeDatepicker(doctorId, baseUrl);

    // 시간 버튼 클릭 시 active 상태 관리
    $(".time-button").click(function () {
        $(".time-button").removeClass("active"); // 기존 활성화 제거
        $(this).addClass("active"); // 클릭한 버튼 활성화
    });
});

// 캘린더 초기화
function initializeDatepicker(doctorId, baseUrl) {
    $("#datepicker").datepicker({
        dateFormat: "yy-mm-dd",
        showOtherMonths: true,
        selectOtherMonths: true,
        onSelect: function (selectedDate) {
            const selectedDateObj = new Date(selectedDate); // 선택한 날짜 객체
            const today = new Date(); // 현재 날짜
            today.setHours(0, 0, 0, 0); // 현재 날짜의 시간 초기화

            // 예약 가능한 시간 가져오기
            fetchAvailableTimes(doctorId, selectedDate, baseUrl);
        }
    });
}

function updateTimeButtons(availableTimes) {
    $(".time-button").each(function () {
        const time = $(this).text().trim(); // 버튼 텍스트 (시간)
        if (availableTimes.includes(time)) {
            $(this).prop("disabled", false).removeClass("disabled");
        } else {
            $(this).prop("disabled", true).addClass("disabled");
        }
    });
}


async function fetchAvailableTimes(doctorId, date, baseUrl) {
    try {
        const apiUrl = `https://mallang-a85bb2ff492b.herokuapp.com/api/schedules?doctorId=${doctorId}&date=${date}`;
        console.log("예약 가능한 시간 API 요청 URL:", apiUrl);

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const rawData = await response.json();
            console.log("예약 가능한 시간 원본 데이터:", rawData);

            // 데이터가 배열 형태로 반환된 경우
            if (Array.isArray(rawData) && rawData.length > 0) {
                // 첫 번째 객체의 `availableTimes` 배열 가져오기
                const availableTimes = rawData[0].availableTimes.map((time) => time.slice(0, 5));
                console.log("예약 가능한 시간 변환된 데이터:", availableTimes);

                updateTimeButtons(availableTimes); // 시간 버튼 업데이트
            } else {
                console.error("예약 가능한 시간이 없습니다.");
                updateTimeButtons([]); // 빈 배열 전달하여 모든 버튼 비활성화
            }
        } else {
            console.error("예약 가능한 시간 가져오기 실패:", response.status);
            alert("예약 가능한 시간을 불러오는 데 실패했습니다.");
        }
    } catch (error) {
        console.error("네트워크 오류:", error);
        alert("네트워크 오류가 발생했습니다.");
    }
}


function submitReservation() {
    const date = $("#datepicker").val(); // 선택한 날짜
    const selectedTime = document.querySelector(".time-button.active")?.innerText; // 선택한 시간
    const symptoms = document.querySelector(".symptom-input").value.trim(); // 증상 설명

    // 로컬 스토리지에서 데이터 가져오기
    const doctorId = localStorage.getItem("doctorId");
    const departmentId = localStorage.getItem("selectedDepartmentId");
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

    // 서버 요구 사항에 맞는 데이터 구성
    const requestData = {
        doctorId: parseInt(doctorId, 10),
        departmentId: parseInt(departmentId, 10),
        appointmentType: appointmentType, // "초진" 등
        appointmentDate: date, // "YYYY-MM-DD"
        appointmentTime: selectedTime, // "HH:mm"
        symptomDescription: symptoms, // 증상 설명
    };

    console.log("백엔드로 전송할 예약 데이터:", requestData);

    // 데이터 전송
    fetch(`https://mallang-a85bb2ff492b.herokuapp.com/api/appointments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // JWT 토큰 추가
        },
        body: JSON.stringify(requestData),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("서버 응답 실패:", response.status, response.statusText);
                return response.json().then((error) => {
                    throw new Error(`예약 요청 실패: ${error.message}`);
                });
            }
        })
        .then(() => {
            showPopup(); // 예약 성공 시 팝업 표시
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
    window.location.href = "index.html"; // 확인 후 홈 화면으로 이동
}
