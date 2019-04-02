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
        getQuizBuildData: function () { //gets quiz build data variable
            return quizBuildData;
        },
        getQuizLoadData: function () { //gets quiz load data variable
            return quizLoadData;
        },
        getQuizComplete: function () { //check if he quiz is complete
            return quizIncomplete;
        },
        setNumOfQuestions: function (numOfQ) { //set number of questions there are in the quiz
            numOfQuestions = numOfQ;
        },
        getNumOfQuestions: function () { //get number of questions
            return numOfQuestions;
        },
        setNumOfCorrect: function (numOfC) { //set the number of correct questions
            numOfCorrect = numOfC;
        },
        getNumOfCorrect: function () { //get number of questions the user answered correctly
            return numOfCorrect;
        },
        setQuizComplete: function (quizIncom, numOfC) { //set the quiz as complete and set the number of the questions the user answered correctly
            quizIncomplete = quizIncom;
            numOfCorrect = numOfC;
        },
        dataReset: function () { //used to reset the data class
            numOfQuestions = 0;
            numOfCorrect = 0;
            quizIncomplete = true;
        }
    };
})();

var uiController = (function () { //view
    var questionHTML, optionHTML; // stores html that is added to make the up the build quiz form.
    var uiElements = { // stores all the ui classes and ids
        btnTab1: $("#tab1"),
        btnTab2: $("#tab2"),
        btnEditQuiz: $("#btnEditQuiz"),
        btnGetQuiz: $("#btnGetQuiz"),
        txtScore: $("#txtScore"),
        quizTitle: $("#quizTitle"),
        gameElements: $("#gameElements"),
        quizElements: $("#quizElements"),
        displayQuestions: $("#displayQuestions"),
        editQuestions: $("#editQuestions"),
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
        questionContainer: ".questionContainer",
        selected: "selected"
    };

    function htmlData() { //used to set the questionHTML, optionHTML
        // questionHTML = '<li class="questionContainer" draggable="true" ondragstart="drag(event)">';
        // questionHTML += '<button class="btn btn-danger btnDeleteQuestion">Delete Questions</button>';
        // questionHTML += '<label for="txtQ1Title"></label>';
        // questionHTML += '<textarea name="txtQuestionTitle" class="form-control questionText" id="txtQuestionTitle" cols="10" rows="3" placeholder="Question"></textarea>';
        // questionHTML += '<p class="txtError"> The question can`t left blank</p>';
        // questionHTML += '<ol class="option" type="A">';
        // questionHTML += '</ol>';
        // questionHTML += '<button class="btn btn-primary btnAddQuestionOption">+ Add Option</button>';
        // questionHTML += '</li>';
        // optionHTML = '<li>';
        // optionHTML += '<button class="btn btn-danger btnDeleteOption">Delete Option</button>';
        // optionHTML += '<input type="text" class="form-control optionText" placeholder="Option">';
        // optionHTML += '<input class="chkCorrect" type="checkbox" value="">';
        // optionHTML += '<p class="txtOptionError"> An option has been left blank</p>';
        // optionHTML += '</li>';
        // popQuestion = ['<div class="questionContainer"></div>'];
        // popOption = ['<div class="btnOption">', '</div>'];

        questionHTML = '<li class="questionContainer">';
        questionHTML += '<button class="btn btn-danger btnDeleteQuestion">Delete Questions</button>';
        questionHTML += '<label for="txtQ1Title"></label>';
        questionHTML += '<textarea name="txtQuestionTitle" class="form-control questionText" id="txtQuestionTitle" cols="10" rows="3" placeholder="Question"></textarea>';
        questionHTML += '<p class="txtError"> The question can`t left blank</p>';
        questionHTML += '<ol class="option" type="A">';
        questionHTML += '</ol>';
        questionHTML += '<button class="btn btn-primary btnAddQuestionOption">+ Add Option</button>';
        questionHTML += '</li>';
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
        var questions = $("#editQuestions .questionContainer").toArray();
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
        var valid;
        $(uiElements.questionContainer).each(function (i, q) { // used to loop through all the questions
            if ($(q).find(".selected").length > 0) { // if an answer is not selected
                valid = true;
            } else {
                valid = false;
            }
        });
        return valid; // returns the validity of user inputs
    };

    var highlightCorrect = function (quizData) {
        //used to change colour of selected items after the quiz has been checked
        $(uiElements.questionContainer).each(function (i, q) {
            $(q).find(uiElements.btnOption).each(function (j, o) {
                if (quizData.questions[i].options[j].chk) {
                    $(o).addClass("correct");
                }
                if (!quizData.questions[i].options[j].chk && $(o).hasClass(uiElements.selected)) {
                    $(o).addClass("incorrect");
                }
            });
        });
    };

    htmlData();
    return {
        getUIElem: function () {
            return uiElements;
        },
        addQuestion: function () {
            //used to add a question div with relevant elements to the quiz builder
            $("#editQuestions").append(questionHTML);
            for (let i = 0; i < 4; i++) {
                $($(uiElements.questionContainer)[$(uiElements.questionContainer).length - 1]).find("ol")
                    .append(optionHTML);
            }
        },
        addQuestionOption: function () { //adds a question to the ordered list
            $(this).prev("ol").append(optionHTML);
        },
        removeParent: function () { //remove the parent of clicked element
            $(this).parent().remove();
        },
        textError: function () { //used to display an error message telling the user to fill in the quiz title
            if ($(this).val() == "") {
                $(this).addClass("is-invalid");
                $(this).parent().find(".txtError").show();
            } else {
                $(this).removeClass("is-invalid");
                $(this).parent().find(".txtError").hide();
            }
        },
        optionTextError: function () { //used to display an error message telling the user to fill in the option
            if ($(this).val() == "") {
                $(this).addClass("is-invalid");
                $(this).parent().find(".txtOptionError").show();
            } else {
                $(this).removeClass("is-invalid");
                $(this).parent().find(".txtOptionError").hide();
            }
        },
        saveGame: function (isQuizValid, quizBuildData, download) { //saves the
            if (isQuizValid()) {
                getQuizData(quizBuildData);
                var jsonData = JSON.stringify(quizBuildData);
                download(jsonData, quizBuildData.quizTitle + '.json', 'application/json');
            }
        },
        checkQuiz: function (quizIncomplete, numOfQuestions, quizData, checkCorrect) {
            //checks to see if the user answers are correct
            if (quizIncomplete) {
                if (validation()) {
                    var numOfCorrect = checkCorrect();
                    uiElements.txtScore.html("You scored " + numOfCorrect + " out of " + numOfQuestions);
                    highlightCorrect(quizData);
                } else {
                    alert("The quiz is not done. You need to fill out all the questions!");
                }
            }
        },
        selectAns: function (that, quizIncomplete) { //used to give selected answer an outline
            if (quizIncomplete) {
                $(that).toggleClass("selected");
            }
        },
        clearQuiz: function () { // used to clear the quiz div element
            $("#editQuestions").empty();
        },
        getQuestionHTML: function () { //used to get question div html
            return questionHTML;
        },
        getOptionHTML: function () { // used to get the option div html
            return optionHTML;
        },
        displayError: function (elem, valid, type) { // help show errors
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
    var uiElem = UICtrl.getUIElem(); //link to the ui dictionary from the UI class
    var setupEvents = function () {
        // used to set up all the events in a since a clean way
        //also nice for testing since you can turn off all the events
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
            UICtrl.saveGame(isQuizValid, dataCtrl.getQuizBuildData(), download);
        });
        uiElem.btnEditQuiz.change(editQuiz);
        uiElem.btnGetQuiz.change(loadQuiz);
        uiElem.btnCheck.on("click", function () {
            UICtrl.checkQuiz(dataCtrl.getQuizComplete(), dataCtrl.getNumOfQuestions(), dataCtrl.getQuizLoadData(), checkCorrect);
        });
        uiElem.quizElements.on("click", uiElem.btnOption, function () {
            UICtrl.selectAns(this, dataCtrl.getQuizComplete);

        });
    };

    var download = function (content, fileName, contentType) { //used for file download
        var a = document.createElement("a");
        var file = new Blob([content], {
            type: contentType
        });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    };

    var onReaderLoad = function (event) {
        //used to get data from downloaded JSON file and save it into a data structure
        dataCtrl.setQuizData(JSON.parse(event.target.result));
    };

    var onChange = function (e) { //used to set up the download for the JSON file
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(e.target.files[0]);
    };

    var editQuiz = function (e) { //start the process to load quiz so it can be edited
        onChange(e);
        setTimeout(function () { // a timer used to give enough time for the JSON file to be read.
            loadQuizElements();
        }, 2000);
    };

    var loadQuiz = function (e) { //starts the process to load the quiz JSON file so it can be played
        onChange(e);
        setTimeout(function () { // a timer used to give enough time for the JSON file to be read.
            UICtrl.clearQuiz();
            popQuiz();
        }, 2000);
    };

    var loadQuizElements = function () {
        //used to set up the quiz maker form os that a quiz can be edited
        let quizBuildData = dataCtrl.getQuizBuildData();
        uiElem.txtTitle.val(quizBuildData.quizTitle);
        uiElem.editQuestions.empty();
        quizBuildData.questions.forEach(function (q, i) {
            uiElem.editQuestions.append(UICtrl.getQuestionHTML);
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

    var checkCorrect = function () { //used to check user answers to see if they are correct.
        var numOfCorrect = 0;
        var quizData = dataCtrl.getQuizLoadData();
        $(uiElem.questionContainer).each(function (i, q) { // i is index and q is the question
            // let used to have the value reset when the code block is executed
            let userInput = []; // will store user picked answer to question
            let correctInput = []; // will store the quiz makers answers
            $(q).find(uiElem.btnOption).each(function (j, o) { // get user input j is index of loop and o is option
                userInput.push($(o).hasClass(uiElem.selected));
            });
            quizData.questions[i].options.forEach(function (o, j) { //o is option and j is index of loop
                correctInput.push(o.chk);
            });
            if (correctInput.toString() === userInput.toString()) {
                numOfCorrect += 1;
                $(q).find("span").addClass("qCorrect").append(" ✓");
            } else {
                $(q).find("span").addClass("qIncorrect").append(" X");
            }
        });
        dataCtrl.setQuizComplete(false, numOfCorrect);
        return numOfCorrect;
    };

    var popQuiz = function () { // will generate and populate the quiz elements
        var question = ['<div class="questionContainer"></div>'];
        var option = ['<div class="btnOption">', '</div>'];
        var quizData = dataCtrl.getQuizLoadData();
        uiElem.quizTitle.text(quizData.quizTitle);
        dataCtrl.setNumOfQuestions(quizData.questions.length); // set the number of questions
        quizData.questions.forEach(function (q, i) { // loops through questions
            uiElem.displayQuestions.append(question);
            $(uiElem.questionContainer).last().append('<div class="txtQuestionTitle">' + (i + 1) + " " + quizData.questions[i].question + '<span></span></div>');
            quizData.questions[i].options.forEach(function (o, j) { // loops through options of questions
                // var fullOption = option[0] + o.op + option[1];
                $(uiElem.questionContainer).last().append(option[0] + (j + 1) + ": " + o.op + option[1]);
            });
        });
        uiElem.btnCheck.show();
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
        }
        $(uiElem.questionContainer).each(function (i) {
            let qCon = $($(uiElem.questionContainer)[i]);
            // check if there are more than 1 options per question
            if (qCon.find("li").length < 2) {
                isValid = false;
            }
            // check at least one answer is selected or if not all answer are selected as the correct answers
            if (qCon.find(":checked").length == 0) {
                isValid = false;
            } else if (qCon.find(":checked").length == qCon.find(".chkCorrect").length) {
                isValid = false;
            }
        });
        return isValid;
    };

    return {
        init: function () {
            setupEvents();
        }
    };
})(dataController, uiController);

controller.init(); // <-- starting point of the application

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    $(".questionContainer").height("50px");
    $(".questionContainer").children().hide();
    // $(".questionContainer").css("max-height","0.15s ease-out");
    //transition: max-height 0.15s ease-out;
    $(ev.target).attr("id", "drag");
    console.log("-------------------------");
    console.log(ev.target.id);
    console.log(ev.target);
    console.log("-------------------------");
    console.log("-------------------------");
    ev.dataTransfer.setData("html", ev.target.id);
   //$(ev.target).removeAttr("id");

}

function drop(ev) {
    var data = ev.dataTransfer.getData("html");
    console.log(data);
    console.log($(data));
   $("#editQuestions").append(document.getElementById(data));// ev.target.appendChild(data);
   $(ev.target).removeAttr("id");
    ev.preventDefault();
    $(".questionContainer").height("auto");
    $(".questionContainer").children().show();
}