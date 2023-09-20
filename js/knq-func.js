//=========================BEGIN - FUNCTII BUILD ANSWERS==================================

function newShade(hexColor, magnitude) {
    hexColor = hexColor.replace(`#`, ``);
    if (hexColor.length === 6) {
        const decimalColor = parseInt(hexColor, 16);
        let r = (decimalColor >> 16) + magnitude;
        r > 255 && (r = 255);
        r < 0 && (r = 0);
        let g = (decimalColor & 0x0000ff) + magnitude;
        g > 255 && (g = 255);
        g < 0 && (g = 0);
        let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
        b > 255 && (b = 255);
        b < 0 && (b = 0);
        return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    } else {
        return hexColor;
    }
}


function buildAnswerSelectBox(answers) {
    let answer = answers.split(/\[\[|]]/);
    answer[0] = answer[0].replace(/(?:\r\n|\r|\n)/g, '<br>')
    let extra = 0;
    if (answer[0] === '[') {
        extra = 1;
    }
    let htmlBuilder = "";
    for (let j = 0; j < answer.length; j++) {
        if (!((j + extra) % 2)) {
            htmlBuilder += answer[j];
        } else {
            let options = answer[j].split("|");
            let optionsBuilder = [];
            htmlBuilder += "<select class='knq-answer-select' id='answerSelect" + j + "'><option style='text-align-last: center; text-align: center; -ms-text-align-last: center; -moz-text-align-last: center;' value='0'>" + choose_answer_msg + "</option>"
            options.forEach((element, index) => {
                optionsBuilder.push("<option value='" + parseInt(index + 1) + "'>" + element + "</option>")
            })
            shuffle(optionsBuilder);
            htmlBuilder += optionsBuilder.join('')
            htmlBuilder += "<select>"
        }
    }
    jQuery("#knq_answer").append("<div id='1'><p style='user-select: none'>" + htmlBuilder + "</p></div>");
}

function buildAnswerDragDrop(answers) {
    answers = answers.split('|')
    let extraWords
    if (answers.length > 1) {
        extraWords = answers[1].split(" ")
    } else {
        extraWords = ['']
    }
    let answer = answers[0].split(/\[\[|]]/);
    answer[0] = answer[0].replace(/(?:\r\n|\r|\n)/g, '<br>')
    let extra = 0;
    if (answer[0] === '[') {
        extra = 1
    }
    let htmlBuilder = "<div id='sentence' style='display:block'>"
    let answersBuilder = []
    let j
    for (j = 0; j < answer.length; j++) {
        if (!((j + extra) % 2)) {
            htmlBuilder += answer[j];
        } else {
            htmlBuilder += "<div class='droppable' data-correct='0' data-dropped-element='0' id='droppableAnswer-" + j + "'></div>"
            answersBuilder.push("<div class='draggable' id='draggableAnswer-" + j + "'>" + answer[j] + "</div>")
        }
    }
    if (extraWords[0] !== '') {
        for (let i = 0; i < extraWords.length; i++) {
            j++;
            answersBuilder.push("<div class='draggable' id='draggableAnswer-" + j + "'>" + extraWords[i] + "</div>")
        }
    }

    shuffle(answersBuilder)
    htmlBuilder += "</div><br><div id='answerBlocks' style='margin-top: 1vw;'>" + answersBuilder.join('') + "</div>";
    maxWidth = 0
    let height = 0
    jQuery("#knq_answer").append(htmlBuilder).ready(function () {
        jQuery('.droppable').each(function () {
            if (maxWidth < jQuery(this).width()) {
                maxWidth = jQuery(this).width()
            }
        })
        jQuery('.draggable').each(function () {
            if (maxWidth < jQuery(this).width()) {
                maxWidth = jQuery(this).width()
            }
            height = jQuery(this).height()
        })
        maxWidth += 10;
        jQuery('.draggable').each(function () {
            jQuery(this).width(maxWidth)
        })
        jQuery('.droppable').each(function () {
            jQuery(this).width(maxWidth)
            jQuery(this).height(height)
        })
    });
    let magnitude = -70
    jQuery('.draggable').each(function () {
        jQuery(this).css('border', '2px dotted ' + newShade(color_hover, magnitude));
    })
    jQuery('.droppable').each(function () {
        jQuery(this).droppable({
            drop: function (event, ui) {
                let left = jQuery(this).offset().left
                let top = jQuery(this).offset().top
                let replace
                if (jQuery(this).attr('data-dropped-element') !== '0') {
                    replace = jQuery('#draggableAnswer-' + jQuery(this).attr('data-dropped-element'))
                }
                if (replace) {
                    replace.offset({top: replace.offset().top + 30, left: replace.offset().left + 30});
                    replace.css('border', "2px dotted " + newShade(color_hover, magnitude))
                    let loop = true
                    let positionLimit = 15
                    while (loop) {
                        loop = false
                        jQuery(".draggable").each(function () {
                            if (jQuery(this).offset().top - positionLimit < replace.offset().top && jQuery(this).offset().top >= replace.offset().top && jQuery(this).offset().left - positionLimit < replace.offset().left && jQuery(this).offset().left >= replace.offset().left && jQuery(this).attr('id') !== replace.attr('id')) {
                                replace.offset({
                                    top: replace.offset().top + positionLimit * 2,
                                    left: replace.offset().left + positionLimit * 2
                                })
                                loop = true;
                            } else if (jQuery(this).offset().top + positionLimit > replace.offset().top && jQuery(this).offset().top <= replace.offset().top && jQuery(this).offset().left + positionLimit > replace.offset().left && jQuery(this).offset().left <= replace.offset().left && jQuery(this).attr('id') !== replace.attr('id')) {
                                replace.offset({
                                    top: replace.offset().top + positionLimit * 2,
                                    left: replace.offset().left + positionLimit * 2
                                })
                                loop = true;
                            } else if (jQuery(this).offset().top - positionLimit < replace.offset().top && jQuery(this).offset().top >= replace.offset().top && jQuery(this).offset().left + positionLimit > replace.offset().left && jQuery(this).offset().left <= replace.offset().left && jQuery(this).attr('id') !== replace.attr('id')) {
                                replace.offset({
                                    top: replace.offset().top + positionLimit * 2,
                                    left: replace.offset().left + positionLimit * 2
                                })
                                loop = true;
                            } else if (jQuery(this).offset().top + positionLimit > replace.offset().top && jQuery(this).offset().top <= replace.offset().top && jQuery(this).offset().left - positionLimit < replace.offset().left && jQuery(this).offset().left >= replace.offset().left && jQuery(this).attr('id') !== replace.attr('id')) {
                                replace.offset({
                                    top: replace.offset().top + positionLimit * 2,
                                    left: replace.offset().left + positionLimit * 2
                                })
                                loop = true;
                            }
                        })
                    }
                }
                jQuery(ui.draggable).offset({top: top, left: left});
                jQuery(ui.draggable).css('border', '2px solid ' + newShade(color_hover, magnitude));
                if (jQuery(ui.draggable).attr('id').split("-")[1] === jQuery(this).attr('id').split("-")[1]) {
                    jQuery(this).attr('data-correct', '1')
                } else {
                    jQuery(this).attr('data-correct', '0')
                }
                jQuery(this).attr('data-dropped-element', jQuery(ui.draggable).attr('id').split("-")[1])
            }
        })
    })
    jQuery('.draggable').each(function () {
        jQuery(this).draggable({
            start: function () {
                let draggable = jQuery(this);
                draggable.css('border', '2px dotted ' + newShade(color_hover, magnitude));
                jQuery(".droppable").each(function () {
                    if (jQuery(this).attr('data-dropped-element') === draggable.attr('id').split("-")[1]) {
                        jQuery(this).attr('data-dropped-element', '0')
                    }
                })
                jQuery(".draggable").each(function () {
                    if (jQuery(this).attr('id') !== draggable.attr('id')) {
                        jQuery(this).css('z-index', 10)
                    } else {
                        jQuery(this).css('z-index', 20)
                    }
                })
            },
            stop: function () {
                let draggable = jQuery(this);
                let positionLimit = 10;
                jQuery(".draggable").each(function () {
                    if ((jQuery(this).offset().top < draggable.offset().top + positionLimit && jQuery(this).offset().top > draggable.offset().top - positionLimit) && (jQuery(this).offset().left < draggable.offset().left + positionLimit && jQuery(this).offset().left > draggable.offset().left - positionLimit) && jQuery(this).attr('id') !== draggable.attr('id')) {
                        jQuery(this).offset({
                            top: jQuery(this).offset().top + positionLimit * 2,
                            left: jQuery(this).offset().left + positionLimit * 2
                        })
                    }
                })
            }
        })
    })
    jQuery('.droppable').css('background', color_neutral)
    jQuery('.droppable').css('border', '2px solid ' + newShade(color_neutral, -70))
    jQuery('.draggable').css('background', color_hover)
}

