document.getElementById('saveButton').addEventListener('click', function() {
  const allQuestions = document.querySelectorAll('.radio-container');
  let allAnswered = true;


  allQuestions.forEach(container => {
    const selectedOption = container.querySelector('input[type="radio"]:checked');
    if (!selectedOption) {
      allAnswered = false;
    }
  });


  const alertImageDiv = document.getElementById('alertImage');
  const alertImg = document.getElementById('alertImg');
  const saveMessageDiv = document.createElement('div');


  if (!allAnswered) {

    alertImg.src = 'alert_image.png'; 
    saveMessageDiv.textContent = '입력되지 않은 질문이 있습니다. 모든 질문에 답하여 주시길 바랍니다.';
    saveMessageDiv.style.position = 'fixed';
    saveMessageDiv.style.top = '50%';
    saveMessageDiv.style.left = '50%';
    saveMessageDiv.style.transform = 'translate(-50%, -50%)';
    saveMessageDiv.style.padding = '20px';
    saveMessageDiv.style.backgroundColor = '#f44336';
    saveMessageDiv.style.color = 'white';
    saveMessageDiv.style.fontSize = '1.2rem';
    saveMessageDiv.style.borderRadius = '10px';
    document.body.appendChild(saveMessageDiv);


    alertImageDiv.style.display = 'block';


    setTimeout(() => {
      alertImageDiv.style.display = 'none';
      saveMessageDiv.style.display = 'none';
    }, 1500);
    
    return; 
  }


  alertImg.src = 'check_image.png';  
  saveMessageDiv.textContent = '저장되었습니다!';
  saveMessageDiv.style.position = 'fixed';
  saveMessageDiv.style.top = '50%';
  saveMessageDiv.style.left = '50%';
  saveMessageDiv.style.transform = 'translate(-50%, -50%)';
  saveMessageDiv.style.padding = '20px';
  saveMessageDiv.style.backgroundColor = '#4CAF50';
  saveMessageDiv.style.color = 'white';
  saveMessageDiv.style.fontSize = '1.2rem';
  saveMessageDiv.style.borderRadius = '10px';
  document.body.appendChild(saveMessageDiv);


  alertImageDiv.style.display = 'block';


  setTimeout(() => {
    alertImageDiv.style.display = 'none';
    saveMessageDiv.style.display = 'none';
  }, 1500);

});
