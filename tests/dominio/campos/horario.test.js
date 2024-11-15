// @ts-check

import test, { describe, it } from "node:test"
import assert from "node:assert/strict"
import { Horario } from "../../../src/dominio/campos/horario.js";


describe('Campo: Horário', () => {
    it('deve dar erro para hora menor que 0', () => {
        assert.throws(() => new Horario(-1, 30), /^Error: Hora deve ser um inteiro entre 0 e 23$/);
    })

    it('deve dar erro para hora maior que 23', () => {
        assert.throws(() => new Horario(24, 30), /^Error: Hora deve ser um inteiro entre 0 e 23$/);
    })

    it('deve dar erro para hora que não seja um valor inteiro', () => {
        assert.throws(() => new Horario(12.45, 30), /^Error: Hora deve ser um inteiro entre 0 e 23$/);
    })

    it('deve dar erro para minuto menor que 0', () => {
        assert.throws(() => new Horario(12, -1), /^Error: Minuto deve ser um inteiro entre 0 e 59$/);
    })

    it('deve dar erro para minuto maior que 59', () => {
        assert.throws(() => new Horario(12, 60), /^Error: Minuto deve ser um inteiro entre 0 e 59$/);
    })

    it('deve dar erro para minuto que não seja um valor inteiro', () => {
        assert.throws(() => new Horario(12, 30.75), /^Error: Minuto deve ser um inteiro entre 0 e 59$/);
    })

    it('deve criar um horário com sucesso', () => {
        assert.doesNotThrow(() => new Horario(0, 0))
        assert.doesNotThrow(() => new Horario(12, 30))
        assert.doesNotThrow(() => new Horario(23, 59))
    })

    it('deve criar um horário com sucesso', () => {
        assert.doesNotThrow(() => new Horario(0, 0))
        assert.doesNotThrow(() => new Horario(12, 30))
        assert.doesNotThrow(() => new Horario(23, 59))
    })

    it('deve dar erro ao tentar criar horário por string HHMM que não esteja no formato correto', () => {
        const hhmmErrados = [
            '',
            'a2',
            '23f4',
            '.3.1',
            'abcshdsghajsd',
        ];

        hhmmErrados.forEach(hhmm => assert.throws(
            () => Horario.fromHHMMstr(hhmm),
            /^Error: Horário deve estar no formato HHMM$/
        ))
    })

    it('deve dar erro ao tentar criar horário por string HHMM que esteja no formato correto, mas com hora ou minuto inválido', () => {
        assert.throws(() => Horario.fromHHMMstr('4545'), /^Error: Hora deve ser um inteiro entre 0 e 23$/);
        assert.throws(() => Horario.fromHHMMstr('1262'), /^Error: Minuto deve ser um inteiro entre 0 e 59$/);
    })

    it('deve criar horário com sucesso HHMM que esteja no formato correto e com hora ou minuto válidos', () => {
        assert.doesNotThrow(() => Horario.fromHHMMstr('0000'))
        assert.doesNotThrow(() => Horario.fromHHMMstr('1230'))
        assert.doesNotThrow(() => Horario.fromHHMMstr('2359'))
    })

    test('Comparar Horários', () => {
        const _0000 = Horario.fromHHMMstr('0000')
        const _1230 = Horario.fromHHMMstr('1230')
        const _1230_2 = Horario.fromHHMMstr('1230')
        const _2359 = Horario.fromHHMMstr('2359')

        assert(_0000 < _1230);
        assert(_0000 < _2359);
        assert(_1230 < _2359);
        assert(_1230 > _0000);
        assert(_1230 <= _1230_2);
        assert(_2359 > _1230);
        assert(_1230.equals(_1230));
        assert(_1230.equals(_1230_2));
    })

    test('A função toString deve retornar um horario com o formato HH:MM', () => {
        const hora = 6
        const minuto = 4
        const horario = new Horario(hora, minuto);

        assert(horario.toString() === `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`)

    })

    test('Horario.agora() deve retornar a hora atual', (t) => {
        const hora = 15;
        const minuto = 45;

        t.mock.timers.enable({
            apis: ['Date'],
            now: new Date(`2024-01-01T${hora}:${minuto}:12`)
        });

        const horarioAgora = Horario.agora();

        assert.equal(hora, horarioAgora.hora);
        assert.equal(minuto, horarioAgora.minuto);
    })
})