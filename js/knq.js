jQuery(document).ready(function () {
    qCHECKBOXTEXT = '1';
    qRADIOBOXTEXT = '2';
    qSORTING = '3';
    qSELECTBOX = '4';
    qDRAGDROP = '5';
    qCHECKBOXIMG = '6';
    qRADIOBOXIMG = '7';
    qWORDSEARCH = '8';
    qCROSSWORDEASY = '9'; // TODO: aritmogrif
    qCROSSWORD = '10';
    qMATCHING = '11';
    qTRUEFALSE = '12';
    qPUZZLE = '13'
    qMATCHIMAGE = '14';
    qCATEGORY = '15';
    qPIXELATEDIMAGE = '16';
	// color_ok="B1D9BC";
	// color_nok="FAB6B6";
	// color_neutral="F4F4F4";
	// color_hover="FFF9B9";
	// color_bhover="C2BD8C";
    rcorecte = 0; // număr de răspunsuri corecte
    rtext = ""; // textul cu rezultatul după rezolvarea chestionarul
    startOffsetLeft = 0;
    startOffsetTop = 0;
	jQuery( document ).tooltip({track: true});

    loadQuestion();
    funcFullScreen();
	Mousetrap.bind('f', function() { jQuery("#fullscreen-link").trigger('click'); });
	Mousetrap.bind('enter', function() { jQuery("#knq_main_button").trigger('click'); });
})

jQuery(window).resize(function () {
    resizePuzzle(2)
})

// TODO: show feedback only at the end

jQuery('#redoQuiz').click(function () {
    rcorecte = 0;
    rtext = "";
    startOffsetLeft = 0
    startOffsetTop = 0
    crti = 1
    jQuery(this).hide();
    jQuery("#knq_feedback").hide();
    jQuery("#score").text("Current score: 0");
    jQuery("#knq_main_button").val(msg_done);
    jQuery("#knq_main_button").show();
    jQuery("#knqList").hide();
    jQuery("#points").text(0);
    jQuery("#knq_answer").hide();
    loadQuestion();
})


