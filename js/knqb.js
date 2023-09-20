function newAnswer(type) {
    let answerCounter = jQuery("#answerCounter")
    let counter = parseInt(answerCounter.val())
    if (type == qRADIOBOXTEXT) {
        jQuery("#answers").append("<li id='answerLi" + counter + "' class='answerLi' style='padding: 0.5vw;'><div class='answerContainer' name='answerContainer" + counter + "' id='answerContainer" + counter + "'><i style='margin-right: 1vw' class=\"fa-solid fa-arrows-up-down\"></i><input autocomplete='off' size=\'80\' value=\'\' class='answer' name='answer" + counter + "'><button type=button class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;'  onclick='deleteAnswer(" + counter + ", " + jQuery('#typeSelect').find(":selected").val() + ")'><i class='fa fa-minus-circle' aria-hidden='true'></i></button><input type='radio' class='correct' onclick='uncheckAnswers(" + counter + ")' id='correct" + counter + "' name='correct" + counter + "' value='correct'><label class='correct_label' for='correct" + counter + "'>Correct</label></div></li>");
    } else if (type == qCHECKBOXTEXT) {
        jQuery("#answers").append("<li id='answerLi" + counter + "' class='answerLi' style='padding: 0.5vw;'><div class='answerContainer' name='answerContainer" + counter + "' id='answerContainer" + counter + "'><i style='margin-right: 1vw' class=\"fa-solid fa-arrows-up-down\"></i><input autocomplete='off' size=\'80\' value=\'\' class='answer' name='answer" + counter + "'><button type=button class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;'  onclick='deleteAnswer(" + counter + ", " + jQuery('#typeSelect').find(":selected").val() + ")'><i class='fa fa-minus-circle' aria-hidden='true'></i></button><input type='checkbox' class='correct' onclick='uncheckAnswers(" + counter + ")' id='correct" + counter + "' name='correct" + counter + "' value='correct'><label class='correct_label' for='correct" + counter + "'>Correct</label></div></li>");
    } else if (type == qTRUEFALSE) {
        jQuery("#answers").append("<li id='answerLi" + counter + "' class='answerLi' style='padding: 0.5vw;'><div class='answerContainer' name='answerContainer" + counter + "' id='answerContainer" + counter + "'><i style='margin-right: 1vw' class=\"fa-solid fa-arrows-up-down\"></i><input autocomplete='off' size=\'80\' value=\'\' class='answer' name='answer" + counter + "'><button type=button class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;'  onclick='deleteAnswer(" + counter + ", " + jQuery('#typeSelect').find(":selected").val() + ")'><i class='fa fa-minus-circle' aria-hidden='true'></i></button><input type='checkbox' class='correct' onclick='uncheckAnswers(" + counter + ")' id='correct" + counter + "' name='correct" + counter + "' value='correct'><label class='correct_label' for='correct" + counter + "'>True</label></div></li>");
    } else if (type == qSORTING || type == qCROSSWORDEASY) {
        jQuery("#answers").append("<li id='answerLi" + counter + "' class='answerLi' style='padding: 0.5vw;'><div class='answerContainer' name='answerContainer" + counter + "' id='answerContainer" + counter + "'><i style='margin-right: 1vw' class=\"fa-solid fa-arrows-up-down\"></i><input autocomplete='off' size=\'80\' value=\'\' class='answer' name='answer" + counter + "'><button type=button class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;'  onclick='deleteAnswer(" + counter + ", " + jQuery('#typeSelect').find(":selected").val() + ")'><i class='fa fa-minus-circle' aria-hidden='true'></i></button></div></li>");
    } else if (type == qMATCHING) {
        jQuery('#matching').append('<div style="height: 5vh; display: flex; align-items: center;" class="answerContainer" name="matchingContainer' + counter + '" id="matchingContainer' + counter + '"><i style="margin-right: 1vw" class="fa-solid fa-arrows-up-down"></i><input autocomplete="off" size="50" class="matchingAnswer" name="matchingAnswer' + counter + '" value=""><input autocomplete="off" size="50" class="matchingCorrect" name="matchingCorrect' + counter + '" value=""><button type=button class="button button-secondary" style="background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;" onclick="deleteAnswer(' + counter + ',11)" class="button button-primary"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div>')
    } else if (type == qWORDSEARCH) {
        jQuery('<div id="spaceSearchContainer' + counter + '" class="spaceSearchContainer"><textarea style="font-family: Courier New;" rows="12" cols="12" autocomplete="off" id="spaceSearch' + counter + '" name="spaceSearch' + counter + '" class="spaceSearch"></textarea><br><button type=button class="button button-secondary" style="background-color: #dc3545; border-color: #dc3545; color: white; margin-left: auto; margin-right: auto; display: block" onclick="deleteAnswer(' + counter + ',' + type + ')" class="button button-primary"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div>').insertAfter(jQuery('.spaceSearchContainer').last())
    } else if (type == qCATEGORY) {
        jQuery('#categories').append("<li id='category" + counter + "' class='category'><label for='categoryName" + counter + "'>Category Name:</label><br><input type='text' id='categoryName" + counter + "' name='categoryName" + counter + "' value='Category " + counter + "'><br><label for='category" + counter + "Elements'>Elements belonging to the category:</label><br><input size='80' type='text' id='category" + counter + "Elements' name='category" + counter + "Elements' value='element 1, element 2'><button type=button class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;' onclick='deleteAnswer(" + counter + ", " + type + ")' class='button button-primary'><i class='fa fa-minus-circle' aria-hidden='true'></i></button></li>")
    }
    counter++;
    answerCounter.val(counter);
    return false;
}

