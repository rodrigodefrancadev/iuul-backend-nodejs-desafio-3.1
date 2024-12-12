// @ts-check

import { Table } from "console-table-printer";
import { Cpf } from "./dominio/campos/cpf.js";
import { DataDeNascimento } from "./dominio/campos/data-de-nascimento.js";
import { NomeDePessoa } from "./dominio/campos/nome-de-pessoa.js";
import { Paciente } from "./dominio/entidades/paciente.js";
import { IO } from "./helpers/io.js";
import { Agendamento } from "./dominio/entidades/agendamento.js";
import { IntervaloDeHorario } from "./dominio/campos/intervalo-de-horario.js";
import { Data } from "./dominio/campos/data.js";
import { Horario } from "./dominio/campos/horario.js";
import { CasosDeUso } from "./casos-de-uso.js";

export class InterfaceDeUsuario {
  #io;
  #casosDeUso;

  /** @type {'PRINCIPAL' | 'CLIENTES' | 'AGENDA'} */
  #menuAtual;

  /**
   *
   * @param {IO} io
   * @param {CasosDeUso} casosDeUso
   */
  constructor(io, casosDeUso) {
    this.#io = io;
    this.#menuAtual = "PRINCIPAL";
    this.#casosDeUso = casosDeUso;
  }

  async loopPrincipal() {
    while (true) {
      try {
        await this.#renderizarTela();
      } catch (error) {
        console.log("ERRO: " + error.message);
      }
    }
  }

