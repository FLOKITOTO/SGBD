// table.js
const Memory = require("./memory");
const Storage = require("./storage");

class Table {
  constructor(database, name, inMemory) {
    this.database = database;
    this.name = name;

    if (inMemory) {
      this.store = new Memory();
    } else {
      this.store = new Storage(`${database}_${name}.json`);
    }
  }

  add(data) {
    this.store.add(this.database, this.name, data);
  }

  get() {
    return this.store.get(this.database, this.name);
  }

  delete(index) {
    this.store.delete(this.database, this.name, index);
  }
}

module.exports = Table;
/* 

database/table.js : Le fichier qui définit la classe Table, 
qui est responsable de la gestion des tables de données pour chaque base de données.

*/
