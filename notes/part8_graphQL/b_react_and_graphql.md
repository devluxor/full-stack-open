# React and GraphQL

In theory, we could use GraphQL with HTTP POST requests. 

The communication works by sending HTTP POST requests to http://localhost:4000/graphql. The query itself is a string sent as the value of the key query.

We could take care of the communication between the React app and GraphQL by using Axios. However, most of the time, it is not very sensible to do so. It is a better idea to use a higher-order library capable of abstracting the unnecessary details of the communication.

At the moment, there are two good options: Relay by Facebook and Apollo Client, which is the client side of the same library we used in the previous section. Apollo is absolutely the most popular of the two.

## Apollo client

Create a new React app

Install Apollo dependencies:

```bash
npm install @apollo/client graphql
```

Example of entry point `main.jsx`:

The application can communicate with a GraphQL server using the `client` object. The client can be made accessible for all components of the application by wrapping the App component with `ApolloProvider`:

```js
import ReactDOM from 'react-dom/client'
import App from './App'

import {
  ApolloClient,
  ApolloProvider, // !
  InMemoryCache,
} from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}> // !
    <App />
  </ApolloProvider>
)
```

## Making queries

Apollo Client offers a few alternatives for making queries. Currently, the use of the hook function `useQuery` is the dominant practice.

In our example, the query is made by the App component:

```js
import { gql, useQuery } from '@apollo/client'
import Persons from './components/Persons'

const ALL_PERSONS = gql`
query {
  allPersons {
    name
    phone
    id
  }
}
`

const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <Persons persons={result.data.allPersons}/>
  )
}

export default App
```

When called, `useQuery` makes the query it receives as an argument. It returns an object with multiple fields. The field loading is `true` if the query has not received a response yet.

When a response is received, the result of the query can be found in the `data` field.

## Named queries and variables

When we do queries programmatically, we must be able to give them parameters dynamically.

GraphQL variables are well-suited for this. To be able to use variables, we must also name our queries.

A good format could be:

```js
query findPersonByName($nameToSearch: String!) {
  findPerson(name: $nameToSearch) {
    name
    phone 
    address {
      street
      city
    }
  }
}
```

It is also possible to do queries with parameters with the Apollo Explorer. The parameters are given in Variables.

The `useQuery` hook is well-suited for situations where the query is done when the component is rendered. However, we now want to make the query only when a user wants to see the details of a specific person, so the query is done only as required.

One opportunity for this kind of situations is the hook function `useLazyQuery` that would make it possible to define a query which is executed when the user wants to see the detailed information of a person.

However, in our case we can stick to `useQuery` and use the property `skip` on the options object, which makes it possible to do the query only if a set condition is true. For example, in the `components/Persons.jsx` file:

```js
import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'

const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`

const Person = ({ person, onClose }) => {
  return (
    <div>
      <h2>{person.name}</h2>
      <div>
        {person.address.street} {person.address.city}
      </div>
      <div>{person.phone}</div>
      <button onClick={onClose}>close</button>
    </div>
  )
}

const Persons = ({ persons }) => {
  const [nameToSearch, setNameToSearch] = useState(null)
  const result = useQuery(FIND_PERSON, {
    variables: { nameToSearch },
    skip: !nameToSearch,               // ! NOTE THE USE OF SKIP
  })

  if (nameToSearch && result.data) { // if nameToSearch is not null/ the query was not skipped !!
    return (
      <Person
        person={result.data.findPerson}
        onClose={() => setNameToSearch(null)}
      />
    )
  }

  return (
    <div>
      <h2>Persons</h2>
      {persons.map((p) => (
        <div key={p.name}>
          {p.name} {p.phone} 
          <button onClick={() => setNameToSearch(p.name)}> // !!!!
            show address
          </button>
        </div>
      ))}
    </div>
  )
}

export default Persons
```

## Cache

Apollo client saves the responses of queries to cache. To optimize performance if the response to a query is already in the cache, the query is not sent to the server at all.

We can see the cache using the Apollo developer tools

## Doing mutations

We need a parameterized version of our mutating queries which uses variables. For instance:

```js
const CREATE_PERSON = gql`
mutation createPerson($name: String!, $street: String!, $city: String!, $phone: String) {
  addPerson(
    name: $name,
    street: $street,
    city: $city,
    phone: $phone
  ) {
    name
    phone
    id
    address {
      street
      city
    }
  }
}
`
```

The hook function `useMutation` provides the functionality for making mutations.

An example form to create Persons:

```js
import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const CREATE_PERSON = gql`
  // ...
`

const PersonForm = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')

  const [ createPerson ] = useMutation(CREATE_PERSON) // !!!

  const submit = (event) => {
    event.preventDefault()

    createPerson({  variables: { name, phone, street, city } }) // !!!

    setName('')
    setPhone('')
    setStreet('')
    setCity('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        // ...
      </form>
    </div>
  )
}

export default PersonForm
```

We can define mutation functions using the `useMutation` hook. The hook returns an array, the first element of which contains the function to cause the mutation.

The query variables receive values when the query is made. 

But we need a way to update the cache of the application and the new element to be displayed: Apollo Client cannot automatically update the cache of an application, so it still contains the state from before the mutation.

## Updating the cache

There are a few different solutions for this. One way is to make the query for all persons **poll** the server, or make the query repeatedly. For example, every 2 seconds:

```js
const App = () => {
  const result = useQuery(ALL_PERSONS, {
    pollInterval: 2000 // !!!!
  })

  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <Persons persons = {result.data.allPersons}/>
      <PersonForm />
    </div>
  )
}

