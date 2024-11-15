export class Cpf {

    #valor;

    get valor() {
        return this.#valor;
    }

    /**
     * 
     * @param {string} valor 
     */
    constructor(valor) {
        Cpf.#validar(valor);

        this.#valor = valor;
    }

    /**
     * @param {string} cpfStr
     */
    static #validar(cpfStr) {
        if (cpfStr.length < 11) {
            throw new Error('CPF inválido');
        }

        const algarismos = Array(10).fill(null).map((_, i) => i.toString())
        if (cpfStr.split('').some(caracter => !algarismos.includes(caracter))) {
            throw new Error('CPF inválido');
        }

        const cpfsDeNumerosRepetidos = algarismos.map((i) => i.repeat(11));
        if (cpfsDeNumerosRepetidos.includes(cpfStr)) {
            throw new Error('CPF inválido');
        }

        const digitosDoCpf = cpfStr.split('').map(Number);

        const digitoVerificador1Esperado = (() => {
            const soma = digitosDoCpf.slice(0, 9).map((d, i) => d * (10 - i)).reduce((acc, x) => acc + x, 0);
            const resto = soma % 11;
            const digito1 = resto <= 1 ? 0 : (11 - resto);
            return digito1;
        })();

        if (digitosDoCpf[9] !== digitoVerificador1Esperado) {
            throw new Error('CPF inválido');
        }

        const digitoVerificador2Esperado = (() => {
            const soma = digitosDoCpf.slice(0, 10).map((d, i) => d * (11 - i)).reduce((acc, x) => acc + x, 0);
            const resto = soma % 11;
            const digito2 = resto <= 1 ? 0 : (11 - resto);
            return digito2;
        })();

        if (digitosDoCpf[10] !== digitoVerificador2Esperado) {
            throw new Error('CPF inválido');
        }
    }

    toString() {
        return this.#valor;
    }

    toJson() {
        return this.#valor;
    }

    /**
     * 
     * @param {Cpf} outroCpf 
     */
    equal(outroCpf) {
        return this.#valor === outroCpf.#valor;
    }
}