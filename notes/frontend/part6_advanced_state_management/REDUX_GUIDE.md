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

  - The store could be complex, like an object with one property with a collection as value and other as a _pseudo-global variable_ to determine, for instance, what elements of that collection are shown, in the function passed to `useSelector`:

  ```js
  {
    notes: [
      { content: 'reducer defines how redux store works', important: true, id: 1},
      { content: 'state of store can contain any data', important: false, id: 2}
    ],
    filter: 'IMPORTANT'
  }
  ```

  And we could have a reducer to set the filter based on actions dispatched:

  ```js
  const filterReducer = (state = 'ALL', action) => {
    switch (action.type) {
      case 'SET_FILTER':
        return action.payload
      default:
        return state
    }
  }
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

  - It's a good idea to move the code related to the creation of the Redux store into its own, store.js file. For example:

  ```js
  import { configureStore } from '@reduxjs/toolkit'

  import noteReducer from './reducers/noteReducer'
  import filterReducer from './reducers/filterReducer'

  const store = configureStore({
    reducer: {
      notes: noteReducer,
      filter: filterReducer
    }
  })

  export default store
  ```

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

    - As your app grows more complex, you'll want to split your reducing function into separate functions, each managing independent parts of the state.

    - The `combineReducers` helper function turns an object whose values are different reducing functions into a single reducing function you can pass to createStore.

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

## Redux Toolkit

Redux Toolkit is a library that solves these common Redux-related problems. The library for example greatly simplifies the configuration of the Redux store and offers a large variety of tools to ease state management.

With Redux Toolkit, you don't need to create action types, action creators, or use the combineReducers function manually. The toolkit abstracts away many of the boilerplate tasks associated with Redux, making it easier to write and maintain your Redux code.

Install with:

```sh
npm install @reduxjs/toolkit
```

Instead of Redux's `createStore` function, we can create the store using Redux Toolkit's `configureStore` function. This function has many additional benefits such as the effortless integration of development tools and many commonly used libraries without the need for additional configuration.



`main.jsx`:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import { configureStore } from '@reduxjs/toolkit'

// ...

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})

// ...
```

With Redux Toolkit, we can easily create reducer and related action creators using the `createSlice` function:

```js
import { createSlice } from '@reduxjs/toolkit'

// ...

const noteSlice = createSlice({
  name: 'notes',
  initialState: [/* initial state here */],
  reducers: {
    createNote(state, action) {
      const content = action.payload
      state.push({
        content,
        id: generateId(),
      })
    },
    otherReducer(state,action) {

    },
    // ...
  },
})
```

The `createSlice` function's `name` parameter defines the prefix which is used in the action's type values. For example, the `createNote` actions defined later will have the type value of `notes/createNote`. It is a good practice to give the parameter a value which is unique among the reducers. This way there won't be unexpected collisions between the application's action type values. 

The `initialState` parameter defines the reducer's initial state. 

The `reducers` parameter takes a reducer itself as an object, of which functions handle state changes caused by certain actions. Note that the `action.payload` in the function contains the argument provided by calling the action creator:

```js
dispatch(createNote('Redux Toolkit is awesome!'))
```

```js
dispatch({ type: 'notes/createNote', payload: 'Redux Toolkit is awesome!' })
```

> Note that, thanks to the Immer library used by Redux toolkit, it is safe to mutate the state argument, since Immer uses the mutated state to produce a new, immutable state and thus the state changes remain immutable. Nevertheless mutating the state will often come in handy especially when a complex state needs to be updated.

The `createSlice` function returns an object containing the reducer as well as the action creators defined by the reducers parameter. The reducer can be accessed by the noteSlice.reducer property, whereas the action creators by the noteSlice.actions property. We can produce the file's exports in the following way:

```js
const noteSlice = createSlice(/* ... */)


export const { createNote, toggleImportanceOf } = noteSlice.actions
export default noteSlice.reducer
```

### Asynchronous actions and Redux thunk

Redux Thunk is a middleware for Redux that enables asynchronous logic to be handled in Redux applications. In a typical Redux application, actions are plain JavaScript objects that represent events or changes in state, and they are handled by reducers synchronously. However, in some cases, you might need to perform asynchronous operations, such as making API calls, before dispatching an action.

Redux Thunk allows action creators to return functions instead of plain action objects. These functions, known as **thunks**, have the ability to dispatch actions and perform asynchronous operations. Thunks receive the `dispatch` and `getState` functions as arguments, giving them access to the Redux store and the ability to dispatch multiple actions.

#### Example:

Having a `./services/notes.js` (API services)

```js
const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}


const createNew = async (content) => {
  const object = { content, important: false }
  const response = await axios.post(baseUrl, object) // async POST request
  return response.data // returns data when response received
}

export default {
  getAll,

  createNew,
}
```

It is not great that the communication with the server happens inside the functions of the components. It would be better if the communication could be abstracted away from the components so that they don't have to do anything else but call the appropriate action creator.

For examples, the main component App could initialize the state of the application as follows:

```js
const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes()) // !
  }, []) 

  // ...
}
```

and the NewNote component would create a new note as follows:

```js
const NewNote = () => {
  const dispatch = useDispatch()
  
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content)) // !
  }

  // ...
}
```

In this implementation, both components would dispatch an action without the need to know about the communication between the server that happens behind the scenes (separation of concerns). These kinds of async actions can be implemented using the Redux Thunk library. The use of the library doesn't need any additional configuration or even installation when the Redux store is created using the Redux Toolkit's `configureStore` function.

With Redux Thunk it is possible to implement action creators that return a function instead of an object. The function receives Redux store's `dispatch` and `getState` methods as parameters. This allows for creating asynchronous action creators, which:

1. First wait for the completion of a certain asynchronous operation 
2. then, after that, dispatch some action, which changes the store's state.

So, in the `./reducers/noteReducer.js` file we can define an action creator `initializeNotes` which initializes the notes based on the data received from the server:

```js
// ...

import noteService from '../services/notes'

const noteSlice = createSlice(/* ... */)

export const { createNote, toggleImportanceOf, setNotes, appendNote } = noteSlice.actions

export const initializeNotes = () => { 
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}
// the return value is a function that:
//    fetches notes from the server
//    dispatches an action to set the initial notes:
//        one reducer is:
//                        setNotes(state, action) {
//                          return action.payload
//                        }
//        the payload of the action is an array of notes received
//        from the getAll method.
//        The return value of the reducer directly replaces the state with this array

export default noteSlice.reducer
```

See the App component: The solution is elegant. The initialization logic for the notes has been completely separated from the React component.

We can do the same for the creation of a new note:

```js
// ...
import noteService from '../services/notes'

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    toggleImportanceOf(state, action) {
      // ...
    },
    appendNote(state, action) {
      state.push(action.payload)
    },
    setNotes(state, action) {
      return action.payload
    }
    // createNote definition removed from here!
  },
})


export const { toggleImportanceOf, appendNote, setNotes } = noteSlice.actions

export const initializeNotes = () => {
  // ...
}


export const createNote = content => {
  return async dispatch => {
    const newNote = await noteService.createNew(content)
    dispatch(appendNote(newNote))
  }
}

export default noteSlice.reducer
```

The principle here is the same: first, an asynchronous operation is executed, then, the action changing the state of the store is dispatched.

And the NewComponent is simplified as shown three examples before.