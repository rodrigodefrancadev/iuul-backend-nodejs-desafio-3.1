// @ts-check

import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { DataDeNascimento } from "../../../src/dominio/campos/data-de-nascimento.js";

describe("Campo: Data de Nascimento", () => {
    it('deve dar erro ao tentar criar uma data de nascimento no futuro', () => {
        const hoje = new Date();
        assert.throws(() => new DataDeNascimento(hoje.getDate(), hoje.getMonth() + 1, hoje.getFullYear() + 1), /^Error: A data de nascimento não pode ser no futuro$/)
    })

    it('deve criar data de nascimento com sucesso', () => {
        const hoje = new Date()
        assert.doesNotThrow(() => new DataDeNascimento(hoje.getDate(), hoje.getMonth() + 1, hoje.getFullYear() - 1))
    })
})

export { }