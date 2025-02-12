import Conta from "../types/Conta.js";
import { FormatoData } from "../types/FormatoData.js";
import { GrupoTransacao } from "../types/GrupoTransacao.js";
import { formatarData, formatarMoeda } from "../utils/Formatter.js";

const elementoRegistroTransacoesExtrato = document.querySelector(
  ".extrato .registro-transacoes"
);

renderizarExtrato();
function renderizarExtrato(): void {
  const gruposTransacoesExtrato: GrupoTransacao[] = Conta.getGruposTransacoes();
  elementoRegistroTransacoesExtrato.innerHTML = ``;
  let htmlRegistroTransacoes: string = "";
  if(gruposTransacoesExtrato.length >=1) {
    const apagarTitulo = ()=> { document.querySelector('.extrato h4').setAttribute('style', 'display: none')}; 
    apagarTitulo();
  }

  for (let grupoTransacao of gruposTransacoesExtrato) {
    let htmlTransacaoItem: string = "";
    for (let transacao of grupoTransacao.transacoes) {
      htmlTransacaoItem += ` 
      <div class="transacao-item">
        <div class="transacao-info">
            <span class="tipo">${transacao.tipoTransacao}</span>
            <strong class="valor">${formatarMoeda(transacao.valor)}</strong>
        </div>
        <time class="data">${formatarData(transacao.data, FormatoData.DIA_MES)}</time>
      </div>
            `;
    }
    htmlRegistroTransacoes += `<div class="transacoes-group">
                    <strong class="mes-group">${grupoTransacao.label}</strong>
                    ${htmlTransacaoItem}
                    </div>
    `
  }
  elementoRegistroTransacoesExtrato.innerHTML = htmlRegistroTransacoes;
}

const ExtratoComponent = {
  atualizar(): void {
    renderizarExtrato();
  }
}

export default ExtratoComponent;