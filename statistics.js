let year = JSON.parse(localStorage.getItem("year")) || "";
let dailySummaries = JSON.parse(localStorage.getItem("dailySummary")) || {};
let optionTrigger = '';

function year_init() {
  const yearControl = document.getElementById('yearControl');

  if(!year) year = new Date().getFullYear();
  localStorage.setItem("year", JSON.stringify(year));

  yearControl.innerHTML = `
    <button onclick="move_year(0)"><</button>
    <h2>${year}</h2>
    <button onclick="move_year(1)">></button>
  `;
}

function move_year(b) {
  (b === 0) ? year -= 1 : year += 1
  
  localStorage.setItem("year", JSON.stringify(year));

  year_init();
  month_summary(optionTrigger);
}

function month_summary(option) {
  const chart = document.getElementById("chart");

  optionTrigger = option;

  let monthlyData = Array(12).fill(0).map(() => ({ income: 0, expense: 0, total: 0 }));
  Object.keys(dailySummaries).forEach((date) => {
    const [y, m] = date.split("-").map(Number);
    if (y === year) {
      const monthIndex = m - 1;
      monthlyData[monthIndex].income += dailySummaries[date].income;
      monthlyData[monthIndex].expense += dailySummaries[date].expense;
      monthlyData[monthIndex].total += dailySummaries[date].total;
    }
  });

  let maxIncome = Math.max(...monthlyData.map(d => d.income));
  let maxExpense = Math.max(...monthlyData.map(d => d.expense));
  let maxTotal = Math.max(...monthlyData.map(d => d.total));
  
  const maxHeight = parseFloat(window.getComputedStyle(chart).height) * 0.8;

  chart.innerHTML = "";
  monthlyData.forEach((data, index) => {
    const incomeHeight = maxIncome ? (data.income / maxIncome) * maxHeight : 0;
    const expenseHeight = maxExpense ? (data.expense / maxExpense) * maxHeight : 0;
    const totalHeight = maxTotal ? (data.total / maxTotal) * maxHeight : 0;

    if (option === 'all') {
      // 생략 (모든 막대 그리는 경우 추가 필요 시 처리)
    } else {
      const barWrapper = document.createElement('div');
      barWrapper.className = 'month-bar';

      const bar = document.createElement('div');
      let targetHeight = 0;

      if (option === 'income') {
        bar.className = 'bar income';
        targetHeight = incomeHeight;
      } else if (option === 'expense') {
        bar.className = 'bar expense';
        targetHeight = expenseHeight;
      } else if (option === 'total') {
        bar.className = 'bar total';
        targetHeight = totalHeight;
      }

      bar.style.height = '0px';
      barWrapper.appendChild(bar);
      chart.appendChild(barWrapper);

      let t = 0;
      const duration = 500; // 도착까지 걸리는 시간 (ms)
      const interval = 10; // 한 프레임 시간
      const step = targetHeight / (duration / interval);

      const barAnimation = setInterval(() => {
        if (t >= targetHeight) {
          clearInterval(barAnimation);
          bar.style.height = `${targetHeight}px`;
        } else {
          t += step;
          bar.style.height = `${t}px`;
        }
      }, interval);
    }
  });
}

window.onload = function () {
  year_init();
  month_summary();
};

window.onbeforeunload = function() {
  localStorage.removeItem("year");
};