/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadQuestion() {
    var ajax_url = knq_object.ajax_url;
    var data = {
        'action': 'detaliiIntrebare',
        'iduri': iduri,
        'crti': crti
    };
    jQuery.ajax({
        url: ajax_url,
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (response) {
            let knq_question = jQuery("#knq_question")
            let questionContainer = jQuery("#questionContainer")
            let tip = response[0].type;
            jQuery('#type').text(tip);
            if (knq_question.length === 0) {
                // sunt la prima întrebare, deci creez scheletul pentru prima întrebare (schelet și pentru următoarele)
                questionContainer.append("<h3 id='knq_question' class='knq_question' name='knq_question'></h3>")
                questionContainer.append("<p id='type' style='display: none'>" + tip + "</p>")
                questionContainer.append("<div style='display: none' class='loader'></div>")
                questionContainer.append('<div class="knq_container"><ul class="knq_list" id="knqList"></ul><div id="knqImages"></div><div id="knq_answer" class="knq_answer"></div><div style="clear:both"></div><div id="knq_feedback" class="knq_feedback"></div><p center><input id="knq_main_button" class="knq_main_button" type=button value="' + msg_done + '"!></p>');
                jQuery('.knq_feedback').css('background-color', color_hover);
                jQuery("#knqList").hide();
                jQuery("#knqImages").hide();
                jQuery("#knq_answer").hide();
				jQuery("#knq_feedback").hide();
                jQuery("#knq_main_button").on('click', function () {
                    funcClickAmRaspuns();
                });
                knq_question = jQuery("#knq_question")
            }
            //afișăm mai întâi întrebarea
            showNumberOfQ = !(crti === iduri.split("|").length && crti === 1);
            if (response[0].image !== "" && response[0].image !== null) {
                //întrebarea are imagine, sus, jos, dreapta sau stanga
                if (response[0].image_position === 'above') {
                    knq_question.html("<img style='height: auto; width: 100%' src='" + response[0].image + "'><p>" + (showNumberOfQ ? (crti + "/" + iduri.split("|").length + ". ") : "") + response[0].question.replace(/(?:\r\n|\r|\n)/g, '<br>').replace('***', '') + "</p>")
                    knq_question.css('display', '')
                    knq_question.css('align-items', '')
                    knq_question.css('justify-content', '')
                } else if (response[0].image_position === 'below') {
                    knq_question.html("<p>" + (showNumberOfQ ? (crti + "/" + iduri.split("|").length + ". ") : "") + response[0].question.replace(/(?:\r\n|\r|\n)/g, '<br>').replace('***', '') + "</p><img style='height: auto; width: 100%' src='" + response[0].image + "'>")
                    knq_question.css('display', '')
                    knq_question.css('align-items', '')
                    knq_question.css('justify-content', '')
                } else if (response[0].image_position === 'right') {
                    knq_question.html("<p style='margin-right: 1vw'>" + (showNumberOfQ ? (crti + "/" + iduri.split("|").length + ". ") : "") + response[0].question.replace(/(?:\r\n|\r|\n)/g, '<br>').replace('***', '') + "</p><img style='height: 100px; width: auto' src='" + response[0].image + "'>")
                    knq_question.css('display', 'flex')
                    knq_question.css('align-items', 'center')
                    knq_question.css('justify-content', 'center')
                } else if (response[0].image_position === 'left') {
                    knq_question.html("<img height=100 style='max-height: 100px; width: auto' src='" + response[0].image + "'><p style='margin-left: 1vw'>" + (showNumberOfQ ? (crti + "/" + iduri.split("|").length + ". ") : "") + response[0].question.replace(/(?:\r\n|\r|\n)/g, '<br>').replace('***', '') + "</p>")
                    knq_question.css('display', 'flex')
                    knq_question.css('align-items', 'center')
                    knq_question.css('justify-content', 'center')
                }
            } else {
                //fără imagine
                knq_question.html("<p>" + (showNumberOfQ ? (crti + "/" + iduri.split("|").length + ". ") : "") + response[0].question.replace(/(?:\r\n|\r|\n)/g, '<br>').replace('***', '') + "</p>")
            }

            //pregătim răspunsurile pentru afișare
            let answers = response[0].answers;
            let rightOnes = response[0].right_one;
            if (tip === qCHECKBOXTEXT || tip === qRADIOBOXTEXT || tip === qSORTING || tip === qTRUEFALSE) {
                buildAnswerCheckRadioSortTrueFalse(answers, tip);
            } else if (tip === qSELECTBOX) {
                buildAnswerSelectBox(answers);
            } else if (tip === qDRAGDROP) {
                buildAnswerDragDrop(answers);
            } else if (tip === qCHECKBOXIMG || tip === qRADIOBOXIMG) {
                buildAnswerCheckRadioImage(answers, tip);
            } else if (tip === qWORDSEARCH) {
                buildWordSearch(answers);
			} else if (tip === qCROSSWORD) {
                buildCrossWord(answers);
            } else if (tip === qMATCHING) {
                buildMatching(answers, rightOnes, response[0].question.includes("***"));
            } else if (tip === qPUZZLE) {
                buildPuzzle(answers);
            } else if (tip === qMATCHIMAGE) {
                buildMatchImage(answers);
            } else if (tip === qCATEGORY) {
                buildCategories(answers);
            } else if (tip === qPIXELATEDIMAGE) {
                buildPixelatedImage(answers);
            }
            if ((tip === qSORTING || (jQuery("#shuffleAnswers").text() === '1' && (tip === qCHECKBOXTEXT || tip === qRADIOBOXTEXT || tip === qCHECKBOXIMG || tip === qRADIOBOXIMG))) && !response[0].question.includes("***")) {
                // dacă e un tip cu mai multe răspunsuri, are logică să fie amestecate, dacă s-a optat pentru așa ceva
                var ul = jQuery("#knqList")[0];
                for (var i = ul.children.length; i >= 0; i--) {
                    ul.appendChild(ul.children[Math.random() * i | 0]);
                }
            }
            jQuery('.loader').hide();
            if (tip === qCHECKBOXTEXT || tip === qRADIOBOXTEXT || tip === qSORTING || tip === qCHECKBOXIMG || tip === qRADIOBOXIMG || tip === qTRUEFALSE || tip === qMATCHIMAGE) {
                jQuery("#knqList").show()
            } else if (tip === qSELECTBOX || tip === qDRAGDROP || tip === qWORDSEARCH || tip === qCROSSWORD || tip === qMATCHING || tip === qPUZZLE || tip === qCATEGORY || tip === qPIXELATEDIMAGE) {
                jQuery("#knq_answer").show();
            }

            jQuery(".knq_unselected").bind("click", function () {
                //aici definesc comportamentul la click pe unul dintre răspunsurile multiple disponibile
                funcClickSelected(jQuery(this));
            });

            jQuery(".knq_image_unselected").bind("click", function () {
                //aici definesc comportamentul la click pe unul dintre răspunsurile multiple disponibile
                funcClickImage(jQuery(this));
            });

            if (tip === qSORTING) {
                //definesc comportamentul de sortare
                elemSortable = new Sortable(jQuery("#knqList")[0], {
                    animation: 150,
                    ghostClass: 'blue-background-class'
                });
                jQuery("#knqList").addClass("ui-sortable")
            }
            jQuery("#knq_main_button").val(msg_done);
            if (crti != 1) {
                //la prima întrebare nu fac salt, căci altfel în pagină sare direct la quiz
                scrollToAnchor('knq_question');
            }
        }
    })
}