function buildAnswerCheckRadioImage(answers, tip) {
    answers = answers.split("|");
    let htmlBuilder = '';
    for (i = 1; i < answers.length; i++) {
        // în funcție de tipul de întrebare, iconița din stânga diferă
        let answer = answers[i].split('[]')[0]
        if (tip === qCHECKBOXIMG) {
            htmlBuilder += "<li id='" + i + "' style='width: " + answers[0] + "%;' class='knq_image knq_unselected'><div><img class='imageClass' style='max-width: 100%; height: auto; display: inline-block; pointer-events: none;' src='" + answer + "'></div><i class='fa fa-square-o' aria-hidden='true' style='display: inline-block'></i></li>"
        } else {
            htmlBuilder += "<li id='" + i + "' style='width: " + answers[0] + "%;' class='knq_image knq_unselected'><div><img class='imageClass' style='max-width: 100%; height: auto; display: inline-block; pointer-events: none;' src='" + answer + "'></div><i class='fa fa-circle-o' aria-hidden='true' style='display: inline-block'></i></li>"
        }
    }
    let maxHeight = 0
    jQuery('#knqList').append(htmlBuilder)
    jQuery('.imageClass').each(function () {
        jQuery(this).on('load', function () {
            jQuery('.imageClass').each(function () {
                if (maxHeight < jQuery(this).height()) {
                    maxHeight = jQuery(this).height();
                }
            })
            jQuery('.imageClass').each(function () {
                jQuery(this).parent().height(maxHeight)
                jQuery('<div style=\"clear:both\"></div><br>').insertAfter(jQuery(this).parent());
            })
        })
        return false
    })
    jQuery("#knqList").css('height', 'fit-content')
    jQuery('.knq_unselected').css('background-color', color_neutral)
    jQuery('.knq_unselected').each(function () {
        jQuery(this).on('mouseenter', function () {
            jQuery(this).css('background-color', color_hover)
        })
        jQuery(this).on('mouseleave', function () {
            jQuery(this).css('background-color', color_neutral)
        })
    })
}

function selectRadio(object) {
    jQuery('.' + object.attr('class')).each(function () {
        jQuery(this).children("i").attr("class", "fa fa-circle-o");
    })
    object.children("i").attr("class", "fa-regular fa-circle-check");
}

