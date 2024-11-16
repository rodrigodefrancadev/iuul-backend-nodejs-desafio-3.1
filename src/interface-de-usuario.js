// @ts-check

import { Table } from "console-table-printer";
import { Cpf } from "./dominio/campos/cpf.js";
import { DataDeNascimento } from "./dominio/campos/data-de-nascimento.js";
import { NomeDePessoa } from "./dominio/campos/nome-de-pessoa.js";
import { ConsultorioOdontologico } from "./dominio/entidades/consultorio-odontologico.js";
import { Paciente } from "./dominio/entidades/paciente.js";
import { IO } from "./helpers/io.js";
import { Agendamento } from "./dominio/entidades/agendamento.js";
import { IntervaloDeHorario } from "./dominio/campos/intervalo-de-horario.js";
import { Data } from "./dominio/campos/data.js";
import { Horario } from "./dominio/campos/horario.js";

export class InterfaceDeUsuario {
    #io;
    #consultorio;

    /** @type {'PRINCIPAL' | 'CLIENTES' | 'AGENDA'} */
    #menuAtual;

    /**
     * 
     * @param {IO} io
     * @param {ConsultorioOdontologico} consultorio 
     */
    constructor(io, consultorio) {
        this.#io = io;
        this.#menuAtual = 'PRINCIPAL';
        this.#consultorio = consultorio;
    }


    loopPrincipal() {
        while (true) {
            this.#renderizarTela();
        }
    }

