// @ts-check

import { Cpf } from "../campos/cpf.js";
import { Data } from "../campos/data.js";
import { Agendamento } from "../entidades/agendamento.js";
import { Paciente } from "../entidades/paciente.js";
import { AgendamentoRepository } from "../repository/agendamento.repository.js";
import { PacienteRepository } from "../repository/paciente.repository.js";

/**
 * @typedef {{agendamento: Agendamento, paciente: Paciente}} AgendamentoComPaciente
 */
export class ListarAgendamentosComPacienteUseCase {
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
   * @param {{inicio: Data, fim: Data}=} periodo
   * @returns {Promise<AgendamentoComPaciente[]>}
   */
  async executar(periodo) {
    const filtro = periodo
      ? {
          inicio: { dia: periodo.inicio },
          fim: { dia: periodo.fim },
        }
      : undefined;

    const agendamentos = await this.#agendamentoRepository.filtrar(filtro);
    const cpfs = agendamentos.map((ag) => ag.cpfDoPaciente);
    const pacientes = await this.#pacienteRepository.listarAlguns(cpfs);

    /** @type {AgendamentoComPaciente[]} */
    const agendamentosComPaciente = agendamentos.map((agendamento) => ({
      agendamento,
      paciente: this.#getPaciente(pacientes, agendamento.cpfDoPaciente),
    }));

    return agendamentosComPaciente;
  }

  /**
   *
   * @param {Paciente[]} pacientes
   * @param {Cpf} cpf
   */
  #getPaciente(pacientes, cpf) {
    const paciente = pacientes.find((p) => p.cpf.equals(cpf));
    if (!paciente) throw new Error("Erro interno");
    return paciente;
  }
}
