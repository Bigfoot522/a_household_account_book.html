let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
let histories = JSON.parse(localStorage.getItem("histories")) || [];
let dailySummary = JSON.parse(localStorage.getItem("dailySummary")) || [];

const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD 형식으로 저장

// 통장별명 목록 띄우기
function init() {
  const option = document.getElementById("nickname");

  accounts.forEach((account) => {
    option.innerHTML += `<option value="${account.nickname}">${account.nickname}</option>`
  });
  
  if (!dailySummary[currentDate]) {
    dailySummary[currentDate] = { income: 0, expense: 0, total: 0 };
  }
}

// 수입, 지출 내역 등록하기 (income, expensise)
function resister_IE() {
  const nickname = document.getElementById("nickname").value;
  const incomeExpense = document.getElementById("income-expenses").value;
  const amount = document.getElementById("amount").value;

  if (!nickname || !incomeExpense || !amount) {
    alert("모든 항목을 입력해주세요!");
    return;
  }

  // 숫자가 아닐 때
  if (isNaN(amount)) {
    alert("금액은 숫자로 입력해야 합니다!");
    return;
  }

  const history = {
    nickname: nickname,
    incomeExpense: incomeExpense,
    amount: amount
  };

  histories.push(history); // 배열에 추가
  localStorage.setItem("histories", JSON.stringify(histories)); //로컬 저장소에 배열 저장
  day_IE(history); // 일일 입출금 내역 관리

  document.getElementById("amount").value = "";

  display_histories();
}

// 거래내역 출력
function display_histories() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "<h2>입출금 내역</h2>";

  if (histories.length === 0) {
    historyList.innerHTML += "<p>오늘의 입출금 내역을 입력해주세요.</p>";
    return;
  }

  histories.forEach((history, index) => {
    const incomeExpense = (history.incomeExpense === "income") ? "수입" : "지출";
    
    historyList.innerHTML += `
      <div class="historyList">
        <p>${history.nickname}</p>
        <p>` + incomeExpense + `</p>
        <p>${history.amount}</p>
        <button onclick="delete_history(${index})">-</button>
      </div>
    `
  });
}

// 배열에서 내역 제거
function delete_history(index) {
  histories.splice(index, 1); 
  localStorage.setItem("histories", JSON.stringify(histories)); // 로컬 스토리지 업데이트
  display_histories(); // 목록 새로고침
  day_IE();
}

// 일일 입출금 정보 저장
function day_IE() {
  dailySummary[currentDate] = { income: 0, expense: 0, total: 0 };

  histories.forEach((history) => {
    (history.incomeExpense === "income") ? dailySummary[currentDate].income += Number(history.amount) : dailySummary[currentDate].expense += Number(history.amount);
    dailySummary[currentDate].total = dailySummary[currentDate].income - dailySummary[currentDate].expense
  });

  localStorage.setItem("dailySummary", JSON.stringify(dailySummary));
  
  display_total();
}

// 합계 출력
function display_total() {
  const totalLabel = document.getElementById("total");
  const total = (dailySummary[currentDate].total) ? dailySummary[currentDate].total : "0";

  totalLabel.innerHTML = `<p>합계 : ${total}</p>`
}

window.onload = function () {
  init();
  display_histories();
  day_IE();
};