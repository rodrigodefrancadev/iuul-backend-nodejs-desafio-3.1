# Desafio iuuL backend nodejs desafio-1.2


## Regras
### Campos
- [ ] CPF deve ser válido
- [ ] Nome de Pessoa deve ter no mínimo 5 caracteres
- [ ]

### Consultório Odontológico
- Cadastro
    - [ ] Não podem existir dois pacientes com o mesmo CPF
    - [ ] Não pode cadastrar pacientes menores de 13 anos
- Exclusão
    - [ ] Paciente com consulta agendada futura não pode ser excluído
    - [ ] Quando o Paciente for excluído, os agendamentos passados também devem ser excluídos
- Agendamento de Consulta (cpf, data, e hora inicial)
    - [ ] O CPF deve exitir no cadastro de paciêntes
    - [ ] O Agendamento deve ser para um periodo futuro (data > hoje) ou (data = hoje e hora > agora)
    - [ ] Cada paciente só pode ter um agendamento futuro por vez (Agendamentos passados não podem ser usados na verificação)
    - [ ] Não podem haver agendamentos sobrepostos
    - [ ] Horas Inicial e Final são definidas sempre de 15 em 15 minutos
    - [ ] os Horarios de Agendamento devem estar dentro do horario de funcionamento do consultório (08:00 as 19:00)
- Cancelamento de Agendamento (CPF, data, e hora inicial)
    - [ ] o cancelamento só pode ser feito de um agendamento futuro


### Agendamento
- Campos:
    - CPF
    - Data
    - HoraInicial
    - Hora Final
- Regras:
    - Hora Final > Hora Inicial



- Entrada de Dados
- [ ] Data deve ser no formato DD/MM/AAAA
- [ ] horário deve ser no formato HHMM
