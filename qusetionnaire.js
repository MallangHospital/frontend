const API_BASE_URL = "https://mallang-a85bb2ff492b.herokuapp.com/api/questionnaire";

// 문진표 질문 로드 및 기존 응답 표시
document.addEventListener("DOMContentLoaded", () => {
  loadQuestionsAndResponses();
});

// 질문과 응답을 함께 로드
async function loadQuestionsAndResponses() {
  try {
    const [questionsResponse, responsesResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/questions`, {
        method: "GET",
        credentials: "include",
      }),
      fetch(`${API_BASE_URL}/responses`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }),
    ]);

    if (!questionsResponse.ok || !responsesResponse.ok) {
      throw new Error("질문 또는 응답 데이터를 불러오는 데 실패했습니다.");
    }

    const questions = await questionsResponse.json();
    const responses = await responsesResponse.json();
    renderQuestionsWithResponses(questions, responses);
  } catch (error) {
    console.error("오류 발생:", error.message);
    alert("문진표 데이터를 로드하는 중 오류가 발생했습니다.");
  }
}

// 질문과 저장된 응답 렌더링
function renderQuestionsWithResponses(questions, responses) {
  const questionsContainer = document.getElementById("questionnaire-container");
  questionsContainer.innerHTML = ""; // 기존 콘텐츠 초기화

  const questionHTML = questions
    .map((question, index) => {
      const savedResponse = responses.find((r) => r.questionId === question.id);
      const savedAnswer = savedResponse ? savedResponse.answer : null;

      return `
        <div class="question-container">
          <div class="question-text">
            <h3>${index + 1}. ${question.content}</h3>
          </div>
          <div class="radio-container">
            ${[5, 4, 3, 2, 1]
              .map(
                (value) => `
              <label class="radio-label">
                <input type="radio" name="question${question.id}" value="${value}" ${
                  savedAnswer === value ? "checked" : ""
                }>
                <div class="circle"></div>
                <div class="radio-text">${value === 5 ? "그렇다" : value === 1 ? "그렇지 않다" : ""}</div>
              </label>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    })
    .join("");

  // 질문을 추가로 삽입
  const buttonHTML = `
    <div class="button-container">
      <button id="saveButton">저장</button>
    </div>
  `;

  questionsContainer.insertAdjacentHTML("beforeend", questionHTML + buttonHTML);

  // 저장 버튼 이벤트 추가
  document.getElementById("saveButton").addEventListener("click", saveResponses);
}

// 문진표 응답 저장 함수
async function saveResponses() {
  try {
    const responses = [];
    const radios = document.querySelectorAll("input[type='radio']:checked");

    radios.forEach((radio) => {
      const questionId = radio.name.replace("question", ""); // question1 => 1
      const answer = radio.value; // 응답 값 가져오기
      responses.push({ questionId: parseInt(questionId, 10), answer: parseInt(answer, 10) });
    });

    if (responses.length === 0) {
      alert("응답을 입력해주세요.");
      return;
    }

    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login.html";
      return;
    }

    const response = await fetch(`${API_BASE_URL}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(responses), // ResponseDTO 배열로 전송
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("서버 응답:", errorText);
      throw new Error("문진표 응답 저장에 실패했습니다.");
    }

    alert("문진표 응답이 성공적으로 저장되었습니다.");
  } catch (error) {
    console.error("오류 발생:", error.message);
    alert("문진표 응답 저장 중 오류가 발생했습니다.");
  }
}
