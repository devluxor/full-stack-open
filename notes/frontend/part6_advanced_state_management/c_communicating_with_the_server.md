# Communicating with server in a redux application

## Getting data from server

Usual service module(s):

```js
import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}
// ...
export default { getAll }
```

## Sending data from server

## Asynchronous actions and Redux thunk

It would be better if the communication could be abstracted away from the components so that they don't have to do anything else but call the appropriate action creator.

We can make both components to dispatch an action without the need to know about the communication between the server that happens behind the scenes (separating concerns, good design). These kinds of async actions can be implemented using the Redux Thunk library. The use of the library doesn't need any additional configuration or even installation when the Redux store is created using the Redux Toolkit's configureStore function.

With Redux Thunk it is possible to implement **action creators which return a function instead of an object**. The function receives Redux store's dispatch and getState methods as parameters. This allows for example implementations of asynchronous action creators, which first wait for the completion of a certain asynchronous operation and after that dispatch some action, which changes the store's state.

We can define an action creator initializeNotes which initializes the notes based on the data received from the server, and a createNote

For instance:

```js
// ...
import { initializeNotes } from './reducers/noteReducer'

const App = () => {
  const dispatch = useDispatch()

  // The initialization logic for the notes has been 
  // completely separated from the React component.
  useEffect(() => {
    dispatch(initializeNotes()) 
  }, []) 

  return (
    <div>
      <NewNote />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}
```

and 

```js
const NewNote = () => {
  const dispatch = useDispatch()
  
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))
  }

  // ...
}
```

While:

```js
// ...
import noteService from '../services/notes'

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    // ...
    // createNote definition removed from here!
  },
})

export const { toggleImportanceOf, appendNote, setNotes } = noteSlice.actions

// action creators,
// In the inner function, meaning the asynchronous action, 
// the operation first fetches all the notes from the server 
// and then dispatches the setNotes action, which adds them to the store.
export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

// The principle here is the same: first, an asynchronous operation is executed, 
// after which the action changing the state of the store is dispatched.
export const createNote = content => {
  return async dispatch => {
    const newNote = await noteService.createNew(content)
    dispatch(appendNote(newNote))
  }
}

export default noteSlice.reducer
```

