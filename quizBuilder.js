var quizDataStruct = {};

var questions = $("#questions");

var txtTitle = $("#txtTitle");

var btnSaveGame = $("#btnSaveQuiz");
var btnAddQuestion = $("#btnAddQuestions");
var btnDeleteQuestion = $(".btnDeleteQuestion");
var btnDeleteOption = $(".btnDeleteOption");
var btnAddQuestionOption = $(".btnAddQuestionOption");
var gameElements = $("#gameElements");
var option = $(".option");

var jsonQuiz = $("#jsonQuiz");

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
btnAddQuestion.on("click", function (e) {
    $("#questions").append(addQuestion);
    console.log($(".questionContainer")[$(".questionContainer").length - 1]);
    for (let i = 0; i < 4; i++) {
        $($(".questionContainer")[$(".questionContainer").length - 1]).find("ol")
            .append(addOption);
    }
});

gameElements.on("click", ".btnAddQuestionOption", function (e) {
    $(this).prev("ol").append(addOption);

});

gameElements.on("click", ".btnDeleteQuestion", function (e) {
    console.log("question Deleted?");
    $(this).parent().remove();
});

gameElements.on("click", ".btnDeleteOption", function (e) {
    console.log("option Deleted");
    $(this).parent().remove();
});

txtTitle.on("input", function (e) {
    if ($(this).val() == "") {
        $(this).addClass("is-invalid");
        $(this).parent().find(".txtError").show();
    } else {
        $(this).removeClass("is-invalid");
        $(this).parent().find(".txtError").hide();
    }
});

gameElements.on("input", ".optionText", function (e) {
    if ($(this).val() == "") {
        $(this).addClass("is-invalid");
        $(this).parent().find(".txtOptionError").show();
    } else {
        $(this).removeClass("is-invalid");
        $(this).parent().find(".txtOptionError").hide();
    }
});

gameElements.on("input", ".questionText", function (e) {
    if ($(this).val() == "") {
        $(this).addClass("is-invalid");
        // .siblings() was used insted of .next() because extention and plugins way add addtional tags
        $(this).siblings(".txtError").show();
    } else {
        $(this).removeClass("is-invalid");
        $(this).siblings(".txtError").hide();
    }
});

// gameElements.on("focusout",".optionText", function(e){
//     console.log("Element is out of focus");
// });

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