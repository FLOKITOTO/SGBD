const http = require("http");
const fs = require("fs");

// Load databases from JSON file
let databases = {};

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    // ROOT du projet
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World!\n");
  } else if (req.url === "/databases") {
    // GET POST /databases
    if (req.method === "GET") {
      // Listes BDD
      const databaseList = Object.keys(databases);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(databaseList));
    } else if (req.method === "POST") {
      // Création BDD
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const databaseName = JSON.parse(body).name;
        databases[databaseName] = {};
        saveDatabases(databases);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: `Database ${databaseName} created successfully`,
          })
        );
      });
    }
  } else if (req.url.startsWith("/databases/")) {
    // Handle requests for specific databases
    const urlParts = req.url.split("/");
    const databaseName = urlParts[2];
    if (databases[databaseName]) {
      if (urlParts.length === 3) {
        if (req.method === "GET") {
          // GET /databases/:database_name
          // Listes des tables d'une BDD
          const tableList = Object.keys(databases[databaseName]);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(tableList));
        } else if (req.method === "DELETE") {
          // DELETE /databases/:database_name
          // Supression d'une BDD
          delete databases[databaseName];
          saveDatabases(databases);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: `Database ${databaseName} deleted successfully`,
            })
          );
        } else if (req.method === "POST") {
          // POST /databases/:database_name
          // Création d'une table dans une BDD
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            const tableName = JSON.parse(body).name;
            databases[databaseName][tableName] = [];
            saveDatabases(databases);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: `Table ${tableName} created successfully in ${databaseName}`,
              })
            );
          });
        }
      } else if (urlParts.length === 4) {
        const tableName = urlParts[3];
        if (databases[databaseName][tableName]) {
          if (req.method === "GET") {
            // GET /databases/:database_name/:table_name
            // Listes des tables d'une BDD
            const fields = Object.keys(
              databases[databaseName][tableName][0]
            ).join(", ");
            const data = databases[databaseName][tableName].map((obj) =>
              Object.values(obj)
            );
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                table_name: tableName,
                fields: fields,
                data: data,
              })
            );
          } /*ici */ else if (req.method === "POST") {
            // POST /databases/:database_name/:table_name
            // Insertion de données dans une table
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString();
            });
            req.on("end", () => {
              try {
                const row = JSON.parse(body);
                const table = databases[databaseName][tableName];
                const id = table.length + 1;
                row.id = id;
                table.push(row);
                saveDatabases();
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    id: id,
                    message: "Data inserted successfully",
                  })
                );
              } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    error: "Invalid JSON payload",
                  })
                );
              }
            });
          } else if (req.method === "DELETE") {
            // DELETE /databases/:database_name/:table_name
            // Suppression d'une table
            delete databases[databaseName][tableName];
            saveDatabases(databaseName);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Table deleted successfully");
          } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Endpoint not found");
          }
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: `Table ${tableName} not found in ${databaseName} database`,
            })
          );
        }
      } else if (urlParts.length === 5) {
        const tableName = urlParts[3];
        const id = parseInt(urlParts[4]);
        if (databases[databaseName][tableName]) {
          const table = databases[databaseName][tableName];
          const row = table.find((obj) => obj.id === id);
          if (row) {
            if (req.method === "GET") {
              // GET /databases/:database_name/:table_name/:id
              // Listes des champs d'une table
              const fields = Object.keys(row).join(", ");
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  fields: fields,
                  data: row,
                })
              );
            } else if (req.method === "PUT") {
              // PUT /databases/:database_name/:table_name/:id
              // Mise à jour d'une donnée
              let body = "";
              req.on("data", (chunk) => {
                body += chunk.toString();
              });
              req.on("end", () => {
                try {
                  const newValues = JSON.parse(body);
                  const keys = Object.keys(newValues);
                  keys.forEach((key) => {
                    row[key] = newValues[key];
                  });
                  saveDatabases(databases); // Sauvegarde des modifications dans databases.json
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      message: "Data updated successfully",
                    })
                  );
                } catch (error) {
                  res.writeHead(400, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      error: "Invalid JSON payload",
                    })
                  );
                }
              });
            } else if (req.method === "DELETE") {
              // DELETE /databases/:database_name/:table_name/:id
              // Supprimer une donnée
              const index = table.findIndex((obj) => obj.id === id);
              table.splice(index, 1);
              saveDatabases(databaseName);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(table));
            } else {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("Endpoint not found");
            }
          } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Endpoint not found");
          }
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Endpoint not found");
        }
      }
    }
  }
});

function loadDatabases() {
  try {
    const data = fs.readFileSync("./databases.json");
    databases = JSON.parse(data);
    const databaseCount = Object.keys(databases).length;
    if (databaseCount === 0) {
      console.log("\x1b[31mNo existing databases\x1b[0m");
    } else {
      console.log(
        `\x1b[32m${databaseCount} database(s) found in databases.json:\x1b[0m`
      );
      for (const databaseName in databases) {
        console.log(`\x1b[33m${databaseName}:\x1b[0m`);
        for (const tableName in databases[databaseName]) {
          console.log(`  - \x1b[34m${tableName}:\x1b[0m`);
          const tableData = databases[databaseName][tableName];
          if (tableData.length > 0) {
            console.table(tableData);
          } else {
            console.log("    No data found in table.");
          }
        }
      }
    }
  } catch (error) {
    console.log("\x1b[31mNo existing databases\x1b[0m");
  }
}

// Save databases to file
function saveDatabases() {
  try {
    const data = JSON.stringify(databases);
    fs.writeFileSync("./databases.json", data);
  } catch (err) {
    console.error(`Error saving databases: ${err}`);
  }
}

// Démarrage du serveur HTTP
const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  loadDatabases();
});