function buildAnswerCheckRadioSortTrueFalse(answers, tip) {
    answers = answers.split("|");
    if (tip === qTRUEFALSE) {
        jQuery('#knqList').append('<li style="margin: 3px;"><div style="float:right;"><div style="display: inline-block; margin-right: 1vw; text-align: center" id="trueColumn">' + text_true + '</div><div style="display: inline-block; text-align: center" id="falseColumn">' + text_false + '</div></div><br></li>')
    }
    for (i = 0; i < answers.length; i++) {
        // în funcție de tipul de întrebare, iconița din stânga diferă
        if (tip === qCHECKBOXTEXT) {
            jQuery("#knqList").append("<li class='knq_unselected' id='" + (i + 1) + "'><i class='fa fa-square-o' aria-hidden='true'></i><p style='user-select: none; display: inline'>&nbsp;" + answers[i] + "</p></li>");
        } else if (tip === qRADIOBOXTEXT) {
            jQuery("#knqList").append("<li class='knq_unselected' id='" + (i + 1) + "'><i class='fa fa-circle-o' aria-hidden='true'></i><p style='user-select: none; display: inline'>&nbsp;" + answers[i] + "</p></li>");
        } else if (tip === qSORTING) {
            jQuery("#knqList").append("<li class='knq_unselected' id='" + (i + 1) + "'><i class='fa fa-arrows-up-down' aria-hidden='true'></i><p style='user-select: none; display: inline'>&nbsp;" + answers[i] + "</p></li>");
        } else if (tip === qTRUEFALSE) {
            jQuery("#knqList").append("<li class='knq_unselected' style='cursor: auto !important' id='" + (i + 1) + "'><p style='user-select: none; display: inline'>&nbsp;" + answers[i] + "</p><label style='float: right; width: fit-content;' class='radioLabel" + (i + 1) + "' onclick='selectRadio(jQuery(this))' for='false_radio_" + (i + 1) + "'><i style='width: 20px' class='fa fa-circle-o' aria-hidden='true'></i></label><input class='falseRadio' style='float: right; display: none' type='radio' id='false_radio_" + (i + 1) + "' name='true_false_" + (i + 1) + "'><label style='float: right; width: fit-content; margin-right: 1vw' onclick='selectRadio(jQuery(this))' class='radioLabel" + (i + 1) + "' for='true_radio_" + (i + 1) + "'><i style='width: 20px' class='fa fa-circle-o' aria-hidden='true'></i></label><input class='trueRadio' style='float: right; display: none' type='radio' id='true_radio_" + (i + 1) + "' name='true_false_" + (i + 1) + "'></li>")
        }
    }
    if (tip === qTRUEFALSE) {
        jQuery('.radioLabel1').eq(0).find('i').ready(function () {
            jQuery('#trueColumn').css('width', '20px')
        })
        jQuery('.radioLabel1').eq(1).find('i').ready(function () {
            jQuery('#falseColumn').css('width', '20px')
        })
    }
    jQuery('.knq_unselected').css('background-color', color_neutral)
    jQuery('.knq_unselected').each(function () {
        jQuery(this).on('mouseenter', function () {
            jQuery(this).css('background-color', color_hover)
        })
        jQuery(this).on('mouseleave', function () {
            jQuery(this).css('background-color', color_neutral)
        })
    })
}

function buildMatching(answers, rightOnes, noShuffle) {
    width = answers.split('[[')
    answers = width[1].split('|')
    rightOnes = rightOnes.split('|')
    let htmlBuilder = '<table style="width: 100%"><tbody><tr><td style="border: none; width: ' + width[0] + '%" id="matchingAnswers">'
    let htmlArray = []
    for (i = 0; i < answers.length; i++) {
        htmlArray.push('<div class="knq_matching_answer" id="knq_answer_' + (i + 1) + '"><p>' + answers[i] + '</p><i class="fa-solid fa-caret-right"></i></div>')
    }
    if (!noShuffle) {
        htmlArray = shuffle(htmlArray)
    }
    htmlBuilder += htmlArray.join("")
    htmlBuilder += '</td><td style="border: none" id="matchingRightOnes">'
    htmlArray = []
    for (i = 0; i < rightOnes.length; i++) {
        htmlArray.push('<div class="knq_right_one" id="knq_right_one_' + (i + 1) + '"><i class="fa-solid fa-caret-left"></i><p>' + rightOnes[i] + '</p></div>')
    }
    htmlArray = shuffle(htmlArray)
    htmlBuilder += htmlArray.join("")
    htmlBuilder += '</td></tr></tbody></table>'
    jQuery('#knq_answer').append(htmlBuilder).ready(function () {
        let maxHeight = 0
        jQuery('.knq_matching_answer').each(function () {
            if (jQuery(this).height() > maxHeight) {
                maxHeight = jQuery(this).height();
            }
        })
        jQuery('.knq_right_one').each(function () {
            if (jQuery(this).height() > maxHeight) {
                maxHeight = jQuery(this).height();
            }
        })
        jQuery('.knq_matching_answer').each(function () {
            jQuery(this).height(maxHeight)
        })
        jQuery('.knq_right_one').each(function () {
            jQuery(this).height(maxHeight)
        })
    })
    elemSortableAnswers = new Sortable(jQuery("#matchingAnswers")[0], {
        animation: 150,
        ghostClass: 'blue-background-class',
        swapClass: 'highlight',
        swap: true
    });
    jQuery("#matchingAnswers").addClass("ui-sortable")
    jQuery('.knq_matching_answer').css('background', color_neutral)
    jQuery('.knq_matching_answer').each(function () {
        jQuery(this).on('mouseenter', function () {
            jQuery(this).css('background-color', color_hover)
        })
        jQuery(this).on('mouseleave', function () {
            jQuery(this).css('background-color', color_neutral)
        })
    })
    jQuery("#matchingAnswers:hover").css('background', color_hover)
    elemSortableRightOnes = new Sortable(jQuery("#matchingRightOnes")[0], {
        animation: 150,
        ghostClass: 'blue-background-class',
        swapClass: 'highlight',
        swap: true
    });
    jQuery("#matchingRightOnes").addClass("ui-sortable")
    jQuery('.knq_right_one').css('background', color_neutral);
    jQuery('.knq_right_one').each(function () {
        jQuery(this).on('mouseenter', function () {
            jQuery(this).css('background-color', color_hover)
        })
        jQuery(this).on('mouseleave', function () {
            jQuery(this).css('background-color', color_neutral)
        })
    })
}

function buildPuzzle(answers) {
    answers = answers.split('|')
    // Create a new Image object
    const img = new Image();

    // Set the source of the image
    img.src = answers[2];

    // Wait for the image to load
    img.onload = () => {
        // Get the width and height of the image
        let width = img.width;
        let height = img.height;
        const containerWidth = jQuery('#questionContainer').width();
        if (containerWidth < width) {
            var ratio = containerWidth / width
            img.width = width * ratio - Math.max(answers[0], answers[1]) * 2;
            width = img.width;
            img.height = height * ratio - Math.max(answers[0], answers[1]) * 2 * ratio;
            height = img.height
        }

        // Do something with the width and height (e.g., display them on the page)
        let index = 0;
        for (let i = 0; i < answers[0]; i++) {
            for (let j = 0; j < answers[1]; j++) {
                jQuery('#knq_answer').append('<div data-row="' + i + '" data-column="' + j + '" id="piece_' + index + '" class="piece" style="float: left; width: ' + width / answers[1] + 'px; height: ' + height / answers[0] + 'px; overflow: hidden; margin: 1px"><img width="' + width + '" height="' + height + '" src="' + jQuery(img).attr('src') + '" style="margin: ' + height / answers[0] * i * -1 + 'px 0 0 ' + width / answers[1] * j * -1 + 'px"></div>')
                index++;
            }
            jQuery('#knq_answer').append('<br>')
        }
        let myArray = [];
        jQuery('.piece').each(function () {
            myArray.push(this.outerHTML)
        })
        shuffle(myArray)
        jQuery('#knq_answer').empty()
        jQuery('#knq_answer').append('<div id="rows_columns" style="display: none" data-rows="' + answers[0] + '" data-columns="' + answers[1] + '"></div>')
        let counter = 1
        myArray.forEach(element => {
            if (counter % answers[1] === 0) {
                element += '<div style=\'clear:both\'></div>';
            }
            jQuery('#knq_answer').append(element)
            counter++;
        })
        elemSortablePieces = new Sortable(jQuery("#knq_answer")[0], {
            animation: 150,
            ghostClass: 'blue-background-class',
            swapClass: 'highlight',
            swap: true,
            onEnd: function () {
                let correctAnswersCounter = 0
                jQuery('.piece').each(function (index) {
                    if (jQuery(this).attr('id').split('_')[1] - 0 === index) {
                        correctAnswersCounter++;
                    }
                })
                if (correctAnswersCounter === jQuery('.piece').length) {
                    funcClickAmRaspuns()
                }
            }
        });
    };
}

