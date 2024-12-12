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
    await this.#sequelize.sync();
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
          allowNull: false,
        },
        dataDeNascimento: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
      },
      {
        sequelize: this.sequelize,
        freezeTableName: true,
        indexes: [{ unique: true, fields: ["cpf"] }],
      }
    );

    AgendamentoDbModel.init(
      {
        diaHorarioInicio: {
          type: DataTypes.DATE,
          primaryKey: true,
        },
        diaHorarioFim: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        cpfDoPaciente: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: PacienteDbModel,
            key: "cpf",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
      {
        sequelize: this.sequelize,
        freezeTableName: true,
        indexes: [{ unique: true, fields: ["diaHorarioInicio"] }],
      }
    );
  }

  #setupRelationships() {
    PacienteDbModel.hasMany(AgendamentoDbModel, {
      foreignKey: "cpfDoPaciente",
    });
    AgendamentoDbModel.belongsTo(PacienteDbModel, {
      foreignKey: "cpfDoPaciente",
    });
  }
}

const db = new Db();

export default db;
