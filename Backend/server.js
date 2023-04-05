const http = require("http");
const fs = require("fs");
// const crypto = require("crypto");

// Load databases from JSON file
let databases = {};

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.url === "/docs") {
    // Documentation API
    const doc = `

      \x1b[\x1b[1m\x1b[31mPour plus d'informations, consultez la page [GITHUB_FLOKITOTO]\x1b[31m\x1b[1m  \x1b[32m[1m (https://github.com/FLOKITOTO)\x1b[32m\x1b[0m

      \x1b[1mDocumentation API in console\x1b[0m
      
      \x1b[36mGET /databases\x1b[0m
      Liste toutes les bases de données
      
      \x1b[36mPOST /databases\x1b[0m
      Crée une nouvelle base de données
      \x1b[33mCorps de la requête:\x1b[0m { "name": "nom_de_la_base_de_données" }
      
      \x1b[36mGET /databases/:database_name\x1b[0m
      Liste toutes les tables de la base de données :database_name
      
      \x1b[36mPOST /databases/:database_name\x1b[0m
      Crée une nouvelle table dans la base de données :database_name
      \x1b[33mCorps de la requête:\x1b[0m { "name": "nom_de_la_table" }
      
      \x1b[36mGET /databases/:database_name/:table_name\x1b[0m
      Liste tous les enregistrements de la table :table_name de la base de données :database_name
      
      \x1b[36mPOST /databases/:database_name/:table_name\x1b[0m
      Crée un nouvel enregistrement dans la table :table_name de la base de données :database_name
      \x1b[33mCorps de la requête:\x1b[0m { "field1": "valeur1", "field2": "valeur2", ... }
      
      \x1b[36mGET /databases/:database_name/:table_name/:id\x1b[0m
      Récupère l'enregistrement d'ID :id dans la table :table_name de la base de données :database_name
      
      \x1b[36mPUT /databases/:database_name/:table_name/:id\x1b[0m
      Met à jour l'enregistrement d'ID :id dans la table :table_name de la base de données :database_name
      \x1b[33mCorps de la requête:\x1b[0m { "field1": "nouvelle_valeur1", "field2": "nouvelle_valeur2", ... }
      
      \x1b[36mDELETE /databases/:database_name/:table_name/:id\x1b[0m
      Supprime l'enregistrement d'ID :id dans la table :table_name de la base de données :database_name
    `;

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(doc);
  }

  if (req.url === "/") {
    // ROOT du projet
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World!\n");
  } else if (req.url === "/databases") {
    // GET /databases *
    // List databases
    if (req.method === "GET") {
      // Listes BDD
      const databaseList = Object.keys(databases);
      if (databaseList.length === 0) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "No databases found" }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Lists of databases",
            databases: databaseList,
          })
        );
      }
    }
    // POST /databases *
    // Création BDD
    else if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const jsonBody = JSON.parse(body);
          const bodyKeys = Object.keys(jsonBody);
          if (
            bodyKeys.length !== 1 ||
            !bodyKeys.includes("name") ||
            !jsonBody.name
          ) {
            throw new Error(
              "Invalid body. Body should only contain a 'name' property with a value"
            );
          }
          const databaseName = jsonBody.name;
          if (databases[databaseName]) {
            throw new Error(`Database '${databaseName}' already exists`);
          }
          // const id = crypto.randomBytes(16).toString("hex"); // Génère un identifiant aléatoire de 16 octets en hexadécimal
          const id = Math.floor(Math.random() * 1000000000000000);
          databases[databaseName] = { id }; // Ajoute l'identifiant à l'objet représentant la base de données
          saveDatabases(databases);
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              id: id,
              message: `Database ${databaseName} created successfully`,
            })
          );
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: error.message,
            })
          );
        }
      });
    }
  } else if (req.url === "/databases/all") {
    // GET /databases/all
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(databases));
    }
  } else if (req.url.startsWith("/databases/")) {
    // Handle requests for specific databases
    const urlParts = req.url.split("/");
    const databaseName = urlParts[2];
    if (databases[databaseName]) {
      if (urlParts.length === 3) {
        // GET /databases/:database_name
        // Listes des tables d'une BDD
        if (req.method === "GET") {
          // GET /databases/:database_name
          // Listes des tables d'une BDD
          const tableList = Object.keys(databases[databaseName]);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(tableList));
        } else if (req.method === "DELETE") {
          // DELETE /databases/:database_name
          // Supression d'une BDD
          const databaseName = req.url.split("/")[2];
          if (databaseName in databases) {
            delete databases[databaseName];
            saveDatabases(databases);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: `Database ${databaseName} deleted successfully`,
              })
            );
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Database not found" }));
          }
        }

        // POST /databases/:database_name
        // Création d'une table dans une BDD
        else if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            try {
              const jsonBody = JSON.parse(body);
              if (Object.keys(jsonBody).length !== 1 || !jsonBody.name) {
                throw new Error(
                  "Invalid body. Body should only contain a 'name' property with a value"
                );
              }
              const tableName = jsonBody.name;
              if (!databases[databaseName]) {
                throw new Error(`Database '${databaseName}' does not exist`);
              }
              if (databases[databaseName][tableName]) {
                throw new Error(
                  `Table '${tableName}' already exists in '${databaseName}'`
                );
              }
              databases[databaseName][tableName] = [];

              saveDatabases(databases);
              res.writeHead(201, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: `Table ${tableName} created successfully in ${databaseName}`,
                })
              );
            } catch (error) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  error: error.message,
                })
              );
            }
          });
        }
      } else if (urlParts.length === 4 && urlParts[3].indexOf("?") !== -1) {
        const [tableName, queryString] = urlParts[3].split("?");
        const queries = queryString.split("&").map((query) => query.split("="));
        if (databases[databaseName][tableName]) {
          // GET /databases/:database_name/:table_name?field1=value1&field2=value2&field3__lt=value3&field4__lte=value4&field5__gt=value5&field6__gte=value6
          // Filtrer des données d'une table selon des critères
          if (req.method === "GET") {
            const table = databases[databaseName][tableName];
            let filteredTable = [...table];
            queries.forEach((query) => {
              const [field, value] = query;
              if (field.endsWith("_lt")) {
                // filtrer les valeurs inférieures à la valeur donnée
                const fieldName = field.replace("_lt", "");
                filteredTable = filteredTable.filter(
                  (obj) => obj[fieldName] < value
                );
              } else if (field.endsWith("_lte")) {
                // filtrer les valeurs inférieures ou égales à la valeur donnée
                const fieldName = field.replace("_lte", "");
                filteredTable = filteredTable.filter(
                  (obj) => obj[fieldName] <= value
                );
              } else if (field.endsWith("_gt")) {
                // filtrer les valeurs supérieures à la valeur donnée
                const fieldName = field.replace("_gt", "");
                filteredTable = filteredTable.filter(
                  (obj) => obj[fieldName] > value
                );
              } else if (field.endsWith("_gte")) {
                // filtrer les valeurs supérieures ou égales à la valeur donnée
                const fieldName = field.replace("_gte", "");
                filteredTable = filteredTable.filter(
                  (obj) => obj[fieldName] >= value
                );
              } else {
                filteredTable = filteredTable.filter(
                  (obj) => obj[field] == value
                );
              }
            });
            const fields = Object.keys(filteredTable[0]).join(", ");
            const data = filteredTable.map((obj) => Object.values(obj));
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                table_name: tableName,
                fields: fields,
                data: data,
              })
            );
          } else {
            // Méthode HTTP non autorisée
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method not allowed" }));
          }
        } else {
          // La table demandée n'existe pas dans la base de données
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Table not found" }));
        }
      } else if (urlParts.length === 4) {
        const tableName = urlParts[3];
        if (databases[databaseName][tableName]) {
          // GET /databases/:database_name/:table_name
          // Listes des données, d'une table, d'une BDD
          if (req.method === "GET") {
            const tableData = databases[databaseName][tableName];
            if (tableData.length === 0) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: `No data found in table ${tableName}`,
                })
              );
            } else {
              const fields = Object.keys(tableData[0]).join(", ");
              const data = tableData.map((obj) => Object.values(obj));
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  table_name: tableName,
                  fields: fields,
                  data: data,
                })
              );
            }
          }

          // POST /databases/:database_name/:table_name
          // Insertion de données dans une table
          else if (req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString();
            });
            req.on("end", () => {
              try {
                const row = JSON.parse(body);
                if (Object.keys(row).length === 0) {
                  // Vérifie s'il y a au moins un paramètre dans le JSON body
                  throw new Error("Missing parameters");
                }
                const table = databases[databaseName][tableName];
                // const id = crypto.randomBytes(16).toString("hex"); // Génère un identifiant aléatoire de 16 octets en hexadécimal
                const id = Math.floor(Math.random() * 1000000000000000);

                if (row.hasOwnProperty("id")) {
                  // Vérifie si le champ "id" est présent dans le JSON
                  throw new Error("Field 'id' is not allowed");
                }
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
                    error: error.message,
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
            res.end(`Table '${tableName}' deleted successfully`);
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
            // GET /databases/:database_name/:table_name/:id
            // Listes des champs d'une table
            if (req.method === "GET") {
              const fields = Object.keys(row).join(", ");
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  fields: fields,
                  data: row,
                })
              );
            }
            // POST /databases/:database_name/:table_name/:id
            // insérer une nouvelle valeur dans un champ d'une ligne d'une table
            else if (req.method === "POST") {
              let body = "";
              req.on("data", (chunk) => {
                body += chunk.toString();
              });
              req.on("end", () => {
                try {
                  const newValues = JSON.parse(body);
                  const keys = Object.keys(newValues);
                  const table = databases[databaseName][tableName];
                  const row = table.find((r) => r.id === id);
                  if (!row) {
                    throw new Error("Row not found");
                  }
                  const messages = []; // tableau pour stocker les messages
                  keys.forEach((key) => {
                    row[key] = newValues[key];
                    messages.push(`Field '${key}' added to row`);
                  });
                  saveDatabases(databases); // sauvegarde des modifications dans databases.json
                  const response = {
                    message: "Data updated successfully",
                    messages: messages, // inclure les messages dans la réponse JSON
                  };
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify(response));
                } catch (error) {
                  res.writeHead(400, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: error.message }));
                }
              });
            }
            // PUT /databases/:database_name/:table_name/:id
            // Mise à jour d'une donnée
            else if (req.method === "PUT") {
              let body = "";
              req.on("data", (chunk) => {
                body += chunk.toString();
              });
              req.on("end", () => {
                try {
                  const newValues = JSON.parse(body);
                  const keys = Object.keys(newValues);
                  const table = databases[databaseName][tableName];
                  const row = table.find((r) => r.id === id);
                  if (!row) {
                    throw new Error("Row not found");
                  }
                  const messages = []; // array pour stocker les messages
                  keys.forEach((key) => {
                    if (row.hasOwnProperty(key)) {
                      if (newValues[key] === "") {
                        delete row[key];
                        messages.push(`Field '${key}' removed by update`);
                        if (key === "id") {
                          delete row.id;
                          messages.push("ID removed by update");
                        }
                      } else {
                        row[key] = newValues[key];
                      }
                    } else {
                      throw new Error(`Field '${key}' not found`);
                    }
                  });
                  saveDatabases(databases); // Sauvegarde des modifications dans databases.json
                  const response = { message: "Data updated successfully" };
                  if (messages.length > 0) {
                    response.messages = messages; // inclure les messages dans la réponse JSON
                  }
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify(response));
                } catch (error) {
                  res.writeHead(400, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: error.message }));
                }
              });
            }
            // DELETE /databases/:database_name/:table_name/:id
            // Supprimer une donnée
            else if (req.method === "DELETE") {
              const index = table.findIndex((obj) => obj.id === id);
              if (index !== -1) {
                const deletedRow = table.splice(index, 1)[0];
                saveDatabases(databaseName);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message: `Row with ID ${id} deleted successfully`,
                    deleted: deletedRow.id,
                  })
                );
              } else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    error: `Row with ID ${id} not found`,
                  })
                );
              }
            } else {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("Row with ID ${id} not found in table ${tableName}");
            }
          } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Row with ID not found in table");
          }
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Row with ID ${id} not found in table ${tableName}");
        }
      }
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Database not found" }));
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

// REVOIR LA SAUVEGARDE POUR FRAGMENTER LE DATABASES.JSON
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

// exceptions
// sauvegarde partitionnée
