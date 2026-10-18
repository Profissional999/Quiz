"use strict";

/* Depende de js/config.js (FEEDBACK_URL) e js/questions.js (QUESTIONS). */

const QUESTION_TIME = 45;     // segundos por pergunta
const URGENT_AT = 10;         // segundos restantes para o alerta vermelho
const TRANSITION_MS = 300;    // deve acompanhar a animação cardOut no CSS

const RESULT_TIERS = [
  { min: 90, icon: "✦", title: "Excelente resultado!",
    message: "Seu desempenho demonstra uma ótima compreensão dos temas. Continue aprofundando seus estudos e contribuindo para uma cultura de respeito à dignidade humana." },
  { min: 70, icon: "✧", title: "Muito bem!",
    message: "Você está no caminho certo. Revise os conceitos apresentados e continue fortalecendo sua compreensão sobre direitos, proteção e responsabilidade institucional." },
  { min: 50, icon: "❋", title: "Continue avançando!",
    message: "Cada questão é uma oportunidade de aprendizado. Releia as explicações, retome o material de estudo e tente novamente." },
  { min: 0, icon: "♡", title: "Todo aprendizado começa!",
    message: "O importante é seguir aprendendo. Aproveite as explicações, revise o conteúdo da turma e faça uma nova tentativa." }
];

const RATING_MESSAGES = {
  1: "Obrigado pela sua avaliação.",
  2: "Obrigado! Sua opinião é importante.",
  3: "Obrigado por compartilhar sua experiência.",
  4: "Que bom! Obrigado pela avaliação.",
  5: "Ficamos felizes que tenha gostado!"
};

/* ---------- Elementos e estado ---------- */

const $ = id => document.getElementById(id);

const els = {
  intro: $("intro"),
  quizSection: $("quizSection"),
  resultSection: $("resultSection"),
  card: $("quizCard"),
  questionCounter: $("questionCounter"),
  scoreCounter: $("scoreCounter"),
  progressTrack: $("progressTrack"),
  progressFill: $("progressFill"),
  tag: $("questionTag"),
  question: $("questionText"),
  answers: $("answers"),
  timer: $("timer"),
  timerText: $("timerText"),
  timerFill: $("timerFill"),
  feedback: $("feedback"),
  feedbackHeading: $("feedbackHeading"),
  feedbackText: $("feedbackText"),
  next: $("nextButton"),
  resultIcon: $("resultIcon"),
  resultTitle: $("resultTitle"),
  resultMessage: $("resultMessage"),
  finalScore: $("finalScore"),
  ratingMessage: $("ratingMessage"),
  commentInput: $("commentInput"),
  sendRating: $("sendRatingButton"),
  trap: $("websiteTrap"),
  stars: document.querySelectorAll(".star-button")
};

const state = {
  questions: [],   // perguntas na ordem sorteada
  answers: [],     // { question, selectedIndex, isCorrect, timedOut }
  index: 0,
  score: 0,
  answered: false,
  busy: false,     // true durante a animação de troca de pergunta
  review: false,
  endTime: 0,
  timerId: null,
  rating: 0,       // estrelas escolhidas (0 = nenhuma)
  sending: false,
  sent: false
};

