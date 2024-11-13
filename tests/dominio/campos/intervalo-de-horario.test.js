// @ts-check

import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { IntervaloDeHorario } from "../../../src/dominio/campos/intervalo-de-horario.js";
import { Horario } from "../../../src/dominio/campos/horario.js";

describe('Campo: Intervalo de Horário', () => {
    const _0800 = Horario.fromHHMMstr('0800');
    const _1700 = Horario.fromHHMMstr('1700');

    it('deve dar erro ao criar um IntevaloDeHorario com o Horário Inicial que não seja antes do Horário Final', () => {
        assert.throws(() => new IntervaloDeHorario(_1700, _0800), /^Error: O Horário Inicial deve ser antes do Horário Final$/)
        assert.throws(() => new IntervaloDeHorario(_0800, _0800), /^Error: O Horário Inicial deve ser antes do Horário Final$/)
    })

    it('deve criar um IntervaloDeHorario com sucesso', () => {
        assert.doesNotThrow(() => new IntervaloDeHorario(_0800, _1700))
    })
})