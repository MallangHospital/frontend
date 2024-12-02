console.clear();

$(function () {
    // 네비게이션 바와 푸터 로드
    $("#navbar").load("common_assets/navbar_admin.html", function () {
        console.log("네비게이션 바 로드 완료");
        initializeLogoutButton(); // 로그아웃 버튼 초기화
    });
    $("#footer").load("common_assets/footer.html");
});

function initializeLogoutButton() {
    const logoutButton = document.getElementById("logoutButton");

    if (!logoutButton) {
        console.error("로그아웃 버튼이 존재하지 않습니다.");
        return;
    }

    logoutButton.addEventListener("click", async function (event) {
        event.preventDefault();

        const jwtToken = localStorage.getItem("jwtToken");

        if (!jwtToken) {
            alert("이미 로그아웃되었습니다.");
            window.location.href = "/login.html";
            return;
        }

        try {
            const response = await fetch("https://mallang-a85bb2ff492b.herokuapp.com/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`, // JWT 토큰 추가
                },
            });

            if (response.ok) {
                console.log("로그아웃 성공");
                localStorage.removeItem("jwtToken"); // JWT 토큰 삭제
                alert("로그아웃되었습니다.");
                window.location.href = "/login.html"; // 로그인 페이지로 리다이렉트
            } else {
                console.error("로그아웃 실패:", response.status);
                alert("로그아웃 중 문제가 발생했습니다.");
            }
        } catch (error) {
            console.error("네트워크 오류:", error);
            alert("네트워크 오류로 로그아웃할 수 없습니다.");
        }
    });
}