/* ---------- Utilidades ---------- */

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Mostra apenas uma das três telas: "intro", "quiz" ou "result". */
function showScreen(name) {
  els.intro.hidden = name !== "intro";
  els.quizSection.hidden = name !== "quiz";
  els.resultSection.hidden = name !== "result";

  if (name === "intro") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    const target = name === "quiz" ? els.quizSection : els.resultSection;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setProgress(done, total) {
  els.progressFill.style.width = `${(done / total) * 100}%`;
  els.progressTrack.setAttribute("aria-valuemax", String(total));
  els.progressTrack.setAttribute("aria-valuenow", String(done));
}

function setNextButton(label, arrow = "→") {
  const arrowEl = document.createElement("span");
  arrowEl.setAttribute("aria-hidden", "true");
  arrowEl.textContent = arrow;
  els.next.replaceChildren(`${label} `, arrowEl);
  els.next.hidden = false;
}

/** Troca de pergunta com animação: sai o card atual, depois executa `then`. */
function swapCard(then) {
  state.busy = true;
  els.card.classList.remove("entering");
  els.card.classList.add("leaving");

  setTimeout(() => {
    els.card.classList.remove("leaving");
    state.busy = false;
    then();
  }, TRANSITION_MS);
}

function animateCardIn() {
  els.card.classList.remove("leaving", "entering");
  void els.card.offsetWidth; // reinicia a animação
  els.card.classList.add("entering");
}

/* ---------- Cronômetro (baseado no horário, sem acumular atraso) ---------- */

function stopTimer() {
  clearInterval(state.timerId);
  state.timerId = null;
}

function startTimer() {
  stopTimer();
  state.endTime = Date.now() + QUESTION_TIME * 1000;
  renderTimer();
  state.timerId = setInterval(tick, 250);
}

function tick() {
  if (state.answered || state.busy) return;
  renderTimer();
  if (state.endTime - Date.now() <= 0) selectAnswer(-1, true);
}

function renderTimer() {
  const msLeft = Math.max(0, state.endTime - Date.now());
  const secondsLeft = Math.ceil(msLeft / 1000);
  const urgent = secondsLeft <= URGENT_AT;

  els.timerText.textContent = `${secondsLeft}s`;
  els.timerFill.style.width = `${(msLeft / (QUESTION_TIME * 1000)) * 100}%`;
  els.timer.classList.toggle("urgent", urgent);
  els.timerFill.classList.toggle("urgent", urgent);
}

/* ---------- Partes compartilhadas entre quiz e revisão ---------- */

/**
 * Desenha as alternativas.
 * - interactive: botões clicáveis (quiz)
 * - caso contrário: botões travados mostrando certo/errado (revisão)
 */
function buildAnswers(question, { interactive, selectedIndex = -1 }) {
  const buttons = question.options.map((text, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.dataset.index = String(i);

    const letter = document.createElement("span");
    letter.className = "answer-letter";
    letter.setAttribute("aria-hidden", "true");
    letter.textContent = String.fromCharCode(65 + i);

    const label = document.createElement("span");
    label.className = "answer-label";
    label.textContent = text;

    button.append(letter, label);

    if (interactive) {
      button.addEventListener("click", () => selectAnswer(i, false));
    } else {
      button.disabled = true;
      markAnswer(button, i, question.correct, selectedIndex);
    }
    return button;
  });

  els.answers.replaceChildren(...buttons);
}

function markAnswer(button, index, correctIndex, selectedIndex) {
  if (index === correctIndex) button.classList.add("correct");
  else if (index === selectedIndex) button.classList.add("incorrect");
}

function showFeedback(isCorrect, heading, text) {
  els.feedback.className = `feedback ${isCorrect ? "is-correct" : "is-wrong"}`;
  els.feedback.hidden = false;
  els.feedbackHeading.textContent = heading;
  els.feedbackText.textContent = text;
}

function hideFeedback() {
  els.feedback.hidden = true;
  els.feedbackHeading.textContent = "";
  els.feedbackText.textContent = "";
}

function focusQuestion() {
  els.question.focus({ preventScroll: true });
}

/* ---------- Fluxo do quiz ---------- */

function startQuiz() {
  stopTimer();
  Object.assign(state, {
    questions: shuffle(QUESTIONS),
    answers: [],
    index: 0,
    score: 0,
    answered: false,
    busy: false,
    review: false
  });

  delete els.quizSection.dataset.mode;
  els.card.classList.remove("leaving", "entering");

  showScreen("quiz");   // primeiro mostra a tela, para o foco funcionar
  renderQuestion();
}

function renderQuestion() {
  const question = state.questions[state.index];
  const total = state.questions.length;
  state.answered = false;

  els.questionCounter.textContent = `Pergunta ${state.index + 1} de ${total}`;
  els.scoreCounter.textContent = `Acertos: ${state.score}`;
  setProgress(state.index, total);

  els.tag.textContent = question.type;
  els.question.textContent = question.text;
  buildAnswers(question, { interactive: true });
  hideFeedback();
  els.next.hidden = true;

  animateCardIn();
  focusQuestion();
  startTimer();
}

function selectAnswer(selectedIndex, timedOut) {
  if (state.answered || state.busy) return;

  state.answered = true;
  stopTimer();

  const question = state.questions[state.index];
  const isCorrect = selectedIndex === question.correct;
  if (isCorrect) state.score += 1;

  state.answers[state.index] = { question, selectedIndex, isCorrect, timedOut };

  els.answers.querySelectorAll(".answer-button").forEach(button => {
    button.disabled = true;
    markAnswer(button, Number(button.dataset.index), question.correct, selectedIndex);
  });

  const heading = timedOut ? "Tempo esgotado!"
    : isCorrect ? "✓ Muito bem! Resposta correta."
    : "✕ Vamos revisar esse conceito.";
  showFeedback(isCorrect, heading, question.explanation);

  els.scoreCounter.textContent = `Acertos: ${state.score}`;
  setProgress(state.index + 1, state.questions.length);

  const isLast = state.index === state.questions.length - 1;
  setNextButton(isLast ? "Ver resultado" : "Próxima pergunta");
}

function nextQuestion() {
  if (!state.answered || state.busy) return;
  stopTimer();

  swapCard(() => {
    state.index += 1;
    if (state.index >= state.questions.length) showResults();
    else renderQuestion();
  });
}

/* ---------- Resultado ---------- */

function showResults() {
  stopTimer();

  const total = state.questions.length;
  const percentage = Math.round((state.score / total) * 100);
  const tier = RESULT_TIERS.find(t => percentage >= t.min);

  els.finalScore.textContent = `${state.score}/${total}`;
  els.resultTitle.textContent = tier.title;
  els.resultMessage.textContent = tier.message;
  els.resultIcon.textContent = tier.icon;

  showScreen("result");
}

/* ---------- Revisão das respostas ---------- */

function startReview() {
  stopTimer();
  state.review = true;
  state.index = 0;
  state.busy = false;

  els.quizSection.dataset.mode = "review";
  showScreen("quiz");
  renderReview();
}

function renderReview() {
  const { question, selectedIndex, isCorrect, timedOut } = state.answers[state.index];
  const total = state.answers.length;

  els.questionCounter.textContent = `Revisão ${state.index + 1} de ${total}`;
  els.scoreCounter.textContent = `Acertos: ${state.score}`;
  setProgress(state.index + 1, total);

  els.tag.textContent = "Revisão";
  els.question.textContent = question.text;
  buildAnswers(question, { interactive: false, selectedIndex });

  const heading = isCorrect ? "✓ Resposta correta"
    : timedOut ? "Tempo esgotado"
    : "Resposta incorreta";
  showFeedback(isCorrect, heading, question.explanation);

  if (state.index === total - 1) setNextButton("Voltar ao resultado", "↑");
  else setNextButton("Próxima revisão");

  animateCardIn();
  focusQuestion();
}

function nextReview() {
  if (state.busy) return;

  swapCard(() => {
    state.index += 1;
    if (state.index >= state.answers.length) endReview();
    else renderReview();
  });
}

function endReview() {
  state.review = false;
  delete els.quizSection.dataset.mode;
  showScreen("result");
}

/* ---------- Reinício e avaliação ---------- */

function restartQuiz() {
  stopTimer();
  state.review = false;
  delete els.quizSection.dataset.mode;
  els.card.classList.remove("leaving", "entering");

  resetRatingForm();

  showScreen("intro");
  $("startButton").focus({ preventScroll: true });
}

function selectRating(rating) {
  if (state.sent || state.sending) return;

  state.rating = rating;
  els.stars.forEach(star => {
    const value = Number(star.dataset.rating);
    star.classList.toggle("selected", value <= rating);
    star.setAttribute("aria-pressed", String(value === rating));
  });

  els.sendRating.disabled = false;
  els.ratingMessage.textContent = "";
}

function setRatingFormLocked(locked) {
  els.stars.forEach(star => { star.disabled = locked; });
  els.commentInput.disabled = locked;
}

function resetRatingForm() {
  Object.assign(state, { rating: 0, sending: false, sent: false });

  els.stars.forEach(star => {
    star.classList.remove("selected");
    star.setAttribute("aria-pressed", "false");
  });
  setRatingFormLocked(false);

  els.commentInput.value = "";
  els.trap.value = "";
  els.sendRating.disabled = true;
  els.sendRating.textContent = "Enviar avaliação";
  els.ratingMessage.textContent = "";
}

/** Envia nota e comentário (anônimos) para a planilha via Google Apps Script. */
async function sendFeedback() {
  if (!state.rating || state.sending || state.sent) return;
  if (els.trap.value) return; // campo-isca preenchido: provavelmente um robô

  if (!FEEDBACK_URL) {
    els.ratingMessage.textContent = "O envio de avaliações ainda não foi configurado.";
    return;
  }

  state.sending = true;
  els.sendRating.disabled = true;
  els.sendRating.textContent = "Enviando…";
  els.ratingMessage.textContent = "";

  try {
    // "no-cors" + text/plain evita bloqueios do navegador com o Apps Script.
    await fetch(FEEDBACK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        rating: state.rating,
        comment: els.commentInput.value.trim()
      })
    });

    state.sent = true;
    setRatingFormLocked(true);
    els.sendRating.textContent = "Avaliação enviada ✓";
    els.ratingMessage.textContent = RATING_MESSAGES[state.rating];
  } catch (error) {
    els.sendRating.disabled = false;
    els.sendRating.textContent = "Enviar avaliação";
    els.ratingMessage.textContent = "Não foi possível enviar agora. Confira sua conexão e tente de novo.";
  } finally {
    state.sending = false;
  }
}

/* ---------- Eventos ---------- */

$("startButton").addEventListener("click", startQuiz);
$("restartButton").addEventListener("click", restartQuiz);
$("reviewButton").addEventListener("click", startReview);

els.next.addEventListener("click", () => {
  if (state.review) nextReview();
  else nextQuestion();
});

els.stars.forEach(star => {
  star.addEventListener("click", () => selectRating(Number(star.dataset.rating)));
});
els.sendRating.addEventListener("click", sendFeedback);
