// @ts-check

import { DataTypes, Sequelize } from "sequelize";
import { PacienteDbModel } from "./models/paciente.js";
import { AgendamentoDbModel } from "./models/agendamento.js";

/**
 * Classe responsável pelo acesso ao BD e criação dos modelos e relacionamentos
 */
class Db {
  /** @type {Sequelize}  */
  #sequelize;

  /**
   * Inicializa o BD
   *
   * @returns True, se o BD está acessivel, ou False, caso contrário
   */
  async init() {
    this.#sequelize = new Sequelize("database", "postgress", "root", {
      host: "localhost",
      dialect: "postgres",
      logging: true,
      port: 5555,
    });

    try {
      await this.#sequelize.authenticate();
      console.log("Conexão com o banco de dados ok");
    } catch (error) {
      console.log("Erro ao conectar ao banco de dados: ");
      console.log(error);
      return false;
    }

    this.#initModels();
    this.#setupRelationships();

    return true;
  }

  get sequelize() {
    return this.#sequelize;
  }

  #initModels() {
    PacienteDbModel.init(
      {
        cpf: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        nome: {
          type: DataTypes.STRING,
        },
        dataDeNascimento: {
          type: DataTypes.DATE,
        },
      },
      { sequelize: this.sequelize }
    );

    AgendamentoDbModel.init(
      {
        cpfDoPaciente: {
          type: DataTypes.STRING,
        },
        diaHorarioInicio: {
          type: DataTypes.DATE,
          primaryKey: true,
        },
        diaHorarioFim: {
          type: DataTypes.DATE,
        },
      },
      { sequelize: this.sequelize }
    );
  }

  #setupRelationships() {
    PacienteDbModel.hasMany(AgendamentoDbModel, {
      foreignKey: { allowNull: false },
      as: "agendamentos",
    });
    AgendamentoDbModel.belongsTo(PacienteDbModel, {
      foreignKey: "cpfDoPaciente",
      as: "paciente",
    });
  }
}

const db = new Db();

export default db;
