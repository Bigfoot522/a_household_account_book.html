let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

// 통장 등록하기
function resister_account() {
  const bank = document.getElementById("bank").value;
  const nickname = document.getElementById("nickname").value;
  const balance = document.getElementById("balance").value;
  
  if ((bank === 'select') || !nickname || !balance) {
    alert("모든 항목을 입력해주세요!");
    return;
  }

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].nickname === nickname) {
      alert("통장별명이 중복됩니다.");
      return;
    }
  }

  const account = {
    bank: bank,
    nickname: nickname,
    balance: balance
  };

  accounts.push(account);
  localStorage.setItem("accounts", JSON.stringify(accounts));

  document.getElementById("bank").value = "select";
  document.getElementById("nickname").value = "";
  document.getElementById("balance").value = "";

  display_accounts();
}

// 목록 초기화
function display_accounts() {
  const content = document.getElementById("content");

  content.innerHTML = "";

  if (accounts.length === 0) {
    content.innerHTML += "<p class=\"none\">등록된 통장이 없습니다.</p>";
    return;
  }

  // 각 통장을 HTML로 렌더링
  accounts.forEach((account, index) => {
    content.innerHTML += `
      <div class="account">
        <p>${account.bank}</p>
        <p>${account.nickname}</p>
        <p>${account.balance}</p>
        <button onclick="delete_account(${index})">-</button>
      </div>
    `;
  });
}

// 통장 삭제
function delete_account(index) {
  alert("통장과 관련된 입출금 내역이 모두 삭제 됩니다."); //내역도 모두 삭제할거면 아래 코드 사용
  accounts.splice(index, 1); // 배열에서 해당 상품 제거
  localStorage.setItem("accounts", JSON.stringify(accounts)); // 로컬 스토리지 업데이트
  display_accounts(); // 목록 새로고침
}

// function delete_history(index) {
//   let histories = JSON.parse(localStorage.getItem("histories")) || [];
//   histories.splice(index, 1);

//   localStorage.setItem("accounts", JSON.stringify(accounts));
//   localStorage.setItem("histories", JSON.stringify(histories));
//   display_histories(); // 목록 새로고침

//   day_IE();
// }

window.onload = function () {
  display_accounts();
};