// document.addEventListener("DOMContentLoaded", () => {
//     // 로그인 확인
//     const jwtToken = localStorage.getItem("jwtToken");
//     if (!jwtToken) {
//       alert("로그인이 필요합니다.");
//       window.location.href = "/login.html"; // 로그인 페이지로 리다이렉트
//       return;
//     }
  
//     // 비밀번호 유효성 검사 함수
//     const isValidPassword = (password) => {
//       const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{1,20}$/;
//       return passwordRegex.test(password);
//     };
  
//     // 경고 모달 표시
//     const showModal = (message, imageUrl = "alert_image.png") => {
//       document.body.innerHTML += `
//         <div id="alert-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0, 0, 0, 0.5); display:flex; align-items:center; justify-content:center; z-index:1000;">
//           <div style="background-color:white; padding:20px; border-radius:10px; text-align:center;">
//             <img src="${imageUrl}" alt="경고 이미지" style="width:300px; height:300px; margin-bottom:10px;">
//             <p>${message}</p>
//             <button id="close-alert" style="margin-top:10px; padding:5px 10px; cursor:pointer;">닫기</button>
//           </div>
//         </div>
//       `;
  
//       document.querySelector("#close-alert").addEventListener("click", function () {
//         document.querySelector("#alert-overlay").remove();
//       });
//     };
  
//     // 개인정보 수정 초기화 (GET 요청)
//     const initializePersonalInfo = () => {
//       fetch("https://mallang-a85bb2ff492b.herokuapp.com/api/member/info", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${jwtToken}`,
//         },
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           document.getElementById("name").value = data.name || "";
//           document.getElementById("phone").value = data.phoneNum || "";
//           document.getElementById("email").value = data.email || "";
//           document.getElementById("id").value = data.id || "";
//           document.getElementById("ssn").value = data.ssn || "";
  
//           // 읽기 전용 필드 설정
//           document.getElementById("name").setAttribute("readonly", true);
//           document.getElementById("id").setAttribute("readonly", true);
//           document.getElementById("ssn").setAttribute("readonly", true);
//         })
//         .catch((error) => {
//           console.error("Error fetching personal info:", error);
//           alert("개인정보를 불러오지 못했습니다. 다시 시도해주세요.");
//         });
//     };
  
//     initializePersonalInfo();
  
//     // 비밀번호 변경 저장 버튼 처리
//     document.querySelector(".save-btn").addEventListener("click", (event) => {
//       event.preventDefault();
  
//       const currentPassword = document.getElementById("current-password")?.value.trim();
//       const newPassword = document.getElementById("new-password")?.value.trim();
//       const confirmPassword = document.getElementById("confirm-password")?.value.trim();
  
//       if (currentPassword || newPassword || confirmPassword) {
//         // 비밀번호 변경 처리
//         if (!currentPassword || !newPassword || !confirmPassword) {
//           showModal("필수 정보를 모두 입력 바람");
//           return;
//         }
  
//         if (!isValidPassword(newPassword)) {
//           showModal("영어, 숫자 또는 특수문자 포함 20자로 입력 바람");
//           return;
//         }
  
//         if (newPassword !== confirmPassword) {
//           showModal("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
//           return;
//         }
  
//         // PUT 요청 (비밀번호 변경)
//         fetch("https://mallang-a85bb2ff492b.herokuapp.com/api/member/update", {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${jwtToken}`,
//           },
//           body: JSON.stringify({
//             currentPassword: currentPassword,
//             newPassword: newPassword,
//           }),
//         })
//           .then((response) => {
//             if (response.ok) {
//               alert("저장되었습니다.");
//               document.querySelector("form").reset(); // 입력 필드 초기화
//             } else {
//               alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
//             }
//           })
//           .catch((error) => {
//             console.error("Error:", error);
//             alert("오류가 발생했습니다. 다시 시도해주세요.");
//           });
//       } else {
//         // 개인정보 수정 처리
//         const phone = document.getElementById("phone").value.trim();
//         const email = document.getElementById("email").value.trim();
  
//         if (!phone || !email) {
//           showModal("필수 정보를 모두 입력 바람");
//           return;
//         }
  
//         // PUT 요청 (개인정보 수정)
//         fetch("https://mallang-a85bb2ff492b.herokuapp.com/api/member/update", {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${jwtToken}`,
//           },
//           body: JSON.stringify({
//             phoneNum: phone,
//             email: email,
//           }),
//         })
//           .then((response) => {
//             if (response.ok) {
//               alert("저장되었습니다.");
//               initializePersonalInfo(); // 정보 다시 불러오기
//             } else {
//               alert("개인정보 수정에 실패했습니다. 다시 시도해주세요.");
//             }
//           })
//           .catch((error) => {
//             console.error("Error:", error);
//             alert("오류가 발생했습니다. 다시 시도해주세요.");
//           });
//       }
//     });
  
//     // 취소 버튼 처리
//     document.querySelectorAll(".cancel-btn").forEach((cancelButton) => {
//       cancelButton.addEventListener("click", (e) => {
//         e.preventDefault();
//         alert("취소되었습니다.");
//         const form = e.target.closest("form");
//         form.reset(); // 입력 필드 초기화
//         initializePersonalInfo(); // 개인정보 초기화
//       });
//     });
//   });
  
$(document).ready(function () {
    const fetchMemberInfo = async () => {
      try {
        const response = await fetch('https://mallang-a85bb2ff492b.herokuapp.com/info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch member info');
        }
  
        const memberData = await response.json();
  
        // 폼에 데이터 채우기
        $('#name').val(memberData.name || '');
        $('#phone').val(memberData.phone || '');
        $('#email').val(memberData.email || '');
        $('#id').val(memberData.id || '');
        $('#ssn').val(memberData.ssn || '');
      } catch (error) {
        console.error('Error fetching member info:', error);
        alert('회원 정보를 불러오는 데 실패했습니다.');
      }
    };
  
    // 페이지 로드 시 회원 정보 가져오기
    fetchMemberInfo();
  });
  