// memory.js
class Memory {
  constructor() {
    this.data = {};
  }

  add(database, table, data) {
    if (!this.data[database]) {
      this.data[database] = {};
    }

    if (!this.data[database][table]) {
      this.data[database][table] = [];
    }

    this.data[database][table].push(data);
  }

  get(database, table) {
    if (!this.data[database] || !this.data[database][table]) {
      return [];
    }

    return this.data[database][table];
  }

  delete(database, table, index) {
    if (!this.data[database] || !this.data[database][table]) {
      return;
    }

    this.data[database][table].splice(index, 1);
  }
}

module.exports = Memory;
