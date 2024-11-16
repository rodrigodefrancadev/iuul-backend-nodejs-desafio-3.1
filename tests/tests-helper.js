// @ts-check

import { fakerPT_BR as faker } from '@faker-js/faker';
import { Cpf } from '../src/dominio/campos/cpf.js';
import { NomeDePessoa } from '../src/dominio/campos/nome-de-pessoa.js';
import { Paciente } from '../src/dominio/entidades/paciente.js';
import { DataDeNascimento } from '../src/dominio/campos/data-de-nascimento.js';
import { Horario } from '../src/dominio/campos/horario.js';
import { IntervaloDeHorario } from '../src/dominio/campos/intervalo-de-horario.js';
import { ConsultorioOdontologico } from '../src/dominio/entidades/consultorio-odontologico.js';

class TestsHelper {
    /** @type {string[]} */
    #cpfsPrimeirosDigitosGerados;

    constructor() {
        this.#cpfsPrimeirosDigitosGerados = [];
    }

    gerarCpf() {

        const primeirosDigitos = (() => {
            while (true) {
                const primeirosDigitos = Math.floor((Math.random() * (10 ** 9))).toString().padStart(9, '0');
                if (this.#cpfsPrimeirosDigitosGerados.includes(primeirosDigitos)) {
                    continue
                }
                return primeirosDigitos;
            }
        })();

        this.#cpfsPrimeirosDigitosGerados.push(primeirosDigitos);

        const digitosDoCpf = primeirosDigitos.split('').map(Number);

        const digitoVerificador1 = (() => {
            const soma = digitosDoCpf.slice(0, 9).map((d, i) => d * (10 - i)).reduce((acc, x) => acc + x, 0);
            const resto = soma % 11;
            const digitoVerificador1 = resto <= 1 ? 0 : (11 - resto);
            return digitoVerificador1;
        })();

        digitosDoCpf.push(digitoVerificador1);

        const digitoVerificador2 = (() => {
            const soma = digitosDoCpf.slice(0, 10).map((d, i) => d * (11 - i)).reduce((acc, x) => acc + x, 0);
            const resto = soma % 11;
            const digitoVerificador2 = resto <= 1 ? 0 : (11 - resto);
            return digitoVerificador2;
        })();

        digitosDoCpf.push(digitoVerificador2);

        const cpfValue = digitosDoCpf.map(d => d.toString()).join('');

        const cpf = new Cpf(cpfValue);
        return cpf;
    }

    /**
     * 
     * @param {{min: number, max: number}=} idade
     * @returns {Paciente}
     */
    gerarPaciente(idade) {
        const cpf = this.gerarCpf();
        const nome = new NomeDePessoa(faker.person.fullName());
        const dataDeNascimentoJs = faker.date.birthdate({ mode: 'age', min: idade?.min ?? 18, max: idade?.max ?? 60 })
        const dataDeNascimento = new DataDeNascimento(dataDeNascimentoJs.getDate(), dataDeNascimentoJs.getMonth() + 1, dataDeNascimentoJs.getFullYear());
        const paciente = new Paciente(cpf, nome, dataDeNascimento);
        return paciente
    }

    /**
     * 
     * @param {number} quantidade 
     * @returns {Paciente[]}
     */
    gerarPacientes(quantidade) {
        /** @type {Paciente[]} */
        const pacientes = [];
        while (pacientes.length < quantidade) {
            const paciente = this.gerarPaciente();
            if (pacientes.find(p => p.cpf === paciente.cpf)) {
                continue;
            }
            pacientes.push(paciente);
        }

        return pacientes;
    }

    gerarConsultorio(idadeMinimaPaciente) {
        const horaDeAbertura = new Horario(8, 0);
        const horaDeFechamento = new Horario(19, 0);
        const horarioDeFuncionamento = new IntervaloDeHorario(horaDeAbertura, horaDeFechamento);
        const consultorio = new ConsultorioOdontologico(idadeMinimaPaciente, horarioDeFuncionamento);
        return consultorio;
    }
}


const testsHelper = new TestsHelper();

export default testsHelper;