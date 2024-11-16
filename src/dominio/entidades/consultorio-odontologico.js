// @ts-check

import { Cpf } from "../campos/cpf.js";
import { IntervaloDeHorario } from "../campos/intervalo-de-horario.js";
import { Agendamento } from "./agendamento.js";
import { Paciente } from "./paciente.js";
import { Horario } from "../campos/horario.js";
import { Data } from "../campos/data.js";

export class ConsultorioOdontologico {



    /** @type {Paciente[]} */
    #pacientes;

    /** @type {Agendamento[]} */
    #agendamentos;

    #idadeMinimaPaciente;
    #horarioDeFuncionamento;

    /**
     * 
     * @param {number} idadeMinimaPaciente 
     * @param {IntervaloDeHorario} horarioDeFuncionamento 
     */
    constructor(idadeMinimaPaciente, horarioDeFuncionamento) {
        this.#pacientes = [];
        this.#agendamentos = [];
        this.#idadeMinimaPaciente = idadeMinimaPaciente;
        this.#horarioDeFuncionamento = horarioDeFuncionamento;
    }



    /**
    * 
    * @param {Cpf} cpf
    * @returns {Paciente} paciente encotrado
    */
    getPaciente(cpf) {
        const paciente = this.#pacientes.find(p => p.cpf.equals(cpf));
        if (!paciente) {
            throw new Error('Paciente não encontrado com o CPF informado')
        }
        return paciente;
    }

    /**
     * 
     * @param {Paciente} paciente 
     */
    cadastrarNovoPaciente(paciente) {
        this.#validaPaciente(paciente);
        this.#pacientes.push(paciente);
    }

    /**
     * 
     * @param {Paciente} paciente 
     */
    #validaPaciente(paciente) {
        if (paciente.idade < this.#idadeMinimaPaciente) {
            throw new Error('Paciente com idade menor que a mínima permitida');
        }

        if (this.#verificaCpfJaCadastrado(paciente.cpf)) {
            throw new Error('Já existe um paciente cadastrado com esse CPF')
        }

    }

    /**
    * @param {Cpf} cpf
    * @returns {boolean}
    */
    #verificaCpfJaCadastrado(cpf) {
        try {
            this.getPaciente(cpf);
            return true;
        }
        catch {
            return false;
        }
    }

    /**
     * 
     * @param {Cpf} cpf
     * @returns {Paciente} paciente deletado
     */
    excluirPaciente(cpf) {
        const paciente = this.getPaciente(cpf);
        const temAgendamentoFuturo = this.#agendamentos
            .filter(ag => ag.cpfDoPaciente.equals(cpf) && ag.dia >= Data.hoje() && ag.intervaloDeHorario.inicio >= Horario.agora())
            .length > 0;
        if (temAgendamentoFuturo) {
            throw new Error('Este paciente possui agendamentos futuros');
        }

        this.#agendamentos.filter(ag => ag.cpfDoPaciente.equals(cpf)).forEach((ag) => {
            const index = this.#agendamentos.indexOf(ag)
            this.#agendamentos.splice(index, 1);
        })

        const index = this.#pacientes.indexOf(paciente);
        this.#pacientes.splice(index, 1);


        return paciente;
    }

    /**
     * 
     * @param {Agendamento} agendamento 
     */
    cadastrarAgendamento(agendamento) {
        // Verifica se existe um paciente cadastrado com o cpf informado no agendamento
        const paciente = this.getPaciente(agendamento.cpfDoPaciente);

        // Verifica se o agendamento está no futuro
        if (
            agendamento.dia < Data.hoje()
            || (agendamento.dia.equals(Data.hoje()) && agendamento.intervaloDeHorario.inicio < Horario.agora())) {
            throw new Error('O Agendamento precisa estar no futuro');
        }
        // Verifica se o agendamento está dentro do horário de funcionamento
        else if (
            agendamento.intervaloDeHorario.inicio < this.#horarioDeFuncionamento.inicio
            || agendamento.intervaloDeHorario.fim > this.#horarioDeFuncionamento.fim
        ) {
            throw new Error('O agendamento precisa estar dentro do horário de funcionamento do consultório')
        }

        // Verifica se o agendamento não sobrepões outro
        const agendamentoSobrepoeOutro = this.#agendamentos.some((ag) => {
            const naoSobrepoe = !ag.dia.equals(agendamento.dia) || (
                agendamento.intervaloDeHorario.inicio >= ag.intervaloDeHorario.fim
                || agendamento.intervaloDeHorario.fim <= ag.intervaloDeHorario.inicio
            )
            const sobrepoe = !naoSobrepoe;
            return sobrepoe
        });
        if (agendamentoSobrepoeOutro) {
            throw new Error('Já existe agendamento neste horário');
        }

        //Verifica se o paciente já possui um agendamento futuro
        const temAgendamentoFuturo = this.#agendamentos
            .filter(ag => ag.cpfDoPaciente.equals(agendamento.cpfDoPaciente) && ag.dia >= Data.hoje() && ag.intervaloDeHorario.inicio >= Horario.agora())
            .length > 0;
        if (temAgendamentoFuturo) {
            throw new Error('O paciente já possui um agendamento futuro cadastrado');
        }

        this.#agendamentos.push(agendamento);
    }

    /**
     * 
     * @param {Cpf} cpfDoPaciente 
     * @param {Data} dia 
     * @param {Horario} horaInicial
     * @returns {Agendamento} agendamento deletado 
     */
    cancelarAgendamento(cpfDoPaciente, dia, horaInicial) {
        const agendamento = this.#agendamentos.find(ag => ag.cpfDoPaciente.equals(cpfDoPaciente) && ag.dia.equals(dia) && ag.intervaloDeHorario.inicio.equals(horaInicial));
        if (!agendamento) {
            throw new Error('Agendamento não encontrado');
        }

        if (agendamento.dia < Data.hoje() || (agendamento.dia.equals(Data.hoje()) && agendamento.intervaloDeHorario.inicio < Horario.agora())) {
            throw new Error('Não é possível cancelar um agendamento passado')
        }

        const indice = this.#agendamentos.indexOf(agendamento);
        this.#agendamentos.splice(indice, 1);
        return agendamento;
    }

    /**
     * @param {{inicio: Data, fim: Data}=} periodo
     */
    listarAgendamentos(periodo) {
        return this.#agendamentos;
    }
}