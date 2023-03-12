const http = require("http");
const fs = require("fs");

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
});

// Démarrage du serveur HTTP
const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  loadDatabases();
});
