let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

function account_list() {
  const option = document.getElementById("nickname");

  accounts.forEach((account) => {
    option.innerHTML += `
      <option value="${account.nickname}">${account.nickname}</option>
      `
  });
}

// 수입, 지출 내역 등록하기 (income, expensise)
function resister_IE() {
  <option value=""></option>
}

window.onload = account_list;