// todo: validation for newest types of questions

function deleteAnswer(counter, type) {
    if (type == qRADIOBOXTEXT || type == qCHECKBOXTEXT || type == qSORTING || type == qCROSSWORDEASY) {
        if (confirm(msg_delq)) {
            jQuery("#answerLi" + counter).remove();
        }
    } else if (type == qMATCHING) {
        if (confirm(msg_delq)) {
            jQuery("#matchingContainer" + counter).remove();
        }
    } else if (type == qWORDSEARCH) {
        if (confirm(msg_delq)) {
            jQuery("#spaceSearchContainer" + counter).remove();
        }
    } else if (type == qCATEGORY) {
        if (confirm(msg_delq)) {
            jQuery("#category" + counter).remove();
        }
    }
}

function changeType(checkbox) {
    if (jQuery(checkbox).attr('id') === 'imageAnswers') {
        if (jQuery(checkbox).is(':checked')) {
            jQuery('#textAnswers').prop('checked', false)
        } else {
            jQuery('#textAnswers').prop('checked', true)
        }
    } else if (jQuery(checkbox).attr('id') === 'textAnswers') {
        if (jQuery(checkbox).is(':checked')) {
            jQuery('#imageAnswers').prop('checked', false)
        } else {
            jQuery('#imageAnswers').prop('checked', true)
        }
    }
}

function uncheckAnswers(counter) {
    let currentCheckbox = jQuery("#correct" + counter);
    let type = jQuery("#typeSelect").prop('selectedIndex') + 1
    if (currentCheckbox.is(":checked") && type === 2) {
        jQuery(".correct").each(function () {
            jQuery(this).prop("checked", false)
        })
        currentCheckbox.prop("checked", true)
    }
}

function uncheckImages(counter) {
    let currentCheckbox = jQuery("#correctImage" + counter);
    let type = jQuery("#typeSelect").prop('selectedIndex') + 1
    if (currentCheckbox.is(":checked") && type === 7) {
        jQuery(".correctImage").each(function () {
            jQuery(this).prop("checked", false)
        })
        currentCheckbox.prop("checked", true)
    }
}

function checkQuizFormData() {
    jQuery("#errorMessage").remove()
    if (jQuery("#titleArea").val() === "") {
        jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>Titlu gol</strong></p></div>").insertAfter("#titleArea")
        return false;
    }
    return true;
}

