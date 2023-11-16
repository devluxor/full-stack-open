# Fragments and subscriptions

## Fragments

It is pretty common in GraphQL that multiple queries return similar results. For example, the query for the details of a person:

```js
query {
  findPerson(name: "Pekka Mikkola") {
    name
    phone
    address{
      street 
      city
    }
  }
}
```

or the query for all persons:

```js
query {
  allPersons {
    name
    phone
    address{
      street 
      city
    }
  }
}
```

Both return persons. When choosing the fields to return, both queries have to define exactly the same fields.

These kinds of situations can be simplified with the use of **fragments**.


In GraphQL, a fragment is a reusable piece of a query that defines a set of fields. Fragments allow you to define a group of fields and then include those fields in multiple queries, making your queries more modular and easier to maintain.

Fragments are particularly useful when you have complex queries with nested structures, and you want to avoid duplicating the same set of fields in multiple places. By using fragments, you can keep your queries DRY (Don't Repeat Yourself) and make your GraphQL schema more maintainable.

The fragments are not defined in the GraphQL schema, but in the client. The fragments must be declared when the client uses them for queries.

We declare a fragment like:

```js
fragment PersonDetails on Person {
  name
  phone 
  address {
    street 
    city
  }
}
```

With the fragment, we can do the queries in a compact form:

```js
query {
  allPersons {
    ...PersonDetails
  }
}

query {
  findPerson(name: "Pekka Mikkola") {
    ...PersonDetails
  }
}
```

We can declare a fragment in every query or store it once in a variable and reuse it:

```js
const PERSON_DETAILS = gql`
  fragment PersonDetails on Person {
    id
    name
    phone 
    address {
      street 
      city
    }
  }
`
```

Declared like this, the fragment can be placed to any query or mutation using a dollar sign and curly braces:

```js
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS}
`
```

## Subscriptions

In GraphQL, subscriptions provide a way to enable real-time communication between a client and a server. While typical GraphQL queries and mutations are request-response based (the client sends a request and receives a response), subscriptions allow the server to push updates to the client whenever certain events occur on the server.

Subscriptions are defined similarly to queries and mutations but with the subscription keyword. 

Technically speaking, the HTTP protocol is not well-suited for communication from the server to the browser, so, under the hood, Apollo uses a WebSocket connection to maintain an open channel between the client and server, allowing the server to push data to the client in real-time.

Subscriptions are radically different from anything we have seen in this course so far. Until now, all interaction between browser and server was due to a React application in the browser making HTTP requests to the server. GraphQL queries and mutations have also been done this way. With subscriptions, the situation is the opposite. After an application has made a subscription, it starts to listen to the server. When changes occur on the server, it sends a notification to all of its subscribers.

## Subscriptions in Practice (post 3.0 Apollo)

- `startStandaloneServer` does not allow adding subscriptions to the application, so let's switch to the more robust expressMiddleware function. As the name of the function already suggests, it is an Express middleware, which means that Express must also be configured for the application, with the GraphQL server acting as middleware.

Example:

```js
const { ApolloServer } = require('@apollo/server')

const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')

const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')

const User = require('./models/user')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const MONGODB_URI = 'mongodb+srv://lucsorr:FN8FLKq9Ji9qEm6l@cluster0.gqogeuf.mongodb.net/phonebook?retryWrites=true&w=majority'

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

// setup is now within a function
const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id).populate(
            'friends'
          )
          return { currentUser }
        }
      },
    }),
  )

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()
```

- Recommendation: `ApolloServerPluginDrainHttpServer`

The GraphQL server in the server variable is now connected to listen to the root of the server, i.e. to the / route, using the expressMiddleware object. Information about the logged-in user is set in the context using the function we defined earlier. Since it is an Express server, the middlewares express-json and cors are also needed so that the data included in the requests is correctly parsed and so that CORS problems do not appear.

Since the GraphQL server must be started before the Express application can start listening to the specified port, the entire initialization has had to be placed in an async function, which allows waiting for the GraphQL server to start.

## Subscriptions on the server (backend):

- Add a type Subscription to the schema, like:

```js
type Subscription {
  personAdded: Person!
}    
```

In this case, when a new person is added, all of its details are sent to all subscribers.

- Then, install two packages for adding subscriptions to GraphQL and a Node.js WebSocket library:

```bash
npm install graphql-ws ws @graphql-tools/schema
```

- add dependencies to the entry point `index.js`:

```js
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
```

- add this to the `start` function definition:

```js
const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
  
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  // ....
}
```

- then add a plugin object to the `plugins` array to the argument that creates the `ApolloServer`:

```js
const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },

    ],
  })
