// @ts-check

import { Model } from "sequelize";

export class PacienteDbModel extends Model {
  /** @type {string} */
  cpf;

  /** @type {string} */
  nome;

  /** @type {Date} */
  dataDeNascimento;
}
