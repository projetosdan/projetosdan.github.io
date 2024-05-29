var liq1 = 0;
var liq2 = 0;

function updateQuali(form, classs) {
    var alloptions = Array("Exigência minima", "Graduação", "Especialização", "Mestrado", "Doutorado");
    var allvalues = Array(0, 1, 2, 3, 4);
    var newoptions = Array();
    var newvalues = Array();
    var curValue = form.ddQuali.value;
    var classe = parseInt(classs, 10);
    if (classe == 0) {
        newoptions = alloptions.slice(0, alloptions.length);
        newvalues = allvalues.slice(0, alloptions.length);
        newoptions.splice(2, alloptions.length);
        newvalues.splice(2, allvalues.length);
    } else if (classe == 1 || classe == 2) {
        newoptions = alloptions.slice(0, alloptions.length);
        newvalues = allvalues.slice(0, alloptions.length);
        newoptions.splice(1, 1);
        newvalues.splice(1, 1);
    }
    while (form.ddQuali.options.length) form.ddQuali.options[0] = null;
    for (i = 0; i < newoptions.length; i++) {
        // Create a new drop down option with the
        // display text and value from arr
        option = new Option(newoptions[i], newvalues[i]);
        // Add to the end of the existing options
        form.ddQuali.options[form.ddQuali.length] = option;
    }
    if (newvalues.includes(parseInt(curValue, 10))) {
        form.ddQuali.value = curValue;
    }
    calcSalario(form);
}

function firstload() {
    updateQuali(myform, 1);
    updateQuali(myform2, 1);
}

function formatValor(valor) {
    //var intRegex = /^\d+$/;
    return "R$ " + valor.toFixed(2).replace(".", ",");
}

function valorIRRF(base, periodo) {
    var aliquota = 0;
    if (periodo == 1) {
    } else {
        // Ano 2024
        if (base < 2259.20) {
            aliquota = 0;
        } else if (base < 2826.65) {
            aliquota = base * 0.075 - 169.44;
        } else if (base < 3751.05) {
            aliquota = base * 0.15 - 381.44;
        } else if (base < 4664.68) {
            aliquota = base * 0.225 - 662.77;
        } else {
            aliquota = base * 0.275 - 896.00;
        }
    }
    return Math.floor(aliquota * 100) / 100;
}

function calcPSS(periodo, base) {
    var valor = 0;
    if (periodo == 0) {
        valor = base * 0.11;
    } 
    else if (periodo > 1) {
       if (base <= 1412.0) {
            //salario minimo
            valor = 0.075 * base;
        } else if (base <= 2666.68) {
            valor = (base - 1412.0) * 0.09 + 112;
        } else if (base <= 4000.03) {
            valor = (base - 2666.68) * 0.12 + 218.82;
        } else if (base <= 7786.02) {
            //teto
            valor = (base - 4000.03) * 0.14 + 378.82;
        } else if (base <= 13333.48) {
           valor = (base - 7786.02) * 0.145 + 908.86;
        } else if (base <= 26666.94) {
            valor = (base - 13333.48) * 0.165 + 1713.24;
        } else if (base <= 52000.54) {
            valor = (base - 26666.94) * 0.19 + 3913.26;
        } else {
            valor = base * 0.22;
        }
       // valor = base * 0.145;
    }
    return Math.floor(valor * 100) / 100;
}

function dependentesIR(deps, periodo) {
    var aliq = 0;
    //var deps = 0;
    if (periodo == 1) {
        // Ano 2013
        aliq = deps * 171.97;
    } else if (periodo <= 4) {
        //Entre 2014 e 02/2015
        aliq = deps * 179.71;
    } else {
        aliq = deps * 189.59;
    }
    return Math.floor(aliq * 100) / 100;
}

function dependentesFunben(deps) {
    var aliq = deps * 0.01;
    return Math.floor(aliq * 100) / 100;
}

