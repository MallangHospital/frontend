let currentReviewId = null;

async function fetchReviews(page = 1) {
  try {
    const response = await fetch(
      `https://mallang-a85bb2ff492b.herokuapp.com/api/reviews?page=${page}`
    );
    if (!response.ok)
      throw new Error('리뷰 데이터를 불러오는 데 실패했습니다.');

    const data = await response.json();

    const reviews = data.reviews;
    const totalPages = data.totalPages;

    document.getElementById('average-stars').textContent =
      '★'.repeat(data.overallAverageStars) +
      '☆'.repeat(5 - data.overallAverageStars);
    document.getElementById(
      'average-score'
    ).textContent = `${data.overallAverageStars.toFixed(1)} / 5`;
    document.getElementById('total-reviews').textContent = data.totalReviews;
    document.getElementById(
      'detail-description'
    ).textContent = `자세한 설명: ★${data.averageExplanationStars.toFixed(1)}`;
    document.getElementById(
      'treatment-result'
    ).textContent = `치료 후 결과: ★${data.averageTreatmentResultStars.toFixed(
      1
    )}`;
    document.getElementById(
      'staff-kindness'
    ).textContent = `직원의 친절: ★${data.averageStaffKindnessStars.toFixed(
      1
    )}`;
    document.getElementById(
      'cleanliness'
    ).textContent = `청결함: ★${data.averageCleanlinessStars.toFixed(1)}`;

    renderReviews(reviews);
    renderPagination(totalPages, page);
  } catch (error) {
    console.error(error.message);
    alert('리뷰 데이터를 불러오는 중 오류가 발생했습니다.');
  }
}

function renderReviews(reviews) {
  const reviewList = document.getElementById('review-list');
  reviewList.innerHTML = '';

  reviews.forEach((review) => {
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';
    reviewItem.innerHTML = `
      <h3>${review.memberId}</h3>
      <p>진료과: ${review.department}, 의사: ${review.doctor}</p>
      <p class="average-stars">${'★'.repeat(review.averageStars)}${'☆'.repeat(
      5 - review.averageStars
    )} <span style="color: black;"> ${review.averageStars}</span></p> 
      <p>${review.content}</p>
      <p>${new Date(review.createdAt).toLocaleDateString()}</p>
      <button onclick="openDeletePopup(${review.id})">삭제</button>
    `;
    reviewList.appendChild(reviewItem);
  });
}

function openDeletePopup(reviewId) {
  currentReviewId = reviewId;

  document.getElementById('popup-message').textContent =
    '리뷰를 삭제하려면 비밀번호를 입력하세요';
  document.getElementById('popup-password').value = '';
  document.getElementById('delete-popup').style.display = 'flex';
}

function closeDeletePopup() {
  document.getElementById('delete-popup').style.display = 'none';
}

async function deleteReview() {
  const password = document.getElementById('popup-password').value;

  if (!password) {
    alert('비밀번호를 입력해주세요.');
    return;
  }

  try {
    const response = await fetch(
      `https://mallang-a85bb2ff492b.herokuapp.com/api/reviews/${currentReviewId}?password=${password}`,
      { method: 'DELETE' }
    );
    const message = await response.text();

    if (response.ok) {
      closeDeletePopup();
      showResultPopup(message);
      fetchReviews();
    } else {
      closeDeletePopup();
      showResultPopup(message);
    }
  } catch (error) {
    console.error(error);
    document.getElementById('popup-message').textContent =
      '삭제 요청 중 오류가 발생했습니다.';
  }
}

function renderPagination(totalPages, currentPage) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.className = i === currentPage ? 'active' : '';
    button.addEventListener('click', () => fetchReviews(i));
    pagination.appendChild(button);
  }
}

fetchReviews();

document
  .getElementById('popup-confirm')
  .addEventListener('click', deleteReview);
document
  .getElementById('popup-cancel')
  .addEventListener('click', closeDeletePopup);

function showResultPopup(message) {
  const errorPopup = document.getElementById('result-popup');
  const errorPopupMessage = document.getElementById('result-popup-message');

  errorPopupMessage.textContent = message;
  errorPopup.style.display = 'flex';
}

document.getElementById('result-popup-close').addEventListener('click', () => {
  document.getElementById('result-popup').style.display = 'none';
});

