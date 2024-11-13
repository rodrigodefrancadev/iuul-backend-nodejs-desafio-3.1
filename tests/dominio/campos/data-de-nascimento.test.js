// @ts-check

import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { DateTime } from "luxon";
import { DataDeNascimento } from "../../../src/dominio/campos/data-de-nascimento.js";

describe("Campo: Data de Nascimento", () => {
    it('deve dar erro ao tentar criar uma data de nascimento no futuro', () => {
        const dataNoFuturo = DateTime.fromJSDate(new Date()).plus({ years: 1 }).toJSDate();
        assert.throws(() => new DataDeNascimento(dataNoFuturo), /^Error: A data de nascimento não pode ser no futuro$/)
    })

    it('deve criar data de nascimento com sucesso', () => {
        const dataNoPassado = DateTime.fromJSDate(new Date()).minus({ years: 1 }).toJSDate();
        assert.doesNotThrow(() => new DataDeNascimento(dataNoPassado))
    })

})

export { }