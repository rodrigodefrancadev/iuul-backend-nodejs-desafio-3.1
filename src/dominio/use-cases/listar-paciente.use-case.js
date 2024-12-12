// @ts-check

import { PacienteRepository } from "../repository/paciente.repository.js";

export class ListarPacienteUseCase {
  #pacienteRepository;

  /**
   * @param {PacienteRepository} pacienteRepository
   */
  constructor(pacienteRepository) {
    this.#pacienteRepository = pacienteRepository;
  }

  async executar() {
    const pacientes = await this.#pacienteRepository.listarTodos();
    return pacientes;
  }
}
