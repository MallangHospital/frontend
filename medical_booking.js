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

  // 의료진 리스트를 보이는 함수
  async function showDoctorsByDepartment(departmentId) {
    console.log("선택한 departmentId:", departmentId); // 선택한 departmentId 로그

    const $staffListView = $("#staffListView");
    const doctorList = await fetchDoctorsByDepartment(departmentId);

    // 기존 리스트 초기화 후 추가
    $staffListView.empty();
    doctorList.forEach((doctor) => {
      console.log("의사 정보:", doctor); // 각 의사 정보 로그
      $staffListView.append(`
        <li data-doctor-id="${doctor.id}" class="doctor-item">
          <img src="${doctor.photoUrl}" alt="${doctor.name}" class="doctor-img">
          <p>${doctor.name}</p>
          <button class="favorite-btn">
            <img src="assets/취소.png" alt="즐겨찾기" class="favorite-icon">
          </button>
        </li>
      `);
    });

    console.log("의료진 리스트 표시 완료"); // 의료진 리스트 표시 로그

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

  // 선택된 의사의 ID 로그 출력
  const selectedDoctorId = $(this).data("doctor-id");
  const selectedDoctorName = $(this).find("p").text(); // 의사 이름 가져오기
  console.log("선택된 의사 ID:", selectedDoctorId);
  console.log("선택된 의사 이름:", selectedDoctorName); // 이름 확인 로그

  // 의사를 선택했을 때 alert 출력
  alert(`${selectedDoctorName} 의사를 선택했습니다.`); // 이름 표시
});


  // 즐겨찾기 기능 추가
  $("#staffListView").on("click", ".favorite-btn", function (event) {
    event.stopPropagation(); // 부모 요소 클릭 이벤트 방지

    const doctorElement = $(this).closest("li");
    const doctorName = doctorElement.find("p").text(); // 의사 이름 가져오기
    const $favoriteIcon = $(this).find(".favorite-icon"); // 버튼 내의 이미지
    const isFavorited = $favoriteIcon.attr("src") === "assets/취소.png"; // 현재 이미지가 '취소'인지 확인

    if (isFavorited) {
      $favoriteIcon.attr("src", "assets/즐겨찾기.png"); // '즐겨찾기'로 변경
      alert(`${doctorName} 의사를 즐겨찾기했습니다.`);
    } else {
      $favoriteIcon.attr("src", "assets/취소.png"); // '취소'로 변경
      alert(`${doctorName} 의사의 즐겨찾기가 취소되었습니다.`);
    }

    console.log("즐겨찾기 상태 변경:", doctorName, isFavorited);
  });

  // "진료 과목" 네비게이션 클릭 이벤트
  $(".navLink[data-target='진료 과목']").click(showMedicalDepartments);

  // 데이터 저장 및 다음 단계로 이동
  function saveSelectionAndProceed() {
    // 진료과 ID 가져오기
    const departmentId = parseInt(localStorage.getItem("selectedDepartmentId"));
    console.log("저장된 departmentId:", departmentId); // 로그 추가

    // 의료진 ID 가져오기
    const doctorElement = $("#staffListView li.selected");
    const doctorId = doctorElement.data("doctor-id");
    console.log("저장된 doctorId:", doctorId); // 로그 추가

    // 진료 유형 가져오기
    const appointmentTypeElement = $("input[name='option']:checked");
    const appointmentType = appointmentTypeElement?.attr("id"); // 초진, 재진, 상담
    console.log("저장된 appointmentType:", appointmentType); // 로그 추가

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

    console.log("데이터 저장 완료. 다음 단계로 이동.");
    window.location.href = "medical_booking_step2.html"; // 다음 단계로 이동
  }

  // "다음" 버튼 클릭 이벤트
  $(".btn_next").click(saveSelectionAndProceed);

  // 초기 상태 설정
  $(".medical_staff_list").hide();

  console.log("스크립트 초기화 완료"); // 초기화 완료 로그
});

