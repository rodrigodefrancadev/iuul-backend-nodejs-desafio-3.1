// @ts-check

import { Cpf } from "../campos/cpf.js";
import { Paciente } from "../entidades/paciente.js";

export class PacienteRepository {
  /**
   * @param {Cpf} cpf
   * @returns {Promise<boolean>}
   */
  cpfCadastrado(cpf) {
    throw new Error("Não implementado aind");
  }

  /**
   *
   * @param {Cpf} cpf
   * @returns {Promise<Paciente | null>}
   */
  buscarPorCpf(cpf) {
    throw new Error("Não implementado aind");
  }

  /**
   * @param {'nome' | 'CPF'} ordem
   * @returns {Promise<Paciente[]>}
   */
  listarTodos(ordem) {
    throw new Error("Não implementado aind");
  }

  /**
   * @param {Cpf[]} cpfs
   * @returns {Promise<Paciente[]>}
   */
  listarAlguns(cpfs) {
    throw new Error("Não implementado aind");
  }

  /**
   *
   * @param {Paciente} paciente
   * @returns {Promise<void>}
   */
  salvar(paciente) {
    throw new Error("Não implementado aind");
  }

  /**
   *
   * @param {Paciente} paciente
   * @returns {Promise<void>}
   */
  exluir(paciente) {
    throw new Error("Não implementado aind");
  }
}
