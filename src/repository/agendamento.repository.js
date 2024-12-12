// @ts-check

import { Op } from "sequelize";
import { Cpf } from "../campos/cpf.js";
import { Data } from "../campos/data.js";
import { Horario } from "../campos/horario.js";
import { IntervaloDeHorario } from "../campos/intervalo-de-horario.js";
import { AgendamentoDbModel } from "../db/models/agendamento.js";
import { Agendamento } from "../entidades/agendamento.js";
import {
  dataEHorarioToJsDate,
  jsDateToDataEHorario,
} from "../helpers/data-horario.js";
import { PacienteDbModel } from "../db/models/paciente.js";

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
  // @ts-ignore
  async filtrar(filtro) {
    const where = {};

    if (filtro?.cpf) {
      where.cpfDoPaciente = filtro.cpf.valor;
    }

    if (filtro?.inicio) {
      const diaHorarioInicio = filtro.inicio.hora
        ? dataEHorarioToJsDate(filtro.inicio.dia, filtro.inicio.hora)
        : filtro.inicio.dia.toJsDate();
      where.diaHorarioInicio = {
        [Op.gte]: diaHorarioInicio,
      };
    }

    if (filtro?.fim) {
      const diaHorarioFim = filtro.fim.hora
        ? dataEHorarioToJsDate(filtro.fim.dia, filtro.fim.hora)
        : filtro.fim.dia.toJsDate();
      where.diaHorarioFim = {
        [Op.lte]: diaHorarioFim,
      };
    }

    const agendamentosDb = await AgendamentoDbModel.findAll({
      // @ts-ignore
      where,
      order: [["diaHorarioInicio", "ASC"]],
    });

    const agendamentos = agendamentosDb.map(this.#agendamentoDbToAgendamento);

    return agendamentos;
  }

  /**
   *
   * @param {Cpf} cpfDoPaciente
   * @param {Data} dia
   * @param {Horario} horaInicial
   * @returns {Promise<Agendamento | null>}
   */
  async buscar(cpfDoPaciente, dia, horaInicial) {
    const agendamentoDb = await AgendamentoDbModel.findOne({
      where: {
        cpfDoPaciente: cpfDoPaciente.valor,
        diaHorarioInicio: dataEHorarioToJsDate(dia, horaInicial),
      },
    });

    if (!agendamentoDb) return null;

    const agendamento = this.#agendamentoDbToAgendamento(agendamentoDb);
    return agendamento;
  }

  /**
   *
   * @param {Agendamento} agendamento
   * @returns {Promise<void>}
   */
  // @ts-ignore
  async excluir(agendamento) {
    const key = dataEHorarioToJsDate(
      agendamento.dia,
      agendamento.intervaloDeHorario.inicio
    );
    await AgendamentoDbModel.destroy({
      where: {
        diaHorarioInicio: key,
      },
    });
  }

  /**
   *
   * @param {Agendamento[]} agendamentos
   * @returns {Promise<void>}
   */
  // @ts-ignore
  async excluirVarios(agendamentos) {
    const keys = agendamentos.map((ag) =>
      dataEHorarioToJsDate(ag.dia, ag.intervaloDeHorario.inicio)
    );

    await AgendamentoDbModel.destroy({
      where: {
        diaHorarioInicio: {
          [Op.in]: keys,
        },
      },
    });
  }

  /**
   *
   * @param {Agendamento} agendamento
   * @return {Promise<void>}
   */
  // @ts-ignore
  async salvar(agendamento) {
    await AgendamentoDbModel.create({
      cpfDoPaciente: agendamento.cpfDoPaciente.valor,
      diaHorarioInicio: dataEHorarioToJsDate(
        agendamento.dia,
        agendamento.intervaloDeHorario.inicio
      ),
      diaHorarioFim: dataEHorarioToJsDate(
        agendamento.dia,
        agendamento.intervaloDeHorario.fim
      ),
    });
  }

  /**
   * @param {AgendamentoDbModel} agendamentoDb
   * @returns {Agendamento}
   */
  #agendamentoDbToAgendamento(agendamentoDb) {
    // @ts-ignore
    const cpfDoPaciente = new Cpf(agendamentoDb.cpfDoPaciente);
    const { data: dia, horario: horarioInicio } = jsDateToDataEHorario(
      // @ts-ignore
      agendamentoDb.diaHorarioInicio
    );
    const { horario: horarioFim } = jsDateToDataEHorario(
      // @ts-ignore
      agendamentoDb.diaHorarioFim
    );

    const intervaloDeHorarios = new IntervaloDeHorario(
      horarioInicio,
      horarioFim
    );

    const agendamento = new Agendamento(
      cpfDoPaciente,
      dia,
      intervaloDeHorarios
    );

    return agendamento;
  }
}