function checkQuestionFormData() {
    jQuery("#errorMessage").remove()
    jQuery("#separator").remove()
    // question not empty
    if (jQuery("#questionArea").val() === "") {
        jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + empty_question + "</strong></p></div>").insertAfter("#questionArea")
        return false;
    }
    if (parseInt(jQuery("#typeSelect").find(":selected").val()) === 1 || parseInt(jQuery("#typeSelect").find(":selected").val()) === 2 || parseInt(jQuery("#typeSelect").find(":selected").val()) === 3 || parseInt(jQuery("#typeSelect").find(":selected").val()) === 12) {
        let answers = jQuery(".answerContainer")
        // at least two answers
        if (answers.length < 2) {
            jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + min_2_answers + "</strong></p></div>").insertAfter("#addNewAnswer")
            return false;
        }
        // no empty answers
        let empty;
        answers.each(function () {
            if (jQuery(this).find('.answer').val() === "") {
                empty = true;
                return false;
            }
        })
        if (empty) {
            jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + empty_answer + "</strong></p></div>").insertAfter("#addNewAnswer")
            return false;
        }
        // type 1 and 2, at least one right answer
        if (parseInt(jQuery("#typeSelect").find(":selected").val()) === 1 || parseInt(jQuery("#typeSelect").find(":selected").val()) === 2) {
            let counter = 0
            let correct = jQuery(".correct")
            correct.each(function () {
                if (jQuery(this).is(":checked")) {
                    check = true;
                    counter++
                }
            })
            if (counter === 0) {
                jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + no_right_answer + "</strong></p></div>").insertAfter("#addNewAnswer")
                return false;
            }
            // type 2, at most one right answer
            if (parseInt(jQuery("#typeSelect").find(":selected").val()) === 2) {
                if (counter > 1) {
                    jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + too_many_right_answers + "</strong></p></div>").insertAfter("#addNewAnswer")
                    return false;
                }
            }
        }
        counter = 1
        // reasign names by ordering of the answers
        answers.each(function () {
            jQuery(this).find('.correct').attr("name", "correct" + counter)
            jQuery(this).find('.answer').attr("name", "answer" + counter)
            counter++
        })
    } else if (parseInt(jQuery("#typeSelect").find(":selected").val()) === 4 || parseInt(jQuery("#typeSelect").find(":selected").val()) === 5) {
        // single answer is not empty
        if (jQuery("#singleAnswer").val() === '') {
            jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + empty_answer + "</strong></p></div>").insertAfter("#singleAnswer")
            return false;
        }
        // type 4 check for [[||]] structure
        if (parseInt(jQuery("#typeSelect").find(":selected").val()) === 4) {
            if (!(count(jQuery("#singleAnswer").val(), '[[') === count(jQuery("#singleAnswer").val(), ']]') && count(jQuery("#singleAnswer").val(), ']]') > 0 && count(jQuery("#singleAnswer").val(), '[[') <= count(jQuery("#singleAnswer").val(), '|'))) {
                jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + incorrect_formating + "</strong></p></div>").insertAfter("#singleAnswer")
                return false
            }
        }
        // type 5 check for at least two [[]] structures
        else if (parseInt(jQuery("#typeSelect").find(":selected").val()) === 5) {
            if (!(count(jQuery("#singleAnswer").val(), '[[') === count(jQuery("#singleAnswer").val(), ']]') && count(jQuery("#singleAnswer").val(), ']]') > 1)) {
                jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + incorrect_formating + "</strong></p></div>").insertAfter("#singleAnswer")
                return false
            }
        }
    } else if (parseInt(jQuery("#typeSelect").find(":selected").val()) === 6 || parseInt(jQuery("#typeSelect").find(":selected").val()) === 7) {
        // image width between 1 and 100
        let imageWidth = jQuery("#imageWidth")
        if (imageWidth.val() - 0 < 1 || imageWidth.val() - 0 > 100) {
            jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + width_limit + "</strong></p></div>").insertAfter("#imageWidthContainer")
            return false;
        }
        // check for at least 2 images
        let answers = jQuery(".imageUrl")
        if (answers.length < 2) {
            jQuery("<div id='separator' style='clear:both'></div><div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + min_2_answers + "</strong></p></div>").insertAfter("#imagesContainer")
            return false;
        }
        // at least 1 right image
        let counter = 0
        let correct = jQuery(".correctImage")
        correct.each(function () {
            if (jQuery(this).is(":checked")) {
                check = true;
                counter++
            }
        })
        if (counter === 0) {
            jQuery("<div id='separator' style='clear:both'></div><div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + no_right_answer + "</strong></p></div>").insertAfter("#imagesContainer")
            return false;
        }
        // type 7, only one right answer
        if (parseInt(jQuery("#typeSelect").find(":selected").val()) === 7) {
            if (counter > 1) {
                jQuery("<div id='separator' style='clear:both'></div><div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + too_many_right_answers + "</strong></p></div>").insertAfter("#imagesContainer")
                return false;
            }
        }
    } else if (parseInt(jQuery("#typeSelect").find(":selected").val()) === 8) {
        // no empty text areas
        let spaceSearches = jQuery(".spaceSearch")
        let empty = false;
        spaceSearches.each(function () {
            if (jQuery(this).val() === '') {
                empty = true;
                return false;
            }
        })
        if (empty) {
            jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + empty_word_search + "</strong></p></div>").insertAfter("#wordSearch")
            return false
        }
        // search words not empty
        if (jQuery("#wordsSearch").val() === '') {
            jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + no_search_words + "</strong></p></div>").insertAfter("#wordSearch")
            return false
        }
        // at least 3 search words
        else if (jQuery('#wordsSearch').val().trim().split(" ").length < 3) {
            jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + min_3_search_words + "</strong></p></div>").insertAfter("#wordSearch")
            return false
        }
    } else if (parseInt(jQuery("#typeSelect").find(":selected").val()) === 11) {
        // column width between 1 and 100
        let columnWidth = jQuery("#answerColumnWidth")
        if (columnWidth.val() - 0 < 1 || columnWidth.val() - 0 > 100) {
            jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + width_limit + "</strong></p></div>").insertAfter("#answerColumnWidthContainer")
            return false;
        }
        let answers = jQuery(".matchingAnswer")
        let rightOnes = jQuery(".matchingCorrect")
        // at least two answers
        if (answers.length < 2) {
            jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + min_2_answers + "</strong></p></div>").insertAfter("#addNewMatchingAnswer")
            return false;
        }
        // no empty answers
        let empty;
        answers.each(function () {
            if (jQuery(this).val() === "") {
                empty = true;
                return false;
            }
        })
        rightOnes.each(function () {
            if (jQuery(this).val() === "") {
                empty = true;
                return false;
            }
        })
        if (empty) {
            jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + empty_answer + "</strong></p></div>").insertAfter("#addNewMatchingAnswerContainer")
            return false;
        }
    } else if (jQuery("#typeSelect").find(":selected").val() === qPUZZLE) {
        // puzzle must have image selected. rows and columns must have valid numbers
        if (jQuery('#puzzleImageUrl').val() === '') {
            jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + no_image_selected + "</strong></p></div>").insertAfter("#puzzleImageUrl")
            return false;
        }
        if (jQuery("#puzzleRows").val() - 0 < 1) {
            jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + invalid_rows + "</strong></p></div>").insertAfter("#puzzleImageUrl")
            return false;
        }
        if (jQuery("#puzzleColumns").val() - 0 < 1) {
            jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + invalid_columns + "</strong></p></div>").insertAfter("#puzzleImageUrl")
            return false;
        }
    } else if (jQuery("#typeSelect").find(":selected").val() === qMATCHIMAGE) {
        // matching images must have at least 2 images selected, with corresponding text. image width must have valid percentage
        if (jQuery('.matchImageUrlContainer').length < 2) {
            jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + min_2_images + "</strong></p></div>").insertAfter("#selectMatchImages")
            return false
        }
        let empty = false;
        jQuery('.imageTitle').each(function () {
            if (jQuery(this).val() === '') {
                empty = true;
                return false;
            }
        })
        if (empty) {
            jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + empty_input + "</strong></p></div>").insertAfter("#selectMatchImages")
            return false
        }
        let imageWidth = jQuery("#matchImageWidth")
        if (imageWidth.val() - 0 < 1 || imageWidth.val() - 0 > 100) {
            jQuery("<div id='errorMessage' class=\"notice notice-error is-dismissible\"><p><strong>" + width_limit + "</strong></p></div>").insertAfter("#matchImageWidth")
            return false;
        }
    }
}

