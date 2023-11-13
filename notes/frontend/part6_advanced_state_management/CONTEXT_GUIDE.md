# React's Context API

If we need to split the application into several components, we can share state between them by passing values and functions as props. But if the component structure gets complicated, e.g. the dispatcher should be forwarded using props through many components to the components that need it, even though the components in between in the component tree do not need the dispatcher. This phenomenon is called prop drilling.

React's built-in Context API provides a solution for us. React's context is a kind of global state of the application, to which it is possible to give direct access to any component app.

We need to:

1. Create a context in the application that stores the state management. The context is created with React's hook `createContext`. We can create it in a file `CounterContext.jsx`. In this file we will define the super parent context provider component that will wrap all the other components in our app, including the main App component:

```js
import { createContext, useReducer } from 'react'

const counterReducer = (state, action) => {
  switch (action.type) {
    case "INC":
        return state + 1
    case "ZERO":
        return 0
    default:
        return state
  }
}

const CounterContext = createContext()

export const CounterContextProvider = (props) => {
  // we pass the reducer and the initial value for the state
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return ( // this component will wrap the App component
    <CounterContext.Provider value={[counter, counterDispatch]}> // we have to set a value for the context
      {props.children}
    </CounterContext.Provider>
  )
}

export default CounterContext
```

and then:

```js
import ReactDOM from 'react-dom/client'
import App from './App'

import { CounterContextProvider } from './CounterContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <CounterContextProvider>

    <App />

  </CounterContextProvider>
)
```

Now Other components now access the context using the `useContext` hook. For example:

```js
import { useContext } from 'react'
import CounterContext from './CounterContext'

const Button = ({ type, label }) => {
  const [counter, dispatch] = useContext(CounterContext)

  return (
    <button onClick={() => dispatch({ type })}> 
      {label}
    </button>
  )
}
```

The action object passed to `dispatched` will be used by the reducer we initially passed to `useReducer` in the file on which we created the context for our app.