function buildMatchImage(answers) {
    // TODO: 30% width should mean 3 images fit on the same row
    answers = answers.split("[[");
    imageUrlAnswers = answers[0].split("|")
    wordAnswers = answers[1].split("|")
    extraWords = answers[2].split(" ")
    let htmlBuilder = '';
    let i;
    for (i = 1; i < imageUrlAnswers.length; i++) {
        let answer = imageUrlAnswers[i].split('[]')[0]
        htmlBuilder += "<li id='" + i + "' style='width: " + imageUrlAnswers[0] + "%; vertical-align: center' class='knq_image knq_unselected'><div><img class='imageClass' style='max-width: 100%; height: auto; display: inline-block; pointer-events: none;' src='" + answer + "'></div><div class='droppable' data-correct='0' data-dropped-element='0' id='droppableAnswer-" + i + "'></div></li>"
    }
    htmlBuilder += "<div style='clear:both'></div><li id='" + i + "' style='width: 100%; display:flex; flex-wrap: wrap; align-items:flex-end;'>"
    let answersBuilder = []
    for (i = 0; i < wordAnswers.length; i++) {
        answersBuilder.push("<div class='draggable' id='draggableAnswer-" + (i + 1) + "'>" + wordAnswers[i] + "</div>")
    }
    if (extraWords[0] !== '') {
        for (let j = 0; j < extraWords.length; j++) {
            i++;
            answersBuilder.push("<div class='draggable' id='draggableAnswer-" + i + "'>" + extraWords[j] + "</div>")
        }
    }
    shuffle(answersBuilder)
    htmlBuilder += answersBuilder.join('') + "</li>";
    let maxWidth = 0;
    let maxHeight = 0;
    jQuery('#knqList').append(htmlBuilder).ready(function () {
        jQuery('.droppable').each(function () {
            if (maxWidth < jQuery(this).width()) {
                maxWidth = jQuery(this).width()
            }
        })
        jQuery('.draggable').each(function () {
            if (maxWidth < jQuery(this).width()) {
                maxWidth = jQuery(this).width()
            }
            if (maxHeight < jQuery(this).height()) {
                maxHeight = jQuery(this).height()
            }
        })
        maxWidth += 10;
        jQuery('.draggable').each(function () {
            jQuery(this).css('flex-basis', maxWidth + 'px')
            jQuery(this).css('flex-shrink', '0')
            jQuery(this).height(maxHeight)
        })
        jQuery('.droppable').each(function () {
            jQuery(this).width(maxWidth)
            jQuery(this).height(maxHeight)
        })
        jQuery('.knq_unselected').each(function () {
            if (jQuery(this).width() < maxWidth) {
                maxWidth = jQuery('.draggable').first().outerWidth()
                jQuery(this).width(maxWidth)
            }
        })
    });
    jQuery('.knq_unselected').css('background-color', color_neutral)
    let magnitude = -70
    jQuery('.draggable').each(function () {
        jQuery(this).css('border', '2px dotted ' + newShade(color_hover, magnitude));
    })
    jQuery('.droppable').each(function () {
        jQuery(this).droppable({
            drop: function (event, ui) {
                let left = jQuery(this).offset().left
                let top = jQuery(this).offset().top
                let replace
                if (jQuery(this).attr('data-dropped-element') !== '0') {
                    replace = jQuery('#draggableAnswer-' + jQuery(this).attr('data-dropped-element'))
                }
                if (replace) {
                    replace.offset({top: replace.offset().top + 30, left: replace.offset().left + 30});
                    replace.css('border', "2px dotted " + newShade(color_hover, magnitude))
                    let loop = true
                    let positionLimit = 15
                    while (loop) {
                        loop = false
                        jQuery(".draggable").each(function () {
                            if (jQuery(this).offset().top - positionLimit < replace.offset().top && jQuery(this).offset().top >= replace.offset().top && jQuery(this).offset().left - positionLimit < replace.offset().left && jQuery(this).offset().left >= replace.offset().left && jQuery(this).attr('id') !== replace.attr('id')) {
                                replace.offset({
                                    top: replace.offset().top + positionLimit * 2,
                                    left: replace.offset().left + positionLimit * 2
                                })
                                loop = true;
                            } else if (jQuery(this).offset().top + positionLimit > replace.offset().top && jQuery(this).offset().top <= replace.offset().top && jQuery(this).offset().left + positionLimit > replace.offset().left && jQuery(this).offset().left <= replace.offset().left && jQuery(this).attr('id') !== replace.attr('id')) {
                                replace.offset({
                                    top: replace.offset().top + positionLimit * 2,
                                    left: replace.offset().left + positionLimit * 2
                                })
                                loop = true;
                            } else if (jQuery(this).offset().top - positionLimit < replace.offset().top && jQuery(this).offset().top >= replace.offset().top && jQuery(this).offset().left + positionLimit > replace.offset().left && jQuery(this).offset().left <= replace.offset().left && jQuery(this).attr('id') !== replace.attr('id')) {
                                replace.offset({
                                    top: replace.offset().top + positionLimit * 2,
                                    left: replace.offset().left + positionLimit * 2
                                })
                                loop = true;
                            } else if (jQuery(this).offset().top + positionLimit > replace.offset().top && jQuery(this).offset().top <= replace.offset().top && jQuery(this).offset().left - positionLimit < replace.offset().left && jQuery(this).offset().left >= replace.offset().left && jQuery(this).attr('id') !== replace.attr('id')) {
                                replace.offset({
                                    top: replace.offset().top + positionLimit * 2,
                                    left: replace.offset().left + positionLimit * 2
                                })
                                loop = true;
                            }
                        })
                    }
                }
                jQuery(ui.draggable).offset({top: top, left: left});
                jQuery(ui.draggable).css('border', '2px solid ' + newShade(color_hover, magnitude));
                if (jQuery(ui.draggable).attr('id').split("-")[1] === jQuery(this).attr('id').split("-")[1]) {
                    jQuery(this).attr('data-correct', '1')
                } else {
                    jQuery(this).attr('data-correct', '0')
                }
                jQuery(this).attr('data-dropped-element', jQuery(ui.draggable).attr('id').split("-")[1])
            }
        })
    })
    jQuery('.draggable').each(function () {
        jQuery(this).draggable({
            start: function () {
                let draggable = jQuery(this);
                draggable.css('border', '2px dotted ' + newShade(color_hover, magnitude));
                jQuery(".droppable").each(function () {
                    if (jQuery(this).attr('data-dropped-element') === draggable.attr('id').split("-")[1]) {
                        jQuery(this).attr('data-dropped-element', '0')
                    }
                })
                jQuery(".draggable").each(function () {
                    if (jQuery(this).attr('id') !== draggable.attr('id')) {
                        jQuery(this).css('z-index', 10)
                    } else {
                        jQuery(this).css('z-index', 20)
                    }
                })
            },
            stop: function () {
                let draggable = jQuery(this);
                let positionLimit = 10;
                jQuery(".draggable").each(function () {
                    if ((jQuery(this).offset().top < draggable.offset().top + positionLimit && jQuery(this).offset().top > draggable.offset().top - positionLimit) && (jQuery(this).offset().left < draggable.offset().left + positionLimit && jQuery(this).offset().left > draggable.offset().left - positionLimit) && jQuery(this).attr('id') !== draggable.attr('id')) {
                        jQuery(this).offset({
                            top: jQuery(this).offset().top + positionLimit * 2,
                            left: jQuery(this).offset().left + positionLimit * 2
                        })
                    }
                })
            }
        })
    })
    jQuery('.droppable').css('background', color_neutral)
    jQuery('.droppable').css('border', '2px solid ' + newShade(color_neutral, -70))
    jQuery('.draggable').css('background', color_hover)
}

