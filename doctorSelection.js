$(document).ready(function () {
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
        return await response.json(); // JSON 데이터를 반환
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

  // 진료과목 클릭 시 해당 의료진 리스트 표시
  $("#listView li").click(async function () {
    const selectedDepartment = $(this).find(".tit").text(); // 진료과목 이름 가져오기
    const departmentId = $(this).data("id"); // 진료과 ID 가져오기
    const $staffListView = $("#staffListView");

    if (!departmentId) {
      alert("유효한 진료과목이 아닙니다.");
      return;
    }

    // 서버에서 의사 데이터 가져오기
    const doctorList = await fetchDoctorsByDepartment(departmentId);

    // 기존 리스트 초기화 후 새로운 리스트 추가
    $staffListView.empty();
    doctorList.forEach((doctor) => {
      $staffListView.append(`
        <li data-doctor-id="${doctor.id}">
          <img src="${doctor.photoUrl}" alt="${doctor.name}" class="doctor-img">
          <p>${doctor.name}</p>
          <button class="favorite-btn">
            <img src="assets/취소.png" alt="즐겨찾기" class="favorite-icon">
          </button>
        </li>
      `);
    });

    // 즐겨찾기 버튼 클릭 이벤트
    $staffListView.on("click", ".favorite-btn", function () {
      const doctorName = $(this).closest("li").find("p:first").text(); // 의사 이름 가져오기
      const $favoriteIcon = $(this).find(".favorite-icon"); // 버튼 내의 이미지
      const isFavorited = $favoriteIcon.attr("src") === "assets/취소.png"; // 현재 이미지가 '취소'인지 확인

      if (isFavorited) {
        $favoriteIcon.attr("src", "assets/즐겨찾기.png"); // '즐겨찾기'에서 '취소'로 변경
        alert(`${doctorName} 의사를 즐겨찾기했습니다.`);
      } else {
        $favoriteIcon.attr("src", "assets/취소.png"); // '취소'에서 '즐겨찾기'로 변경
        alert(`${doctorName} 의사의 즐겨찾기가 취소되었습니다.`);
      }
    });

    // 의료진 사진 클릭 시 의료진 선택
    $staffListView.on("click", ".doctor-img", function () {
      const selectedDoctorId = $(this).closest("li").data("doctor-id");
      alert(`의사 ID ${selectedDoctorId} 선택되었습니다.`);
    });

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

  $(".medical_staff_list").hide();
});
