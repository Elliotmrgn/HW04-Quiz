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
        question: "Inside which HTML element do we put the JavaScript?",
        answers: {
            0: "<js>",
            1: "<script>",
            2: "<javascript>",
            3: "<scripting>"
        },
        correctAnswer: "1"
    },
    {
        question: "What is the correct syntax for referring to an external script called 'script.js'?",
        answers: {
            0: "<script href='script.js'>",
            1: "<script src='script.js'>",
            2: "<script name='script.js'>"
        },
        correctAnswer: "1"
    },
    {
        question: "The external JavaScript file must contain the < script > tag.",
        answers: {
            0: "True",
            1: "False"
        },
        correctAnswer: "1"
    },
    {
        question: "What will the following code return: Boolean(10 > 9)",
        answers: {
            0: "true",
            1: "NaN",
            2: "false"
        },
        correctAnswer: "0"
    },
    {
        question: "How can you detect the client's browser name?",
        answers: {
            0: "client.navName",
            1: "browser.name",
            2: "navigator.appName"
        },
        correctAnswer: "2"
    },
    {
        question: "Which event occurs when the user clicks on an HTML element?",
        answers: {
            0: "onclick",
            1: "onmouseclick",
            2: "onmouseover",
            3: "onchange"
        },
        correctAnswer: "0"
    },
    {
        question: "How do you find the number with the highest value of x and y?",
        answers: {
            0: "ceil(x, y)",
            1: "Math.max(x, y)",
            2: "Math.ceil(x, y)",
            3: "top(x, y)"
        },
        correctAnswer: "1"
    },
    {
        question: "JavaScript is case-sensitive?",
        answers: {
            0: "True",
            1: "False"
        },
        correctAnswer: "0"
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



//build the current quiz question
function quiz() {
    //if there's still a question to build
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
    else {
        endGame();
    }

}

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

function setScore() {
    var score = {
        name: highScoreName,
        score: time
    };
    highScores.push(score);

    highScores.sort((a, b) => b.score - a.score)

    highScores.splice(10);
    localStorage.setItem("highScores", JSON.stringify(highScores));

}

function highScoreScreen() {
    clearInterval(interval);
    bodyText.empty();
    buttons.empty();
    if (localStorage.getItem("highScores") !== null) {
        var storedHighScores = JSON.parse(localStorage.getItem("highScores"));
        var ol = $("<ol style='list-style-position:inside; '>");
        for (var i = 0; i < storedHighScores.length; i++) {
            var li = $("<li>");
            li.html(storedHighScores[i].name + ": " + storedHighScores[i].score);
            ol.append(li);
        }
        bodyText.append(ol);
    }
    var clearScores = $("<button style='background-color:red';>");
    clearScores.text("Clear HighScores");
    bodyText.append(clearScores);
    clearScores.click(function () {
        if (confirm("Are you sure?\nThis cannot be undone")) {
            localStorage.removeItem("highScores");
            highScores = [];
            highScoreScreen();
        }
    });


}

function endGame() {
    clearInterval(interval);
    buttons.empty();
    bodyText.html("Game Over!<br />Final Score: " + time + "<br />Enter Intials to save high score<br />");
    bodyText.append("<input id='highscore-input' type='text' placeholder='Initials' maxlength=3 size=3>")
    bodyText.append("<input id='highscore-submit' type='submit' style='margin-left:5px';>");
    bodyText.on("click", "#highscore-submit", function () {
        if ($("#highscore-input").val()) {
            highScoreName = $("#highscore-input").val();
            setScore()
            highScoreScreen();
        }
    });
}

function timer() {
    clearInterval(interval);
    interval = setInterval(function () {
        time--;
        timerText.html("Time: " + time);
        if (time <= 0) {
            endGame();
        }
    }, 1000)
}

function init() {
    clearInterval(interval);
    questionNumber = 0;
    time = 75;
    highScoreLink.click(highScoreScreen);
    timerText.html("Time: " + time);
    headerText.html("Coding Quiz");
    bodyText.html("10 questions<br />-10 seconds per wrong answer<br />Fastest time wins");
    buttons.html("<button id='start-btn'>Begin Quiz</button>");
    $("header").on("click", "#restart", init);
    buttons.on("click", "#start-btn", function () {
        timer();
        quiz();
    });

}

init();

