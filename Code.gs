/**
 * Recebe as avaliações do quiz e grava na planilha (uma linha por avaliação).
 * Use este script dentro da própria planilha: Extensões > Apps Script.
 */

const NOME_DA_ABA = "Avaliações";
const MAX_COMENTARIO = 500;

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    const dados = JSON.parse(e.postData.contents);
    const nota = Number(dados.rating);

    // Ignora envios inválidos sem gerar erro para quem enviou.
    if (!Number.isInteger(nota) || nota < 1 || nota > 5) return resposta_();

    lock.waitLock(10000); // evita que dois envios simultâneos se misturem

    const planilha = SpreadsheetApp.getActiveSpreadsheet();
    let aba = planilha.getSheetByName(NOME_DA_ABA);

    if (!aba) {
      aba = planilha.insertSheet(NOME_DA_ABA);
      aba.appendRow(["Data e hora", "Nota", "Comentário"]);
      aba.getRange("A1:C1").setFontWeight("bold");
      aba.setFrozenRows(1);
    }

    aba.appendRow([new Date(), nota, limpar_(dados.comment)]);
  } catch (erro) {
    // Mantém silêncio para o participante; o erro fica registrado em Execuções.
    console.error(erro);
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }

  return resposta_();
}

/** Corta o texto e impede que o Planilhas o trate como fórmula (=, +, -, @). */
function limpar_(texto) {
  let t = String(texto || "").trim().slice(0, MAX_COMENTARIO);
  if (/^[=+\-@]/.test(t)) t = "'" + t;
  return t;
}

function resposta_() {
  return ContentService.createTextOutput("ok");
}
