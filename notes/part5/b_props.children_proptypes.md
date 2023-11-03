# props.children, proptypes

## The components children, aka. props.children

The code related to managing the visibility of the login form could be considered to be its own logical entity, and for this reason, it would be good to extract it from the App component into a separate component.

```js
<Togglable buttonLabel='login'>
  <LoginForm
    username={username}
    password={password}
    handleUsernameChange={({ target }) => setUsername(target.value)}
    handlePasswordChange={({ target }) => setPassword(target.value)}
    handleSubmit={handleLogin}
  />
</Togglable>
```

is loginform is a child of Toggable; this is achieved with this:

```js
const Togglable = (props) => {
  // logic

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}
```

note the `props.children`. 

The new and interesting part of the code is props.children, which is used for referencing the child components of the component. The child components are the React elements that we define between the opening and closing tags of a component.

This time the children are rendered in the code that is used for rendering the component itself:

Unlike the "normal" props we've seen before, children is automatically added by React and always exists. If a component is defined with an automatically closing /> tag, like this:

```jsx
<Note
  key={note.id}
  note={note}
  toggleImportance={() => toggleImportanceOf(note.id)}
/>
```

Then props.children is an empty array.

The Togglable component is reusable and we can use it to add similar visibility toggling functionality to the form that is used for creating new notes.

State of the forms

React documentation says the following about where to place the state:

> Sometimes, you want the state of two components to always change together. To do it, remove state from both of them, move it to their closest common parent, and then pass it down to them via props. This is known as lifting state up, and it’s one of the most common things you will do writing React code.

extract component logic to parent components 
minimizes: complexity (num parameters)
unclogs main app.js

References to components with ref

After a new note is created, it would make sense to hide the new note form. Currently, the form stays visible. There is a slight problem with hiding the form. The visibility is controlled with the visible variable inside of the Togglable component. How can we access it outside of the component?

 let's use the ref mechanism of React, which offers a reference to the component.

 You can add a ref to your component by importing the useRef Hook from React:

 Inside your component, call the useRef Hook and pass the initial value that you want to reference as the only argument. 

useRef returns an object with the passed in value to useRef:

```js
{
  current: 0
}
```

You can access the current value of that ref through the ref.current property. This value is intentionally mutable, meaning you can both read and write to it. It’s like a secret pocket of your component that React doesn’t track. (This is what makes it an “escape hatch” from React’s one-way data flow—more on that below!)

This hook ensures the same reference (ref) that is kept throughout re-renders of the component.

The function that creates the component (that will use the refs) is wrapped inside of a forwardRef function call. This way the component can access the ref that is assigned to it.

The component uses the useImperativeHandle hook to make its toggleVisibility function available outside of the component.

To recap, the useImperativeHandle function is a React hook, that is used for defining functions in a component, which can be invoked from outside of the component.

This trick works for changing the state of a component, but it looks a bit unpleasant. We could have accomplished the same functionality with slightly cleaner code using "old React" class-based components. We will take a look at these class components during part 7 of the course material. So far this is the only situation where using React hooks leads to code that is not cleaner than with class components.

There are also other use cases for refs than accessing React components.

create step guid of this pattern
  // this makes toggleVisibility function available to other functions in the
  // parent component, App, via the noteFormRef object (refs are like a little
  // pocket of a component that React does not track, in this case the pocket
  // contains a reference to this function toggleVisibility)
  // in combination with useImperativeHandle, we make it available to the parent
  // component.

A point about components

When we define a component in React:

```js
const Toggable () => {
  // ..
}
```

to use it like this:

```js
<div>
  <Togglable buttonLabel="1" ref={togglable1}>
    first
  </Togglable>

  <Togglable buttonLabel="2" ref={togglable2}>
    second
  </Togglable>

  <Togglable buttonLabel="3" ref={togglable3}>
    third
  </Togglable>
</div>
```

We create three separate instances of the component that all have their separate state:

