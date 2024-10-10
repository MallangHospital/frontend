// 공통 적용되는 것 (네비게이션 바, footer)
console.clear()

$(function(){
    $("#navbar").load("navbar.html");
    $("#footer").load("footer.html");
})

// 페이지별로 필요한 스크립트는 이런 식으로 조건문 만들어서 코드 작성 - contains('클래스이름')
if (document.body.classList.contains('login-page')) {
    console.log("This is the login page.");
}

if (document.body.classList.contains('main-page')) {
    console.log("This is the main page.");
}
