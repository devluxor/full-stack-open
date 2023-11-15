# GraphQL server

The GraphQL philosophy is very different from REST. REST is resource-based. Every resource, for example a user, has its own address which identifies it, for example /users/10. All operations done to the resource are done with HTTP requests to its URL. The action depends on the HTTP method used.

The resource-basedness of REST works well in most situations. However, it can be a bit awkward sometimes.

Let's consider the following example: our bloglist application contains some kind of social media functionality, and we would like to show a list of all the blogs that were added by users who have commented on any of the blogs we follow.

If the server implemented a REST API, we would probably have to do multiple HTTP requests from the browser before we had all the data we wanted. The requests would also return a lot of unnecessary data, and the code on the browser would probably be quite complicated.

If this was an often-used functionality, there could be a REST endpoint for it. If there were a lot of these kinds of scenarios however, it would become very laborious to implement REST endpoints for all of them.

A GraphQL server is well-suited for these kinds of situations.

The main principle of GraphQL is that the code on the browser forms a query describing the data wanted, and sends it to the API with an HTTP POST request. Unlike REST, all GraphQL queries are sent to the same address, and their type is POST.

## Schemas and Queries

In the heart of all GraphQL applications is a **schema**, which describes the data sent between the client and the server.

FE:

```js
type Person {
  name: String!
  phone: String
  street: String!
  city: String!
  id: ID! 
}

// ! means required (can't be null)
type Query {
  personCount: Int! // an integer, can be 0
  allPersons: [Person!]! // a list with no null values, with 0 or more Persons
  findPerson(name: String!): Person // => can return a Person object or a null value
}
```

The schema describes two **types**. The first type, `Person`, determines that persons have five fields. Four of the fields are type String, which is one of the scalar types of GraphQL. All of the String fields, except phone, must be given a value. This is marked by the exclamation mark on the schema. The type of the field id is ID. ID fields are strings, but GraphQL ensures they are unique.

The second type is a `Query`. Practically every GraphQL schema describes a Query, which tells what kind of queries can be made to the API.

`personCount` returns an integer, `allPersons` returns a list of Person objects and `findPerson` is given a string parameter and it returns a Person object.

Again, exclamation marks are used to mark which return values and parameters are Non-Null.

So the schema describes what queries the client can send to the server, what kind of parameters the queries can have, and what kind of data the queries return.

A simple query could be:

```js
query {
  personCount
}
```

A response could be:

```js
{
  "data": {
    "personCount": 3
  }
}
```

For a query that asks for a list of objects, which fields of the objects to return must be specified:

```js
query {
  allPersons {
    name
    phone
  }
}
```

A response could look like:

```js
{
  "data": {
    "allPersons": [
      {
        "name": "Arto Hellas",
        "phone": "040-123543"
      },
      {
        "name": "Luke SC",
        "phone": "040-123543"
      },
      // etc ...
    ]
  }
}
```

A query can be made to return any field described in the schema.

This shows an example in which a query requires a parameter:

```js
query {
  findPerson(name: "Arto Hellas") {
    phone 
    city 
    street
    id
  }
}
```

First, the parameter is described in round brackets, and then the fields of the return value object are listed in curly brackets.

The response could look like:

```js
{
  "data": {
    "findPerson": {
      "phone": "040-123543",
      "city": "Espoo",
      "street": "Tapiolankatu 5 A"
      "id": "3d594650-3436-11e9-bc57-8b80ba54c431"
    }
  }
}
```

Or

```js
{
  "data": {
    "findPerson": null
  }
}
```

if there was not a Person with that name.

There is a direct relationship between the shape of a GraphQL query and the shape of the returned JSON object.

One can think that the query describes what kind of data it wants as a response. The difference to REST queries is stark. With REST, the URL and the type of the request have nothing to do with the form of the returned data.

GraphQL query describes only the data moving between a server and the client. On the server, the data can be organized and saved any way we like.

Despite its name, GraphQL does not actually have anything to do with databases. It does not care how the data is saved. The data a GraphQL API uses can be saved into a relational database, document database, or to other servers which a GraphQL server can access with for example REST.

## Apollo Server, today's leading GraphQL library

- Init npm project
- Install Apollo `npm install @apollo/server graphql`