function buildCategories(answers) {
    let categories = answers.split('[[');
    let htmlBuilder = "";
    let answersBuilder = [];
    let answerCounter = 0;
    for (let i = 0; i < categories.length; i++) {
        let elements = categories[i].split('|');
        htmlBuilder += "<div data-offset-top='-1' data-width='-1' data-height='-1' data-offset-left='-1' style='text-align: center; width: 40%' class='droppable' id='category-" + i + "'><p>" + elements[0] + "</p></div>"
        for (let j = 1; j < elements.length; j++) {
            answersBuilder.push("<div data-category='" + i + "' data-dropped='-1' class='draggable' id='answer" + answerCounter + "'>" + elements[j] + "</div>");
            answerCounter++;
        }
    }
    shuffle(answersBuilder)
    htmlBuilder += "<br>" + answersBuilder.join('');

    let maxWidth = 0;
    let maxHeight = 0;
    jQuery("#knq_answer").append(htmlBuilder).ready(function () {
        jQuery('.draggable').each(function () {
            if (maxWidth < jQuery(this).width()) {
                maxWidth = jQuery(this).width()
            }
            if (maxHeight < jQuery(this).height()) {
                maxHeight = jQuery(this).height()
            }
        })
        maxWidth += 10;
        jQuery('.draggable').each(function () {
            jQuery(this).css('width', maxWidth + 'px')
            // jQuery(this).css('flex-shrink', '0')
            jQuery(this).height(maxHeight)
        })
        jQuery('.droppable').each(function () {
            jQuery(this).height(maxHeight * 3)
            jQuery(this).css('margin-bottom', '0.5vw')
            jQuery(this).attr('data-offset-top', jQuery(this).offset().top)
            jQuery(this).attr('data-offset-left', jQuery(this).offset().left)
            jQuery(this).attr('data-width', jQuery(this).width())
            jQuery(this).attr('data-height', jQuery(this).height())
        })
        jQuery('.knq_unselected').each(function () {
            if (jQuery(this).width() < maxWidth) {
                maxWidth = jQuery('.draggable').first().outerWidth()
                jQuery(this).width(maxWidth)
            }
        })
    });

    let magnitude = -70

    jQuery('.droppable').each(function () {
        jQuery(this).css('background', color_neutral)
        jQuery(this).css('border', '2px solid ' + newShade(color_neutral, -70))
        jQuery(this).droppable({
            drop: function (event, ui) {
                let draggable = jQuery(ui.draggable)
                let draggableOffset = draggable.offset()
                let category = jQuery(this)
                let categoryOffset = category.offset()
                if (draggableOffset.left > categoryOffset.left && draggableOffset.left < categoryOffset.left + parseFloat(category.css('width')) - parseFloat(draggable.css('width')) && draggableOffset.top > categoryOffset.top && draggableOffset.top < categoryOffset.top + parseFloat(category.css('height')) - parseFloat(draggable.css('height'))) {
                    jQuery(ui.draggable).css('border', '2px solid ' + newShade(color_hover, magnitude));
                    jQuery(ui.draggable).attr('data-dropped', jQuery(this).attr('id').split("-")[1])
                }
            }
        })
    })

    jQuery('.draggable').each(function () {
        jQuery(this).css('border', '2px dotted ' + newShade(color_hover, magnitude));
        jQuery(this).css('background', color_hover)
        jQuery(this).draggable({
            start: function () {
                let draggable = jQuery(this);
                draggable.attr('data-dropped', -1);
                draggable.css('border', '2px dotted ' + newShade(color_hover, magnitude));
                jQuery(".draggable").each(function () {
                    if (jQuery(this).attr('id') !== draggable.attr('id')) {
                        jQuery(this).css('z-index', 10)
                    } else {
                        jQuery(this).css('z-index', 20)
                    }
                })
            },
            stop: function () {
                let draggable = jQuery(this);
                let positionLimit = 10;
                jQuery(".draggable").each(function () {
                    if ((jQuery(this).offset().top < draggable.offset().top + positionLimit && jQuery(this).offset().top > draggable.offset().top - positionLimit) && (jQuery(this).offset().left < draggable.offset().left + positionLimit && jQuery(this).offset().left > draggable.offset().left - positionLimit) && jQuery(this).attr('id') !== draggable.attr('id')) {
                        jQuery(this).offset({
                            top: jQuery(this).offset().top + positionLimit * 2,
                            left: jQuery(this).offset().left + positionLimit * 2
                        })
                        let draggableOffset = jQuery(this).offset()
                        let category = jQuery("#category-" + jQuery(this).attr('data-dropped'));
                        if (category.length) {
                            let categoryOffset = category.offset();
                            if (draggableOffset.left < categoryOffset.left || draggableOffset.left > categoryOffset.left + parseFloat(category.css('width')) - parseFloat(draggable.css('width')) || draggableOffset.top < categoryOffset.top || draggableOffset.top > categoryOffset.top + parseFloat(category.css('height')) - parseFloat(draggable.css('height'))) {
                                jQuery(this).css('border', '2px dotted ' + newShade(color_hover, magnitude));
                                jQuery(this).attr('data-dropped', '-1')
                            }
                        }
                    }
                })
            }
        })
    })

}

