// @ts-check

import { DateTime } from "luxon";
import { Data } from "./data.js";

export class DataDeNascimento extends Data {
  /**
   *
   * @param {number} dia
   * @param {number} mes
   * @param {number} ano
   */
  constructor(dia, mes, ano) {
    super(dia, mes, ano);
    this.#validar();
  }

  #validar() {
    const date_ = DateTime.fromJSDate(this.toJsDate()).startOf("day");
    const today = DateTime.fromJSDate(new Date()).startOf("day");
    if (date_ > today) {
      throw new Error("A data de nascimento não pode ser no futuro");
    }
  }

  /**
   *
   * @param {Date} date
   * @returns {DataDeNascimento}
   */
  static fromJsDate(date) {
    const data = super.fromJsDate(date);
    const dataDeNascimento = new DataDeNascimento(data.dia, data.mes, data.ano);
    return dataDeNascimento;
  }

  /**
   *
   * @param {string} brDateString
   * @returns Data
   */
  static fromBrDateString(brDateString) {
    const data = Data.fromBrDateString(brDateString);
    return new DataDeNascimento(data.dia, data.mes, data.ano);
  }
}