function funcClickSelected(obiect) {
    //aici definesc comportamentul la click pe unul dintre răspunsurile multiple disponibile
    if (jQuery("#type").text() === qCHECKBOXTEXT || jQuery("#type").text() === qCHECKBOXIMG) {
        if (obiect.children("i").attr("class") == "fa fa-square-o") {
            obiect.children("i").attr("class", "fa fa-check-square-o");
            obiect.removeClass("knq_unselected");
            obiect.addClass("knq_selected");
        } else {
            obiect.children("i").attr("class", "fa fa-square-o");
            obiect.removeClass("knq_selected");
            obiect.addClass("knq_unselected");
        }
    } else if (jQuery("#type").text() === qRADIOBOXTEXT || jQuery("#type").text() === qRADIOBOXIMG) {
        jQuery(".knq_list").children().each(function () {
            jQuery(this).children("i").attr("class", "fa fa-circle-o");
            jQuery(this).removeClass("knq_selected");
            jQuery(this).addClass("knq_unselected");
        });
        obiect.children("i").attr("class", "fa-regular fa-circle-check");
        obiect.removeClass("knq_unselected");
        obiect.addClass("knq_selected");
    }
}


function funcClickImage(obiect) {
    //aici definesc comportamentul la click pe imaginile multiple disponibile
    if (jQuery("#type").text() === qCHECKBOXIMG) {
        if (obiect.children("i").attr("class") == "fa fa-square-o") {
            obiect.children("i").attr("class", "fa fa-check-square-o");
            obiect.removeClass('knq_image_unselected')
            obiect.addClass('knq_image_selected')
        } else {
            obiect.children("i").attr("class", "fa fa-square-o");
            obiect.removeClass('knq_image_unselected')
            obiect.addClass('knq_image_selected')
        }
    } else if (jQuery("#type").text() === qRADIOBOXIMG) {
        jQuery("#knqImages").children().each(function () {
            jQuery(this).children("i").attr("class", "fa fa-circle-o");
            jQuery(this).removeClass('knq_image_selected')
            jQuery(this).addClass('knq_image_unselected')
        });
        obiect.children("i").attr("class", "fa-regular fa-circle-check");
        obiect.removeClass('knq_image_unselected')
        obiect.addClass('knq_image_selected')
    }
}


function scrollToAnchor(aid) {
    var aTag = jQuery("h3[name='" + aid + "']");
    jQuery('html,body').animate({scrollTop: aTag.offset().top}, 'slow');
}

