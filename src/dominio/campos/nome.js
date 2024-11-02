export class Nome {

    #valor;

    get valor() {
        return this.#valor;
    }

    /**
     * 
     * @param {string} valor 
     */
    constructor(valor) {
        Nome.#validar(valor)
        this.#valor = valor;
    }

    /**
     * @param {string} nomeStr
     */
    static #validar(nomeStr) {
        throw new Error('Não implementado');
    }

    toString() {
        return this.#valor;
    }

    toJson() {
        return this.#valor;
    }
}