export class DataDeNascimento {

    #valor;

    get valor() {
        return this.#valor;
    }

    /**
     * 
     * @param {Date} valor 
     */
    constructor(valor) {
        DataDeNascimento.#validar(valor)
        this.#valor = valor;
    }

    /**
     * @param {Date} data
     */
    static #validar(data) {
        throw new Error('Não implementado');
    }

    toString() {
        return this.#valor.toLocaleDateString();
    }

    toJson() {
        return this.#valor;
    }
}