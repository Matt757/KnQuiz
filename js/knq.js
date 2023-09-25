jQuery(document).ready(function () {
    qCHECKBOXTEXT = '1';
    qRADIOBOXTEXT = '2';
    qSORTING = '3';
    qSELECTBOX = '4';
    qDRAGDROP = '5';
    qCHECKBOXIMG = '6';
    qRADIOBOXIMG = '7';
    qWORDSEARCH = '8';
    qCROSSWORDEASY = '9';
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
    // rcorecte = 0; // număr de răspunsuri corecte
    // jQuery('#feedback_end_' + quizId).text(''); // textul cu rezultatul după rezolvarea chestionarul
    startOffsetLeft = 0;
    startOffsetTop = 0;
    elemSortable = {};
    elemSortablePieces = {};
    elemSortableAnswers = {};
    elemSortableRightOnes = {};
    // jQuery( document ).tooltip({track: true});
    // TODO: tooltip still appears

    jQuery(document).bind('fscreenchange', function (e, state, elem) {
        let quizId = jQuery('#current_fullscreen').text();
        if (jQuery.fullscreen.isFullScreen()) {
            jQuery('#quiz' + quizId).css("padding", "50px");
            jQuery('#quiz' + quizId).css("background-color", "white");
            if (jQuery.isFunction(jQuery.fn.resizeTableWS)) {
                resizeTableWS();
            }
            //ht=parseInt(jQuery('#tabelcentrat').height(),10);wt=parseInt(jQuery('#tabelcentrat').width(),10);
            //console.log(ht+" "+wt);
            //if(ht>wt) jQuery('#tabelcentrat').height(wt+"px"); else jQuery('#tabelcentrat').width(ht+"px");
            jQuery("#fullscreen-link" + quizId).html("<i class='fa fa-compress'></i>");
            jQuery("#quiz" + quizId).css("overflow", "scroll");
        } else {
            jQuery('#quiz' + quizId).css("padding", "0px");
            jQuery('#quiz' + quizId).css("background-color", "");
            ht = parseInt(jQuery('#tabelcentrat' + quizId).height(), 10);
            wt = parseInt(jQuery('#tabelcentrat' + quizId).width(), 10);
            if (ht > wt) jQuery('#tabelcentrat' + quizId).height(wt + "px"); else jQuery('#tabelcentrat' + quizId).width(ht + "px");
            jQuery("#fullscreen-link" + quizId).html("<i class='fa fa-expand'></i>");
            jQuery("#quiz" + quizId).css("overflow", "show");
            scrollToAnchor('knq_question' + quizId);
        }
    });

    jQuery('.quiz').each(function() {
        let quizId = jQuery(this).attr('data-quiz-id')
        loadQuestion(quizId);
        funcFullScreen(quizId);
        jQuery('#redoQuiz' + quizId).click(function () {
            jQuery('#right_answers_' + quizId).text("");
            jQuery('#feedback_end_' + quizId).text("");
            startOffsetLeft = 0
            startOffsetTop = 0
            jQuery('#crti' + quizId).text(1);
            jQuery(this).hide();
            jQuery("#knq_feedback" + quizId).hide();
            jQuery("#score" + quizId).text("Current score: 0");
            jQuery("#knq_main_button" + quizId).val(msg_done);
            jQuery("#knq_main_button" + quizId).show();
            jQuery("#knqList" + quizId).hide();
            jQuery("#points" + quizId).text(0);
            jQuery("#knq_answer" + quizId).hide();
            loadQuestion(quizId);
        })
    })

    Mousetrap.bind('f', function () {
        jQuery("#fullscreen-link").trigger('click');
    });
    Mousetrap.bind('enter', function () {
        jQuery("#knq_main_button").trigger('click');
    });
})

jQuery(window).resize(function () {
    let quizId = jQuery('#current_fullscreen').text();
    if (jQuery('#current_fullscreen').text() === '') {
        jQuery('.knq_puzzle').each(function () {
            console.log(jQuery(this).attr('id').split('_')[2])
            resizePuzzle(2, jQuery(this).attr('id').split('_')[2])
        })
    }
    else {
        resizePuzzle(2, quizId)
    }
})

// TODO: show feedback only at the end option


