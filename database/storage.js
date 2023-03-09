// storage.js
const fs = require("fs");

class Storage {
  constructor(filename) {
    this.filename = filename;
  }

  load() {
    try {
      const data = fs.readFileSync(this.filename, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }

  save(data) {
    try {
      const jsonData = JSON.stringify(data);
      fs.writeFileSync(this.filename, jsonData, "utf8");
    } catch (error) {
      console.error(error);
    }
  }

  add(database, table, data) {
    const storedData = this.load();

    if (!storedData[database]) {
      storedData[database] = {};
    }

    if (!storedData[database][table]) {
      storedData[database][table] = [];
    }

    storedData[database][table].push(data);

    this.save(storedData);
  }

  get(database, table) {
    const storedData = this.load();

    if (!storedData[database] || !storedData[database][table]) {
      return [];
    }

    return storedData[database][table];
  }

  delete(database, table, index) {
    const storedData = this.load();

    if (!storedData[database] || !storedData[database][table]) {
      return;
    }

    storedData[database][table].splice(index, 1);

    this.save(storedData);
  }
}

module.exports = Storage;

/* 
  database/storage.js : Le fichier qui définit la classe Storage, 
  qui est responsable de la gestion des données stockées de manière permanente.
*/
