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
        return DateTime.fromJSDate(this.#valor).toFormat('dd/MM/yyyy');
    }

    toJson() {
        return this.#valor.toDateString();
    }

    /**
     * 
     * @param {DataDeNascimento} outraDataDeNascimento 
     */
    equals(outraDataDeNascimento) {
        return this.toString() === outraDataDeNascimento.toString();
    }
}