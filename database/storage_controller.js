// db_controller.js
const Table = require("./table");

class DbController {
  constructor() {
    this.databases = {};
  }

  createDatabase(name) {
    if (!this.databases[name]) {
      this.databases[name] = {};
    }
  }

  deleteDatabase(name) {
    delete this.databases[name];
  }

  createTable(database, name, inMemory) {
    if (!this.databases[database]) {
      this.createDatabase(database);
    }

    if (!this.databases[database][name]) {
      this.databases[database][name] = new Table(database, name, inMemory);
    }
  }

  getTable(database, name) {
    if (!this.databases[database] || !this.databases[database][name]) {
      return null;
    }

    return this.databases[database][name];
  }
}

module.exports = DbController;

/* 

database/storage_controller.js : Le fichier qui définit la classe StorageController, 
qui est responsable de la gestion de la persistance des données stockées et de la récupération 
des données stockées en cas de redémarrage de l'application.

*/
