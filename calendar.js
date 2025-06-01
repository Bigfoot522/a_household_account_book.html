let dailySummary = JSON.parse(localStorage.getItem("dailySummary")) || [];

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
function printMonth() {
  var monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  var currentMonthName = monthNames[printM];

  month.innerHTML = "<h2>" + currentMonthName + ' ' + printY + "</h2>";
}

// 캘린더 출력
function printCalendar(y, m) {
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
  calendar += "<h4>S</h4>";
  calendar += "<h4>M</h4>";
  calendar += "<h4>T</h4>";
  calendar += "<h4>W</h4>";
  calendar += "<h4>T</h4>";
  calendar += "<h4>F</h4>";
  calendar += "<h4>S</h4>";

  var dNum = 1;
  for (var i = 1; i <= row; i++) {
    for (var j = 1; j <= 7; j++) {   //열 생성
      var inEx = 1;

      //앞 공란
      if (i == 1 && j < theDay) {
        var preDate = last[currentMonth] - theDay + j // 지난달 마지막 날에서 이번달 첫날 빼고 요일 더하기
        calendar += "<div class='aDay'>"
        calendar += "<p class='preDate'>" + preDate + "</p>";
        calendar += "</div>"
      }
      //뒷 공란
      else if (dNum > lastDate) {
        calendar += "<div class='aDay'>"
        calendar += "<p class='nextDate'>" + (dNum - lastDate) + "</p>";
        calendar += "</div>"
        dNum++;
      }
      else {
        //오늘 날짜
        if (dNum === printD && printM === currentMonth) {
          calendar += "<div class='aDay'>"
          calendar += "<p id='today'>" + dNum + "</p>";
          if (inEx) calendar += "<p class='inEx'> + " + inEx + "</p>";
          calendar += "</div>"
        }
        else {
          calendar += "<div class='aDay'>"
          calendar += "<p class='date'>" + dNum + "</p>";
          if (inEx) calendar += "<p class='inEx'> + " + inEx + "</p>";
          calendar += "</div>"
        }
        dNum++;
      }
    }
  }
  calendar += "</div>";
  calendarBox.innerHTML = calendar;
}

window.onload = function () {
  printCalendar();
  printMonth();
};