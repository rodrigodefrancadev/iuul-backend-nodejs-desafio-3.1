// @ts-check

import PromptSync from 'prompt-sync';
export class IO {

    /** @type {PromptSync.Prompt} */ #input;

    constructor() {
        this.#input = PromptSync();
    }

    /**
     * @param {string} pergunta
     * @param {{minLength?: number, maxLength?: number, apenasNumeros?: boolean}=} opcoes 
     * @returns {string}
     */
    lerString(pergunta, opcoes) {
        while (true) {
            const texto = this.#input(pergunta)

            if (opcoes?.minLength !== undefined && texto.length < opcoes.minLength) {
                console.log(`Erro: Sua resposta deve ter no mínimo ${opcoes.minLength} caracteres.`);
                continue;
            }

            if (opcoes?.maxLength !== undefined && texto.length > opcoes.maxLength) {
                console.log(`Erro: Sua resposta deve ter no máximo ${opcoes.maxLength} caracteres.`);
                continue;
            }

            if (opcoes?.apenasNumeros && texto.length > 0 && !this.#stringEhApenasNumeros(texto)) {
                console.log('Erro: Sua resposta deve ter apenas caracteres numéricos');
                continue;
            }

            if (texto !== "") {
                return texto
            }
        }
    }

    /**
     * 
     * @param {string} str
     * @returns {boolean}
     */
    #stringEhApenasNumeros(str) {
        const algarismos = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        const apenasNumeros = str.split('').every(c => algarismos.includes(c));
        return apenasNumeros;
    }

    /**
     * @param {string} pergunta
     * @param {{min?: number, max?: number}=} opcoes 
     * @returns {number}
     */
    lerNumber(pergunta, opcoes) {
        while (true) {
            const texto = this.lerString(pergunta)
            const num = Number(texto)
            if (isNaN(num)) {
                this.escreve(`ERRO: o valor informado "${texto}" não é um número válido. Tente novamente.`);
                continue;
            }
            if (opcoes?.min !== undefined && num < opcoes.min) {
                this.escreve(`ERRO: o valor informado é menor que o mínimo permitido`);
                continue;
            }
            if (opcoes?.max !== undefined && num > opcoes.max) {
                this.escreve(`ERRO: o valor informado é maior que o máximo permitido`);
                continue;
            }
            return num;
        }
    }

    /**
     * @param {string} pergunta
     * @param {{min?: number, max?: number}=} opcoes 
     * @returns {number}
     */
    lerInt(pergunta, opcoes) {
        while (true) {
            const valor = this.lerNumber(pergunta, opcoes);
            if (!Number.isInteger(valor)) {
                this.escreve(`ERRO: o valor informado "${valor}" não é Inteiro.`);
                continue;
            }
            return valor;
        }
    }

    /**
     * @param {string} pergunta
     * @param {string[]} opcoes 
     * @returns {string}
     */
    lerOpcao(pergunta, opcoes) {
        while (true) {
            const opcaoSelecionada = this.lerString(pergunta)
            if (!opcoes.includes(opcaoSelecionada)) {
                this.escreve(`ERRO: opção "${opcaoSelecionada}" inválida. Tente novamente.`)
                continue;
            }
            return opcaoSelecionada
        }
    }

    /**
     * @param {string} pergunta
     * @returns {Date} 
     */
    lerData(pergunta) {
        const dataRegex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
        while (true) {
            const resposta = this.#input(`${pergunta} (DD/MM/AAAA): `);
            if (!dataRegex.test(resposta)) {
                console.log('Erro: formato inválido. A data deve estar no formato DD/MM/AAAA.');
                continue;
            }

            const [dia, mes, ano] = resposta.split('/').map(x => Number(x));
            const date = new Date(`${ano}-${mes}-${dia}`);
            if (date.getUTCDate() !== dia || date.getUTCMonth() !== (mes - 1) || date.getUTCFullYear() !== ano) {
                console.log('Erro: data inválida.');
                continue;
            }

            return date;
        }
    }

    /**
     * @param {string} msg 
     */
    escreve(msg) {
        console.log(msg)
    }

    pause() {
        this.#input('Aperte ENTER para continuar ...')
    }
}