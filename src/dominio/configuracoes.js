// @ts-check

import { IntervaloDeHorario } from "./campos/intervalo-de-horario.js";

export class Configuracoes {
  #idadeMinimaPaciente;
  #horarioDeFuncionamento;

  get idadeMinimaPaciente() {
    return this.#idadeMinimaPaciente;
  }

  get horarioDeFuncionamento() {
    return this.#horarioDeFuncionamento;
  }

  /**
   *
   * @param {number} idadeMinimaPaciente
   * @param {IntervaloDeHorario} horarioDeFuncionamento
   */
  constructor(idadeMinimaPaciente, horarioDeFuncionamento) {
    this.#idadeMinimaPaciente = idadeMinimaPaciente;
    this.#horarioDeFuncionamento = horarioDeFuncionamento;
  }
}
