// @ts-check

import { Horario } from "./dominio/campos/horario.js";
import { IntervaloDeHorario } from "./dominio/campos/intervalo-de-horario.js";
import { ConsultorioOdontologico } from "./dominio/entidades/consultorio-odontologico.js";
import { IO } from "./helpers/io.js";
import { InterfaceDeUsuario } from "./interface-de-usuario.js";

const IDADE_MINIMA_PACIENTE = 13;
const consultorioHorarioAbertura = new Horario(8, 0);
const consultorioHorarioFechametno = new Horario(19, 0);


const io = new IO();
const horarioDeFuncionamento = new IntervaloDeHorario(consultorioHorarioAbertura, consultorioHorarioFechametno);
const consultorio = new ConsultorioOdontologico(IDADE_MINIMA_PACIENTE, horarioDeFuncionamento,);
const interfaceDeUsuario = new InterfaceDeUsuario(io, consultorio);
interfaceDeUsuario.loopPrincipal();

export { }