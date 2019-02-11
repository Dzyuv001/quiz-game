var dataController = (function () { //model
    // used to store questions and answers
    var quizBuildData = {};
    var quizLoadData = {};

    var active = true; // used to see which tab is selected

    // game data
    var numOfQuestions = 0;
    var numOfCorrect = 0;
    var quizIncomplete = true;
    return {
        activeTab: function (bool) {
            active = bool;
        },
        setQuizData: function (data) {
            if (active) {
                quizBuildData = data;
            } else {
                quizLoadData = data;
            }
        },
        getQuizBuildData: function () {
            return quizBuildData;
        },
        getQuizLoadData: function () {
            return quizLoadData;
        },
        getQuizComplete: function () {
            return quizIncomplete;
        },
        getNumOfQuestions: function () {
            return numOfQuestions;
        },
        getNumOfCorrect: function () {
            return uumOfCorrect;
        },
        dataReset: function () {
            numOfQuestions = 0;
            numOfCorrect = 0;
            quizIncomplete = true;
        }
    };
})();

var uiControler = (function () { //view
    var questionHTML, optionHTML, popQuestion, popOption;
    var uiElements = {
        btnTab1: $("#tab1"),
        btnTab2: $("#tab2"),
        btnEditQuiz: $("#btnEditQuiz"),
        btnGetQuiz: $("#btnGetQuiz"),
        txtScore: $("#txtScore"),
        quizTitle: $("#quizTitle"),
        gameElements: $("#gameElements"),
        questions: $("#questions"),
        btnCheck: $("#btnCheck"),
        btnOption: ".btnOption",
        txtTitle: $("#txtTitle"),
        btnSaveGame: $("#btnSaveQuiz"),
        btnAddQuestion: $("#btnAddQuestions"),
        btnDeleteQuestion: ".btnDeleteQuestion",
        btnDeleteOption: ".btnDeleteOption",
        btnAddQuestionOption: ".btnAddQuestionOption",
        option: $(".option"),
        questionText: ".questionText",
        optionText: ".optionText",
        questionContainer: ".questionContainer"
    };

    function htmlData() {
        questionHTML = '<div class="questionContainer">';
        questionHTML += '<button class="btn btn-danger btnDeleteQuestion">Delete Questions</button>';
        questionHTML += '<label for="txtQ1Title">Question 1</label>';
        questionHTML += '<textarea name="txtQuestionTitle" class="form-control questionText" id="txtQuestionTitle" cols="10" rows="3" placeholder="Question"></textarea>';
        questionHTML += '<p class="txtError"> The question can`t left blank</p>';
        questionHTML += '<ol class="option" type="A">';
        questionHTML += '</ol>';
        questionHTML += '<button class="btn btn-primary btnAddQuestionOption">+ Add Option</button>';
        questionHTML += '</div>';
        optionHTML = '<li>';
        optionHTML += '<button class="btn btn-danger btnDeleteOption">Delete Option</button>';
        optionHTML += '<input type="text" class="form-control optionText" placeholder="Option">';
        optionHTML += '<input class="chkCorrect" type="checkbox" value="">';
        optionHTML += '<p class="txtOptionError"> An option has been left blank</p>';
        optionHTML += '</li>';
        popQuestion = ['<div class="questionContainer"></div>'];
        popOption = ['<div class="btnOption">', '</div>'];
    }

    var getQuizData = function (quizBuildData) { // gathers all the quiz data ready to be saved as a json file for later use.
        var questions = $("#questions .questionContainer").toArray();
        quizBuildData.quizTitle = uiElements.txtTitle.val();
        quizBuildData.questions = [];
        questions.forEach(function (q) { // q stands for question
            quizBuildData.questions.push({});
            var i = quizBuildData.questions.length - 1;
            quizBuildData.questions[i].question = $(q).find(".questionText").val();
            quizBuildData.questions[i].options = [];
            var options = $(q).find("li");
            options.toArray().forEach(function (o) { // o stands for option
                quizBuildData.questions[i].options.push({
                    "op": $(o).find('.optionText').val(),
                    "chk": $(o).find('.chkCorrect').is(':checked')
                });
            });
        });
    };

    var validation = function () { // used to see if all the questions had been answered
        var valid = false;
        $(uiElements.questionContainer).each(function (i, q) { // used to loop through all the questions
            //  console.log($(q).find(".selected").length);
            if ($(q).find(".selected").length > 0) { // if an answer is not selected 
                valid = true;
            } else {
                valid = false;
            }
        });
        return valid; // returns the validity of user inputs 
    };

    var highlightCorrect = function (quizData) {
        $(uiElements.questionContainer).each(function (i, q) {
            $(q).find(uiElements.btnOption).each(function (j, o) {
                if (quizData.questions[i].options[j].chk) {
                    $(o).addClass("correct");
                }
                if (!quizData.questions[i].options[j].chk && $(o).hasClass("selected")) {
                    $(o).addClass("incorrect");
                }
            });
        });
    };

    var checkCorrect = function () {
        numOfCorrect = 0; // resets the value of the correct counter
        $(uiElements.questionContainer).each(function (i, q) { // i is index and q is the question
            // let used to have the value reset when the code block is executed
            let userInput = []; // will store user desided answer to question
            let correctInput = []; // will store the quiz makers answers
            $(q).find(uiElements.btnOption).each(function (j, o) { // get user input j is index of loop and o is option
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
    };

    htmlData();
    return {
        getUIElem: function () {
            return uiElements;
        },
        addQuestion: function () {
            $("#questions").append(questionHTML);
            console.log($(uiElements.questionContainer)[$(uiElements.questionContainer).length - 1]);
            for (let i = 0; i < 4; i++) {
                $($(uiElements.questionContainer)[$(uiElements.questionContainer).length - 1]).find("ol")
                    .append(optionHTML);
            }
            console.log("addQuestion");
        },
        addQuestionOption: function () {
            $(this).prev("ol").append(optionHTML);
            console.log("addQuestionOption");
        },
        removeParent: function () {
            console.log("question Deleted?");
            console.log($(this));
            $(this).parent().remove();
        },
        textError: function () {
            if ($(this).val() == "") {
                $(this).addClass("is-invalid");
                $(this).parent().find(".txtError").show();
            } else {
                $(this).removeClass("is-invalid");
                $(this).parent().find(".txtError").hide();
            }
            console.log("textError");
        },
        optionTextError: function () {
            if ($(this).val() == "") {
                $(this).addClass("is-invalid");
                $(this).parent().find(".txtOptionError").show();
            } else {
                $(this).removeClass("is-invalid");
                $(this).parent().find(".txtOptionError").hide();
            }
            console.log("addQuestion");
        },
        saveGame: function (isQuizValid, quizBuildData,download) {
            console.log("this is a thing" + isQuizValid());
            if (isQuizValid()) {
                getQuizData(quizBuildData);
                var jsonData = JSON.stringify(quizBuildData);
                console.log(quizBuildData);
                console.log("data saved");
                download(jsonData, quizBuildData.quizTitle + '.json', 'application/json');
            }
        },
        checkQuiz: function (quizIncomplete, numOfCorrect, numOfQuestions) { // check quiz
            if (quizIncomplete) {
                if (validation()) {
                    checkCorrect();
                    txtScore.html("You scored " + numOfCorrect + " out of " + numOfQuestions);
                    highlightCorrect();
                } else {
                    // TODO: will prompt the user to finnish the quiz 
                }
            }
            console.log("checkQuiz");
        },
        selectAns: function (that, quizIncomplete) { //
            if (quizIncomplete) {
                $(that).toggleClass("selected");
                console.log("ans clicked");
            }
            console.log("selectAns");
        },
        clearQuiz: function () {
            $("#questions").empty();
            console.log("clearQuiz");
        },
        getQuestionHTML : function(){
            return questionHTML;
        },
        getOptionHTML : function (){
            return optionHTML;
        },
        displayError: function (elem, valid, type) { // add error 
            console.log("displayError");
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
    };
})();

var controller = (function (dataCtrl, UICtrl) { //controller
    var jsonReady = false;
    var uiElem = UICtrl.getUIElem();
    var setupEvents = function () {
        uiElem.btnTab1.on("click", function () {
            dataCtrl.activeTab(true);
        });
        uiElem.btnTab2.on("click", function () {
            dataCtrl.activeTab(false);
        });
        uiElem.btnAddQuestion.on("click", UICtrl.addQuestion);
        uiElem.gameElements.on("click", uiElem.btnAddQuestionOption, UICtrl.addQuestionOption);
        uiElem.gameElements.on("click", uiElem.btnDeleteQuestion, UICtrl.removeParent);
        uiElem.gameElements.on("click", uiElem.btnDeleteOption, UICtrl.removeParent);
        uiElem.txtTitle.on("input", UICtrl.textError);
        uiElem.gameElements.on("input", uiElem.optionText, UICtrl.optionTextError);
        uiElem.gameElements.on("input", uiElem.questionText, UICtrl.textError);
        uiElem.btnSaveGame.on("click", function () {
            UICtrl.saveGame(isQuizValid, dataCtrl.getQuizBuildData(),download);
        });
        uiElem.btnEditQuiz.change(editQuiz);
        uiElem.btnGetQuiz.change(loadQuiz);
        uiElem.btnCheck.on("click", function () {
            UICtrl.checkQuiz(dataCtrl.getQuizComplete, dataCtrl.getNumOfQuestions,
                dataCtrl.getNumOfCorrect);
        });
        uiElem.gameElements.on("click", uiElem.btnOption, function () {
            UICtrl.selectAns(this, dataCtrl.getQuizComplete);
        });
    };
    var download = function (content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {
            type: contentType
        });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    };

    var onReaderLoad = function (event) {
        dataCtrl.setQuizData(JSON.parse(event.target.result));
    };

    var onChange = function (e) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(e.target.files[0]);
    };

    var editQuiz = function (e) {
        onChange(e);
       // set
       setTimeout(function() {
        loadQuizElements();
       },2000);
    };

    var loadQuiz = function (e) {
        onChange(e);
        //init();
        UICtrl.clearQuiz();
        popQuiz();
    };

   var loadQuizElements =  function () {
    let quizBuildData = dataCtrl.getQuizBuildData();
        uiElem.txtTitle.val(quizBuildData.quizTitle);
        console.log(quizBuildData);
        uiElem.questions.empty();
        
        quizBuildData.questions.forEach(function (q, i) {
            uiElem.questions.append(UICtrl.getQuestionHTML);
            // question container 
            var qCon = $($(".questionContainer")[i]);
            qCon.find(".questionText").val(q.question);
            q.options.forEach(function (o, j) {
                qCon.find("ol").append((UICtrl.getOptionHTML));
                var oCon = $(qCon.find("li")[j]);
                oCon.find(".optionText").val(o.op);
                oCon.find(".chkCorrect").prop("checked", o.chk);
            });
        });
    };

    var popQuiz = function () { // will generate and populate the quiz elements
        var question = ['<div class="questionContainer"></div>'];
        var option = ['<div class="btnOption">', '</div>'];
        var quizData = dataCtrl.getQuizBuildData();
        console.log(quizData);
        uiElem.quizTitle.text(quizData.quizTitle);
        numOfQuestions = quizData.questions.length; // set the number of questions 
        quizData.questions.forEach(function (q, i) { // loops through questions
            questions.append(question);
            $(uiElem.questionContainer).last().append('<div class="txtQuestionTitle">' + (i + 1) + " " + quizData.questions[i].question + '<span></span></div>');
            quizData.questions[i].options.forEach(function (o, j) { // loops through options of questions
                var fullOption = option[0] + o.op + option[1];
                $(uiElem.questionContainer).last().append(option[0] + (j + 1) + ": " + o.op + option[1]);
            });
        });
    };
    var isQuizValid = function () { // used to ensure that the quiz is playable
        var isValid = true;
        UICtrl.displayError($(txtTitle), isValid, "txtTitle"); // check if there is quiz title

        $("input:text").each(function () { // check that all the options are filled in
            UICtrl.displayError($(this), isValid, "optionText");
        });
        $("textarea").each(function () { //check if question are filled out
            UICtrl.displayError($(this), isValid, "questionText");
        });
        // check if the quiz has any questions
        if ($(uiElem.questionContainer).length == 0) {
            isValid = false;
            console.log("cant have a quiz with no questions");
        }
        $(uiElem.questionContainer).each(function (i) {
            let qCon = $($(uiElem.questionContainer)[i]);
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
        console.log("_____________the form is valid: " + isValid + " __________")
        return isValid;
    };

    return {
        init: function () {
            setupEvents();
        }
    };
})(dataController, uiControler);

controller.init(); // <-- starting point of the application