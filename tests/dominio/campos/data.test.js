// @ts-check

import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { Data } from "../../../src/dominio/campos/data.js";

describe("Campo: Data de Nascimento", () => {
    it('deve criar datas válidas com sucesso', () => {
        assert.doesNotThrow(() => new Data(5, 5, 1994))
        assert.doesNotThrow(() => new Data(28, 2, 2024))
        assert.doesNotThrow(() => new Data(29, 2, 2024))
    })

    it('deve dar erro ao tentar criar datas inválidas', () => {
        assert.throws(() => new Data(-12, 5, 1994), /^Error: Data inválida$/);
        assert.throws(() => new Data(31, 2, 2024), /^Error: Data inválida$/);
        assert.throws(() => new Data(29, 2, 2023), /^Error: Data inválida$/);
    })

    it('deve retornar a data no formato DD/MM/AAAA ao chamar a função toString', () => {
        const dia = 15;
        const mes = 12;
        const ano = 2015;

        const data = new Data(dia, mes, ano);

        assert.equal(data.toString(), `${dia}/${mes}/${ano}`);
    })

    it('deve comparar datas com sucesso', () => {
        const data1 = new Data(1, 1, 2000);
        const data2 = new Data(1, 1, 2000);
        const data3 = new Data(2, 1, 2000);

        assert(data1.equals(data1));
        assert(data1.equals(data2));
        assert(data2.equals(data1));
        assert(!data1.equals(data3));
        assert(!data2.equals(data3));
        assert(data3.equals(data3));
        assert(data1 < data3);
    })

})

export { }