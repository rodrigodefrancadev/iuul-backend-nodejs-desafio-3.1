// @ts-check

import { Data } from "../campos/data.js";
import { Horario } from "../campos/horario.js";
import { Agendamento } from "../entidades/agendamento.js";
import { Paciente } from "../entidades/paciente.js";
import { AgendamentoRepository } from "../repository/agendamento.repository.js";
import { PacienteRepository } from "../repository/paciente.repository.js";

/**
 * @typedef {{paciente: Paciente, agendamentoFuturo: Agendamento | null}} PacienteEAgendamentoFuturo
 */
export class ListarPacientesEAgendamentoFuturoUseCase {
  #pacienteRepository;
  #agendamentoRepository;

  /**
   * @param {PacienteRepository} pacienteRepository
   * @param {AgendamentoRepository} agendamentoRepository
   */
  constructor(pacienteRepository, agendamentoRepository) {
    this.#pacienteRepository = pacienteRepository;
    this.#agendamentoRepository = agendamentoRepository;
  }

  /**
   * @param {'nome' | 'CPF'} ordem
   * @returns {Promise<PacienteEAgendamentoFuturo[]>}
   */
  async executar(ordem) {
    const pacientes = await this.#pacienteRepository.listarTodos(ordem);
    const agendamentosFuturos = await this.#agendamentoRepository.filtrar({
      inicio: {
        dia: Data.hoje(),
        hora: Horario.agora(),
      },
    });

    /** @type {PacienteEAgendamentoFuturo[]} */
    const pacientesEAgendamentoFuturo = pacientes.map((paciente) => ({
      paciente,
      agendamentoFuturo:
        agendamentosFuturos.find((ag) =>
          ag.cpfDoPaciente.equals(paciente.cpf)
        ) ?? null,
    }));

    return pacientesEAgendamentoFuturo;
  }
}
