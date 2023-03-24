const http = require("http");
const fs = require("fs");

<<<<<<< HEAD
// Initialisation des bases de données vides
let databases = {};

// Création du serveur HTTP
const server = http.createServer((req, res) => {
  // Parsing de l'URL de la requête
  const urlParts = req.url.split("/").filter((part) => part !== "");

  // Récupération des noms de base de données, de table et d'identifiant (si présent)
  const databaseName = urlParts[0];
  const tableName = urlParts[1];
  const id = urlParts[2];

  // Help
  const validEndpoints = [
    {
      title: "CREATE a BASE ⚡",
      term: "curl -X `method` `url`",
      method: "POST",
      url: "http://localhost:3000/:databaseName",
    },
    {
      title: "CREATE a TABLE ⚡",
      term: "curl -X `method` `url`",
      method: "POST",
      url: "http://localhost:3000/:databaseName/:tableName",
    },
    {
      title: "INSERT DATA in a TABLE ⚡",
      term: "curl -X `method` -H `contentType` -d `bodyRequest` `url`",
      contentType: "Content-Type: application/json",
      bodyRequest: '\'{"id": x, "name": "x"}\'',
      method: "POST",
      url: "http://localhost:3000/:databaseName/:tableName",
    },
    {
      title: "GET DATA from TABLE 👀",
      term: "curl -X `method` `url`",
      method: "GET",
      url: "http://localhost:3000/:databaseName/:tableName",
    },
    {
      title: "GET DATA from ONE FIELD by ID 👀",
      term: "curl -X `method` `url`",
      method: "GET",
      url: "http://localhost:3000/:databaseName/:tableName:/:id",
    },
    {
      title: "UPDATE DATA from ONE FIELD by ID ✅",
      term: "curl -X `method` -H `contentType` -d `bodyRequest` `url`",
      contentType: "Content-Type: application/json",
      bodyRequest: '\'{"id": x, "name": "x"}\'',
      method: "PUT",
      url: "http://localhost:3000/:databaseName/:tableName:/:id",
    },
    {
      title: "DELETE ONE FIELD by ID ❌",
      term: "curl -X `method` `url`",
      method: "DELETE",
      url: "http://localhost:3000/:databaseName/:tableName:/:id",
    },
    {
      title: "DELETE TABLE in DATABASE ❌",
      term: "curl -X `method` `url`",
      method: "DELETE",
      url: "http://localhost:3000/:databaseName/:tableName:",
    },
    {
      title: "DELETE DATABASE ❌",
      term: "curl -X `method` `url`",
      method: "DELETE",
      url: "http://localhost:3000/:databaseName",
    },
    {
      title: "See all commands 👀",
      term: "curl -X `method` `url`",
      method: "GET",
      url: "http://localhost:3000/help",
    },
  ];

  const validEndpoint = validEndpoints.find(
    (endpoint) => endpoint.method === req.method && req.url.match(endpoint.url)
  );

  if (validEndpoint) {
    // Handle valid request
    console.log(validEndpoints);
  } else {
    console.log(
      "This command does not exist. Type /help for a list of available commands."
    );
  }

  // Gestion de la création d'une base de données
  if (req.method === "POST" && databaseName && !tableName && !id) {
    if (!databases[databaseName]) {
      databases[databaseName] = {};
      saveDatabases();
      res.writeHead(201);
      res.end("Database created successfully");
    } else {
      res.writeHead(400);
      res.end("Database already exists");
    }
  }

  // Gestion de la suppression d'une base de données
  else if (req.method === "DELETE" && databaseName && !tableName && !id) {
    if (databases[databaseName]) {
      delete databases[databaseName];
      saveDatabases();
      res.writeHead(200);
      res.end("Database deleted successfully");
    } else {
      res.writeHead(400);
      res.end("Database does not exist");
    }
  }

  // Gestion de la création d'une table dans une base de données
  else if (req.method === "POST" && databaseName && tableName && !id) {
    if (!databases[databaseName][tableName]) {
      databases[databaseName][tableName] = {};
      saveDatabases();
      res.writeHead(201);
      res.end("Table created successfully");
    } else {
      res.writeHead(400);
      res.end("Table already exists");
    }
  }

  // Gestion de la suppression d'une table dans une base de données
  else if (req.method === "DELETE" && databaseName && tableName && !id) {
    if (databases[databaseName][tableName]) {
      delete databases[databaseName][tableName];
      saveDatabases();
      res.writeHead(200);
      res.end("Table deleted successfully");
    } else {
      res.writeHead(400);
      res.end("Table does not exist");
    }
  }

  // Gestion de la récupération de toutes les données d'une table
  else if (req.method === "GET" && databaseName && tableName && !id) {
    if (databases[databaseName][tableName]) {
      res.writeHead(200);
      res.end(JSON.stringify(databases[databaseName][tableName]));
    } else {
      res.writeHead(400);
      res.end("Table does not exist");
    }
  }

  // Gestion de la récupération d'une donnée par son id
  else if (req.method === "GET" && databaseName && tableName && id) {
    if (
      databases[databaseName][tableName] &&
      databases[databaseName][tableName][id]
    ) {
      res.writeHead(200);
      res.end(JSON.stringify(databases[databaseName][tableName][id]));
    } else {
      res.writeHead(400);
      res.end("Data does not exist");
    }
  }

  // Gestion de l'ajout ou de la mise à jour d'une donnée par son id
  else if (req.method === "PUT" && databaseName && tableName && id) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      let data;

      try {
        data = JSON.parse(body);
      } catch (error) {
        res.writeHead(400);
        res.end("Invalid JSON");
        return;
      }

      if (!databases[databaseName][tableName]) {
        res.writeHead(400);
        res.end("Table does not exist");
        return;
      }

      databases[databaseName][tableName][id] = data;
      saveDatabases();
      res.writeHead(200);
      res.end("Data saved successfully");
    });
  }

  // Gestion de la suppression d'une donnée par son id
  else if (req.method === "DELETE" && databaseName && tableName && id) {
    if (
      databases[databaseName][tableName] &&
      databases[databaseName][tableName][id]
    ) {
      delete databases[databaseName][tableName][id];
      saveDatabases();
      res.writeHead(200);
      res.end("Data deleted successfully");
    } else {
      res.writeHead(400);
      res.end("Data does not exist");
    }
  }

  // Gestion de toutes les autres requêtes
  else {
    res.writeHead(404);
    res.end("Endpoint not found");
  }
});
=======
// Load databases from JSON file
let databases = {};

const server = http.createServer((req, res) => {
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
>>>>>>> dev

// Démarrage du serveur HTTP
const port = 3000;
server.listen(port, () => {
<<<<<<< HEAD
  console.log(`Server listening on port ${port}`);
=======
  console.log(`Server running at http://localhost:${port}/`);
>>>>>>> dev
  loadDatabases();
});
