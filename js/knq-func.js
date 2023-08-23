//=========================BEGIN - FUNCTII BUILD ANSWERS==================================

function buildAnswerSelectBox(answers){
    let answer = answers.split(/\[\[|]]/);
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
            // TODO: language options here
            htmlBuilder += "<select class='knq-answer-select' id='answerSelect" + j + "'><option value='0'>Choose the right answer</option>"
            options.forEach((element, index) => {
                optionsBuilder.push("<option value='" + parseInt(index + 1) + "'>" + element + "</option>")
            })
            shuffle(optionsBuilder);
            htmlBuilder += optionsBuilder.join('')
            htmlBuilder += "<select>"
        }
    }
    jQuery("#knq_answer").append("<div id='1'><p style='user-select: none'>&nbsp;" + htmlBuilder + "</p></div>");
}

function buildAnswerDragDrop(answers){
    answers = answers.split('|')
    let extraWords
    if (answers.length > 1) {
        extraWords = answers[1].split(" ")
    }
    else {
        extraWords = ['']
    }
    let answer = answers[0].split(/\[\[|]]/);
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
            answersBuilder.push("<div class='draggable' id='draggableAnswer-" + j + "'>"+ answer[j] + "</div>")
        }
    }
    if (extraWords[0] !== '') {
        for (let i = 0; i < extraWords.length; i++) {
            j++;
            answersBuilder.push("<div class='draggable' id='draggableAnswer-" + j + "'>"+ extraWords[i] + "</div>")
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
    jQuery('.droppable').each(function () {
        jQuery(this).droppable({
            drop: function( event, ui ) {
                let left = jQuery(this).offset().left
                let top = jQuery(this).offset().top
                let replace
                if (jQuery(this).attr('data-dropped-element') !== '0') {
                    replace = jQuery('#draggableAnswer-' + jQuery(this).attr('data-dropped-element'))
                }
                if (replace) {
                    replace.offset({top: replace.offset().top + 30,left: replace.offset().left + 30});
                    replace.css('border', "2px dotted #007AAE")
                    let loop = true
                    let positionLimit = 15
                    while (loop) {
                        loop = false
                        jQuery(".draggable").each(function () {
                            if (jQuery(this).offset().top - positionLimit < replace.offset().top && jQuery(this).offset().top >= replace.offset().top && jQuery(this).offset().left - positionLimit < replace.offset().left && jQuery(this).offset().left >= replace.offset().left && jQuery(this).attr('id') !== replace.attr('id')) {
                                replace.offset({top: replace.offset().top + positionLimit * 2, left: replace.offset().left + positionLimit * 2})
                                loop = true;
                            }
                            else if (jQuery(this).offset().top + positionLimit > replace.offset().top && jQuery(this).offset().top <= replace.offset().top && jQuery(this).offset().left + positionLimit > replace.offset().left && jQuery(this).offset().left <= replace.offset().left && jQuery(this).attr('id') !== replace.attr('id')) {
                                replace.offset({top: replace.offset().top + positionLimit * 2, left: replace.offset().left + positionLimit * 2})
                                loop = true;
                            }
                            else if (jQuery(this).offset().top - positionLimit < replace.offset().top && jQuery(this).offset().top >= replace.offset().top && jQuery(this).offset().left + positionLimit > replace.offset().left && jQuery(this).offset().left <= replace.offset().left && jQuery(this).attr('id') !== replace.attr('id')) {
                                replace.offset({top: replace.offset().top + positionLimit * 2, left: replace.offset().left + positionLimit * 2})
                                loop = true;
                            }
                            else if (jQuery(this).offset().top + positionLimit > replace.offset().top && jQuery(this).offset().top <= replace.offset().top && jQuery(this).offset().left - positionLimit < replace.offset().left && jQuery(this).offset().left >= replace.offset().left && jQuery(this).attr('id') !== replace.attr('id')) {
                                replace.offset({top: replace.offset().top + positionLimit * 2, left: replace.offset().left + positionLimit * 2})
                                loop = true;
                            }
                        })
                    }
                }
                jQuery(ui.draggable).offset({top: top,left: left});
                jQuery(ui.draggable).css('border', '2px solid #'+color_bhover);
                if (jQuery(ui.draggable).attr('id').split("-")[1] === jQuery(this).attr('id').split("-")[1]) {
                    jQuery(this).attr('data-correct', '1')
                }
                else {
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
                draggable.css('border', '2px dotted #'+color_bhover);
                jQuery(".droppable").each(function () {
                    if (jQuery(this).attr('data-dropped-element') === draggable.attr('id').split("-")[1]) {
                        jQuery(this).attr('data-dropped-element', '0')
                    }
                })
                jQuery(".draggable").each(function() {
                    if (jQuery(this).attr('id') !== draggable.attr('id')) {
                        jQuery(this).css('z-index', 10)
                    }
                    else {
                        jQuery(this).css('z-index', 20)
                    }
                })
            },
            stop: function () {
                let draggable = jQuery(this);
                let positionLimit = 10;
                jQuery(".draggable").each(function () {
                    if ((jQuery(this).offset().top < draggable.offset().top + positionLimit && jQuery(this).offset().top  > draggable.offset().top - positionLimit) && (jQuery(this).offset().left < draggable.offset().left + positionLimit && jQuery(this).offset().left > draggable.offset().left - positionLimit) && jQuery(this).attr('id') !== draggable.attr('id')) {
                        jQuery(this).offset({top: jQuery(this).offset().top + positionLimit * 2, left: jQuery(this).offset().left + positionLimit * 2})
                    }
                })
            }
        })
    })

}

function buildAnswerCheckRadioImage(answers, tip) {
    answers = answers.split("|");
    let htmlBuilder = '';
    for (i = 1; i < answers.length; i++) {
        // în funcție de tipul de întrebare, iconița din stânga diferă
        let answer = answers[i].split('[]')[0]
        if (tip === qCHECKBOXIMG) {
            htmlBuilder += "<li id='" + i + "' style='width: " + answers[0] + "%;' class='knq_image knq_unselected'><div><img class='imageClass' style='max-width: 100%; height: auto; display: inline-block; pointer-events: none;' src='" + answer + "'></div><i class='fa fa-square-o' aria-hidden='true' style='display: inline-block'></i></li>"
        }
        else {
            htmlBuilder += "<li id='" + i + "' style='width: " + answers[0] + "%;' class='knq_image knq_unselected'><div><img class='imageClass' style='max-width: 100%; height: auto; display: inline-block; pointer-events: none;' src='" + answer + "'></div><i class='fa fa-circle-o' aria-hidden='true' style='display: inline-block'></i></li>"
        }
    }
    let maxHeight = 0
    jQuery('#knqList').append(htmlBuilder)
    jQuery('.imageClass').each(function () {
        jQuery(this).on('load', function () {
            console.log(jQuery(this).height()+" "+maxHeight)
            jQuery('.imageClass').each(function () {
                if (maxHeight < jQuery(this).height()) {
                    maxHeight = jQuery(this).height();
                }
            })
            jQuery('.imageClass').each(function (index, element) {
                jQuery(this).parent().height(maxHeight)
            })
        })
        return false
    })
    Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
        console.log('images finished loading');
    });
    jQuery(window).bind('load', function(){console.log("La final2uuuuuuuuuuuuuuu: "+maxHeight);})
    jQuery("#knqList").css('height', 'fit-content')
}