function buildPixelatedImage(answers) {

    console.log(jQuery("#knq_answer").height())

    // Create a new Image object
    const img = new Image();

    // Set the source of the image
    img.src = answers;

    console.log(jQuery("#quiz")[0].scrollHeight);

    img.onload = () => {
        // Get the width and height of the image
        let width = img.width;
        let height = img.height;
        const containerWidth = jQuery('#questionContainer').width();
        if (containerWidth < width) {
            var ratio = containerWidth / width
            img.width = width * ratio - Math.max(answers[0], answers[1]) * 2;
            img.height = height * ratio - Math.max(answers[0], answers[1]) * 2 * ratio;
        }

        let value = 0.02;
        jQuery('#knq_answer').append('<label style="width: fit-content" for="imageAnswer">' + text_guess + ':</label><br><input size="50" id="imageAnswer" type="text" value=""><img data-attempt="1" id="pixelate" src="' + jQuery(img).attr('src') + '" style="width: ' + jQuery("#questionContainer").width() + 'px" data-pixelate>')
        jQuery('#pixelate').pixelate({value: value, reveal: false})

        jQuery("#knq_answer").height(jQuery("#knq_answer").height());
        let attempt;
        let tries = 8, timeout = 3000, step = value;
        value += step;
        timeoutArray = []
        while (tries) {
            timeoutArray.push(setTimeout(function () {
                console.log(jQuery("#quiz")[0].scrollHeight);
                attempt = parseInt(jQuery('#pixelate').attr('data-attempt'));
                jQuery('#pixelate').remove();
                jQuery('#knq_answer').find('canvas').each(function () {
                    jQuery(this).remove();
                })
                jQuery('#knq_answer').append('<img data-attempt="' + (attempt + 1) + '" id="pixelate" src="' + jQuery(img).attr('src') + '" style="width: ' + jQuery("#questionContainer").width() + 'px" data-pixelate>')
                jQuery('#pixelate').pixelate({value: value, reveal: false})
                value = value + step;
            }, timeout))
            timeout += 3000;
            tries--;
        }
        timeoutArray.push(setTimeout(function () {
            jQuery('#pixelate').remove();
            jQuery('#knq_answer').find('canvas').each(function () {
                jQuery(this).remove();
            })
            jQuery('#knq_answer').append('<img data-attempt="' + (attempt + 2) + '" id="pixelate" src="' + jQuery(img).attr('src') + '" style="width: ' + jQuery("#questionContainer").width() + 'px" data-pixelate>')
            jQuery('#pixelate').pixelate({value: 1, reveal: false})
        }, timeout))
    };
}

function buildCrossWordEasy(answers, rightOnes) {
    let crosswordData = rightOnes.split('|')
    let crossword = crosswordData[0].split('\n');
    let htmlBuilder = "<table><tbody>";
    let maxLen = crossword[0].length;
    for (let i = 0; i < crossword.length; i++) {
        if (i !== crossword.length - 1) {
            crossword[i] = crossword[i].slice(0, -1);
        }
        if (crossword[i].length > maxLen) {
            maxLen = crossword[i].length;
        }
    }
    maxLen--;
    htmlBuilder += '<tr>';
    for (let i = 0; i < maxLen; i++) {
        if (i === crosswordData[1] - 1) {
            htmlBuilder += '<td style="text-align: center; padding: 0">A</td>'
        } else {
            htmlBuilder += '<td style="padding: 0"></td>'
        }
    }
    htmlBuilder += '</tr>';
    for (let i = 0; i < crossword.length; i++) {
        htmlBuilder += '<tr class="crosswordRow">';
        for (let j = 0; j < maxLen; j++) {
            if (j < crossword[i].length) {
                htmlBuilder += '<td style="text-align: center; padding: 0;">' + ((crossword[i].charAt(j) !== ' ') ? '<input class="crosswordCell" style="width: 2em; height: 2em; text-align: center; ' + ((j === crosswordData[1] - 1)? 'border: 2px solid black' : '') + '" type="text">' : '') + '</td>';
            } else {
                htmlBuilder += '<td style="padding: 0"></td>';
            }
        }
        htmlBuilder += '</tr>';
    }
    htmlBuilder += '<tr>';
    for (let i = 0; i < maxLen; i++) {
        if (i === crosswordData[1] - 1) {
            htmlBuilder += '<td style="text-align: center; padding: 0">B</td>'
        } else {
            htmlBuilder += '<td style="padding: 0"></td>'
        }
    }
    htmlBuilder += '</tr>';
    htmlBuilder += "</tbody></table>"
    answers = answers.split('|')
    for (let i = 0; i < answers.length; i++) {
        htmlBuilder += '<div>' + (i + 1) + '. ' + answers[i] + '</div>'
    }
    jQuery('#knq_answer').append(htmlBuilder).ready(function () {
        jQuery('.crosswordCell').each(function () {
            jQuery(this).on('input', function () {
                // console.log(jQuery(this).parent().next().find('input')[0])
                if (jQuery(this).val().slice(1).match(/^\p{L}$/u) || jQuery(this).val().match(/^\p{L}$/u)) {
                    if (jQuery(this).parent().next().find('input').length) {
                        jQuery(this).val(jQuery(this).val().toUpperCase())
                        jQuery(this).parent().next().find('input').focus()
                        jQuery(this).parent().next().find('input').select()
                    } else {
                        if (jQuery(this).val().length >= 2) {
                            jQuery(this).val(jQuery(this).val().slice(1).toUpperCase())
                        } else {
                            jQuery(this).val(jQuery(this).val().toUpperCase())
                        }
                    }
                }
                else {
                    jQuery(this).val('')
                }
            })
            jQuery(this).on('focus', function () {
                jQuery(this).parent().parent().parent().find("input").each(function() {
                    jQuery(this).css('background-color', '');
                })
                jQuery(this).parent().parent().find("input").each(function() {
                    jQuery(this).css('background-color', color_hover);
                })
                jQuery(this).select();
            })
            jQuery(this).focusout(function() {
                jQuery(this).parent().parent().parent().find("input").each(function() {
                    jQuery(this).css('background-color', '');
                })
            })
        })
    });
}

