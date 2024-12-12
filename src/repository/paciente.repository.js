// @ts-check

import { Op } from "sequelize";
import { Cpf } from "../campos/cpf.js";
import { PacienteDbModel } from "../db/models/paciente.js";
import { Paciente } from "../entidades/paciente.js";
import { NomeDePessoa } from "../campos/nome-de-pessoa.js";
import { DataDeNascimento } from "../campos/data-de-nascimento.js";

export class PacienteRepository {
  /**
   * @param {Cpf} cpf
   * @returns {Promise<boolean>}
   */
  async cpfCadastrado(cpf) {
    const paciente = await this.buscarPorCpf(cpf);
    return !!paciente;
  }

  /**
   *
   * @param {Cpf} cpf
   * @returns {Promise<Paciente | null>}
   */
  async buscarPorCpf(cpf) {
    const pacienteDb = await PacienteDbModel.findByPk(cpf.valor);
    if (!pacienteDb) return null;

    const paciente = this.#mapPacienteDbToPaciente(pacienteDb);
    return paciente;
  }

  /**
   * @param {'nome' | 'CPF'} ordem
   * @returns {Promise<Paciente[]>}
   */
  async listarTodos(ordem) {
    const pacientesDb = await PacienteDbModel.findAll({
      order: [[ordem === "CPF" ? "cpf" : "nome", "ASC"]],
    });
    const pacientes = pacientesDb.map(this.#mapPacienteDbToPaciente);
    return pacientes;
  }

  /**
   * @param {Cpf[]} cpfs
   * @returns {Promise<Paciente[]>}
   */
  async listarAlguns(cpfs) {
    const cpfsValues = cpfs.map((cpf) => cpf.valor);
    const cpfsValuesUnicos = Array.from(new Set(cpfsValues));
    const pacientesDb = await PacienteDbModel.findAll({
      where: {
        cpf: {
          [Op.in]: cpfsValuesUnicos,
        },
      },
    });
    const pacientes = pacientesDb.map(this.#mapPacienteDbToPaciente);
    return pacientes;
  }

  /**
   *
   * @param {Paciente} paciente
   * @returns {Promise<void>}
   */
  async salvar(paciente) {
    await PacienteDbModel.upsert({
      cpf: paciente.cpf.valor,
      nome: paciente.nome.valor,
      dataDeNascimento: paciente.dataDeNascimento.toJsDate(),
    });
  }

  /**
   *
   * @param {Paciente} paciente
   * @returns {Promise<void>}
   */
  async exluir(paciente) {
    await PacienteDbModel.destroy({ where: { cpf: paciente.cpf.valor } });
  }

  /**
   *
   * @param {PacienteDbModel} pacienteDb
   * @returns {Paciente}
   */
  #mapPacienteDbToPaciente(pacienteDb) {
    // @ts-ignore
    const cpf = new Cpf(pacienteDb.cpf);
    // @ts-ignore
    const nome = new NomeDePessoa(pacienteDb.nome);
    // @ts-ignore
    const [ano, mes, dia] = pacienteDb.dataDeNascimento.split("-").map(Number);
    const dataDeNascimento = new DataDeNascimento(dia, mes, ano);

    const paciente = new Paciente(cpf, nome, dataDeNascimento);

    return paciente;
  }
}