function buildAnswerCheckRadioSort(answers, tip){
    answers = answers.split("|");
    for (i = 0; i < answers.length; i++) {
        // în funcție de tipul de întrebare, iconița din stânga diferă
        if (tip === qCHECKBOXTEXT) {
            jQuery("#knqList").append("<li class='knq_unselected' id='" + (i + 1) + "'><i class='fa fa-square-o' aria-hidden='true'></i><p style='user-select: none; display: inline'>&nbsp;" + answers[i] + "</p></li>");
        } else if (tip === qRADIOBOXTEXT) {
            jQuery("#knqList").append("<li class='knq_unselected' id='" + (i + 1) + "'><i class='fa fa-circle-o' aria-hidden='true'></i><p style='user-select: none; display: inline'>&nbsp;" + answers[i] + "</p></li>");
        } else if (tip === qSORTING) {
            jQuery("#knqList").append("<li class='knq_unselected' id='" + (i + 1) + "'><i class='fa fa-arrows-up-down' aria-hidden='true'></i><p style='user-select: none; display: inline'>&nbsp;" + answers[i] + "</p></li>");
        }
    }
}

function buildMatching(answers, rightOnes) {
    width = answers.split('[[')
    answers = width[1].split('|')
    rightOnes = rightOnes.split('|')
    let htmlBuilder = '<table style="width: 100%"><tbody><tr><td style="border: none; width: ' + width[0] + '%" id="matchingAnswers">'
    let htmlArray = []
    for (i = 0; i < answers.length; i++) {
        htmlArray.push('<div class="knq_matching_answer" id="knq_answer_' + (i + 1) + '"><p>' + answers[i] + '</p><i class="fa-solid fa-caret-right"></i></div>')
    }
    htmlArray = shuffle(htmlArray)
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
    elemSortableRightOnes = new Sortable(jQuery("#matchingRightOnes")[0], {
        animation: 150,
        ghostClass: 'blue-background-class',
        swapClass: 'highlight',
        swap: true
    });
    jQuery("#matchingRightOnes").addClass("ui-sortable")
}

