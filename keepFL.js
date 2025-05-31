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
// 총 수입, 총 지출, 합계 계산하기
function resister_IE() {
  <option value=""></option>
}

window.onload = function () {
  account_list;
};