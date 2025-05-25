let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

// 통장 등록하기
function resister_account() {
  const bank = document.getElementById("bank").value;
  const nickname = document.getElementById("nickname").value;
  const balance = document.getElementById("balance").value;
  
  if (!bank || !nickname || !balance) {
    alert("모든 항목을 입력해주세요!");
    return;
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
  const accountList = document.getElementById("accountList");
  accountList.innerHTML = "<h2>통장 목록</h2>";

  if (accounts.length === 0) {
    accountList.innerHTML += "<p>저장된 상품이 없습니다.</p>";
    return;
  }

  // 각 통장을 HTML로 렌더링
  accounts.forEach((account, index) => {
    accountList.innerHTML += `
      <div class="accountList">
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
    accounts.splice(index, 1); // 배열에서 해당 상품 제거
    localStorage.setItem("accounts", JSON.stringify(accounts)); // 로컬 스토리지 업데이트
    display_accounts(); // 목록 새로고침
}

// 페이지 로드 시 상품 목록 출력
window.onload = display_accounts;