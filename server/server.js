const http = require("http");
const ServerController = require("./server_controller");

const port = 3000;

const server = http.createServer((request, response) => {
  const serverController = new ServerController();
  serverController.handleRequest(request, response);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

/* 

server/server.js : Le fichier qui définit le serveur HTTP,
configure les routes et les points de terminaison pour les demandes entrantes et écoute les connexions entrantes.

*/
