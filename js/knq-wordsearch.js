function alerta(text) {
    //jQuery(".alerta").html("<textarea rows=2 cols=80>"+text+"</textarea>");
    //jQuery(".alerta").html(text);
    //console.log(text);
}

function doFdown(){
    crtv=parseInt(jQuery(".celula").css('fontSize'),10);
    if(crtv>=22)
        jQuery(".celula, .celula2, .celula3, .celula4").css('font-size',(crtv-4)+'px'); resizeTableWS(0);
}

function doFup(){
    crtv=parseInt(jQuery(".celula").css('fontSize'),10);
    if(crtv<50)
        jQuery(".celula, .celula2, .celula3, .celula4").css('font-size',(crtv+4)+'px'); resizeTableWS(0);
}

jQuery(document).ready(function () {
    Mousetrap.bind(']', function() { doFup(); });
    Mousetrap.bind('[', function() { doFdown(); });
    Mousetrap.bind('}', function() { resizeTableWS(3); });
    Mousetrap.bind('{', function() { resizeTableWS(-3); });
});

function resizeTableWS(cat) {

    jQuery('#tabelcentrat').width("50px");
    jQuery('#tabelcentrat').height("50px");
    min=0;
    jQuery(".celula, .celula2, .celula3, .celula4").each(function(){
        w=parseInt(jQuery(this).width());
        h=parseInt(jQuery(this).height());
        if(w>min) min=w;
        if(h>min) min=h;
        //console.log(w+" "+h+"="+min)
        //jQuery(this).width("20px");
        //jQuery(this).height("20px");
    });
    //console.log("max e "+min);
    min+=cat;
    //min=40;
    //min=200;
    jQuery(".celula, .celula2, .celula3, .celula4").each(function(){
        jQuery(this).width(min+"px");
        jQuery(this).height(min+"px");
    });
    jQuery('#tabelcentrat').width((10*min)+"px");
    jQuery('#tabelcentrat').height((10*min)+"px");



    //jQuery(".celula").css('font-size',(parseInt(jQuery(".celula").css('fontSize'),10)+cat/20)+'px');
    /*if(parseInt(jQuery('#tabelcentrat').width(), 10) >= parseInt(jQuery('#knq_answer').width(), 10) && cat>0) cat=0;
    ht = parseInt(jQuery('#tabelcentrat').height(), 10)+cat;
    wt = parseInt(jQuery('#tabelcentrat').width(), 10)+cat;
    //ht=wt=parseInt(jQuery(".celula").css('fontSize'),10)*10+cat;
    console.log(ht+" * "+wt+" * "+cat);
    //ht=30;wt=30;
    if(cat==0){
        if (ht < wt) {jQuery('#tabelcentrat').width(ht + "px");console.log('mod width')} else jQuery('#tabelcentrat').height(wt + "px");
    }
    else {
        jQuery('#tabelcentrat').width(wt + "px");
        jQuery('#tabelcentrat').height(ht + "px");
        resizeTableWS(0);
    }*/

    /*	console.log(1);
    }
    else {
        if (ht <= wt) jQuery('#tabelcentrat').width(ht + "px"); else jQuery('#tabelcentrat').height(wt + "px");
        console.log(2);
    }*/
}

