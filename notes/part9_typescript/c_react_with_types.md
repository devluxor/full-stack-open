# React with types

## Creating a React + TS app with Vite

Run: 

```sh
npm create vite@latest my-app-name -- --template react-ts
```

## Non-null Assertion Operator (Postfix `!`)

TypeScript also has a special syntax for removing null and undefined from a type without doing any explicit checking. Writing ! after any expression is effectively a type assertion that the value isn’t null or undefined:

```js
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

Just like other type assertions, this doesn’t change the runtime behavior of your code, so it’s important to only use ! when you know that the value can’t be null or undefined.

## React components with TypeScript

With TypeScript, we don't need the prop-types package anymore. We can define the types with the help of TypeScript, just like we define types for a regular function as React components are nothing but mere functions.

We will use an interface for the parameter types (i.e. props) and JSX.Element as the return type for any React component:

```js
import ReactDOM from 'react-dom/client'

interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps): JSX.Element => {
  return <h1>Hello, {props.name}</h1>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Welcome name="Sarah" />
)
```

We defined a new type, `WelcomeProps`, and passed it to the function's parameter types.

You could write the same thing using a more verbose syntax:

```js
const Welcome = ({ name }: { name: string }): JSX.Element => (
  <h1>Hello, {name}</h1>
);
```

Now our editor knows that the name prop is a string.

There is actually no need to define the return type of a React component since the TypeScript compiler infers the type automatically, so we can just write:

```js
interface WelcomeProps {
  name: string;
}


const Welcome = (props: WelcomeProps) => { // !!
  return <h1>Hello, {props.name}</h1>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Welcome name="Sarah" />
)
```

## React TypeScript Cheatsheets

- Useful resource: <https://react-typescript-cheatsheet.netlify.app/>

## `useState`

`useState` is a **generic function**, where the type has to be specified as a type parameter in those cases when the compiler can not infer the type.

So, for example, in a React app in which we want to keep state of an array of `Note` objects for a component, we can:

```js
interface Note {
  id: number,
  content: string
}

import { useState, useEffect } from "react"
import servcies from './services'

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]); // !!!

  useEffect(() => {
    services.fetchNotes().then(notes => setNotes(notes))
  }, [])

  return (
    // ...
  )
}
```

## TypeScript with forms

The `event` parameter in form submission handlers has to be of type `React.SyntheticEvent`:

```js

const App = () => {
  // ...

  const noteCreation = (event: React.SyntheticEvent) => { // !!
    event.preventDefault()
    const noteToAdd = {
      content: newNote,
      id: notes.length + 1
    }
    setNotes(notes.concat(noteToAdd));
    setNewNote('')
  };

  return (
    <div>
      <form onSubmit={noteCreation}> // !!
        <input value={newNote} onChange={(event) => setNewNote(event.target.value)} />
        <button type='submit'>add</button>
      </form>
      // ...
    </div>
  )
}
```

## Communicating with server

Let's say we are using Axios to perform requests. We could type `axios.*` methods: they are TypeScript generic functions!

For example, to fetch requests with a `service.fetchNotes()` method:

`services.ts`:

```js
import axios from 'axios'
import Note from './types/Note' // !!
const baseUrl = '/api/notes'

const fetchNotes = async () => {
  const response = await axios.get<Note[]>(baseUrl) // !!!
  return response.data
}

const addNote = async(newNote: Note) => {
  const response = await axios.post<Note>(baseUrl, newNote)
  return response.data
}
```

THIS IS DANGEROUS:  Giving a type parameter to `axios.get` might be ok if we are **absolutely sure** that the backend behaves correctly and always returns the data in the correct form. If we want to build **a robust system** we should prepare for surprises and parse the response data in the frontend, similarly to what we did in the previous section for the requests to the backend.

For the `axios.post` method, if we are sure (being backend developers) the server's response is the added data, we can safely set the type parameter `Note`.
