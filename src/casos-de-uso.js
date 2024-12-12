// @ts-check

import { CadastrarPacienteUseCase } from "./dominio/use-cases/cadastrar-paciente.use-case.js";
import { PacienteRepository } from "./dominio/repository/paciente.repository.js";
import { Configuracoes } from "./dominio/configuracoes.js";
import { ListarPacientesEAgendamentoFuturoUseCase } from "./dominio/use-cases/listar-pacientes-e-agendamento-futuro.use-case.js";
import { BuscarPacientePorCpfUseCase } from "./dominio/use-cases/buscar-paciente-por-cpf.js";
import { CancelarAgendamentoUseCase } from "./dominio/use-cases/cancelar-agendamento.js";
import { AgendamentoRepository } from "./dominio/repository/agendamento.repository.js";
import { ListarAgendamentosFuturosDePacienteUseCase } from "./dominio/use-cases/listar-agendamentos-futuros-de-paciente.usecase.js";
import { ExcluirPacienteUseCase } from "./dominio/use-cases/excluir-paciente.use-case.js";
import { CadastrarAgendamentoUseCase } from "./dominio/use-cases/cadastrar-agendamento.use-case.js";
import { ListarAgendamentosComPacienteUseCase } from "./dominio/use-cases/listar-agendamentos-com-paciente.usecase.js";

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
