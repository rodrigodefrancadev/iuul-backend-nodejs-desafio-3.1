// @ts-check
import { Data } from "../campos/data.js";
import { Horario } from "../campos/horario.js";
import { Configuracoes } from "../configuracoes.js";
import { Agendamento } from "../entidades/agendamento.js";
import { AgendamentoRepository } from "../repository/agendamento.repository.js";
import { PacienteRepository } from "../repository/paciente.repository.js";

export class CadastrarAgendamentoUseCase {
  #agendamentoRepository;
  #pacienteRepository;
  #configuracoes;

  /**
   * @param {AgendamentoRepository} agendamentoRepository
   * @param {PacienteRepository} pacienteRepository
   * @param {Configuracoes} configuracoes
   */
  constructor(pacienteRepository, agendamentoRepository, configuracoes) {
    this.#agendamentoRepository = agendamentoRepository;
    this.#pacienteRepository = pacienteRepository;
    this.#configuracoes = configuracoes;
  }

  /**
   * @param {Agendamento} agendamento
   */
  async executar(agendamento) {
    if (!agendamento.estaNoFuturo()) {
      throw new Error("O Agendamento precisa estar no futuro");
    }

    if (
      !agendamento.intervaloDeHorario.ehSubintervaloDe(
        this.#configuracoes.horarioDeFuncionamento
      )
    ) {
      throw new Error(
        "O agendamento precisa estar dentro do horário de funcionamento do consultório"
      );
    }

    const paciente = await this.#pacienteRepository.buscarPorCpf(
      agendamento.cpfDoPaciente
    );
    if (!paciente) {
      throw new Error("Paciente não encontrado");
    }

    const agendamentosDoMesmoDia = await this.#agendamentoRepository.filtrar({
      inicio: { dia: agendamento.dia },
    });
    const agendamentoSobrepoeOutro = agendamentosDoMesmoDia.some((ag) => {
      const naoSobrepoe =
        agendamento.intervaloDeHorario.inicio >= ag.intervaloDeHorario.fim ||
        agendamento.intervaloDeHorario.fim <= ag.intervaloDeHorario.inicio;
      const sobrepoe = !naoSobrepoe;
      return sobrepoe;
    });

    if (agendamentoSobrepoeOutro) {
      throw new Error("Já existe agendamento neste horário");
    }

    const agendamentosFuturos = await this.#agendamentoRepository.filtrar({
      cpf: agendamento.cpfDoPaciente,
      inicio: {
        dia: Data.hoje(),
        hora: Horario.agora(),
      },
    });

    const temAgendamentoFuturo = agendamentosFuturos.length > 0;

    if (temAgendamentoFuturo) {
      throw new Error("O paciente já possui um agendamento futuro cadastrado");
    }

    await this.#agendamentoRepository.salvar(agendamento);
  }
}
