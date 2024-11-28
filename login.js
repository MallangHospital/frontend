// 로그인 폼 제출 처리
document.getElementById('loginFrm').addEventListener('submit', async function (event) {
    event.preventDefault(); // 기본 동작 방지

    // 사용자 입력값 가져오기
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // 필수 입력값 검증
    if (!username || !password) {
        alert("아이디와 비밀번호를 모두 입력해주세요.");
        return;
    }

    try {
        // 로그인 요청 보내기 (Heroku API 경로)
        const response = await fetch('https://mallang-a85bb2ff492b.herokuapp.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }), // 입력한 아이디와 비밀번호를 JSON으로 전송
        });

        // 서버 응답 처리
        if (response.ok) {
            const data = await response.json();
            const token = data.token; // 서버에서 받은 토큰

            // 토큰 저장
            localStorage.setItem('jwtToken', token);

            // JWT 디코딩 - 사용자 역할 확인
            const payload = JSON.parse(atob(token.split('.')[1])); 
            const userRole = payload.role; // 역할 정보 추출


            if (userRole === 'ROLE_ADMIN') {
                window.location.href = '/doctor-management_admin.html'; // 관리자 페이지
            } else {
                window.location.href = '/home.html'; // 일반 사용자 페이지
            }
        } else {
            // 로그인 실패 시
            const errorMessage = await response.text();
            console.error("서버 응답 실패:", errorMessage);
            alert(`로그인 실패: ${errorMessage}`);
        }
    } catch (error) {
        // 네트워크 오류 또는 기타 오류 발생 시
        console.error("로그인 오류:", error);
        alert(`오류 발생: ${error.message}`);
    }
});