function destroySortable() {
    if (jQuery('#type').text() === qPUZZLE) {
        elemSortablePieces.destroy()
    } else if (jQuery('#type').text() === qMATCHING) {
        elemSortableAnswers.destroy()
        elemSortableRightOnes.destroy()
    }
}

//=========================END - FUNCTII BUILD ANSWERS==================================


//=========================BEGIN - FUNCTII FULL SCREEN==================================


function funcFullScreen() {
    jQuery("#fullscreen-link").click(function (e) {
        //dacă s-a apăsat butonul de full-screen
        // jQuery('#trueColumn').hide()
        // jQuery('#falseColumn').hide()
        if (jQuery.fullscreen.isFullScreen()) {
            //ieșire din full screen
            jQuery.fullscreen.exit();
            if (jQuery('#type').text() === qPIXELATEDIMAGE) {
                jQuery("#knq_answer").height(jQuery("#knq_answer").height());
            }
            relocateDraggablesNotFullscreen();
            if (jQuery('#type').text() === qPUZZLE) {
                resizePuzzleNotFullscreen();
            }
        } else {
            //intrare în full screen
            if (jQuery('#type').text() === qPIXELATEDIMAGE) {
                jQuery("#knq_answer").height(jQuery("#knq_answer").height());
            }
            jQuery('#quiz').fullscreen();
            relocateDraggablesFullscreen();
            if (jQuery('#type').text() === qPUZZLE) {
                resizePuzzleFullscreen();
            }
        }
        return false;
    });
    jQuery(document).bind('fscreenchange', function (e, state, elem) {
        if (jQuery.fullscreen.isFullScreen()) {
            jQuery('#quiz').css("padding", "50px");
            jQuery('#quiz').css("background-color", "white");
            if (jQuery.isFunction(jQuery.fn.resizeTableWS)) {
                resizeTableWS();
            }
            //ht=parseInt(jQuery('#tabelcentrat').height(),10);wt=parseInt(jQuery('#tabelcentrat').width(),10);
            //console.log(ht+" "+wt);
            //if(ht>wt) jQuery('#tabelcentrat').height(wt+"px"); else jQuery('#tabelcentrat').width(ht+"px");
            jQuery("#fullscreen-link").html("<i class='fa fa-compress'></i>");
            jQuery("#quiz").css("overflow", "scroll");
        } else {
            jQuery('#quiz').css("padding", "0px");
            jQuery('#quiz').css("background-color", "");
            ht = parseInt(jQuery('#tabelcentrat').height(), 10);
            wt = parseInt(jQuery('#tabelcentrat').width(), 10);
            if (ht > wt) jQuery('#tabelcentrat').height(wt + "px"); else jQuery('#tabelcentrat').width(ht + "px");
            jQuery("#fullscreen-link").html("<i class='fa fa-expand'></i>");
            jQuery("#quiz").css("overflow", "show");
            scrollToAnchor('knq_question');
        }
    });
}


function resizePuzzleNotFullscreen() {
    if (jQuery.fullscreen.isFullScreen()) {
        setTimeout(resizePuzzleNotFullscreen, 100)
    } else {
        resizePuzzle(2)
    }
}

function resizePuzzleFullscreen() {
    if (!jQuery.fullscreen.isFullScreen()) {
        setTimeout(resizePuzzleFullscreen, 100)
    } else {
        resizePuzzle(2)
    }
}

function resizePuzzle(margin) {
    // Create a new Image object
    const img = new Image();

    // Set the source of the image
    img.src = jQuery('#piece_0').find('img').attr('src');

    const containerWidth = jQuery('#questionContainer').width();

    // Wait for the image to load
    img.onload = () => {
        // Get the width and height of the image
        let width;
        let height;
        let rows = jQuery("#rows_columns").attr('data-rows');
        let columns = jQuery("#rows_columns").attr('data-columns');
        if (img.width < containerWidth) {
            width = img.width;
            height = img.height;
        } else {
            const ratio = containerWidth / img.width;
            img.width = img.width * ratio - Math.max(columns, rows) * margin;
            width = img.width;
            img.height = img.height * ratio - Math.max(rows, columns) * margin * ratio;
            height = img.height
        }
        jQuery(".piece").each(function () {
            jQuery(this).css('width', width / columns + 'px')
            jQuery(this).css('height', height / rows + 'px')
            jQuery(this).find('img').css('margin', height / rows * jQuery(this).attr('data-row') * -1 + 'px 0 0 ' + width / columns * jQuery(this).attr('data-column') * -1 + 'px')
            jQuery(this).find('img').css('width', width)
            jQuery(this).find('img').css('height', height)
        })
    };
}

function relocateTrueFalseFullscreen() {
    if (!jQuery.fullscreen.isFullScreen()) {
        setTimeout(relocateTrueFalseFullscreen, 100)
    } else {
        if (jQuery('.radioLabel1').eq(0).length) {
            jQuery('.radioLabel1').eq(0).ready(function () {
                jQuery('#trueColumn').css('left', jQuery('.radioLabel1').eq(0).offset().left + jQuery('.radioLabel1').eq(0).width() / 2 - jQuery('#trueColumn').width() / 2)
            })
            jQuery('.radioLabel1').eq(1).ready(function () {
                jQuery('#falseColumn').css('left', jQuery('.radioLabel1').eq(1).offset().left + jQuery('.radioLabel1').eq(1).width() / 2 - jQuery('#falseColumn').width() / 2)
            })
            jQuery('#trueColumn').show()
            jQuery('#falseColumn').show()
        }
    }
}

