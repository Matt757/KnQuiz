function buildCrossWord(answers){
	        var height = jQuery(window).height();
		var width = jQuery(window).width();
        jQuery("#container").css({'left' : (width/2-490),'top' : 135});
		/*jQuery('#ajutor').dialog({
			modal: true,
			autoOpen: false,
			width: 600,
			height: 300,
			buttons: {
				"Ok": function() {
					jQuery(this).dialog("close"); 
					}
			}
		});
        jQuery('#textdefinitii').dialog({
			modal: false,
			autoOpen: false,
			width: 500,
			height: 500,
			buttons: {
				"Ok": function() {
					jQuery(this).dialog("close"); 
					}
			},
            close: function(){
                //alert(111)
                jQuery(".forminside").each(function(){
                   cont=jQuery(this).val();
                   id=jQuery(this).attr("id");
                   //alert(cont);
                   jQuery('body').data(id,cont); 
                });
            }
		});*/
		cuvgasite=0;nrcuvinte=0;
		initializari();
		
        jQuery('#stadiu').text(cuvgasite+"/"+nrcuvinte);
        //jQuery("#progressbar").progressbar({value: 0});
        //jQuery("button").button();
        jQuery("button#verifica").click(function(){ AmRaspuns(); });
        jQuery("button#verifica").keypress(function (event){ return false;});
        jQuery("button#bajutor").click(function(){ jQuery('#ajutor').dialog('open'); });
        jQuery("button#bajutor").keypress(function (event){ return false;});
        jQuery("button#bstart").click(function(){ document.location=caleinapoi; });
        jQuery("button#bstart").keypress(function (event){ return false;});
        /*jQuery("button#btextdefinitii").click(function(){
            lista="<p>Puteţi ţine această fereastră deschisă, să o redimensionaţi şi mutaţi pe ecran unde doriţi, dar nu e obligatoriu";
            if((tip-0)==1){
                lista+=".</p>";
                if(defin[0].substr(0,3)=="[[["){
                    lista+="<p>"+defin[0].substr(3,defin[0].indexOf("]]]")-3)+"</p>";
                    defin[0]=defin[0].substr(defin[0].indexOf("]]]")+3)
                }
                //alert("aaaa"+defin.length);
                if(defin.length>1){
                    lista+="<br><table width=100%>";
                    for(i=0;i<defin.length;i++){
                        valoare=""+jQuery('body').data("camp"+i)
                        if(valoare=="undefined")
                            valoare="";
                        lista+="<tr><td class=td4>"+defin[i]+"</td><td class=td4><input type=text class=forminside id=camp"+i+" value='"+valoare+"'></td><td id=spatiu"+i+" class=td4>"+valoare.length+"</td></tr>";
                    }
                    lista+="</table>"
                }
                else
                    lista+=defin[0];
            }
            else {
                lista+=": fiecare definiţie în parte este afişată când daţi click pe un pătrat din oricare cuvânt din rebus.</p>";
                for(i=0;i<defin.length;i++)
                    lista+="<b>"+(i+1)+"</b>. "+defin[i]+"<br>";
                lista+="</ol>"
            }
            jQuery('#textdefinitii').html(lista);
            jQuery('.forminside').bind('keyup',function(){
            //jQuery('.td4').delegate('.forminside','keyup',function(){
                cont=jQuery(this).val();
                id=jQuery(this).attr('id');
                id="spatiu"+id.replace("camp","");
                jQuery("#"+id).html(cont.length);
                //alert(id+" "+cont);
            })
            jQuery('#textdefinitii').dialog('open');
            if(!oprire)
                jQuery(".inputcelula").each(function(){
                    jQuery(this).parent().css('background-color','#ffffff');
                });
            //jQuery('#panou1').html('<img src='+caleajax+'/images/bufnita.png>');
        });*/
        jQuery("button#btextdefinitii").keypress(function (event){ return false;});
        jQuery(document).keydown(function(objEvent) {
            if (objEvent.keyCode == 9) {  //tab pressed
                objEvent.preventDefault(); // stops its action
            }
            if (objEvent.keyCode == 13) {  //tab pressed
                objEvent.preventDefault(); // stops its action
            }
            if (objEvent.keyCode == 27) {  //esc pressed
                jQuery("button#bnustiu").trigger('click');
                /*jQuery(".inputcelula").each(function(){
                    jQuery(this).parent().css('background-color','#ffffff');
                });*/
            }
        })
        jQuery("td#celulagoala").click(function(){
            if(oprire) return;
            jQuery(".inputcelula").each(function(){
                jQuery(this).parent().css('background-color','#ffffff');
            });
            //jQuery('#panou1').html('<img src='+caleajax+'/images/bufnita.png>');
        });
        jQuery(".inputcelulaa").change(function(){
            camp=jQuery(this).val();
            cuv=camp.toUpperCase();
            cuv=cuv.replace(/Â/g,"A");
            cuv=cuv.replace(/Ă/g,"A");
            cuv=cuv.replace(/Î/g,"I");
            cuv=cuv.replace(/Ş/g,"S");
            cuv=cuv.replace(/Ţ/g,"T");
            cuv=cuv.replace(/Ș/g,"S");
            cuv=cuv.replace(/Ț/g,"T");
            jQuery(this).val(cuv.substr(0,1));
            //alert(cuv.substr(0,1));
            
        });
        jQuery(".inputcelula").keydown(function(objEvent){
            if (objEvent.keyCode == 9) {  //tab pressed
                objEvent.preventDefault(); // stops its action
            }
            else {
                //camp=jQuery(this).val();
                //if(camp.length>1) return;
            }
        });
        jQuery(".inputcelula").keyup(function(objEvent){
            if(objEvent.keyCode>100) return;
            if(oprire) return;
            camp=jQuery(this).val();
            cuv=camp.toUpperCase();
            cuv=cuv.replace(/Â/g,"A");
            cuv=cuv.replace(/Ă/g,"A");
            cuv=cuv.replace(/Î/g,"I");
            cuv=cuv.replace(/Ş/g,"S");
            cuv=cuv.replace(/Ţ/g,"T");
            cuv=cuv.replace(/Ș/g,"S");
            cuv=cuv.replace(/Ț/g,"T");
            camp=cuv.substr(0,1);
            jQuery(this).val(camp);
            
            
            camp=jQuery(this).val();
            //alert(camp+" "+camp.length);
            id1=jQuery(this).attr("id");
            if(camp.length>0){
                if(camp.length>1)
                    jQuery(this).val(camp.substr(0,1));
                camp=camp.substr(0,1);
                camp=camp.toUpperCase();
                litere="QWERTYUIOPLKJHGFDSAMNBVCXZŞŢĂÎÂȘȚ";
                if(litere.indexOf(camp)==-1){
                    jQuery(this).val('');
                    //alert('niet!'+litere.indexOf(camp));
                }
                else {
                    /*opreste=false;
                    jQuery('.inputcelula').each(function(index) {
                        d1=''+jQuery(this).parent().css('background-color')
                        d2=''+'rgb(254, 240, 148)'
                        id2=jQuery(this).attr("id");
                        //alert(d1+" "+d2+" "+id1+" "+id2)
                        if(d1==d2){
                            if(opreste){
                                salttab=jQuery(this);
                                salttabprev=salttabtemp;
                                //jQuery(this).focus();
                                //stop=true;
                                opreste=false;
                            }
                            if(id1==id2)
                                opreste=true;
                            //alert(1);
                        }
                        salttabtemp=jQuery(this);
                    });*/
                }
            }
            verificare();
            opreste=false;
            salttabtemp=null;
            salttab=null;
            jQuery('.inputcelula').each(function(index) {
                d1=''+jQuery(this).parent().css('background-color')
                d2=''+'rgb(254, 240, 148)'
                id2=jQuery(this).attr("id");
                //alert(d1+" "+d2+" "+id1+" "+id2)
                if(d1==d2){
                    if(opreste){
                        salttab=jQuery(this);
                        //alert(salttabtemp.val())
                        //jQuery(this).focus();
                        //stop=true;
                        opreste=false;
                    }
                    if(id1==id2){
                        opreste=true;
                        salttabprev=salttabtemp;
                        //if(salttabtemp!=null)
                        //alert(salttabtemp.attr('rel'))
                        //alert(1);
                    }
                    salttabtemp=jQuery(this);
                }
                
            });
            if(objEvent.shiftKey && objEvent.keyCode == 9){
                if(salttabprev!=null)
                    salttabprev.focus();
                //alert(1);
            }
            else if(objEvent.keyCode==9){
                //objEvent.preventDefault();
                if(salttab!=null)
                    salttab.focus();
            }
            else {
                //jQuery(this).focus();
                camp=jQuery(this).val();
                if(salttab!=null && !objEvent.shiftKey && objEvent.keyCode!=9 && objEvent.keyCode!=37 && objEvent.keyCode!=38 && objEvent.keyCode!=39 && objEvent.keyCode!=40 && objEvent.keyCode!=13 && objEvent.keyCode!=46 && objEvent.keyCode!=8 && objEvent.keyCode!=16)
                    salttab.focus();
                else
                    jQuery(this).focus();
            }
        });
        
        jQuery(".inputcelula").click(function(){
            if(jQuery(this).css('readonly')=='readonly') return;
            if(oprire) return;
            clasa=jQuery(this).attr("class");
            clasa=clasa.replace("inputcelula ","");
            catesunt=0;
            if(clasa.indexOf(" ")==-1){
                jQuery(".inputcelula").each(function(){
                    jQuery(this).parent().css('background-color','#ffffff');
                });
                jQuery("."+clasa).each(function(){
                    jQuery(this).parent().css('background-color','#fef094');
                    catesunt++;
                });
                nr=clasa.replace("numero","")-0; 
            }
            else {
                clase=clasa.split(" ");
                //alert(clase[0]+" "+clase[1])
                rosu1=false;
                clasaorig=jQuery(this).attr("class");
                jQuery("."+clase[0]).each(function(){
                    clasanoua=jQuery(this).attr("class");
                    d1=''+jQuery(this).parent().css('background-color')
                    d2=''+'rgb(254, 240, 148)'
                    if(clasaorig!=clasanoua)
                        if(d1==d2)
                            rosu1=true;
                    nr=clase[0].replace("numero","")-0;
                });
                rosu2=false;
                jQuery("."+clase[1]).each(function(){
                    clasanoua=jQuery(this).attr("class");
                    d1=''+jQuery(this).parent().css('background-color')
                    d2=''+'rgb(254, 240, 148)'
                    if(clasaorig!=clasanoua)
                        if(d1==d2)
                            rosu2=true;
                });
                if(!rosu1){
                    if(!rosu2){
                        jQuery("."+clase[0]).each(function(){
                            jQuery(this).parent().css('background-color','#fef094');
                            catesunt++;
                        });
                    }
                    else {
                        //alert('demarc horiz, marc vertic '+rosu1+" "+rosu2);
                        jQuery(".inputcelula").each(function(){
                            jQuery(this).parent().css('background-color','#ffffff');
                        });
                        jQuery("."+clase[0]).each(function(){
                            jQuery(this).parent().css('background-color','#fef094');
                            catesunt++;
                        });
                        nr=clase[0].replace("numero","")-0;
                    }
                }
                else {
                    //alert('demarc vertic, marc horiz '+rosu1+" "+rosu2);
                    jQuery(".inputcelula").each(function(){
                        jQuery(this).parent().css('background-color','#ffffff');
                    });
                    jQuery("."+clase[1]).each(function(){
                        jQuery(this).parent().css('background-color','#fef094');
                        catesunt++;
                    });
                    nr=clase[1].replace("numero","")-0;
                }
            }
            if((tip-0)==1)
                textpanou="Aici trebuie să scrieţi un cuvânt de "+catesunt+" litere, care să corespundă la una dintre definiţii.";
            else
                textpanou="<p><b>"+(nr)+":</b> "+defin[nr-1]+"</p>";
            //alert(nustiuri);
            if(!nustiuri[nr-1])
                textpanou+="<p align=center><small><button id='bnustiu'>Ufff... Nu ştiu!</button></small></p>"
            jQuery("#qkn_feedback").html(textpanou);
            //jQuery("button#bnustiu").button();
            jQuery("button#bnustiu").click(function(){ nustiu(nr); });
        });
        verificare();
}

