# Redux Guide

Redux is a state management library for JavaScript applications, commonly used with React. Its primary purpose is to manage the state of an application in a predictable way, making it easier to understand and manage the data flow in large and complex applications. Here's a basic overview of how Redux works in a React application:

## Core Concepts:

(remember to install redux with `npm install redux`)

1. **Store:**
   - Redux uses a single JavaScript object, called the "store," to represent the entire state of your application.
   - The store is created using the `createStore` function from the Redux library.

    ```javascript
    import { createStore } from 'redux';
    import rootReducer from './reducers';

    const store = createStore(rootReducer);
    ```

  - Remember that we should separate the application into different modules. Now the question is, how can the App access the store after the move? And more broadly, when a component is composed of many smaller components, there must be a way for all of the components to access the store. The easiest is to use the hooks API of the `react-redux` library. We have to then import a Provider element to wrap the main App component, and then pass it the store reference as a prop:

  ```js
  import React from 'react'
  import ReactDOM from 'react-dom/client'
  import { createStore } from 'redux'
  import { Provider } from 'react-redux'

  import App from './App'
  import noteReducer from './reducers/noteReducer'

  const store = createStore(noteReducer)

  ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <App />
    </Provider>
  )
  ```

  - Each component can access the notes stored in the store with the `useSelector`-hook of the `react-redux` library. `useSelector` receives a function as a parameter. The function either searches for or selects data from the Redux store:

  ```js
  import { useSelector } from 'react-redux'

  const App = () => {
    // ...
    const notes = useSelector(state => state)
    // ...
  }
  ```

  - Usually, selector functions are a bit more interesting and return only selected parts of the contents of the Redux store, or a mapped version of the data, for example.

2. **Actions:**
   - Actions are plain JavaScript objects that represent events or user interactions. They describe what happened in your application.
   - Actions must have a `type` property indicating the type of action being performed. If there is data involved with the action, other fields can be declared as needed. The general convention is that actions have exactly two fields, type telling the type and payload containing the data included with the Action.

    ```javascript
    // Example action
    const incrementCounter = {
      type: 'INCREMENT_COUNTER'
      // payload: [some data]
    }
    ```

    React components don't need to know the Redux action types and forms. We can separate creating actions into separate functions:

    ```js
    const createNote = (content) => {
      return {
        type: 'NEW_MESSAGE',
        payload: {
          content,
          id: generateId()
        }
      }
    }
    ```

    Functions that create actions are called action creators.

    The App component does not have to know anything about the inner representation of the actions anymore, it just gets the right action by calling the creator function:

    ```js
    const App = () => {
      const addMessage = (event) => {
        event.preventDefault()
        // ...
        store.dispatch(createNote(content))
      }

      // ...
    }
    ```

3. **Reducers:**
   - Reducers are **pure functions** that specify how the application's state changes in response to actions.
   - A pure function _has no side effects_ (no mutation of local static variables, non-local variables, mutable reference arguments or input/output streams), and has to be _deterministic_ (they must always return the same response when called with the same parameters)
   - Each reducer takes the current state and an action object as arguments, and **returns a new state that will replace the old state**.

    ```javascript
    // Example reducer
    const counterReducer = (state = 0, action) => {
      switch (action.type) {
        case 'INCREMENT_COUNTER':
          return state + 1;
        default:
          return state;
      }
    };
    ```

    - A reducer state must be composed of immutable objects. If there is a change in the state, the old object must not be mutated, but replaced with a new, changed, object. For example, using `concat` instead of `push` to add elements to an array, or the spread syntax `[...state, action.payload]` to do the same.

    - We can use the library `deep-freeze`, which can be used to ensure that the reducer has been correctly defined as an immutable function.

4. **Dispatch:**
   - To update the state, you dispatch an action to the store using the `dispatch` method. It does it with the returned function from the `useDispatch` hook:

    ```javascript
    import { useDispatch } from 'react-redux'

    const App = () => {
      const dispatch = useDispatch()
      // ...

      const deleteNote = (id) => {
        dispatch(deleteNoteAt(id))
      }
      // ...
    }
    ```

5. **Subscribe:**
   - is used to create callback functions the store calls whenever an action is dispatched to the store.

   If, for example, we would add the following function to subscribe, every change in the store would be printed to the console.

    ```javascript
    store.subscribe(() => {
      const storeNow = store.getState()
      console.log(storeNow)
    })
    ```
