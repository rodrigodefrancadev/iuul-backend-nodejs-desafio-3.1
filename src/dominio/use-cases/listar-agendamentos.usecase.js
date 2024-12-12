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
    const filtro = periodo
      ? {
          inicio: { dia: periodo.inicio },
          fim: { dia: periodo.fim },
        }
      : undefined;

    const agendamentos = await this.#agendamentoRepository.filtrar(filtro);

    return agendamentos;
  }
}
