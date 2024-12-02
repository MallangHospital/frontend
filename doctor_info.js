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
        const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const visibleDoctors = doctors.slice(start, end);

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

        document.getElementById("page-info").textContent = `${currentPage} / ${totalPages}`;
        document.getElementById("prev-page").disabled = currentPage === 1;
        document.getElementById("next-page").disabled = currentPage === totalPages;

        attachPaginationEvents(); // 페이지네이션 버튼 이벤트 연결
        attachDeleteEvents(); // 삭제 버튼 이벤트 연결
        attachUpdateEvents(); // 수정 버튼 이벤트 연결
    }

    // 페이지네이션 이벤트 연결
    function attachPaginationEvents() {
        document.getElementById("prev-page").addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderPagination();
            }
        });

        document.getElementById("next-page").addEventListener("click", () => {
            const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);
            if (currentPage < totalPages) {
                currentPage++;
                renderPagination();
            }
        });
    }

    // 의료진 드롭다운에 정보 추가
    function populateDoctorDropdown() {
        const doctorDropdown = document.getElementById("vacation-doctor");
        doctorDropdown.innerHTML = ""; // 기존 옵션 초기화

        doctors.forEach((doctor) => {
            const option = document.createElement("option");
            option.value = doctor.id;
            option.textContent = doctor.name;
            doctorDropdown.appendChild(option);
        });

        console.log("드롭다운 갱신 완료");
    }

        // 의료진 등록
       async function addDoctor() {
    const name = document.getElementById("doctor-name").value;
    const department = document.getElementById("doctor-department").value;
    const contact = document.getElementById("doctor-contact").value;
    const photoFile = document.getElementById("doctor-image").files[0];

    const departmentMapping = {
        "내과": 1,
        "산부인과": 2,
        "소아청소년과": 3,
        "외과": 4,
    };
    const departmentId = departmentMapping[department];

    if (!name || !departmentId || !contact) {
        alert("모든 필드를 입력해주세요.");
        return;
    }

    const doctorData = {
        name,
        departmentId,
        phoneNumber: contact,
        specialty: "General Medicine", // 기본값 제공
        position: "Doctor", // 기본값 제공
        adminId: "admin123", // 기본값 제공 (실제 관리자의 ID로 대체 필요)
        photoPath: "default/photo/path", // 기본값 제공
    };

    const formData = new FormData();
    formData.append("doctor", JSON.stringify(doctorData));
    if (photoFile) {
        formData.append("photo", photoFile);
    }

    try {
        console.log("의료진 등록 요청 데이터:", doctorData, photoFile);
        const response = await fetch("https://mallang-a85bb2ff492b.herokuapp.com/api/doctors", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("의료진 정보가 등록되었습니다.");
            await loadDoctors(); // 데이터 새로 로드
        } else {
            const errorText = await response.text();
            console.error("의료진 등록 실패:", response.status, errorText);
            alert(`의료진 등록에 실패했습니다. 상태 코드: ${response.status}\n응답 내용: ${errorText}`);
        }
    } catch (error) {
        console.error("의료진 등록 중 오류 발생:", error);
        alert("의료진 등록 중 문제가 발생했습니다.");
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

    // 수정 버튼 이벤트 연결
    function attachUpdateEvents() {
        document.querySelectorAll(".btn-update").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const doctorId = e.target.dataset.id;
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
