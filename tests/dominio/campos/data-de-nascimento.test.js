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

    it('deve retornar a data no formato DD/MM/AAAA ao chamar a função toString', () => {
        const dia = 15;
        const mes = 12;
        const ano = 2015;

        const data = new Date(ano, mes - 1, dia);
        const dataDeNascimento = new DataDeNascimento(data);

        assert.equal(dataDeNascimento.toString(), `${dia}/${mes}/${ano}`);
    })

    it('deve comparar datas de nascimentos com sucesso', () => {
        const dataDeNascimento1 = new DataDeNascimento(new Date('2000-01-01'));
        const dataDeNascimento2 = new DataDeNascimento(new Date('2000-01-01'));
        const dataDeNascimento3 = new DataDeNascimento(new Date('2000-01-02'));

        assert(dataDeNascimento1.equals(dataDeNascimento1));
        assert(dataDeNascimento1.equals(dataDeNascimento2));
        assert(dataDeNascimento2.equals(dataDeNascimento1));
        assert(!dataDeNascimento1.equals(dataDeNascimento3));
        assert(!dataDeNascimento2.equals(dataDeNascimento3));
        assert(dataDeNascimento3.equals(dataDeNascimento3));
    })

})

export { }