function buildWordSearch(answers) {
    //alert(answers);
    answers = answers.split("|");
    careuri = answers[0].toUpperCase().trim();
    scareuri = careuri.split("[]");
    indice = Math.floor(Math.random() * scareuri.length);
    //console.log(indice);
    //indice=0;
    careu = scareuri[indice];
    diag = careu.substr(0, 2) - 0;
    diag=99999; // variabila nu mai este relevanta
    //if (diag > 0) careu = careu.substr(2);
    cuvinte = answers[1].toUpperCase().trim();
    dezlegare = answers[2].toUpperCase().trim();

    //careu="IGNATIUBS#TFINTIIES#EUNANTONT#RNICOLAEP#EBOSCORDI#ZETENIIIN#AMARTINCO#STIOANATR#IFRANCISC";
    //cuvinte="IGNATIU#ANTON#FRANCISC#BENEDICT#TEREZA#MARTIN#NICOLAE#BOSCO#IOANA";
    //dezlegare="SFINTII SUNT PRIETENII NOSTRI";
    //cuvinte="IGNATIU#ANTON";
    text = "";
    nivel = "Uşor";
    if (diag > 0) nivel = "Mediu";
    clicked = "";
    pctdezlegare = 10;
    //wwidth="10";
    //hheight="10";
    ffont = "14";
    diag = 0;
    gasitdezlegare = false;
    solutii = cuvinte.split("#");
    solutii.sort(randOrd);
    solutiidone = new Array();
    for (i = 0; i < solutii.length; i++)
        solutiidone[i] = 0;
    solutii2 = cuvinte.split("#");
    //alert("solutii")
    cate = nrcuvinte = solutii.length;
    cuvrezolvate = 0;
    //punctajmaxim = (nrcuvinte * 5 - 0) + (pctdezlegare - 0) + (diag * 5 - 0);
    puncte = 0;
    linii = careu.split("#")
    cuvantsimplu = true;
    u = 1;
    text += "<div class='' align='center'><table class='tabelcentrat knq_wsarea' width=50 height=50 id='tabelcentrat' cellpadding='0' cellspacing='0' border='0' align=center>";
    for (i = 0; i < linii.length; i++) {
        litere = linii[i].split("");
        //alert(litere.length)
        text += "<tr class='linie'>";
        for (j = 0; j < litere.length; j++)
            text += "<td class='celula' id='c" + (i + 1) + "." + (j + 1) + "'>" + litere[j] + "</td>";
        text += "</tr>";
    }
    text += "</table></div><div id='kqn_wswords' style='text-align: center; line-height:1.3em; margin-top: 10px;'>" + find_words + ":<div id='knq_woswords'>";
    clicked = "";
    cuvant = "";
    //for (i = 0; i < solutii.length; i++)
    //    text += "<input type=button value='" + solutii[i] + "'> ";
    for (i = 0; i < solutii.length; i++)
        text += "<span>" + solutii[i] + "</span> ";
    text += "</div></div><div class='dezlegare' style='text-align:center;'></div><div id='knq_wscontrols' style='font-size:0.8em;text-align:center;'><a href='javascript:;' id='doFd' title='Micșorare literă'><i class='fa-solid fa-chevron-left'></i></a>&nbsp;&nbsp;<a href='javascript:;' id='doFu' title='Mărire literă'><i class='fa-solid fa-chevron-right'></i></a>&nbsp;&nbsp;<a href='javascript:;' id='doTd' title='Micșorare tabel'><i class='fa-solid fa-angles-left'></i></a>&nbsp;&nbsp;<a href='javascript:;' id='doTu' title='Mărire tabel'><i class='fa-solid fa-angles-right'></i></a></div>";
    sirsolutii = new Array();
    finale = new Array();
    jQuery("#knq_answer").append("<div id='1'><p style='user-select: none'>" + text + "</div>").ready(function () {
        resizeTableWS(0);
        jQuery("#doFd").bind('click', function() { doFdown(); });
        jQuery("#doFu").bind('click', function() { doFup(); });
        jQuery("#doTd").bind('click', function() { resizeTableWS(-3); });
        jQuery("#doTu").bind('click', function() { resizeTableWS(3); });
    });

    jQuery(".celula").hover(function () {
        //console.log("asupra");
        if (cuvrezolvate == nrcuvinte) return false;
        i1 = i2 = j1 = j2 = 0;
        if (clicked == "") return;
        jQuery('.linie').children().each(function (index) {
            if ((clicked != (jQuery(this).attr('id'))) && jQuery(this).attr("class") != "celula4") {
                deja = false;
                for (i = 0; i < finale.length; i++)
                    if (finale[i] == jQuery(this).attr('id'))
                        deja = true;
                if (deja) alerta('deja!')
                if (!deja) {
                    jQuery(this).removeClass(jQuery(this).attr("class"));
                    jQuery(this).addClass("celula");
                } else {
                    jQuery(this).removeClass(jQuery(this).attr("class"));
                    jQuery(this).addClass("celula4");
                }
            }
        });
        clicked2 = jQuery(this).attr('id');
        lastclicked = clicked2;
        clicked2 = clicked2.substr(1);
        sclicked2 = clicked2.split(".");
        i2 = sclicked2[0] - 0;
        j2 = sclicked2[1] - 0;
        //alert(i2+" "+j2)
        cuvant = "";
        for (i = 0; i < sirsolutii.length; i++)
            sirsolutii.pop();
        indice = 0;
        if (clicked != "") {
            clickedd = clicked.substr(1);
            sclicked = clickedd.split(".");
            i1 = sclicked[0] - 0;
            j1 = sclicked[1] - 0;
            if (i1 == i2) {
                jQuery('.linie').children().each(function (index) {
                    clicked3 = jQuery(this).attr('id');
                    clickedd3 = clicked3.substr(1);
                    sclicked3 = clickedd3.split(".");
                    i3 = sclicked3[0];
                    j3 = sclicked3[1];
                    if (j1 > j2) {
                        jj1 = j2;
                        jj2 = j1;
                    } else {
                        jj1 = j1;
                        jj2 = j2;
                    }
                    if (i3 == i1 && (j3 >= jj1) && (j3 <= jj2)) {
                        jQuery(this).removeClass(jQuery(this).attr("class"));
                        jQuery(this).addClass("celula3");
                        cuvant += jQuery(this).html();
                        sirsolutii[indice++] = clicked3;
                    }
                });
                cuvantsimplu = true;
            } else if (j1 == j2) {
                jQuery('.linie').children().each(function (index) {
                    clicked3 = jQuery(this).attr('id');
                    clickedd3 = clicked3.substr(1);
                    ;
                    sclicked3 = clickedd3.split(".");
                    i3 = sclicked3[0];
                    j3 = sclicked3[1];
                    if (i1 > i2) {
                        ii1 = i2;
                        ii2 = i1;
                    } else {
                        ii1 = i1;
                        ii2 = i2;
                    }
                    if (j3 == j1 && (i3 >= ii1) && (i3 <= ii2)) {
                        jQuery(this).removeClass(jQuery(this).attr("class"));
                        jQuery(this).addClass("celula3");
                        cuvant += jQuery(this).html();
                        sirsolutii[indice++] = clicked3;
                    }
                });
                cuvantsimplu = true;
            } else if (j1 - j2 == i1 - i2) {
                jQuery('.linie').children().each(function (index) {
                    clicked3 = jQuery(this).attr('id');
                    clickedd3 = clicked3.substr(1);
                    ;
                    sclicked3 = clickedd3.split(".");
                    i3 = sclicked3[0];
                    j3 = sclicked3[1];
                    if (i1 > i2) {
                        ii1 = i2;
                        ii2 = i1;
                    } else {
                        ii1 = i1;
                        ii2 = i2;
                    }
                    if (j1 > j2) {
                        jj1 = j2;
                        jj2 = j1;
                    } else {
                        jj1 = j1;
                        jj2 = j2;
                    }
                    if ((i3 >= ii1) && (i3 <= ii2) && (j3 >= jj1) && (j3 <= jj2) && (j3 - jj1 == i3 - ii1)) {
                        jQuery(this).removeClass(jQuery(this).attr("class"));
                        jQuery(this).addClass("celula3");
                        cuvant += jQuery(this).html();
                        sirsolutii[indice++] = clicked3;
                    }
                });
                cuvantsimplu = false;
            } else if (j1 - j2 == i2 - i1) {
                jQuery('.linie').children().each(function (index) {
                    clicked3 = jQuery(this).attr('id');
                    clickedd3 = clicked3.substr(1);
                    ;
                    sclicked3 = clickedd3.split(".");
                    i3 = sclicked3[0] - 0;
                    j3 = sclicked3[1] - 0;
                    if (i1 > i2) {
                        ii1 = i2;
                        ii2 = i1;
                    } else {
                        ii1 = i1;
                        ii2 = i2;
                    }
                    if (j1 > j2) {
                        jj1 = j2;
                        jj2 = j1;
                    } else {
                        jj1 = j1;
                        jj2 = j2;
                    }
                    if ((i3 >= ii1) && (i3 <= ii2) && (j3 >= jj1) && (j3 <= jj2) && ((j3 - 0 + i3 - 0) == (i1 - 0 + j1 - 0))) {
                        jQuery(this).removeClass(jQuery(this).attr("class"));
                        jQuery(this).addClass("celula3");
                        cuvant += jQuery(this).html();
                        sirsolutii[indice++] = clicked3;
                    }
                });
                cuvantsimplu = false;
            }
        }
        //alerta("("+i1+","+j1+")("+i2+","+j2+")"+cuvant+":::"+solutii2.length)
    });
    jQuery(".celula").select(function () {
        return false;
    });
    jQuery(".celula").mousedown(function () {
        if (cuvrezolvate == nrcuvinte) return false;
        if (!clicked) {
            jQuery(this).removeClass(jQuery(this).attr("class"));
            jQuery(this).addClass("celula3");
            clicked = jQuery(this).attr('id');
            //alert(clicked)
        } else {
            jQuery(this).removeClass(jQuery(this).attr("class"));
            jQuery(this).addClass("celula3");
            clicked = jQuery(this).attr('id');
        }
        return false;
    })

    jQuery(".celula").mouseup(function () {
        gasit = false;
        //alerta('aici '+solutii2.length);
        for (i = 0; i < solutii.length; i++) {
            //alerta("compar "+cuvant+" cu "+solutii[i]+" si cu "+reverse(solutii[i]));
            if ((solutii[i] == cuvant || (nivel != "Uşor" && reverse(solutii[i]) == cuvant)) && solutiidone[i] == 0) {
                gasit = true;
                bancul = jQuery("#knq_woswords").html();
                //alerta(cuvant+":::"+solutii[i]+":::"+solutiidone[i]+":::"+bancul);
                banculvechi = bancul;
                bancul = bancul.toUpperCase();
                //if(bancul.indexOf("<CUV><L>"+solutii2[i]+"</L></CUV>")!=-1){
                cuvrezolvate++;
                jQuery('#stadiu').text(cuvrezolvate + "/" + nrcuvinte);
                solutiidone[i] = 1;
                ba = "";
                /*for (i = 0; i < solutii.length; i++)
                    if (solutiidone[i] == 1)
                        ba += "<input type=button disabled style='opacity: 0.5;' value='" + solutii[i] + "'> ";
                    else
                        ba += "<input type=button value='" + solutii[i] + "'> ";*/
                for (i = 0; i < solutii.length; i++)
                    if (solutiidone[i] == 1)
                        ba += "<span style='text-decoration: line-through;'>" + solutii[i] + "</span> ";
                    else
                        ba += "<span>" + solutii[i] + "</span> ";
                jQuery("#knq_woswords").html(ba + "");
                if (cuvantsimplu)
                    puncte += 5;
                else
                    puncte += 10;
                //jQuery('#scor').text(puncte + "/" + punctajmaxim);
                if (cuvrezolvate == nrcuvinte) {
                    sfarsitJoc();
                    i = 0;
                    jQuery('.celula').each(function (index) {
                        i++;
                    });
                    console.log("aici am ajuns");
                    jQuery("#kqn_wswords").hide();
                    jQuery("#knq_wscontrols").hide();
                }
            }
        }
        if (gasit) {
            jQuery('.linie').children().each(function (index) {
                for (i = 0; i < sirsolutii.length; i++)
                    if (jQuery(this).attr('id') == sirsolutii[i]) {
                        jQuery(this).removeClass(jQuery(this).attr("class"));
                        jQuery(this).addClass("celula4");
                        //finale[]=sirsolutii[i];
                        finale.push(sirsolutii[i]);
                    }
            });
            //alert(finale);
        } else {
            for (i = 0; i < sirsolutii.length; i++)
                sirsolutii.pop();
            jQuery('.linie').children().each(function (index) {
                if (jQuery(this).attr("class") != "celula4") {
                    deja = false;
                    for (i = 0; i < finale.length; i++)
                        if (finale[i] == jQuery(this).attr('id'))
                            deja = true;
                    if (!deja) {
                        jQuery(this).removeClass(jQuery(this).attr("class"));
                        jQuery(this).addClass("celula");
                    } else {
                        jQuery(this).removeClass(jQuery(this).attr("class"));
                        jQuery(this).addClass("celula4");
                    }
                }
            });
        }
        lastclicked = "";
        clicked = "";
    })

    jQuery('.celula').each(function (index) {
        //jQuery(this).css("width",wwidth).css("height",hheight).css("font-size",ffont+"px");
        //hh=jQuery(this).height()-0;
        //jQuery(this).css("width",hh);
        //console.log(hh);
        //jQuery(this).css("font-size",ffont+"px");
        //console.log('1');
    });

    return text;
}

