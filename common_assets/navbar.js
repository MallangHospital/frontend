$(document).ready(function () {
    const baseUrl = "https://mallang-a85bb2ff492b.herokuapp.com"; // Heroku API URL
    const jwtToken = localStorage.getItem("jwtToken");

    // 초기 상태 설정
    if (jwtToken) {
        verifyToken(jwtToken, baseUrl)
            .then(() => {
                // 로그인 상태
                updateAuthUI(true);
            })
            .catch(() => {
                // 토큰이 유효하지 않으면 로그아웃 처리
                handleInvalidToken();
            });
    } else {
        // 비로그인 상태
        updateAuthUI(false);
    }

    // 로그아웃 동작
    $("#authAction a").click(function (e) {
        e.preventDefault(); // 기본 링크 동작 방지
        if ($(this).text() === "로그아웃") {
            handleLogout(baseUrl);
        } else {
            window.location.href = "/login.html"; // 로그인 페이지로 이동
        }
    });
});

// 유효하지 않은 토큰 처리
function handleInvalidToken() {
    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
    localStorage.removeItem("jwtToken"); // 토큰 삭제
    window.location.href = "/login.html"; // 로그인 페이지로 리다이렉트
}

// 로그아웃 처리
function handleLogout(baseUrl) {
    $.ajax({
        url: `${baseUrl}/logout`, // Heroku API의 로그아웃 엔드포인트
        type: "POST",
        xhrFields: { withCredentials: true }, // 쿠키 기반 인증 시 필요
        success: function () {
            localStorage.removeItem("jwtToken"); // 로컬스토리지의 토큰 삭제
            alert("로그아웃되었습니다.");
            updateAuthUI(false); // UI 업데이트
            window.location.href = "/login.html"; // 로그인 페이지로 이동
        },
        error: function () {
            alert("로그아웃에 실패했습니다.");
        },
    });
}

// 로그인 상태에 따른 UI 업데이트
function updateAuthUI(isLoggedIn) {
    if (isLoggedIn) {
        $("#authAction")
            .html('<a href="#">로그아웃</a>')
            .removeClass("login")
            .addClass("logout");
        $("#authDivider").hide(); // 구분자 숨기기
        $("#registerAction").hide(); // 회원가입 버튼 숨기기
    } else {
        $("#authAction")
            .html('<a href="/login.html">로그인</a>')
            .removeClass("logout")
            .addClass("login");
        $("#authDivider").show(); // 구분자 보이기
        $("#registerAction").show(); // 회원가입 버튼 보이기
    }
}
