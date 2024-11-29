let currentReviewId = null;

async function fetchReviews(page = 1) {
  try {
    const response = await fetch(`/reviews?page=${page}`);
    if (!response.ok)
      throw new Error('리뷰 데이터를 불러오는 데 실패했습니다.');

    const data = await response.json();
    const reviews = data.reviews;
    const totalPages = data.totalPages;

    // 평균 데이터 업데이트
    const averageScore = calculateAverage(
      reviews.map((review) => review.rating)
    );
    const detailRatings = calculateDetailAverages(reviews);

    document.getElementById('average-stars').textContent =
      '★'.repeat(Math.round(averageScore)) +
      '☆'.repeat(5 - Math.round(averageScore));
    document.getElementById(
      'average-score'
    ).textContent = `${averageScore.toFixed(1)} / 10`;
    document.getElementById('total-reviews').textContent = data.totalReviews;
    document.getElementById(
      'detail-description'
    ).textContent = `자세한 설명: ★${detailRatings.description.toFixed(1)}`;
    document.getElementById(
      'treatment-result'
    ).textContent = `치료 후 결과: ★${detailRatings.treatment.toFixed(1)}`;
    document.getElementById(
      'staff-kindness'
    ).textContent = `직원의 친절: ★${detailRatings.staff.toFixed(1)}`;
    document.getElementById(
      'cleanliness'
    ).textContent = `청결함: ★${detailRatings.cleanliness.toFixed(1)}`;

    renderReviews(reviews);
    renderPagination(totalPages, page);
  } catch (error) {
    console.error(error.message);
    alert('리뷰 데이터를 불러오는 중 오류가 발생했습니다.');
  }
}

function calculateAverage(scores) {
  if (scores.length === 0) return 0;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function calculateDetailAverages(reviews) {
  const totals = {
    description: 0,
    treatment: 0,
    staff: 0,
    cleanliness: 0,
  };
  let count = 0;

  reviews.forEach((review) => {
    if (review.detailRatings) {
      totals.description += review.detailRatings.description || 0;
      totals.treatment += review.detailRatings.treatment || 0;
      totals.staff += review.detailRatings.staff || 0;
      totals.cleanliness += review.detailRatings.cleanliness || 0;
      count++;
    }
  });

  return {
    description: count ? totals.description / count : 0,
    treatment: count ? totals.treatment / count : 0,
    staff: count ? totals.staff / count : 0,
    cleanliness: count ? totals.cleanliness / count : 0,
  };
}

function renderReviews(reviews) {
  const reviewList = document.getElementById('review-list');
  reviewList.innerHTML = '';

  reviews.forEach((review) => {
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';
    reviewItem.innerHTML = `
      <h3>${review.username}</h3>
      <p>진료과: ${review.department}, 의사: ${review.doctor}</p>
      <p class="average-stars">${'★'.repeat(review.rating)}${'☆'.repeat(
      5 - review.rating
    )}</p>
      <p>${review.content}</p>
      <p>${new Date(review.createdAt).toLocaleDateString()}</p>
      <button onclick="openDeletePopup(${review.id})">삭제</button>
    `;
    reviewList.appendChild(reviewItem);
  });
}

function openDeletePopup(reviewId) {
  currentReviewId = reviewId;

  const popupMessage = document.getElementById('popup-message');
  const passwordInput = document.getElementById('popup-password');
  const confirmButton = document.getElementById('popup-confirm');
  const cancelButton = document.getElementById('popup-cancel');

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
      `/reviews/${currentReviewId}?password=${password}`,
      { method: 'DELETE' }
    );
    const message = await response.text();

    if (response.ok) {
      document.getElementById('popup-password').style.display = 'none';
      document.getElementById('popup-cancel').style.display = 'none';
      document.getElementById('popup-message').textContent = message;
      setTimeout(() => {
        closeDeletePopup();
        fetchReviews();
      }, 1500);
    } else {
      document.getElementById('popup-message').textContent = message;
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

document.getElementById('open-review-modal').addEventListener('click', () => {
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
  const department = document.getElementById('department').value;
  const doctor = document.getElementById('doctor').value;
  const content = document.getElementById('review-text').value;
  const fileInput = document.getElementById('upload-file').files[0];
  const memberPassword = document.getElementById('review-password').value;
  const stars = document.querySelectorAll('.stars');

  if (!department) {
    showModal('진료과를 선택해주세요.');
    return;
  }

  if (!doctor) {
    showModal('의사를 선택해주세요.');
    return;
  }

  // 별점 데이터 수집
  const detailStars = [];
  for (const starContainer of stars) {
    const selectedStars = parseInt(starContainer.dataset.selectedValue || 0);
    if (!selectedStars) {
      const label = starContainer.previousElementSibling.textContent;
      showModal(`${label} 항목에 별점을 선택해주세요.`);
      return;
    }
    detailStars.push(selectedStars); // 선택된 별점 값을 배열에 추가
  }

  if (!content.trim()) {
    showModal('리뷰 내용을 입력해주세요.');
    return;
  }

  if (!fileInput) {
    showModal('병원 방문을 인증할 자료를 업로드해주세요.');
    return;
  }

  if (!memberPassword.trim()) {
    showModal('비밀 번호를 입력해주세요.');
    return;
  }

  // 데이터 구성
  const reviewData = {
    department,
    doctor,
    detailStars,
    content,
    memberPassword,
  };

  const formData = new FormData();
  formData.append('reviewDTO', JSON.stringify(reviewData));

  // 파일을 FormData에 추가
  formData.append('receiptFile', fileInput);

  try {
    const response = await fetch(
      'https://mallang-a85bb2ff492b.herokuapp.com/api/review',
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
