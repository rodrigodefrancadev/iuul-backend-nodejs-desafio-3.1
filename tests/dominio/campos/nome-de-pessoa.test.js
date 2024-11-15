// @ts-check

import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { NomeDePessoa } from "../../../src/dominio/campos/nome-de-pessoa.js";

describe("Campo: Nome de Pessoa", () => {
    it('deve dar erro com nome tamanho menor que 5 caracteres', () => {
        const nomeErrado = "Alfa";
        assert.throws(() => new NomeDePessoa(nomeErrado), /^Error: O nome deve ter pelo menos 5 caracteres$/)
    })

    it('deve criar Nome de Pessoa caso o nome tenha 5 caracteres ou mais', () => {
        const nomeCorreto = "Alfa Beta Ohmega";
        assert.doesNotThrow(() => new NomeDePessoa(nomeCorreto))
    })

    it('deve comparar Nomes de Pessoas com sucesso', () => {
        const nome1 = new NomeDePessoa('Fulano');
        const nome2 = new NomeDePessoa('Fulano');
        const nome3 = new NomeDePessoa('Cicrano');

        assert(nome1.equals(nome1));
        assert(nome1.equals(nome2));
        assert(nome2.equals(nome1));
        assert(!nome1.equals(nome3));
        assert(!nome2.equals(nome3));
        assert(nome3.equals(nome3));
    })

})


export { }