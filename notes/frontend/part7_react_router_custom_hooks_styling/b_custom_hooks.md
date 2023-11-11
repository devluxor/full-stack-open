# Custom hooks

React offers the option to create custom hooks. According to React, the primary purpose of custom hooks is to facilitate the reuse of the logic used in components.

Building your own Hooks lets you extract component logic into reusable functions.

Custom hooks are regular JavaScript functions that can use any other hooks, as long as they adhere to the rules of hooks. Additionally, the name of custom hooks must start with the word use.

Let's recap the rules of using hooks, copied verbatim from the official React documentation:

- Don’t call Hooks inside loops, conditions, or nested functions. Instead, always use Hooks at the top level of your React function.

- Don’t call Hooks from regular JavaScript functions. Instead, you can:

    - Call Hooks from React function components.
    - Call Hooks from custom Hooks

## Common built-in hooks:

- `useState`
- `useEffect`

- `useImperativeHandle`
- `useReducer`
- `useContext`

- `useSelector`
- `useDispatch`

## Custom hooks

React offers the option to create custom hooks. According to React, the primary purpose of custom hooks is to facilitate the reuse of the logic used in components.

> Building your own Hooks lets you extract component logic into reusable functions.

Custom hooks are regular JavaScript functions that can use any other hooks, as long as they adhere to the rules of hooks. Additionally, the name of custom hooks must start with the word `use`. They are very useful to extract state logic out of components giving the hook that responsibility, also creating a separation of concerts between components and modules.

We usually save our hooks in `src/hooks`

## Basic Uses

### A counter miniapp

Without a custom hook we depend on `useState`:

```js
import { useState } from 'react'
const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      <button onClick={() => setCounter(counter - 1)}>
        minus
      </button>
    </div>
  )
}
```

Our custom hook definition:

```js
const useCounter = () => {
  const [value, setValue] = useState(0)

  const increase = () => {
    setValue(value + 1)
  }

  const decrease = () => {
    setValue(value - 1)
  }

  return {
    value, 
    increase,
    decrease
  }
}
```

Our custom hook uses the `useState` hook internally to create its state. The hook returns an object, the properties of which include the **value** of the counter as well as **functions for manipulating the value**:

```js
const App = () => {
  const counter = useCounter()

  return (
    <div>
      <div>{counter.value}</div>
      <button onClick={counter.increase}>
        plus
      </button>
      <button onClick={counter.decrease}>
        minus
      </button>      
    </div>
  )
}
```

We can reuse it in other apps:

```js
const App = () => {
  const left = useCounter()
  const right = useCounter()

  return (
    <div>
      {left.value}
      <button onClick={left.increase}>
        left
      </button>
      <button onClick={right.increase}>
        right
      </button>
      {right.value}
    </div>
  )
}
```

### Forms

To keep the state of the form synchronized with the data provided by the user, we have to register an appropriate `onChange` handler for each of the input elements:

```js
const App = () => {
  const [name, setName] = useState('')
  const [height, setHeight] = useState('')

  return (
    <div>
      <form>
        name: 
        <input
          type='text'
          value={name}
          onChange={(event) => setName(event.target.value)} 
        /> 
        <br/> 
        height:
        <input
          type='number'
          value={height}
          onChange={(event) => setHeight(event.target.value)}
        />
        <button>submit</button>
      </form>
    </div>
  )
}
```

But if we define the super reusable `useField` custom hook it can simplify the task:

This is the hook. It receives the `type` of the input field as a parameter. The function returns all of the attributes required by the input: its `type`, `value` and the `onChange` handler:

```js
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}
```

And the app becomes:

```js
const App = () => {
  const name = useField('text')
  // ...

  return (
    <div>
      <form>
        <input
          type={name.type}
          value={name.value}
          onChange={name.onChange} 
        /> 
        // ...
      </form>
    </div>
  )
}
```

#### Spread attributes

If the component or HTML element 'expects' (has parameters or attributes with the names of the received object ) we can pass the props to the element using the spread syntax in the following way:

```js
<input {...name} /> 
```

### API custom hooks

We can make a super reusable `useResource` custom hook to communicate with the server:

```js
const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios.get(baseUrl)
         .then(r => setResources(r.data))
         .catch(e => console.log(e.message))
  }, [baseUrl])

  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource)
    setResources(resources.concat(response.data))
    return response.data
  }

  // ...

  const service = {
    create
  }

  return [
    resources, service
  ]
}
```

It works like this: Each time the component that contains this hook is rendered, a like like this executed:

```js
const [notes, noteService] = useResource('http://localhost:3005/notes')
```

When this happens, the code within the hooks definition is executed: the `useEffect` is triggered, and it fetches the current data from the server to store it in the variable `resources`. 

The `useResource` custom hook returns an array of two items just like the state hooks. The first item of the array contains all of the individual resources and the second item of the array is an object that can be used for manipulating the resource collection. We can add as many methods to the `service` object as we want.

