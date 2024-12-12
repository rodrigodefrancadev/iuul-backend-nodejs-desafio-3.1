// @ts-check

/**
 * @template T
 * @template E
 */
class Result {
  #value;
  #errors;

  /**
   * @param {T | null} value
   * @param {E | null} errors
   * @private
   */
  constructor(value, errors) {
    this.#value = value;
    this.#errors = errors;
  }

  /**
   * Cria um resultado de sucesso.
   * @template T
   * @param {T} value
   * @returns {Result<T, null>}
   */
  static success(value) {
    return new Result(value, null);
  }

  /**
   * Cria um resultado de fracasso.
   * @template E
   * @param {E} errors
   * @returns {Result<null, E>}
   */
  static failure(errors) {
    return new Result(null, errors);
  }

  /**
   * Indica se a operação foi bem-sucedida.
   * @returns {boolean}
   */
  get isSuccess() {
    return this.#value !== null;
  }

  /**
   * Indica se a operação falhou.
   * @returns {boolean}
   */
  get isFailure() {
    return this.#errors !== null;
  }

  /**
   * Obtém o valor em caso de sucesso.
   * @returns {T | null}
   */
  get value() {
    return this.#value;
  }

  /**
   * Obtém a lista de erros em caso de fracasso.
   * @returns {E | null}
   */
  get errors() {
    return this.#errors;
  }
}
