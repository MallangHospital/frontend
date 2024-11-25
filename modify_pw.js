document.querySelector('.close-btn').addEventListener('click', () => {
  window.close(); 
});

document.querySelector('.cancel-btn').addEventListener('click', () => {
  document.querySelectorAll('input').forEach(input => input.value = ''); 
});

document.querySelector('.save-btn').addEventListener('click', (event) => {
  event.preventDefault();
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{1,20}$/;

  if (!passwordPattern.test(newPassword)) {
      showModal();  
      return;  
  }


  if (newPassword !== confirmPassword) {
      alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
  } else {
      alert("비밀번호가 변경되었습니다!");
  }
});


function showModal() {
  const modal = document.getElementById('warning-modal');
  modal.style.display = 'flex';


  const alertImage = document.getElementById('alert-image');
  alertImage.src = 'alert_image.png';  
  alertImage.style.display = 'block';  
}


document.getElementById('modal-confirm-btn').addEventListener('click', () => {
  const modal = document.getElementById('warning-modal');
  modal.style.display = 'none'; 


  const alertImage = document.getElementById('alert-image');
  alertImage.style.display = 'none';  
});
