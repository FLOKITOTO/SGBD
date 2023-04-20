# API RESTFUL DOCUMENTATION

Simple database system (SGBD) in Nodejs without any framework with IN MEMORY DATABASES and asynchronous perennial storage, the data must not be lost in case of shutdown.
The system must be RESTFUL. All interactions with the database are done via web services calls with curl commands.
Here is the organization of the data in the database with tables and the different PATH.

## SUMMARY

1. [Instructions](#instructions)
2. [Prerequisites](#prerequisites)
   - [Dependencies](#dependencies)
3. [Uses](#uses)
4. [Licence](#LICENCE)

---

## INSTRUCTIONS

Start your visual studio code environment, and run the node server.js project in a terminal and access the root http://localhost:3000/. To use the requests use postman.

[Sommaire](#sommaire)

---

## PREREQUISITES

The installation of **[NodeJs](https://nodejs.org/en)** is recommended for the execution of the script.

[Sommaire](#sommaire)

---

## DEPENDENCIES

- [fs](https://nodejs.org/api/fs.html),
- [http](https://nodejs.org/api/http.html),

[Sommaire](#sommaire)

## USES

### **/**

`GET` ROOT **Retrieves access to databases and docs**

```
/
```

Response :

- `200 OK` : The API root has been reached successfully
- `404 Not Found` : the API root does not exist

The root is the main entry point with proposals /databases & /help.

---

### **/docs**

`GET` **ONLINE_DOCUMENTATION**

```
/docs
```

Response :

- `200 OK` : API documentation

La documentation va détailler l'ensemble des commandes curl disponible.

---

### ALL ABOUT DATABASES

#### `POST` **CREATE_DATABASE**

This command allows to create a database, with a request body name.

```
/databases
```

_BODY REQUEST :_

```json
{
  "name": ":database_name"
}
```

Response :

- `201 Created` : Database ${databaseName} created successfully
- `400 Conflict` : Database '${databaseName}' already exists
- `400 Bad Request` : "Invalid body. Body should only contain a 'name' property with a value.

```json
{
  "id": 454201015609267,
  "message": "Database :database_name created successfully"
}
```

```json
{
  "error": "Database ':database_name' already exists"
}
```

```json
{
  "error": "Invalid body. Body should only contain a 'name' property with a value"
}
```

---

#### `GET` **LISTS_DATABASES**

This command allows to list all available databases

```
/databases
```

Response :

- `200 OK` : Success

```json
{
  "message": "Lists of databases",
  "databases": [":database_name"]
}
```

```json
{
  "message": "No databases found"
}
```

---

#### `DELETE` **DELETE_DATABASE**

This command allows to delete a database.

```
/databases/:database_name
```

Response :

- `200 OK` : Success
- `404 Not Found` : Not found

```json
{
  "message": "Database :database_name deleted successfully"
}
```

```json
{
  "message": "Database ':database_name' not found"
}
```

---

### ALL ABOUT TABLES

#### `POST` **CREATE_TABLE**

This command allows to create a table in a database.

```
/databases/:database_name
```

_BODY REQUEST :_

```json
{
  "name": ":table_name"
}
```

Responses :

- `201 Created` : Success
- `409 Conflict` : Already exist
- `400 Bad Request` : Invalide body

```json
{
  "message": "Table :table_name created successfully in :database_name"
}
```

```json
{
  "error": "Table ':table_name' already exists in ':database_name'"
}
```

```json
{
  "error": "Invalid body. Body should only contain a 'name' property with a value"
}
```

---

#### `GET` **LIST_TABLES_OF_DATABASE**

This command allows to list all tables in a database.

```
/databases/:database_name
```

Response :

- `200 OK` : The list of all tables in the specified database
- `404 Not Found` : No tables found
- `404 Not Found` : Database found

```json
{
  "message": "Liste des tables",
  "tables": [":table_name"]
}
```

```json
{
  "message": "No tables found"
}
```

```json
{
  "message": "Database not found"
}
```

---

#### `DELETE` **DELETE_TABLE**

This command allows you to delete a table from a database.

```
/databases/:databadse_name/:table_name
```

Response :

- `200 OK` : Success
- `404 Not Found` : Table not found
- `404 Not Found` : Database not found

```json
{
  "message": "Table :table_name deleted successfully"
}
```

```json
{
  "error": "Table :table_name not found in :database_name database"
}
```

```json
{
  "message": "Database not found"
}
```

### ALL ABOUT DATA'S

#### `POST` **INSERT_DATA_IN_TABLE**

This command allows you to insert data's in table.

```
/databases/:database_name/:table_name/:id
```

_BODY REQUEST_

```json
{
  "field": "value"
}
```

Response :

- `201 Created` : Success
- `400 Bad Request` : Invalid body
- `404 Not Found` : Database not found
- `404 Not Found` : Table not found

```json
{
  "id": 511101113094438,
  "message": "Data inserted successfully"
}
```

```json
{
  "error": "Missing parameters"
}
```

```json
{
  "message": "Database not found"
}
```

```json
{
  "error": "Table :table_named not found in :database_name database"
}
```

---

#### `POST` **INSERT_NEW_FIELD_BY_ID**

This command allows you to insert new field and data via an ID.

```
/databases/:database_name/:table_name/:id
```

_BODY REQUEST_

```json
{
  "new_field": "value"
}
```

Response :

- `200 OK` : Success
- `404 Not Found` : ID not found
- `404 Not Found` : Database not found
- `404 Not Found` : Table not found

```json
{
  "message": "Data updated successfully",
  "messages": ["Field 'anotherField' added to row"]
}
```

```json
{
  "message": "Row with ID not found in table"
}
```

```json
{
  "message": "Database not found"
}
```

```json
{
  "message": "table not found"
}
```

#### `PUT` **UPDATE_DATA**

This command allows you to update data by an ID.

You can also delete field

```
/databases/:database_name/:table_name/:id
```

_BODY REQUEST_

```json
{
  "exiting_field": "changevalue"
}
```

This command also allows deletion by update :
(You must leave the field empty)

```json
{
  "exiting_field": ""
}
```

Response :

- `200 OK` : Success
- `200 OK` : Success removed by update
- `404 Not Found` : ID not found
- `404 Not Found` : Database not found
- `404 Not Found` : Table not found

```json
{
  "message": "Data updated successfully"
}
```

```json
{
  "message": "Data updated successfully",
  "messages": ["Field 'town' removed by update"]
}
```

```json
{
  "message": "Row with ID not found in table"
}
```

```json
{
  "message": "Database not found"
}
```

```json
{
  "message": "table not found"
}
```

#### `GET` **FILTER_IN_DATA**

This command allows you to filter based on fields and values from a table.

```
/databases/:database_name/:table_name?{field}{filter_parameter}={value}&{field}{filter_parameter}={value}
```

Parameters :

`__gt` : **Greater than**
`__gte` : **Greater than or equal to**

`__lt` : **Less than**
`__lte` : **Less than or equal TO**

`=` : **To write equal**

Response :

- `200 OK` : Success
- `404 Not Found` : Database not found
- `404 Not Found` : Table not found

```json
{
  "table_name": ":table_name",
  "fields": "name, surname, town, age, bank_account, id",
  "data": [
    ["Mehdi", "Fernand", "Toulouse", 23, 10000, 880506326695218],
    ["Florian", "Cardon", "Toulouse", 26, 100000, 109293517097326],
    ["Paul", "Gautier", "Paris", 24, 10000, 513163051728597]
  ]
}
```

```json
{
  "message": "Database not found"
}
```

```json
{
  "message": "table not found"
}
```

#### `GET` **LIST_OF_FIELDS_AND_DATAS**

This command allows you to list all fields and data in a table.

```

/databases/:database_name/:table_name

```

Response :

- `200 OK` : Success
- `404 Not Found` : No data found
- `404 Not Found` : Database not found
- `404 Not Found` : Table not found
-

```json
{
  "table_name": ":table_name",
  "fields": "field, field1, field2, id",
  "data": [["value", "value", "value", 511101113094438]]
}
```

```json
{
  "message": "No data found in table :table_name"
}
```

```json
{
  "message": "Database not found"
}
```

```json
{
  "message": "table not found"
}
```

---

#### `GET` **LIST_RECORD_BY_ID**

This command allows you to list record by ID.

```

/databases/:database_name/:table_name/:id

```

Response :

- `200 OK` : Success
- `404 Not Found` : Table not found
- `404 Not Found` : Database not found
- `404 Not Found` : Id not found

---

```json
{
  "message": "List of fields",
  "fields": "field, field1, field2, id, anotherField",
  "data": {
    "field": "changevalue",
    "field1": "value",
    "field2": "value",
    "id": 596718266852998,
    "anotherField": "anotherValue"
  }
}
```

```json
{
  "message": "Row with ID not found in table"
}
```

```json
{
  "message": "Database not found"
}
```

```json
{
  "message": "table not found"
}
```

#### `DELETE` **DELETE_ROW_BY_ID**

This command allows you to delete data via an ID.

```
/databases/:database_name/:table_name/:id
```

Response :

- `200 OK` : Success
- `404 Not Found` : ID not found
- `404 Not Found` : Database not found
- `404 Not Found` : Table not found

```json
{
  "message": "Row with ID 596718266852998 deleted successfully",
  "deleted": 596718266852998
}
```

```json
{
  "message": "Row with ID not found in table"
}
```

```json
{
  "message": "Database not found"
}
```

```json
{
  "message": "table not found"
}
```

## [Sommaire](#sommaire)

## Licence

Code sous license [GPL v3](LICENCE)

## Authors

[FLOKITOTO](https://github.com/FLOKITOTO)
[YOUTUBE](https://www.youtube.com/channel/UCQpPEJYhZn-PW3Ss0iIvPfQ)
[TWITTER](https://twitter.com/Fractalys_Sync)
