# Rendering a collection, modules


We can render collections with `map`:

```js
const App = ({ notes }) => {
    const notes = [
    {id: 1, content: 'aloha'},
    {id: 2, content: 'buffalo'}
  ]

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => <Note key={note.id} note={note} /> )}
      </ul>
    </div>
  )
}

const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}
```

Remember not to use indexes as keys (and that `Notes` should be in its own module)


## Forms

We can save the values of inputs in the component's state, and rerender the component dynamically each time we, for example, press a key. We can then use the state variable to perform any kind of operation within the component (like submitting it to the server).

An input like <input /> is uncontrolled. Even if you pass an initial value like <input defaultValue="Initial text" />, your JSX only specifies the initial value. It does not control what the value should be right now.

To render a controlled input, pass the value prop to it (or checked for checkboxes and radios). React will force the input to always have the value you passed. Usually, you would do this by declaring a state variable:

```js
function Form() {
  const [firstName, setFirstName] = useState(''); // Declare a state variable...
  // ...
  return (
    <input
      value={firstName} // ...force the input's value to match the state variable...
      onChange={e => setFirstName(e.target.value)} // ... and update the state variable on any edits!
    />
  );
}
```

A controlled input makes sense if you needed state anyway—for example, to re-render your UI on every edit:
