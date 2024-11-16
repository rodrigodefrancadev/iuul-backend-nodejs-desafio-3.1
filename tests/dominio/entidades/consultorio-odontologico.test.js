// @ts-check

import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { IntervaloDeHorario } from "../../../src/dominio/campos/intervalo-de-horario.js";
import { Horario } from "../../../src/dominio/campos/horario.js";
import testsHelper from "../../tests-helper.js";
import { Agendamento } from "../../../src/dominio/entidades/agendamento.js";
import { DateTime } from "luxon";
import { Data } from "../../../src/dominio/campos/data.js";
import { Paciente } from "../../../src/dominio/entidades/paciente.js";
import { NomeDePessoa } from "../../../src/dominio/campos/nome-de-pessoa.js";
import { DataDeNascimento } from "../../../src/dominio/campos/data-de-nascimento.js";

const IDADE_MINIMA_PACIENTE = 13;

describe("Entidade: Consultório Odontológico", () => {

    it('deve cadastrar pacientes com sucesso', () => {
        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);
        const pacientes = testsHelper.gerarPacientes(10);
        for (const paciente of pacientes) {
            assert.doesNotThrow(() => consultorio.cadastrarNovoPaciente(paciente));
        }
    })

    it('deve dar erro ao cadastrar pacientes com idade menor que a mínima', () => {
        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);
        const paciente = testsHelper.gerarPaciente({ min: 0, max: IDADE_MINIMA_PACIENTE - 1 });
        assert.throws(() => consultorio.cadastrarNovoPaciente(paciente), /^Error: Paciente com idade menor que a mínima permitida$/);
    })

    it('deve dar erro ao cadastrar paciente com o mesmo CPF de outro paciente já cadastrado', () => {
        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);
        const paciente = testsHelper.gerarPaciente();
        consultorio.cadastrarNovoPaciente(paciente);

        const outroPaciente = new Paciente(paciente.cpf, new NomeDePessoa("Outra Pessoa"), new DataDeNascimento(5, 5, 1994));
        assert.throws(() => consultorio.cadastrarNovoPaciente(paciente), /^Error: Já existe um paciente cadastrado com esse CPF$/);
    })

    it('deve excluir paciente com sucesso', () => {
        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);
        const paciente = testsHelper.gerarPaciente();
        consultorio.cadastrarNovoPaciente(paciente);
        assert.doesNotThrow(() => consultorio.excluirPaciente(paciente.cpf));
    })

    it('deve dar erro ao tentar excluir um paciente com cpf não existente no cadastro', () => {
        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);
        const paciente = testsHelper.gerarPaciente();
        const outroCpf = testsHelper.gerarCpf();

        consultorio.cadastrarNovoPaciente(paciente);
        assert.throws(() => consultorio.excluirPaciente(outroCpf), /^Error: Paciente não encontrado com o CPF informado$/);
    })

    it('deve dar erro ao tentar realizar um agendamento com um CPF não cadastrado', () => {
        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);
        const paciente = testsHelper.gerarPaciente();
        const outroCpf = testsHelper.gerarCpf();
        consultorio.cadastrarNovoPaciente(paciente);

        const horario = new IntervaloDeHorario(new Horario(8, 0), new Horario(8, 15))
        const amanha = Data.fromJsDate(DateTime.fromJSDate(new Date()).plus({ day: 1 }).toJSDate());
        const agendamento = new Agendamento(outroCpf, amanha, horario)
        assert.throws(() => consultorio.cadastrarAgendamento(agendamento), /^Error: Paciente não encontrado com o CPF informado$/);
    })

    it('deve dar erro ao tentar realizar um agendamento para um dia anterior ao de hoje', () => {
        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);
        const paciente = testsHelper.gerarPaciente();
        consultorio.cadastrarNovoPaciente(paciente);

        const horario = new IntervaloDeHorario(new Horario(8, 0), new Horario(8, 15))
        const ontem = Data.fromJsDate(DateTime.fromJSDate(new Date()).minus({ day: 1 }).toJSDate());
        const agendamento = new Agendamento(paciente.cpf, ontem, horario);
        assert.throws(() => consultorio.cadastrarAgendamento(agendamento), /^Error: O Agendamento precisa estar no futuro$/);
    })

    it('deve dar erro ao tentar realizar um agendamento para hoje, mas com um horário no passado, mesmo que dentro do horário de funcionamento', (ctx) => {
        ctx.mock.timers.enable({
            apis: ['Date'],
            now: new Date('2024-11-15T12:00:00')
        })


        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);
        const paciente = testsHelper.gerarPaciente();
        consultorio.cadastrarNovoPaciente(paciente);

        const horario = new IntervaloDeHorario(new Horario(11, 45), new Horario(12, 15))
        const hoje = Data.hoje();
        const agendamento = new Agendamento(paciente.cpf, hoje, horario);
        assert.throws(() => consultorio.cadastrarAgendamento(agendamento), /^Error: O Agendamento precisa estar no futuro$/);
    })

    it('deve dar erro ao tentar realizar um agendamento sobreposto a outro', (ctx) => {
        ctx.mock.timers.enable({
            apis: ['Date'],
            now: new Date('2024-11-15T08:00:00')
        })


        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);

        const paciente1 = testsHelper.gerarPaciente();
        const paciente2 = testsHelper.gerarPaciente();

        consultorio.cadastrarNovoPaciente(paciente1);
        consultorio.cadastrarNovoPaciente(paciente2);

        const horario1 = new IntervaloDeHorario(new Horario(11, 0), new Horario(12, 0))
        const horario2 = new IntervaloDeHorario(new Horario(10, 30), new Horario(11, 30))
        const horario3 = new IntervaloDeHorario(new Horario(11, 30), new Horario(12, 30))
        const horario4 = new IntervaloDeHorario(new Horario(10, 0), new Horario(13, 0))
        const horario5 = new IntervaloDeHorario(new Horario(11, 15), new Horario(11, 30))

        const hoje = Data.hoje();

        const agendamento1 = new Agendamento(paciente1.cpf, hoje, horario1);
        const agendamento2 = new Agendamento(paciente2.cpf, hoje, horario2);
        const agendamento3 = new Agendamento(paciente2.cpf, hoje, horario3);
        const agendamento4 = new Agendamento(paciente2.cpf, hoje, horario4);
        const agendamento5 = new Agendamento(paciente2.cpf, hoje, horario5);

        assert.doesNotThrow(() => consultorio.cadastrarAgendamento(agendamento1));
        assert.throws(() => consultorio.cadastrarAgendamento(agendamento2), /^Error: Já existe agendamento neste horário$/);
        assert.throws(() => consultorio.cadastrarAgendamento(agendamento3), /^Error: Já existe agendamento neste horário$/);
        assert.throws(() => consultorio.cadastrarAgendamento(agendamento4), /^Error: Já existe agendamento neste horário$/);
        assert.throws(() => consultorio.cadastrarAgendamento(agendamento5), /^Error: Já existe agendamento neste horário$/);
    })

    it('deve dar erro ao cadastrar um agendamento para um paciente que já tem um agendamento futuro', (ctx) => {
        ctx.mock.timers.enable({
            apis: ['Date'],
            now: new Date('2024-11-15T08:00:00')
        })


        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);

        const paciente = testsHelper.gerarPaciente();

        consultorio.cadastrarNovoPaciente(paciente);

        const horario1 = new IntervaloDeHorario(new Horario(9, 0), new Horario(9, 15))
        const horario2 = new IntervaloDeHorario(new Horario(11, 0), new Horario(11, 30))

        const hoje = Data.hoje();

        const agendamento1 = new Agendamento(paciente.cpf, hoje, horario1);
        const agendamento2 = new Agendamento(paciente.cpf, hoje, horario2);

        assert.doesNotThrow(() => consultorio.cadastrarAgendamento(agendamento1));
        assert.throws(() => consultorio.cadastrarAgendamento(agendamento2), /^Error: O paciente já possui um agendamento futuro cadastrado$/);
    })

    it('deve cadastrar um agendamento com sucesso para um paciente tenha tenha agendamentos no passado', (ctx) => {
        ctx.mock.timers.enable({
            apis: ['Date'],
            now: new Date('2024-11-15T08:00:00')
        })


        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);

        const paciente = testsHelper.gerarPaciente();

        consultorio.cadastrarNovoPaciente(paciente);

        const horario1 = new IntervaloDeHorario(new Horario(9, 0), new Horario(9, 15))
        const horario2 = new IntervaloDeHorario(new Horario(11, 0), new Horario(11, 30))

        const hoje = Data.hoje();

        const agendamento1 = new Agendamento(paciente.cpf, hoje, horario1);
        assert.doesNotThrow(() => consultorio.cadastrarAgendamento(agendamento1));

        const milisegundosEmDuasHoras = 2 * 60 * 60 * 1000;
        ctx.mock.timers.tick(milisegundosEmDuasHoras);

        const agendamento2 = new Agendamento(paciente.cpf, hoje, horario2);

        assert.doesNotThrow(() => consultorio.cadastrarAgendamento(agendamento2));
    })

    it('deve dar erro ao tentar cadastrar um agendamento fora do horario de funcionamento', (ctx) => {
        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);

        const paciente = testsHelper.gerarPaciente();

        consultorio.cadastrarNovoPaciente(paciente);

        const horario1 = new IntervaloDeHorario(new Horario(4, 0), new Horario(4, 15));
        const horario2 = new IntervaloDeHorario(new Horario(20, 0), new Horario(20, 30));

        const amanha = Data.fromJsDate(DateTime.fromJSDate(new Date()).plus({ day: 1 }).toJSDate());

        const agendamento1 = new Agendamento(paciente.cpf, amanha, horario1);
        const agendamento2 = new Agendamento(paciente.cpf, amanha, horario2);

        assert.throws(() => consultorio.cadastrarAgendamento(agendamento1), /^Error: O agendamento precisa estar dentro do horário de funcionamento do consultório$/);
        assert.throws(() => consultorio.cadastrarAgendamento(agendamento2), /^Error: O agendamento precisa estar dentro do horário de funcionamento do consultório$/);
    })

    it('deve dar erro ao tentar cancelar um agendamento que não existe', (ctx) => {
        ctx.mock.timers.enable({
            apis: ['Date'],
            now: new Date('2024-11-15T08:00:00')
        })

        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);

        const paciente = testsHelper.gerarPaciente();

        consultorio.cadastrarNovoPaciente(paciente);

        const horaInicial = new Horario(9, 0);
        const horario = new IntervaloDeHorario(horaInicial, new Horario(9, 15))

        const hoje = Data.hoje()

        const agendamento = new Agendamento(paciente.cpf, hoje, horario);

        assert.throws(() => consultorio.cancelarAgendamento(paciente.cpf, hoje, horaInicial), /^Error: Agendamento não encontrado$/);
    })

    it('deve dar erro ao tentar cancelar um agendamento do passado', (ctx) => {
        ctx.mock.timers.enable({
            apis: ['Date'],
            now: new Date('2024-11-15T08:00:00')
        })

        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);

        const paciente = testsHelper.gerarPaciente();

        consultorio.cadastrarNovoPaciente(paciente);

        const horaInicial = new Horario(9, 0);
        const horario = new IntervaloDeHorario(horaInicial, new Horario(9, 15))

        const hoje = Data.hoje()

        const agendamento = new Agendamento(paciente.cpf, hoje, horario);
        assert.doesNotThrow(() => consultorio.cadastrarAgendamento(agendamento));

        const milisegundosEmDuasHoras = 2 * 60 * 60 * 1000;
        ctx.mock.timers.tick(milisegundosEmDuasHoras);

        assert.throws(() => consultorio.cancelarAgendamento(paciente.cpf, hoje, horaInicial), /^Error: Não é possível cancelar um agendamento passado$/);
    })

    it('deve cancelar com sucesso um agendamento no futuro', (ctx) => {
        ctx.mock.timers.enable({
            apis: ['Date'],
            now: new Date('2024-11-15T08:00:00')
        })

        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);

        const paciente = testsHelper.gerarPaciente();

        consultorio.cadastrarNovoPaciente(paciente);

        const horaInicial = new Horario(9, 0);
        const horario = new IntervaloDeHorario(horaInicial, new Horario(9, 15))

        const hoje = Data.hoje();

        const agendamento = new Agendamento(paciente.cpf, hoje, horario);
        assert.doesNotThrow(() => consultorio.cadastrarAgendamento(agendamento));
        assert.equal(consultorio.listarAgendamentos().filter(ag =>
            ag.cpfDoPaciente.equals(paciente.cpf)
            && ag.dia.equals(agendamento.dia)
            && ag.intervaloDeHorario.inicio.equals(agendamento.intervaloDeHorario.inicio)
        ).length, 1);
        assert.doesNotThrow(() => consultorio.cancelarAgendamento(paciente.cpf, hoje, horaInicial));
        assert.equal(consultorio.listarAgendamentos().filter(ag =>
            ag.cpfDoPaciente.equals(paciente.cpf)
            && ag.dia.equals(agendamento.dia)
            && ag.intervaloDeHorario.inicio.equals(agendamento.intervaloDeHorario.inicio)
        ).length, 0);


    })

    it('deve dar erro ao tentar excluir um paciente com agendamentos furturos', (ctx) => {
        ctx.mock.timers.enable({
            apis: ['Date'],
            now: new Date('2024-11-15T08:00:00')
        })

        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);

        const paciente = testsHelper.gerarPaciente();

        consultorio.cadastrarNovoPaciente(paciente);

        const horario = new IntervaloDeHorario(new Horario(9, 0), new Horario(9, 15))

        const hoje = Data.hoje();

        const agendamento = new Agendamento(paciente.cpf, hoje, horario);
        assert.doesNotThrow(() => consultorio.cadastrarAgendamento(agendamento));

        assert.throws(() => consultorio.excluirPaciente(paciente.cpf), /^Error: Este paciente possui agendamentos futuros$/);
    })

    it('deve excluir um paciente com sucesso e seus agendamentos também', (ctx) => {
        const milisegundosEmDuasHoras = 2 * 60 * 60 * 1000;
        ctx.mock.timers.enable({
            apis: ['Date'],
            now: new Date('2024-11-15T08:00:00')
        })

        const consultorio = testsHelper.gerarConsultorio(IDADE_MINIMA_PACIENTE);

        const paciente = testsHelper.gerarPaciente();

        consultorio.cadastrarNovoPaciente(paciente);

        const horario1 = new IntervaloDeHorario(new Horario(9, 0), new Horario(9, 15))
        const horario2 = new IntervaloDeHorario(new Horario(10, 30), new Horario(10, 45))
        const horario3 = new IntervaloDeHorario(new Horario(13, 45), new Horario(14, 0))

        const hoje = Data.hoje();

        const agendamento1 = new Agendamento(paciente.cpf, hoje, horario1);
        const agendamento2 = new Agendamento(paciente.cpf, hoje, horario2);
        const agendamento3 = new Agendamento(paciente.cpf, hoje, horario3);


        assert.doesNotThrow(() => consultorio.cadastrarAgendamento(agendamento1));
        ctx.mock.timers.tick(milisegundosEmDuasHoras);

        assert.doesNotThrow(() => consultorio.cadastrarAgendamento(agendamento2));
        ctx.mock.timers.tick(milisegundosEmDuasHoras);

        assert.doesNotThrow(() => consultorio.cadastrarAgendamento(agendamento3));
        ctx.mock.timers.tick(milisegundosEmDuasHoras);

        assert.equal(consultorio.listarAgendamentos().filter(ag => ag.cpfDoPaciente.equals(paciente.cpf)).length, 3);

        assert.doesNotThrow(() => consultorio.excluirPaciente(paciente.cpf));

        assert.equal(consultorio.listarAgendamentos().filter(ag => ag.cpfDoPaciente.equals(paciente.cpf)).length, 0);


    })
});


