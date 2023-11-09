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

