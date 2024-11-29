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
    try {
      const response = await fetch(
        `https://mallang-a85bb2ff492b.herokuapp.com/api/doctor/by-department?departmentId=${departmentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        return await response.json(); // JSON 데이터를 반환
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

  // 진료과목 클릭 시 해당 부서의 의료진 리스트 표시
  $("#listView li").click(async function () {
    const departmentId = $(this).data("id"); // 진료과 ID 가져오기
    const departmentName = $(this).text().trim(); // 진료과 이름 가져오기
    const $staffListView = $("#staffListView");

     // 진료 유형 가져오기
     const appointmentTypeElement = $("input[name='option']:checked");
     const appointmentType = appointmentTypeElement.attr("id"); // 초진, 재진, 상담

    // 서버에서 의료진 데이터 가져오기
    const doctorList = await fetchDoctorsByDepartment(departmentId);

    // 기존 리스트 초기화 후 새로운 리스트 추가
    $staffListView.empty();
    doctorList.forEach((doctor) => {
      $staffListView.append(`
        <li data-doctor-id="${doctor.id}" data-doctor-name="${doctor.name}" data-department-id="${departmentId}">
          <div class="doctor-info">
            <img src="${doctor.photoUrl}" alt="${doctor.name}" class="doctor-img">
            <p class="doctor-name">${doctor.name}</p>
          </div>
        </li>
      `);
    });

    // 의료진 카드 클릭 시 선택 이벤트 추가
    $staffListView.off("click").on("click", "li", function () {
      const selectedDoctorId = $(this).data("doctor-id");
      const selectedDoctorName = $(this).data("doctor-name");
      const selectedDepartmentId = $(this).data("department-id");

      // 로컬 스토리지에 선택된 정보 저장
      localStorage.setItem("doctorId", selectedDoctorId);
      localStorage.setItem("doctorName", selectedDoctorName);
      localStorage.setItem("departmentId", selectedDepartmentId);
      localStorage.setItem("appointmentType", appointmentType); // 진료 유형 저장

      alert(`의료진 ${selectedDoctorName}가 선택되었습니다.`);
    });

    // 진료과목 리스트 숨기고 의료진 리스트 표시
    $(".medical_department_list").hide();
    $(".medical_staff_list").show();
    $(".navItem").removeClass("is-active");
    $(".navItem").eq(1).addClass("is-active");
  });

  // 예약 정보 저장 및 다음 단계로 이동
  function saveSelectionAndProceed() {
    const selectedDoctorId = localStorage.getItem("doctorId");
    const selectedDoctorName = localStorage.getItem("doctorName");
    const selectedDepartmentId = localStorage.getItem("departmentId");

    if (!selectedDoctorId || !selectedDoctorName || !selectedDepartmentId) {
      alert("진료실을 선택해주세요.");
      return;
    }

    // 다음 페이지로 이동
    window.location.href = "online_booking_step2.html";
  }

  // 다음 버튼 클릭 이벤트
  $(".btn_next").click(saveSelectionAndProceed);

  // 초기 상태: 진료과목 리스트만 표시
  $(".medical_staff_list").hide();
});
