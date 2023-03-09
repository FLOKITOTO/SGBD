const http = require("http");
const { exec } = require("child_process");

const port = 3001;

const server = http.createServer((request, response) => {
  const command = request.url.substr(1);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      response.writeHead(400, { "Content-Type": "text/plain" });
      response.write(error.message);
      response.end();
      return;
    }
    if (stderr) {
      response.writeHead(400, { "Content-Type": "text/plain" });
      response.write(stderr);
      response.end();
      return;
    }
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write(stdout);
    response.end();
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
/* 

app.js : Le point d'entrée de l'application. 
Il initialise le serveur et les différents contrôleurs de la base de données et de stockage, et les relie entre eux.

*/
