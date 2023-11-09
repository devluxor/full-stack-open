# Store with complex state

We can have more than one reducer per app; each reducer + related action creators per file in `src/reducers`. We combine the reducers from different files into the main reducer for our app using the `combineReducers` function in `main.jsx`:

```js
// ...
import { createStore, combineReducers } from 'redux'
// ...
import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(reducer)
// ...
```

Note that The combined reducer works in such a way that every action gets handled in every part of the combined reducer. Typically only one reducer is interested in any given action, but there are situations where multiple reducers change their respective parts of the state based on the same action.

## Redux Toolkit

The library for example greatly simplifies the configuration of the Redux store and offers a large variety of tools to ease state management.

Many advantages; i.e.: instead of having to use `combineReducers`:

```js
// ...

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

With Redux Toolkit, we can easily create reducer and related action creators using the `createSlice` function. We can use the `createSlice` function to refactor the reducer and action creators. For example, this:

```js
const initialState = [
  {
    content: 'reducer defines how redux store works',
    important: true,
    id: 1,
  },
  {
    content: 'state of store can contain any data',
    important: false,
    id: 2,
  },
]

const noteReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return [...state, action.payload]
    case 'TOGGLE_IMPORTANCE':
      const id = action.payload.id
      const noteToChange = state.find(n => n.id === id)
      const changedNote = { 
        ...noteToChange, 
        important: !noteToChange.important 
      }
      return state.map(note =>
        note.id !== id ? note : changedNote 
      )
    default:
      return state
    }
  } 

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

export const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  }
}

export const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  }
}  

export default noteReducer
```

becomes this:

```js
import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  {
    content: 'reducer defines how redux store works',
    important: true,
    id: 1,
  },
  {
    content: 'state of store can contain any data',
    important: false,
    id: 2,
  },
]

const generateId = () => Number((Math.random() * 1000000).toFixed(0))

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    createNote(state, action) {
      const content = action.payload
      state.push({
        content,
        important: false,
        id: generateId(),
      })
    },

    toggleImportanceOf(state, action) {
      const id = action.payload
      const noteToChange = state.find(n => n.id === id)
      const changedNote = { 
        ...noteToChange, 
        important: !noteToChange.important 
      }
      return state.map(note => note.id !== id ? note : changedNote )     
    }
  },
})
```

The createSlice function's name parameter defines the prefix which is used in the action's type values. For example, the createNote action defined later will have the type value of notes/createNote. It is a good practice to give the parameter a value which is unique among the reducers. This way there won't be unexpected collisions between the application's action type values. The initialState parameter defines the reducer's initial state. The reducers parameter takes the reducer itself as an object, of which functions handle state changes caused by certain actions. Note that the action.payload in the function contains the argument provided by calling the action creator:

Redux Toolkit utilizes the Immer library with reducers created by createSlice function, which makes it possible to mutate the state argument inside the reducer. Immer uses the mutated state to produce a new, immutable state and thus the state changes remain immutable. 

We can inspect the state within reducers like this:

```js
console.log(JSON.parse(JSON.stringify(state)))
```

Redux DevTools is a Chrome addon that offers useful development tools for Redux. It can be used for example to inspect the Redux store's state and dispatch actions through the browser's console. When the store is created using Redux Toolkit's configureStore function, no additional configuration is needed for Redux DevTools to work.