```

When queries and mutations are used, GraphQL uses the HTTP protocol in the communication. In case of subscriptions, the communication between client and server happens with WebSockets.

The above code registers a WebSocketServer object to listen the WebSocket connections, besides the usual HTTP connections that the server listens to. The second part of the definition registers a function that closes the WebSocket connection on server shutdown. If you're interested in more details about configurations, Apollo's documentation explains in relative detail what each line of code does.

WebSockets are a perfect match for communication in the case of GraphQL subscriptions since when WebSockets are used, also the server can initiate the communication.

- Add a resolver for the subscription. In our example, The subscription `personAdded` needs a resolver. The `addPerson` resolver also has to be modified so that it sends a notification to subscribers.

The required changes are as follows:
- add dependencies to the `resolvers.js` file:

```js
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
```

- add this line to the `addPerson` resolver, before the `return` expression:

```js
pubsub.publish('PERSON_ADDED', { personAdded: person })
```

- add the subscription:

```js
const resolvers = {
  // ...
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterator('PERSON_ADDED')
    },
  }
}
```

- Install this library: 

```sh
npm install graphql-subscriptions
```

With subscriptions, the communication happens using the publish-subscribe principle utilizing the object PubSub.

With these changes, the resolver of the `personAdded` subscription registers and saves info about all the clients that do the subscription. The clients are saved to an "iterator object" called PERSON_ADDED thanks to the following code:

```js
Subscription: {
  personAdded: {
    subscribe: () => pubsub.asyncIterator('PERSON_ADDED')
  },
},
```

The iterator name is an arbitrary string, but to follow the convention, it is the subscription name written in capital letters.

Adding a new person **publishes** a notification about the operation to all subscribers with PubSub's method publish:

```js
pubsub.publish('PERSON_ADDED', { personAdded: person }) 
```

Execution of this line sends a WebSocket message about the added person to all the clients registered in the iterator PERSON_ADDED.


### We can test subscriptions with the Apollo Explorer.

When the blue button PersonAdded is pressed, Explorer starts to wait for a new person to be added. On addition (that you need to do from another browser window), the info of the added person appears on the right side of the Explorer.

If the subscription does not work, check that you have the correct connection settings:

### Important remark:

Implementing subscriptions involves a lot of configurations. You will be able to cope with the few exercises of this course without worrying much about the details. If you are planning to use subscriptions in an production use application, you should definitely read Apollo's documentation on subscriptions carefully.

## Subscriptions in the client (frontend):

In order to use subscriptions in our React application, we have to do some changes, especially to its configuration. The configuration in main.jsx has to be modified like so:

```js
import { 
  ApolloClient, InMemoryCache, ApolloProvider, createHttpLink,

  split
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'


import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('phonenumbers-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const httpLink = createHttpLink({ uri: 'http://localhost:4000' })


const wsLink = new GraphQLWsLink(
  createClient({ url: 'ws://localhost:4000' })
)


const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  cache: new InMemoryCache(),

  link: splitLink
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
```

- For this to work, we have to install a dependency:

```sh
npm install graphql-ws 
```

The new configuration is due to the fact that the application must have an HTTP connection as well as a WebSocket connection to the GraphQL server.

### In React:

The subscriptions are done using the `useSubscription` hook function.

Add the code defining the subscription to the file queries.js:

```js
export const PERSON_ADDED = gql`
  subscription {
    personAdded {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS}
`
```

- and do the subscription in the App component. Example:

```js
import { useQuery, useMutation, useSubscription } from '@apollo/client'


const App = () => {
  // ...

  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      console.log(data)
    }
  })

  // ...
}
```

When a new person is added, the server sends a notification to the client, and the callback function defined in the onData attribute is called and given the details of the new person as parameters. In this example, the details of the new person are printed to the client’s console:

- Let's extend our solution so that when the details of a new person are received, the person is added to the Apollo cache, so it is rendered to the screen immediately:

```js
const App = () => {
  // ...

  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      const addedPerson = data.data.personAdded
      notify(`${addedPerson.name} added`)


      client.cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
        return {
          allPersons: allPersons.concat(addedPerson),
        }
      })
    }
  })

  // ...
}
```

Our solution has a small problem: a person is added to the cache and also rendered twice since the component PersonForm is adding it to the cache as well.

Let us now fix the problem by ensuring that a person is not added twice in the cache:

```js
// function that takes care of manipulating cache
export const updateCache = (cache, query, addedPerson) => {
  // helper that is used to eliminate saving same person twice
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }


  cache.updateQuery(query, ({ allPersons }) => {
    return {
      allPersons: uniqByName(allPersons.concat(addedPerson)),
    }
  })
}

