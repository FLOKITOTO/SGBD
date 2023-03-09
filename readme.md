1. Lorsque l'application est lancée, `app.js` est exécuté en premier. Il initialise le serveur et les différents contrôleurs pour la base de données et le stockage.
2. La classe `ServerController` définit les points de terminaison de l'API RESTful que le serveur expose pour les demandes entrantes.
3. La classe `DbController` définit les méthodes pour interagir avec la base de données en mémoire. Il est utilisé pour stocker, récupérer et supprimer des données à partir de la base de données.
4. La classe `StorageController` définit les méthodes pour stocker des données de manière asynchrone et les récupérer lorsque l'application est redémarrée.
5. Lorsque le serveur reçoit une demande entrante pour l'une des routes définies dans `ServerController`, la méthode correspondante dans `DbController` est appelée pour traiter la demande.
6. Si la demande entraîne une modification des données, `StorageController` est utilisé pour stocker les modifications de manière asynchrone, afin de garantir la persistance des données.
7. Lorsque l'application est redémarrée, `StorageController` récupère les données stockées pour les réinjecter dans la base de données en mémoire. Ainsi, les données ne sont pas perdues en cas de redémarrage de l'application.

```sql
                          API RESTful Server
                       +-------------------+
                       |                   |
                       |    Node.js sans   |
                       |      framework    |
                       |                   |
                       |     Port: 3000    |
                       |                   |
                       +---------+---------+
                                 |
                                 |
                                 |   Requests
                                 |
                                 |
                       +---------+---------+
                       |                   |
                       |    DB Controller  |
                       |                   |
                       +---------+---------+
                                 |
                                 |
                                 |   Memory Data
                                 |
                                 |
                       +---------+---------+
                       |                   |
                       |    Memory Tables  |
                       |                   |
                       +---------+---------+
                                 |
                                 |
                                 |   Asynchronous Data
                                 |
                                 |
                       +---------+---------+
                       |                   |
                       |  Storage Controller|
                       |                   |
                       +-------------------+

                            User Interface
                       +-------------------+
                       |                   |
                       |     Node.js       |
                       |                   |
                       |     Port: 3001    |
                       |                   |
                       +-------------------+
```

autre :

```sql
     +-------------+         +----------------+       +-------------------+
     |             |         |                |       |                   |
     |  Client     |         |    Serveur     |       |  Stockage         |
     |             |         |                |       |                   |
     +-------------+         +----------------+       +-------------------+
           |                          |                           |
           |  HTTP POST/GET           |                           |
           +------------------------>   REST API               	  |
           |                          |                           |
           |                          |                           |
           |  HTTP POST/GET           |                           |
           +------------------------>   Base de données           |
                                      |   en mémoire              |
                                      |                           |
                                      |  Stockage asynchrone      |
                                      +-------------------------->  Fichier JSON

```
