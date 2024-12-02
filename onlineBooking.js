$(document).ready(function () {
    // JWT 토큰 가져오기
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login.html"; // 로그인 페이지로 리다이렉트
        return;
    }

    console.log("JWT 토큰:", jwtToken); // JWT 토큰 로그

    // 특정 부서의 의료진 데이터를 가져오는 함수
    async function fetchDoctorsByDepartment(departmentId) {
        const apiUrl = `https://mallang-a85bb2ff492b.herokuapp.com/api/doctors/department/${departmentId}`;
        console.log("API 요청 URL:", apiUrl); // API URL 로그

        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`, // JWT 토큰 인증 추가
                },
            });

            console.log("API 응답 상태 코드:", response.status); // 응답 상태 코드 로그

            if (response.ok) {
                const data = await response.json();
                console.log("API 응답 데이터:", data); // 응답 데이터 로그
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

    // 부서 번호를 부서 이름으로 변환하는 함수
    function getDepartmentName(departmentId) {
        switch (departmentId) {
            case 1:
                return "내과";
            case 2:
                return "산부인과";
            case 3:
                return "소아청소년과";
            case 4:
                return "외과";
            default:
                return "기타";
        }
    }

    // 진료과목 리스트를 보이는 함수
    function showMedicalDepartments(event) {
        event.preventDefault(); // 기본 링크 동작 방지
        $(".medical_staff_list").hide();
        $(".medical_department_list").show();

        $(".navItem").removeClass("is-active");
        $(event.target).closest(".navItem").addClass("is-active");

        console.log("진료 과목 리스트 표시"); // 로그 추가
    }

    async function showDoctorsByDepartment(departmentId) {
        console.log("선택한 departmentId:", departmentId);
    
        const $staffListView = $("#staffListView");
        const doctorList = await fetchDoctorsByDepartment(departmentId);
    
        $staffListView.empty();
    
        for (const doctor of doctorList) {
            const registrationCount = await fetchRegistrationCountByDoctor(doctor.id);
            const estimatedWaitTime = registrationCount * 5; // 1인당 대기 시간 5분 기준
    
            console.log(`의사 ${doctor.name} - 접수 건수: ${registrationCount}, 예상 대기 시간: ${estimatedWaitTime}분`);
    
            $staffListView.append(`
                <li data-doctor-id="${doctor.id}" class="doctor-item">
                    <img src="${doctor.photoUrl}" alt="${doctor.name}" class="doctor-img">
                    <div>
                        <p>${doctor.name}</p>
                        ${registrationCount === 0 
                            ? `<p class="status">휴진</p>` 
                            : `<p class="status">대기자 ${registrationCount}명</p>
                               <p class="wait-time">예상 대기 시간 <span>${estimatedWaitTime}</span>분</p>`}
                    </div>
                </li>
            `);
        }
    
        console.log("의료진 리스트 표시 완료");
    
        // UI 상태 전환
        $(".medical_department_list").hide();
        $(".medical_staff_list").show();
    
        $(".navItem").removeClass("is-active");
        $(".navItem").eq(1).addClass("is-active");
    }
    

    // 진료과목 클릭 시 의료진 리스트 표시
    $("#listView li").click(function () {
        // 기존 선택된 항목 해제
        $("#listView li").removeClass("is-active");

        // 현재 선택된 항목 강조
        $(this).addClass("is-active");

        // 진료과 ID 가져오기
        const departmentId = $(this).data("id"); // 진료과목 ID
        const departmentName = getDepartmentName(departmentId); // 진료과목 이름 변환
        console.log(`선택된 진료과 ID: ${departmentId}, 이름: ${departmentName}`); // 로그 추가

        // 선택한 departmentId 저장 (다음 단계에서 사용 가능)
        localStorage.setItem("selectedDepartmentId", departmentId);

        // 해당 부서의 의료진 리스트를 표시
        if (departmentId) {
            showDoctorsByDepartment(departmentId);
        } else {
            alert("유효한 진료과목이 아닙니다.");
        }
    });

    // 의사 선택 로직 추가
    $("#staffListView").on("click", ".doctor-item", function () {
        // 기존 선택된 항목 해제
        $(".doctor-item").removeClass("selected");

        // 현재 선택된 항목 강조
        $(this).addClass("selected");

        // 선택된 의사의 ID와 이름 가져오기
        const selectedDoctorId = $(this).data("doctor-id");
        const selectedDoctorName = $(this).find("p").text(); // 이름 텍스트 추출

        // 선택한 의사 정보 출력
        console.log("선택된 의사 ID:", selectedDoctorId);
        console.log("선택된 의사 이름:", selectedDoctorName);

        // Alert로 선택한 의사 이름 표시
        alert(`${selectedDoctorName}의사를 선택했습니다.`);
    });

    // "진료 과목" 네비게이션 클릭 이벤트
    $(".navLink[data-target='진료 과목']").click(showMedicalDepartments);

    // 데이터 저장 및 다음 단계로 이동
    function saveSelectionAndProceed() {
        const departmentId = parseInt(localStorage.getItem("selectedDepartmentId"));
        const doctorElement = $("#staffListView li.selected");
        const doctorId = doctorElement.data("doctor-id");
        const visitTypeElement = $("input[name='option']:checked");
        const visitType = visitTypeElement?.attr("id"); // 초진, 재진, 상담

        if (!visitType) {
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
        localStorage.setItem("visitType", visitType);

        console.log("데이터 저장 완료. 다음 단계로 이동.");
        window.location.href = "online_booking_step2.html";
    }

    // 특정 의료진의 접수 건수를 가져오는 함수
async function fetchRegistrationCountByDoctor(doctorId) {
    const apiUrl = `https://mallang-a85bb2ff492b.herokuapp.com/api/registrations/doctor/${doctorId}/count`;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`, // JWT 토큰 인증 추가
            },
        });

        if (response.ok) {
            const count = await response.json();
            return count;
        } else {
            console.error(`의사 ID ${doctorId}의 접수 건수 가져오기 실패`, response.status);
            return 0; // 실패 시 0 반환
        }
    } catch (error) {
        console.error(`네트워크 오류: 의사 ID ${doctorId}`, error);
        return 0; // 네트워크 오류 시 0 반환
    }
}


    $(".btn_next").click(saveSelectionAndProceed);

    $(".medical_staff_list").hide();
    console.log("스크립트 초기화 완료");
});
