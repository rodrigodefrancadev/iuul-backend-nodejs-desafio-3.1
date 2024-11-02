export class Cpf {

    #valor;

    get valor() {
        return this.#valor;
    }

    /**
     * 
     * @param {string} valor 
     */
    constructor(valor) {
        Cpf.#validar(valor);

        this.#valor = valor;
    }

    /**
     * @param {string} cpfStr
     */
    static #validar(cpfStr) {
        throw new Error('Não implementado');
    }

    toString() {
        return this.#valor;
    }

    toJson() {
        return this.#valor;
    }
}