export default App
```

The bad side of the solution is all the pointless web traffic.

Another easy way to keep the cache in sync is to use the `useMutation` hook's `refetchQueries` parameter to define that the query fetching all persons is done again whenever a new person is created:

`components/PersonForm.jsx`:

```js
const ALL_PERSONS = // ...

const PersonForm = (props) => {
  // ...

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [ { query: ALL_PERSONS } ]  // !!!
  })
  // ...
}
```

The pros and cons of this solution are almost opposite of the previous one. There is no extra web traffic because queries are not done just in case. However, if one user now updates the state of the server, the changes do not show to other users immediately.

If you want to do multiple queries, you can pass multiple objects inside `refetchQueries`. This will allow you to update different parts of your app at the same time. Here is an example:

```js
    const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [ // pass as many queries as you need
      { query: ALL_PERSONS }, 
      { query: OTHER_QUERY }, 
      { query: ... } 
    ] 
  })
```

### A better way to update the cache

The last approach is pretty good, the drawback being that the query is always rerun with any updates. It is possible to optimize the solution by handling updating the cache ourselves. This is done by defining a suitable update callback for the mutation, which Apollo runs after the mutation:

```js
const PersonForm = ({ setError }) => {
  // ...

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    onError: (error) => {
      // ...
    },

    update: (cache, response) => {
      cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
        return {
          allPersons: allPersons.concat(response.data.addPerson),
        }
      })
    },
  })
  // ..
}  
```

The callback function is given a reference to the cache (`cache`) and the data returned by the mutation (`response`) as parameters. For example, in our case, this would be the created person.

Using the function `updateQuery` the code updates the query `ALLPERSONS` in the cache by adding the new person to the cached data.

#### From official documentation:

- The `updateQuery` method takes two arguments:
  - Options parameter that always includes a query or fragment
  - An update function
- After the `updateQuery` method fetches data from the cache
- The update function is called, passing it the cached data, `allPersons`in the example.
- The update function can return a value to _replace_ that data in the cache (the new array returned by `concat` in the example)

### Important remarks about cache

In some situations, the only sensible way to keep the cache up to date is using the `update` callback.

When necessary, it is possible to disable cache for the whole application or single queries by setting the field managing the use of cache, `fetchPolicy` as `no-cache`.

Be diligent with the cache. Old data in the cache can cause hard-to-find bugs. As we know, keeping the cache up to date is very challenging. According to a coder proverb:

> There are only two hard things in Computer Science: cache invalidation and naming things.

## Separation of queries

Remember that the queries should be separated into their own module `queries.js`:

```js
import { gql } from '@apollo/client'

export const ALL_PERSONS = gql`
  query {
    // ...
  }
`
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    // ...
  }
`

export const CREATE_PERSON = gql`
  mutation createPerson($name: String!, $street: String!, $city: String!, $phone: String) {
    // ...
  }
`
```

And then we can import them with:

```js
import { ALL_PERSONS } from './queries'

const App = () => {
  const result = useQuery(ALL_PERSONS)
  // ...
}
```

## Handling mutation errors

We should handle the exceptions. We can register an error handler function to the mutation using the `useMutation` hook's `onError` option:

```js
const PersonForm = ({ setError }) => {
  // ... 

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [  {query: ALL_PERSONS } ],

    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setError(messages)
    }
  })

  // ...
}
```

We can then render the error message on the screen as necessary:

App component:

```js
const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  // ...
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <Persons persons = {result.data.allPersons} />

      <PersonForm setError={notify} />
    </div>
  )
}

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) return null

  return (
    <div style={{color: 'red'}}>
    {errorMessage}
    </div>
  )
}
```

## Updating fields

The mutation requires parameters. For example, to change the phone number:

```js
export const EDIT_NUMBER = gql`
  mutation editNumber($name: String!, $phone: String!) {
    editNumber(name: $name, phone: $phone) {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`
```

The component `PhoneForm`:

```js
import { useState } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_NUMBER } from '../queries'

const PhoneForm = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const [ changeNumber ] = useMutation(EDIT_NUMBER) // !

  const submit = (event) => {
    event.preventDefault()

    changeNumber({ variables: { name, phone } })

    setName('')
    setPhone('')
  }

  return (
    <div>
      <h2>change number</h2>

      <form onSubmit={submit}>
        // ...
      </form>
    </div>
  )
}

export default PhoneForm
```

When a field is changed this way, the new value automatically appears. This happens because each entity has an identifying field of type ID, so the entity's details saved to the cache update automatically when they are changed with the mutation.

### Validation

If we try to change a value for an entity that does not exist, the mutation response is `null`: For GraphQL, this is not an error, so registering an `onError` error handler is not useful.

We can use the result field returned by the `useMutation` hook as its second parameter to generate an error message:

```js
const PhoneForm = ({ setError }) => { // setError passed as prop!!
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')


  const [ changeNumber, result ] = useMutation(EDIT_NUMBER)

  const submit = (event) => {
    // ...
  }


  useEffect(() => {
    if (result.data && result.data.editNumber === null) {
      setError('person not found') // !!
    }
  }, [result.data])

  // ...
}
```

## Apollo client and the application state

In our example, management of the applications state has mostly become the responsibility of Apollo Client. This is a quite typical solution for GraphQL applications. Our example uses the state of the React components only to manage the state of a form and to show error notifications. As a result, it could be that there are no justifiable reasons to use Redux to manage application state when using GraphQL.

When necessary, Apollo enables saving the application's local state to Apollo cache.

