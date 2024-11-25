    // 아이디 중복 확인
    function idCheck() {
      const userId = document.getElementById('userId').value;
  
      if (!userId) {
        alert("아이디를 입력하세요.");
        return false;
      }
  
      $.ajax({
        url: `/api/member/check-id/${userId}`,
        method: 'GET',
        success: function(response) {
          alert(response); // 서버에서 온 메시지 표시
        },
        error: function(xhr) {
          alert(xhr.responseText); // 에러 메시지 표시
        }
      });
  
      return false;
    }
  
    // 필수 필드 검증
    function validateRequiredFields() {
      const requiredFields = [
        { id: 'name', message: '이름을 입력하세요.' },
        { id: 'userId', message: '아이디를 입력하세요.' },
        { id: 'email', message: '이메일 주소를 입력하세요.' },
        { id: 'phoneNum', message: '휴대전화 번호를 입력하세요.' },
        { id: 'pswd1', message: '비밀번호를 입력하세요.' },
        { id: 'rrn', message: '주민등록번호를 입력하세요.' }
      ];
  
      for (const field of requiredFields) {
        const value = document.getElementById(field.id).value.trim();
        if (!value) {
          alert(field.message);
          return false;
        }
      }
  
      return true;
    }
  
    // 주민등록번호 검증
    function validateAdditionalFields() {
      const rrn = document.getElementById('rrn').value;  
      const rrnRegex = /^\d{6}-\d{7}$/;
  
      if (!rrnRegex.test(rrn)) {
        alert("주민등록번호는 123456-1234567 형식으로 입력하세요.");
        return false;
      }
  
      return true;
    }
  
    // 비밀번호 검증
    function validatePasswords() {
      const password = document.getElementById('pswd1').value;
      const confirmPassword = document.getElementById('pswd2').value;
  
      const passwordRegex = /^.{8,}$/; // 최소 8자 이상만 검증
      if (!passwordRegex.test(password)) {
        alert("비밀번호는 최소 8자 이상이어야 합니다.");
        return false;
      }
  
      if (password !== confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return false;
      }
  
      return true;
    }
  
    // 폼 데이터 검증 및 서버 전송
    function submitForm() {
    const submitButton = document.querySelector(".btn_submit");
    submitButton.disabled = true;

    if (!validateRequiredFields() || !validateAdditionalFields() || !validatePasswords()) {
        submitButton.disabled = false; // 검증 실패 시 다시 활성화
        return; 
    }

    const formData = {
        mid: document.getElementById('userId').value.trim(),
        mpw: document.getElementById('pswd1').value,
        email: document.getElementById('email').value.trim(),
        name: document.getElementById('name').value.trim(),
        phoneNum: document.getElementById('phoneNum').value.trim(),
        rrn: document.getElementById('rrn').value.trim(),
        agreeToTerms: localStorage.getItem('agreeToTerms') === 'true'
    };

    $.ajax({
        url: '/api/member/join',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            showPopup();
        },
        error: function(xhr) {
            alert(xhr.responseText);
            submitButton.disabled = false; // 에러 발생 시 다시 활성화
        }
    });
   }
