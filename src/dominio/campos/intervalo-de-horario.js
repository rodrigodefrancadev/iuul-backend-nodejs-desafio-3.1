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

    get duracao() {
        const fim = this.fim.valueOf();
        const inicio = this.inicio.valueOf();
        const diff = fim - inicio;
        const horas = Math.floor(diff / 60);
        const minutos = diff % 60;
        return new Horario(horas, minutos);
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