function norom(cuv){
        cuv=cuv.toUpperCase();
        cuv=cuv.replace(/Â/g,"A");
        cuv=cuv.replace(/Ă/g,"A");
        cuv=cuv.replace(/Î/g,"I");
        cuv=cuv.replace(/Ş/g,"S");
        cuv=cuv.replace(/Ţ/g,"T");
        cuv=cuv.replace(/Ș/g,"S");
        cuv=cuv.replace(/Ț/g,"T");
        return cuv;
    }
    
    function nustiu(nr){
        //alert(nr);
        jQuery(".numero"+nr).each(function(){
            jQuery(this).parent().css('background-color','#ccffff');
            rel=jQuery(this).attr('rel');
            sirrel=rel.split("_");
            linii=careu.split("#");
            liniamea=linii[sirrel[0]-1];
            literelemele=liniamea.split("|")
            //alert(liniamea+" "+literelemele[sirrel[1]-1])
            jQuery(this).val(norom(literelemele[sirrel[1]-1]));
            jQuery(this).attr('readonly','readonly');
        });
        if(!nustiuri[nr-1]){
            nustiuri[nr-1]=true;
            minusgreseli=(minusgreseli-0)+(punctaj-0);
        }
        //alert(minusgreseli)
        verificare();
    }
	
    function verificare(){
        if(oprire) return;
        //alert(1);
        cuvgasite=0;
        for(i=1;i<=dezleg.length;i++){
        //for(i=1;i<=1;i++){
            cuv="";
            jQuery(".numero"+i).each(function(){
                cuv+=jQuery(this).val();
            })
            //alert(cuv);
            cuv=cuv.toUpperCase();
            cuv=cuv.replace(/Â/g,"A");
            cuv=cuv.replace(/Ă/g,"A");
            cuv=cuv.replace(/Î/g,"I");
            cuv=cuv.replace(/Ş/g,"S");
            cuv=cuv.replace(/Ţ/g,"T");
            cuv=cuv.replace(/Ș/g,"S");
            cuv=cuv.replace(/Ț/g,"T");
            cuv2=dezleg[i-1];
            cuv2=cuv2.toUpperCase();
            cuv2=cuv2.replace(/Â/g,"A");
            cuv2=cuv2.replace(/Ă/g,"A");
            cuv2=cuv2.replace(/Î/g,"I");
            cuv2=cuv2.replace(/Ş/g,"S");
            cuv2=cuv2.replace(/Ţ/g,"T");
            cuv2=cuv2.replace(/Ș/g,"S");
            cuv2=cuv2.replace(/Ț/g,"T");
            //console.log(cuv+" - "+cuv2)
            if(cuv==cuv2){
				//console.log("GASIT!!! "+cuv);
                //alert(cuv);
                cuvgasite++;
                jQuery(".numero"+i).each(function(){
                    jQuery(this).parent().css('background-color','#ffffff');
                    jQuery(this).parent().css('border','1px solid black');
                    jQuery(this).attr('readonly','readonly');
                    //jQuery(this).attr('disabled','disabled');
                });
                nustiuri[i-1]=true;
            }   
        }
        punctajmaxim=punctaj*dezleg.length+posibilbonus;
        puncte=(punctaj*cuvgasite)-(minusgreseli-0)+(bonus-0);
        jQuery('#stadiu').text(cuvgasite+"/"+nrcuvinte);
        //jQuery("#progressbar").progressbar({value: (cuvgasite*100/nrcuvinte)});
        jQuery('#scor').text(puncte+"/"+punctajmaxim);
        if(cuvgasite==nrcuvinte){//nrcuvinte
            jQuery(".inputcelula").each(function(){
                jQuery(this).parent().css('background-color','#ffffff');
                jQuery(this).attr('readonly', 'readonly');
            });
            oprire=true;
            if(extra!=""){
                sire=extra.split(" ");
                //alert(extra);
                //alert(sire);
                for(u=0;u<sire.length-2;u++){
                    per=sire[u];
                    per=per.replace("[","");
                    per=per.replace("]","");
                    poz=per.split(",");
                    //alert(poz[0]+" "+poz[1])
                    jQuery(".inputcelula").each(function(){
                        rel=jQuery(this).attr("rel");
                        if(rel==(poz[0]+"_"+poz[1])){
                            jQuery(this).parent().css('background-color','#467BA0');
                            jQuery(this).css('color','#ffffff');
                        }
                    });
                }
                per=sire[sire.length-2];
                //alert(per);
                per=per.replace("[","");
                per=per.replace("]","");
                explic=sire[sire.length-1];
                explic=explic.replace("[","");
                explic=explic.replace("]","");
                explic=explic.replace(/_/g," ");
                //alert(per);
                sirtxt="<div style='text-align:center;font-size:18px;color:#6A9CC0;font-weight:bold;'>";
                indic=1;degasit="";
                for(s=0;s<per.length;s++){
                    if(per[s]=="#") sirtxt+="&nbsp;&nbsp;&nbsp;&nbsp;";
                    else if("QWERTYUIOPASDFGHJKLYXCVBNM".indexOf(per[s])!=-1) {sirtxt+="<input type=text autocomplete='off' class=inputcelula2 style='padding:0px;' id='indic"+(indic++)+"'>&nbsp;";
                    degasit+=per[s];                    
                    }                    
                    else sirtxt+=per[s];
                    
                }
                sirtxt+="</div>";
                oprire2=false;
                //jQuery(".inputcelula2").keyup(function(){
				//console.log("felic");
                jQuery("#knq_feedback").html("<p><strong>Felicitări!</strong> Aţi rezolvat corect "+(minusgreseli>0?"":"întreg")+" rebusul! Acum mai aveţi un singur lucru de făcut. Mai sus aveţi câteva pătrate evidenţiate (fundal albastru închis şi text alb), fiecare cu câte o literă. "+explic+"</p><p align=center>"+sirtxt+"</p>");
				jQuery("#knq_feedback").show();
                jQuery('.inputcelula2').bind('keyup', function() {
                    if(oprire2) return;
                    camp=jQuery(this).val();
                    //alert(camp+" "+camp.length);
                    id1=jQuery(this).attr("id");
                    if(camp.length>0){
                        if(camp.length>1)
                            jQuery(this).val(camp.substr(0,1));
                        indic=jQuery(this).attr('id');
                        indic=indic.replace("indic","")-0;
                        indic++;
                        jQuery("#indic"+indic).focus();
                    }
                    acumgasit="";
                    for(i=1;i<=degasit.length;i++)
                        acumgasit+=jQuery("#indic"+i).val();
                    degasit=degasit.toUpperCase();
                    degasit=degasit.replace(/Â/g,"A");
                    degasit=degasit.replace(/Ă/g,"A");
                    degasit=degasit.replace(/Î/g,"I");
                    degasit=degasit.replace(/Ş/g,"S");
                    degasit=degasit.replace(/Ţ/g,"T");
                    degasit=degasit.replace(/Ș/g,"S");
                    degasit=degasit.replace(/Ț/g,"T");
                    acumgasit=acumgasit.toUpperCase();
                    acumgasit=acumgasit.replace(/Â/g,"A");
                    acumgasit=acumgasit.replace(/Ă/g,"A");
                    acumgasit=acumgasit.replace(/Î/g,"I");
                    acumgasit=acumgasit.replace(/Ş/g,"S");
                    acumgasit=acumgasit.replace(/Ţ/g,"T");
                    acumgasit=acumgasit.replace(/Ș/g,"S");
                    acumgasit=acumgasit.replace(/Ț/g,"T");
                    if(degasit==acumgasit){
                        //alert('Bravo! Chiar gata!');
                        //alert(defin.length);
                        jQuery("#knq_feedback").append("<p><strong>Încă o dată felicitări!</strong> Aţi rezolvat corect şi provocarea suplimentară. Şi acum să revedem "+(defin.length==1?"textul":"definiţiile, cu soluţiile lor")+".</p>"+feedback);
                        oprire2=true;
                        bonus=posibilbonus;
                        //alert(minusgreseli);
                        punctajmaxim=punctaj*dezleg.length+posibilbonus;
                        puncte=(punctaj*cuvgasite)-(minusgreseli-0)+(bonus-0);
                        jQuery('#stadiu').text(cuvgasite+"/"+nrcuvinte);
                        //jQuery("#progressbar").progressbar({value: (cuvgasite*100/nrcuvinte)});
                        jQuery('#scor').text(puncte+"/"+punctajmaxim);
                        for(i=1;i<=degasit.length;i++){
                            jQuery("#indic"+i).attr('readonly','readonly');
                            jQuery("#indic"+i).attr('disabled','disabled');
                        }
                        //salvareScor();
                    }
                });
            }
            else{
				//console.log("fel2");
                jQuery("#knq_feedback").html("<p><strong>Felicitări!</strong> Aţi rezolvat corect "+(minusgreseli>0?"":"întreg")+" rebusul! Să revedem definiţiile, cu soluţiile lor.</p>"+feedback); 
				jQuery("#knq_feedback").show();
			}
            //jQuery('#panou1').html('<img src='+caleajax+'/images/bufnita.png>');
            //jQuery('html,body').animate({scrollTop:'+='+jQuery('#final').offset().top+'px'},'fast');
        }
        //jQuery("#progressbar").focus();
        //salvareScor();
    }
    
	function initializari(){
		
		//PANA NU IA DATELE DIN BD
		timpscurs=0
		careu="|||||||3|||||13||||||#||||8||14|C|O|I|F|U|L||||||#||||M|||O|||10||U||1||||#||||Â|||L|||B||P||C||||#||5||N|7|M|I|N|Ţ|I||T||U||||#||M||T||9|B|||N||A||V|||12|#2|P|O|R|U|N|C|E|Ş|T|E||||I|||Î|#||A||I||R||11||L||||N|||N|#||R||T||I|4|G|R|E|Ş|E|Ş|T|E||V|#||T||||S||H||||||E|||I|#||E||||T||I|||||6|L|Ă|S|A|T#||||||O||M||||||E|||T|#||||||S||P||||||||||#||||||||E||||||||||";
		careu="|||3||#1|P|A|T|R|U#|||R||#|||E||#2|D|O|I||";
		careu2="||||||||||||||||||#|||||||14 3|14|14|14|14|14 13||||||#||||8|||3|||||13||||||#||||8|||3|||10||13||1||||#||||8||7|7 3|7|7|7 10||13||1||||#||5||8|||3|||10||13||1||||#|2|2 5|2|2 8|2|2 9|2 3|2|2|2 10||||1|||12|#||5||8||9||||10||||1|||12|#||5||8||9||4 11|4|4 10|4|4|4|4 1|4||12|#||5||||9||11||||||1|||12|#||5||||9||11||||||6 1|6|6|6 12|6#||||||9||11||||||1|||12|#||||||9||11||||||||||#||||||||11||||||||||";
		careu2="|||||#|1|1|1 3|1|1#|||3||#|||3||#|2|2|2 3||";
celula="35";
definitii="Doamne, la cine să mergem? Tu ai [...] vieţii veşnice! (Ioan 6, 68)|Doamne, dacă eşti Tu, [...] să vin la Tine pe apă. (Matei 14,28)|Învăţătorule, e bine că suntem aici; să facem trei [...]. (Marcu 9,5)|Doamne, de câte ori să-l iert pe fratele meu care [...] împotriva mea? (Matei 18,21)|Doamne, sunt gata să merg cu Tine şi la închisoare şi la [...]. (Luca 22,33)|Iată, noi am [...] toate şi te-am urmat. (Luca 18,28)|Anania, de ce ţi-a umplut satana inima ca să-l [...] pe Duhul Sfânt? (Fapte 5,3)|Crede în Domnul Isus şi vei fi [...] tu şi casa ta. (Fapte 16,31)|Nu mai trăiesc eu, ci [...] trăieşte în mine. (Galateni 2,20)|Nu fac [...] pe care îl vreau, ci săvârşesc răul pe care nu-l vreau. (Romani 7,19)|Ca să nu fiu umplut de îngâmfare mi-a fost dat un [...] în trup. (2Corinteni 12,7)|Dacă Cristos nu a [...], zadarnică este predica noastră. (1Corinteni 15,14)|Am luptat [...] cea bună, am ajuns la capătul alergării. (2Timotei 4,7)|Luaţi şi [...] mântuirii şi sabia duhului care este cuvântul lui Dumnezeu. (Efeseni 6,17)";
definitii="Definiţie pentru PATRU|Definiţie pentru DOI|Definiţie pentru TREI";
dezlegare="CUVINTELE|PORUNCEŞTE|COLIBE|GREŞEŞTE|MOARTE|LĂSAT|MINŢI|MÂNTUIT|CRISTOS|BINELE|GHIMPE|ÎNVIAT|LUPTA|COIFUL";
dezlegare="PATRU|DOI|TREI";
punctaj="5";
feedback="Apostolul Petru:<br>1. Doamne, la cine să mergem? Tu ai <b>cuvintele</b> vieţii veşnice! (Ioan 6, 68)<br>2. Doamne, dacă eşti Tu, <b>porunceşte</b> să vin la Tine pe apă. (Matei 14,28)<br>3. Învăţătorule, e bine că suntem aici; să facem trei <b>colibe</b>. (Marcu 9,5)<br>4. Doamne, de câte ori să-l iert pe fratele meu care <b>greşeşte</b> împotriva mea? (Matei 18,21)<br>5. Doamne, sunt gata să merg cu Tine şi la închisoare şi la <b>moarte</b>. (Luca 22,33)<br>6. Iată, noi am <b>lăsat</b> toate şi te-am urmat. (Luca 18,28)<br>7. Anania, de ce ţi-a umplut satana inima ca să-l <b>minţi</b> pe Duhul Sfânt? (Fapte 5,3)<br><br>Apostolul Paul:<br>8. Crede în Domnul Isus şi vei fi <b>mântuit</b> tu şi casa ta. (Fapte 16,31)<br>9. Nu mai trăiesc eu, ci <b>Cristos</b> trăieşte în mine. (Galateni 2,20)<br>10. Nu fac <b>binele</b> pe care îl vreau, ci săvârşesc răul pe care nu-l vreau. (Romani 7,19)<br>11. Ca să nu fiu umplut de îngâmfare mi-a fost dat un <b>ghimpe</b> în trup. (2Corinteni 12,7)<br>12. Dacă Cristos nu a <b>înviat</b>, zadarnică este predica noastră. (1Corinteni 15,14)<br>13. Am luptat <b>lupta</b> cea bună, am ajuns la capătul alergării. (2Timotei 4,7)<br>14. Luaţi şi <b>coiful</b> mântuirii şi sabia duhului care este cuvântul lui Dumnezeu. (Efeseni 6,17)";
extra="[2,2] [2,3] [3,2] [4,4] [5,4] [PAIE] [Aşezaţi_corect_mai_jos_respectivele_litere_pentru_a_completa_ce_le-a_spus_Isus:_lui_Petru_-_&quot;Nu_te_teme,_de_acum_înainte_vei_fi_..._de_oameni&quot;_(Luca_5,10);_respectiv_lui_Paul:_&quot;Îţi_este_suficient_..._Meu,_căci_puterea_Mea_se_arată_în_slăbiciune&quot;_(2Corinteni_12,9).]";
//extra="";
tip="0"
		
		
        textcw="<div align='center'><table class='tabelcentrat' id='tabelcentrat' cellspacing=0 cellpadding=0 style='margin:0px;padding:0px;border:0px;'>";
        defin=definitii.split("|");
        dezleg=dezlegare.split("|");
        nustiuri=new Array();
        for(i=0;i<dezleg.length;i++) nustiuri[i]=false;
        nrcuvinte=defin.length;
        if(nrcuvinte==1){
            //alert(defin);
            sc=defin[0].split("@");
            defin[0]=sc[0];
            nrcuvinte=sc[1];
            //alert(nrcuvinte);
        }
        linii=careu.split("#");
        linii2=careu2.split("#");
        //alert(linii.length);
        u=1;
        for(i=0;i<linii.length;i++){
            textcw+="<tr>";
            celule=linii[i].split("|");
            celule2=linii2[i].split("|");
            for(j=0;j<celule.length;j++){
                //alert(celule[j]);
                if(celule[j]=="")
                    textcw+="<td style='width:"+celula+"px;height:"+celula+"px;padding:0px' id='celulagoala' class='tdcelula'>&nbsp;</td>"
                else{
                    x=celule[j]-0;
                    if(x>0)
                        textcw+="<td style='width:"+celula+"px;height:"+celula+"px;color:#999999;' id='celulagoala' class='tdcelula' title='"+defin[x-1]+"'><strong>"+(defin.length==1?"":x)+"</strong></td>";
                    else {
                        clasacel="";
                        cl=celule2[j].split(" ");
                        for(k=0;k<cl.length;k++)
                            clasacel+="numero"+cl[k]+" ";
                        clasacel=jQuery.trim(clasacel);
                        textcw+="<td style='width:"+celula+"px;height:"+celula+"px;padding:0px !important;margin:0px !important;border-collapse: collapse;' class='tdcelulaf'><input id='id"+(u++)+"' type=text autocomplete='off' style='width:"+celula+"px;height:"+celula+"px;padding:0px !important;margin:0px !important; border:0px !important;border-collapse: collapse;background: transparent;' rel='"+(i+1)+"_"+(j+1)+"' class='inputcelula "+clasacel+"' value='' maxlength=1></td>";
                        //textcw+="<td style='width:"+celula+"px;height:"+celula+"px;background-color:#"+color_neutral+"' class='tdcelulaf' id='id"+(u++)+"' rel='"+(i+1)+"_"+(j+1)+"' class='inputcelula "+clasacel+"'></td>";
                    }
                }
            }
            textcw+="</tr>";
        }
        textcw+="</table></div>";
		jQuery("#knq_answer").append("<div id='1'><p style='user-select: none'>" + textcw + "</p></div>").ready(function () {resizeTableCW();
		jQuery('#celulagoala').on({
  "click": function() {
	  console.log("aici");
    jQuery(this).tooltip({ items: "#celulagoala", content: "Displaying on click"});
    jQuery(this).tooltip("open");
  },
  "mouseout": function() {      
  console.log("aici2");
     jQuery(this).tooltip("disable");   
  }
});
		});
	    /*verdictfinal=""
        parcursfinal=""
		sir=""
		fb=""
		vf=""
		optiuni=""
		
		puncte=0
		pj=0*/
        bonus=0
        if(extra.length>1)
            posibilbonus=punctaj*3
        else
            posibilbonus=0
		curent=0
		cate=0
		punctajmaxim=0
        puncte=0
		tipint=0
		oprire=false
        cuvgasite=0
        minusgreseli=0
		/*corecte=0
		intrebare2=""
		fb2=""
		vf2=""
		optiuni2=""
		pj2=0
		tipint2=0
		max5options=0
		max5options2=0
		intrebari=new Array()
		raspunsuri=new Array()
		raspunsuri2=new Array()
		
        curent=1
        potRaspuns=false
        mergiMaiDeparte=false
        scol1=0.5
        scol2=0.5
        pasulcurent=0*/
		//text="Salut!"
        //verificare()
	}
	
