// @ts-check

import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { HorarioDeFuncionamento } from "../../../src/dominio/campos/horario-de-funcionamento.js";
import { Horario } from "../../../src/dominio/campos/horario.js";

describe('Campo: Horário de funcionamento', () => {
    const _0800 = Horario.fromHHMMstr('0800');
    const _1700 = Horario.fromHHMMstr('1700');

    it('deve dar erro ao criar um Horario de Funcionamento com o Horário Inicial que não seja antes do Horário Final', () => {
        assert.throws(() => new HorarioDeFuncionamento(_1700, _0800), /^Error: O Horário Inicial deve ser antes do Horário Final$/)
        assert.throws(() => new HorarioDeFuncionamento(_0800, _0800), /^Error: O Horário Inicial deve ser antes do Horário Final$/)
    })

    it('deve criar um Horario de Funcionamento com sucesso', () => {
        assert.doesNotThrow(() => new HorarioDeFuncionamento(_0800, _1700))
    })
})