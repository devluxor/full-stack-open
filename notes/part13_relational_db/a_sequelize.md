# Using relational databases with Sequelize

MongoDB is a so-called NoSQL database. NoSQL databases became very common just over 10 years ago, when the scaling of the internet started to produce problems for relational databases that utilized the older generation SQL query language.

Relational databases have since then experienced a new beginning. Problems with scalability have been partially resolved, and they have also adopted some features of NoSQL databases. In this section we explore different NodeJS applications that use relational databases, we will focus on using the database PostgreSQL which is the number one in the open source world.

## Pros and Cons of document databases

Mongo is a document database and one of its most characteristic features is that it is schemaless, i.e. the database has only a very limited awareness of what kind of data is stored in its collections. The schema of the database exists only in the program code, which interprets the data in a specific way, e.g. by identifying that some of the fields are references to objects in another collection.

In Mongo, a collection of documents could look like:

```js
[
  {
    "_id": "600c0e410d10256466898a6c",
    "content": "HTML is easy"
    "date": 2021-01-23T11:53:37.292+00:00,
    "important": false
    "__v": 0
  },
  {
    "_id": "600c0edde86c7264ace9bb78",
    "content": "CSS is hard"
    "date": 2021-01-23T11:56:13.912+00:00,
    "important": true
    "__v": 0
  },
]
```

And users would look like:

```js
[
  {
    "_id": "600c0e410d10256466883a6a",
    "username": "mluukkai",
    "name": "Matti Luukkainen",
    "passwordHash" : "$2b$10$Df1yYJRiQuu3Sr4tUrk.SerVz1JKtBHlBOARfY0PBn/Uo7qr8Ocou",
    "__v": 9,
    notes: [
      "600c0edde86c7264ace9bb78",
      "600c0e410d10256466898a6c"
    ]
  },
]
```

MongoDB does know the types of the fields of the stored entities, but it has no information about which collection of entities the user record ids are referring to. MongoDB also does not care what fields the entities stored in the collections have. Therefore MongoDB leaves it entirely up to the programmer to ensure that the correct information is being stored in the database.

There are both advantages and disadvantages to not having a schema. One of the advantages is the flexibility that schema agnosticism brings: since the schema does not need to be defined at the database level, application development may be faster in certain cases, and easier, with less effort needed in defining and modifying the schema in any case. Problems with not having a schema are related to error-proneness: everything is left up to the programmer. The database itself has no way of checking whether the data in it is honest, i.e. whether all mandatory fields have values, whether the reference type fields refer to existing entities of the right type in general, etc.

The relational databases that are the focus of this section, on the other hand, lean heavily on the existence of a schema, and the advantages and disadvantages of schema databases are almost the opposite compared of the non-schema databases.

## Sequelize

Sequelize is a popular Object-Relational Mapping (ORM) library for Node.js, designed to work with relational databases like MySQL, PostgreSQL, SQLite, and MSSQL. ORM is a programming technique that allows developers to interact with databases using an object-oriented paradigm instead of raw SQL queries.

With Sequelize, you can define your database models as JavaScript classes, and Sequelize will handle the mapping of these models to database tables. This simplifies database interactions and makes it easier to work with databases in a Node.js application.

Key features of Sequelize include:

1. **Model Definition:** You can define your database models using Sequelize's `define` method, specifying the fields, data types, and relationships between models:

2. **CRUD Operations:** Sequelize provides methods for creating, retrieving, updating, and deleting records in the database. These operations can be performed using the model instances.

3. **Associations:** Sequelize supports defining relationships between models, such as one-to-one, one-to-many, and many-to-many associations. This makes it easy to work with related data.


4. **Migrations:** Sequelize provides a migration system that allows you to version-control your database schema changes. Migrations are JavaScript files that describe how the database should change over time.

## Creating tables with `Model`

When using Sequelize, each table in the database is represented by a model, which is effectively it's own JavaScript class:

```js
class Note extends Model {}

Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  important: {
    type: DataTypes.BOOLEAN
  },
  date: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})
```

Each column has a type defined, as well as other properties if necessary, such as whether it is the main key of the table. The second argument in the model definition contains the `sequelize` attribute (defined from `new Sequelize(DATABASE_URL, {dialectOnptions:{}})`) as well as other configuration information. We also defined that the table does not have to use the timestamps columns (created_at and updated_at).

We also defined underscored: true, which means that table names are derived from model names as plural snake case versions. Practically this means that, if the name of the model, as in our case is `Note`, then the name of the corresponding table is its plural version written with a lower case initial letter, i.e. `notes`. If, on the other hand, the name of the model would be "two-part", e.g. `StudyGroup`, then the name of the table would be `study_groups`. Sequelize automatically infers table names, but also allows explicitly defining them.

The same naming policy applies to columns as well.

## CRUD

The database operation is easy to do using the query interface provided by models, the method `findAll` works exactly as it is assumed by it's name to work:

```js
app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll()
  res.json(notes)
})
```

Creating a new note is done by calling the model's Note method create and passing as a parameter an object that defines the values of the columns.

```js
app.use(express.json())

// ...

app.post('/api/notes', async (req, res) => {
  console.log(req.body)
  const note = await Note.create(req.body)
  res.json(note)
})
```

Instead of the create method, it is also possible to save to a database using the build method first to create a Model-object from the desired data, and then calling the save method on it:

```js
const note = Note.build(req.body)
await note.save()
```

Calling the build method does not save the object in the database yet, so it is still possible to edit the object before the actual save event:

```js
const note = Note.build(req.body)

note.important = true
await note.save()
```

### Validations

Not valid insertions (like violating not-null constraints) means the rejection of promises and exception. For example:

```sh
(node:39109) UnhandledPromiseRejectionWarning: SequelizeValidationError: notNull Violation: Note.content cannot be null
    at InstanceValidator._validate (/Users/mluukkai/opetus/fs-psql/node_modules/sequelize/lib/instance-validator.js:78:13)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
```

We need to add the classic `try`/`catch` error handling method for `async` functions:

```js
app.post('/api/notes', async (req, res) => {
  try {
    const note = await Note.create(req.body)
    return res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```