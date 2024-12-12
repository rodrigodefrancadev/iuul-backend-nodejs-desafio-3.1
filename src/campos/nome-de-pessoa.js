// @ts-check

export class NomeDePessoa {

    #valor;

    get valor() {
        return this.#valor;
    }

    /**
     * 
     * @param {string} valor 
     */
    constructor(valor) {
        NomeDePessoa.#validar(valor)
        this.#valor = valor;
    }

    /**
     * @param {string} nomeStr
     */
    static #validar(nomeStr) {
        if (nomeStr.length < 5) {
            throw new Error('O nome deve ter pelo menos 5 caracteres');
        }
    }

    toString() {
        return this.#valor;
    }

    /**
     * 
     * @param {NomeDePessoa} outroNomeDePessoa 
     */
    equals(outroNomeDePessoa) {
        return this.#valor === outroNomeDePessoa.#valor;
    }
}