function funcClickAmRaspuns() {
    var ajax_url = knq_object.ajax_url;
    if (jQuery("#knq_main_button").val() == msg_finish) {
        //s-au terminat întrebările, evaluez notă
        cate = iduri.split("|").length;
        rtext = "<br>" + rtext;
        let score = jQuery("#score")
        if (jQuery("#quizCompletion").attr('completed_before') === '0') {
            jQuery("#quizCompletion").html('<span id="score">' + score.text() + '</span>' + '. Nota anterioară: ' + parseFloat(score.text().split(": ")[1]) + ' obținută acum.')
        }
        jQuery("#knq_question").html("Rezultatele finale:");
        var data = {
            'action': 'updateScore',
            'score': parseFloat(score.text().split(": ")[1]),
            'quizId': jQuery("#quizId").text()
        };
        let highscore = false;
        // cu ajax-ul acesta punem nota mai mare, dacă s-a obținut notă mai mare
        jQuery.ajax({
            url: ajax_url,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (response) {
                highscore = false;
                firstTime = false;
                if (response !== 2)
                    highscore = true;
                if (response === 0) {
                    firstTime = true;
                }
                // if (rcorecte === 0 && highscore) {
                //     jQuery("#quizCompletion").html('<span id="score">' + score.text() + '</span>' + '. Nota anterioară: ' + parseFloat(score.text().split(": ")[1]) + ' obținută acum.')
                //     jQuery("#knq_feedback").html("<strong>Ups! Nu ați răspuns corect la nici o întrebare.</strong>" + rtext + "\n<b>Nota finală: " + parseFloat(score.text().split(": ")[1]) + "." + (firstTime ? "" : " Ați obținut un nou scor record!") + "</b>");
                // } else if (rcorecte === 0) {
                //     jQuery("#knq_feedback").html("<strong>Ups! Nu ați răspuns corect la nici o întrebare.</strong>" + rtext + "\nNota finală: " + parseFloat(score.text().split(": ")[1]) + ".");
                // } else if (rcorecte == cate && highscore) {
                //     jQuery("#quizCompletion").html('<span id="score">' + score.text() + '</span>' + '. Nota anterioară: ' + parseFloat(score.text().split(": ")[1]) + ' obținută acum.')
                //     jQuery("#knq_feedback").html("<strong>Felicitări! Ați răspuns corect la toate întrebările!</strong>" + rtext + "\n<b>Nota finală: " + parseFloat(score.text().split(": ")[1]) + "." + (firstTime ? "" : " Ați obținut un nou scor record!") + "</b>");
                // } else if (rcorecte == cate)
                //     jQuery("#knq_feedback").html("<strong>Felicitări! Ați răspuns corect la toate întrebările!</strong>" + rtext + "\n<b>Nota finală: " + parseFloat(score.text().split(": ")[1]) + ".</b>");
                // else if (highscore) {
                //     jQuery("#quizCompletion").html('<span id="score">' + score.text() + '</span>' + '. Nota anterioară: ' + parseFloat(score.text().split(": ")[1]) + ' obținută acum.')
                //     jQuery("#knq_feedback").html("<strong>Ați răspuns corect la " + rcorecte + " întrebări din " + cate + ".</strong>" + rtext + "\n<b>Nota finală: " + parseFloat(score.text().split(": ")[1]) + "." + (firstTime ? "" : " Ați obținut un nou scor record!") + "</b>");
                // } else
                //     jQuery("#knq_feedback").html("<strong>Ați răspuns corect la " + rcorecte + " întrebări din " + cate + ".</strong>" + rtext + "\n<b>Nota finală: " + parseFloat(score.text().split(": ")[1]) + ".</b>");
                if (rcorecte === 0 && highscore) {
                    jQuery("#quizCompletion").html('<span id="score">' + score.text() + '</span>' + '. ' + text_previous_score + ': ' + parseFloat(score.text().split(": ")[1]) + ' ' + text_obtained_now + '.')
                    jQuery("#knq_feedback").html("<strong>" + text_all_wrong + "</strong>" + rtext + "\n<b>" + text_final_score + ": " + parseFloat(score.text().split(": ")[1]) + "." + (firstTime ? "" : " " + text_new_highscore) + "</b>");
                } else if (rcorecte === 0) {
                    jQuery("#knq_feedback").html("<strong>" + text_all_wrong + "</strong>" + rtext + "\n" + text_final_score + ": " + parseFloat(score.text().split(": ")[1]) + ".");
                } else if (rcorecte == cate && highscore) {
                    jQuery("#quizCompletion").html('<span id="score">' + score.text() + '</span>' + '. ' + text_previous_score + ': ' + parseFloat(score.text().split(": ")[1]) + ' ' + text_obtained_now + '.')
                    jQuery("#knq_feedback").html("<strong>" + text_all_right + "</strong>" + rtext + "\n<b>" + text_final_score + ": " + parseFloat(score.text().split(": ")[1]) + "." + (firstTime ? "" : " " + text_new_highscore) + "</b>");
                } else if (rcorecte == cate)
                    jQuery("#knq_feedback").html("<strong>" + text_all_right + "</strong>" + rtext + "\n<b>" + text_final_score + ": " + parseFloat(score.text().split(": ")[1]) + ".</b>");
                else if (highscore) {
                    jQuery("#quizCompletion").html('<span id="score">' + score.text() + '</span>' + '. ' + text_previous_score + ': ' + parseFloat(score.text().split(": ")[1]) + ' ' + text_obtained_now + '.')
                    jQuery("#knq_feedback").html("<strong>" + text_partial_correct + " " + rcorecte + " " + text_partial_out_of + " " + cate + ".</strong>" + rtext + "\n<b>" + text_final_score + ": " + parseFloat(score.text().split(": ")[1]) + "." + (firstTime ? "" : " " + text_new_highscore) + "</b>");
                } else {
                    jQuery("#knq_feedback").html("<strong>" + text_partial_correct + " " + rcorecte + " " + text_partial_out_of + " " + cate + ".</strong>" + rtext + "\n<b>" + text_final_score + ": " + parseFloat(score.text().split(": ")[1]) + ".</b>");
                }

                jQuery(".knq_list").empty();
                jQuery("#knq_answer").empty();
                jQuery("#knq_main_button").hide();
                jQuery("#redoQuiz").show()
            },
            error: function (response) {
                console.log(response)
            }
        })

    } else if (jQuery("#knq_main_button").val() == msg_done) {
        //a răspuns la întrebarea curentă, trecem mai departe
        let corecte = [];
        jQuery("#knqList").children().each(function () {
            if (jQuery(this).hasClass("knq_selected")) {
                corecte.push(jQuery(this).attr("id"));
            }
        });
        evalAnswers(corecte);
    } else {
        // move to the next question
        crti++;
        evalAnswers("");
    }
}