function resizeTableCW(cat) {
	//jQuery('#tabelcentrat').width("100px");
	//jQuery('#tabelcentrat').height("100px");
	min=0;
	jQuery(".tdcelula").each(function(){
		w=parseInt(jQuery(this).width());
		h=parseInt(jQuery(this).height());
		if(w>min) min=w;
		if(h>min) min=h;
		//console.log(w+" "+h+"="+min)
		//jQuery(this).width("20px");
		//jQuery(this).height("20px");
	});
	//console.log("max e "+min);
	//min=30;
	min+=cat;
	//min=40;
	//min=200;
	jQuery(".tdcelula").each(function(){
		jQuery(this).width(min+"px");
		jQuery(this).height(min+"px");
	});
	jQuery('#tabelcentrat').width((10*min)+"px");
	jQuery('#tabelcentrat').height((10*min)+"px");
	
    /*ht = parseInt(jQuery('#tabelcentrat').height(), 10);
    wt = parseInt(jQuery('#tabelcentrat').width(), 10);
    //console.log(ht+" * "+wt);
	//ht=30;wt=30;
    if (ht > wt) jQuery('#tabelcentrat').height(wt + "px"); else jQuery('#tabelcentrat').width(ht + "px");*/
}
    
	function timpul(){
		var start = new Date;
		timpscurs=0
		timpinutil=0
		depozit=0
		setInterval(function() {
			if(curent<=cate && !oprire){
                timpscurs=0;
				timpscurs=(new Date - start)/1000+depozit;
                timpscurs=1*(timpscurs-0);
                if((timpscurs+"=")=="NaN=")
                    timpscurs=0;
				minute=Math.floor(timpscurs/60)-0;
				if(minute<10) minute="0"+1*minute;
				secunde=Math.floor(timpscurs-minute*60)-0;
				if(secunde<10) secunde="0"+1*secunde;
                if((minute+":"+secunde)=="NaN:NaN")
                    alert("buhuhu!"+timpscurs)
				jQuery('#ceas').text(minute+":"+secunde);
                //addEnter();
			}
			if(curent<=cate && oprire){
				depozit=timpscurs;
				start = new Date
			}
		}, 1000);
	}
    
    function alerta(text){
        //(".alerta").html(text)
    }
    
    function salvareScor(){
        jQuery.ajax({
            type: "POST",
            url: "ajaxsalvarescor.php",
            data: "idjoc=rb_"+1+"&puncte="+puncte+"&timpscurs="+timpscurs+"&idjucator="+1,
            success: function(msg){
                rsp="";
                if(msg.indexOf("DA1")!=-1)
                    rsp="<p><b>Scorul Dvs a fost salvat!</b></p>";
                else if(msg.indexOf("DA2")!=-1)
                    rsp="<p><b>Scorul Dvs a fost actualizat, cel curent fiind mai bun!</b></p>";
                //jQuery("#optiuni").html(rsp+jQuery("#optiuni").html());
            }
        });
    }