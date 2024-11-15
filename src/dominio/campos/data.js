// @ts-check

import { DateTime } from "luxon";

export class Data {

    #dia;
    #mes;
    #ano;

    get dia() {
        return this.#dia;
    }

    get mes() {
        return this.#mes;
    }

    get ano() {
        return this.#ano;
    }

    /**
     * 
     * @param {number} dia
     * @param {number} mes
     * @param {number} ano   
     */
    constructor(dia, mes, ano) {
        Data.#validar(dia, mes, ano);
        this.#dia = dia;
        this.#mes = mes;
        this.#ano = ano;
    }

    /**
     * 
     * @param {number} dia
     * @param {number} mes
     * @param {number} ano   
     */
    static #validar(dia, mes, ano) {
        const date = new Date(`${ano.toString().padStart(4, '0')}, ${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`);
        if (date.getFullYear() === ano && date.getMonth() === (mes - 1) && date.getDate() === dia) {
            return;
        }

        throw new Error('Data inválida')

    }

    toString() {
        return DateTime.fromJSDate(this.toJsDate()).toFormat('dd/MM/yyyy');
    }

    toJsDate() {
        return new Date(this.#ano, this.#mes - 1, this.#dia);
    }

    /**
     * 
     * @param {Data} outraData 
     */
    equals(outraData) {
        return this.toString() === outraData.toString();
    }
}