function evalAnswers(corecteUser) {
    //evaluează corectitudinea răspunsurilor
    var ajax_url = knq_object.ajax_url;
    var data = {
        'action': 'detaliiIntrebare',
        'iduri': iduri,
        'crti': crti
    };

    jQuery.ajax({
        url: ajax_url,
        type: 'post',
        data: data,
        dataType: 'json',
        beforeSend: function () {
            jQuery("#knq_main_button").prop('disabled', true);
        },
        success: function (response) {
            if (response.length > 0) {
                let score = jQuery("#score")
                let points = jQuery("#points")
                if (jQuery("#knq_main_button").val() === msg_done) {
                    //este răspunsul la o întrebare
                    jQuery('.knq_unselected').each(function() {
                        jQuery(this).css('background-color', color_neutral)
                        jQuery(this).unbind("mouseenter");
                        jQuery(this).unbind("mouseleave");
                    })
                    jQuery('.knq_selected').each(function() {
                        jQuery(this).unbind("mouseenter");
                        jQuery(this).unbind("mouseleave");
                    })
                    jQuery('.knq_matching_answer').each(function() {
                        jQuery(this).unbind("mouseenter");
                        jQuery(this).unbind("mouseleave");
                    })
                    jQuery('.knq_right_one').each(function() {
                        jQuery(this).unbind("mouseenter");
                        jQuery(this).unbind("mouseleave");
                    })
                    if (jQuery("#type").text() === qCHECKBOXTEXT || jQuery('#type').text() === qCHECKBOXIMG) {
                        // Handle first, second, sixth and seventh types of questions
                        let answersList = jQuery(".knq_unselected");
                        answersList.each(function (index) {
                            jQuery(this).unbind('click');
                        })
                        jQuery(".knq_selected").each(function (index) {
                            jQuery(this).unbind('click');
                        })
                        ro = response[0].right_one;
                        fd = ((response[0].feedbackp !== null) && (response[0].feedbackp + "").length > 0 ? "<br>" + response[0].feedbackp.replace(/(?:\r\n|\r|\n)/g, '<br>') : "");
                        fdn = ((response[0].feedbackn !== null) && (response[0].feedbackn + "").length > 0 ? "<br>" + response[0].feedbackn.replace(/(?:\r\n|\r|\n)/g, '<br>') : "");
                        corecte = ro.split("|");
                        if (corecte.sort().join(',') === corecteUser.sort().join(',')) {
                            // correct answers
                            points.text(points.text() - 0 + 10)
                            partialScore = ((points.text() - 0) / (crti)).toFixed(2)
                            if (partialScore % 1 === 0) {
                                partialScore = Math.trunc(partialScore)
                            }
                            partialScore = parseFloat(partialScore)
                            score.text(score.text().split(": ")[0] + ": " + partialScore)
                            jQuery("#knq_feedback").html(msg_correct + fd).show();
                            rcorecte++;
                            rtext += crti + ". <i class='fa fa-check' aria-hidden='true'></i>&nbsp;" + response[0].question.replace(/(?:\r\n|\r|\n)/g, '<br>').replace('***', '') + "<br>";
                        } else {
                            // partially correct answers
                            let partialScore;
                            let correctAnswers = 0;
                            corecteUser.forEach((corect) => {
                                if (corecte.includes(corect)) {
                                    correctAnswers++;
                                }
                            })
                            correctAnswers -= corecteUser.length - correctAnswers;
                            if (correctAnswers > 0) {
                                partialScore = (correctAnswers * 10 / corecte.length).toFixed(2);
                                if (partialScore % 1 === 0) {
                                    partialScore = Math.trunc(partialScore)
                                }
                                partialScore = parseFloat(partialScore)
                            } else {
                                partialScore = 0;
                            }
                            points.text(points.text() - 0 + partialScore)
                            partialScore = ((points.text() - 0) / crti).toFixed(2)
                            if (partialScore % 1 === 0) {
                                partialScore = Math.trunc(partialScore)
                            }
                            partialScore = parseFloat(partialScore)
                            score.text(score.text().split(": ")[0] + ": " + partialScore)
                            jQuery("#knq_feedback").html(msg_wrong + (fdn == "" ? fd : fdn)).show();
                            rtext += crti + ". <i class='fa fa-xmark' aria-hidden='true'></i>&nbsp;" + response[0].question.replace(/(?:\r\n|\r|\n)/g, '<br>').replace('***', '') + "<br>";
                        }
                        jQuery(".knq_list").children().each(function () {
                            if ((corecte.indexOf(jQuery(this).attr("id")) === -1) && (jQuery(this).hasClass("knq_selected")))
                                jQuery(this).css("background-color", color_nok);
                            if (corecte.indexOf(jQuery(this).attr("id")) !== -1)
                                jQuery(this).css("background-color", color_ok);
                        });
                        nextOrFinish()
                    } else if (jQuery("#type").text() === qTRUEFALSE) {
                        let answersList = jQuery(".knq_unselected");
                        ro = response[0].right_one;
                        corecte = ro.split("|");
                        let correctAnswersCounter = 0;
                        answersList.each(function () {
                            jQuery(this).find('label').each(function () {
                                jQuery(this).attr("onclick", "");
                            })
                            jQuery(this).find('.trueRadio').first().attr('disabled', true);
                            jQuery(this).find('.falseRadio').first().attr('disabled', true);
                            if (jQuery(this).find('.trueRadio').is(':checked')) {
                                if (corecte.includes(jQuery(this).find('.trueRadio').attr('name').split('_')[2])) {
                                    correctAnswersCounter++;
                                }
                            } else if (jQuery(this).find('.falseRadio').is(':checked')) {
                                console.log("yup, im checked")
                                if (!corecte.includes(jQuery(this).find('.falseRadio').attr('name').split('_')[2])) {
                                    correctAnswersCounter++;
                                }
                            }
                        })
                        computeScore(correctAnswersCounter, answersList.length, response)
                        answersList.each(function () {
                            if ((corecte.indexOf(jQuery(this).find('.falseRadio').attr('name').split('_')[2]) === -1) && jQuery(this).find('.falseRadio').is(':checked')) {
                                jQuery(this).css("background-color", color_ok);
                            } else if ((corecte.indexOf(jQuery(this).find('.trueRadio').attr('name').split('_')[2]) !== -1) && jQuery(this).find('.trueRadio').is(':checked')) {
                                jQuery(this).css("background-color", color_ok);
                            } else {
                                jQuery(this).css("background-color", color_nok);
                            }
                        });
                        nextOrFinish()
                    } else if (jQuery("#type").text() === qRADIOBOXTEXT || jQuery('#type').text() === qRADIOBOXIMG) {
                        // Handle first, second, sixth and seventh types of questions
                        let answersList = jQuery(".knq_selected");
                        jQuery(".knq_unselected").each(function (index) {
                            jQuery(this).unbind('click');
                        })
                        answersList.each(function (index) {
                            jQuery(this).unbind('click');
                        })
                        ro = response[0].right_one;
                        corecte = ro.split("|");
                        let correctAnswersCounter = 0;
                        answersList.each(function () {
                            if (corecte.includes(jQuery(this).attr('id'))) {
                                correctAnswersCounter++;
                            }
                        })
                        computeScore(correctAnswersCounter, corecte.length, response)
                        jQuery(".knq_list").children().each(function () {
                            if ((corecte.indexOf(jQuery(this).attr("id")) === -1) && (jQuery(this).hasClass("knq_selected")))
                                jQuery(this).css("background-color", color_nok);
                            if (corecte.indexOf(jQuery(this).attr("id")) !== -1)
                                jQuery(this).css("background-color", color_ok);
                        });
                        nextOrFinish()
                    } else if (jQuery("#type").text() === qSORTING) {
                        // Handle the third type of question
                        elemSortable.destroy();
                        jQuery('#knqList').removeClass("ui-sortable");
                        let correctAnswersCounter = 0;
                        let answersList = jQuery(".knq_unselected");
                        var previous = null;
                        answersList.each(function (index) {
                            jQuery(this).find('p').text(jQuery(this).text() + " (" + jQuery(this).attr('id') + ")")
                            if (index === 0) {
                                if (String(parseInt(jQuery(this).attr('id')) + 1) === answersList.eq(index + 1).attr('id') || (parseInt(jQuery(this).attr('id'))) === index + 1) {
                                    jQuery(this).css("background-color", color_ok);
                                    correctAnswersCounter++;
                                } else {
                                    jQuery(this).css("background-color", color_nok);
                                }
                            } else if (index === answersList.length - 1) {
                                if (String(jQuery(this).attr('id') - 1) === answersList.eq(index - 1).attr('id') || (parseInt(jQuery(this).attr('id'))) === index + 1) {
                                    jQuery(this).css("background-color", color_ok);
                                    correctAnswersCounter++;
                                } else {
                                    jQuery(this).css("background-color", color_nok);
                                }
                            } else if (String(index + 1) === jQuery(this).attr('id') || String(jQuery(this).attr('id') - 1) === answersList.eq(index - 1).attr('id') || String(parseInt(jQuery(this).attr('id')) + 1) === answersList.eq(index + 1).attr('id')) {
                                jQuery(this).css("background-color", color_ok);
                                correctAnswersCounter++;
                            } else {
                                jQuery(this).css("background-color", color_nok);
                            }
                            previous = this;
                        })
                        computeScore(correctAnswersCounter, answersList.length, response)
                        nextOrFinish()
                    } else if (jQuery("#type").text() === qSELECTBOX) {
                        // Handle the fourth type of question
                        let correctAnswersCounter = 0;
                        let answersList = jQuery(".knq-answer-select");
                        answersList.each(function () {
                            jQuery(this).find('option').each(function () {
                                jQuery(this).attr('disabled', 'disabled')
                            })
                            if (jQuery(this).find(':selected').val() === '1') {
                                jQuery(this).css("background-color", color_ok);
                                correctAnswersCounter++;
                            } else {
                                jQuery(this).css("background-color", color_nok);
                            }
                        })
                        computeScore(correctAnswersCounter, answersList.length, response)
                        nextOrFinish()
                    } else if (jQuery("#type").text() === qDRAGDROP || jQuery("#type").text() === qMATCHIMAGE) {
                        // Handle the fifth type of question
                        let correctAnswersCounter = 0;
                        let answersList = jQuery(".droppable");
                        let draggableList = jQuery(".draggable");
                        let droppedElements = 0;
                        answersList.each(function () {
                            if (jQuery(this).attr('data-dropped-element') !== '0') {
                                droppedElements++;
                            }
                            let droppedElement = jQuery("#draggableAnswer-" + jQuery(this).attr('data-dropped-element'))
                            jQuery(this).droppable('destroy');
                            if (jQuery(this).attr('data-correct') === '1') {
                                jQuery(this).css('background', color_ok)
                                jQuery(this).css('border', '2px solid ' + newShade(color_ok, -70))
                                droppedElement.css('background', color_ok)
                                droppedElement.css('border', '2px solid ' + newShade(color_ok, -70))
                                correctAnswersCounter++;
                            } else {
                                droppedElement.css('background', color_nok)
                                droppedElement.css('border', '2px solid ' + newShade(color_nok, -70))
                                jQuery(this).css('background', color_nok)
                                jQuery(this).css('border', '2px solid ' + newShade(color_nok, -70))
                            }
                        })
                        draggableList.each(function () {
                            jQuery(this).draggable('destroy');
                        })
                        if (droppedElements === answersList.length && droppedElements === draggableList.length) {
                            jQuery('#answerBlocks').css('height', 0)
                        }
                        computeScore(correctAnswersCounter, answersList.length, response)
                        nextOrFinish()
                    } else if (jQuery('#type').text() === qWORDSEARCH) {
                        // handle the eight type of question
                        let correctAnswersCounter = 0
                        let answersList = jQuery('#knq_woswords').find('span')
                        answersList.each(function () {
                            if (jQuery(this).css('text-decoration') === 'line-through solid rgb(0, 0, 0)') {
                                correctAnswersCounter++;
                            }
                        })
                        jQuery("#kqn_wswords").hide();
                        jQuery("#knq_wscontrols").hide();
                        computeScore(correctAnswersCounter, answersList.length, response)
                        nextOrFinish()
                    } else if (jQuery('#type').text() === qMATCHING) {
                        // handle the eleventh type of question
                        let answersList = jQuery('.knq_matching_answer')
                        let rightOnes = jQuery('.knq_right_one')
                        destroySortable()
                        let correctAnswersCounter = 0;
                        for (i = 1; i <= answersList.length; i++) {
                            if (jQuery(answersList[i - 1]).attr('id').split('_').at(-1) === jQuery(rightOnes[i - 1]).attr('id').split('_').at(-1)) {
                                correctAnswersCounter++
                                jQuery(answersList[i - 1]).css("background-color", color_ok);
                                jQuery(rightOnes[i - 1]).css("background-color", color_ok);
                            }
                            else {
                                jQuery(answersList[i - 1]).css("background-color", color_nok);
                                jQuery(rightOnes[i - 1]).css("background-color", color_nok);
                            }
                        }
                        computeScore(correctAnswersCounter, answersList.length, response)
                        nextOrFinish()
                    } else if (jQuery('#type').text() === qPUZZLE) {
                        let correctAnswersCounter = 0;
                        destroySortable()
                        jQuery('.piece').each(function(index) {
                            jQuery(this).css('margin', '0')
                            resizePuzzle(0)
                            if (jQuery(this).attr('id').split('_')[1] - 0 !== index) {
                                jQuery(this).css('opacity', '0.5');
                            }
                            else {
                                correctAnswersCounter++;
                            }
                        })
                        computeScore(correctAnswersCounter, jQuery('.piece').toArray().length, response)
                        nextOrFinish()
                    } else if (jQuery('#type').text() === qCATEGORY) {
                        let correctAnswersCounter = 0;
                        let draggableList = jQuery(".draggable");
                        draggableList.each(function () {
                            jQuery(this).draggable('destroy');
                            if (jQuery(this).attr('data-dropped') === jQuery(this).attr('data-category')) {
                                correctAnswersCounter++;
                                jQuery(this).css('background', color_ok)
                                jQuery(this).css('border', '2px solid ' + newShade(color_ok, -70))
                            }
                            else {
                                jQuery(this).css('background', color_nok)
                                jQuery(this).css('border', '2px solid ' + newShade(color_nok, -70))
                            }
                        })
                        computeScore(correctAnswersCounter, draggableList.length, response)
                        nextOrFinish()
                    } else if (jQuery('#type').text() === qPIXELATEDIMAGE) {
                        timeoutArray.forEach(function(timeout) {
                            clearTimeout(timeout);
                        })
                        jQuery("#knq_answer").css('height', 'fit-content');
                        // console.log(jQuery("#pixelate")[0])
                        // let pixelate = jQuery('#pixelate').remove();
                        jQuery('#knq_answer').find('canvas').each(function () {
                            jQuery(this).remove();
                        })
                        jQuery('#pixelate').show();
                        if (jQuery("#imageAnswer").val() === response[0].right_one) {
                            computeScore(11 - parseInt(jQuery('#pixelate').attr('data-attempt')), 10, response)
                            jQuery("#imageAnswer").css('background', color_ok + "!important")
                        } else {
                            computeScore(0, 10, response)
                            jQuery("#imageAnswer").css('background', color_nok + "!important")
                        }
                        // pixelate.show
                        // jQuery("#knq_answer").append(pixelate)
                        nextOrFinish()
                    }
                } else {
                    // s-a apasat butonul trec mai departe
                    jQuery("#knq_feedback").hide();
                    jQuery("#knq_answer").empty();
                    jQuery("#knqList").empty();
                    jQuery('.loader').show();
                    loadQuestion()
                }
            } else {
                jQuery("#").html("Ceva nu a mers bine. Ne pare rău!");
            }
            jQuery("#knq_main_button").prop('disabled', false);
        }
    });

}