function destroySortable() {
    elemSortableAnswers.destroy()
    elemSortableRightOnes.destroy()
}

//=========================END - FUNCTII BUILD ANSWERS==================================






//=========================BEGIN - FUNCTII FULL SCREEN==================================

function funcFullScreen(){
    jQuery("#fullscreen-link").click(function(e) {
        //dacă s-a apăsat butonul de full-screen
        if(jQuery.fullscreen.isFullScreen()){
            //ieșire din full screen
            jQuery.fullscreen.exit();
            relocateDraggablesNotFullscreen();
        }
        else {
            //intrare în full screen
            jQuery('#quiz').fullscreen();
            relocateDraggablesFullscreen();
        }
        return false;
    });
// TODO: backend checkbox radio box
    jQuery(document).bind('fscreenchange', function(e, state, elem) {
        if (jQuery.fullscreen.isFullScreen()) {
            jQuery('#quiz').css("padding","50px");
			jQuery('#quiz').css("background-color","white");
            if ( jQuery.isFunction(jQuery.fn.resizeTableWS) ) {
			resizeTableWS();}
			//ht=parseInt(jQuery('#tabelcentrat').height(),10);wt=parseInt(jQuery('#tabelcentrat').width(),10);
			//console.log(ht+" "+wt);
			//if(ht>wt) jQuery('#tabelcentrat').height(wt+"px"); else jQuery('#tabelcentrat').width(ht+"px");
            jQuery("#fullscreen-link").html("<i class='fa fa-compress'></i>");
            jQuery("#quiz").css("overflow","scroll");
        }
        else {
            jQuery('#quiz').css("padding","0px");
			jQuery('#quiz').css("background-color","");
			ht=parseInt(jQuery('#tabelcentrat').height(),10);wt=parseInt(jQuery('#tabelcentrat').width(),10);
			console.log(ht+" "+wt);
			if(ht>wt) jQuery('#tabelcentrat').height(wt+"px"); else jQuery('#tabelcentrat').width(ht+"px");
            jQuery("#fullscreen-link").html("<i class='fa fa-expand'></i>");
            jQuery("#quiz").css("overflow","show");
            scrollToAnchor('knq_question');
        }
    });
}

function relocateDraggablesFullscreen() {
    if (!jQuery.fullscreen.isFullScreen()) {
        setTimeout(relocateDraggablesFullscreen, 100)
    }
    else {
        reapplyDraggable()
        jQuery(".droppable").each(function () {
            if (jQuery(this).attr('data-dropped-element') !== '0') {
                jQuery('#draggableAnswer-' + jQuery(this).attr('data-dropped-element')).offset({top: jQuery(this).offset().top, left: jQuery(this).offset().left})
            }
        })
    }
}

function relocateDraggablesNotFullscreen() {
    if (jQuery.fullscreen.isFullScreen()) {
        setTimeout(relocateDraggablesNotFullscreen, 100)
    }
    else {
        reapplyDraggable()
        jQuery(".droppable").each(function () {
            if (jQuery(this).attr('data-dropped-element') !== '0') {
                jQuery('#draggableAnswer-' + jQuery(this).attr('data-dropped-element')).offset({top: jQuery(this).offset().top, left: jQuery(this).offset().left})
            }
        })
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
                    jQuery(".draggable").each(function() {
                        if (jQuery(this).attr('id') !== draggable.attr('id')) {
                            jQuery(this).css('z-index', 10)
                        }
                        else {
                            jQuery(this).css('z-index', 20)
                        }
                    })
                },
                stop: function () {
                    let draggable = jQuery(this);
                    let positionLimit = 10;
                    jQuery(".draggable").each(function () {
                        if ((jQuery(this).offset().top < draggable.offset().top + positionLimit && jQuery(this).offset().top  > draggable.offset().top - positionLimit) && (jQuery(this).offset().left < draggable.offset().left + positionLimit && jQuery(this).offset().left > draggable.offset().left - positionLimit) && jQuery(this).attr('id') !== draggable.attr('id')) {
                            jQuery(this).offset({top: jQuery(this).offset().top + positionLimit * 2, left: jQuery(this).offset().left + positionLimit * 2})
                        }
                    })
                }
            })
        })
    })
}

//=========================END - FUNCTII FULL SCREEN==================================

