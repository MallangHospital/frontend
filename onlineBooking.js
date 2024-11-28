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
        `https://mallang-a85bb2ff492b.herokuapp.com/api/doctors/by-department?departmentId=${departmentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`, // JWT 토큰 추가
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
    const $staffListView = $("#staffListView");

    // 서버에서 의료진 데이터 가져오기
    const doctorList = await fetchDoctorsByDepartment(departmentId);

    // 기존 리스트 초기화 후 새로운 리스트 추가
    $staffListView.empty();
    doctorList.forEach((doctor) => {
      $staffListView.append(`
        <li data-doctor-id="${doctor.id}">
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
      localStorage.setItem("doctorId", selectedDoctorId); // 선택된 의료진 ID 저장
      alert(`의료진 ID ${selectedDoctorId} 선택되었습니다.`);
    });

    // 진료과목 리스트 숨기고 의료진 리스트 표시
    $(".medical_department_list").hide();
    $(".medical_staff_list").show();
    $(".navItem").removeClass("is-active");
    $(".navItem").eq(1).addClass("is-active");
  });

  // 네비게이션 클릭 시 진료과목 및 의료진 표시
  $(".navLink").click(function (e) {
    e.preventDefault();
    $(".navItem").removeClass("is-active");
    $(this).parent().addClass("is-active");
    const target = $(this).data("target");

    if (target === "진료 과목") {
      $(".medical_department_list").show();
      $(".medical_staff_list").hide();
    } else if (target === "의료진 선택") {
      $(".medical_department_list").hide();
      $(".medical_staff_list").show();
    }
  });

  // 예약 정보 저장 및 다음 단계로 이동
  function saveSelectionAndProceed() {
    const selectedDepartment = $(".navItem.is-active").text().trim(); // 선택된 진료과목
    const selectedDoctorId = localStorage.getItem("doctorId");

    if (!selectedDoctorId) {
      alert("의료진을 선택해주세요.");
      return;
    }

    // 저장된 데이터 확인 (콘솔 로그)
    console.log({
      department: selectedDepartment,
      doctorId: selectedDoctorId,
    });

    // 다음 페이지로 이동
    window.location.href = "online_booking_step2.html";
  }

  // 다음 버튼 클릭 이벤트
  $(".btn_next").click(saveSelectionAndProceed);

  // 초기 상태: 진료과목 리스트만 표시
  $(".medical_staff_list").hide();
});
