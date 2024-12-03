$(document).ready(function () {
    // JWT 토큰 가져오기
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login.html"; // 로그인 페이지로 리다이렉트
        return;
    }

    // 특정 부서의 의료진 데이터를 가져오는 함수
    async function fetchDoctorsByDepartment(departmentId) {
        const apiUrl = `https://mallang-a85bb2ff492b.herokuapp.com/api/doctors/department/${departmentId}`;
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error("의료진 데이터 로드 실패:", response.status);
                alert("의료진 데이터를 불러오는 데 실패했습니다.");
                return [];
            }
        } catch (error) {
            console.error("네트워크 오류:", error);
            alert("의료진 데이터를 불러오는 중 오류가 발생했습니다.");
            return [];
        }
    }

    // 특정 의사의 대기 인원 수를 가져오는 함수
    async function fetchRegistrationCountByDoctor(doctorId) {
        const apiUrl = `https://mallang-a85bb2ff492b.herokuapp.com/api/registrations/doctor/${doctorId}/count`;
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.ok) {
                const count = await response.json();
                return count;
            } else {
                console.error("대기 인원 로드 실패");
                return 0;
            }
        } catch (error) {
            console.error("네트워크 오류:", error);
            return 0;
        }
    }

    // 부서 번호를 부서 이름으로 변환하는 함수
    function getDepartmentName(departmentId) {
        switch (departmentId) {
            case 1: return "내과";
            case 2: return "산부인과";
            case 3: return "소아청소년과";
            case 4: return "외과";
            default: return "기타";
        }
    }

    // 휴진 상태를 가져오는 함수
async function fetchVacationStatus(doctorId) {
    const apiUrl = `https://mallang-a85bb2ff492b.herokuapp.com/api/vacations/${doctorId}/status`;
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.onVacation;  // onVacation 값 반환
        } else {
            console.error("휴진 상태 로드 실패");
            return false;  // 기본값은 휴진 아님
        }
    } catch (error) {
        console.error("네트워크 오류:", error);
        return false;  // 네트워크 오류 발생 시 기본값은 휴진 아님
    }
}

// 의사의 정보와 휴진 여부를 처리하는 함수
async function showDoctorsByDepartment(departmentId) {
    const $staffListView = $("#staffListView");
    const doctorList = await fetchDoctorsByDepartment(departmentId);

    // 기존 리스트 초기화 후 추가
    $staffListView.empty();
    doctorList.forEach(async (doctor) => {
        const registrationCount = await fetchRegistrationCountByDoctor(doctor.id); // 대기 인원 수 가져오기
        const waitTime = registrationCount * 5; // 예상 대기 시간 계산
        const isOnVacation = await fetchVacationStatus(doctor.id); // 휴진 상태 확인

        // 의사 항목 렌더링
        const doctorItem = `
            <li data-doctor-id="${doctor.id}" class="doctor-item ${isOnVacation ? 'vacation' : ''}">
                <img src="${doctor.photoUrl}" alt="${doctor.name}" class="doctor-img">
                <div class="doctor-info">
                    <p class="doctor-name">${doctor.name}</p>
                    <p class="doctor-status">대기 인원: ${registrationCount}명</p>
                    <p class="doctor-wait-time">예상 대기 시간: <span class="wait-time">${waitTime}분</span></p>
                    ${isOnVacation ? '<span class="vacation-label">휴진</span>' : ''}
                </div>
            </li>`;

        $staffListView.append(doctorItem);
    });

    // UI 상태 전환
    $(".medical_department_list").hide();
    $(".medical_staff_list").show();
}

