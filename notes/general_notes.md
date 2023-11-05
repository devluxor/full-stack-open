# General notes

<!-- ## Topics

### Frontend

- React
- Modularization
- Others (vite, build for prod, debugging, etc)

### Backend

- Node
- Express
- Databases (MongoDB)
- Deployment Platform (Fly.io)
- How to combine front+backend
- How to work in dev env vs prod
- How to deploy
- Others modules and dependencies ()
- Linting (eslint)

## Parts  -->

## Part 0: Generals about web apps

- HTTP
- HTML
- CSS
- JavaScript
- Resource fetching cycle (resource request, response, render/execute resource, etc.)
- Forms
- AJAX
- Single page app
- JavaScript frontend libraries (jQuery, Angular, **React and Redux**)
- Mermaid syntax in Markdown

## Part 1: Introduction to React

### a: Introduction to React

- Vite
- React basics (components, JSX, etc.)

### b: JavaScript

JavaScripts basics (special attention to pseudo-classes, constructors, etc.)

### c: Component state, event handlers

- Component helper functions
- Destructuring
- Page re-rendering
- Stateful component
- Event handling
- An event handler is a function
- Passing state - to child components
- Changes in state cause rerendering
- Refactoring the components

### d: A more complex state, debugging React apps

- Complex state
- Handling arrays
- Update of the state is asynchronous
- Conditional rendering
- Old React
- Debugging React applications
- Rules of Hooks
- Event Handling Revisited
- A function that returns a function
- Passing Event Handlers to Child Components
- Do Not Define Components Within Components
- Useful Reading
- Web programmers oath

## Part 2: Communicating with the server

### a: Rendering a collection, modules

- console.log
- Protip: Visual Studio Code snippets
- JavaScript Arrays
- Event Handlers Revisited
- Rendering Collections
- Key-attribute
- Map
- Anti-pattern: Array Indexes as Keys
- Refactoring Modules
- When the Application Breaks
- Web developer's oath

### b: Forms

- Saving the notes in the component state
- Controlled component
- Filtering Displayed Elements

### c: Getting data from server

- The browser as a runtime environment
- npm
- Axios and promises
- Effect-hooks
- The development runtime environment

### d: Altering data in server

- REST
- Sending Data to the Server
- Changing the Importance of Notes
- Extracting Communication with the Backend into a Separate Module
- Cleaner Syntax for Defining Object Literals
- Promises and Errors
- Full stack developer's oath

### e: Adding styles to React app

- Improved error message
- Inline styles
- Couple of important remarks

## Part 3:

### a: Node.js and Express

- Simple web server
- Express
- Web and express
- nodemon
- REST
- Fetching a single resource
- Deleting resources
- Postman
- The Visual Studio Code REST client
- The WebStorm HTTP Client
- Receiving data
- About HTTP request types
- Middleware

### b: Deploying the app to the Internet

- Same origin policy and CORS
- Application to the Internet
- Frontend production build
- Serving static files from the backend
- The whole app to the internet
- Streamlining deploying of the frontend
- Proxy

### c: Saving data to MongoDB

- Debugging Node applications
- MongoDB
- Schema
- Creating and saving objects
- Fetching objects from the database
- Connecting the backend to a database
- Database configuration into its own module
- Important note to Fly.io users
- Using database in route handlers
- Verifying frontend and backend integration
- Error handling
- Moving error handling into middleware
- The order of middleware loading
- Other operations
- A true full stack developer's oath

### d: Validation and ESLint

- Deploying the database backend to production
- Lint

## Part 4: Testing Express servers, user administration

### a: Structure of backend application, introduction to testing

- Project structure
- Note on exports
- Testing Node applications

### b: Testing the backend

- Test environment
- supertest
- Initializing the database before tests
- Running tests one by one
- async/await
- async/await in the backend
- More tests and refactoring the backend
- Error handling and async/await
- Eliminating the try-catch
- Optimizing the beforeEach function
- A true full stack developer's oath
- Refactoring tests

### c: User administration

- References across collections
- Mongoose schema for users
- Creating users
- Creating a new note
- Populate

### d: Token authentication

- Limiting creating new notes to logged-in users
- Problems of Token-based authentication
- End notes

## Part 5: Testing React apps

### a: Login in frontend

- Handling login
- Creating new notes
- Saving the token to the browser's local storage
- A note on using local storage