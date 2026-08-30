class BrunoClipboard {
  constructor() {
    this.items = [];
    this.isCut = false;
    this.sourceCollectionUid = null;
  }

  /**
   * @param {Object} payload
   * @param {Object|Object[]} payload.items - Item(s) to copy/cut
   * @param {boolean} [payload.isCut] - true for cut (move) semantics
   * @param {string} [payload.sourceCollectionUid] - collection the items were cut from
   */
  write(payload = {}) {
    const items = Array.isArray(payload.items) ? payload.items : [payload.items].filter(Boolean);
    this.items = items;
    this.isCut = !!payload.isCut;
    this.sourceCollectionUid = payload.sourceCollectionUid || null;
  }

  /**
   * @returns {Object} Result with items array
   */
  read() {
    return {
      items: this.items,
      hasData: this.items.length > 0,
      isCut: this.isCut,
      sourceCollectionUid: this.sourceCollectionUid
    };
  }
}

const brunoClipboard = new BrunoClipboard();

export default brunoClipboard;
