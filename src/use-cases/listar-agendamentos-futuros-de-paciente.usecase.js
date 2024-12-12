// @ts-check

import { Cpf } from "../campos/cpf.js";
import { Data } from "../campos/data.js";
import { Horario } from "../campos/horario.js";
import { AgendamentoRepository } from "../repository/agendamento.repository.js";
import { PacienteRepository } from "../repository/paciente.repository.js";

export class ListarAgendamentosFuturosDePacienteUseCase {
  #agendamentoRepository;
  #pacienteRepository;

  /**
   * @param {AgendamentoRepository} agendamentoRepository
   * @param {PacienteRepository} pacienteRepository
   */
  constructor(agendamentoRepository, pacienteRepository) {
    this.#agendamentoRepository = agendamentoRepository;
    this.#pacienteRepository = pacienteRepository;
  }

  /**
   * @param {Cpf} cpfDoPaciente
   */
  async executar(cpfDoPaciente) {
    const paciente = this.#pacienteRepository.buscarPorCpf(cpfDoPaciente);

    if (!paciente) {
      throw new Error("Paciente não encontrado");
    }

    const agendamentos = await this.#agendamentoRepository.filtrar({
      cpf: cpfDoPaciente,
      inicio: {
        dia: Data.hoje(),
        hora: Horario.agora(),
      },
    });

    return agendamentos;
  }
}