function atualizaPold(form) {
    var pold = parseInt(form.ddNivel.value),
    capold = 0;
    //capold = parseInt(form.ddProg.value);

   // form.ddPadrao.value = pold + capold - 1;

    calcSalario(form);
}
/*
function atualizaPnew(form) {
    var pnew = parseInt(form.ddPadrao.value);
    /* Da estrutura nova para a antiga, é impossível saber a posição com certeza. Considera-se Capacitacao = IV sempre, tirando 
    para servidores no começo da carreira, nesse caso considera capacitação = I *//*
    if (pnew < 5) {
        form.ddNivel.value = pnew;
        form.ddProg.value = 1;
    } else {
        form.ddProg.value = 4;
        form.ddNivel.value = pnew - 3;
    }   

    calcSalario(form);
}
*/
function calcSalario(form) {
    if (form.name == "myform") {
        //$('#numProposta1').parent().css('visibility','hidden');
        //$('#ddCargaH1').parent().css('visibility','hidden');
        //$('#ddFG1').parent().css('visibility','hidden');
        //document.getElementById("numProposta1").disabled = true;
    } else if (form.name == "myform2") {
        //document.getElementById("numProposta2").disabled = true;
        //$('#numProposta2').parent().css('visibility','hidden');
    }
    $('#maindiv3').css('visibility','hidden');
    //if (!form.ticket.checked){}

   // $('#menu-bar').css('visibility','hidden');

    if (form.ticket.checked){
        var ticket = 1400.0;
        $('#ticketdiv').css('visibility','visible');  
    } 
    else {
        ticket = 0;
        $('#ticketdiv').css('visibility','hidden');
    }

    var periodo = parseInt(form.ddAno.value),
    base = 17154.93,
    ftstep = 1.025;

    // Situações especiais (considerando referência no A e não no E, como acima)
    // if (periodo == 100) {
    //     //Proposta Fasubra 2023 AB CD E plenaria
    //     //Piso 3 SM, Step 5%
    //     ftstep = 1.05;
    //     base = 3960;
    // } else if (periodo == 101) {
    //     //Proposta Fasubra 2023 AB CD E sem reajuste
    //     //Piso 3 SM, Step 5%
    //     ftstep = 1.039;
    //     base = 1822.77;
    // } else if (periodo == 102) {
    //     //Ajusta o estado do campo reajuste de acordo com periodo
    //     if (form.name == "myform") {
    //         document.getElementById("numProposta1").disabled = false;
    //     } else if (form.name == "myform2") {
    //         document.getElementById("numProposta2").disabled = false;
    //     }
    //     var reajuste = parseInt(form.numProposta.value, 10);    
    //     //Proposta Fasubra 2023 AB CD E +15%
    //     //Piso 3 SM, Step 3.9%
    //     ftstep = 1.039;
    //     base = 1822.77 * (1 + (reajuste / 100));
    // }
    var reajuste = parseFloat(form.numProposta.value);
    base = base * (1 + (reajuste / 100));



    var nivelMerito = 1,
        nivelCap = 0,
        correlacoes = [0.234196, 0.5112983, 1];
        //0,5112985014
        //0,234195651

    if (periodo < 19) {
        if (form.name == "myform") {
            $('#ddNivel1, #ddProg1').parent().parent().show();
            $('#ddPadrao1').parent().parent().hide();
        } else {
            $('#ddNivel2, #ddProg2').parent().parent().show();
            $('#ddPadrao2').parent().parent().hide();
        }
        nivelMerito = parseInt(form.ddNivel.value);
        //nivelCap = parseInt(form.ddProg.value);        
    } else {
        if (form.name == "myform") {
            $('#ddNivel1, #ddProg1').parent().parent().hide();
            $('#ddPadrao1').parent().parent().show();
        } else {
            $('#ddNivel2, #ddProg2').parent().parent().hide();
            $('#ddPadrao2').parent().parent().show();
        }
        nivelMerito = parseInt(form.ddPadrao.value);
        correlacoes = [0.60, 0.60, 1];
    } 
    
    var correl = correlacoes[parseInt(form.ddClasse.value)];
    var ftvb = nivelMerito + nivelCap - 1;
    //var ftcarga = form.ddCargaH.value;
    var ftcarga = 1;

    var vencimento = correl * Math.ceil(base * Math.pow(ftstep, ftvb) * ftcarga * 100) / 100;

    var grat = 0;
    if (form.grat.checked) {
        grat = (vencimento * 0.05);
        //var aliqirrfferias = valorIRRF(ferias, periodo);
    } else {
        grat = 0;
        //var aliqirrfferias = 0;
    }

    // if (periodo >= 100) {        
    //     //Propostas Fasubra
    //     var frac = 1;
    //     ftvb = nivelMerito + nivelCap - 2;
    //     //if (classeOffset == 1 || classeOffset == 6) frac = 0.4; //niveis AB
    //     if (classeOffset == 11 || classeOffset == 17) frac = 0.6 / 0.4; //niveis CD
    //     if (classeOffset == 31) frac = 1 / 0.4
    //     vencimento = Math.ceil(base * Math.pow(ftstep, ftvb) * ftcarga * 100 * frac) / 100;
    // }
   
    var anuenio = (form.numAnuenio.value / 100) * vencimento;

    var qualificacao = 0;
    if (form.ddQuali.value == 1) {
        qualificacao = 350;
    } else if (form.ddQuali.value == 2) {
        qualificacao = 550;
    } else if (form.ddQuali.value == 3) {
        qualificacao = 750;
    } else if (form.ddQuali.value == 4) {
        qualificacao = 950;
    }
    var cursos = parseInt(form.cursos.value),
        aqcursos = cursos * 200;
        qualificacao = qualificacao += aqcursos;
    
    var retro = parseInt(form.retro.value),
        vbretro = vencimento / 30 * retro,
        gratretro = grat / 30 * retro,
        aqretro = qualificacao / 30 * retro,
        retroativo = vbretro + gratretro + aqretro;

    var outrosRendTrib = parseFloat(form.numOutrosRendTrib.value) || 0;
    var outrosRendIsnt = parseFloat(form.numOutrosRendIsnt.value) || 0;

    var remuneracao = vencimento + grat + qualificacao + retroativo + anuenio + outrosRendTrib;

    var sindicato = 0;
    if (form.ddSindTipo.value != "nao") {
        if (form.ddSindTipo.value == "vb") {
            sindicato = vencimento * 0.01;
        } else if (form.ddSindTipo.value == "rem") {
            sindicato = remuneracao * 0.01;
        } else {
            //form.ddSindTipo.value == "cat" 
            sindicato = Math.round(0.01 * correl * Math.ceil(base * Math.pow(ftstep, ftvb)) * ftcarga * 100) / 100;
        }
    }

    //A base do PSS é quase a mesma da 'remuneracao', mas sem insalubridade pois a cobrança é opcional
    var basepss = remuneracao - grat - gratretro;

    //var valorpss = calcPSS(periodo, basepss, tetopss);
    var valorpss = calcPSS(periodo, basepss);

    var reducaoDepsIRRF = dependentesIR(form.numDepIRRF.value, periodo);

    //Funben
    if (form.funben.checked){
        $('#depsFunbendiv').css('visibility','visible');
        var depsfunben = dependentesFunben(form.numDepFunben.value),
            funbentit = (vencimento + vbretro) * 0.03,
            funbendeps = (vencimento + vbretro) * depsfunben,
            funben = funbentit + funbendeps;
    } else {
        $('#depsFunbendiv').css('visibility','hidden');
        funbentit = 0;
        funbendeps = 0;
        funben = 0;
    }

    //var rendTributavel = vencimento + qualificacao + anuenio + ftinsa * vencimento + outrosRendTrib;
    var rendTributavel = remuneracao;

    //var deducoesIrrf = valorpss + aliqfunp + aliqFunpFacul + reducaoDepsIRRF;
    var deducoesIrrf = valorpss + funben + reducaoDepsIRRF;

    var baseirrf = rendTributavel - deducoesIrrf;

    /*if (periodo == 16 && deducoesIrrf < 528) {
        baseirrf = rendTributavel - 528;
    } else if (periodo > 16 && deducoesIrrf < 564.80) {
        baseirrf = rendTributavel - 564.80;
    }*/

    var aliqirrf = valorIRRF(baseirrf, periodo);

    var outrosdescontos = parseFloat(form.numOutros.value) || 0;

    var descontos = aliqirrf + funben + valorpss + sindicato + outrosdescontos;

    var bruto = remuneracao + outrosRendIsnt;

    var salario = bruto - descontos;
    if (form.name == "myform") {
        liq1 = salario;
    } else {
        liq2 = salario;
    }
    //Toggle URP input visibility

    //Print results after each calculation
    /* var diffLiqs = (liq2 - liq1);
    document.getElementById("diffLiqAbs").innerHTML = formatValor(diffLiqs);
    document.getElementById("diffLiqPct").innerHTML = (100 * diffLiqs / liq1).toFixed(2).replace(".", ",") + "%";
    document.getElementById("diffLiqPor").innerHTML = ((100 * liq2) / liq1).toFixed(0) + "%"; */
    form.txVB.value = formatValor(vencimento);
    form.txVBretro.value = formatValor(vbretro);
    form.txGrat.value = formatValor(grat);
    form.txGratRetro.value = formatValor(gratretro);
    form.txResult.value = formatValor(salario);
    form.txInss.value = formatValor(valorpss);
    form.txBruto.value = formatValor(bruto);
    form.txIrrf.value = formatValor(aliqirrf);
    form.txbIRRF.value = formatValor(baseirrf);
    form.txbINSS.value = formatValor(basepss);
    form.txdesconto.value = formatValor(descontos);
    form.txSindicato.value = formatValor(sindicato);
    form.txQualif.value = formatValor(qualificacao);
    form.txAQretro.value = formatValor(aqretro);
    form.txDepIRRF.value = formatValor(reducaoDepsIRRF);
    form.txTicket.value = formatValor(ticket);
    form.txCticket.value = formatValor(salario + ticket);
    form.txFunbenTit.value = formatValor(funbentit);
    form.txDepsFunben.value = formatValor(funbendeps);

    //Display info on Detailed Results
    var formid = 1;
    if (form.name == "myform") {
        $("#tabdetails-rend-1").empty();
        $("#tabdetails-desc-1").empty();
        $("#tabdetails-outros-1").empty();
    } else {
        $("#tabdetails-rend-2").empty();
        $("#tabdetails-desc-2").empty();
        $("#tabdetails-outros-2").empty();
        formid = 2;
    }

    addDetailValue("#tabdetails-rend", formid, "VB", vencimento);
    addDetailValue("#tabdetails-rend", formid, "Ticket Alimentacao", ticket);
    //if (transporte > 0) addDetailValue("#tabdetails-rend", formid, "VT", transporte);
    //if (anuenio > 0) addDetailValue("#tabdetails-rend", formid, "Anuênio", anuenio);
    if (outrosRendIsnt > 0) addDetailValue("#tabdetails-rend", formid, "Outros Rend. Isen.", outrosRendIsnt);
    if (outrosRendTrib > 0) addDetailValue("#tabdetails-rend", formid, "Outros Rend. Trib.", outrosRendTrib);

    addDetailValue("#tabdetails-desc", formid, "FEPA", valorpss);
    addDetailValue("#tabdetails-desc", formid, "IR", aliqirrf);
    if (sindicato > 0) addDetailValue("#tabdetails-desc", formid, "Sindicato", sindicato);
    if (outrosdescontos > 0) addDetailValue("#tabdetails-desc", formid, "Outros", outrosdescontos);

    addDetailValue("#tabdetails-outros", formid, "Bruto", bruto);
    addDetailValue("#tabdetails-outros", formid, "Descontos", descontos);
    addDetailValue("#tabdetails-outros", formid, "Líquido", salario);
    addDetailValue("#tabdetails-outros", formid, "Base FEPA", basepss);
    addDetailValue("#tabdetails-outros", formid, "Base IR", baseirrf);
    addDetailValue("#tabdetails-outros", formid, "Deduções IR", deducoesIrrf);

    saveStorage();
}

function addDetailValue(parent, form, name, value) {
    var newEl = "<div>" + name + ": " + formatValor(value) + "</div>";
    $(parent + "-" + form).append(newEl);
}