document.getElementById('open-review-modal').addEventListener('click', () => {
  // const jwtToken = localStorage.getItem('jwtToken');
  // if (!jwtToken) {
  //   alert('로그인이 필요합니다.');
  //   window.location.href = '/login.html'; // 로그인 페이지로 리다이렉트
  //   return;
  // }
  initializeStarRatings();
  document.getElementById('review-form').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
  document.body.style.overflow = 'hidden';
});

document.getElementById('overlay').addEventListener('click', closeForm);
document.querySelector('.close-button').addEventListener('click', closeForm);

function closeForm() {
  document.getElementById('review-form').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
  document.body.style.overflow = '';
}

document
  .getElementById('department')
  .addEventListener('change', async function () {
    const departmentId = this.value; // 선택된 진료과 ID

    if (!departmentId) {
      alert('진료과를 선택해주세요.');
      return;
    }

    try {
      // 의료진 목록을 가져오는 API 호출
      const response = await fetch(
        `https://mallang-a85bb2ff492b.herokuapp.com/api/doctors/department/${departmentId}`
      );
      if (!response.ok) {
        throw new Error('의료진 정보를 불러오는 데 실패했습니다.');
      }

      const doctors = await response.json();

      // 의사 선택 드롭다운 업데이트
      const doctorSelect = document.getElementById('doctor');
      doctorSelect.innerHTML = `<option value="" disabled selected>의사 선택</option>`; // 초기화
      doctors.forEach((doctor) => {
        const option = document.createElement('option');
        option.value = doctor.id; // 의사 ID 사용
        option.textContent = doctor.name; // 의사 이름 사용
        doctorSelect.appendChild(option);
      });
    } catch (error) {
      console.error(error.message);
      alert('의료진 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  });

// Initialize Star Ratings
function initializeStarRatings() {
  document.querySelectorAll('.stars').forEach((container) => {
    container.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.textContent = '★';
      star.dataset.value = i;
      star.addEventListener('click', () => selectStar(container, i));
      container.appendChild(star);
    }
  });
}

// Handle Star Selection
function selectStar(container, value) {
  Array.from(container.children).forEach((star, index) => {
    star.classList.toggle('selected', index < value);
  });
  container.dataset.selectedValue = value;
}

// Show Modal
function showModal(message) {
  const modal = document.getElementById('modal');
  const modalMessage = document.getElementById('modal-message');
  modalMessage.textContent = message;
  modal.style.display = 'flex';
}

// Close Modal
document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

// Submit Review
document
  .getElementById('review-form')
  .addEventListener('submit', async (event) => {
    event.preventDefault();
    validateAndSubmit();
  });

async function validateAndSubmit() {
  const departmentId = document.getElementById('department').value;
  const doctorId = document.getElementById('doctor').value;
  const content = document.getElementById('review-text').value;
  const fileInput = document.getElementById('upload-file').files[0];
  const memberPassword = document.getElementById('review-password').value;
  const stars = document.querySelectorAll('.stars');

  const reviewDTO = {
    departmentId,
    doctorId,
    memberId: 1,
    content,
    memberPassword,
    explanationStars: parseInt(stars[0].dataset.selectedValue || 0),
    treatmentResultStars: parseInt(stars[1].dataset.selectedValue || 0),
    staffKindnessStars: parseInt(stars[2].dataset.selectedValue || 0),
    cleanlinessStars: parseInt(stars[3].dataset.selectedValue || 0),
  };

  // FormData 생성
  const formData = new FormData();
  formData.append('reviewDTO', JSON.stringify(reviewDTO)); // JSON으로 변환하여 전송
  if (fileInput) {
    formData.append('proveFile', fileInput); // 파일이 있을 경우 추가
  }

  try {
    const response = await fetch(
      'https://mallang-a85bb2ff492b.herokuapp.com/api/reviews',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (response.ok) {
      const result = await response.json();
      showModal(`리뷰가 성공적으로 등록되었습니다! ID: ${result.id}`);
      closeForm();
      fetchReviews();
    } else {
      const errorMessage = await response.text();
      showModal(errorMessage);
    }
  } catch (error) {
    console.error(error);
    showModal('리뷰 등록 중 오류가 발생했습니다.');
  }
}