function relocateTrueFalseNotFullscreen() {
    if (jQuery.fullscreen.isFullScreen()) {
        setTimeout(relocateTrueFalseNotFullscreen, 100)
    } else {
        if (jQuery('.radioLabel1').eq(0).length) {
            jQuery('.radioLabel1').eq(0).ready(function () {
                jQuery('#trueColumn').css('left', jQuery('.radioLabel1').eq(0).offset().left + jQuery('.radioLabel1').eq(0).width() / 2 - jQuery('#trueColumn').width() / 2)
            })
            jQuery('.radioLabel1').eq(1).ready(function () {
                jQuery('#falseColumn').css('left', jQuery('.radioLabel1').eq(1).offset().left + jQuery('.radioLabel1').eq(1).width() / 2 - jQuery('#falseColumn').width() / 2)
            })
            jQuery('#trueColumn').show()
            jQuery('#falseColumn').show()
        }
    }
}

function relocateDraggablesFullscreen() {
    if (!jQuery.fullscreen.isFullScreen()) {
        setTimeout(relocateDraggablesFullscreen, 100)
    } else {
        if (jQuery('#type').text() !== qCATEGORY) {
            reapplyDraggable()
            jQuery(".droppable").each(function () {
                if (jQuery(this).attr('data-dropped-element') !== '0') {
                    jQuery('#draggableAnswer-' + jQuery(this).attr('data-dropped-element')).offset({
                        top: jQuery(this).offset().top,
                        left: jQuery(this).offset().left
                    })
                }
            })
        } else {
            jQuery(".draggable").each(function () {
                let draggable = jQuery(this).detach();
                if (jQuery(this).attr('data-dropped') === '-1') {
                    draggable.css('left', '0')
                    draggable.css('top', '0')
                }
                jQuery("#knq_answer").append(draggable);
            })
        }
    }
}

function relocateDraggablesNotFullscreen() {
    if (jQuery.fullscreen.isFullScreen()) {
        setTimeout(relocateDraggablesNotFullscreen, 100)
    } else {
        if (jQuery('#type').text() !== qCATEGORY) {
            reapplyDraggable()
            jQuery(".droppable").each(function () {
                if (jQuery(this).attr('data-dropped-element') !== '0') {
                    jQuery('#draggableAnswer-' + jQuery(this).attr('data-dropped-element')).offset({
                        top: jQuery(this).offset().top,
                        left: jQuery(this).offset().left
                    })
                }
            })
        } else {
            jQuery(".draggable").each(function () {
                let draggable = jQuery(this).detach();
                if (jQuery(this).attr('data-dropped') === '-1') {
                    draggable.css('left', '0')
                    draggable.css('top', '0')
                }
                jQuery("#knq_answer").append(draggable);
            })
            jQuery(".draggable").each(function () {
                let draggable = jQuery(this)
                let draggableOffset = jQuery(this).offset();
                let category = jQuery("#category-" + jQuery(this).attr('data-dropped'));
                if (category.length) {
                    category.ready(function () {
                        let categoryOffsetLeft = parseFloat(category.attr('data-offset-left'));
                        let categoryOffsetTop = parseFloat(category.attr('data-offset-top'));
                        let categoryWidth = parseFloat(category.attr('data-width'));
                        let categoryHeight = parseFloat(category.attr('data-height'));
                        let newLeft = Math.random() * (categoryWidth - parseFloat(draggable.width())) + categoryOffsetLeft;
                        let newTop = Math.random() * (categoryHeight - parseFloat(draggable.height())) + categoryOffsetTop;
                        console.log(categoryOffsetLeft)
                        console.log(categoryOffsetTop)
                        console.log(categoryOffsetLeft + categoryWidth)
                        console.log(categoryOffsetTop + categoryHeight)
                        console.log("left: " + newLeft)
                        console.log("top: " + newTop)
                        if (draggableOffset.left < categoryOffsetLeft || draggableOffset.left > categoryOffsetLeft + categoryWidth || draggableOffset.top < categoryOffsetTop || draggableOffset.top > categoryOffsetTop + categoryHeight) {
                            draggable.offset({left: newLeft, top: newTop})
                            console.log("hello?")
                        }
                    })
                }
            })
        }
    }
}

function reapplyDraggable() {
    jQuery(".draggable").each(function () {
        let dropped = false;
        let draggableId = jQuery(this).attr('id').split("-")[1]
        jQuery(".droppable").each(function () {
            if (jQuery(this).attr('data-dropped-element') === draggableId) {
                dropped = true
            }
        })
        if (!dropped) {
            let draggable = jQuery(this).detach()
            draggable.css('left', '0')
            draggable.css('top', '0')
            jQuery(draggable.get(0).outerHTML).appendTo("#answerBlocks")
        }
        jQuery('.draggable').each(function () {
            jQuery(this).draggable({
                start: function () {
                    let draggable = jQuery(this);
                    draggable.css('border', '2px dotted #007AAE');
                    jQuery(".droppable").each(function () {
                        if (jQuery(this).attr('data-dropped-element') === draggable.attr('id').split("-")[1]) {
                            jQuery(this).attr('data-dropped-element', '0')
                        }
                    })
                    jQuery(".draggable").each(function () {
                        if (jQuery(this).attr('id') !== draggable.attr('id')) {
                            jQuery(this).css('z-index', 10)
                        } else {
                            jQuery(this).css('z-index', 20)
                        }
                    })
                },
                stop: function () {
                    let draggable = jQuery(this);
                    let positionLimit = 10;
                    jQuery(".draggable").each(function () {
                        if ((jQuery(this).offset().top < draggable.offset().top + positionLimit && jQuery(this).offset().top > draggable.offset().top - positionLimit) && (jQuery(this).offset().left < draggable.offset().left + positionLimit && jQuery(this).offset().left > draggable.offset().left - positionLimit) && jQuery(this).attr('id') !== draggable.attr('id')) {
                            jQuery(this).offset({
                                top: jQuery(this).offset().top + positionLimit * 2,
                                left: jQuery(this).offset().left + positionLimit * 2
                            })
                        }
                    })
                }
            })
        })
    })
}

//=========================END - FUNCTII FULL SCREEN==================================