// 휴진 상태에 따른 스타일 적용
$(document).ready(function () {
    // 휴진 의사 항목에 스타일 추가
    $("body").on("mouseover", ".vacation", function () {
        $(this).css("background-color", "#d3d3d3"); // 회색 배경
        $(this).find(".vacation-label").show(); // "휴진" 텍스트 표시
    });

    $("body").on("mouseout", ".vacation", function () {
        $(this).css("background-color", ""); // 배경색 초기화
        $(this).find(".vacation-label").hide(); // "휴진" 텍스트 숨김
    });

    // 다른 페이지 로드 후에도 휴진 상태 처리
    $(".doctor-item").each(function () {
        if ($(this).hasClass("vacation")) {
            $(this).find(".vacation-label").show(); // "휴진" 텍스트 표시
        }
    });
});


    // 진료과목 리스트를 보이는 함수
    function showMedicalDepartments(event) {
        event.preventDefault(); // 기본 링크 동작 방지
        $(".medical_staff_list").hide();
        $(".medical_department_list").show();

        $(".navItem").removeClass("is-active");
        $(event.target).closest(".navItem").addClass("is-active");
    }

    // 의료진 리스트를 보이는 함수
    async function showDoctorsByDepartment(departmentId) {
        const $staffListView = $("#staffListView");
        const doctorList = await fetchDoctorsByDepartment(departmentId);

        // 기존 리스트 초기화 후 추가
        $staffListView.empty();
        doctorList.forEach(async (doctor) => {
            const registrationCount = await fetchRegistrationCountByDoctor(doctor.id); // 대기 인원 수 가져오기
            const waitTime = registrationCount * 5; // 예상 대기 시간 계산

            $staffListView.append(`
                <li data-doctor-id="${doctor.id}" class="doctor-item">
                    <img src="${doctor.photoUrl}" alt="${doctor.name}" class="doctor-img">
                    <div class="doctor-info">
                        <p class="doctor-name">${doctor.name}</p>
                        <p class="doctor-status">대기 인원: ${registrationCount}명</p>
                        <p class="doctor-wait-time">예상 대기 시간: <span class="wait-time">${waitTime}분</span></p>
                    </div>
                </li>
            `);
        });

        // UI 상태 전환
        $(".medical_department_list").hide();
        $(".medical_staff_list").show();
    }

    // 진료과목 클릭 시 의료진 리스트 표시
    $("#listView li").click(function () {
        const departmentId = $(this).data("id");
        showDoctorsByDepartment(departmentId);
    });

    // 의사 선택 로직 추가
$("#staffListView").on("click", ".doctor-item", function () {
    // 기존 선택된 항목 해제
    $(".doctor-item").removeClass("selected");

    // 현재 선택된 항목 강조
    $(this).addClass("selected");

    // 선택된 의사의 ID와 이름 가져오기
    const selectedDoctorName = $(this).find(".doctor-name").text(); // 의사 이름만 가져오기

    // 선택한 의사 정보 출력
    alert(`${selectedDoctorName} 의사를 선택했습니다.`); // 이름만 표시
});

// 진료과목 클릭 시 의료진 리스트 표시
$(".navLink[data-target='진료 과목']").click(function(event) {
    showMedicalDepartments(event); // 진료 과목 보여주기
    
    // 네비바에서 활성화된 항목 바꾸기
    $(".navItem").removeClass("is-active");  // 기존 활성화된 항목 제거
    $(this).closest(".navItem").addClass("is-active");  // 클릭한 항목에 is-active 클래스 추가
});


    // "진료 과목" 네비게이션 클릭 이벤트
    $(".navLink[data-target='진료 과목']").click(showMedicalDepartments);

    // 데이터 저장 및 다음 단계로 이동
    function saveSelectionAndProceed() {
        const departmentId = parseInt(localStorage.getItem("selectedDepartmentId"));
        const doctorElement = $("#staffListView li.selected");
        const doctorId = doctorElement.data("doctor-id");
        const appointmentTypeElement = $("input[name='option']:checked");
        const appointmentType = appointmentTypeElement?.attr("id");

        if (!appointmentType) {
            alert("진료 유형을 선택해주세요.");
            return;
        }
        if (!departmentId) {
            alert("진료 과목을 선택해주세요.");
            return;
        }
        if (!doctorId) {
            alert("진료실을 선택해주세요.");
            return;
        }

        localStorage.setItem("departmentId", departmentId);
        localStorage.setItem("doctorId", doctorId);
        localStorage.setItem("appointmentType", appointmentType);

        console.log("데이터 저장 완료. 다음 단계로 이동.");
        window.location.href = "online_booking_step2.html";
    }

    $(".btn_next").click(saveSelectionAndProceed);

    $(".medical_staff_list").hide();
    console.log("스크립트 초기화 완료");
});
