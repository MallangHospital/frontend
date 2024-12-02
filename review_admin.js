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
    '정말 리뷰를 삭제하시겠습니까?';
  document.getElementById('delete-popup').style.display = 'flex';
}

function closeDeletePopup() {
  document.getElementById('delete-popup').style.display = 'none';
}

async function deleteReview() {
  try {
    const response = await fetch(
      `https://mallang-a85bb2ff492b.herokuapp.com/api/reviews/${currentReviewId}?isAdmin=true`,
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
