// @ts-check

import { describe, it } from "node:test"
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
})