$(document).ready(function () {
  const baseUrl = 'https://mallang-a85bb2ff492b.herokuapp.com'; // Heroku API URL
  const jwtToken = localStorage.getItem('jwtToken');

  console.log('로컬 스토리지에서 가져온 JWT 토큰:', jwtToken); // 디버깅

  // 네비바와 푸터를 동적으로 로드
  $('#navbar').load('common_assets/navbar.html', function () {
    // 네비바 로드 완료 후 로그인 상태에 맞게 UI 업데이트
    console.log('네비바 로드 완료, 로그인 상태 체크 시작');
    if (jwtToken) {
      updateAuthUI(true); // 로그인 상태
    } else {
      updateAuthUI(false); // 비로그인 상태
    }
  });
  $('#footer').load('common_assets/footer.html');

  // 로그아웃 동작
  $(document).on('click', '#authAction a', function (e) {
    e.preventDefault(); // 기본 링크 동작 방지
    if ($(this).text() === '로그아웃') {
      console.log('로그아웃 시도');
      handleLogout(baseUrl);
    } else {
      console.log('로그인 페이지로 이동');
      window.location.href = '/login.html'; // 로그인 페이지로 이동
    }
  });

  let isScrolling = false; // 스크롤 상태 추적 변수

  $('.scrollable-image').each(function () {
    const targetImage = $(this);

    // 클릭 이벤트 핸들러
    targetImage.on('click', function () {
      scrollToBelowImage(targetImage);
    });

    // 마우스 휠 이벤트 핸들러
    targetImage.on('wheel', function (event) {
      if (event.originalEvent.deltaY > 0) {
        scrollToBelowImage(targetImage);
        event.preventDefault();
      }
    });

    // 터치패드 이벤트 핸들러
    targetImage.on('touchmove', function (event) {
      const touch = event.originalEvent.touches[0];
      if (touch) {
        scrollToBelowImage(targetImage);
        event.preventDefault();
      }
    });
  });

  function scrollToBelowImage(imageElement) {
    if (isScrolling) return; // 이미 스크롤 중이면 실행하지 않음
    isScrolling = true;

    const imageBottom = imageElement.offset().top + imageElement.outerHeight();
    $('html, body')
      .stop(true)
      .animate({ scrollTop: imageBottom }, 400, 'swing', function () {
        isScrolling = false; // 애니메이션 완료 후 플래그 해제
      });
  }
});

// 로그아웃 처리
function handleLogout(baseUrl) {
  const jwtToken = localStorage.getItem('jwtToken'); // 토큰을 다시 불러옵니다.
  console.log('로그아웃 요청, 토큰:', jwtToken);

  $.ajax({
    url: `${baseUrl}/logout`, // Heroku API의 로그아웃 엔드포인트
    type: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`, // JWT 토큰 추가
    },
    success: function () {
      console.log('로그아웃 성공');
      localStorage.removeItem('jwtToken'); // 로컬스토리지의 토큰 삭제
      alert('로그아웃되었습니다.');
      updateAuthUI(false); // UI 업데이트
      window.location.href = '/login.html'; // 로그인 페이지로 이동
    },
    error: function (error) {
      console.error('로그아웃 실패', error);
      alert('로그아웃에 실패했습니다.');
    },
  });
}

// 로그인 상태에 따른 UI 업데이트
function updateAuthUI(isLoggedIn) {
  console.log('updateAuthUI 호출, isLoggedIn:', isLoggedIn); // 디버깅: 로그인 상태 확인
  if (isLoggedIn) {
    console.log('로그인 상태 UI 업데이트');
    $('#authAction')
      .html('<a href="#">로그아웃</a>') // '로그아웃' 링크로 변경
      .removeClass('login')
      .addClass('logout');
    $('#authDivider').hide(); // 구분자 숨기기
    $('#registerAction').hide(); // 회원가입 버튼 숨기기
  } else {
    console.log('비로그인 상태 UI 업데이트');
    $('#authAction')
      .html('<a href="/login.html">로그인</a>') // '로그인' 링크로 변경
      .removeClass('logout')
      .addClass('login');
    $('#authDivider').show(); // 구분자 보이기
    $('#registerAction').show(); // 회원가입 버튼 보이기
  }
}
