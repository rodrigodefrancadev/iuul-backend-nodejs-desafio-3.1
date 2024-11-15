// @ts-check

export class Horario {

    #hora;
    #minuto;

    /**
     * @param {number} hora 
     * @param {number} minuto 
     */
    constructor(hora, minuto) {
        if (hora < 0 || hora > 23 || !Number.isInteger(hora)) {
            throw new Error('Hora deve ser um inteiro entre 0 e 23');
        }

        if (minuto < 0 || minuto > 59 || !Number.isInteger(minuto)) {
            throw new Error('Minuto deve ser um inteiro entre 0 e 59');
        }

        this.#hora = hora;
        this.#minuto = minuto
    }

    /**
     * 
     * @param {string} hhmm
     * @returns {Horario} 
     */
    static fromHHMMstr(hhmm) {
        const regex = /^[0-9]{4}$/
        if (!regex.test(hhmm)) {
            throw new Error('Horário deve estar no formato HHMM');
        }

        const hh = hhmm.substring(0, 2);
        const mm = hhmm.substring(2);

        const hora = Number(hh);
        const minuto = Number(mm);

        const horario = new Horario(hora, minuto);
        return horario
    }

    valueOf() {
        return this.#hora * 60 + this.#minuto;
    }

    /**
     * 
     * @param {Horario} outroHorario 
     * @returns 
     */
    equals(outroHorario) {
        return this.valueOf() === outroHorario.valueOf()
    }

    toString() {
        return `${this.#hora.toString().padStart(2, '0')}:${this.#minuto.toString().padStart(2, '0')}`
    }
}