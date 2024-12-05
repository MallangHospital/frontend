document.addEventListener("DOMContentLoaded", () => {
    const ITEMS_PER_PAGE = 4; // 페이지당 항목 수
    let currentPage = 1;
    let doctors = [];
    let vacations = [];

    // 의료진 정보 로드
    async function loadDoctors() {
        try {
            const response = await fetch("https://mallang-a85bb2ff492b.herokuapp.com/api/doctors");
            if (response.ok) {
                doctors = await response.json();
                console.log("의료진 정보 로드 성공:", doctors);
                populateDoctorDropdown(); // 드롭다운에 의료진 정보 추가
                renderPagination(); // 페이지네이션 렌더링
            } else {
                console.error("의료진 정보 로드 실패:", response.status);
                alert("의료진 정보를 불러오는 데 실패했습니다.");
            }
        } catch (error) {
            console.error("네트워크 오류:", error);
            alert("의료진 정보를 불러오는 중 오류가 발생했습니다.");
        }
    }
    // 페이지네이션 렌더링 함수
    function renderPagination() {
        const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);  // 전체 페이지 수 계산
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;

        // 데이터가 부족할 수 있으므로 end 값은 doctors.length로 조정
        const visibleDoctors = doctors.slice(start, Math.min(end, doctors.length));  // 현재 페이지에 해당하는 데이터

        const doctorList = document.getElementById("doctor-list");
        doctorList.innerHTML = visibleDoctors
            .map(
                (doctor) => `
                <tr>
                    <td>
                        <img src="${doctor.photoUrl || '/assets/default.jpg'}" alt="${doctor.name}" width="50" height="50" style="object-fit: cover; border-radius: 8px; background-color: #f0f0f0;">
                    </td>
                    <td>${doctor.name}</td>
                    <td>${doctor.departmentName || "정보 없음"}</td>
                    <td>${doctor.phoneNumber || "정보 없음"}</td>
                    <td>
                        <a href="#" class="btn-update" data-id="${doctor.id}">수정</a>
                        <button class="btn-delete" data-id="${doctor.id}">삭제</button>
                    </td>
                </tr>`
            )
            .join("");

        // 페이지 정보 갱신
        document.getElementById("page-info").textContent = `${currentPage} / ${totalPages}`;
        document.getElementById("prev-page").disabled = currentPage === 1;  // 첫 페이지일 경우 '이전' 버튼 비활성화
        document.getElementById("next-page").disabled = currentPage === totalPages;  // 마지막 페이지일 경우 '다음' 버튼 비활성화

        attachPaginationEvents(); // 페이지네이션 버튼 이벤트 연결
        attachDeleteEvents(); // 삭제 버튼 이벤트 연결
        attachUpdateEvents(); // 수정 버튼 이벤트 연결
    }

    // 페이지네이션 이벤트 연결
    function attachPaginationEvents() {
        document.getElementById("prev-page").addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;  // 이전 페이지로 이동
                renderPagination(); // 페이지 렌더링
            }
        });

        document.getElementById("next-page").addEventListener("click", () => {
            const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);  // 총 페이지 수 계산
            if (currentPage < totalPages) {
                currentPage++;  // 다음 페이지로 이동
                renderPagination(); // 페이지 렌더링
            }
        });
    }


   // 의료진 정보를 로드하고 부서별로 그룹화하여 드롭다운에 추가하는 함수
