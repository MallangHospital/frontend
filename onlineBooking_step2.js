
     function submitReservation() {
      // 증상 입력값 확인
      const symptomInput = document.querySelector('.symptom-input').value.trim();
      
      if (!symptomInput) {
        alert("증상을 입력해 주세요.");
        return; // 증상이 비었으면 팝업을 표시하지 않음
      }

      // 팝업창 표시
      document.getElementById('reservationPopup').style.display = 'flex';
    }

    function closePopup() {
      // 팝업창 숨기기
      document.getElementById('reservationPopup').style.display = 'none';
    }
