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

    valueOf() {
        return this.toJsDate().getTime();
    }

    /**
     * 
     * @param {Data} outraData 
     */
    equals(outraData) {
        return this.toString() === outraData.toString();
    }

    static hoje() {
        const date = new Date();
        const dia = date.getDate();
        const mes = date.getMonth() + 1;
        const ano = date.getFullYear();

        return new Data(dia, mes, ano);
    }

    /**
     * 
     * @param {Date} date
     * @returns {Data} 
     */
    static fromJsDate(date) {
        const dia = date.getDate();
        const mes = date.getMonth() + 1;
        const ano = date.getFullYear();

        return new Data(dia, mes, ano);
    }

    /**
     * 
     * @param {string} brDateString 
     * @returns Data
     */
    static fromBrDateString(brDateString) {
        const dataRegex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
        if (!dataRegex.test(brDateString)) {
            throw new Error('Erro: formato inválido. A data deve estar no formato DD/MM/AAAA.');
        }

        const [dia, mes, ano] = brDateString.split('/').map(x => Number(x));
        const data = new Data(dia, mes, ano);
        return data;
    }
}