/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadQuestion(quizId) {
    var ajax_url = knq_object.ajax_url;
    var data = {
        'action': 'detaliiIntrebare',
        'iduri': jQuery('#iduri' + quizId).text(),
        'crti': jQuery('#crti' + quizId).text()
    };
    jQuery.ajax({
        url: ajax_url,
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (response) {
            let knq_question = jQuery("#knq_question" + quizId)
            let questionContainer = jQuery("#questionContainer" + quizId)
            let tip = response[0].type;
            crti = jQuery('#crti' + quizId).text()
            jQuery('#type' + quizId).text(tip);
            if (knq_question.length === 0) {
                // sunt la prima întrebare, deci creez scheletul pentru prima întrebare (schelet și pentru următoarele)
                questionContainer.append("<h3 id='knq_question" + quizId + "' class='knq_question' name='knq_question" + quizId + "'></h3>")
                questionContainer.append("<p id='type" + quizId + "' style='display: none'>" + tip + "</p>")
                questionContainer.append("<div style='display: none' class='loader' id='loader_" + quizId + "'></div>")
                questionContainer.append('<div class="knq_container"><ul class="knq_list" id="knqList' + quizId + '"></ul><div id="knqImages' + quizId + '"></div><div id="knq_answer' + quizId + '" class="knq_answer"></div><div style="clear:both"></div><div id="knq_feedback' + quizId + '" class="knq_feedback"></div><p center><input id="knq_main_button' + quizId + '" class="knq_main_button" type=button value="' + msg_done + '"!></p>');
                jQuery('.knq_feedback').css('background-color', color_hover);
                jQuery("#knqList" + quizId).hide();
                jQuery("#knqImages" + quizId).hide();
                jQuery("#knq_answer" + quizId).hide();
                jQuery("#knq_feedback" + quizId).hide();
                jQuery("#knq_main_button" + quizId).on('click', function () {
                    funcClickAmRaspuns(quizId);
                });
                knq_question = jQuery("#knq_question" + quizId)
            }
            //afișăm mai întâi întrebarea
            iduri = jQuery('#iduri' + quizId).text();
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
                buildAnswerCheckRadioSortTrueFalse(answers, tip, quizId);
            } else if (tip === qSELECTBOX) {
                buildAnswerSelectBox(answers, quizId);
            } else if (tip === qDRAGDROP) {
                buildAnswerDragDrop(answers, quizId);
            } else if (tip === qCHECKBOXIMG || tip === qRADIOBOXIMG) {
                buildAnswerCheckRadioImage(answers, tip, quizId);
            } else if (tip === qWORDSEARCH) {
                buildWordSearch(answers, quizId);
            } else if (tip === qCROSSWORD) {
                buildCrossWord(answers, quizId);
            } else if (tip === qCROSSWORDEASY) {
                buildCrossWordEasy(answers, rightOnes, quizId);
            } else if (tip === qMATCHING) {
                buildMatching(answers, rightOnes, response[0].question.includes("***"), quizId);
            } else if (tip === qPUZZLE) {
                buildPuzzle(answers, quizId);
            } else if (tip === qMATCHIMAGE) {
                buildMatchImage(answers, quizId);
            } else if (tip === qCATEGORY) {
                buildCategories(answers, quizId);
            } else if (tip === qPIXELATEDIMAGE) {
                buildPixelatedImage(answers, quizId);
            }
            if ((tip === qSORTING || (jQuery("#shuffleAnswers" + quizId).text() === '1' && (tip === qCHECKBOXTEXT || tip === qRADIOBOXTEXT || tip === qCHECKBOXIMG || tip === qRADIOBOXIMG))) && !response[0].question.includes("***")) {
                // dacă e un tip cu mai multe răspunsuri, are logică să fie amestecate, dacă s-a optat pentru așa ceva
                var ul = jQuery("#knqList" + quizId)[0];
                for (var i = ul.children.length; i >= 0; i--) {
                    ul.appendChild(ul.children[Math.random() * i | 0]);
                }
            }
            jQuery('#loader_' + quizId).hide();
            if (tip === qCHECKBOXTEXT || tip === qRADIOBOXTEXT || tip === qSORTING || tip === qCHECKBOXIMG || tip === qRADIOBOXIMG || tip === qTRUEFALSE || tip === qMATCHIMAGE) {
                jQuery("#knqList" + quizId).show()
            } else if (tip === qSELECTBOX || tip === qDRAGDROP || tip === qWORDSEARCH || tip === qCROSSWORD || tip === qMATCHING || tip === qPUZZLE || tip === qCATEGORY || tip === qPIXELATEDIMAGE || tip === qCROSSWORDEASY) {
                jQuery("#knq_answer" + quizId).show();
            }

            jQuery(".knq_unselected").bind("click", function () {
                //aici definesc comportamentul la click pe unul dintre răspunsurile multiple disponibile
                funcClickSelected(jQuery(this), quizId);
            });

            jQuery(".knq_image_unselected").bind("click", function () {
                //aici definesc comportamentul la click pe unul dintre răspunsurile multiple disponibile
                funcClickImage(jQuery(this), quizId);
            });

            if (tip === qSORTING) {
                //definesc comportamentul de sortare
                elemSortable[quizId] = new Sortable(jQuery("#knqList" + quizId)[0], {
                    animation: 150,
                    ghostClass: 'blue-background-class'
                });
                jQuery("#knqList" + quizId).addClass("ui-sortable")
            }
            jQuery("#knq_main_button" + quizId).val(msg_done);
            if (crti != 1) {
                //la prima întrebare nu fac salt, căci altfel în pagină sare direct la quiz
                scrollToAnchor('knq_question' + quizId);
            }
        }
    })
}