    #renderizarTela() {
        switch (this.#menuAtual) {
            case "PRINCIPAL":
                this.#rotinaMenuPrincipal();
                break;
            case "CLIENTES":
                this.#rotinaMenuClientes();
                break;
            case "AGENDA":
                this.#rotinaMenuAgenda();
                break;
        }
    }

    #rotinaMenuPrincipal() {
        this.#io.escreve('Menu Principal');
        this.#io.escreve('1-Cadastro de pacientes');
        this.#io.escreve('2-Agenda');
        this.#io.escreve('3-Fim');

        const opcao = this.#io.lerOpcao('Opção: ', ['1', '2', '3']);

        switch (opcao) {
            case '1':
                this.#menuAtual = 'CLIENTES';
                break;
            case '2':
                this.#menuAtual = 'AGENDA';
                break;
            case '3':
                process.exit();
        }
    }

    #rotinaMenuClientes() {
        this.#io.escreve('Menu do Cadastro de Pacientes');
        this.#io.escreve('1-Cadastrar novo paciente');
        this.#io.escreve('2-Excluir paciente');
        this.#io.escreve('3-Listar pacientes (ordenado por CPF)');
        this.#io.escreve('4-Listar pacientes (ordenado por nome)');
        this.#io.escreve('5-Voltar p/ menu principal');

        const opcao = this.#io.lerOpcao('Opção: ', ['1', '2', '3', '4', '5']);

        switch (opcao) {
            case '1':
                this.#rotinaCadastrarNovoPaciente();
                break;
            case '2':
                this.#rotinaExcluirPaciente();
                break;
            case '3':
                this.#listarPacientes('CPF');
                break;
            case '4':
                this.#listarPacientes('nome');
                break;
            case '5':
                this.#menuAtual = 'PRINCIPAL';
                break;
        }
    }

    #rotinaMenuAgenda() {
        this.#io.escreve('Agenda');
        this.#io.escreve('1-Agendar consulta');
        this.#io.escreve('2-Cancelar agendamento');
        this.#io.escreve('3-Listar agenda');
        this.#io.escreve('4-Voltar p/ menu principal');

        const opcao = this.#io.lerOpcao('Opção: ', ['1', '2', '3', '4']);

        switch (opcao) {
            case '1':
                this.#rotinaAgendarConsulta();
                break;
            case '2':
                this.#rotinaCancelarAgendamento();
                break;
            case '3':
                this.#rotinaListarAgenda();
                break;
            case '4':
                this.#menuAtual = 'PRINCIPAL';
                break;
        }
    }

    #rotinaCadastrarNovoPaciente() {
        this.#io.escreve('--- CADASTRANDO NOVO PACIENTE ----');

        const cpf = this.#lerCpf();
        const nome = this.#lerNomeDePessoa();
        const dataDeNascimento = this.#lerDataDeNascimento();

        try {
            const paciente = new Paciente(cpf, nome, dataDeNascimento);
            this.#consultorio.cadastrarNovoPaciente(paciente);
        }
        catch (err) {
            console.log(`Erro: ${err.message}`);
        }
        this.#io.pause();
    }

    #rotinaExcluirPaciente() {
        this.#io.escreve('--- EXCLUINDO PACIENTE ----');

        const cpf = this.#lerCpf();

        try {
            this.#consultorio.excluirPaciente(cpf);
        }
        catch (err) {
            console.log(`Erro: ${err.message}`);
        }
        this.#io.pause();
    }

    /**
     * @param {'nome' | 'CPF'} ordem 
     */
    #listarPacientes(ordem) {
        this.#io.escreve('--- PACIENTES ----');

        const pacientes = this.#consultorio.pacientes;
        const pacientesOrdenados = ordem === 'nome' ?
            pacientes.sort((a, b) => a.nome.valor.localeCompare(b.nome.valor))
            : pacientes.sort((a, b) => a.cpf.valor.localeCompare(b.cpf.valor));

        const table = new Table({
            columns: [
                { name: 'CPF', alignment: 'left' },
                { name: 'Nome', alignment: 'left' },
                { name: 'Dt. Nascimento', alignment: 'left' },
                { name: 'Idade', alignment: 'left' },
            ]
        });

        pacientesOrdenados.forEach((paciente) => {
            table.addRow({
                CPF: paciente.cpf.valor,
                Nome: paciente.nome.valor,
                'Dt. Nascimento': paciente.dataDeNascimento.toString(),
                Idade: paciente.idade
            })

            const agendamentoFuturo = this.#consultorio.buscarAgendamentoFuturoDePaciente(paciente.cpf);
            if (agendamentoFuturo) {
                table.addRow({
                    Nome: `Agendamento para ${agendamentoFuturo.dia}`,
                })
                table.addRow({
                    Nome: `${agendamentoFuturo.intervaloDeHorario.inicio} às ${agendamentoFuturo.intervaloDeHorario.fim}`,
                })
            }
        })

        table.printTable();
        this.#io.pause();
    }

    #rotinaAgendarConsulta() {
        this.#io.escreve('--- AGENDANDO CONSULTA ----');
        const cpf = this.#lerCpf();
        const dia = this.#lerData('Data');
        const horarioInicio = this.#lerHorario('Horário de Início');
        const horarioFim = this.#lerHorario('Horário de Fim');
        try {
            const intervaloDeHorario = new IntervaloDeHorario(horarioInicio, horarioFim);
            const agendamento = new Agendamento(cpf, dia, intervaloDeHorario);
            this.#consultorio.cadastrarAgendamento(agendamento);
            this.#io.escreve('Agendamento cadastrado com sucesso');
        } catch (err) {
            console.log(`Error: ${err.message}`);
        }
        this.#io.pause();
    }

    #rotinaCancelarAgendamento() {
        this.#io.escreve('--- CANCELANDO CONSULTA ----');
        const cpf = this.#lerCpf();
        const dia = this.#lerData('Data');
        const horarioInicio = this.#lerHorario('Horário de Início');
        try {
            this.#consultorio.cancelarAgendamento(cpf, dia, horarioInicio);
            this.#io.escreve(`Agendamento cancelado com sucesso`);
        } catch (err) {
            console.log(`Error: ${err.message}`);
        }
        this.#io.pause();
    }

    #rotinaListarAgenda() {
        const opcao = this.#io.lerOpcao('Apresentar a agenda T-Toda ou P-Periodo: ', ['t', 'T', 'p', 'P']);
        if (opcao.toUpperCase() === 'T') {
            const agendamentos = this.#consultorio.listarAgendamentos();
            this.#renderizarListaDeAgendamentos(agendamentos);
        }
        else {
            const inicio = this.#lerData('Data Inicial');
            const fim = this.#lerData('Data Final');
            const agendamentos = this.#consultorio.listarAgendamentos({ inicio, fim })
            this.#renderizarListaDeAgendamentos(agendamentos);
        }
        this.#io.pause();
    }

    /**
        * 
        * @param {Agendamento[]} agendamentos 
        */
    #renderizarListaDeAgendamentos(agendamentos) {
        const table = new Table({
            columns: [
                { name: 'Data', alignment: 'center' },
                { name: 'H.Ini', alignment: 'center' },
                { name: 'H.Fim', alignment: 'center' },
                { name: 'Tempo', alignment: 'center' },
                { name: 'Nome', alignment: 'left' },
                { name: 'Dt.Nasc.', alignment: 'center' },
            ]
        })

        agendamentos.sort((a, b) => {
            const diffDia = a.dia.valueOf() - b.dia.valueOf();
            if (diffDia !== 0) {
                return diffDia
            }
            else {
                return a.intervaloDeHorario.inicio.valueOf() - b.intervaloDeHorario.inicio.valueOf();
            }
        })

        agendamentos.forEach((ag) => {
            const paciente = this.#consultorio.getPaciente(ag.cpfDoPaciente);
            table.addRow({
                Data: ag.dia.toString(),
                'H.Ini': ag.intervaloDeHorario.inicio,
                'H.Fim': ag.intervaloDeHorario.fim,
                Tempo: ag.intervaloDeHorario.duracao.toString(),
                Nome: paciente.nome.valor,
                'Dt.Nasc.': paciente.dataDeNascimento.toString(),
            })
        })

        table.printTable();
    }

    #lerCpf() {
        while (true) {
            const cpfValor = this.#io.lerString('CPF: ',);
            try {
                const cpf = new Cpf(cpfValor);
                return cpf;
            }
            catch (err) {
                this.#io.escreve(`Erro: ${err.message}`);
            }
        }
    }

    #lerNomeDePessoa() {
        while (true) {
            const nomeValor = this.#io.lerString('Nome: ',);
            try {
                const nomeDePessoa = new NomeDePessoa(nomeValor);
                return nomeDePessoa;
            }
            catch (err) {
                this.#io.escreve(`Erro: ${err.message}`);
            }
        }
    }

    #lerDataDeNascimento() {
        while (true) {
            const dataDeNascimentoStr = this.#io.lerString('Data de Nascimento (DD/MM/AAAA): ',);
            try {
                const dataDeNascimento = DataDeNascimento.fromBrDateString(dataDeNascimentoStr);
                return dataDeNascimento;
            }
            catch (err) {
                this.#io.escreve(`Erro: ${err.message}`);
            }
        }
    }

    /**
     * 
     * @param {string} label 
     * @returns 
     */
    #lerData(label) {
        while (true) {
            const dataStr = this.#io.lerString(`${label} (DD/MM/AAAA): `);
            try {
                const data = Data.fromBrDateString(dataStr);
                return data;
            }
            catch (err) {
                this.#io.escreve(`Erro: ${err.message}`);
            }
        }
    }

    /**
     * 
     * @param {string} label 
     * @returns 
     */
    #lerHorario(label) {
        while (true) {
            const horarioStr = this.#io.lerString(`${label} (HHMM):`);
            try {
                const horario = Horario.fromHHMMstr(horarioStr);
                return horario;
            }
            catch (err) {
                this.#io.escreve(`Erro: ${err.message}`);
            }
        }
    }




}