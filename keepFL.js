let date = JSON.parse(localStorage.getItem("date")) || "";
let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
let histories = JSON.parse(localStorage.getItem("histories")) || [];
let dailySummaries = JSON.parse(localStorage.getItem("dailySummary")) || {};



// 통장별명 목록 띄우기
function init() {
  const option = document.getElementById("nickname");

  accounts.forEach((account) => {
    option.innerHTML += `<option value="${account.nickname}">${account.nickname}</option>`
  });
  
  if (!dailySummaries[date]) {
    dailySummaries[date] = { income: 0, expense: 0, total: 0 };
  }
  date_init();
}

function date_init() {
  const dateControl = document.getElementById("dateControl");
  
  if(!date) date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD 형식으로 저장
  localStorage.setItem("date", JSON.stringify(date));

  dateControl.innerHTML = "<button onclick=\"move_date(0)\"><</button>"
  dateControl.innerHTML += `<div class="date">` + date + `</div>`
  dateControl.innerHTML += "<button onclick=\"move_date(1)\">></button>"
}

function move_date(b) {
  let moveDate = new Date(date);
  
  document.getElementById("nickname").value = "select";
  document.getElementById("income-expenses").value = "select";

  (b === 0) ? moveDate.setDate(moveDate.getDate() - 1) : moveDate.setDate(moveDate.getDate() + 1)

  let y = moveDate.getFullYear();
  let m = String(moveDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
  let d = String(moveDate.getDate()).padStart(2, '0');
  date = `${y}-${m}-${d}`;
  
  localStorage.setItem("date", JSON.stringify(date));

  date_init();
  display_histories();
}

// 수입, 지출 내역 등록하기 (income, expensise)
function resister_IE() {
  const nowdate = date;
  const nickname = document.getElementById("nickname").value;
  const incomeExpense = document.getElementById("income-expenses").value;
  const amount = document.getElementById("amount").value;

  if ((nickname === 'select') || (incomeExpense === 'select') || !amount) {
    alert("모든 항목을 입력해주세요!");
    return;
  }
  
  // 숫자가 아닐 때
  if (isNaN(amount)) {
    alert("금액은 숫자로 입력해야 합니다!");
    return;
  }

  const history = {
    date: nowdate,
    nickname: nickname,
    incomeExpense: incomeExpense,
    amount: amount
  };

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].nickname === nickname) {
      let balance = Number(accounts[i].balance);
      let aAmount = Number(amount);
      (history.incomeExpense === "income") ? balance += aAmount : balance -= aAmount;
      accounts[i].balance = balance;
    }
  }

  histories.push(history);
  localStorage.setItem("accounts", JSON.stringify(accounts));
  localStorage.setItem("histories", JSON.stringify(histories));
  day_IE(); // 일일 입출금 내역 관리

  document.getElementById("amount").value = "";

  display_histories();
}

// 거래내역 출력
function display_histories() {
  const content = document.getElementById("content");
  content.innerHTML = "";

  let hasHistory = false;

  histories.forEach((history, index) => {
    if (history.date === date) {
      hasHistory = true;
      const incomeExpense = (history.incomeExpense === "income") ? "수입" : "지출";

      content.innerHTML += `
        <div class="historyList">
          <p>${history.nickname}</p>
          <p>${incomeExpense}</p>
          <p>${history.amount}</p>
          <button onclick="delete_history(${index})">-</button>
        </div>
      `;
    }
  });

  if (!hasHistory) {
    content.innerHTML = "<p>오늘의 입출금 내역을 입력해주세요.</p>";
  }
}

// 배열에서 내역 제거
function delete_history(index) {
  const nickname = histories[index].nickname;
  const amount = histories[index].amount;

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].nickname === nickname) {
      let balance = Number(accounts[i].balance);
      let aAmount = Number(amount);
      balance -= aAmount;
      accounts[i].balance = balance;
    }
  }

  histories.splice(index, 1);

  localStorage.setItem("accounts", JSON.stringify(accounts));
  localStorage.setItem("histories", JSON.stringify(histories));
  display_histories(); // 목록 새로고침

  day_IE();
}

// 일일 입출금 정보 저장
function day_IE() {
  if (!dailySummaries[date]) {
    dailySummaries[date] = { income: 0, expense: 0, total: 0 };
  } else {
    // 이미 존재하면 값만 리셋
    dailySummaries[date].income = 0;
    dailySummaries[date].expense = 0;
    dailySummaries[date].total = 0;
  }

  histories.forEach((history) => {
    if (history.date === date) {
      (history.incomeExpense === "income") ? dailySummaries[date].income += Number(history.amount) : dailySummaries[date].expense += Number(history.amount);
      dailySummaries[date].total = dailySummaries[date].income - dailySummaries[date].expense
    }
  });

  localStorage.setItem("dailySummary", JSON.stringify(dailySummaries));

  display_total();
}

// 합계 출력
function display_total() {
  const totalLabel = document.getElementById("total");
  const total = (dailySummaries[date].total) ? dailySummaries[date].total : "0";

  totalLabel.innerHTML = `<p>합계 : ${total}</p>`
}

window.onload = function () {
  init();
  display_histories();
  day_IE();
};

window.onbeforeunload = function() {
  localStorage.removeItem("date");
};