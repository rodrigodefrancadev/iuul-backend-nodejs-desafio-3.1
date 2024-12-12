// @ts-check

import { CadastrarPacienteUseCase } from "./use-cases/cadastrar-paciente.use-case.js";
import { PacienteRepository } from "./repository/paciente.repository.js";
import { Configuracoes } from "./configuracoes.js";
import { ListarPacientesEAgendamentoFuturoUseCase } from "./use-cases/listar-pacientes-e-agendamento-futuro.use-case.js";
import { BuscarPacientePorCpfUseCase } from "./use-cases/buscar-paciente-por-cpf.js";
import { CancelarAgendamentoUseCase } from "./use-cases/cancelar-agendamento.js";
import { AgendamentoRepository } from "./repository/agendamento.repository.js";
import { ListarAgendamentosFuturosDePacienteUseCase } from "./use-cases/listar-agendamentos-futuros-de-paciente.usecase.js";
import { ExcluirPacienteUseCase } from "./use-cases/excluir-paciente.use-case.js";
import { CadastrarAgendamentoUseCase } from "./use-cases/cadastrar-agendamento.use-case.js";
import { ListarAgendamentosComPacienteUseCase } from "./use-cases/listar-agendamentos-com-paciente.usecase.js";

export class CasosDeUso {
  #cadastrarPaciente;
  #listarPacientesEAgendamentoFuturo;
  #buscarPacientePorCPf;
  #excluirPaciente;

  #cadastrarAgendamento;
  #cancelarAgendamento;
  #listarAgendamentosComPaciente;
  #listarAgendamentosFuturosDePaciente;

  get cadastrarPaciente() {
    return this.#cadastrarPaciente;
  }

  get listarPacientesEAgendamentoFuturo() {
    return this.#listarPacientesEAgendamentoFuturo;
  }

  get buscarPacientePorCPf() {
    return this.#buscarPacientePorCPf;
  }

  get excluirPaciente() {
    return this.#excluirPaciente;
  }

  get cadastrarAgendamento() {
    return this.#cadastrarAgendamento;
  }

  get cancelarAgendamento() {
    return this.#cancelarAgendamento;
  }

  get listarAgendamentosComPaciente() {
    return this.#listarAgendamentosComPaciente;
  }

  get listarAgendamentosFuturosDePaciente() {
    return this.#listarAgendamentosFuturosDePaciente;
  }

  /**
   * @param {PacienteRepository} pacienteRepository
   * @param {AgendamentoRepository} agendamentoRepository
   * @param {Configuracoes} configuracoes
   */
  constructor(pacienteRepository, agendamentoRepository, configuracoes) {
    this.#cadastrarPaciente = new CadastrarPacienteUseCase(
      pacienteRepository,
      configuracoes
    );

    this.#listarPacientesEAgendamentoFuturo =
      new ListarPacientesEAgendamentoFuturoUseCase(
        pacienteRepository,
        agendamentoRepository
      );

    this.#buscarPacientePorCPf = new BuscarPacientePorCpfUseCase(
      pacienteRepository
    );

    this.#excluirPaciente = new ExcluirPacienteUseCase(
      pacienteRepository,
      agendamentoRepository
    );

    this.#cadastrarAgendamento = new CadastrarAgendamentoUseCase(
      pacienteRepository,
      agendamentoRepository,
      configuracoes
    );

    this.#cancelarAgendamento = new CancelarAgendamentoUseCase(
      agendamentoRepository
    );

    this.#listarAgendamentosComPaciente =
      new ListarAgendamentosComPacienteUseCase(
        agendamentoRepository,
        pacienteRepository
      );

    this.#listarAgendamentosFuturosDePaciente =
      new ListarAgendamentosFuturosDePacienteUseCase(
        agendamentoRepository,
        pacienteRepository
      );
  }
}
