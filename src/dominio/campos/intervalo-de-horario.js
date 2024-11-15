// @ts-check
import { Horario } from "./horario.js";

export class IntervaloDeHorario {

    #inicio;
    #fim;

    get inicio() {
        return this.#inicio;
    }

    get fim() {
        return this.#fim;
    }

    /**
     * 
     * @param {Horario} inicio 
     * @param {Horario} fim 
     */
    constructor(inicio, fim) {
        if (inicio >= fim) {
            throw new Error('O Horário Inicial deve ser antes do Horário Final')
        }

        this.#inicio = inicio;
        this.#fim = fim;
    }

}