function populateDoctorDropdown() {
    const doctorDropdown = document.getElementById("vacation-doctor");
    doctorDropdown.innerHTML = ""; // 기존 옵션 초기화

    // 부서별로 의료진을 그룹화
    const departments = {};  // 부서별로 의료진을 그룹화할 객체

    doctors.forEach((doctor) => {
        const departmentName = doctor.departmentName || "기타";
        
        if (!departments[departmentName]) {
            departments[departmentName] = [];
        }
        departments[departmentName].push(doctor);
    });

    // 부서별로 그룹화된 의료진을 드롭다운에 추가
    Object.keys(departments).forEach((departmentName) => {
        const optGroup = document.createElement("optgroup");
        optGroup.label = departmentName;  // 부서 이름을 그룹 레이블로 설정

        // 해당 부서의 의료진을 옵션으로 추가
        departments[departmentName].forEach((doctor) => {
            const option = document.createElement("option");
            option.value = doctor.id;
            option.textContent = doctor.name;
            optGroup.appendChild(option);
        });

        doctorDropdown.appendChild(optGroup);  // optgroup을 드롭다운에 추가
    });

    console.log("드롭다운 갱신 완료");
}


    async function addDoctor() {
        const name = document.getElementById("doctor-name").value.trim();
        const department = document.getElementById("doctor-department").value.trim();
        const contact = document.getElementById("doctor-contact").value.trim();
        const photoFile = document.getElementById("doctor-image").files[0];  // 파일 선택
    
        // 부서 맵핑
        const departmentMapping = {
            "내과": 1,
            "산부인과": 2,
            "소아청소년과": 3,
            "외과": 4,
        };
        const departmentId = departmentMapping[department];
    
        // 유효성 검사
        if (!name || !departmentId || !contact) {
            alert("모든 필드를 입력해주세요.");
            return;
        }
    
        // JSON 데이터 준비
        const doctorData = {
            name,
            departmentId,
            phoneNumber: contact,
        };
    
        // FormData 객체 생성
        const formData = new FormData();
        formData.append("doctorDTO", JSON.stringify(doctorData));  // JSON 데이터를 "doctor" 필드에 추가
        if (photoFile) {
            formData.append("photo", photoFile);  // 이미지 파일을 "photo" 필드에 추가
        }
    
        try {
            console.log("전송 데이터:", doctorData, photoFile);
    
            // API 요청 (POST)
            const response = await fetch("https://mallang-a85bb2ff492b.herokuapp.com/api/doctors", {
                method: "POST",
                body: formData, // FormData로 전송
            });
    
            if (response.ok) {
                alert("의료진이 성공적으로 등록되었습니다.");
                document.getElementById("add-doctor-form").reset(); // 폼 초기화
                document.getElementById("image-preview").style.display = "none";  // 사진 미리보기 숨기기
                await loadDoctors(); // 새로고침
            } else {
                const errorMessage = await response.text();
                console.error("의료진 등록 실패:", errorMessage);
                alert(`등록 실패: ${errorMessage}`);
            }
        } catch (error) {
            console.error("의료진 등록 중 오류 발생:", error);
            alert("의료진 등록 중 문제가 발생했습니다. 네트워크를 확인하세요.");
        }
    }
    
    

    // 삭제 버튼 이벤트 연결
    function attachDeleteEvents() {
        document.querySelectorAll(".btn-delete").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                const doctorId = e.target.dataset.id;
                if (confirm("해당 의료진 정보를 삭제하시겠습니까?")) {
                    await deleteDoctor(doctorId);
                }
            });
        });
    }

    function attachUpdateEvents() {
        document.querySelectorAll(".btn-update").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const doctorId = e.target.dataset.id;
                // 의사 ID를 로컬 스토리지에 저장
                localStorage.setItem('doctorId', doctorId);
                window.location.href = `doctor_update_admin.html?doctorId=${doctorId}`;
            });
        });
    }
    

    // 의료진 삭제
    async function deleteDoctor(doctorId) {
        try {
            const response = await fetch(`https://mallang-a85bb2ff492b.herokuapp.com/api/doctors/${doctorId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("의료진 정보가 삭제되었습니다.");
                await loadDoctors(); // 삭제 후 의료진 목록 재로드
            } else {
                const errorText = await response.text();
                console.error("의료진 삭제 실패:", response.status, errorText);
                alert(`의료진 삭제에 실패했습니다. 상태 코드: ${response.status}\n응답 내용: ${errorText}`);
            }
        } catch (error) {
            console.error("삭제 요청 중 오류 발생:", error);
            alert("삭제 요청 중 문제가 발생했습니다.");
        }
    }

    
    // 휴진 정보 로드
    async function loadVacations() {
        try {
            const response = await fetch("https://mallang-a85bb2ff492b.herokuapp.com/api/vacations");
            if (response.ok) {
                vacations = await response.json();
                console.log("휴진 정보 로드 성공:", vacations);
                renderVacationList(); // 휴진 목록 렌더링
            } else {
                console.error("휴진 정보 로드 실패:", response.status);
                alert("휴진 정보를 불러오는 데 실패했습니다.");
            }
        } catch (error) {
            console.error("휴진 정보 로드 중 오류 발생:", error);
            alert("휴진 정보를 불러오는 중 오류가 발생했습니다.");
        }
    }

    // 휴진 정보 등록
    async function addVacation() {
        console.log("addVacation 함수 호출됨"); // 함수 호출 확인
        const doctorId = document.getElementById("vacation-doctor").value;
        const vacationStart = document.getElementById("vacation-start").value;
        const vacationEnd = document.getElementById("vacation-end").value;

        console.log("입력값 확인:", { doctorId, vacationStart, vacationEnd }); // 입력값 확인

        if (!doctorId || !vacationStart || !vacationEnd) {
            alert("모든 필드를 입력해주세요.");
            return;
        }
        if (new Date(vacationStart) > new Date(vacationEnd)) {
            alert("휴진 시작일은 종료일보다 이전이어야 합니다.");
            return;
        }

        try {
            console.log("API 요청 준비...");
            const response = await fetch("https://mallang-a85bb2ff492b.herokuapp.com/api/vacations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    doctorId: parseInt(doctorId, 10),
                    startDate: vacationStart,
                    endDate: vacationEnd,
                }),
            });

            console.log("API 응답 수신:", response); // 응답 상태 확인

            if (response.ok) {
                alert("휴진 정보가 성공적으로 등록되었습니다.");
                document.getElementById("add-vacation-form").reset();
                await loadVacations(); // 휴진 정보 갱신
            } else {
                const errorText = await response.text();
                console.error("휴진 등록 실패:", response.status, errorText); // 실패 로그
                alert(`휴진 등록에 실패했습니다. 상태 코드: ${response.status}\n응답 내용: ${errorText}`);
            }
        } catch (error) {
            console.error("휴진 등록 중 오류 발생:", error); // 네트워크 또는 기타 오류
            alert("휴진 등록 중 문제가 발생했습니다.");
        }
    }

    // 휴진 정보 렌더링
    function renderVacationList() {
        const vacationTable = document.querySelector(".vacation-table tbody");
        vacationTable.innerHTML = vacations
            .map(
                (vacation) => `
                <tr>
                    <td>${vacation.doctorName || "정보 없음"}</td>
                    <td>${vacation.startDate || "정보 없음"}</td>
                    <td>${vacation.endDate || "정보 없음"}</td>
                    <td>
                        <button class="btn-delete-vacation" data-id="${vacation.id}">삭제</button>
                    </td>
                </tr>`
            )
            .join("");

        attachVacationDeleteEvents(); // 휴진 삭제 버튼 이벤트 연결
    }

    // 휴진 삭제 버튼 이벤트 연결
    function attachVacationDeleteEvents() {
        document.querySelectorAll(".btn-delete-vacation").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                const vacationId = e.target.dataset.id;
                if (confirm("해당 휴진 정보를 삭제하시겠습니까?")) {
                    await deleteVacation(vacationId);
                }
            });
        });
    }

    // 휴진 정보 삭제
    async function deleteVacation(vacationId) {
        try {
            const response = await fetch(`https://mallang-a85bb2ff492b.herokuapp.com/api/vacations/${vacationId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("휴진 정보가 성공적으로 삭제되었습니다.");
                await loadVacations(); // 삭제 후 휴진 목록 갱신
            } else {
                const errorText = await response.text();
                console.error("휴진 삭제 실패:", response.status, errorText);
                alert(`휴진 삭제에 실패했습니다. 상태 코드: ${response.status}\n응답 내용: ${errorText}`);
            }
        } catch (error) {
            console.error("휴진 삭제 중 오류 발생:", error);
            alert("휴진 삭제 중 문제가 발생했습니다.");
        }
    }

    
document.getElementById("doctor-image").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById("image-preview");
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        const preview = document.getElementById("image-preview");
        preview.src = "";
        preview.style.display = "none";
    }
});



    // 초기화 및 이벤트 리스너 연결
    async function initializePage() {
        console.log("페이지 초기화 시작...");
        await loadDoctors();
        await loadVacations();


        document.querySelector(".add-vacation-btn").addEventListener("click", addVacation);
        document.querySelector(".add-doctor-btn").addEventListener("click", addDoctor); // 의료진 등록 버튼 이벤트 리스너 추가
        console.log("페이지 초기화 완료.");
    }

    initializePage();
});

