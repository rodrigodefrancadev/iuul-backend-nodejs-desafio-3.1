// @ts-check

import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { Cpf } from "../../../src/dominio/campos/cpf.js";

describe("Campo: CPF", () => {
    it('deve dar erro com CPFs de números repetidos', () => {
        const cpfsNumerosRepetidos = Array(10).fill(0).map((_, i) => i.toString().repeat(11));
        cpfsNumerosRepetidos.forEach((cpf) => {
            assert.throws(() => new Cpf(cpf), /^Error: CPF inválido$/);
        })
    })

    it('deve dar erro com CPF de tamanho menor que 11 caracteres', () => {
        assert.throws(() => new Cpf("1253"), /^Error: CPF inválido$/);
    })

    it('deve dar erro com CPF que não seja somente números', () => {
        assert.throws(() => new Cpf("12.1?3abc$2"), /^Error: CPF inválido$/);
    })

    it('deve dar erro com CPF com algum dígito errado', () => {
        const cpfCorreto = "91107755018";
        const cpfErrado = cpfCorreto.substring(0, 10) + "9";

        assert.throws(() => new Cpf(cpfErrado), /^Error: CPF inválido$/);
    })

    it('deve criar CPFs com sucesso caso o CPF esteja correto', () => {
        const cpfsCorretos = [
            "22375922093",
            "92825016047",
            "89115271064",
            "57581435024"
        ]
        cpfsCorretos.forEach((cpf) => {
            assert.doesNotThrow(() => new Cpf(cpf));
        })
    })

})


export { }