function str_replace(haystack, needle, replacement) {
    var temp = haystack.split(needle);
    return temp.join(replacement);
}

function sfarsitJoc() {
    jQuery('.linie').children().each(function (index) {
        if (jQuery(this).attr("class") != "celula") {
            jQuery(this).fadeTo(1000, 0.3);
        }
    });
    console.log("dezlegare "+dezlegare)
    if (dezlegare.trim() !== '') {
        console.log("dezlegare1 "+dezlegare)
        jQuery(".dezlegare").html("<p align=center>Ce propoziţie formează literele rămase? Scrieţi-le mai jos:<div><input type='text' class='raspuns'></div></p>")
        jQuery(".raspuns").focus();
        jQuery(".raspuns").keyup(function () {
            dezlegare2 = jQuery(".raspuns").val();
            dezlegare2 = dezlegare2.toUpperCase();
            dezlegare2 = str_replace(dezlegare2, " ", "");
            dezlegare2 = str_replace(dezlegare2, ",", "");
            dezlegare2 = str_replace(dezlegare2, ".", "");
            dezlegare2 = str_replace(dezlegare2, "?", "");
            dezlegare2 = str_replace(dezlegare2, "!", "");
            dezlegare2 = str_replace(dezlegare2, "Ţ", "T");
            dezlegare2 = str_replace(dezlegare2, "Ț", "T");
            dezlegare2 = str_replace(dezlegare2, "Ş", "S");
            dezlegare2 = str_replace(dezlegare2, "Ș", "S");
            dezlegare2 = str_replace(dezlegare2, "Ă", "A");
            dezlegare2 = str_replace(dezlegare2, "Â", "A");
            dezlegare2 = str_replace(dezlegare2, "Î", "I");
            dezlegare3 = dezlegare;
            dezlegare3 = dezlegare3.toUpperCase();
            dezlegare3 = str_replace(dezlegare3, " ", "");
            dezlegare3 = str_replace(dezlegare3, ",", "");
            dezlegare3 = str_replace(dezlegare3, ".", "");
            dezlegare3 = str_replace(dezlegare3, "?", "");
            dezlegare3 = str_replace(dezlegare3, "!", "");
            dezlegare3 = str_replace(dezlegare3, "Ţ", "T");
            dezlegare3 = str_replace(dezlegare3, "Ț", "T");
            dezlegare3 = str_replace(dezlegare3, "Ş", "S");
            dezlegare3 = str_replace(dezlegare3, "Ș", "S");
            dezlegare3 = str_replace(dezlegare3, "Ă", "A");
            dezlegare3 = str_replace(dezlegare3, "Â", "A");
            dezlegare3 = str_replace(dezlegare3, "Î", "I");
            //alert(dezlegare2)
            if (dezlegare3 == dezlegare2) {
                gasitdezlegare = true;
                jQuery(".dezlegare").html("<p align=center><b>Aţi terminat căutarea în careu!</b><div class='raspuns2'>" + dezlegare + "</div></p>")
                //jQuery(".tabelcentrat").delay(1500).fadeOut('slow');
                //jQuery("#kqn_wswords").delay(1500).fadeOut('slow');
                //jQuery(".tabelcentrat").hide();
                jQuery("#kqn_wswords").hide();
                jQuery("#knq_wscontrols").hide();
                jQuery("#knq_main_button").trigger('click');
                //postexplicatii=postexplicatii.replace("<img:","<img align=left style='padding-right:10px;' src="+calewpc+"uploads/media/"+idcautarecuv+"/")
                // jQuery(".postexplicatii").hide(1).delay(2500).html(postexplicatii + "<br clear='all'>").fadeIn('slow');
                //jQuery(".dezlegare").delay(3500).html(jQuery(".dezlegare").html()+"Dacă doriţi să citiţi...")
                // puncte += pctdezlegare;
                // jQuery('#scor').text(puncte + "/" + punctajmaxim);
                //if(idjucator>0){
                //    //alert("Salvez scor!");
                //    salvareScor();
                //}
            }
            return false;
        });
    }
    else {
        jQuery(".dezlegare").html("<p align=center><b>Aţi terminat căutarea în careu!</b></p>");
        jQuery("#knq_main_button").trigger('click');
    }
}


function randOrd() {
    return (Math.round(Math.random()) - 0.5);
}

function reverse(s) {
    return s.split("").reverse().join("");
}