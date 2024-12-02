// 공통 적용되는 것 (네비게이션 바, footer)
console.clear();

$(function () {
  $('#navbar').load('common_assets/navbar.html');
  $('#footer').load('common_assets/footer.html');

  // 공통 이미지 스크롤 기능
  $('.scrollable-image').each(function () {
    const targetImage = $(this); // 각 이미지에 대해 처리

    // 마우스를 이미지 위로 가져갔을 때 커서 변경
    targetImage.on('mouseenter', function () {
      $(this).addClass('scroll-cursor');
    });

    // 마우스를 이미지 밖으로 이동했을 때 커서 원래대로
    targetImage.on('mouseleave', function () {
      $(this).removeClass('scroll-cursor');
    });

    // 클릭 이벤트 핸들러
    targetImage.on('click', function () {
      scrollToBelowImage(targetImage);
    });

    // 마우스 휠 이벤트 핸들러
    targetImage.on('wheel', function (event) {
      if (event.originalEvent.deltaY > 0) {
        scrollToBelowImage(targetImage);
      }
    });
  });

  // 이미지 아래로 스크롤하는 함수
  function scrollToBelowImage(imageElement) {
    const imageBottom = imageElement.offset().top + imageElement.outerHeight();
    $('html, body').animate({ scrollTop: imageBottom }, 400);
  }
});
