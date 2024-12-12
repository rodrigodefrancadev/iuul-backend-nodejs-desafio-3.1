// @ts-check

import { Model } from "sequelize";

export class AgendamentoDbModel extends Model {
  /** @type {string} */
  cpfDoPaciente;

  /** @type {Date} */
  diaHorarioInicio;

  /** @type {Date} */
  diaHorarioFim;
}
