//declaração de variáveis
var fck;
var fyk;
var b;
var d;
var d1;
var vk;
var mk;
var as;
var as1;
var mu;
var kxLim;
var muLim;
var ecu;
var eyd;
var lambda;
var alpha;
var fctm;

function dimensionar() {
  var resultado = document.getElementById("resultadoFlexao");
  resultado.innerHTML =
    "</br> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp </br>" +
    "&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp";
  entradaDeDados();
  if (b > 0 && d > 0 && d1 > 0) {
    if (isNaN(mk)) {
      var resultado = document.getElementById("resultadoFlexao");
      resultado.innerHTML = "</br> Digite o valor do Momento Fletor </br>";
    } else {
      mk = Math.abs(mk);
      dimensionamentoFlexao();
    }
  } else {
    var resultado = document.getElementById("resultadoFlexao");
    resultado.innerHTML = "</br> digite todos os dados geométricos </br>";
  }
}
function entradaDeDados() {
  var classeConcreto = document.getElementById("concreto");
  //fck em MPa
  fck = parseFloat(classeConcreto.value);
  //fyk em MPa
  var tipoDeAco = document.getElementById("aco");
  fyk = parseFloat(tipoDeAco.value);
  // b, d e d' (d1) em m
  var largura = document.getElementById("b");
  b = parseFloat(largura.value) / 100;

  var alturaUtil = document.getElementById("d");
  d = parseFloat(alturaUtil.value) / 100;

  var dLinha = document.getElementById("d1");
  d1 = parseFloat(dLinha.value) / 100;
  //momento fletor em MN.m
  var momentoFletor = document.getElementById("mk");
  mk = parseFloat(momentoFletor.value) / 1000;
}
function dimensionamentoFlexao() {
  //ecu e eyd em "por mil"
  if (fck > 50) {
    var kxLimite = 0.35;
    ecu = 2.6 + 35 * ((90 - fck) / 100) ** 4;
    lambda = 0.8 - (fck - 50) / 400;
    alpha = 0.85 * (1 - (fck - 50) / 200);
    fctm = 2.12 * Math.log(1 + 0.11 * fck);
  } else {
    var kxLimite = 0.45;
    ecu = 3.5;
    lambda = 0.8;
    alpha = 0.85;
    fctm = 0.3 * Math.cbrt(fck * fck);
  }

  eyd = fyk / 1.15 / 200;
  kxLim = ecu / (ecu + eyd);
  if (kxLim > kxLimite) {
    kxLim = kxLimite;
  }
  muLim = alpha * lambda * kxLim * (1 - (lambda * kxLim) / 2);

  //verificação se a solução é com armadura simples ou com armadura dupla
  mu = (1.4 * mk) / ((b * d * d * fck) / 1.4);
  if (mu <= muLim) {
    armaduraSimples();
  } else {
    armaduraDupla();
  }
}
function armaduraSimples() {
  var ky = 1 - Math.sqrt(1 - (2 * mu) / alpha);
  as = (alpha * ky * b * d * 10000 * (fck / 1.4)) / (fyk / 1.15);
  var resultado = document.getElementById("resultadoFlexao");
  resultado.innerHTML =
    "</br> Solução com armadura simples: </br>" +
    "As= " +
    as.toFixed(2) +
    "cm²";
}
function armaduraDupla() {
  es1 = ((kxLim * d - d1) / (kxLim * d)) * ecu;
  if (es1 >= eyd) {
    sigmaSd = fyk / 1.15;
  } else {
    sigmaSd = es1 * 210;
  }
  var m1d = (muLim * b * d * d * fck) / 1.4;
  var m2d = 1.4 * mk - m1d;

  //cálculo das áreas de aço
  as1 = (m2d / ((d - d1) * sigmaSd)) * 10000;

  as =
    (m1d * 10000) / (d * (1 - (lambda * kxLim) / 2) * (fyk / 1.15)) +
    (m2d / (((d - d1) * fyk) / 1.15)) * 10000;
  var resultado = document.getElementById("resultadoFlexao");
  resultado.innerHTML =
    "</br> Solução com armadura de compressão: </br>" +
    "As= " +
    as.toFixed(2) +
    "cm²" +
    "</br>As'= " +
    as1.toFixed(2) +
    "cm²";
}