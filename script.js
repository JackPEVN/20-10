
const $ = (id) => document.getElementById(id);

const screens = ["intro", "game", "result", "letter", "special"];

function showScreen(id) {
  screens.forEach((screen) => {
    $(screen).classList.toggle("hidden", screen !== id);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Mini game: đúng 3 câu
const questions = [
  {
    question: "Trong ngày 20/10, điều gì quan trọng nhất?",
    answers: [
      "Có quà thật to 🎁",
      "Có người quan tâm 💗",
      "Được nghỉ cả ngày 😴",
      "Tất cả đáp án trên 😎"
    ],
    correct: 3,
    reactions: [
      "Thực tế dữ vậy trời 💀",
      "Cũng hợp lý đó nha!",
      "Mơ ước giản dị ghê.",
      "Đáp án quá hoàn hảo!"
    ]
  },
  {
    question: "Nếu được ban một điều ước, bạn chọn gì?",
    answers: [
      "Giàu nứt vách 💰",
      "Luôn vui vẻ ✨",
      "Ăn ngon không hết tiền 🍰",
      "Cả ba luôn, hỏi gì kỳ vậy?"
    ],
    correct: 3,
    reactions: [
      "Tham vọng lớn ví tiền nhỏ :<.",
      "Cũng hợp lý đó nha!",
      "Ăn ngon là hạnh phúc mà bro.",
      "Không có gì để phản biện 🐧"
    ]
  },
  {
    question: "Ai xứng đáng được chúc mừng hôm nay?",
    answers: [
      "Người đang đọc web này 👀",
      "Một người nổi tiếng nào đó",
      "Con mèo hàng xóm 🐈",
      "Cái máy tính của tôi"
    ],
    correct: 0,
    reactions: [
      "Chính xác! Nhân vật chính đây rồi 💗",
      "Ủa rồi bạn vào đây làm gì?",
      "Mèo cũng cần ngày riêng chứ!",
      "Máy tính chắc không cần đâu bro."
    ]
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  answered = false;

  const q = questions[currentQuestion];

  $("questionCount").textContent =
    `CÂU ${currentQuestion + 1} / ${questions.length}`;

  $("scoreLabel").textContent = `Điểm: ${score}`;

  $("progressBar").style.width =
    `${(currentQuestion / questions.length) * 100}%`;

  $("questionText").textContent = q.question;
  $("gameFeedback").textContent = "";
  $("nextBtn").classList.add("hidden");

  const answersBox = $("answers");
  answersBox.replaceChildren();

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");

    button.className = "answer-btn";
    button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;

    button.addEventListener("click", () => chooseAnswer(index));

    answersBox.appendChild(button);
  });
}

function chooseAnswer(index) {
  if (answered) return;
  answered = true;

  const q = questions[currentQuestion];
  const buttons = [...$("answers").children];

  buttons.forEach((button) => {
    button.disabled = true;
  });

  if (index === q.correct) {
    score++;
    buttons[index].classList.add("correct");
  } else {
    buttons[index].classList.add("wrong");
    buttons[q.correct].classList.add("correct");
  }

  $("gameFeedback").textContent = q.reactions[index];
  $("scoreLabel").textContent = `Điểm: ${score}`;
  $("progressBar").style.width =
    `${((currentQuestion + 1) / questions.length) * 100}%`;

  $("nextBtn").textContent =
    currentQuestion === questions.length - 1
      ? "XEM KẾT QUẢ ✨"
      : "CÂU TIẾP THEO →";

  $("nextBtn").classList.remove("hidden");
}

function showResult() {
  $("finalScore").textContent = `${score} / ${questions.length}`;

  if (score === 3) {
    $("resultTitle").textContent = "THIÊN TÀI 20/10! 👑";
    $("resultMessage").textContent =
      "Không chỉ sigma mà còn trả lời juan. Nhận lời chúc đeee!";
  } else if (score === 2) {
    $("resultTitle").textContent = "Tiềm năng! 💖";
    $("resultMessage").textContent =
      "Bạn đã vượt qua bài kiểm tra. Phần thưởng đang chờ phía trước!";
  } else {
    $("resultTitle").textContent = "ĐỘ VÔ TRI ĐẠT CHUẨN 🐧";
    $("resultMessage").textContent =
      "Điểm số không quan trọng, hôm nay bạn vẫn xứng đáng được chúc mừng!";
  }

  showScreen("result");
}

$("startBtn").addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  renderQuestion();
  showScreen("game");
});

$("nextBtn").addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResult();
  }
});

// Kết quả -> thư chúc
$("giftBtn").addEventListener("click", () => {
  showScreen("letter");
  burstParticles(24);
});

// Thư chúc -> màn ẩn
$("specialBtn").addEventListener("click", () => {
  resetSpecialScreen();
  showScreen("special");
});

// Màn ẩn: nút Không chạy trốn
const noBtn = $("noBtn");
let noAttempts = 0;

function moveNoButton() {
  const padding = 12;
  const maxX = Math.max(
    padding,
    window.innerWidth - noBtn.offsetWidth - padding
  );
  const maxY = Math.max(
    padding,
    window.innerHeight - noBtn.offsetHeight - padding
  );

  noBtn.classList.add("running");
  noBtn.style.left =
    `${padding + Math.random() * (maxX - padding)}px`;
  noBtn.style.top =
    `${padding + Math.random() * (maxY - padding)}px`;

  noAttempts++;

  if (noAttempts === 1) {
    $("specialFeedback").textContent =
      "Ơ KÌA, SAO LẠI ĐỊNH BẤM KHÔNG? 💀";
  } else if (noAttempts === 4) {
    $("specialFeedback").textContent =
      "NÚT KHÔNG ĐÃ KÍCH HOẠT CHẾ ĐỘ SINH TỒN 🏃";
  } else if (noAttempts >= 7) {
    $("specialFeedback").textContent =
      "BỎ CUỘC ĐI BRO, KHÔNG BẮT ĐƯỢC ĐÂU 😭";
  }
}

noBtn.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse") {
    moveNoButton();
  }
});

noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButton();
}, { passive: false });

noBtn.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton();
});

// Bấm Có -> quay về thư chúc
$("yesBtn").addEventListener("click", () => {
  $("specialFeedback").textContent =
    "Haiz tôi biết mà 🏆💗";

  $("yesBtn").disabled = true;
  noBtn.disabled = true;

  burstParticles(35);

  setTimeout(() => {
    resetSpecialScreen();
    showScreen("letter");
  }, 1200);
});

function resetSpecialScreen() {
  noBtn.classList.remove("running");
  noBtn.style.left = "";
  noBtn.style.top = "";

  $("specialFeedback").textContent = "";
  $("yesBtn").disabled = false;
  noBtn.disabled = false;

  noAttempts = 0;
}

// Hiệu ứng hạt
function burstParticles(amount = 18) {
  const symbols = ["💗", "✨", "💖", "💕", "⭐"];

  for (let i = 0; i < amount; i++) {
    const particle = document.createElement("span");

    particle.className = "particle";
    particle.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${45 + Math.random() * 45}vh`;
    particle.style.fontSize = `${12 + Math.random() * 16}px`;

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 1200);
  }
}
