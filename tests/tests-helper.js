// @ts-check

import { fakerPT_BR as faker } from '@faker-js/faker';
import { Cpf } from '../src/dominio/campos/cpf';
import { NomeDePessoa } from '../src/dominio/campos/nome-de-pessoa';
import { Paciente } from '../src/dominio/entidades/paciente';
import { DataDeNascimento } from '../src/dominio/campos/data-de-nascimento';
import { Horario } from '../src/dominio/campos/horario';
import { IntervaloDeHorario } from '../src/dominio/campos/intervalo-de-horario';
import { ConsultorioOdontologico } from '../src/dominio/entidades/consultorio-odontologico';

class TestsHelper {

    gerarCpf() {
        // TODO: fazer um gerador de CPF
        const cpfValue = (Math.random() * (10 ** 11)).toString().padStart(11, '0');
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
        const dataDeNascimento = new DataDeNascimento(
            faker.date.birthdate({ mode: 'age', min: idade?.min ?? 18, max: idade?.max ?? 60 })
        );
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