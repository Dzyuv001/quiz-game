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
    if (quizIncomplete) {
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


var buildQuiz = function () {




    var addQuestion, addOption;

    jsonQuiz.change(function (e) {
        onChange(e);
    });

    function onChange(e) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(e.target.files[0]);
    }

    function onReaderLoad(event) {
        quizDataStruct = JSON.parse(event.target.result);
        console.log(quizDataStruct);
        loadQuiz();
    }

    function loadQuiz() {
        txtTitle.val(quizDataStruct.quizTitle);
        questions.empty();
        quizDataStruct.questions.forEach(function (q, i) {
            questions.append(addQuestion);
            // question container 
            var qCon = $($(".questionContainer")[i]);
            qCon.find(".questionText").val(q.question);
            q.options.forEach(function (o, j) {
                qCon.find("ol").append(addOption);
                var oCon = $(qCon.find("li")[j]);
                oCon.find(".optionText").val(o.op);
                oCon.find(".chkCorrect").prop("checked", o.chk);
            });
        });
    }

    function isQuizValid() { // used to ensure that the quiz is playable
        var isValid = true;
        displayError(txtTitle, isValid, "txtTitle"); // check if there is quiz title

        $("input:text").each(function () { // check that all the options are filled in
            displayError($(this), isValid, "optionText");
        });
        $("textarea").each(function () { //check if question are filled out
            displayError($(this), isValid, "questionText");
        });
        // check if the quiz has any questions
        if ($(".questionContainer").length == 0) {
            isValid = false;
            console.log("cant have a quiz with no questions");
        }
        $(".questionContainer").each(function (i) {
            let qCon = $($(".questionContainer")[i]);
            // check if there are more than 1 options per question
            if (qCon.find("li").length < 2) {
                isValid = false;
                console.log("you need more than 1 option per question");
            }
            // check at least one answer is selelcted or if not all answer are selected as the correct answers
            if (qCon.find(":checked").length == 0) {
                isValid = false;
                console.log("checkbox for question left blank");
            } else if (qCon.find(":checked").length == qCon.find(".chkCorrect").length) {
                isValid = false;
                console.log("cant have all the boxes checked");
            }
        });
        console.log(isValid);
        return isValid; // TODO: 
    }

    function displayError(elem, valid, type) { // add error 
        if (elem.val() == "" || !valid) {
            elem.addClass("is-invalid");
            switch (type) {
                case "txtTitle":
                    elem.parent().find(".txtError").show();
                    break;
                case "optionText":
                    elem.parent().find(".txtOptionError").show();
                    break;
                case "questionText":
                    elem.siblings(".txtError").show();
                    break;
                default:
                    break;
            }
            return false;
        } else {
            return true;
        }
    }

    function getQuizData() { // gathers all the quiz data ready to be saved as a json file for later use.
        var questions = $("#questions .questionContainer").toArray();
        quizDataStruct.quizTitle = txtTitle.val();
        quizDataStruct.questions = [];
        questions.forEach(function (q) { // q stands for question
            quizDataStruct.questions.push({});
            var i = quizDataStruct.questions.length - 1;
            quizDataStruct.questions[i].question = $(q).find(".questionText").val();
            quizDataStruct.questions[i].options = [];
            var options = $(q).find("li");
            options.toArray().forEach(function (o) { // o stands for option
                quizDataStruct.questions[i].options.push({
                    "op": $(o).find('.optionText').val(),
                    "chk": $(o).find('.chkCorrect').is(':checked')
                });
            });
        });
    }

    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {
            type: contentType
        });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    btnSaveGame.on("click", function (e) {
        if (isQuizValid()) {
            getQuizData();
            var jsonData = JSON.stringify(quizDataStruct);
            console.log(quizDataStruct);
            console.log("data saved");
            download(jsonData, quizDataStruct.quizTitle + 'test.json', 'application/json');
        }
    });
    // events
};

var dataController = (function () { //model
    // used to store questions and answers
    var quizData = {};
    var quizDataStruct = {};

    // game data
    var numOfQuestions = 0;
    var numOfCorrect = 0;
    var quizIncomplete = true;
});

