$(document).ready(function () {

  // JWT 토큰 가져오기
  const jwtToken = localStorage.getItem("jwtToken");
  if (!jwtToken) {
    alert("로그인이 필요합니다.");
    window.location.href = "/login.html"; // 로그인 페이지로 리다이렉트
    return;
  }
  
    // 특정 부서의 의사 데이터를 가져오는 함수
    async function fetchDoctorsByDepartment(departmentId) {
      try {
        const response = await fetch(
          `https://mallang-a85bb2ff492b.herokuapp.com/api/doctors/by-department?departmentId=${departmentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (response.ok) {
          return await response.json();
        } else {
          console.error("의사 데이터 로드 실패:", response.status);
          alert("의사 데이터를 불러오는 데 실패했습니다.");
          return [];
        }
      } catch (error) {
        console.error("네트워크 오류:", error);
        alert("의사 데이터를 불러오는 중 오류가 발생했습니다.");
        return [];
      }
    }
  
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
      doctorList.forEach((doctor) => {
        $staffListView.append(`
          <li data-doctor-id="${doctor.id}">
            <img src="${doctor.photoUrl}" alt="${doctor.name}" class="doctor-img">
            <p>${doctor.name}</p>
          </li>
        `);
      });
  
      $(".medical_department_list").hide();
      $(".medical_staff_list").show();
  
      $(".navItem").removeClass("is-active");
      $(".navItem").eq(1).addClass("is-active");
    }
  
    // 진료과목 클릭 시 의료진 리스트 표시
    $("#listView li").click(function () {
      const departmentId = $(this).data("id"); // 진료과 ID 가져오기
      if (!departmentId) {
        alert("유효한 진료과목이 아닙니다.");
        return;
      }
      showDoctorsByDepartment(departmentId);
    });
  
    // "진료 과목" 네비게이션 클릭 이벤트
    $(".navLink[data-target='진료 과목']").click(showMedicalDepartments);
  
    // 데이터 저장 및 다음 단계로 이동
    function saveSelectionAndProceed() {
      // 진료과 ID 가져오기
      const departmentId = $("#listView li.is-active").data("id");
  
      // 의료진 ID 가져오기
      const doctorElement = $("#staffListView li.selected");
      const doctorId = doctorElement.data("doctor-id");
  
      // 진료 유형 가져오기
      const appointmentTypeElement = $("input[name='option']:checked");
      const appointmentType = appointmentTypeElement.attr("id"); // 초진, 재진, 상담
  
      // 유효성 검사
      if (!appointmentType) {
        alert("진료 유형을 선택해주세요.");
        return;
      }
      if (!departmentId) {
        alert("진료 과목을 선택해주세요.");
        return;
      }
      if (!doctorId) {
        alert("의료진을 선택해주세요.");
        return;
      }
  
      // 로컬 스토리지에 저장
      localStorage.setItem("departmentId", departmentId); // 진료과 ID 저장
      localStorage.setItem("doctorId", doctorId); // 의료진 ID 저장
      localStorage.setItem("appointmentType", appointmentType); // 진료 유형 저장
  
      // 다음 페이지로 이동
      window.location.href = "medical_booking_step2.html";
    }
  
    // "다음" 버튼 클릭 이벤트
    $(".btn_next").click(saveSelectionAndProceed);
  
    // 초기 상태 설정
    $(".medical_staff_list").hide();
  });
  