- The heart of an Apollo Server:

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
})
```

The first parameter, `typeDefs`, contains the **GraphQL schema** as a string with backticks, like:

```js
const typeDefs = `
  type Person {
    name: String!
    phone: String
    street: String!
    city: String! 
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
`
```

The second parameter is an object, which contains the **resolvers** of the server. These are the code, which defines how GraphQL queries are responded to. For example, for a Query type in the schema like:

```js
type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```

we have a corresponding object:

```js
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  }
}
```

There is a field under Query for every query described in the schema.

<table>
<thead>
<tr>
<th>
Query
</th>
<th>
Resolver
</th>
</tr>
<tr>
<td>

```js
query {
  personCount
}
```

<td>

```js
() => persons.length
```

</td>
</tr>
<tr>
<td>

```js
query {
  allPersons {
    name
  }
}
```

<td>

```js
() => persons
```

</td>
</tr>
</thead>
</table>

## Apollo Studio Explorer

When Apollo server is run in development mode the page <http://localhost:4000> has a button Query your server that takes us to Apollo Studio Explorer. This is very useful for a developer, and can be used to make queries to the server.

## Resolver Parameters

<table>
<thead>
<tr>
<th>
Query
</th>
<th>
Resolver
</th>
</tr>
<tr>
<td>

```js
query {
  findPerson(name: "Arto Hellas") {
    phone 
    city 
    street
  }
}
```

<td>

```js
(root, args) => persons.find(p => p.name === args.name)
```

</td>
</tr>
</thead>
</table>

The second parameter, `args`, contains the parameters of the query. The resolver then returns from the array persons the person whose name is the same as the value of `args.name`. The resolver does not need the first parameter `root`.

Every resolver in a GraphQL.js schema accepts four positional arguments:

These arguments have the following meanings and conventional names:

1. `obj` or `root`: The object that contains the result returned from the resolver on the parent field, or, in the case of a top-level Query field, the `rootValue` passed from the server configuration. This argument enables the nested nature of GraphQL queries.
2. `args`: An object with the arguments passed into the field in the query. For example, if the field was called with `author(name: "Ada")`, the `args` object would be: `{ "name": "Ada" }`.
3. `context`: This is an object shared by all resolvers in a particular query, and is used to contain the per-request state, including authentication information, `DataLoader` instances, and anything else that should be taken into account when resolving the query. If you're using express-graphql, read about how to set the context in the setup documentation.
4. `info`: This argument should only be used in advanced cases, but it contains information about the execution state of the query, including the field name, the path to the field from the root, and more. It's only documented in the GraphQL.js source code.

## Default resolvers

A GraphQL server must define resolvers for each field of each type in the schema.

If we do not define resolvers for a field in one type, Apollo writes **default resolvers** for them. For example:

```js
const resolvers = {
  Query: {
    // we wrote resolvers for the Query, but not for Person
  },
  Person: {
    name: (root) => root.name,
    phone: (root) => root.phone,
    street: (root) => root.street,
    city: (root) => root.city,
    id: (root) => root.id
  }
}
```

The default resolver returns the value of the corresponding field of the object. The object itself can be accessed through the first parameter of the resolver, `root`.

If the functionality of the default resolver is enough, you don't need to define your own. It is also possible to define resolvers for only some fields of a type, and let the default resolvers handle the rest.

## Objects within an object

A field can contain another GraphQL object type, not just a scalar. For example:

```js
type Address {
  street: String!
  city: String! 
}

type Person {
  name: String!
  phone: String
  address: Address!
  id: ID!
}

type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```

We would make queries requiring the address field as:

```js
query {
  findPerson(name: "Arto Hellas") {
    phone 
    address {
      city 
      street
    }
  }
}
```

The response would be a nested object:

```js
{
  "data": {
    "findPerson": {
      "phone": "040-123543",
      "address":  {
        "city": "Espoo",
        "street": "Tapiolankatu 5 A"
      }
    }
  }
}
```

But, if the object type is not stored into their own separate data structure in the server (the Address type does not have an `id` field), we just can save each persons normally, with a string per field:

```js
let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  // ...
]
```

In these cases, when the objects store don't have a field like `address`, we need to define a custom resolver:

```js
const resolvers = {
  Query: {
    // ...
  },
  Person: {
    address: (root) => {
      return { 
        street: root.street,
        city: root.city
      }
    }
  }
}
```

## Mutations:

In GraphQL, all operations which cause a change are done with **mutations**. Mutations are described in the schema as the keys of type `Mutation`. A mutation could be adding a new entity (like a Person) or modifying an entity's values.

For example:

```js
type Mutation {
  addPerson(
    name: String!
    phone: String
    street: String!
    city: String!
  ): Person
}
```

The mutation is given the details of the object as parameters. Parameters without `!` are nullable. The mutation also has a return value of the specified type. The idea is that the details of the person are returned if the operation is succesfull or `null` if it's not. Value for the field id is not given as a parameter. Generating an id is better left for the server.

Mutations also require a resolver:

```js
const { v1: uuid } = require('uuid')

