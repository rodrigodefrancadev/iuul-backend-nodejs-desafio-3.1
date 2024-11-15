// @ts-check

import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { Cpf } from "../../../src/dominio/campos/cpf.js";
import { Horario } from "../../../src/dominio/campos/horario.js";
import { IntervaloDeHorario } from "../../../src/dominio/campos/intervalo-de-horario.js";
import { Agendamento } from "../../../src/dominio/entidades/agendamento.js";

describe("Entidade: Agendamento", () => {
    const cpf = new Cpf('22375922093');

    it('deve dar erro ao criar um agendamento em que os horário não são definidos emt termos de 15 em 15 minutos', () => {
        const _0800 = Horario.fromHHMMstr('0800');
        const _0812 = Horario.fromHHMMstr('0812');
        const _0816 = Horario.fromHHMMstr('0816');
        const _0825 = Horario.fromHHMMstr('0825');
        const _0900 = Horario.fromHHMMstr('0900');

        const intervalo1 = new IntervaloDeHorario(_0800, _0812);
        const intervalo2 = new IntervaloDeHorario(_0800, _0816);
        const intervalo3 = new IntervaloDeHorario(_0812, _0816);
        const intervalo4 = new IntervaloDeHorario(_0825, _0900);

        const dia = new Date();

        assert.throws(() => new Agendamento(cpf, dia, intervalo1), /^Error: O Intervalo de Horario do Agendamento deve ser definido em termos de 15 em 15 minutos$/);
        assert.throws(() => new Agendamento(cpf, dia, intervalo2), /^Error: O Intervalo de Horario do Agendamento deve ser definido em termos de 15 em 15 minutos$/);
        assert.throws(() => new Agendamento(cpf, dia, intervalo3), /^Error: O Intervalo de Horario do Agendamento deve ser definido em termos de 15 em 15 minutos$/);
        assert.throws(() => new Agendamento(cpf, dia, intervalo4), /^Error: O Intervalo de Horario do Agendamento deve ser definido em termos de 15 em 15 minutos$/);
    })

    it('deve criar um agendamento com sucesso', () => {
        const _0800 = Horario.fromHHMMstr('0800');
        const _0815 = Horario.fromHHMMstr('0815');
        const _0830 = Horario.fromHHMMstr('0830');
        const _0845 = Horario.fromHHMMstr('0845');
        const _0900 = Horario.fromHHMMstr('0900');

        const intervalo1 = new IntervaloDeHorario(_0800, _0815);
        const intervalo2 = new IntervaloDeHorario(_0800, _0830);
        const intervalo3 = new IntervaloDeHorario(_0815, _0845);
        const intervalo4 = new IntervaloDeHorario(_0845, _0900);

        const dia = new Date();

        assert.doesNotThrow(() => new Agendamento(cpf, dia, intervalo1));
        assert.doesNotThrow(() => new Agendamento(cpf, dia, intervalo2));
        assert.doesNotThrow(() => new Agendamento(cpf, dia, intervalo3));
        assert.doesNotThrow(() => new Agendamento(cpf, dia, intervalo4));
    })
});