# React Router

## React Router

React has the React Router library which provides an excellent solution for managing navigation in a React application.

Routing, or the conditional rendering of components based on the URL in the browser, is used by placing components as children of the Router component, meaning inside Router tags.

BrowserRouter is a Router that uses the HTML5 history API (pushState, replaceState and the popState event) to keep your UI in sync with the URL.

Normally the browser loads a new page when the URL in the address bar changes. However, with the help of the HTML5 history API, BrowserRouter enables us to use the URL in the address bar of the browser for internal "routing" in a React application. So, even if the URL in the address bar changes, the content of the page is only manipulated using Javascript, and the browser will not load new content from the server. Using the back and forward actions, as well as making bookmarks, is still logical like on a traditional web page.

Inside the router, we define links that modify the address bar with the help of the Link component, which when clicked changes the URL in the address bar. Components rendered based on the URL of the browser are defined with the help of the component Route.

### Installation

install the library with

```bash
npm install react-router-dom
```

### Basic imports

```js
import {
  BrowserRouter as Router,
  Link,
  Route, 
  Routes 
} from 'react-router-dom'
```

### `BrowserRouter`

A `BrowserRouter` stores the current location in the browser's address bar using clean URLs and navigates using the browser's built-in history stack.

Normally the browser loads a new page when the URL in the address bar changes. However, with the help of the HTML5 history API, `BrowserRouter` enables us to use the URL in the address bar of the browser for internal "routing" in a React application. So, even if the URL in the address bar changes, the content of the page is only manipulated using Javascript, and the browser will not load new content from the server. Using the back and forward actions, as well as making bookmarks, is still logical like on a traditional web page.

```js
import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    {/* The rest of your app goes here */}
  </BrowserRouter>
);
```

Inside the router, we define links that modify the address bar with the help of the `Link` component. 

### `Link`

A `<Link>` is an element that lets the user navigate to another page by clicking or tapping on it. In `react-router-dom`, a `<Link>` renders an accessible `<a>` element with a real `href` that points to the resource it's linking to. 

When the `Link` is clicked it changes the URL in the address bar to the one in the `to` attribute:

```js
<Link to="/notes">notes</Link>
```

This creates a link in the application with the text `notes`, which when clicked changes the URL in the address bar to `/notes`.

Components rendered based on the URL of the browser are defined with the help of the component `Route`

### `Route`

Routes are perhaps the most important part of a React Router app. They couple URL segments to components, data loading and data mutations.

For example,

```js
<Route path="/notes" element={<Notes />} />
```

defines that, if the browser address is `/notes`, we render a `Notes` component.

We wrap the components to be rendered based on the URL with a Routes component.

### `Routes`

Rendered anywhere in the app, `<Routes>` will match a set of child routes from the current location. The `Routes` works by rendering the first component whose path matches the URL in the browser's address bar:

```js
<Routes>
  <Route path="/notes" element={<Notes />} />
  <Route path="/users" element={<Users />} />
  <Route path="/" element={<Home />} />
</Routes>
```

If the path in the browser bar is `/notes`, it renders the `Notes` component; if it is `/users` it renders `Users`, and so on.

### Parameterized routes (`useMatch`)

We can add parameters to the paths within a `Link` component:

```js
<Link to={`/notes/${note.id}`}>{note.content}</Link>
```

And define a new Route to match this path:

```js
<Router>
  // ...
  <Routes>
    <Route path="/notes/:id" element={<Note note={note} />} />
    // ...
  </Routes>
</Router>
```

We will use the React Router `useMatch` hook to figure out the id of the note to be displayed. We can capture the parameter like this:

```js
import {
  // ...
  useMatch
} from 'react-router-dom'

const App = () => {
  // ...
  // Every time the component is rendered (every time the browser's URL changes)
  // the following command is executed:
  const match = useMatch('/notes/:id')

  // If the URL matches /notes/:id, the match variable will contain an object 
  // from which we can access the parameterized part of the path:
  const note = match
    ? notes.find(note => note.id === Number(match.params.id))
    : null

  return (
    <div>
      <div>
        <Link style={padding} to="/">home</Link>
        // ...
      </div>

      <Routes>
        <Route path="/notes/:id" element={<Note note={note} />} />
        // ...
      </Routes>   
  )
}  
```

## `useNavigate`

```js
import {
  // ...
  useNavigate
} from 'react-router-dom'

const Login = (props) => {

  // we store a reference to a function navigate
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('mluukkai')

    // this function lets you navigate programmatically
    navigate('/')
  }

  return (
    <LoginForm onSubmit={onSubmit}>
  )
}
```

With this function, the browser's URL can be changed programmatically.

In this case, when the user logs in, `navigate('/')` causes the browser's URL to change to `/`, and the application renders a corresponding component `Home`, for instance.

## redirection with `Navigate`

A `<Navigate>` element changes the current location when it is rendered. For example:

```js
<Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
```

If a user isn't logged in, the `Users` component is not rendered. Instead, the browser is redirected using the component `Navigate` to the `/login` view, that renders the `Login` component:

```js
<Route path="/login" element={<Login />} />
```

In other words, if the path in the browser address is `/users`, but the user is not logged in, it is automatically redirected to `/login`, corresponding to that last Route, which renders the `Login` component.