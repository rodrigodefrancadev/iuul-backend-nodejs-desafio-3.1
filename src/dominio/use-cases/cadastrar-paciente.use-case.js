// @ts-check

import { Configuracoes } from "../configuracoes.js";
import { Paciente } from "../entidades/paciente.js";
import { PacienteRepository } from "../repository/paciente.repository.js";

export class CadastrarPacienteUseCase {
  #pacienteRepository;
  #configuracoes;

  /**
   *
   * @param {PacienteRepository} pacienteRepository
   * @param {Configuracoes} configuracoes
   */
  constructor(pacienteRepository, configuracoes) {
    this.#pacienteRepository = pacienteRepository;
    this.#configuracoes = configuracoes;
  }

  /**
   *
   * @param {Paciente} paciente
   */
  async executar(paciente) {
    if (paciente.idade < this.#configuracoes.idadeMinimaPaciente) {
      throw new Error("Paciente com idade menor que a mínima permitida");
    }

    const cpfJaCadastrado = await this.#pacienteRepository.cpfCadastrado(
      paciente.cpf
    );
    if (cpfJaCadastrado) {
      throw new Error("Já existe um paciente cadastrado com este CPF");
    }

    await this.#pacienteRepository.salvar(paciente);
  }
}
