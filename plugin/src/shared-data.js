export class SharedData {
  /**
   * @type {number}
   * @readonly
   */
  static version = 1;

  constructor() {
    if (this.constructor === SharedData) {
      throw new TypeError("Abstract class \"SharedData\" cannot be instantiated directly.");
    }
  }
}

export class Budget extends SharedData {
  /**
   *
   * @type {number}
   */
  #budget;

  /**
   * @param {number} initialBudget - 初期予算。
   */
  constructor(initialBudget = 1000) {
    super();
    this.#budget = initialBudget;
  }

  getOnce() {
    console.log(`get: ${this.#budget}`);
    return this.#budget;
  }

  /**
   * @param {number} newBudget - 新しい予算額。
   */
  set(newBudget) {
    console.log(`set: ${this.#budget} -> ${newBudget}`);
    this.#budget = newBudget;
  }
}

// ---

export class Souvenir extends SharedData {
  /**
   * @type {Record<string, unknown>[]}
   */
  #souvenirs;

  /**
   * @param {Record<string, unknown>[]} initialSouvenirs
   */
  constructor(initialSouvenirs = []) {
    super();
    this.#souvenirs = initialSouvenirs;
  }

  /**
   * @returns {Record<string, unknown>[]}
   */
  getOnce() {
    console.log(`get: ${JSON.stringify(this.#souvenirs)}`);
    return this.#souvenirs;
  }

  /**
   * @param {Record<string, unknown>[]} newSouvenirs
   */
  set(newSouvenirs) {
    console.log(`set: ${JSON.stringify(this.#souvenirs)} -> ${JSON.stringify(newSouvenirs)}`);
    this.#souvenirs = newSouvenirs;
  }
}
