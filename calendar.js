let date = JSON.parse(localStorage.getItem("date")) || "";
let dailySummaries = JSON.parse(localStorage.getItem("dailySummary")) || {};

let month = document.getElementById("this-month");
let calendarBox = document.getElementById("calendar");

//오늘 날짜를 나타내는 Date 객체 생성
var currentDate = new Date();
var currentYear = currentDate.getFullYear();
var currentMonth = currentDate.getMonth();

// 현재 보고싶은 날짜 객체
var printY = currentDate.getFullYear();
var printM = currentDate.getMonth();
var printD = currentDate.getDate();

// 상단 월 표시
function print_month() {
  var monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  var currentMonthName = monthNames[printM];

  month.innerHTML = "<h2>" + currentMonthName + ' ' + printY + "</h2>";
}

// 캘린더 출력
function print_calendar(y, m) {
  //매개변수로 년월을 받으면 적용
  y = (y != undefined) ? y : printY;
  m = (m != undefined) ? m-1 : printM;

  // 1일 위치
  var theDate = new Date(y, m, 1);
  var theDay = theDate.getDay() + 1;
  var last = [31,28,31,30,31,30,31,31,30,31,30,31];
  
  //윤년 계산
  if (y % 4 == 0 && y % 100 !=0 || y % 400 == 0) last[1]=29;

  var lastDate = last[m];

  // 행의 개수
  var row = Math.ceil((theDay+lastDate-1)/7);

  //요일 행 생성   
  var calendar = "<div class='calWrapper'>";
  calendar += "<h4>Sun</h4>";
  calendar += "<h4>Mon</h4>";
  calendar += "<h4>Tue</h4>";
  calendar += "<h4>Wed</h4>";
  calendar += "<h4>Thu</h4>";
  calendar += "<h4>Fri</h4>";
  calendar += "<h4>Sat</h4>";

  var dNum = 1;
  m += 1;
  
  for (var i = 1; i <= row; i++) {
    for (var j = 1; j <= 7; j++) {   //열 생성
      var prelast = (printM === 0) ? last[11] : last[printM - 1]

      //앞 공란
      if (i == 1 && j < theDay) {
        var preDate = prelast - theDay + j + 1 // 지난달 마지막 날에서 이번달 첫날 빼고 요일 더하기
        calendar += "<div class='aDay'>"
        calendar += `<button class='preDate' onclick="hype_keepFL(${y}, ${m}, ${preDate});">` + preDate + `</button>`;
        calendar += "</div>"
      }
      //뒷 공란
      else if (dNum > lastDate) {
        calendar += "<div class='aDay'>"
        calendar += `<button class='nextDate' onclick="hype_keepFL(${y}, ${m}, ${dNum - lastDate});">` + (dNum - lastDate) + `</button>`;
        calendar += "</div>"
        dNum++;
      }
      else {
        let zeroM = String(m).padStart(2, '0');
        let zeroD = String(dNum).padStart(2, '0');
        let currentDate = `${y}-${zeroM}-${zeroD}`;

        if (dailySummaries[currentDate]) var dateTotal = dailySummaries[currentDate].total;
        else var dateTotal = null;

        //오늘 날짜
        if (dNum === printD && printM === currentMonth) {
          calendar += "<div class='aDay'>"
          calendar += `<button class='date' onclick="hype_keepFL(${y}, ${m}, ${dNum})">` + dNum + `</button>`;
          if (dateTotal) (dateTotal > 0) ? calendar += "<p class='dateTotalIncome'> + " + dateTotal + "</p>" : calendar += "<p class='dateTotalExpense'>" + dateTotal + "</p>"
          calendar += "</div>"
        }
        else {
          calendar += "<div class='aDay'>"
          calendar += `<button class='date' onclick="hype_keepFL(${y}, ${m}, ${dNum})">` + dNum + `</button>`;
          if (dateTotal) (dateTotal > 0) ? calendar += "<p class='dateTotalIncome'> + " + dateTotal + "</p>" : calendar += "<p class='dateTotalExpense'>" + dateTotal + "</p>"
          calendar += "</div>"
        }
        dNum++;
      }
    }
  }
  calendar += "</div>";
  calendarBox.innerHTML = calendar;
}

function move_month(b) {
  if (b === 0 && printM === 0) {
    printY -= 1;
    printM = 11;
  }
  else if (b === 1 && printM === 11) {
    printY += 1;
    printM = 0;
  }

  (b === 0) ? printM -= 1 : printM += 1
  print_calendar();
  print_month();
}

function hype_keepFL(y, m, d) {
  m = String(m).padStart(2, '0');
  d = String(d).padStart(2, '0');
  date = `${y}-${m}-${d}`;

  localStorage.setItem("date", JSON.stringify(date));
  window.location.href = "keepFL.html";
}

window.onload = function () {
  print_calendar();
  print_month();
};