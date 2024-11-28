document.getElementById('loginFrm').addEventListener('submit', async function (event) {
    event.preventDefault(); // 기본 동작 방지

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert("아이디와 비밀번호를 모두 입력해주세요.");
        return;
    }

    console.log("로그인 요청 데이터:", { username, password });

    try {
        const response = await fetch('https://mallang-a85bb2ff492b.herokuapp.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        console.log(`서버 응답 상태 코드: ${response.status}`);

        if (response.ok) {
            const data = await response.json();
            console.log("서버 응답 데이터:", data);

            const token = data.token?.replace('Bearer ', ''); // 'Bearer ' 제거
            if (!token) throw new Error("서버 응답에서 토큰이 누락되었습니다.");

            localStorage.setItem('jwtToken', token);
            console.log("저장된 토큰:", token);

            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("JWT 페이로드:", payload);

            const userRole = payload.role;
            console.log("사용자 역할:", userRole);

            if (userRole === 'ROLE_ADMIN') {
                window.location.href = '/doctor-management_admin.html';
            } else {
                window.location.href = '/index.html';
            }
        } else {
            const errorMessage = await response.text();
            console.error("서버 응답 실패:", errorMessage);
            alert(`로그인 실패: ${errorMessage}`);
        }
    } catch (error) {
        console.error("로그인 오류:", error);
        alert(`오류 발생: ${error.message}`);
    }
});
