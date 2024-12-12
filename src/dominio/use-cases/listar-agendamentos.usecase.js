// @ts-check

import { Data } from "../campos/data.js";
import { AgendamentoRepository } from "../repository/agendamento.repository.js";

export class ListarAgendamentosUseCase {
  #agendamentoRepository;

  /**
   * @param {AgendamentoRepository} agendamentoRepository
   */
  constructor(agendamentoRepository) {
    this.#agendamentoRepository = agendamentoRepository;
  }

  /**
   * @param {{inicio: Data, fim: Data}=} periodo
   */
  async executar(periodo) {
    const agendamentos = await this.#agendamentoRepository.filtrar({ periodo });
    return agendamentos;
  }
}
