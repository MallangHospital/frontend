document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "https://mallang-a85bb2ff492b.herokuapp.com"; // Heroku API Base URL
    const ITEMS_PER_PAGE = 4; // 페이지당 항목 수
    let currentPage = 1;
    let doctors = []; // 의료진 정보 저장

    // 의료진 정보 로드
    async function loadDoctors() {
        try {
            const response = await fetch(`${baseUrl}/api/doctors`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                doctors = await response.json(); // API 데이터 저장
                console.log("의료진 정보 로드 성공:", doctors); // 데이터 로드 성공 로그
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

    // 페이지네이션 렌더링
    const renderPagination = () => {
        console.log(`현재 페이지: ${currentPage}`); // 현재 페이지 로그

        const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);
        console.log(`총 페이지 수: ${totalPages}`); // 총 페이지 로그

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const visibleDoctors = doctors.slice(start, end);

        console.log("현재 페이지에 표시될 의료진:", visibleDoctors); // 현재 페이지 데이터 로그

        const doctorList = document.getElementById("doctor-list");
        doctorList.innerHTML = visibleDoctors
            .map(
                (doctor) => `
                <tr>
                    <td><img src="${doctor.photoUrl}" alt="${doctor.name}" width="50" height="50"></td>
                    <td>${doctor.name}</td>
                    <td>${doctor.departmentName || "정보 없음"}</td>
                    <td>${doctor.phoneNumber || "정보 없음"}</td>
                    <td>
                        <a href="#" class="btn-update" data-id="${doctor.id}">수정</a>
                        <button class="btn-delete" data-id="${doctor.id}">삭제</button>
                    </td>
                </tr>
            `
            )
            .join("");

        document.getElementById("page-info").textContent = `${currentPage} / ${totalPages}`;

        // 버튼 활성화/비활성화 처리
        document.getElementById("prev-page").disabled = currentPage === 1;
        document.getElementById("next-page").disabled = currentPage === totalPages;

        attachDeleteEvents(); // 삭제 버튼 이벤트 연결
        attachUpdateEvents(); // 수정 버튼 이벤트 연결
    };

    // 삭제 버튼 이벤트 연결
    function attachDeleteEvents() {
        document.querySelectorAll(".btn-delete").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                const doctorId = e.target.dataset.id;
                console.log(`삭제 요청: doctorId=${doctorId}`); // 삭제 요청 로그
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
                console.log(`수정 요청: doctorId=${doctorId}`); // 수정 요청 로그
                window.location.href = `doctor_update_admin.html?doctorId=${doctorId}`; // 수정 페이지로 이동
            });
        });
    }

    // 의료진 삭제
    async function deleteDoctor(doctorId) {
        try {
            console.log(`의료진 삭제 요청 시작: doctorId=${doctorId}`); // 삭제 요청 시작 로그
            const response = await fetch(`${baseUrl}/api/doctors/${doctorId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log(`의료진 삭제 응답 상태: ${response.status}`); // 삭제 응답 상태 로그

            if (response.ok) {
                console.log(`의료진 삭제 성공: doctorId=${doctorId}`); // 삭제 성공 로그
                alert("의료진 정보가 삭제되었습니다.");
                loadDoctors(); // 삭제 후 새로 로드
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

    // 이전 페이지로 이동
    document.getElementById("prev-page").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            console.log("이전 페이지 클릭:", currentPage); // 이전 페이지 클릭 로그
            renderPagination();
        }
    });

    // 다음 페이지로 이동
    document.getElementById("next-page").addEventListener("click", () => {
        const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            console.log("다음 페이지 클릭:", currentPage); // 다음 페이지 클릭 로그
            renderPagination();
        }
    });

    // 초기 데이터 로드
    console.log("초기 데이터 로드 시작"); // 초기 로드 시작 로그
    loadDoctors();
});
