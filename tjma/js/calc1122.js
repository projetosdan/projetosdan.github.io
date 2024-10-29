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
        newoptions = alloptions;
        newvalues = allvalues;
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
    //updateQuali(myform2, 1);
}

function formatValor(valor) {
    //var intRegex = /^\d+$/;
    return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
        valor,
      );
    //return "R$ " + valor.toFixed(2).replace(".", ",");
    //return valor;
}

function valorIRRF(base, periodo) {
    var aliquota = 0;
    if (periodo < 1) {
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
    else if (periodo >= 1) {
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
    if (periodo >= 1) {
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
function calcNovoPCCV(salarioBase, nivelDesejado, correl) {
    const correlacao = correl;
    const niveis = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

    let salarioAtual = salarioBase * correlacao;
    
    for (let i = 1; i < nivelDesejado; i++) {
        let aumento = 0.03;
        
        if ((niveis[i] === 6 && niveis[i - 1] === 5) ||
            (niveis[i] === 11 && niveis[i - 1] === 10) ||
            (niveis[i] === 16 && niveis[i - 1] === 15)) {
            aumento = 0.04;
        }
        
        salarioAtual += salarioAtual * aumento;
    }
    
    return salarioAtual;
}

function valorSaude(ftidade, periodo) {
    var tabela = Array();
    if (periodo == 1){
        tabela = Array(639.28, 655.86, 672.45, 740.08, 888.10);
    } else if (periodo == 2) {
        tabela = Array(717.55, 717.55, 1076.32, 1076.32, 1614.48);
    }
    if (ftidade == 1000) {
        return 0;
    } else {
        return tabela[ftidade];
    }
}

function valorTransporte(vencimento, gasto) {
    var auxilio = 0;
    var gastodiaro = 0;
    if (isNaN(gasto) || gasto < 0) {
        gastodiario = 0;
    } else {
        gastodiario = Math.ceil((gasto - 1) / 0.2) * 0.2 + 1;
    }
    auxilio = gastodiario * 22 - vencimento * 0.06 * (22 / 30);
    if (auxilio < 0) {
        return 0;
    } else {
        return auxilio;
    }
}

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
    // Ocultando elementos com CSS
    $('#maindiv3').css('visibility','hidden');
    $('#aqtext').css('visibility','hidden');
    //if (!form.alimentacao.checked){}

    var periodo = parseInt(form.ddAno.value);
    // base = 17154.93, // antes do reajuste de 3,7%
/*
    if (periodo == 1) {
        if (form.name == "myform") {
            $('#ddNivel1, #ddProg1').parent().parent().show();
            $('#ddPadrao1').parent().parent().hide();
        } else {
            $('#ddNivel2, #ddProg2').parent().parent().show();
            $('#ddPadrao2').parent().parent().hide();
        }
        nivelMerito = parseInt(form.ddNivel.value);
        nivelCap = parseInt(form.ddProg.value);        
    } else {
        if (form.name == "myform") {
            $('#ddNivel1, #ddProg1').parent().parent().hide();
            $('#ddPadrao1').parent().parent().show();
        } else {
            $('#ddNivel2, #ddProg2').parent().parent().hide();
            $('#ddPadrao2').parent().parent().show();
        }
        nivelMerito = parseInt(form.ddPadrao.value);
        correlacoes = [0.40, 0.40, 0.60, 0.60, 1];
    } 
*/  var base = 0;
    if (periodo == 1) {
        base = 10158.31;
    } else if (periodo == 2){
        base = 10158.31 * 1.05;
    }

    if (form.alim.checked){

        if (periodo == 1){
            var alimentacao = 1750;
        } else if (periodo == 2) {
            alimentacao = 2152.62;
        } 
    } else {
        alimentacao = 0;
    }

    console.log("Alimentacao: ", alimentacao);
   // $('#menu-bar').css('visibility','hidden');

    var reajuste = parseFloat(form.numProposta.value);
    if (isNaN(reajuste)) {
        reajuste = 0;
    } else {
        base = base * (1 + (reajuste / 100));
    }

    var nivel = parseInt(form.ddNivel.value, 10),
        correlacoes = [0.6, 1, 1.5],
        correl = correlacoes[parseInt(form.ddClasse.value, 10)];

    //var vencimento = correl * Math.ceil(base * Math.pow(ftstep, ftvb) * ftcarga * 100) / 100;
    var vencimento = calcNovoPCCV(base,nivel,correl);
    var grat = 0;
    if (form.grat.checked) {
        grat = (vencimento * 0.2);
        //var aliqirrfferias = valorIRRF(ferias, periodo);
    } else {
        grat = 0;
        //var aliqirrfferias = 0;
    }

    var quinquenio = (form.numQuinquenio.value / 100) * vencimento;

    //var insal = (form.ddInsa.value) * vencimento;
    var insal = 0;

    var cursos = parseInt(form.cursos.value, 10),
        aqcursos = 0;
    if ( isNaN(cursos)) {
        cursos = 0;
    } else {
        aqcursos = vencimento * cursos * 0.01;
    }

    var qualificacao = 0;
    if (form.ddQuali.value == 1) {
        qualificacao = vencimento * 0.05;
    } else if (form.ddQuali.value == 2) {
        qualificacao = vencimento * 0.08;
    } else if (form.ddQuali.value == 3) {
        qualificacao = vencimento * 0.11;
    } else if (form.ddQuali.value == 4) {
        qualificacao = vencimento * 0.13;
    }
    
    var saude = form.saude.checked
    ? valorSaude(parseInt(form.ddIdade.value, 10), periodo) +
      valorSaude(parseInt(form.ddIdadeDep1.value, 10), periodo) +
      valorSaude(parseInt(form.ddIdadeDep2.value, 10), periodo) +
      valorSaude(parseInt(form.ddIdadeDep3.value, 10), periodo) * form.Dep3Qtd.value
    : 0;

    console.log("Saude: ", saude);

    if (periodo == 1){
        var creche = 369.6 * form.numCreche.value;
    } else if (periodo == 2){
        creche = 369.6 * 1.05 * form.numCreche.value;
    }

    console.log("Creche: ", creche);

    var outrosRendTrib = parseFloat(form.numOutrosRendTrib.value) || 0;
    var outrosRendIsnt = parseFloat(form.numOutrosRendIsnt.value) || 0;

    var adicionais = qualificacao + grat + insal + quinquenio + alimentacao + saude + creche;
    
    var remuneracao = vencimento + adicionais + outrosRendTrib;

    //A base do PSS é quase a mesma da 'remuneracao', mas sem insalubridade pois a cobrança é opcional
    var basepss = vencimento + qualificacao;
    console.log("base pss: ",basepss);
    //var valorpss = calcPSS(periodo, basepss, tetopss);
    var valorpss = calcPSS(periodo, basepss);

    var sindicato = 0;
    if (form.ddSindTipo.value != "nao") {
            sindicato = (basepss + grat) * 0.015;
    }

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

    //var rendTributavel = vencimento + qualificacao + quinquenio + ftinsa * vencimento + outrosRendTrib;
    var rendTributavel = vencimento + qualificacao + grat;
    console.log("GAJ: ", grat);
    //var deducoesIrrf = valorpss + aliqfunp + aliqFunpFacul + reducaoDepsIRRF;
    var deducoesIrrf = valorpss + funben + reducaoDepsIRRF;
    console.log(deducoesIrrf,valorpss , funben , reducaoDepsIRRF);
    var baseirrf = rendTributavel - deducoesIrrf;

    var aliqirrf = valorIRRF(baseirrf, periodo);
    console.log("IR: ",aliqirrf);

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
    form.txAdicionais.value = formatValor(adicionais);
    form.txGrat.value = formatValor(grat);
    form.txResult.value = formatValor(salario);
    form.txInss.value = formatValor(valorpss);
    form.txBruto.value = formatValor(bruto);
    form.txIrrf.value = formatValor(aliqirrf);
    form.txbIRRF.value = formatValor(baseirrf);
    form.txbINSS.value = formatValor(basepss);
    form.txdesconto.value = formatValor(descontos);
    form.txSindicato.value = formatValor(sindicato);
    form.txQualif.value = formatValor(qualificacao);
    form.txDepIRRF.value = formatValor(reducaoDepsIRRF);
    form.txAlim.value = formatValor(alimentacao);
    form.txFunbenTit.value = formatValor(funbentit);
    form.txDepsFunben.value = formatValor(funbendeps);
    //form.txInsa.value = formatValor(insal);
    form.txSaude.value = formatValor(saude);
    form.txCreche.value = formatValor(creche);
    form.txQuinq.value = formatValor(quinquenio);
    form.txQuali.value = formatValor(qualificacao);
    form.txCursos.value = formatValor(aqcursos);

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
    addDetailValue("#tabdetails-rend", formid, "Auxilio Alimentacao", alimentacao);
    //if (transporte > 0) addDetailValue("#tabdetails-rend", formid, "VT", transporte);
    if (qualificacao > 0) addDetailValue("#tabdetails-rend", formid, "AQ", qualificacao);
    if (quinquenio > 0) addDetailValue("#tabdetails-rend", formid, "Quinquênio", quinquenio);
    if (insal > 0) addDetailValue("#tabdetails-rend", formid, "Insal./Pericul.", insal);
    //if (retroativo > 0) addDetailValue("#tabdetails-rend", formid, "Retroativo", retroativo);
    if (outrosRendIsnt > 0) addDetailValue("#tabdetails-rend", formid, "Outros Rend. Isen.", outrosRendIsnt);
    if (outrosRendTrib > 0) addDetailValue("#tabdetails-rend", formid, "Outros Rend. Trib.", outrosRendTrib);

    addDetailValue("#tabdetails-desc", formid, "FEPA", valorpss);
    addDetailValue("#tabdetails-desc", formid, "IR", aliqirrf);
    if (sindicato > 0) addDetailValue("#tabdetails-desc", formid, "Sindicato", sindicato);
    if (funben > 0) addDetailValue("#tabdetails-desc", formid, "Funben", funben);
    if (outrosdescontos > 0) addDetailValue("#tabdetails-desc", formid, "Outros", outrosdescontos);

    addDetailValue("#tabdetails-outros", formid, "Bruto", bruto);
    addDetailValue("#tabdetails-outros", formid, "Base IR", baseirrf);
    addDetailValue("#tabdetails-outros", formid, "Descontos", descontos);
    addDetailValue("#tabdetails-outros", formid, "Base FEPA", basepss);
    addDetailValue("#tabdetails-outros", formid, "Líquido", salario);
    addDetailValue("#tabdetails-outros", formid, "Deduções IR", deducoesIrrf);

    saveStorage();
}

function addDetailValue(parent, form, name, value) {
    var newEl = "<div>" + name + ": " + formatValor(value) + "</div>";
    $(parent + "-" + form).append(newEl);
}