function funcClickSelected(obiect, quizId) {
    //aici definesc comportamentul la click pe unul dintre răspunsurile multiple disponibile
    if (jQuery("#type" + quizId).text() === qCHECKBOXTEXT || jQuery("#type" + quizId).text() === qCHECKBOXIMG) {
        if (obiect.children("i").attr("class") == "fa fa-square-o") {
            obiect.children("i").attr("class", "fa fa-check-square-o");
            obiect.removeClass("knq_unselected");
            obiect.addClass("knq_selected");
        } else {
            obiect.children("i").attr("class", "fa fa-square-o");
            obiect.removeClass("knq_selected");
            obiect.addClass("knq_unselected");
        }
    } else if (jQuery("#type" + quizId).text() === qRADIOBOXTEXT || jQuery("#type" + quizId).text() === qRADIOBOXIMG) {
        jQuery("#knqList" + quizId).children().each(function () {
            jQuery(this).children("i").attr("class", "fa fa-circle-o");
            jQuery(this).removeClass("knq_selected");
            jQuery(this).addClass("knq_unselected");
        });
        obiect.children("i").attr("class", "fa-regular fa-circle-check");
        obiect.removeClass("knq_unselected");
        obiect.addClass("knq_selected");
    }
}


function funcClickImage(obiect, quizId) {
    //aici definesc comportamentul la click pe imaginile multiple disponibile
    if (jQuery("#type" + quizId).text() === qCHECKBOXIMG) {
        if (obiect.children("i").attr("class") == "fa fa-square-o") {
            obiect.children("i").attr("class", "fa fa-check-square-o");
            obiect.removeClass('knq_image_unselected')
            obiect.addClass('knq_image_selected')
        } else {
            obiect.children("i").attr("class", "fa fa-square-o");
            obiect.removeClass('knq_image_unselected')
            obiect.addClass('knq_image_selected')
        }
    } else if (jQuery("#type" + quizId).text() === qRADIOBOXIMG) {
        jQuery("#knqImages" + quizId).children().each(function () {
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

function funcClickAmRaspuns(quizId) {
    var ajax_url = knq_object.ajax_url;
    if (jQuery("#knq_main_button" + quizId).val() == msg_finish) {
        jQuery('#loader_' + quizId).show();
        //s-au terminat întrebările, evaluez notă
        cate = jQuery('#iduri' + quizId).text().split("|").length;
        jQuery('#feedback_end_' + quizId).text("<br>" + jQuery('#feedback_end_' + quizId).text());
        let score = jQuery("#score" + quizId)
        if (jQuery("#quizCompletion" + quizId).attr('completed_before') === '0') {
            jQuery("#quizCompletion" + quizId).html('<span id="score">' + score.text() + '</span>' + '. Nota anterioară: ' + parseFloat(score.text().split(": ")[1]) + ' obținută acum.')
        }
        jQuery("#knq_question" + quizId).html("Rezultatele finale:");
        var data = {
            'action': 'updateScore',
            'score': parseFloat(score.text().split(": ")[1]),
            'quizId': jQuery("#quiz" + quizId).attr('data-quiz-id')
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
                if (jQuery('#right_answers_' + quizId).text() === '0' && highscore) {
                    jQuery("#quizCompletion" + quizId).html('<span id="score">' + score.text() + '</span>' + '. ' + text_previous_score + ': ' + parseFloat(score.text().split(": ")[1]) + ' ' + text_obtained_now + '.')
                    jQuery("#knq_feedback" + quizId).html("<strong>" + text_all_wrong + "</strong>" + jQuery('#feedback_end_' + quizId).text() + "\n<b>" + text_final_score + ": " + parseFloat(score.text().split(": ")[1]) + "." + (firstTime ? "" : " " + text_new_highscore) + "</b>");
                } else if (jQuery('#right_answers_' + quizId).text() === '0') {
                    jQuery("#knq_feedback" + quizId).html("<strong>" + text_all_wrong + "</strong>" + jQuery('#feedback_end_' + quizId).text() + "\n" + text_final_score + ": " + parseFloat(score.text().split(": ")[1]) + ".");
                } else if (jQuery('#right_answers_' + quizId).text() - 0 === cate && highscore) {
                    jQuery("#quizCompletion" + quizId).html('<span id="score">' + score.text() + '</span>' + '. ' + text_previous_score + ': ' + parseFloat(score.text().split(": ")[1]) + ' ' + text_obtained_now + '.')
                    jQuery("#knq_feedback" + quizId).html("<strong>" + text_all_correct + "</strong>" + jQuery('#feedback_end_' + quizId).text() + "\n<b>" + text_final_score + ": " + parseFloat(score.text().split(": ")[1]) + "." + (firstTime ? "" : " " + text_new_highscore) + "</b>");
                } else if (jQuery('#right_answers_' + quizId).text() - 0 === cate)
                    jQuery("#knq_feedback" + quizId).html("<strong>" + text_all_correct + "</strong>" + jQuery('#feedback_end_' + quizId).text() + "\n<b>" + text_final_score + ": " + parseFloat(score.text().split(": ")[1]) + ".</b>");
                else if (highscore) {
                    jQuery("#quizCompletion" + quizId).html('<span id="score">' + score.text() + '</span>' + '. ' + text_previous_score + ': ' + parseFloat(score.text().split(": ")[1]) + ' ' + text_obtained_now + '.')
                    jQuery("#knq_feedback" + quizId).html("<strong>" + text_partial_correct + " " + jQuery('#right_answers_' + quizId).text() + " " + text_partial_out_of + " " + cate + ".</strong>" + jQuery('#feedback_end_' + quizId).text() + "\n<b>" + text_final_score + ": " + parseFloat(score.text().split(": ")[1]) + "." + (firstTime ? "" : " " + text_new_highscore) + "</b>");
                } else {
                    jQuery("#knq_feedback" + quizId).html("<strong>" + text_partial_correct + " " + jQuery('#right_answers_' + quizId).text() + " " + text_partial_out_of + " " + cate + ".</strong>" + jQuery('#feedback_end_' + quizId).text() + "\n<b>" + text_final_score + ": " + parseFloat(score.text().split(": ")[1]) + ".</b>");
                }

                jQuery("#knqList" + quizId).empty();
                jQuery("#knq_answer" + quizId).empty();
                jQuery("#knq_main_button" + quizId).hide();
                jQuery("#redoQuiz" + quizId).show()
                jQuery('#loader_' + quizId).hide();
            },
            error: function (response) {
                console.log(response)
            }
        })
    } else if (jQuery("#knq_main_button" + quizId).val() == msg_done) {
        //a răspuns la întrebarea curentă, trecem mai departe
        let corecte = [];
        jQuery("#knqList" + quizId).children().each(function () {
            if (jQuery(this).hasClass("knq_selected")) {
                corecte.push(jQuery(this).attr("id").split('_')[0]);
            }
        });
        evalAnswers(corecte, quizId);
    } else {
        // move to the next question
        jQuery('#crti' + quizId).text(jQuery('#crti' + quizId).text() - 0 + 1);
        evalAnswers("", quizId);
    }
}


function evalAnswers(corecteUser, quizId) {
    //evaluează corectitudinea răspunsurilor
    var ajax_url = knq_object.ajax_url;
    var data = {
        'action': 'detaliiIntrebare',
        'iduri': jQuery('#iduri' + quizId).text(),
        'crti': jQuery('#crti' + quizId).text()
    };
    jQuery.ajax({
        url: ajax_url,
        type: 'post',
        data: data,
        dataType: 'json',
        beforeSend: function () {
            jQuery("#knq_main_button" + quizId).prop('disabled', true);
        },
        success: function (response) {
            crti = jQuery('#crti' + quizId).text();
            if (response.length > 0) {
                let score = jQuery("#score" + quizId)
                let points = jQuery("#points" + quizId)
                if (jQuery("#knq_main_button" + quizId).val() === msg_done) {
                    //este răspunsul la o întrebare
                    jQuery('#quiz' + quizId).find('.knq_unselected').each(function () {
                        jQuery(this).css('background-color', color_neutral)
                        jQuery(this).unbind("mouseenter");
                        jQuery(this).unbind("mouseleave");
                    })
                    jQuery('#quiz' + quizId).find('.knq_selected').each(function () {
                        jQuery(this).unbind("mouseenter");
                        jQuery(this).unbind("mouseleave");
                    })
                    jQuery('#quiz' + quizId).find('.knq_matching_answer').each(function () {
                        jQuery(this).unbind("mouseenter");
                        jQuery(this).unbind("mouseleave");
                    })
                    jQuery('#quiz' + quizId).find('.knq_right_one').each(function () {
                        jQuery(this).unbind("mouseenter");
                        jQuery(this).unbind("mouseleave");
                    })
                    if (jQuery("#type" + quizId).text() === qCHECKBOXTEXT || jQuery('#type' + quizId).text() === qCHECKBOXIMG) {
                        // Handle first, second, sixth and seventh types of questions
                        let answersList = jQuery('#quiz' + quizId).find(".knq_unselected");
                        answersList.each(function (index) {
                            jQuery(this).unbind('click');
                        })
                        jQuery('#quiz' + quizId).find(".knq_selected").each(function (index) {
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
                            jQuery("#knq_feedback" + quizId).html(msg_correct + fd).show();
                            jQuery('#right_answers_' + quizId).text(jQuery('#right_answers_' + quizId).text() - 0 + 1);
                            jQuery('#feedback_end_' + quizId).text(jQuery('#feedback_end_' + quizId).text() + crti + ". <i class='fa fa-check' aria-hidden='true'></i>&nbsp;" + response[0].question.replace(/(?:\r\n|\r|\n)/g, '<br>').replace('***', '') + "<br>");
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
                            jQuery("#knq_feedback" + quizId).html(msg_wrong + (fdn == "" ? fd : fdn)).show();
                            jQuery('#feedback_end_' + quizId).text(jQuery('#feedback_end_' + quizId).text() + crti + ". <i class='fa fa-xmark' aria-hidden='true'></i>&nbsp;" + response[0].question.replace(/(?:\r\n|\r|\n)/g, '<br>').replace('***', '') + "<br>");
                        }
                        jQuery("#knqList" + quizId).children().each(function () {
                            if ((corecte.indexOf(jQuery(this).attr("id").split('_')[0]) === -1) && (jQuery(this).hasClass("knq_selected"))) {
                                jQuery(this).css("background-color", color_nok);
                            }
                            if (corecte.indexOf(jQuery(this).attr("id").split('_')[0]) !== -1) {
                                jQuery(this).css("background-color", color_ok);
                            }

                        });
                        nextOrFinish(quizId)
                    } else if (jQuery("#type" + quizId).text() === qTRUEFALSE) {
                        let answersList = jQuery('#quiz' + quizId).find(".knq_unselected");
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
                                if (!corecte.includes(jQuery(this).find('.falseRadio').attr('name').split('_')[2])) {
                                    correctAnswersCounter++;
                                }
                            }
                        })
                        computeScore(correctAnswersCounter, answersList.length, response, quizId)
                        answersList.each(function () {
                            if ((corecte.indexOf(jQuery(this).find('.falseRadio').attr('name').split('_')[2]) === -1) && jQuery(this).find('.falseRadio').is(':checked')) {
                                jQuery(this).css("background-color", color_ok);
                            } else if ((corecte.indexOf(jQuery(this).find('.trueRadio').attr('name').split('_')[2]) !== -1) && jQuery(this).find('.trueRadio').is(':checked')) {
                                jQuery(this).css("background-color", color_ok);
                            } else {
                                jQuery(this).css("background-color", color_nok);
                            }
                        });
                        nextOrFinish(quizId)
                    } else if (jQuery("#type" + quizId).text() === qRADIOBOXTEXT || jQuery('#type' + quizId).text() === qRADIOBOXIMG) {
                        // Handle first, second, sixth and seventh types of questions
                        let answersList = jQuery('#quiz' + quizId).find(".knq_selected");
                        jQuery('#quiz' + quizId).find(".knq_unselected").each(function (index) {
                            jQuery(this).unbind('click');
                        })
                        answersList.each(function (index) {
                            jQuery(this).unbind('click');
                        })
                        ro = response[0].right_one;
                        corecte = ro.split("|");
                        let correctAnswersCounter = 0;
                        answersList.each(function () {
                            if (corecte.includes(jQuery(this).attr('id').split('_')[0])) {
                                correctAnswersCounter++;
                            }
                        })
                        computeScore(correctAnswersCounter, corecte.length, response, quizId)
                        jQuery("#knqList" + quizId).children().each(function () {
                            if ((corecte.indexOf(jQuery(this).attr("id").split('_')[0]) === -1) && (jQuery(this).hasClass("knq_selected")))
                                jQuery(this).css("background-color", color_nok);
                            if (corecte.indexOf(jQuery(this).attr("id").split('_')[0]) !== -1)
                                jQuery(this).css("background-color", color_ok);
                        });
                        nextOrFinish(quizId)
                    } else if (jQuery("#type" + quizId).text() === qSORTING) {
                        // Handle the third type of question
                        elemSortable[quizId].destroy();
                        jQuery('#knqList' + quizId).removeClass("ui-sortable");
                        let correctAnswersCounter = 0;
                        let answersList = jQuery('#quiz' + quizId).find(".knq_unselected");
                        var previous = null;
                        answersList.each(function (index) {
                            jQuery(this).find('p').text(jQuery(this).text() + " (" + jQuery(this).attr('id').split('_')[0] + ")")
                            if (index === 0) {
                                if (String(parseInt(jQuery(this).attr('id').split('_')[0]) + 1) === answersList.eq(index + 1).attr('id').split('_')[0] || (parseInt(jQuery(this).attr('id').split('_')[0])) === index + 1) {
                                    jQuery(this).css("background-color", color_ok);
                                    correctAnswersCounter++;
                                } else {
                                    jQuery(this).css("background-color", color_nok);
                                }
                            } else if (index === answersList.length - 1) {
                                if (String(jQuery(this).attr('id').split('_')[0] - 1) === answersList.eq(index - 1).attr('id').split('_')[0] || (parseInt(jQuery(this).attr('id').split('_')[0])) === index + 1) {
                                    jQuery(this).css("background-color", color_ok);
                                    correctAnswersCounter++;
                                } else {
                                    jQuery(this).css("background-color", color_nok);
                                }
                            } else if (String(index + 1) === jQuery(this).attr('id').split('_')[0] || String(jQuery(this).attr('id').split('_')[0] - 1) === answersList.eq(index - 1).attr('id').split('_')[0] || String(parseInt(jQuery(this).attr('id').split('_')[0]) + 1) === answersList.eq(index + 1).attr('id').split('_')[0]) {
                                jQuery(this).css("background-color", color_ok);
                                correctAnswersCounter++;
                            } else {
                                jQuery(this).css("background-color", color_nok);
                            }
                            previous = this;
                        })
                        computeScore(correctAnswersCounter, answersList.length, response, quizId)
                        nextOrFinish(quizId)
                    } else if (jQuery("#type" + quizId).text() === qSELECTBOX) {
                        // Handle the fourth type of question
                        let correctAnswersCounter = 0;
                        let answersList = jQuery('#quiz' + quizId).find(".knq-answer-select");
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
                        computeScore(correctAnswersCounter, answersList.length, response, quizId)
                        nextOrFinish(quizId)
                    } else if (jQuery("#type" + quizId).text() === qDRAGDROP || jQuery("#type" + quizId).text() === qMATCHIMAGE) {
                        // Handle the fifth type of question
                        let correctAnswersCounter = 0;
                        let answersList = jQuery('#quiz' + quizId).find(".droppable");
                        let draggableList = jQuery('#quiz' + quizId).find(".draggable");
                        let droppedElements = 0;
                        answersList.each(function () {
                            if (jQuery(this).attr('data-dropped-element') !== '0') {
                                droppedElements++;
                            }
                            let droppedElement = jQuery("#draggableAnswer-" + jQuery(this).attr('data-dropped-element'))
                            // console.log(droppedElement[0]);
                            // console.log("#draggableAnswer-" + jQuery(this).attr('data-dropped-element') + '_' + quizId);
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
                            jQuery('#answerBlocks_' + quizId).css('height', 0)
                        }
                        computeScore(correctAnswersCounter, answersList.length, response, quizId)
                        nextOrFinish(quizId)
                    } else if (jQuery('#type' + quizId).text() === qWORDSEARCH) {
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
                        computeScore(correctAnswersCounter, answersList.length, response, quizId)
                        nextOrFinish(quizId)
                    } else if (jQuery('#type' + quizId).text() === qMATCHING) {
                        // handle the eleventh type of question
                        //TODO: separate results with questions for each quiz
                        let answersList = jQuery('#quiz' + quizId).find('.knq_matching_answer')
                        let rightOnes = jQuery('#quiz' + quizId).find('.knq_right_one')
                        destroySortable(quizId)
                        let correctAnswersCounter = 0;
                        for (i = 1; i <= answersList.length; i++) {
                            if (jQuery(answersList[i - 1]).attr('id').split('_').at(-1) === jQuery(rightOnes[i - 1]).attr('id').split('_').at(-1)) {
                                correctAnswersCounter++
                                jQuery(answersList[i - 1]).css("background-color", color_ok);
                                jQuery(rightOnes[i - 1]).css("background-color", color_ok);
                            } else {
                                jQuery(answersList[i - 1]).css("background-color", color_nok);
                                jQuery(rightOnes[i - 1]).css("background-color", color_nok);
                            }
                        }
                        computeScore(correctAnswersCounter, answersList.length, response, quizId)
                        nextOrFinish(quizId)
                    } else if (jQuery('#type' + quizId).text() === qPUZZLE) {
                        let correctAnswersCounter = 0;
                        destroySortable(quizId)
                        jQuery('#quiz' + quizId).find('.piece_' + quizId).each(function (index) {
                            jQuery(this).css('margin', '0')
                            resizePuzzle(0, quizId)
                            if (jQuery(this).attr('id').split('_')[1] - 0 !== index) {
                                jQuery(this).css('opacity', '0.5');
                            } else {
                                correctAnswersCounter++;
                            }
                        })
                        computeScore(correctAnswersCounter, jQuery('#quiz' + quizId).find('.piece_' + quizId).toArray().length, response, quizId)
                        nextOrFinish(quizId)
                    } else if (jQuery('#type' + quizId).text() === qCATEGORY) {
                        let correctAnswersCounter = 0;
                        let draggableList = jQuery('#quiz' + quizId).find(".draggable");
                        draggableList.each(function () {
                            jQuery(this).draggable('destroy');
                            if (jQuery(this).attr('data-dropped') === jQuery(this).attr('data-category')) {
                                correctAnswersCounter++;
                                jQuery(this).css('background', color_ok)
                                jQuery(this).css('border', '2px solid ' + newShade(color_ok, -70))
                            } else {
                                jQuery(this).css('background', color_nok)
                                jQuery(this).css('border', '2px solid ' + newShade(color_nok, -70))
                            }
                        })
                        computeScore(correctAnswersCounter, draggableList.length, response, quizId)
                        nextOrFinish(quizId)
                    } else if (jQuery('#type' + quizId).text() === qPIXELATEDIMAGE) {
                        // TODO: check if loader is used when finishing the quiz
                        timeoutArray.forEach(function (timeout) {
                            clearTimeout(timeout);
                        })
                        jQuery("#knq_answer" + quizId).css('height', 'fit-content');
                        jQuery('#knq_answer' + quizId).find('canvas').each(function () {
                            jQuery(this).remove();
                        })
                        jQuery('#pixelate_' + quizId).show();
                        if (jQuery("#imageAnswer_" + quizId).val() === response[0].right_one) {
                            computeScore(11 - parseInt(jQuery('#pixelate_' + quizId).attr('data-attempt')), 10, response, quizId)
                            jQuery("#imageAnswer_" + quizId).css('background', color_ok + "!important")
                        } else {
                            computeScore(0, 10, response, quizId)
                            jQuery("#imageAnswer_" + quizId).css('background', color_nok + "!important")
                        }
                        nextOrFinish(quizId)
                    } else if (jQuery('#type' + quizId).text() === qCROSSWORDEASY) {
                        let ro = response[0].right_one;
                        let corecte = ro.split('|');
                        corecte = corecte[0].split('\n');
                        for (let i = 0; i < corecte.length; i++) {
                            if (i !== corecte.length - 1) {
                                corecte[i] = corecte[i].slice(0, -1)
                            }
                        }
                        let index = 0;
                        let correctAnswersCounter = 0;
                        jQuery('#knq_answer' + quizId).find('tr.crosswordRow').each(function () {
                            let answerBuilder = '';
                            jQuery(this).find('input').each(function () {
                                answerBuilder += jQuery(this).val();
                            })
                            if (answerBuilder === corecte[index].replace(/ /g, '').toUpperCase()) {
                                correctAnswersCounter++;
                                jQuery(this).find('input').each(function () {
                                    jQuery(this).css('background-color', color_ok)
                                    jQuery(this).attr('disabled', 'disabled')
                                })
                            } else {
                                jQuery(this).find('input').each(function () {
                                    jQuery(this).css('background-color', color_nok)
                                    jQuery(this).attr('disabled', 'disabled')
                                })
                            }
                            index++;
                        })
                        computeScore(correctAnswersCounter, index, response, quizId)
                        nextOrFinish(quizId)
                    }
                } else {
                    // s-a apasat butonul trec mai departe
                    jQuery("#knq_feedback" + quizId).hide();
                    jQuery("#knq_answer" + quizId).empty();
                    jQuery("#knqList" + quizId).empty();
                    jQuery('#loader_' + quizId).show();
                    loadQuestion(quizId)
                }
            } else {
                jQuery("#").html("Ceva nu a mers bine. Ne pare rău!");
            }
            jQuery("#knq_main_button" + quizId).prop('disabled', false);
        }
    });

}


function nextOrFinish(quizId) {
    if (crti == jQuery("#iduri" + quizId).text().split("|").length) {
        jQuery("#knq_main_button" + quizId).val(msg_finish).blur();
    } else {
        jQuery("#knq_main_button" + quizId).val(msg_next).blur();
    }
}


function computeScore(correctAnswersCounter, answersListLength, response, quizId) {
    fd = ((response[0].feedbackp !== null) && (response[0].feedbackp + "").length > 0 ? "<br>" + response[0].feedbackp.replace(/(?:\r\n|\r|\n)/g, '<br>') : "");
    fdn = ((response[0].feedbackn != null) && (response[0].feedbackn + "").length > 0 ? "<br>" + response[0].feedbackn.replace(/(?:\r\n|\r|\n)/g, '<br>') : "");
    let points = jQuery("#points" + quizId)
    let score = jQuery("#score" + quizId)
    if (correctAnswersCounter === answersListLength) {
        // correct answers
        points.text(points.text() - 0 + 10)
        partialScore = ((points.text() - 0) / crti).toFixed(2)
        if (partialScore % 1 === 0) {
            partialScore = Math.trunc(partialScore)
        }
        partialScore = parseFloat(partialScore)
        score.text(score.text().split(": ")[0] + ": " + partialScore)
        jQuery("#knq_feedback" + quizId).html(msg_correct + fd).show();
        jQuery('#right_answers_' + quizId).text(jQuery('#right_answers_' + quizId).text() - 0 + 1);

        jQuery('#feedback_end_' + quizId).text(jQuery('#feedback_end_' + quizId).text() + crti + ". <i class='fa fa-check' aria-hidden='true'></i>&nbsp;" + response[0].question.replace(/(?:\r\n|\r|\n)/g, '<br>').replace('***', '') + "<br>");
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
        jQuery("#knq_feedback" + quizId).html(msg_wrong + (fdn == "" ? fd : fdn)).show();
        jQuery('#feedback_end_' + quizId).text(jQuery('#feedback_end_' + quizId).text() + crti + ". <i class='fa fa-xmark' aria-hidden='true'></i>&nbsp;" + response[0].question.replace(/(?:\r\n|\r|\n)/g, '<br>').replace('***', '') + "<br>");
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