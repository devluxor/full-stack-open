# Quick Reference Guide


## Sequelize

- Install `sequelize`
- Require needed references

```js
const { Sequelize, Model, DataTypes } = require('sequelize')

```

- Define `sequelize` object with options. For example:

```js
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});
```

- Define models (one per _table_). For example:

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
}, { // options
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})
```

## Basic CRUD operations:

### Example of read: (GET)

```js
app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll()
  res.json(notes)
})
```

Get one by primary key:

```js
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

### Example of create: (POST)

```js
app.use(express.json())
// ...
app.post('/api/notes', async (req, res) => {
  console.log(req.body)
  const note = await Note.create(req.body)
  res.json(note)
})
```

### Example of Update: (PUT)

```js
app.put('/:id', async (req, res) => {
  const result = await Blog.increment('likes', { where: { id: req.params.id }})
  if (result) return res.json(result[0][0][0])

  res.status(404).end()
})
```

And 

```js
usersRouter.put('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    user.username = req.body.newUsername
    await user.save() // !!
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

### Example of Delete: (DELETE)

```js
blogsRouter.delete('/:id', async (req, res) => {
  const blog = await Blog.destroy({
    where: {
      id: Number(req.params.id)
    }
  })
  res.json(blog)
})
```

## Relations and keys

### Defining primary keys and foreign keys

Table with Blogs:

```js
Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // other fields
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // other fields
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }, // !!
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})
```

Defining one-to-many relationships:

```js
const Note = require('./note')
const User = require('./user')


User.hasMany(Note)
Note.belongsTo(User)
Note.sync({ alter: true })
User.sync({ alter: true })

module.exports = {
  Note, User
}
```

### Alternative

As an alternative, instead of defining the foreign key `userId` at the class level, we could, at the time of a Note's creation, use the `build` method:

```js
const user = await User.findByPk(req.decodedToken.id)

// create a note without saving it yet
const note = Note.build({ ...req.body, date: new Date() })
 // put the user id in the userId property of the created note
note.userId = user.id
// store the note object in the database
await note.save()
```

## JOIN queries:

To join all notes created by a user to each user (classic `JOIN` query):

```sql
SELECT * from users
JOIN notes ON users.id = notes.user_id;
```

In sequelize we would do:

```js
// route that gets all users (now with their blogs)
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Note
    }
  })
  res.json(users)
})
```

## Validations

Sequelize provides a set of pre-defined validations for the model fields, which it performs before storing the objects in the database. For example:

```js
const User = sequelize.define("user", {
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
    validate: {
      is: /\w{3,}/i
    }
  },
  // ...
});
```

## Query parameters and _query parameter objects_

```js
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  // we define a query parameter object
  // this object now stores the query condition
  let important = {
    // the important column can be true or false, using one of the many Sequelize
    // operators like Op.in.
    [Op.in]: [true, false]
  }
  if ( req.query.important ) {
    important = req.query.important === "true"
  }

  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where: {
      // If the query parameter req.query.important is specified, 
      // the query changes to one of the two forms:
      // important: true or important: false
      important

      // we can also allow the user to specify a required keyword 
      // when retrieving notes, e.g. a request to 
      // http://localhost:3001/api/notes?search=database will return 
      // all notes mentioning 'database' or a request to 
      // http://localhost:3001/api/notes?search=javascript&important=true 
      // will return all notes marked as important and mentioning 'javascript'.
      content: {

        // Sequelize's Op.substring generates the query we want 
        // using the LIKE keyword in SQL.
        [Op.substring]: req.query.search ? req.query.search : ''
      }
    }
  })
  res.json(notes)
})

// ...
```

## Optimization of queries

There is still a flaw in our application: if we make a request to http://localhost:3001/api/notes, (i.e. we want all notes), our implementation will cause an unnecessary WHERE in the query, which may (depending on the implementation of the database engine) unnecessarily affect the query efficiency.

We can optimize the code so that the WHERE conditions are used only if necessary:

```js
router.get('/', async (req, res) => {
  const where = {} // !!

  if (req.query.important) {
    where.important = req.query.important === "true" // !!
  }

  if (req.query.search) {
    where.content = { // !!
      [Op.substring]: req.query.search
    }
  }

  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where // !!!
  })

  res.json(notes)
})
```

## Filtering and sorting queries:

We can filter results if they contain certain substrings in one OR more columns. We can have odder AND conditions as well:

```js
blogsRouter.get('/', async (req, res) => {
  let where = {}
  const query = req.query

  if (query.search) {
    where = {
      // if query.search appears in either title or author
      [Op.or]: [
        {title: {[Op.iLike]: query.search}},
        {author: {[Op.iLike]: query.search}}
      ]
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name', 'id']
    },
    where,
    order: [
      // sorting
      ['likes', 'DESC']
    ]
  })
  res.json(blogs)
})
```

## Grouping and aggregating:

```js
authorsRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    group: ['author'],
    attributes: [
      'author',
      [Sequelize.fn('COUNT', Sequelize.col('author')), 'articles'],
      [Sequelize.fn('sum', Sequelize.col('likes')), 'likes']
    ],
    order: [
      ['likes', 'DESC']
    ]
  })
  res.json(blogs)
})
```

Returns the number of blogs for each author and the total number of likes, resulting in something like this:

```json
[
  {
    author: "Jami Kousa",
    articles: "3",
    likes: "10"
  },
  {
    author: "Kalle Ilves",
    articles: "1",
    likes: "2"
  },
  {
    author: "Dan Abramov",
    articles: "1",
    likes: "4"
  }
]
```

## Migrations

Instead of depending on lines:

```js
Note.sync({ alter: true })
User.sync({ alter: true })
```

Using migrations is much more robust.

In practice, a migration is a single JavaScript file that describes some modification to a database. A separate migration file is created for each single or multiple changes at once. Sequelize keeps a record of which migrations have been performed, i.e. which changes caused by the migrations are synchronized to the database schema. When creating new migrations, Sequelize keeps up to date on which changes to the database schema are yet to be made. In this way, changes are made in a controlled manner, with the program code stored in version control.

### Basics

## Implement many-to-many relationships