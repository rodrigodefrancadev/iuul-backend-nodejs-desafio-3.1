// @ts-check

import { Cpf } from "../campos/cpf.js";
import { PacienteRepository } from "../repository/paciente.repository.js";

export class BuscarPacientePorCpfUseCase {
  #pacienteRepository;

  /**
   *
   * @param {PacienteRepository} pacienteRepository
   */
  constructor(pacienteRepository) {
    this.#pacienteRepository = pacienteRepository;
  }

  /**
   *
   * @param {Cpf} cpf
   */
  async executar(cpf) {
    const paciente = await this.#pacienteRepository.buscarPorCpf(cpf);
    return paciente;
  }
}
