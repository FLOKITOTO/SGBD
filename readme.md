Simple database system (SGBD) in Nodejs with IN MEMORY databases and asynchronous perennial storage, data should not be lost in case of shutdown.

The system must be restfull.

All interactions with the database are done via web service calls with curl commands.

Node Js without any framework, I'm not allowed to use any framework like express or other.

List of all curl commands including all of the CRUD.

```json
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
```