const App = () => {
  const result = useQuery(ALL_PERSONS)
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient() 

  useSubscription(PERSON_ADDED, {
    onData: ({ data, client }) => {
      const addedPerson = data.data.personAdded
      notify(`${addedPerson.name} added`)

      updateCache(client.cache, { query: ALL_PERSONS }, addedPerson)
    },
  })

  // ...
}
```

The function `updateCache` can also be used in `PersonForm` for the cache update:

```js
import { updateCache } from '../App'

const PersonForm = ({ setError }) => { 
  // ...

  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    },
    update: (cache, response) => {

      updateCache(cache, { query: ALL_PERSONS }, response.data.addPerson)
    },
  })
   
  // ..
} 
```

### n+1 problem

- add this line to the backend entry point, enabling a debugging option:

```js
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


mongoose.set('debug', true); // !!!
```

For example, if a person has a field `friendOf` (relations):

```js
type Person {
  name: String!
  phone: String
  address: Address!
  friendOf: [User!]!
  id: ID!
}
```

to support queries like:

```js
query {
  findPerson(name: "Leevi Hellas") {
    friendOf {
      username
    }
  }
}
```

And a corresponding resolver:

```js
  Person: {
    // ...
    friendOf: async (root) => {
      const friends = await User.find({
        friends: {
          $in: [root._id]
        } 
      })

      return friends
    }
  },
```

The parameter root is the person object for which a friends list is being created, so we search from all User objects the ones which have root._id in their friends list.

We can immediately do even more complicated queries. It is possible for example to find the friends of all users:

```js
query {
  allPersons {
    name
    friendOf {
      username
    }
  }
}
```

However, this is inefficient: it does an unreasonable amount of queries to the database. So even though we primarily do one query for all persons, every person causes one more query in their resolver.

This is a manifestation of the famous n+1 problem, which appears every once in a while in different contexts, and sometimes sneaks up on developers without them noticing.

The right solution for the n+1 problem depends on the situation. Often, it requires using some kind of a join query instead of multiple separate queries.

In our situation, the easiest solution would be to save whose friends list they are on each Person object:

```js
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5
  },
  phone: {
    type: String,
    minlength: 5
  },
  street: {
    type: String,
    required: true,
    minlength: 5
  },  
  city: {
    type: String,
    required: true,
    minlength: 5
  },

  friendOf: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ], 
})
```

Then we could do a "join query", or populate the friendOf fields of persons when we fetch the Person objects:

```js
Query: {
  allPersons: (root, args) => {    
    console.log('Person.find')
    if (!args.phone) {

      return Person.find({}).populate('friendOf')
    }

    return Person.find({ phone: { $exists: args.phone === 'YES' } })

      .populate('friendOf')
  },
  // ...
}
```

After the change, we would not need a separate resolver for the field.

The allPersons query does not cause an n+1 problem, if we only fetch the name and the phone number:

```js
query {
  allPersons {
    name
    phone
  }
}
```

If we modify allPersons to do a join query because it sometimes causes an n+1 problem, it becomes heavier when we don't need the information on related persons. By using the fourth parameter of resolver functions, we could optimize the query even further. The fourth parameter can be used to inspect the query itself, so we could do the join query only in cases with a predicted threat of n+1 problems. However, we should not jump into this level of optimization before we are sure it's worth it.

In the words of Donald Knuth:

> Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil.

GraphQL Foundation's DataLoader library offers a good solution for the n+1 problem among other issues. More about using DataLoader with Apollo server here and here.

