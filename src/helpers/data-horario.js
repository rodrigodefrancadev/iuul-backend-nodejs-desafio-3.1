// @ts-check

import { DateTime } from "luxon";
import { Data } from "../campos/data.js";
import { Horario } from "../campos/horario.js";

/**
 *
 * @param {Data} data
 * @param {Horario} horario
 */
export function dataEHorarioToJsDate(data, horario) {
  const convertido = DateTime.fromObject({
    year: data.ano,
    month: data.mes,
    day: data.dia,
    hour: horario.hora,
    minute: horario.minuto,
    second: 0,
    millisecond: 0,
  }).toJSDate();
  return convertido;
}

/**
 *
 * @param {Date} jsDate
 * @returns {{data: Data, horario: Horario}}
 */
export function jsDateToDataEHorario(jsDate) {
  const data = Data.fromJsDate(jsDate);
  const horario = new Horario(jsDate.getHours(), jsDate.getMinutes());
  return { data, horario };
}
