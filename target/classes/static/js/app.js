const quantidadeInput = document.getElementById("quantidade");
const prefixoInput = document.getElementById("prefixo");
const gerarBtn = document.getElementById("gerarBtn");
const copiarBtn = document.getElementById("copiarBtn");
const limparBtn = document.getElementById("limparBtn");
const mensagem = document.getElementById("mensagem");
const resultadoTabela = document.getElementById("resultadoTabela");

let cpfsGerados = [];

function mostrarMensagem(texto, tipo = "info") {
  if (!mensagem) return;
  mensagem.textContent = texto;
  mensagem.className = `alert ${tipo === "erro" ? "alert-error" : tipo === "sucesso" ? "alert-success" : ""}`.trim();
}

function limparMensagem() {
  if (!mensagem) return;
  mensagem.textContent = "";
  mensagem.className = "";
}

function aplicarMascara(cpf) {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

function todosIguais(str) {
  return new Set(str).size === 1;
}

function calcularDigito(base, pesoInicial) {
  let soma = 0;

  for (let i = 0; i < base.length; i++) {
    soma += Number(base[i]) * (pesoInicial - i);
  }

  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

function gerarCpfValido(prefixoOpcional = "") {
  let base = prefixoOpcional.replace(/\D/g, "").slice(0, 9);

  while (base.length < 9) {
    base += Math.floor(Math.random() * 10);
  }

  if (todosIguais(base)) {
    return gerarCpfValido(prefixoOpcional);
  }

  const d1 = calcularDigito(base, 10);
  const d2 = calcularDigito(base + d1, 11);

  return base + d1 + d2;
}

function validarQuantidade(valor) {
  const numero = Number(valor);

  if (!Number.isInteger(numero) || numero <= 0) {
    return null;
  }

  return Math.min(numero, 100);
}

function renderizarTabela(lista) {
  if (!resultadoTabela) return;

  resultadoTabela.innerHTML = "";

  if (!lista.length) {
    resultadoTabela.innerHTML = `
      <tr>
        <td colspan="2" class="empty">Nenhum CPF gerado ainda.</td>
      </tr>
    `;
    return;
  }

  lista.forEach((cpf, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${aplicarMascara(cpf)}</td>
    `;
    resultadoTabela.appendChild(tr);
  });
}

function gerarLista() {
  limparMensagem();

  const quantidade = validarQuantidade(quantidadeInput?.value.trim());
  const prefixo = prefixoInput?.value.trim() || "";

  if (quantidade === null) {
    mostrarMensagem("Quantidade inválida.", "erro");
    return;
  }

  cpfsGerados = [];

  for (let i = 0; i < quantidade; i++) {
    cpfsGerados.push(gerarCpfValido(prefixo));
  }

  renderizarTabela(cpfsGerados);
  mostrarMensagem(`${quantidade} CPF(s) válido(s) gerado(s).`, "sucesso");
}

async function copiarLista() {
  limparMensagem();

  if (!cpfsGerados.length) {
    mostrarMensagem("Nada para copiar.", "erro");
    return;
  }

  const texto = cpfsGerados.map(aplicarMascara).join("\n");

  try {
    await navigator.clipboard.writeText(texto);
    mostrarMensagem("Copiado com sucesso.", "sucesso");
  } catch {
    mostrarMensagem("Erro ao copiar.", "erro");
  }
}

function limparTudo() {
  cpfsGerados = [];
  if (quantidadeInput) quantidadeInput.value = "10";
  if (prefixoInput) prefixoInput.value = "";
  renderizarTabela([]);
  limparMensagem();
}

if (gerarBtn) gerarBtn.addEventListener("click", gerarLista);
if (copiarBtn) copiarBtn.addEventListener("click", copiarLista);
if (limparBtn) limparBtn.addEventListener("click", limparTudo);
if (resultadoTabela) renderizarTabela([]);