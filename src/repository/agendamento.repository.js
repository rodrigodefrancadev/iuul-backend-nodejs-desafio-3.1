// @ts-check

import { Cpf } from "../campos/cpf.js";
import { Data } from "../campos/data.js";
import { Horario } from "../campos/horario.js";
import { Agendamento } from "../entidades/agendamento.js";

/**
 * @typedef {{
 *    inicio?: {
 *      dia: Data
 *      hora?: Horario
 *    }
 *    fim?: {
 *      dia: Data
 *      hora?: Horario
 *   }
 *   cpf?: Cpf
 * }} IFiltroAgendamentos
 */

export class AgendamentoRepository {
  /**
   * @param {IFiltroAgendamentos=} filtro
   * @returns {Promise<Agendamento[]>}
   */
  filtrar(filtro) {
    throw new Error("Não implementado aind");
  }

  /**
   *
   * @param {Cpf} cpfDoPaciente
   * @param {Data} dia
   * @param {Horario} horaInicial
   * @returns {Promise<Agendamento | null>}
   */
  buscar(cpfDoPaciente, dia, horaInicial) {
    throw new Error("Não implementado aind");
  }

  /**
   *
   * @param {Agendamento} agendamento
   * @returns {Promise<void>}
   */
  excluir(agendamento) {
    throw new Error("Não implementado aind");
  }

  /**
   *
   * @param {Agendamento[]} agendamentos
   * @returns {Promise<void>}
   */
  excluirVarios(agendamentos) {
    throw new Error("Não implementado aind");
  }

  /**
   *
   * @param {Agendamento} agendamento
   * @return {Promise<void>}
   */
  salvar(agendamento) {
    throw new Error("Não implementado aind");
  }
}