function count(main_str, sub_str) {
    main_str += '';
    sub_str += '';

    if (sub_str.length <= 0) {
        return main_str.length + 1;
    }

    subStr = sub_str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return (main_str.match(new RegExp(subStr, 'gi')) || []).length;
}


function reorderQuestions() {
    let i = 1;
    jQuery('#questions').find('input[type=hidden]').each(function () {
        jQuery(this).attr('name', 'question_id_' + i++);
    })
}


/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function checkPuzzle() {
    let complete = true;
    jQuery('.piece').each(function(index) {
        if (jQuery(this).attr('id').split('_')[1] - 0 !== index) {
            complete = false;
        }
    })
    if (complete) {
        alert("Bravo!")
    }
    else {
        alert('Serios?')
    }
}


function hideAll() {
    jQuery("#crosswordContainer").hide();
    jQuery("#answers").hide()
    jQuery("#singleAnswerContainer").hide();
    jQuery("#instructions4th").hide();
    jQuery("#extraWordsContainer").hide();
    jQuery("#instructions5th").hide();
    jQuery("#addNewAnswerContainer").hide();
    jQuery("#imagesContainer").hide();
    jQuery("#wordSearch").hide();
    jQuery("#matching").hide();
    jQuery("#puzzleImageContainer").hide();
    jQuery("#addNewWordSearchAnswerContainer").hide();
    jQuery("#addNewMatchingAnswerContainer").hide();
    jQuery("#matchImagesContainer").hide();
    jQuery("#categories").hide();
    jQuery("#addNewCategoryContainer").hide();
    jQuery("#pixelatedImageContainer").hide();
}

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


    if (jQuery('#correctColorPicker').length) {
        jQuery('#correctColorPicker').farbtastic('#correctColor');
    }

    if (jQuery('#wrongColorPicker').length) {
        jQuery('#wrongColorPicker').farbtastic('#wrongColor');
    }

    if (jQuery('#neutralColorPicker').length) {
        jQuery('#neutralColorPicker').farbtastic('#neutralColor');
    }

    if (jQuery('#mainColorPicker').length) {
        jQuery('#mainColorPicker').farbtastic('#mainColor');
    }

    jQuery('.chosen-select').chosen()

    let successMessage = jQuery('#successMessage')
    if (successMessage.length) {
        successMessage.fadeOut(1500);
    }
    jQuery("<style>.blue-background-class {background-color: #C8EBFB;}</style>").appendTo("head");

    jQuery('.question_option').each(function () {
        let text = jQuery(this).text()
        if (text.indexOf(' ', 50) !== -1) {
            text = text.substring(0, text.indexOf(' ', 50))
            text += '...'
        }
        jQuery(this).text(text)
    })

    jQuery('.question_text').each(function () {
        let text = jQuery(this).val()
        if (text.indexOf(' ', 50) !== -1) {
            text = text.substring(0, text.indexOf(' ', 50))
            text += '...'
        }
        jQuery(this).val(text)
    })

    let answers;
    answers = jQuery("#answers")
    if (answers.length !== 0) {
        new Sortable(answers[0], {
            animation: 150,
            ghostClass: 'blue-background-class'
        });
    }
    let questions;
    questions = jQuery("#questions")
    if (questions.length !== 0) {
        new Sortable(questions[0], {
            animation: 150,
            ghostClass: 'blue-background-class'
        });
    }
    let matching;
    matching = jQuery("#matching")
    if (matching.length !== 0) {
        new Sortable(matching[0], {
            animation: 150,
            ghostClass: 'blue-background-class'
        });
    }

    jQuery("#remove_image").click(function () {
        let imagePreview = jQuery("#image-preview");
        imagePreview.attr('src', '');
        imagePreview.css('display', 'none');
        jQuery("#imageUrl").val('');
    })

    jQuery("#typeSelect").on("change", function () {
        console.log(this.value);
        if (this.value === qSELECTBOX) {
            hideAll()
            jQuery("#answerCounter").val('1');
            jQuery("#singleAnswerContainer").show();
            jQuery("#instructions4th").show();
        } else if (this.value === qDRAGDROP) {
            hideAll()
            jQuery("#answerCounter").val('1');
            jQuery("#singleAnswerContainer").show();
            jQuery("#instructions5th").show();
            jQuery("#extraWordsContainer").show();
        } else if (this.value === qCHECKBOXTEXT || this.value === qRADIOBOXTEXT || this.value === qTRUEFALSE) {
            if (this.value === qCHECKBOXTEXT) {
                jQuery('.correct').each(function () {
                    this.type = 'checkbox'
                })
                jQuery('.correct_label').each(function () {
                    jQuery(this).text('Correct');
                })
            } else if (this.value === qTRUEFALSE) {
                jQuery('.correct').each(function () {
                    this.type = 'checkbox'
                })
                jQuery('.correct_label').each(function () {
                    jQuery(this).text('True');
                })
            }
            else {
                jQuery('.correct').each(function () {
                    this.type = 'radio'
                })
                jQuery('.correct_label').each(function () {
                    jQuery(this).text('Correct');
                })
            }
            hideAll()
            jQuery("#addNewAnswerContainer").show();
            jQuery("#answerCounter").val(jQuery(".answerContainer").length + 1);
            jQuery("#answers").show();
            jQuery('#addNewAnswer').attr('onclick', 'newAnswer(' + this.value + '); return false');
            jQuery('.correct').each(function () {
                jQuery(this).show()
            })
            jQuery('.correct_label').each(function () {
                jQuery(this).show()
            })
        } else if (this.value === qSORTING) {
            hideAll()
            jQuery('.correct').each(function () {
                jQuery(this).hide()
            })
            jQuery('.correct_label').each(function () {
                jQuery(this).hide()
            })
            jQuery("#addNewAnswerContainer").show();
            jQuery('#addNewAnswer').attr('onclick', 'newAnswer(' + this.value + '); return false');
            jQuery("#answerCounter").val(jQuery(".answerContainer").length + 1);
            jQuery("#answers").show();
        } else if (this.value === qCHECKBOXIMG || this.value === qRADIOBOXIMG) {
            if (this.value === qCHECKBOXIMG) {
                jQuery('.correctImage').each(function () {
                    this.type = 'checkbox'
                })
            }
            else {
                jQuery('.correctImage').each(function () {
                    this.type = 'radio'
                })
            }
            hideAll();
            jQuery("#answerCounter").val(jQuery(".imageUrlContainer").length + 1);
            jQuery("#imagesContainer").show();
        } else if (this.value === qWORDSEARCH) {
            hideAll()
            jQuery("#wordSearch").show();
            jQuery("#addNewWordSearchAnswerContainer").show();
            jQuery("#answerCounter").val(jQuery(".spaceSearch").length + 1);
        } else if (this.value === qMATCHING) {
            hideAll()
            jQuery("#matching").show();
            jQuery("#addNewMatchingAnswerContainer").show();
            jQuery("#answerCounter").val(jQuery(".answer").length + 1);
        } else if (this.value === qPUZZLE) {
            hideAll()
            jQuery("#puzzleImageContainer").show();
            jQuery("#answerCounter").val(1);
        } else if (this.value === qMATCHIMAGE) {
            hideAll()
            jQuery("#answerCounter").val(jQuery(".matchImageUrlContainer").length + 1);
            jQuery("#matchImagesContainer").show();
        } else if (this.value === qCATEGORY) {
            hideAll()
            jQuery("#addNewCategoryContainer").show();
            jQuery("#answerCounter").val(jQuery(".category").length + 1);
            jQuery("#categories").show();
        } else if (this.value === qPIXELATEDIMAGE) {
            hideAll()
            jQuery("#answerCounter").val(1);
            jQuery("#pixelatedImageContainer").show();
        } else if (this.value === qCROSSWORDEASY) {
            hideAll()
            jQuery('.correct').each(function () {
                jQuery(this).hide()
            })
            jQuery('.correct_label').each(function () {
                jQuery(this).hide()
            })
            jQuery("#addNewAnswerContainer").show();
            jQuery('#addNewAnswer').attr('onclick', 'newAnswer(' + this.value + '); return false');
            jQuery("#answerCounter").val(jQuery(".answerContainer").length + 1);
            jQuery("#answers").show();
            jQuery("#crosswordContainer").show();
        }
    })

    var mediaUploader;

    jQuery('#selectImages').on('click', function (e) {
        e.preventDefault();
        if (mediaUploader) {
            mediaUploader.detach();
        }

        mediaUploader = wp.media.frames.fle_frame = wp.media({
            title: 'Select the images',
            multiple: 'add',
            button: {
                text: 'Select the images'
            }
        })


        mediaUploader.on('open', function () {
            let selection = mediaUploader.state().get('selection');
            let images = jQuery('.imageUrl');
            images.each(function () {
                attachment = wp.media.attachment(jQuery(this).attr("data-id"));
                attachment.fetch();
                selection.add(attachment ? [attachment] : []);
            })
        })

        mediaUploader.on('select', function () {
            jQuery('.imageUrlContainer').each(function () {
                let found = false;
                let imageUrl = jQuery(this).find('.imageUrl');
                mediaUploader.state().get('selection').toJSON().forEach(function (val, index) {
                    if (imageUrl.val() === val.url + '[]' + val.id) {
                        found = true;
                        return false;
                    }
                })
                if (!found) {
                    jQuery(this).remove();
                }
            })
            mediaUploader.state().get('selection').toJSON().forEach(function (val, index) {
                let found = false
                jQuery('.imageUrl').each(function () {
                    if (jQuery(this).val() === val.url + '[]' + val.id) {
                        found = true;
                    }
                })
                if (!found) {
                    jQuery("#imagesContainer").append("<div class='imageUrlContainer' style='margin: 0.5vw; float: left; text-align: center'><input style='display: none' data-id='" + val.id + "' class='imageUrl' id='imageUrl" + (index - 0 + 1) + "' name='imageUrl" + (index - 0 + 1) + "' value='" + val.url + "[]" + val.id + "'><img src='" + val.url + "' width='100' height='100' style='max-height: 100px; width: auto;'><br><input type='" + (jQuery('#typeSelect').val()===qCHECKBOXIMG?'checkbox':'radio') + "' onclick='uncheckImages(" + (index - 0 + 1) + ")' class='correctImage' id='correctImage" + (index - 0 + 1) + "' name='correctImage" + (index - 0 + 1) + "' value='correct'><label for='correctImage" + (index - 0 + 1) + "'>Correct</label></div>")
                }
            })
            let counter = 1;
            jQuery('.imageUrlContainer').each(function () {
                jQuery(this).find('.imageUrl').attr('id', 'imageUrl' + counter)
                jQuery(this).find('.imageUrl').attr('name', 'imageUrl' + counter)
                jQuery(this).find('.correctImage').attr('id', 'correctImage' + counter)
                jQuery(this).find('.correctImage').attr('name', 'correctImage' + counter)
                jQuery(this).find('.correctImage').attr('onclick', 'uncheckImages(' + counter + ')')
                counter++;
            })
            jQuery("#answerCounter").val(counter);
        });

        mediaUploader.open();
    });

    jQuery('#selectMatchImages').on('click', function (e) {
        e.preventDefault();
        if (mediaUploader) {
            mediaUploader.detach();
        }

        mediaUploader = wp.media.frames.fle_frame = wp.media({
            title: 'Select the images',
            multiple: 'add',
            button: {
                text: 'Select the images'
            }
        })


        mediaUploader.on('open', function () {
            let selection = mediaUploader.state().get('selection');
            let images = jQuery('.matchImageUrl');
            images.each(function () {
                attachment = wp.media.attachment(jQuery(this).attr("data-id"));
                attachment.fetch();
                selection.add(attachment ? [attachment] : []);
            })
        })

        mediaUploader.on('select', function () {
            jQuery('.matchImageUrlContainer').each(function () {
                let found = false;
                let imageUrl = jQuery(this).find('.matchImageUrl');
                mediaUploader.state().get('selection').toJSON().forEach(function (val, index) {
                    if (imageUrl.val() === val.url + '[]' + val.id) {
                        found = true;
                        return false;
                    }
                })
                if (!found) {
                    jQuery(this).remove();
                }
            })
            mediaUploader.state().get('selection').toJSON().forEach(function (val, index) {
                let found = false
                jQuery('.matchImageUrl').each(function () {
                    if (jQuery(this).val() === val.url + '[]' + val.id) {
                        found = true;
                    }
                })
                if (!found) {
                    jQuery("#matchImages").append("<div class='matchImageUrlContainer' style='margin: 0.5vw; float: left; text-align: center'><input style='display: none' data-id='" + val.id + "' class='matchImageUrl' id='matchImageUrl" + (index - 0 + 1) + "' name='matchImageUrl" + (index - 0 + 1) + "' value='" + val.url + "[]" + val.id + "'><img src='" + val.url + "' width='100' height='100' style='max-height: 100px; width: auto;'><br><input type='text' class='imageTitle' id='imageTitle" + (index - 0 + 1) + "' name='imageTitle" + (index - 0 + 1) + "' value=''></div>")
                }
            })
            let counter = 1;
            jQuery('.matchImageUrlContainer').each(function () {
                jQuery(this).find('.matchImageUrl').attr('id', 'matchImageUrl' + counter)
                jQuery(this).find('.matchImageUrl').attr('name', 'matchImageUrl' + counter)
                jQuery(this).find('.imageTitle').attr('id', 'imageTitle' + counter)
                jQuery(this).find('.imageTitle').attr('name', 'imageTitle' + counter)
                counter++;
            })
            jQuery("#answerCounter").val(counter);
        });

        mediaUploader.open();
    });

    jQuery('#selectImage').on('click', function (e) {
        e.preventDefault();
        if (mediaUploader) {
            mediaUploader.open();
            return;
        }

        mediaUploader = wp.media.frames.fle_frame = wp.media({
            title: 'Select an image',
            button: {
                text: 'Select an image'
            },
            multiple: false
        })

        mediaUploader.on('select', function () {
            let attachment;
            attachment = mediaUploader.state().get('selection').first().toJSON();
            jQuery('#puzzleImageUrl').attr('value', attachment.url);
            // console.log(attachment.url)
            // console.log(jQuery('#puzzleImageUrl')[0])
            let image_preview = jQuery('#puzzleImage');
            image_preview.show()
            image_preview.attr('src', attachment.url).css('width', 'auto');
            // jQuery('#image_attachment_id').val(attachment.id);
        });

        mediaUploader.open();
    });

    jQuery('#selectPixelatedImage').on('click', function (e) {
        e.preventDefault();
        if (mediaUploader) {
            mediaUploader.open();
            return;
        }

        mediaUploader = wp.media.frames.fle_frame = wp.media({
            title: 'Select an image',
            button: {
                text: 'Select an image'
            },
            multiple: false
        })

        mediaUploader.on('select', function () {
            let attachment;
            attachment = mediaUploader.state().get('selection').first().toJSON();
            jQuery('#pixelatedImageUrl').attr('value', attachment.url);
            // console.log(attachment.url)
            // console.log(jQuery('#puzzleImageUrl')[0])
            let image_preview = jQuery('#pixelatedImage');
            image_preview.show()
            image_preview.attr('src', attachment.url).css('width', 'auto');
            // jQuery('#image_attachment_id').val(attachment.id);
        });

        mediaUploader.open();
    });

    jQuery('#upload_image_button').on('click', function (e) {
        e.preventDefault();
        if (mediaUploader) {
            mediaUploader.open();
            return;
        }

        mediaUploader = wp.media.frames.fle_frame = wp.media({
            title: 'Select an image',
            button: {
                text: 'Select an image'
            },
            multiple: false
        })

        mediaUploader.on('select', function () {
            let attachment;
            attachment = mediaUploader.state().get('selection').first().toJSON();
            jQuery('#imageUrl').val(attachment.url);
            let image_preview = jQuery('#image-preview');
            image_preview.show()
            image_preview.attr('src', attachment.url).css('width', 'auto');
            jQuery('#image_attachment_id').val(attachment.id);
        });

        mediaUploader.open();
    });
})


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