function nextOrFinish() {
    if (crti == iduri.split("|").length) {
        jQuery("#knq_main_button").val(msg_finish).blur();
    } else {
        jQuery("#knq_main_button").val(msg_next).blur();
    }
}


function computeScore(correctAnswersCounter, answersListLength, response) {
    fd = ((response[0].feedbackp !== null) && (response[0].feedbackp + "").length > 0 ? "<br>" + response[0].feedbackp.replace(/(?:\r\n|\r|\n)/g, '<br>') : "");
    fdn = ((response[0].feedbackn != null) && (response[0].feedbackn + "").length > 0 ? "<br>" + response[0].feedbackn.replace(/(?:\r\n|\r|\n)/g, '<br>') : "");
    let points = jQuery("#points")
    let score = jQuery("#score")
    if (correctAnswersCounter === answersListLength) {
        // correct answers
        points.text(points.text() - 0 + 10)
        partialScore = ((points.text() - 0) / crti).toFixed(2)
        if (partialScore % 1 === 0) {
            partialScore = Math.trunc(partialScore)
        }
        partialScore = parseFloat(partialScore)
        score.text(score.text().split(": ")[0] + ": " + partialScore)
        jQuery("#knq_feedback").html(msg_correct + fd).show();
        rcorecte++;

        rtext += crti + ". <i class='fa fa-check' aria-hidden='true'></i>&nbsp;" + response[0].question.replace(/(?:\r\n|\r|\n)/g, '<br>').replace('***', '') + "<br>";
    } else {
        // partially correct answers
        let partialScore;
        if (correctAnswersCounter > 0) {
            partialScore = (correctAnswersCounter * 10 / answersListLength).toFixed(2);
            if (partialScore % 1 === 0) {
                partialScore = Math.trunc(partialScore)
            }
            partialScore = parseFloat(partialScore)
        } else {
            partialScore = 0;
        }
        points.text(points.text() - 0 + partialScore)
        partialScore = ((points.text() - 0) / crti).toFixed(2)
        if (partialScore % 1 === 0) {
            partialScore = Math.trunc(partialScore)
        }
        partialScore = parseFloat(partialScore)
        score.text(score.text().split(": ")[0] + ": " + partialScore)
        jQuery("#knq_feedback").html(msg_wrong + (fdn == "" ? fd : fdn)).show();
        rtext += crti + ". <i class='fa fa-xmark' aria-hidden='true'></i>&nbsp;" + response[0].question.replace(/(?:\r\n|\r|\n)/g, '<br>').replace('***', '') + "<br>";
    }
}


