//@ts-check

import { Cpf } from "../campos/cpf.js";
import { Data } from "../campos/data.js";
import { IntervaloDeHorario } from "../campos/intervalo-de-horario.js";

export class Agendamento {

    #cpfDoPaciente;
    #dia;
    #intervaloDeHorario;

    get cpfDoPaciente() {
        return this.#cpfDoPaciente
    }

    get dia() {
        return this.#dia;
    }

    get intervaloDeHorario() {
        return this.#intervaloDeHorario;
    }

    /**
     * 
     * @param {Cpf} cpfDoPaciente
     * @param {Data} dia 
     * @param {IntervaloDeHorario} intervaloDeHorario
     */
    constructor(cpfDoPaciente, dia, intervaloDeHorario) {
        Agendamento.#validaIntervaloDeHorario(intervaloDeHorario);


        this.#cpfDoPaciente = cpfDoPaciente;
        this.#dia = dia;
        this.#intervaloDeHorario = intervaloDeHorario;
    }

    /**
     * @param {IntervaloDeHorario} intervaloDeHorario 
    */
    static #validaIntervaloDeHorario(intervaloDeHorario) {
        const minutosValidos = [0, 15, 30, 45];
        const minutoInicio = intervaloDeHorario.inicio.minuto;
        const minutoFim = intervaloDeHorario.fim.minuto;
        if (!minutosValidos.includes(minutoInicio) || !minutosValidos.includes(minutoFim)) {
            throw new Error('O Intervalo de Horario do Agendamento deve ser definido em termos de 15 em 15 minutos');
        }
    }
}