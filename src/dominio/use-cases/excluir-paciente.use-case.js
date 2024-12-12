// @ts-check

import { Cpf } from "../campos/cpf.js";
import { AgendamentoRepository } from "../repository/agendamento.repository.js";
import { PacienteRepository } from "../repository/paciente.repository.js";

export class ExcluirPacienteUseCase {
  #pacienteRepository;
  #agendamentoRepository;

  /**
   *
   * @param {PacienteRepository} pacienteRepository
   * @param {AgendamentoRepository} agendamentoRepository
   */
  constructor(pacienteRepository, agendamentoRepository) {
    this.#pacienteRepository = pacienteRepository;
    this.#agendamentoRepository = agendamentoRepository;
  }

  /**
   *
   * @param {Cpf} cpf
   */
  async executar(cpf) {
    const paciente = await this.#pacienteRepository.buscarPorCpf(cpf);
    if (!paciente) {
      throw new Error("Paciente não encontrado");
    }

    const agendamentos = await this.#agendamentoRepository.filtrar({ cpf });

    const temAgendamentoFuturo = agendamentos.some((ag) => ag.estaNoFuturo());

    if (temAgendamentoFuturo) {
      throw new Error(
        "Não é permitido excluir paciente que possui agendamentos futuros"
      );
    }

    await this.#agendamentoRepository.excluirVarios(agendamentos);
    await this.#pacienteRepository.exluir(paciente);
  }
}
