// import "./styles.css";

const testText =
  "In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog thats filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements. Besides, random text risks to be unintendedly humorous or offensive, an unacceptable risk in corporate environments. Lorem ipsum and its many variants have been employed since the early 1960ies, and quite likely since the sixteenth century.";

const lines = new Array(3).fill(1);

$(document).ready(() => {
  $("#startbtn").click(() => {
    let duration = $("#timeValue").find(":selected").val();

    $("#timer").html(selectedTime(duration));
    $(".contentContainer").addClass("hidden");
    $(".typeContainer").removeClass("hidden");
    $(".typeContainer").addClass("displayflex");
    handleTyping(duration);
  });
  handleClose();

  /////////////

  $("#retakebtn").click(() => {
    $(".resaultContainer").addClass("hidden");
    $(".contentContainer").removeClass("hidden");
    $(".contentContainer").addClass("displayflex");
  });

  ///////////
  $(".modeType").click(() => {
    $(".modeType").children().toggleClass("activeMode");
  });
});

const handleClose = (a) => {
  $("#closebtn").click(() => {
    $(".typeContainer").addClass("hidden");
    $(".resaultContainer").removeClass("hidden");
    $(".resaultContainer").addClass("displayflex");
    getData();
    clearInterval(a);
  });
};

const selectedTime = (duration) => {
  var time = duration;
  var minutes;
  var seconds;
  minutes = parseInt(time / 60, 10);
  seconds = parseInt(time % 60, 10);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return minutes + ":" + seconds;
};

const timer = (duration) => {
  var time = duration;
  var minutes;
  var seconds;

  const a = setInterval(() => {
    minutes = parseInt(time / 60, 10);
    seconds = parseInt(time % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    $("#timer").html(minutes + ":" + seconds);
    time -= 1;
  }, 1000);

  handleClose(a);
  setTimeout(() => {
    $(".typeContainer").addClass("hidden");
    $(".resaultContainer").removeClass("hidden");
    $(".resaultContainer").addClass("displayflex");
    setData($("#netWPM").html());
    getData();
    clearInterval(a);
  }, duration * 1000);
  return a;
};

const handleTyping = (duration) => {
  let activeTimer = false;
  let text = testText.split(" ");
  let typedWords = [];
  let wrongWords = 0;

  $(".typeBodyText").html(
    text.map(
      (word, i) =>
        `<div id="w${i}" class="word" autocomplete="off">${word} <input class="typeInput" disabled="true" style="max-width:${word.length}rem" id="typeInput${i}" /></div>`
    )
  );
  $(".typeBodyLineContainer").html(lines.map(() => `<div class="line"></div>`));
  $("#w0").addClass("activeWord");
  $("#typeInput0").prop("disabled", false).attr("placeholder", text[0]).focus();

  $(".typeInput").keydown((e) => {
    ////////////
    $("#WPM").html(
      Number(typedWords.length / parseInt(duration / 60, 10)).toFixed()
    );
    $("#wrongWord").html(wrongWords);
    $("#correctPercent").html(
      Number(
        ((typedWords.length - wrongWords) * 100) / typedWords.length
      ).toFixed()
    );
    $("#netWPM").html(
      Number(
        ((typedWords.length / parseInt(duration / 60, 10)) *
          (typedWords.length - wrongWords)) /
          typedWords.length
      ).toFixed()
    );
    ///////////////////
    if (!activeTimer) {
      timer(duration);
      activeTimer = true;
    }
    if ((e.which === 32 || e.code === "Space") && e.target.value.length > 0) {
      if (text[typedWords.length] !== e.target.value) {
        $(`#typeInput${typedWords.length}`).addClass("wrong");
        wrongWords = wrongWords + 1;
      }
      $(`#w${typedWords.length}`).removeClass("activeWord");
      $(`#typeInput${typedWords.length}`).prop("disabled", true);

      typedWords.push(e.target.value);
      $(`#typeInput${typedWords.length}`)
        .attr("placeholder", text[typedWords.length])
        .prop("disabled", false)
        .focus();
      $(`#w${typedWords.length}`).addClass("activeWord");

      e.preventDefault();
      return false;
    } else if (e.which === 32 || e.code === "Space") {
      e.preventDefault();
      return false;
    }
  });
  $("#closebtn").click(
    () =>
      $("#timer").html() !== selectedTime(duration) &&
      setData($("#netWPM").html())
  );
};

const getData = () => {
  if (localStorage.getItem("typeScore")) {
    const typeScore = JSON.parse(localStorage.getItem("typeScore"));
    $(".chart").html(
      typeScore.map(
        (score) => `
    <div class="data">${score.score}
      <div class="chartbin" style="min-height:${(
        Number(score.score) / 10
      ).toFixed(2)}rem">
    </div></div>
  `
      )
    );
    $(".chartdates").html(
      typeScore.map(
        (score) => `
    <div>${dateChanger(score.date)}</div>
  `
      )
    );
  }
};

const setData = (data) => {
  // localStorage.setItem("typeScore", JSON.stringify([]));
  const typeScore = localStorage.getItem("typeScore");
  typeScore?.length > 0
    ? localStorage.setItem(
        "typeScore",
        JSON.stringify([
          ...JSON.parse(typeScore),
          { score: data, date: Date.now() }
        ])
      )
    : localStorage.setItem(
        "typeScore",
        JSON.stringify([Object({ score: data, date: Date.now() })])
      );
  getData();
};

const dateChanger = (dd) => {
  const date = new Date(dd);
  const hours = date.getHours();
  const minute = date.getMinutes();
  const hou = hours < 10 ? "0" + hours : hours;
  const min = minute < 10 ? "0" + minute : minute;
  return hou + ":" + min;
};
