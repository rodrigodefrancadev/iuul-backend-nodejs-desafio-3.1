//@ts-check

import { Cpf } from "../campos/cpf.js";
import { Data } from "../campos/data.js";
import { Horario } from "../campos/horario.js";
import { IntervaloDeHorario } from "../campos/intervalo-de-horario.js";

export class Agendamento {
  #cpfDoPaciente;
  #dia;
  #intervaloDeHorario;

  get cpfDoPaciente() {
    return this.#cpfDoPaciente;
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
    if (
      !minutosValidos.includes(minutoInicio) ||
      !minutosValidos.includes(minutoFim)
    ) {
      throw new Error(
        "O Intervalo de Horario do Agendamento deve ser definido em termos de 15 em 15 minutos"
      );
    }
  }

  estaNoPassado() {
    if (this.dia < Data.hoje()) {
      // é de um dia antes de hoje
      return true;
    }

    if (
      this.dia.equals(Data.hoje()) &&
      this.intervaloDeHorario.inicio < Horario.agora()
    ) {
      // é de hoje, mas de um horário que já passou
      return true;
    }

    return false;
  }

  estaNoFuturo() {
    if (this.dia > Data.hoje()) {
      // é de um dia depois de hoje
      return true;
    }

    if (
      this.dia.equals(Data.hoje()) &&
      this.intervaloDeHorario.inicio > Horario.agora()
    ) {
      // é de hoje, mas de um horário mais tarde
      return true;
    }

    return false;
  }
}
