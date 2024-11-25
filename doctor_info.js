document.addEventListener("DOMContentLoaded", () => {
    const doctors = [
      { photo: "assets/의사이미지/내과/김준완.jpeg", name: "김준완", specialty: "내과", contact: "010-1234-5678" },
      { photo: "assets/의사이미지/내과/안정원.jpeg", name: "안정원", specialty: "내과", contact: "010-2345-6789" },
      { photo: "assets/의사이미지/내과/양석형.jpeg", name: "양석형", specialty: "내과", contact: "010-3456-7890" },
      { photo: "assets/의사이미지/내과/이익준.jpeg", name: "이익준", specialty: "내과", contact: "010-4567-8901" },
      { photo: "assets/의사이미지/산부인과/서정민.jpeg", name: "서정민", specialty: "산부인과", contact: "010-5678-9012" },
      { photo: "assets/의사이미지/산부인과/이선호.jpeg", name: "이선호", specialty: "산부인과", contact: "010-6789-0123" },
      { photo: "assets/의사이미지/산부인과/전소라.jpeg", name: "전소라", specialty: "산부인과", contact: "010-7890-1234" },
      { photo: "assets/의사이미지/산부인과/정지훈.jpeg", name: "정지훈", specialty: "산부인과", contact: "010-8901-2345" },
      { photo: "assets/의사이미지/소아청소년과/민우혁.jpeg", name: "민우혁", specialty: "소아청소년과", contact: "010-9012-3456" },
      { photo: "assets/의사이미지/소아청소년과/서인호.jpeg", name: "서인호", specialty: "소아청소년과", contact: "010-0123-4567" },
      { photo: "assets/의사이미지/소아청소년과/차정숙.jpeg", name: "차정숙", specialty: "소아청소년과", contact: "010-1234-5678" },
      { photo: "assets/의사이미지/소아청소년과/최승희.jpeg", name: "최승희", specialty: "소아청소년과", contact: "010-2345-6789" },
      { photo: "assets/의사이미지/외과/유혜정.jpeg", name: "유혜정", specialty: "외과", contact: "010-3456-7890" },
      { photo: "assets/의사이미지/외과/정윤도.jpeg", name: "정윤도", specialty: "외과", contact: "010-4567-8901" },
      { photo: "assets/의사이미지/외과/진서우.jpeg", name: "진서우", specialty: "외과", contact: "010-5678-9012" },
      { photo: "assets/의사이미지/외과/홍지홍.jpeg", name: "홍지홍", specialty: "외과", contact: "010-6789-0123" },
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
  

  document.addEventListener("DOMContentLoaded", function () {
    // 의료진 정보 등록 폼
    const doctorForm = document.querySelector("form");
  
    doctorForm.addEventListener("submit", function (e) {
      e.preventDefault(); // 폼 제출 방지
  
      const doctorName = document.getElementById("doctor-name").value.trim();
      const doctorDepartment = document.getElementById("doctor-department").value;
      const doctorContact = document.getElementById("doctor-contact").value.trim();
      const doctorImage = document.getElementById("doctor-image").files[0];
  
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
  
      // 유효성 검사가 모두 통과된 경우
      alert("의료진 정보가 성공적으로 등록되었습니다.");
      doctorForm.submit();
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
  });
  