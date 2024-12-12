// @ts-check

import { CasosDeUso } from "./casos-de-uso.js";
import { Horario } from "./campos/horario.js";
import { IntervaloDeHorario } from "./campos/intervalo-de-horario.js";
import { Configuracoes } from "./configuracoes.js";
import { AgendamentoRepository } from "./repository/agendamento.repository.js";
import { PacienteRepository } from "./repository/paciente.repository.js";
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
