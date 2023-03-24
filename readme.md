# DOCUMENTATION API RESTFUL

Système simple de base de données (SGBD) en Nodejs sans aucun framework avec des BASES DE DONNEES IN MEMORY ainsi q'un stockage péreen asynchrone, les données ne doivent pas être perdues en cas d'arrêt.
Le système doit être RESTFUL. Toutes les interactions avec la base de données se font via des appels de web services avec des commandes curl.
Voici l'organisation des données en base avec des tables et les différents PATH.

## Sommaire

1. [Consignes](#consignes)
2. [Pré-requis](#pré-requis)
   - [Dépendances](#dépendances)
3. [Utilisations](#utilisations)

4. [Exemples d&#39;utilisations](#exemples-dutilisations)

5. [Licence](#licence)

---

## Consignes

Démarrez votre environnement visual studio code, un premier terminal et accéder à la racine http://localhost:3000/. Ensuite vous pouvez créer une base de donnée pour cela effectuer la commande curl -X ### ACCES AUX BASES DE DONNÉES

[Sommaire](#sommaire)

---

## Pré-requis

L'installation de **[NodeJs](https://nodejs.org/en)** est recommandé pour l'éxécution du script

[Sommaire](#sommaire)

---

## Dépendances

- [fs](https://nodejs.org/api/fs.html),
- [http](https://nodejs.org/api/http.html),

## [Sommaire](#sommaire)

## Utilisations

### **RACINE**

```
/
```

`GET` **Récupère les accès à databases et help**

Réponses :

- `200 OK` : la racine de l'API a été atteinte avec succès
- `404 Not Found` : la racine de l'API n'existe pas

La racine est le point d'entré principal avec comme propositions /databases & /help.

---

### AIDE

```
/help
```

`GET` **Accéder aux commandes curls**

Réponses :

- `200 OK` : la documentation de l'API
- `404 Not Found` : la documentation de l'API n'existe pas

La documentation va détailler l'ensemble des commandes curl disponible.

---

### ACCES AUX BASES DE DONNÉES

```
/databases
```

`GET` **Lister toutes les bases de données**

Réponses :

- `200 OK` : la liste de toutes les bases de données existantes

Cette commande permet de lister l'ensemble des bases de données disponible.

---

`POST` **Créer une BDD**

_BODY REQUEST :_

```
{
  "name": ":database_name"
}
```

Réponses :

- `201 Created` : la base de données a été créée avec succès
- `409 Conflict` : la base de données existe déjà
- `400 Bad Request` : Le corps de la requête est mal formé ou des paramètres obligatoires sont manquants.

Cette commande permet de créer une base de données, avec un corps de requête `name`.

---

### ACTION DEPUIS UNE BASE DE DONNEES

```
/databases/:database_name
```

`GET` **Lister toutes les tables d'une BDD**

Réponses :

- `200 OK` : la liste de toutes les tables de la base de données spécifiée
- `404 Not Found` : la base de données n'existe pas

Cette commande permet de lister l'ensemble des des tables d'une base de données.

---

`POST` **Créer une table dans une BDD**

_BODY REQUEST :_

```
{
  "name": ":table_name"
}
```

Réponses :

- `201 Created` : la base de données a été créée avec succès
- `409 Conflict` : la base de données existe déjà
- `400 Bad Request` : Le corps de la requête est mal formé ou des paramètres obligatoires sont manquants.

Cette commande permet de créer une table dans une base de données.

---

**`DELETE` Supprimer une BDD**

Réponses :

- `200 OK` : la base de données a été supprimée avec succès
- `404 Not Found` : la base de données n'existe pas

Cette commande permet de supprimer une base de données.

Du point d'une API RESTFUL nous devons supprimer une base de données depuis sa ressource (/databases/:database_name).

---

### ACCES AUX DONNEES

```
/databases/:database_name/:table_name
```

`GET` **Lister tous les champs d'une table**

Réponses :

- `200 OK` : La liste de toutes les données de la table
- `404 Not Found` : La base de données ou la table n'existe pas

Cette commande permet de lister tous les champs d'une table.

---

`POST` **Insérer des données dans une table**

_BODY REQUEST_

```
{
  "key": "value",
  "key": value,
  "key": "value"
}
```

Réponses :

- `201 Created` : Les données ont été insérées avec succèsµ
- `404 Not Found` : La base de données ou la table n'existe pas
- `400 Bad Request` : Le corps de la requête est mal formé ou des paramètres obligatoires sont manquants.

Cette commande permet d'insérer des données dans une table.

---

### ACTION DEPUIS UNE TABLE

```
/databases/:database_name/:table_name/:id
```

`PUT` Mettre à jour une donnée

```
{
  "key": "value",
  "key": value,
  "key": "value"
}
```

Réponses :

- `200 OK` : La donnée a été mise à jour avec succès
- `404 Not Found` : La base de données, la table ou l'identifiant de la donnée n'existe pas
- `400 Bad Request` : Le corps de la requête est mal formé ou des paramètres obligatoires sont manquants.

Cette commande permet de mettre à jour des données via un ID.

---

**`DELETE` Supprimer une donnée depuis une table avec un ID:**

Réponses :

- `200 OK` : la donnée a été supprimée avec succès
- `404 Not Found` : la base de données, la table ou l'identifiant de la donnée n'existent pas

Cette commande permet de supprimer une donnée via une table

---

// pas encore fait

Supprimer plusieurs données

```
DELETE /databases/:database_name/:table_name?colonne1=valeur1

```

[Sommaire](#sommaire)

## Exemples-dutilisations

![aperçu](preview.gif)

[Sommaire](#sommaire)

## Licence

Code sous license [GPL v3](LICENSE)

## Authors

[FLOKITOTO](https://github.com/FLOKITOTO)
[YOUTUBE](https://www.youtube.com/channel/UCQpPEJYhZn-PW3Ss0iIvPfQ)
[TWITTER](https://twitter.com/Fractalys_Sync)