// ...

const resolvers = {
  // ...
  Mutation: {
    addPerson: (root, args) => {
      const person = { ...args, id: uuid() } // the servers gives the object an id
      persons = persons.concat(person)
      return person
    }
  }
}
```

Here we are generating unique ids with the `uuid` library.

A new person can be added with the following mutation:

```js
mutation {
  addPerson(
    name: "Pekka Mikkola"
    phone: "045-2374321"
    street: "Vilppulantie 25"
    city: "Helsinki"
  ) {
    name
    phone
    address{
      city
      street
    }
    id
  }
}
```

The response to the mutation is:

```js
{
  "data": {
    "addPerson": {
      "name": "Pekka Mikkola",
      "phone": "045-2374321",
      "address": {
        "city": "Helsinki",
        "street": "Vilppulantie 25"
      },
      "id": "2b24e0b0-343c-11e9-8c2a-cb57c2bf804f"
    }
  }
}
```

So the resolver of the `address` field of the Person type formats the response object to the right form.

## Error handling

If we try to create a new person, but the parameters do not correspond with the schema description, the server gives an error message.

Some of the error handling can be automatically done with GraphQL validation. However, GraphQL cannot handle everything automatically. For example, stricter rules for data sent to a Mutation have to be added manually. An error could be handled by throwing GraphQLError with a proper error code.

We could implement a unique name validation system with the help of the `GraphQLError`

```js
const { GraphQLError } = require('graphql')

// ...

const resolvers = {
  // ..
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find(p => p.name === args.name)) {
        throw new GraphQLError('Name must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }

      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    }
  }
}
```

## Enum

We can filter queries to return all objects with certain non-null fields. For example, only persons with a phone number:

```js
query {
  allPersons(phone: YES) {
    name
    phone 
  }
}
```

or without:

```js
query {
  allPersons(phone: NO) {
    name
  }
}
```

To do this, we need to creata a GraphQL enum with two possible values: `YES` or `NO`:

```js
enum YesNo {
  YES
  NO
}

type Query {
  personCount: Int!
  allPersons(phone: YesNo): [Person!]!
  findPerson(name: String!): Person
}
```

In the query `allPersons`, the parameter phone has the type `YesNo`, but is nullable.

And then we need to modify the query resolver a little:

```js
Query: {
  personCount: () => persons.length,

  allPersons: (root, args) => {
    if (!args.phone) {
      return persons
    }

    const byPhone = (person) => args.phone === 'YES' ? person.phone : !person.phone

    // only return persons with a phone
    return persons.filter(byPhone)
  },

  findPerson: (root, args) =>
    persons.find(p => p.name === args.name)
}
```

## Changing fields

To change certain fiels (like a phone number), we need to add a mutation:

```js
type Mutation {
  addPerson(
    // ...
  ): Person

  editNumber(
    name: String!
    phone: String!
  ): Person
}
```

And create a resolver for the operation:

```js
Mutation: {
  // ...
  editNumber: (root, args) => {
    const person = persons.find(p => p.name === args.name)
    if (!person) {
      return null
    }

    const updatedPerson = { ...person, phone: args.phone }
    persons = persons.map(p => p.name === args.name ? updatedPerson : p)
    return updatedPerson
  }   
}
```

## More on queries

With GraphQL, it is possible to combine multiple fields of type Query, or "separate queries" into one query. For example, the following query returns both the amount of persons in the phonebook and their names:

```js
query {
  personCount
  allPersons {
    name
  }
}
```

We can create custom names for our queries, and perform the same query multiple times, but only if we provide the alternatives to each. For example:

```js
query {
  havePhone: allPersons(phone: YES){
    name
  }
  phoneless: allPersons(phone: NO){
    name
  }
}
```

In some cases, it might be beneficial to name the queries. This is the case especially when the queries or mutations have parameters
