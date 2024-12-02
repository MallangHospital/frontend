const API_BASE_URL = "https://mallang-a85bb2ff492b.herokuapp.com/api/member";

// 로그인한 사용자만 접근 가능
const jwtToken = localStorage.getItem("jwtToken");
if (!jwtToken) {
  alert("로그인이 필요합니다.");
  window.location.href = "/login.html"; // 로그인 페이지로 리다이렉트
}

// DOMContentLoaded 이벤트 리스너 추가
document.addEventListener("DOMContentLoaded", () => {
  // 사용자 정보 조회
  loadMemberInfo();

  // 폼 제출 이벤트
  document.getElementById("modify-form").addEventListener("submit", (event) => {
    event.preventDefault();
    updateMemberInfo();
  });

  // 취소 버튼 클릭 이벤트
  document.querySelector(".cancel-btn").addEventListener("click", () => {
    clearForm();
    alert("취소되었습니다.");
  });
});

// 사용자 정보 조회
// 사용자 정보 조회
function loadMemberInfo() {
  fetch(`${API_BASE_URL}/info`, {  // API_BASE_URL을 템플릿 리터럴로 감쌈
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwtToken}`,  // Authorization에 Bearer를 템플릿 리터럴로 추가
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("회원 정보를 불러오는 데 실패했습니다.");
      }
      return response.json();
    })
    .then((data) => {
      populateForm(data);
    })
    .catch((error) => {
      console.error("오류 발생:", error);
      alert("로그인 후 이용가능한 서비스입니다.");
    });
}

// 폼에 데이터 채우기
function populateForm(member) {
  document.getElementById("name").value = member.name;
  document.getElementById("id").value = member.mid;
  document.getElementById("ssn").value = member.rrn;
  document.getElementById("phone").value = member.phoneNum;
  document.getElementById("email").value = member.email;
}


function updateMemberInfo() {
  const currentPassword = document.getElementById("current-password").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

// 비밀번호 조건 검사 정규식: 영어, 숫자, 특수문자를 모두 포함하며 20자 이내
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?~\-=/]).{1,20}$/;

// 조건 1: 현재 비밀번호와 새 비밀번호가 조건을 만족하는지 확인
if (!passwordRegex.test(currentPassword) || (newPassword && !passwordRegex.test(newPassword))) {
  alert("영어, 숫자, 특수문자를 모두 포함하며 20자 이내로 작성 바랍니다.");
  return;
}

  // 조건 3: 새 비밀번호와 비밀번호 확인 칸의 값이 일치하지 않는 경우
  if (newPassword !== confirmPassword) {
    alert("새 비밀번호가 일치하지 않습니다.");
    return;
  }
  // // 조건 2: 현재 비밀번호와 입력된 값이 일치하지 않는 경우
  // if (currentPassword !== "serverStoredCurrentPassword") { // 실제로 서버에서 비밀번호 확인하는 API가 필요
  //   alert("현재 비밀번호와 일치하지 않습니다.");
  //   return;
  // }



  // 수정 가능한 데이터만 전송
  const memberUpdateData = {
    currentPassword: currentPassword,   // 현재 비밀번호
    newPassword: newPassword,           // 새 비밀번호
    phoneNum: document.getElementById("phone").value,   // 전화번호
    email: document.getElementById("email").value,      // 이메일
  };

  // 전송할 데이터 로그
  console.log("Sending data:", JSON.stringify(memberUpdateData));

  fetch(`${API_BASE_URL}/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // JWT 토큰 필요 시 추가
      "Content-Type": "application/json",
    },
    body: JSON.stringify(memberUpdateData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("회원 정보 수정에 실패했습니다.");
      }
      return response.text();
    })
    .then((message) => {
      alert("저장되었습니다.");
      window.location.reload(); // 페이지 새로고침
    })
    .catch((error) => {
      console.error("오류 발생:", error);
      alert("현재 비밀번호와 일치하지 않습니다.");
    });
}
