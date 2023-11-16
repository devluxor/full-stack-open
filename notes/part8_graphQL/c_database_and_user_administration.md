# Database and user administration

Install mongoose and dotenv in the backend:

```js
npm install mongoose dotenv
```

Define schema in `./models/modelname.js`

It's important to include validation both in graphQL (thanks to `!`) and in the database:

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // ! validation in db
    minlength: 5
  },
  // ...
})

module.exports = mongoose.model('Person', schema)
```

Note that GraphQL parses the fiend `_id` of an object into `id` automatically.

Example of app that uses mongo + graphql:

```js
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Person = require('./models/person')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const typeDefs = `
  ...
`

const resolvers = {
  Query: {
    personCount: async () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) {
        return Person.find({})
      }

      // If the argument has the value NO, the query returns the objects 
      // in which the phone field has no value (null):
      return Person.find({ phone: { $exists: args.phone === 'YES' } })
    },
    findPerson: async (root, args) => Person.findOne({ name: args.name }),
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      }
    },
  },
  Mutation: {
    addPerson: async (root, args) => {
      const person = new Person({ ...args })
      return person.save()
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone
      return person.save()
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})


startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
```

### Promises 

the resolver functions now return a promise, when they previously returned normal objects. When a resolver returns a promise, Apollo server sends back the value which the promise resolves to.

If 

```js
allPersons: async (root, args) => {
  return Person.find({})
},
```

Apollo server waits for the promise to resolve, and returns the result. So Apollo works roughly like this:

```js
allPersons: async (root, args) => {
  const result = await Person.find({})
  return result
}
```

## Validation

Input validation:

- GraphQL (`!`)
- MongoDB (`required: true`)

But, For handling possible validation errors in the schema, we must add an error-handling `try`/`catch` block to the save method. When we end up in the catch, we throw an exception `GraphQLError` with an error code. For example:

```js
Mutation: {
  addPerson: async (root, args) => {
      const person = new Person({ ...args })

      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError('Saving person failed', { // !!
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return person
  },
  // ...
}
```

## Combining graphQL and Mongo:

Imagine we have a type:

```js
  type Book {
    title: String!
    published: Int!
    author: Author! // !!!!
    genres: [String!]!
    id: ID!
  }
```

A mongo schema for Books:

```js
const schema = new mongoose.Schema({
  // ...
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  // ...
})
```

To save in db via a GraphQL resolver:

```js
 Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({name: args.author})

      // See the GQL type for Book;
      // we are saving a Mongo object as the value for the field
      const newBook = new Book({...args, author})

      try {
        await newBook.save()
      } catch (error) {
        // ...
      }

      return newBook
    },
    // ...
 }
```

## User and login

- Define schema for User:

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person'
    }
  ],
})

module.exports = mongoose.model('User', schema)
```

If a document has as one of their properties an array of ids of other documents, as in this example (an array of relationships), the idea is when, for instance a user adds a person to the list, the person is added to their `friends` list. Documents that create relationships with other documents store their ids in that list. It is a link with them, a way to store their relationships.

As usual, logging and identifying a user is handled using tokens: 

- user logs in, 
- server sends token in the response, 
- client saves token
- token is successively sent with the client's requests, 
- the server identifies the user thanks to that token in every future request

- when the user logs out, the client clears the token, so the user has to log again.
- tokens can expire in x time, forcing the user to log again


We need to make some additions to the GraphQL schema:

- add type User
- add type Token
- mutations for user operations (`createUser`, `login`)
- add property in type Query: `me: User`

Example:

```js
type User {
  username: String!
  friends: [Person!]!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  // ..
  me: User
}

type Mutation {
  // ...
  createUser(
    username: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
```

The query `me` returns the currently logged-in user. New users are created with the `createUser` mutation, and logging in happens with the `login` mutation.

We also need to add resolver for the mutations, with the usual error handling guards:

```js
const jwt = require('jsonwebtoken')

Mutation: {
  // ..
  createUser: async (root, args) => {
    const user = new User({ username: args.username })

    return user.save()
      .catch(error => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      })
  },
  login: async (root, args) => {
    const user = await User.findOne({ username: args.username })

    if ( !user || args.password !== 'secret' ) { // hardcoded password as an example
      throw new GraphQLError('wrong credentials', {
        extensions: {
          code: 'BAD_USER_INPUT'
        }
      })        
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
  },
},
```

Note that a `JWT_SECRET` must be defined in an `.env` file.

The mutation queries would now look like this:

```js
mutation {
  createUser (
    username: "mluukkai"
  ) {
    username
    id
  }
}
```

```js
mutation {
  login (
    username: "mluukkai"
    password: "secret"
  ) {
    value
  }
}
```

### Context

Just like in the previous case with REST, the idea now is that:

- A logged-in user adds a token they receive upon login _to all of his/her successive requests_. 
- Then _the token is added to GraphQL queries_ using the Authorization header.

(We can add tokens manually in the Apollo Explorer)

Modify the startup of the backend by giving the function that handles the startup `startStandaloneServer` another parameter `context`:

```js
startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id).populate('friends')
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
```

The object returned by `context` is given to all resolvers as their third parameter. Context is the right place to do things which are shared by multiple resolvers, like user identification.

So our code sets the object corresponding to the user who made the request to the `currentUser` field of the context. If there is no user connected to the request, the value of the field is `undefined`.

The resolver of the `me` query is very simple: it just returns the logged-in user it receives in the `currentUser` field of the third parameter of the resolver, `context`. It's worth noting that if there is no logged-in user, i.e. there is no valid token in the header attached to the request, the query returns `null`:

```js
Query: {
  // ...
  me: (root, args, context) => {
    return context.currentUser
  }
},
```

We can access the user from any resolver by destructuring. For example:

```js
Mutation: {
  resolver: (root, args, {currentUser}) {
    console.log('User logged in: ', currentUser)
  }
}
```

We use the `me` query to query data relative to the current user. For example:

```js
query {
  me {
    username
    friends{
      name
      phone
    }
  }
}
```

