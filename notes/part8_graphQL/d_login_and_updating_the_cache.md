# Login and updating the cache

## Basic login functionality

- Create `token` state in App component:

```js
const App = () => {

  const [token, setToken] = useState(null)

  // ...

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

  return (
    // ...
  )
}
```

- Define a mutation for login:

```js
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
```

- Write the LoginForm component:

```js
import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })


  useEffect(() => {
    if ( result.data ) { // if response of credentials not null
      const token = result.data.login.value 
      setToken(token) // save token in app state
      localStorage.setItem('phonenumbers-user-token', token) // store token in client
    }
  }, [result.data, setToken])

  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        // ...
      </form>
    </div>
  )
}

export default LoginForm
```

We are using an effect hook to save the token's value to the state of the App component and the local storage after the server has responded to the mutation. Use of the effect hook is necessary to avoid an endless rendering loop.

## Logout functionality

- If we want the user to be able to manually log out, we have to do 3 things:

    - set the token state to `null` (from a `onClick` handler)
    - remove the token from client storage (`window.localStorage.clear()`)
    - reset the Apollo cache:
      ```js
      // ...
      const client = useApolloclient()
      // ...
      client.resetStore()
      ```

## Adding a token to a header

### How to send a valid user token with client requests

In the frontend entry point file (like `main.jsx`)

- Create a context `authLink` with a `setContext` method` that will extract the token from the client's local storage and add it to the request headers
- Create an `httpLink` object by wrapping the server url via the `createHttpLink` function.
- In the client's creation, replace the `uri` field for a `link` property with the concatenation of the `authLink` and the `httpLink` objects:

```js
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('phonenumbers-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})
```

Alternative:

```js
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink // !!!
} from '@apollo/client'

import { setContext } from '@apollo/client/link/context'

const authLink = setContext((_, { headers }) => {  
  const token = localStorage.getItem('library-user-token')  
  return {    
    headers: {      
      ...headers,      
      authorization: token ? `bearer ${token}` : null,    
    }  
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000' }) // !!

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
  })
```

The link is modified by the context defined by the `authLink` object so that a possible token in `localStorage` is set to header authorization for each request to the server.

### A better way to update the cache

It is possible to optimize the solution by handling updating the cache ourselves. This is done by defining a suitable update callback for the mutation, which Apollo runs after the mutation:

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


