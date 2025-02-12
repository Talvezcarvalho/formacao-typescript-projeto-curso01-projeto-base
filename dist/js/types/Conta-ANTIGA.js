import { TipoTransacao } from "./TipoTransacao.js";
let saldo = JSON.parse(localStorage.getItem("saldo")) || 0;
const transacoes = JSON.parse(localStorage.getItem("transacoes"), (key, value) => {
    if (key === "data") {
        return new Date(value);
    }
    return value;
}) || [];
function debitar(valor) {
    if (valor <= 0) {
        throw new Error("Precisa ser maior que zero!");
    }
    if (valor > saldo) {
        throw new Error('Saldo insuficiente!');
    }
    saldo -= valor;
    localStorage.setItem("saldo", JSON.stringify(saldo));
}
function depositar(valor) {
    if (valor <= 0) {
        throw new Error("Precisa ser maior que zero!");
    }
    saldo += valor;
    localStorage.setItem("saldo", JSON.stringify(saldo));
}
const Conta = {
    getSaldo() {
        return saldo;
    },
    getDataAcesso() {
        return new Date();
    },
    getResumoTransacoes() {
        const listaTransacoes = structuredClone(transacoes);
        const resumoTransacoes = {
            totalDepositos: 0,
            totalPagamentos: 0,
            totalTransferencias: 0
        };
        listaTransacoes.forEach((transacao) => {
            switch (transacao.tipoTransacao) {
                case TipoTransacao.DEPOSITO:
                    resumoTransacoes.totalDepositos += transacao.valor;
                    break;
                case TipoTransacao.PAGAMENTO_BOLETO:
                    resumoTransacoes.totalPagamentos += transacao.valor;
                    break;
                case TipoTransacao.TRANSFERENCIA:
                    resumoTransacoes.totalTransferencias += transacao.valor;
                    break;
            }
        });
        return resumoTransacoes;
    },
    getGruposTransacoes() {
        const gruposTransacoes = [];
        const listaTransacoes = structuredClone(transacoes);
        const transacoesOrdenadas = listaTransacoes.sort((a, b) => b.data.getTime() - a.data.getTime());
        let labelAtualGrupoTransacao = "";
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao = transacao.data.toLocaleDateString("pt-br", { month: "long", year: "numeric" });
            if (labelAtualGrupoTransacao !== labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao;
                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: []
                });
            }
            gruposTransacoes.at(-1).transacoes.push(transacao);
        }
        return gruposTransacoes;
    },
    registrarTransacao(novaTransacao) {
        if (novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO || novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA) {
            debitar(novaTransacao.valor);
            novaTransacao.valor = -novaTransacao.valor;
        }
        else if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            depositar(novaTransacao.valor);
            ;
        }
        else {
            throw new Error("Tipo de transação inválido");
        }
        transacoes.push(novaTransacao);
        console.log(this.getGruposTransacoes());
        localStorage.setItem("transacoes", JSON.stringify(transacoes));
    }
};
export default Conta;
