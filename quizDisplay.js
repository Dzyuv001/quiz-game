// used to store questions and answers
var quizData;

// game data
var numOfQuestions = 0;
var numOfCorrect = 0;
var quizIncomplete = true;

//UI elements
var jsonQuiz = $("#jsonQuiz");
var txtScore = $("#txtScore");
var quizTitle = $("#quizTitle");
var gameElements = $("#gameElements");
var questions = $("#questions");
var gameElements = $("#gameElements");
var btnCheck = $("#btnCheck");

jsonQuiz.change(function (e) {
    onChange(e);
});

gameElements.on("click", ".btnOption", function (e) {
    if (quizIncomplete) {
        $(this).toggleClass("selected");
        console.log("ans clicked");
    }
});

btnCheck.on("click", function (e) { // check quiz
    if (quizIncomplete){
        if (validation()) {
            checkCorrect();
            txtScore.html("You scored " + numOfCorrect + " out of " + numOfQuestions);
            highlightCorrect();
        } else {
            // will prompt the user to finnish the quiz 
        }
    }
});

function checkCorrect() {
    numOfCorrect = 0; // resets the value of the correct counter
    $(".questionContainer").each(function (i, q) { // i is index and q is the question
        // let used to have the value reset when the code block is executed
        let userInput = []; // will store user desided answer to question
        let correctInput = []; // will store the quiz makers answers
        $(q).find(".btnOption").each(function (j, o) { // get user input j is index of loop and o is option
            userInput.push($(o).hasClass("selected"));
        });
        quizData.questions[i].options.forEach(function (o, j) { //o is option and j is index of loop
            correctInput.push(o.chk);
        });
        if (correctInput.toString() === userInput.toString()) {
            numOfCorrect++;
            $(q).find("span").addClass("qCorrect").append(" ✓");
        } else {
            $(q).find("span").addClass("qIncorrect").append(" X");
        }
    });
    quizIncomplete = false;
}

function highlightCorrect() {
    $(".questionContainer").each(function (i, q) {
        $(q).find(".btnOption").each(function (j, o) {
            if (quizData.questions[i].options[j].chk) {
                $(o).addClass("correct");
            }
            if (!quizData.questions[i].options[j].chk && $(o).hasClass("selected")) {
                $(o).addClass("incorrect");
            }
        });
    });
}

function validation() { // used to see if all the questions had been answered
    var valid = false;
    $(".questionContainer").each(function (i, q) { // used to loop through all the questions
        //  console.log($(q).find(".selected").length);
        if ($(q).find(".selected").length > 0) { // if an answer is not selected 
            valid = true;
        } else {
            valid = false;
        }
    });
    return valid; // returns the validity of user inputs 
}

function onChange(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event) {
    quizData = JSON.parse(event.target.result);
    btnCheck.show();
    console.log(quizData);
    init();
    clearQuiz();
    popQuiz();
}

function clearQuiz() {
    $("#questions").empty();
}

function popQuiz() { // will generate and populate the quiz elements
    var question = ['<div class="questionContainer"></div>'];
    var option = ['<div class="btnOption">', '</div>'];
    quizTitle.text(quizData.quizTitle);
    numOfQuestions = quizData.questions.length; // set the number of questions 
    quizData.questions.forEach(function (q, i) { // loops through questions
        questions.append(question);
        $(".questionContainer").last().append('<div class="txtQuestionTitle">' + (i + 1) + " " + quizData.questions[i].question + '<span></span></div>');
        quizData.questions[i].options.forEach(function (o, j) { // loops through options of questions
            var fullOption = option[0] + o.op + option[1];
            $(".questionContainer").last().append(option[0] + (j + 1) + ": " + o.op + option[1]);
        });
    });
}

function init() {
    numOfQuestions = 0;
    numOfCorrect = 0;
    quizIncomplete = true;
}