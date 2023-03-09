// server_controller.js
const DbController = require("../database/db_controller");
const StorageController = require("../database/storage_controller");

class ServerController {
  constructor() {
    this.dbController = new DbController();
    this.storageController = new StorageController();
  }

  handleRequest(request, response) {
    const method = request.method;
    const url = request.url;

    if (method === "POST" && url === "/database") {
      this.createDatabase(request, response);
    } else if (method === "DELETE" && url.startsWith("/database/")) {
      this.deleteDatabase(request, response);
    } else if (method === "POST" && url.startsWith("/database/")) {
      this.createTable(request, response);
    } else if (method === "GET" && url.startsWith("/database/")) {
      this.getTable(request, response);
    } else if (method === "POST" && url.startsWith("/data/")) {
      this.addData(request, response);
    } else if (method === "GET" && url.startsWith("/data/")) {
      this.getData(request, response);
    } else if (method === "DELETE" && url.startsWith("/data/")) {
      this.deleteData(request, response);
    } else {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.write("404 Not Found");
      response.end();
    }
  }

  createDatabase(request, response) {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      const name = JSON.parse(body).name;
      this.dbController.createDatabase(name);
      this.storageController.save(this.dbController.databases);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(JSON.stringify({ message: `Database ${name} created.` }));
      response.end();
    });
  }

  deleteDatabase(request, response) {
    const name = request.url.split("/")[2];
    this.dbController.deleteDatabase(name);
    this.storageController.save(this.dbController.databases);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify({ message: `Database ${name} deleted.` }));
    response.end();
  }

  createTable(request, response) {
    const urlParts = request.url.split("/");
    const database = urlParts[2];
    const name = urlParts[3];
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      const inMemory = JSON.parse(body).inMemory;
      this.dbController.createTable(database, name, inMemory);
      this.storageController.save(this.dbController.databases);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(JSON.stringify({ message: `Table ${name} created.` }));
      response.end();
    });
  }

  getTable(request, response) {
    const urlParts = request.url.split("/");
    const database = urlParts[2];
    const name = urlParts[3];
    const table = this.dbController.getTable(database, name);
    if (table) {
      const data = table.get();
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(JSON.stringify(data));
      response.end();
    } else {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.write(`Table ${name} not found.`);
      response.end();
    }
  }

  addData(request, response) {
    const urlParts = request.url.split("/");
    const database = urlParts[2];
    const tableName = urlParts[3];
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      const data = JSON.parse(body);
      const table = this.dbController.getTable(database, tableName);
      if (table) {
        table.add(data);
        this.storageController.save(this.dbController.databases);
        response.writeHead(200, { "Content-Type": "application/json" });
        response.write(JSON.stringify({ message: "Data added successfully." }));
        response.end();
      } else {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.write(`Table ${tableName} not found.`);
        response.end();
      }
    });
  }

  getData(request, response) {
    const urlParts = request.url.split("/");
    const database = urlParts[2];
    const tableName = urlParts[3];
    const id = urlParts[4];
    const table = this.dbController.getTable(database, tableName);
    if (table) {
      const data = table.get(id);
      if (data) {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.write(JSON.stringify(data));
        response.end();
      } else {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.write(`Data with id ${id} not found.`);
        response.end();
      }
    } else {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.write(`Table ${tableName} not found.`);
      response.end();
    }
  }

  deleteData(request, response) {
    const urlParts = request.url.split("/");
    const database = urlParts[2];
    const tableName = urlParts[3];
    const id = urlParts[4];
    const table = this.dbController.getTable(database, tableName);
    if (table) {
      table.delete(id);
      this.storageController.save(this.dbController.databases);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(JSON.stringify({ message: "Data deleted successfully." }));
      response.end();
    } else {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.write(`Table ${tableName} not found.`);
      response.end();
    }
  }
}

module.exports = ServerController;

/* 

server/server_controller.js : Le fichier qui définit la classe ServerController, 
qui est responsable de la gestion des demandes entrantes pour le serveur, 
telles que l'ajout de données, la récupération de données et la suppression de données.

*/

// const { parse } = require('url');
// const { addData, getData, updateData, deleteData } = require('./database/db_controller');

// class ServerController {
//   handleRequest(request, response) {
//     const { method, url } = request;
//     const { pathname, query } = parse(url, true);

//     switch (pathname) {
//       case '/addData':
//         if (method === 'POST') {
//           let body = '';
//           request.on('data', chunk => {
//             body += chunk.toString();
//           });
//           request.on('end', () => {
//             try {
//               const data = JSON.parse(body);
//               const result = addData(data);
//               response.writeHead(200, { 'Content-Type': 'application/json' });
//               response.write(JSON.stringify(result));
//               response.end();
//             } catch (error) {
//               response.writeHead(400, { 'Content-Type': 'text/plain' });
//               response.write(error.message);
//               response.end();
//             }
//           });
//         } else {
//           response.writeHead(405, { 'Content-Type': 'text/plain' });
//           response.write('Method not allowed');
//           response.end();
//         }
//         break;
//       case '/getData':
//         if (method === 'GET') {
//           const { database, table } = query;
//           const result = getData(database, table);
//           response.writeHead(200, { 'Content-Type': 'application/json' });
//           response.write(JSON.stringify(result));
//           response.end();
//         } else {
//           response.writeHead(405, { 'Content-Type': 'text/plain' });
//           response.write('Method not allowed');
//           response.end();
//         }
//         break;
//       case '/updateData':
//         if (method === 'PUT') {
//           let body = '';
//           request.on('data', chunk => {
//             body += chunk.toString();
//           });
//           request.on('end', () => {
//             try {
//               const data = JSON.parse(body);
//               const result = updateData(data);
//               response.writeHead(200, { 'Content-Type': 'application/json' });
//               response.write(JSON.stringify(result));
//               response.end();
//             } catch (error) {
//               response.writeHead(400, { 'Content-Type': 'text/plain' });
//               response.write(error.message);
//               response.end();
//             }
//           });
//         } else {
//           response.writeHead(405, { 'Content-Type': 'text/plain' });
//           response.write('Method not allowed');
//           response.end();
//         }
//         break;
//       case '/deleteData':
//         if (method === 'DELETE') {
//           const { database, table, id } = query;
//           const result = deleteData(database, table, id);
//           response.writeHead(200, { 'Content-Type': 'application/json' });
//           response.write(JSON.stringify(result));
//           response.end();
//         } else {
//           response.writeHead(405, { 'Content-Type': 'text/plain' });
//           response.write('Method not allowed');
//           response.end();
//         }
//         break;
//       default:
//         response.writeHead(404, { 'Content-Type': 'text/plain' });
//         response.write('Not found');
//         response.end();
//         break;
//     }
//   }
// }

// module.exports = ServerController;
