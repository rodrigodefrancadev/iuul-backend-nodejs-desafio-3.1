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
        const cpfComPenultimoUltimoDigitoErrado = cpfCorreto.substring(0, 9) + "9" + cpfCorreto[10];
        const cpfComUltimoDigitoErrado = cpfCorreto.substring(0, 10) + "9";
        const cpfComOsDoisDigitosErradps = cpfCorreto.substring(0, 9) + "99";

        assert.throws(() => new Cpf(cpfComPenultimoUltimoDigitoErrado), /^Error: CPF inválido$/);
        assert.throws(() => new Cpf(cpfComUltimoDigitoErrado), /^Error: CPF inválido$/);
        assert.throws(() => new Cpf(cpfComOsDoisDigitosErradps), /^Error: CPF inválido$/);
    })

    it('deve criar CPFs com sucesso caso o CPF esteja correto', () => {
        const cpfsCorretos = [
            "22375922093",
            "92825016047",
            "89115271064",
            "57581435024"
        ]
        cpfsCorretos.forEach((cpfValue) => {
            assert.doesNotThrow(() => new Cpf(cpfValue));
        })
    })

    it('o CPF deve ter o valor igual ao CPF informado', () => {
        const cpfValor = "22375922093";
        const cpf = new Cpf(cpfValor);
        assert.equal(cpf.valor, cpfValor)
    })

    it('o deve retornar o valor do CPF quando chamar a função toString()', () => {
        const cpfValor = "22375922093";
        const cpf = new Cpf(cpfValor);
        assert.equal(cpf.toString(), cpfValor)
    })

    it('deve comparar CPFs corretamente', () => {
        const cpf1 = new Cpf("22375922093");
        const cpf2 = new Cpf("22375922093");
        const cpf3 = new Cpf("92825016047");

        assert(cpf1.equals(cpf2) === true);
        assert(cpf2.equals(cpf1) === true);

        assert(cpf1.equals(cpf3) === false);
        assert(cpf2.equals(cpf3) === false);

        assert(cpf3.equals(cpf3) === true);
    })

})


export { }