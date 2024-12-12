// @ts-check

import { Cpf } from "../campos/cpf.js";
import { Data } from "../campos/data.js";
import { Horario } from "../campos/horario.js";
import { Agendamento } from "../entidades/agendamento.js";
import { AgendamentoRepository } from "../repository/agendamento.repository.js";

export class CancelarAgendamentoUseCase {
  #agendamentoRepository;

  /**
   *
   * @param {AgendamentoRepository} agendamentoRepository
   */
  constructor(agendamentoRepository) {
    this.#agendamentoRepository = agendamentoRepository;
  }

  /**
   *
   * @param {Cpf} cpf
   * @param {Data} dia
   * @param {Horario} horaInicial
   * @returns {Promise<Agendamento>} agendamento cancelado
   */
  async executar(cpf, dia, horaInicial) {
    const agendamento = await this.#agendamentoRepository.buscar(
      cpf,
      dia,
      horaInicial
    );

    if (!agendamento) {
      throw new Error("Agendamento não encontrado");
    }

    if (agendamento.estaNoPassado()) {
      throw new Error("Não é possível cancelar um agendamento passado");
    }

    await this.#agendamentoRepository.excluir(agendamento);

    return agendamento;
  }
}
