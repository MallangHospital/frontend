document.querySelector('.save-btn').addEventListener('click', function(event) {
    event.preventDefault(); 
  
    const name = document.querySelector('#name').value.trim();
    const phone = document.querySelector('#phone').value.trim();
    const email = document.querySelector('#email').value.trim();
    const id = document.querySelector('#id').value.trim();
    const ssn = document.querySelector('#ssn').value.trim();
  
    if (!name || !phone || !email || !id || !ssn) {
  
        document.body.innerHTML += `
            <div id="alert-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0, 0, 0, 0.5); display:flex; align-items:center; justify-content:center; z-index:1000;">
                <div style="background-color:white; padding:20px; border-radius:10px; text-align:center;">
                    <img src="alert_image.png" alt="경고 이미지" style="width:300px; height:300px; margin-bottom:10px;"> <!-- Increased size -->
                    <button id="close-alert" style="margin-top:10px; padding:5px 10px; cursor:pointer;">닫기</button>
                </div>
            </div>
        `;
  
        document.querySelector('#close-alert').addEventListener('click', function() {
            document.querySelector('#alert-overlay').remove();
        });
  
    } else {
        alert('저장되었습니다');
    }
  });
  
  document.querySelector('.cancel-btn').addEventListener('click', function() {
  
    document.querySelector('#name').value = '';
    document.querySelector('#phone').value = '';
    document.querySelector('#email').value = '';
    document.querySelector('#id').value = '';
    document.querySelector('#ssn').value = '';
  
    alert('취소되었습니다');
  });
  