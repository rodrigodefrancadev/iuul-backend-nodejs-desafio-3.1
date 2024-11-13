// @ts-check

import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { Paciente } from "../../../src/dominio/entidades/paciente";
import { Cpf } from "../../../src/dominio/campos/cpf";
import { NomeDePessoa } from "../../../src/dominio/campos/nome-de-pessoa";
import { DataDeNascimento } from "../../../src/dominio/campos/data-de-nascimento";

describe("Entidade: Paciente", () => {
    it('deve criar um paciente com sucesso', () => {
        const cpf = new Cpf('22375922093');
        const nome = new NomeDePessoa('Fulano de Tal');
        const dataDeNascimento = new DataDeNascimento(new Date('2000-01-01'));
        assert.doesNotThrow(() => new Paciente(cpf, nome, dataDeNascimento))
    })
});