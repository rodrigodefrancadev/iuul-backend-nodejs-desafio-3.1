// @ts-check

import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { Paciente } from "../../../src/dominio/entidades/paciente.js";
import { Cpf } from "../../../src/dominio/campos/cpf.js";
import { NomeDePessoa } from "../../../src/dominio/campos/nome-de-pessoa.js";
import { DataDeNascimento } from "../../../src/dominio/campos/data-de-nascimento.js";
import { Data } from "../../../src/dominio/campos/data.js";

describe("Entidade: Paciente", () => {
    it('deve criar um paciente com sucesso', () => {
        const idade = 18;
        const cpf = new Cpf('22375922093');
        const nome = new NomeDePessoa('Fulano de Tal');
        const hoje = Data.hoje();
        const dataDeNascimento = new DataDeNascimento(hoje.dia, hoje.mes, hoje.ano - idade);

        const paciente = new Paciente(cpf, nome, dataDeNascimento);
        assert.equal(paciente.idade, idade);

    })
});