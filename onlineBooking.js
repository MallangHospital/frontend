$(document).ready(function () {
  // 진료과목별 의료진 데이터
  const doctorData = {
    "내과": [
      { name: "김준완", image: "assets/의사이미지/내과/김준완.jpeg", status: "휴진" },
      { name: "안정원", image: "assets/의사이미지/내과/안정원.jpeg", status: "대기", waiting: 3, waitingTime: "30분" },
      { name: "양석형", image: "assets/의사이미지/내과/양석형.jpeg", status: "대기", waiting: 2, waitingTime: "20분" },
      { name: "이익준", image: "assets/의사이미지/내과/이익준.jpeg", status: "휴진" }
    ],
    "산부인과": [
      { name: "서정민", image: "assets/의사이미지/산부인과/서정민.jpeg", status: "대기", waiting: 4, waitingTime: "40분" },
      { name: "이선호", image: "assets/의사이미지/산부인과/이선호.jpeg", status: "휴진" },
      { name: "전소라", image: "assets/의사이미지/산부인과/전소라.jpeg", status: "대기", waiting: 1, waitingTime: "10분" },
      { name: "정지훈", image: "assets/의사이미지/산부인과/정지훈.jpeg", status: "휴진" }
    ],
    "소아청소년과": [
      { name: "민우혁", image: "assets/의사이미지/소아청소년과/민우혁.jpeg", status: "대기", waiting: 2, waitingTime: "15분" },
      { name: "서인호", image: "assets/의사이미지/소아청소년과/서인호.jpeg", status: "휴진" },
      { name: "차정숙", image: "assets/의사이미지/소아청소년과/차정숙.jpeg", status: "대기", waiting: 3, waitingTime: "25분" },
      { name: "최승희", image: "assets/의사이미지/소아청소년과/최승희.jpeg", status: "휴진" }
    ],
    "외과": [
      { name: "유혜정", image: "assets/의사이미지/외과/유혜정.jpeg", status: "대기", waiting: 5, waitingTime: "50분" },
      { name: "정윤도", image: "assets/의사이미지/외과/정윤도.jpeg", status: "대기", waiting: 2, waitingTime: "20분" },
      { name: "진서우", image: "assets/의사이미지/외과/진서우.jpeg", status: "휴진" },
      { name: "홍지홍", image: "assets/의사이미지/외과/홍지홍.jpeg", status: "휴진" }
    ]
  };

  // 진료과목 클릭 시 해당 의료진 리스트 표시
  $('#listView li').click(function () {
    const selectedDepartment = $(this).find('.tit').text();
    const doctorList = doctorData[selectedDepartment] || [];
    const $staffListView = $('#staffListView');

    // 이전 리스트 초기화 후 새로운 리스트 추가
    $staffListView.empty();
    doctorList.forEach(doctor => {
      let statusHTML = "";

      if (doctor.status === "휴진") {
        statusHTML = `<p>휴진</p>`;
      } else if (doctor.status === "대기") {
        statusHTML = `
          <p>대기자 ${doctor.waiting}명</p>
          <p>예상 대기 시간 ${doctor.waitingTime}</p>
        `;
      }

      $staffListView.append(`
        <li data-doctor="${doctor.name}">
          <div class="doctor-info">
            <img src="${doctor.image}" alt="${doctor.name}" class="doctor-img">
            <p class="doctor-name">${doctor.name}</p>
          </div>
          <div class="doctor-status">
            ${statusHTML}
          </div>
        </li>
      `);
    });

    // **의사 카드 클릭 시 선택 이벤트 추가**
    $('#staffListView').off('click').on('click', 'li', function () {
      const selectedDoctor = $(this).data('doctor');

      // AJAX 요청을 통해 선택된 의사 이름을 백엔드로 전송
      $.ajax({
        type: 'POST',
        url: '/send-doctor', // 백엔드 API 엔드포인트
        data: { doctorName: selectedDoctor },
        success: function (response) {
          // 데이터 전송 성공 시 페이지 이동
          window.location.href = 'online_booking_step.html';
        },
        error: function (error) {
          console.error('Error sending doctor data:', error);
          alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
      });
    });

    $('.medical_department_list').hide();
    $('.medical_staff_list').show();
    $('.navItem').removeClass('is-active');
    $('.navItem').eq(1).addClass('is-active');
  });

  // 네비게이션 클릭 시 진료과목 및 의료진 표시
  $('.navLink').click(function (e) {
    e.preventDefault();
    $('.navItem').removeClass('is-active');
    $(this).parent().addClass('is-active');
    const target = $(this).data('target');

    if (target === '진료 과목') {
      $('.medical_department_list').show();
      $('.medical_staff_list').hide();
    } else if (target === '의료진 선택') {
      $('.medical_department_list').hide();
      $('.medical_staff_list').show();
    }
  });

  // 초기 상태: 진료과목 리스트만 표시
  $('.medical_staff_list').hide();
});
