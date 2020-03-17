const myQuestions = [
    {
        question: "Who invented JavaScript?",
        answers: {
            0: "Douglas Crockford",
            1: "Sheryl Sandberg",
            2: "Brendan Eich"
        },
        correctAnswer: "2"
    },
    {
        question: "Which one of these is a JavaScript package manager?",
        answers: {
            0: "Node.js",
            1: "TypeScript",
            2: "npm"
        },
        correctAnswer: "2"
    },
    {
        question: "Which tool can you use to ensure code quality?",
        answers: {
            0: "Angular",
            1: "jQuery",
            2: "RequireJS",
            3: "ESLint"
        },
        correctAnswer: "3"
    }
];
var headerText = $("#card-header-text");
var bodyText = $("#card-body");
var timerText = $("#timer");
var buttons = $("#button-container");
var answerResult = $("#answer-result");
var highScoreLink = $("#high-score-link");
var highScoreName = "";
var questionNumber = 0;
var time = 75;
var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
var interval;

function answerCheck() {
    if ($(this).attr("answer-choice") === myQuestions[questionNumber].correctAnswer) {
        console.log("correct");
        questionNumber++;
        quiz();
    }
    else {
        console.log("incorrect");
        time = time - 10;
        timerText.html("Time: " + time);
        questionNumber++;
        quiz();
    }
}

function quiz() {
    if (questionNumber < myQuestions.length) {
        bodyText.html(myQuestions[questionNumber].question);
        buttons.empty();
        for (var i = 0; i < Object.keys(myQuestions[questionNumber].answers).length; i++) {
            var answerButton = $("<button>");
            answerButton.addClass("quiz-button");
            answerButton.attr("answer-choice", i);
            answerButton.text(myQuestions[questionNumber].answers[i]);
            buttons.append(answerButton);
        }

        $(".quiz-button").click(answerCheck)
    }
    else{
        endGame();
    }
}

function setScore(){
    const score = {
        name: highScoreName,
        score: time
    };
    highScores.push(score);

    highScores.sort( (a,b) => b.score - a.score)

    highScores.splice(10);
    localStorage.setItem("highScores", JSON.stringify(highScores));

}

function highScoreScreen(){
    clearInterval(interval);
    bodyText.empty();
    buttons.empty();
    var storedHighScores = JSON.parse(localStorage.getItem("highScores"));
    var ul = $("<ul>");
    for (var i =0; i<storedHighScores.length; i++){
        var li = $("<li>");
        li.html(storedHighScores[i].name + ": " + storedHighScores[i].score);
        ul.append(li);
    }
    bodyText.append(ul);
    
}

function endGame(){
    clearInterval(interval);
    buttons.empty();
    bodyText.html("Game Over!<br />Final Score: " + time + "<br />Enter Intials to save high score<br />");
    bodyText.append("<input id='highscore-input' type='text' placeholder='Initials' maxlength=3 size=3>")
    bodyText.append("<input id='highscore-submit' type='submit'>");
    bodyText.on("click", "#highscore-submit", function(){
        highScoreName = $("#highscore-input").val();
        setScore()
        highScoreScreen();
    });
}

function timer() {

    interval = setInterval(function () {
        time--;
        timerText.html("Time: " + time);
        if (time <= 0) {
            clearInterval(interval);
        }
    }, 1000)
}

/* highScoreLink.click(function(){
    clearInterval(interval);

}) */

function init() {
    highScoreLink.click(highScoreScreen);
    timerText.html("Time: " + time);
    headerText.html("Coding Quiz");
    bodyText.html("10 questions<br />Fastest time wins<br />-10 seconds per wrong answer<br />Press start to begin");
    buttons.html("<button id='start-btn'>Begin Quiz</button>");
    buttons.on("click", "#start-btn", function () {
        timer();
        quiz();
    });
    
}


init();

