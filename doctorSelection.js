$(document).ready(function() {
  // 진료과목별 의료진 데이터
  const doctorData = {
    "내과": [
      { name: "김준완", image: "assets/의사이미지/내과/김준완.jpeg" },
      { name: "안정원", image: "assets/의사이미지/내과/안정원.jpeg" },
      { name: "양석형", image: "assets/의사이미지/내과/양석형.jpeg" },
      { name: "이익준", image: "assets/의사이미지/내과/이익준.jpeg" }
    ],
    "산부인과": [
      { name: "서정민", image: "assets/의사이미지/산부인과/서정민.jpeg" },
      { name: "이선호", image: "assets/의사이미지/산부인과/이선호.jpeg" },
      { name: "전소라", image: "assets/의사이미지/산부인과/전소라.jpeg" },
      { name: "정지훈", image: "assets/의사이미지/산부인과/정지훈.jpeg" }
    ],
    "소아청소년과": [
      { name: "민우혁", image: "assets/의사이미지/소아청소년과/민우혁.jpeg" },
      { name: "서인호", image: "assets/의사이미지/소아청소년과/서인호.jpeg" },
      { name: "차정숙", image: "assets/의사이미지/소아청소년과/차정숙.jpeg" },
      { name: "최승희", image: "assets/의사이미지/소아청소년과/최승희.jpeg" }
    ],
    "외과": [
      { name: "유혜정", image: "assets/의사이미지/외과/유혜정.jpeg" },
      { name: "정윤도", image: "assets/의사이미지/외과/정윤도.jpeg" },
      { name: "진서우", image: "assets/의사이미지/외과/진서우.jpeg" },
      { name: "홍지홍", image: "assets/의사이미지/외과/홍지홍.jpeg" }
    ]
  };

  // 진료과목 클릭 시 해당 의료진 리스트 표시
  $('#listView li').click(function() {
    const selectedDepartment = $(this).find('.tit').text();
    const doctorList = doctorData[selectedDepartment] || [];
    const $staffListView = $('#staffListView');

    // 이전 리스트 초기화 후 새로운 리스트 추가
    $staffListView.empty();
    doctorList.forEach(doctor => {
      $staffListView.append(`
        <li data-doctor="${doctor.name}">
          <img src="${doctor.image}" alt="${doctor.name}" class="doctor-img">
          <p>${doctor.name}</p>
        </li>
      `);
    });

    // 의료진 사진 클릭 시 의료진 선택
    $('#staffListView').on('click', '.doctor-img', function() {
      const selectedDoctor = $(this).closest('li').data('doctor');
      alert(`${selectedDoctor} 의사를 선택했습니다.`);
    });

    $('.medical_department_list').hide();
    $('.medical_staff_list').show();
    $('.navItem').removeClass('is-active');
    $('.navItem').eq(1).addClass('is-active');
  });

  // 네비게이션 클릭 시 진료과목 및 의료진 표시
  $('.navLink').click(function(e) {
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

  $('.medical_staff_list').hide();
});