/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
!function (a) {
    function f(a, b) {
        if (!(a.originalEvent.touches.length > 1)) {
            a.preventDefault();
            var c = a.originalEvent.changedTouches[0], d = document.createEvent("MouseEvents");
            d.initMouseEvent(b, !0, !0, window, 1, c.screenX, c.screenY, c.clientX, c.clientY, !1, !1, !1, !1, 0, null), a.target.dispatchEvent(d)
        }
    }

    if (a.support.touch = "ontouchend" in document, a.support.touch) {
        var e, b = a.ui.mouse.prototype, c = b._mouseInit, d = b._mouseDestroy;
        b._touchStart = function (a) {
            var b = this;
            !e && b._mouseCapture(a.originalEvent.changedTouches[0]) && (e = !0, b._touchMoved = !1, f(a, "mouseover"), f(a, "mousemove"), f(a, "mousedown"))
        }, b._touchMove = function (a) {
            e && (this._touchMoved = !0, f(a, "mousemove"))
        }, b._touchEnd = function (a) {
            e && (f(a, "mouseup"), f(a, "mouseout"), this._touchMoved || f(a, "click"), e = !1)
        }, b._mouseInit = function () {
            var b = this;
            b.element.bind({
                touchstart: a.proxy(b, "_touchStart"),
                touchmove: a.proxy(b, "_touchMove"),
                touchend: a.proxy(b, "_touchEnd")
            }), c.call(b)
        }, b._mouseDestroy = function () {
            var b = this;
            b.element.unbind({
                touchstart: a.proxy(b, "_touchStart"),
                touchmove: a.proxy(b, "_touchMove"),
                touchend: a.proxy(b, "_touchEnd")
            }), d.call(b)
        }
    }
}(jQuery);