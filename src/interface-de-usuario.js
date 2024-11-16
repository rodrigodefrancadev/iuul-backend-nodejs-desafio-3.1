// @ts-check

import { ConsultorioOdontologico } from "./consultorio-odontologico.js";
import { IO } from "./helpers/io.js";
import { ValidadorDeCpf } from "./helpers/validador-de-cpf.js";

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

    rodar() {
        while (true) {
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
                //TODO: Encerrar programa;
                break;
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

    /*
    CPF: 12345678901
    Nome: Joao da Silva
    Data de nascimento: 05/07/1999

    Paciente cadastrado com sucesso!

    CPF: 23456789012

    Erro: CPF já cadastrado

    CPF: 34567890011
    Nome: Ana de Almeida
    Data de nascimento: 05/07/2010

    Erro: paciente deve ter pelo menos 13 anos.
    */
    #rotinaCadastrarNovoPaciente() {
        this.#io.escreve('--- CADASTRANDO NOVO PACIENTE ----');
        // TODO validar CPF
        const cpf = this.#lerCpf();
        if (this.#consultorio.verificaCpfJaCadastrado(cpf)) {
            throw new Error(`ERRO: O CPF ${cpf} já esta cadastrado`);
        }

        const nome = this.#io.lerString('Nome: ', { minLength: 5 });
        const dataDeNascimento = this.#io.lerData('Data de Nascimento: ');

        this.#consultorio.cadastrarNovoPaciente(
            cpf,
            nome,
            dataDeNascimento,
        );
    }

    #lerCpf() {
        while (true) {
            const cpf = this.#io.lerString('CPF: ', { minLength: 11, maxLength: 11, apenasNumeros: true });
            const cpfEhValido = ValidadorDeCpf.ehValido(cpf);

            if (cpfEhValido) {
                return cpf;
            }

            this.#io.escreve('Erro: CPF informádo é inválido.');
        }
    }


}