// @ts-check

import { CasosDeUso } from "./casos-de-uso.js";
import { Horario } from "./dominio/campos/horario.js";
import { IntervaloDeHorario } from "./dominio/campos/intervalo-de-horario.js";
import { Configuracoes } from "./dominio/configuracoes.js";
import { AgendamentoRepository } from "./dominio/repository/agendamento.repository.js";
import { PacienteRepository } from "./dominio/repository/paciente.repository.js";
import { IO } from "./helpers/io.js";
import { InterfaceDeUsuario } from "./interface-de-usuario.js";

const IDADE_MINIMA_PACIENTE = 13;
const consultorioHorarioAbertura = new Horario(8, 0);
const consultorioHorarioFechametno = new Horario(19, 0);
const horarioDeFuncionamento = new IntervaloDeHorario(
  consultorioHorarioAbertura,
  consultorioHorarioFechametno
);

const configuracoes = new Configuracoes(
  IDADE_MINIMA_PACIENTE,
  horarioDeFuncionamento
);

const pacienteRepository = new PacienteRepository();
const agendamentoRepository = new AgendamentoRepository();

const casosDeUso = new CasosDeUso(
  pacienteRepository,
  agendamentoRepository,
  configuracoes
);

const io = new IO();
const interfaceDeUsuario = new InterfaceDeUsuario(io, casosDeUso);
interfaceDeUsuario.loopPrincipal();

export {};
