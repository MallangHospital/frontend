document.addEventListener("DOMContentLoaded", () => {
    const doctors = [
      //의사 정보 불러오기
    ];
  
    const ITEMS_PER_PAGE = 4; // 페이지당 항목 수
    let currentPage = 1;
  
    // 페이지네이션 렌더링
    const renderPagination = () => {
      const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const visibleDoctors = doctors.slice(start, end);
  
      const doctorList = document.getElementById("doctor-list");
      doctorList.innerHTML = visibleDoctors
        .map(
          (doctor) => `
          <tr>
            <td><img src="${doctor.photo}" alt="${doctor.name}" width="50" height="50"></td>
            <td>${doctor.name}</td>
            <td>${doctor.specialty}</td>
            <td>${doctor.contact}</td>
            <td>
              <a href="doctor_update.html" class="btn-update">수정</a>
              <button class="btn-delete">삭제</button>
            </td>
          </tr>
        `
        )
        .join("");
  
      document.getElementById("page-info").textContent = `${currentPage} / ${totalPages}`;
  
      // 버튼 활성화/비활성화 처리
      document.getElementById("prev-page").disabled = currentPage === 1;
      document.getElementById("next-page").disabled = currentPage === totalPages;
    };
  
    // 이전 페이지로 이동
    document.getElementById("prev-page").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderPagination();
      }
    });
  
    // 다음 페이지로 이동
    document.getElementById("next-page").addEventListener("click", () => {
      const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);
      if (currentPage < totalPages) {
        currentPage++;
        renderPagination();
      }
    });
  
    // 초기 렌더링
    renderPagination();
  });
  

  // 의료진 정보 등록
    document.addEventListener("DOMContentLoaded", function () {
      const doctorForm = document.querySelector("form");
  
      doctorForm.addEventListener("submit", async function (e) {
          e.preventDefault(); // 기본 제출 방지
  
          const doctorName = document.getElementById("doctor-name").value.trim();
          const doctorDepartment = document.getElementById("doctor-department").value;
          const doctorContact = document.getElementById("doctor-contact").value.trim();
          const doctorImage = document.getElementById("doctor-image").files[0];
  
          // 입력값 검증
          if (!doctorName || !doctorDepartment || !doctorContact || !doctorImage) {
              alert("모든 필드를 입력해주세요.");
              return;
          }
          if (!doctorName) {
            alert("의료진 이름을 입력해주세요.");
            return;
          }
      
          if (!doctorDepartment) {
            alert("전문분야를 선택해주세요.");
            return;
          }
      
          if (!doctorContact) {
            alert("연락처를 입력해주세요.");
            return;
          }
      
          if (!doctorImage) {
            alert("사진을 추가해주세요.");
            return;
          }

          // FormData 생성 (파일 포함)
          const formData = new FormData();
          formData.append("name", doctorName);  //의사이름
          formData.append("departmentName", doctorDepartment);  // 전문분야
          formData.append("phoneNumber", doctorContact);   // 휴대폰 번호
          formData.append("photo", doctorImage); // 의사사진
  
          try {
              const response = await fetch("https://mallang-a85bb2ff492b.herokuapp.com/api/doctors", {
                  method: "POST",
                  body: formData,
              });
  
              if (response.ok) {
                  alert("의료진 정보가 성공적으로 등록되었습니다.");
                  doctorForm.reset(); // 폼 초기화
              } else {
                  const error = await response.text();
                  alert(`등록 실패: ${error}`);
              }
          } catch (error) {
              console.error("등록 중 오류 발생:", error);
              alert("등록 처리 중 오류가 발생했습니다.");
          }
      });
  });
  
  
    // 의료진 휴진 정보 등록 폼
    const vacationForm = document.querySelectorAll("form")[1]; // 두 번째 폼
    vacationForm.addEventListener("submit", function (e) {
      e.preventDefault(); // 폼 제출 방지
  
      const vacationDoctor = document.getElementById("vacation-doctor").value;
      const vacationStart = document.getElementById("vacation-start").value;
      const vacationEnd = document.getElementById("vacation-end").value;
  
      if (!vacationDoctor) {
        alert("휴진할 의료진 이름을 선택해주세요.");
        return;
      }
  
      if (!vacationStart) {
        alert("휴진 시작일을 선택해주세요.");
        return;
      }
  
      if (!vacationEnd) {
        alert("휴진 종료일을 선택해주세요.");
        return;
      }
  
      // 시작일과 종료일 비교
      if (new Date(vacationStart) > new Date(vacationEnd)) {
        alert("휴진 시작일은 종료일보다 이전이어야 합니다.");
        return;
      }
  
      // 유효성 검사가 모두 통과된 경우
      alert("휴진 정보가 성공적으로 등록되었습니다.");
      vacationForm.submit();
    });

  
  document.addEventListener("DOMContentLoaded", () => {
    const showPopup = (message, callback) => {
      const popupOverlay = document.getElementById("popup-overlay");
      const popupMessage = document.getElementById("popup-message");
      const confirmButton = document.getElementById("popup-confirm");

      popupMessage.textContent = message;
      popupOverlay.style.display = "flex";

      confirmButton.onclick = () => {
        popupOverlay.style.display = "none";
        if (callback) callback();
      };
    };

    // 삭제 버튼 동작
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        showPopup("해당 정보를 삭제하시겠습니까?", () => {
          showPopup("삭제되었습니다.");
        });
      });
    });

    // 추가 버튼 동작
    document.querySelectorAll(".btn-add").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        showPopup("추가되었습니다.");
      });
    });
  });