var uiControler = (function () { //view
    var uiElements = {
        jsonQuiz: $("#jsonQuiz"),
        txtScore: $("#txtScore"),
        quizTitle: $("#quizTitle"),
        gameElements: $("#gameElements"),
        questions: $("#questions"),
        btnCheck: $("#btnCheck"),

        questions: $("#questions"),
        txtTitle: $("#txtTitle"),
        btnSaveGame: $("#btnSaveQuiz"),
        btnAddQuestion: $("#btnAddQuestions"),
        btnDeleteQuestion: $(".btnDeleteQuestion"),
        btnDeleteOption: $(".btnDeleteOption"),
        btnAddQuestionOption: $(".btnAddQuestionOption"),
        gameElements: $("#gameElements"),
        option: $(".option")
    };

    var uiDOM = {
        questionText: ".questionText",
        optionText: ".optionText",
        btnDeleteOption: ".btnDeleteOption",
        btnDeleteQuestion: ".btnDeleteQuestion",
        btnAddQuestionOption: ".btnAddQuestionOption"
    }

    var addQuestion, addOption;

    function init() {
        addQuestion = '<div class="questionContainer">';
        addQuestion += '<button class="btn btn-danger btnDeleteQuestion">Delete Questions</button>';
        addQuestion += '<label for="txtQ1Title">Question 1</label>';
        addQuestion += '<textarea name="txtQuestionTitle" class="form-control questionText" id="txtQuestionTitle" cols="10" rows="3" placeholder="Question"></textarea>';
        addQuestion += '<p class="txtError"> The question can`t left blank</p>';
        addQuestion += '<ol class="option" type="A">';
        addQuestion += '</ol>';
        addQuestion += '<button class="btn btn-primary btnAddQuestionOption">+ Add Option</button>';
        addQuestion += '</div>';
        addOption = '<li>';
        addOption += '<button class="btn btn-danger btnDeleteOption">Delete Option</button>';
        addOption += '<input type="text" class="form-control optionText" placeholder="Option">';
        addOption += '<input class="chkCorrect" type="checkbox" value="">';
        addOption += '<p class="txtOptionError"> An option has been left blank</p>';
        addOption += '</li>';
    }
    init();
    return {
        getUIElem: function () {
            return uiElements;
        },
        getUIDOM: function () {
            return uiDOM;
        }
    }
});

var controller = (function (budgetCtrl, UICtrl) { //controller
    var setupEvents = function () {
        var uiElem = UICtrl.getUIElem();
        var uiDOM = UICtrl.getUIDOM();
        btnAddQuestion.on("click", addQuestion);

        var addquestion = function () {
            $("#questions").append(addQuestion);
            console.log($(".questionContainer")[$(".questionContainer").length - 1]);
            for (let i = 0; i < 4; i++) {
                $($(".questionContainer")[$(".questionContainer").length - 1]).find("ol")
                    .append(addOption);
            }
        };

        uiElem.gameElements.on("click", UICtrl.btnAddQuestionOption, addQuestionOption);
        var addQuestionOption = function () {
            $(this).prev("ol").append(addOption);

        };

        uiElem.gameElements.on("click", UICtrl.btnDeleteQuestion, removeParent);
        uiElem.gameElements.on("click", UICtrl.btnDeleteOption, removeParent);

        var removeParent = function () {
            console.log("question Deleted?");
            console.log("option Deleted");
            $(this).parent().remove();
        };

        uiElem.txtTitle.on("input", txtTitleError);
        uiElem.gameElements.on("input", UICtrl.optionText, optionTextError);
        uiElem.gameElements.on("input", UICtrl.questionText, questionTextError);

        var txtTitleError = function () {
            if ($(this).val() == "") {
                $(this).addClass("is-invalid");
                $(this).parent().find(".txtError").show();
            } else {
                $(this).removeClass("is-invalid");
                $(this).parent().find(".txtError").hide();
            }
        };

        var optionTextError = function () {
            if ($(this).val() == "") {
                $(this).addClass("is-invalid");
                $(this).parent().find(".txtOptionError").show();
            } else {
                $(this).removeClass("is-invalid");
                $(this).parent().find(".txtOptionError").hide();
            }
        };
        var questionTextError = function () {
            if ($(this).val() == "") {
                $(this).addClass("is-invalid");
                $(this).siblings(".txtError").show();
            } else {
                $(this).removeClass("is-invalid");
                $(this).siblings(".txtError").hide();
            }
        };
    }
    return {
        init: function () {
            setupEvents();
        }
    }
})(dataController, uiControler);