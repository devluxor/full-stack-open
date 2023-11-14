# Study Guide (parts 1-5)

## Part 1: Introduction to React

- What is React
- Components
- Hooks
- `useState` (don't mutate state directly)
- Handling events in React components
- Lifting the state up
- Conditional rendering

## Part 2: Communicating with the server

- Rendering collections in React
- Controlled components (the component controls an element by managing its value, i.e.: the `value` attribute of an `<input>` element)
- Getting data from server. Axios.
- `useEffect`
- REST client-server interactions
- HTTP methods (GET, POST, DELETE, PUT)
- Simple styling: inline(style objects as the value of the `style` attribute), class-based.

## Part 3: Programming a server with NodeJS and Express

- NodeJS
- Express
- Writing a RESTful API
- Express middleware: loggers, error handlers, JSON parsers, unknown endpoint handlers.
- Same origin policy and CORS.
- Frontend production build and streamlining deploying.
- Deployment pipeline (automated and controlled way to move the code from the computer of the developer through different tests and quality checks to production)
- MongoDB (connecting to the database, Schema, model, database integration)
- Express error handling
- Order of middleware loading
- MongoDB type validation (Schema types, document updating validation)
- Linting: ESLint.

## Part 4: Testing Express server. User administration

- Unit testing for Node applications (Jest and Supertest)
- Test environment
- Error handling with async/await functions (express async errors)
- User administration (Schema, populate as pseudo-joins)
- Token-based authentication (principles and security)

## Part 5: Testing React applications

- Handling user login from the frontend
- The browser's local storage
- XSS
- `props.children`
- `useRef`, `forwardRef`, `useImperativeHandle`
- Prop validation with PropTypes
- Testing React applications: integration tests.
- Snapshot testing (comparing the components' HTML code before and after performing some action)
- End to end (E2E) testing: Cypress.