  async #renderizarTela() {
    switch (this.#menuAtual) {
      case "PRINCIPAL":
        this.#rotinaMenuPrincipal();
        break;
      case "CLIENTES":
        await this.#rotinaMenuClientes();
        break;
      case "AGENDA":
        await this.#rotinaMenuAgenda();
        break;
    }
  }

  #rotinaMenuPrincipal() {
    this.#io.escreve("Menu Principal");
    this.#io.escreve("1-Cadastro de pacientes");
    this.#io.escreve("2-Agenda");
    this.#io.escreve("3-Fim");

    const opcao = this.#io.lerOpcao("Opção: ", ["1", "2", "3"]);

    switch (opcao) {
      case "1":
        this.#menuAtual = "CLIENTES";
        break;
      case "2":
        this.#menuAtual = "AGENDA";
        break;
      case "3":
        process.exit();
    }
  }

  async #rotinaMenuClientes() {
    this.#io.escreve("Menu do Cadastro de Pacientes");
    this.#io.escreve("1-Cadastrar novo paciente");
    this.#io.escreve("2-Excluir paciente");
    this.#io.escreve("3-Listar pacientes (ordenado por CPF)");
    this.#io.escreve("4-Listar pacientes (ordenado por nome)");
    this.#io.escreve("5-Voltar p/ menu principal");

    const opcao = this.#io.lerOpcao("Opção: ", ["1", "2", "3", "4", "5"]);

    switch (opcao) {
      case "1":
        await this.#rotinaCadastrarNovoPaciente();
        break;
      case "2":
        await this.#rotinaExcluirPaciente();
        break;
      case "3":
        await this.#listarPacientes("CPF");
        break;
      case "4":
        await this.#listarPacientes("nome");
        break;
      case "5":
        this.#menuAtual = "PRINCIPAL";
        break;
    }
  }

  async #rotinaMenuAgenda() {
    this.#io.escreve("Agenda");
    this.#io.escreve("1-Agendar consulta");
    this.#io.escreve("2-Cancelar agendamento");
    this.#io.escreve("3-Listar agenda");
    this.#io.escreve("4-Voltar p/ menu principal");

    const opcao = this.#io.lerOpcao("Opção: ", ["1", "2", "3", "4"]);

    switch (opcao) {
      case "1":
        await this.#rotinaAgendarConsulta();
        break;
      case "2":
        await this.#rotinaCancelarAgendamento();
        break;
      case "3":
        await this.#rotinaListarAgenda();
        break;
      case "4":
        this.#menuAtual = "PRINCIPAL";
        break;
    }
  }

  async #rotinaCadastrarNovoPaciente() {
    this.#io.escreve("--- CADASTRANDO NOVO PACIENTE ----");

    const cpf = this.#lerCpf();
    const nome = this.#lerNomeDePessoa();
    const dataDeNascimento = this.#lerDataDeNascimento();

    try {
      const paciente = new Paciente(cpf, nome, dataDeNascimento);
      await this.#casosDeUso.cadastrarPaciente.executar(paciente);
    } catch (err) {
      console.log(`Erro: ${err.message}`);
    }
    this.#io.pause();
  }

  async #rotinaExcluirPaciente() {
    this.#io.escreve("--- EXCLUINDO PACIENTE ----");

    const cpf = this.#lerCpf();

    try {
      await this.#casosDeUso.excluirPaciente.executar(cpf);
    } catch (err) {
      console.log(`Erro: ${err.message}`);
    }
    this.#io.pause();
  }

  /**
   * @param {'nome' | 'CPF'} ordem
   */
  async #listarPacientes(ordem) {
    this.#io.escreve("--- PACIENTES ----");

    const pacientesEAgendamentoFuturo =
      await this.#casosDeUso.listarPacientesEAgendamentoFuturo.executar(ordem);

    const table = new Table({
      columns: [
        { name: "CPF", alignment: "left" },
        { name: "Nome", alignment: "left" },
        { name: "Dt. Nascimento", alignment: "left" },
        { name: "Idade", alignment: "left" },
      ],
    });

    pacientesEAgendamentoFuturo.forEach(({ paciente, agendamentoFuturo }) => {
      table.addRow({
        CPF: paciente.cpf.valor,
        Nome: paciente.nome.valor,
        "Dt. Nascimento": paciente.dataDeNascimento.toString(),
        Idade: paciente.idade,
      });

      if (agendamentoFuturo) {
        table.addRow({
          Nome: `Agendamento para ${agendamentoFuturo.dia}`,
        });
        table.addRow({
          Nome: `${agendamentoFuturo.intervaloDeHorario.inicio} às ${agendamentoFuturo.intervaloDeHorario.fim}`,
        });
      }
    });

    table.printTable();
    this.#io.pause();
  }

  async #rotinaAgendarConsulta() {
    this.#io.escreve("--- AGENDANDO CONSULTA ----");
    const cpf = this.#lerCpf();
    const dia = this.#lerData("Data");
    const horarioInicio = this.#lerHorario("Horário de Início");
    const horarioFim = this.#lerHorario("Horário de Fim");
    try {
      const intervaloDeHorario = new IntervaloDeHorario(
        horarioInicio,
        horarioFim
      );
      const agendamento = new Agendamento(cpf, dia, intervaloDeHorario);
      await this.#casosDeUso.cadastrarAgendamento.executar(agendamento);
      this.#io.escreve("Agendamento cadastrado com sucesso");
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
    this.#io.pause();
  }

  async #rotinaCancelarAgendamento() {
    this.#io.escreve("--- CANCELANDO CONSULTA ----");
    const cpf = this.#lerCpf();
    const dia = this.#lerData("Data");
    const horarioInicio = this.#lerHorario("Horário de Início");
    try {
      await this.#casosDeUso.cancelarAgendamento.executar(
        cpf,
        dia,
        horarioInicio
      );
      this.#io.escreve(`Agendamento cancelado com sucesso`);
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
    this.#io.pause();
  }

  async #rotinaListarAgenda() {
    const opcao = this.#io.lerOpcao(
      "Apresentar a agenda T-Toda ou P-Periodo: ",
      ["t", "T", "p", "P"]
    );
    if (opcao.toUpperCase() === "T") {
      const agendamentosComPaciente =
        await this.#casosDeUso.listarAgendamentosComPaciente.executar();
      this.#renderizarListaDeAgendamentos(agendamentosComPaciente);
    } else {
      const inicio = this.#lerData("Data Inicial");
      const fim = this.#lerData("Data Final");
      const agendamentosComPaciente =
        await this.#casosDeUso.listarAgendamentosComPaciente.executar({
          inicio,
          fim,
        });
      this.#renderizarListaDeAgendamentos(agendamentosComPaciente);
    }
    this.#io.pause();
  }

  /**
   *
   * @param {{agendamento: Agendamento, paciente: Paciente}[]} agendamentosComPaciente
   */
  #renderizarListaDeAgendamentos(agendamentosComPaciente) {
    const table = new Table({
      columns: [
        { name: "Data", alignment: "center" },
        { name: "H.Ini", alignment: "center" },
        { name: "H.Fim", alignment: "center" },
        { name: "Tempo", alignment: "center" },
        { name: "Nome", alignment: "left" },
        { name: "Dt.Nasc.", alignment: "center" },
      ],
    });

    agendamentosComPaciente.forEach(({ agendamento, paciente }) => {
      table.addRow({
        Data: agendamento.dia.toString(),
        "H.Ini": agendamento.intervaloDeHorario.inicio,
        "H.Fim": agendamento.intervaloDeHorario.fim,
        Tempo: agendamento.intervaloDeHorario.duracao.toString(),
        Nome: paciente.nome.valor,
        "Dt.Nasc.": paciente.dataDeNascimento.toString(),
      });
    });

    table.printTable();
  }

  #lerCpf() {
    while (true) {
      const cpfValor = this.#io.lerString("CPF: ");
      try {
        const cpf = new Cpf(cpfValor);
        return cpf;
      } catch (err) {
        this.#io.escreve(`Erro: ${err.message}`);
      }
    }
  }

  #lerNomeDePessoa() {
    while (true) {
      const nomeValor = this.#io.lerString("Nome: ");
      try {
        const nomeDePessoa = new NomeDePessoa(nomeValor);
        return nomeDePessoa;
      } catch (err) {
        this.#io.escreve(`Erro: ${err.message}`);
      }
    }
  }

  #lerDataDeNascimento() {
    while (true) {
      const dataDeNascimentoStr = this.#io.lerString(
        "Data de Nascimento (DD/MM/AAAA): "
      );
      try {
        const dataDeNascimento =
          DataDeNascimento.fromBrDateString(dataDeNascimentoStr);
        return dataDeNascimento;
      } catch (err) {
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
      } catch (err) {
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
      } catch (err) {
        this.#io.escreve(`Erro: ${err.message}`);
      }
    }
  }
}
