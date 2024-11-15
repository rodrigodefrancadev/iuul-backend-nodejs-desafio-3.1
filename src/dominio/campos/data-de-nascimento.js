// @ts-check

import { DateTime } from "luxon";

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
        const date_ = DateTime.fromJSDate(data).startOf('day')
        const today = DateTime.fromJSDate(new Date()).startOf('day')
        if (date_ > today) {
            throw new Error('A data de nascimento não pode ser no futuro');
        }
    }

    toString() {
        return this.#valor.toLocaleDateString();
    }

    toJson() {
        return this.#valor;
    }
}