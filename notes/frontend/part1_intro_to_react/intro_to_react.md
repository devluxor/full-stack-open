# 1a: Introduction to React

## Topics

### Vite 

From: <https://cleancommit.io/blog/what-is-vite/#:~:text=A%3A%20Vite%20is%20a%20frontend,streamlined%20and%20efficient%20development%20experience>

Q: What is Vite?

A: Vite is a frontend tool that is used for building fast and optimized web applications. It uses a modern build system and a fast development server to provide a streamlined and efficient development experience.

Q: How does Vite work?

A: Vite uses native ES modules and rollup to compile and optimize your code for production, resulting in faster build times and smaller bundle sizes. It also provides a fast and lightweight development server that enables you to see changes in real-time as you write code.

Q: Can I use Vite with other frontend technologies, such as React or Vue.js?

A: Yes, Vite is designed to work seamlessly with modern web development tools and technologies, including React and Vue.js.

Q: What is the difference between Vite and Create React App?

A: The main differences between Vite and Create React App include their build systems, development servers, and ecosystem compatibility. Vite uses a faster and more efficient build system and provides a faster and more efficient development server, while Create React App has a larger and more established ecosystem.


> Vite is a modern frontend tool that offers several advantages over traditional build tools, including faster development times, smaller bundle sizes, and improved developer experience. Its key features, such as hot module replacement and native ES module support, make it an excellent choice for developers looking to create high-performance applications. In addition, its extensive plugin compatibility makes it easy to integrate with a variety of tools and technologies. Whether you are starting a new project or migrating from an existing one, Vite is a valuable tool to have in your frontend development arsenal.

<https://blog.bitsrc.io/you-need-vite-heres-why-21f3ea394564>

### React

React is an open-source JavaScript library for building user interfaces (UIs). It was developed and is maintained by Facebook and a community of individual developers and companies. React is often used for creating single-page applications and dynamic, interactive web interfaces. It's widely popular for its component-based architecture, which makes it easy to build complex UIs in a modular and reusable way.

Here are some key concepts and fundamentals of React:

1. **Component-Based Architecture**:
   React is all about breaking down your user interface into small, reusable components. A component is a self-contained piece of the UI that can be created, rendered, and managed independently. This approach makes it easier to manage complex UIs and encourages reusability.

2. **Virtual DOM**:
   React uses a virtual representation of the actual DOM (Document Object Model) called the Virtual DOM. When the state of a component changes, React updates the Virtual DOM and then calculates the most efficient way to update the real DOM. This minimizes the amount of direct manipulation of the DOM, resulting in better performance.

3. **Declarative Syntax**:
   React promotes a declarative approach to building UIs. Instead of manually manipulating the DOM to reflect changes in your application's state, you define how your UI should look based on the current state, and React takes care of updating the DOM accordingly. This makes the code more predictable and easier to understand.

4. **Component Lifecycle**:
   React components have a lifecycle that includes various methods, such as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. These lifecycle methods allow you to hook into different stages of a component's existence, enabling you to perform actions like data fetching, updates, and cleanup.

5. **State and Props**:
   In React, you have two primary ways to manage data in your components: state and props. State represents the internal data and state of a component and can be changed over time. Props are data that is passed into a component from its parent component, and they are read-only within the component.

6. **Unidirectional Data Flow**:
   React enforces a unidirectional data flow, meaning data flows from parent components to child components through props. This helps maintain a clear and predictable flow of data and makes debugging and understanding the application easier.

7. **JSX (JavaScript XML)**:
   React uses a syntax extension called JSX, which allows you to write HTML-like code within your JavaScript. JSX is transpiled into JavaScript code that creates and manipulates React elements. It makes the code more readable and familiar to web developers.

8. **React Router**:
   For building single-page applications, React Router is a popular library used to handle client-side routing. It allows you to define routes and navigation in a declarative way.

9. **React Hooks**:
   Introduced in React 16.8, hooks are functions that allow you to use state and other React features in functional components. This made it possible to use state and side effects in functional components, rather than just class components.

10. **Ecosystem and Community**:
    React has a vast ecosystem of libraries and tools that complement it. There is a strong and active community of developers contributing to the React ecosystem, which means you can find a wealth of resources, tutorials, and third-party libraries to help you build your applications.

To get started with React, you need to set up a development environment, typically using tools like Node.js, npm (Node Package Manager), and a code editor. You can create React applications by using a tool like Create React App, which simplifies the setup process.

Once your development environment is set up, you can start building React components, defining your UI's structure and behavior, managing state and props, and using React's ecosystem to enhance your application. React's official documentation is an excellent resource for learning more about React and its features.

#### Important points, aspects, patterns and techniques:

Create the project with a template:

```bash
npm create vite@latest my_react_app -- --template react
```

This creates the project scaffolding

##### Project Structure

```bash
my_react_app/
  ├── dist/
  ├── node_modules/
  ├── public/
  │   ├── index.html
  │   ├── favicon.ico
  │   └── manifest.json
  ├── src/
  │   ├── index.js
  │   ├── App.js
  │   ├── components/
  │   │   └── SomeComponent.js
  │   ├── assets/
  │   │   ├── images/
  │   │   ├── styles/
  │   │   │   ├── App.css
  │   │   │   ├── index.css
  │   │   │   └── SomeComponent.css
  │   ├── data/
  │   ├── services/
  │   │   └── someService.js
  │   ├── utils/
  ├── package.json
  ├── package-lock.json
  ├── .gitignore
  ├── README.md
  ├── .env (optional)
```

Here's a brief explanation of each of these folders and files:

1. `node_modules`: This folder contains all the dependencies and packages required for your React application. It's created when you run `npm install` to install the project's dependencies.

2. `public`: This folder contains static assets that don't need to be processed by Webpack or other build tools.

3. `src`: This is the core of your React application and where most of your development will take place. It contains your JavaScript files, components, styles, and other resources.

- `index.js`: This is the entry point of your application. It renders the root React component into the DOM.
- `App.js`: The main application component. You can also create other components in the `components` folder.
- `assets`: This folder can contain images, fonts, or any other static assets used in your application.
- `styles`: You can store CSS or SCSS files related to your components or the overall application here.
- `data`: If you have static data or configuration files, you can place them in this folder.
- `services`: This folder can house utility functions, API services, or other business logic.
- `utils`: Store utility functions and helper code here.
- `package.json` and `package-lock.json`: These files define your project's dependencies and scripts. `package-lock.json` is automatically generated and helps ensure consistent dependencies across different environments.

4. `dist`: this folder will contain the production build

`index.html`: this file is the main HTML template for your application.

`.gitignore`: This file specifies which files and folders should be excluded from version control when using Git.

`README.md`: This is the documentation for your project, describing what it does and how to use it.

`.env` (optional): You can create this file to store environment variables or configuration options for your application. It's not included by default and can be used as needed.

This structure is a common starting point for React applications, but you can adjust it based on your project's needs. As your application grows, you might create additional folders and files to keep your code organized and maintainable.

#### Initial configurations

We now should install dependencies:

- main dependencies (`npm install [dependency-name]`)
- dev only dependencies (`npm install [dependency-name] --save-dev`)

And add our own scripts to `package.json`. For example:

```js
{
  // ...
    "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0 --fix",
    "preview": "vite preview",
    "server": "json-server -p3001 --watch db.json",
    "test": "jest",
    "cypress:open": "cypress open",
    "test:e2e": "cypress run"
  }
  // ...
}
```

Of course, we can add them as our project grows and the need arises.

#### Remember to read guides, tutorials AND the official React documentation

##### Basic event handling

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
    </div>
  )
}
```

- Set the attribute with the name on + name of the event in the appropriate element
- pass a function EXPRESSION, not a function call. This is the event handler for that event.

Alternative: 

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const handleClick = () => {
    console.log('clicked!')
    setCounter(counter + 1)
  }

  return (
    <div>
      <div>{counter}</div>
      <button onClick={handleClick}>
        plus
      </button>
    </div>
  )
}
```

Note that each time the state of the component changes, the component is re-rendered. In this case, we will see the updated value of `counter`.

##### Sharing state between components

Sometimes, you want the state of two components to always change together. To do it, remove state from both of them, move it to their closest common parent, and then pass it down to them via props. This is known as lifting state up, and it’s one of the most common things you will do writing React code.

For each unique piece of state, you will choose the component that “owns” it. This principle is also known as having a “single source of truth”. It doesn’t mean that all state lives in one place—but that for each piece of state, there is a specific component that holds that piece of information. Instead of duplicating shared state between components, lift it up to their common shared parent, and pass it down to the children that need it.

Recap:

- When you want to coordinate two components, move their state to their common parent.
- Then pass the information down through props from their common parent.
- Finally, pass the event handlers down so that the children can change the parent’s state.
- It’s useful to consider components as “controlled” (driven by props) or “uncontrolled” (driven by state).

React's own official tutorial suggests: 
> "In React, it’s conventional to use `onSomething` names for props which represent events and `handleSomething` for the function definitions which handle those events."

##### Non mutating principle:

It is forbidden in React to mutate state directly, since it can result in unexpected side effects. Changing state has to always be done by setting the state to a new object. If properties from the previous state object are not changed, they need to simply be copied, which is done by copying those properties into a new object and setting that as the new state. (Use `concat` instead of `push` to alter the state if it is an array, etc.)

##### Rules of hooks

There are a few limitations and rules we have to follow to ensure that our application uses hooks-based state functions correctly.

The `useState` function (as well as the `useEffect` function introduced later on in the course) must not be called from inside a loop, a conditional expression, or any place that is not a function defining a component. This must be done to ensure that the hooks are always called in the same order, and if this isn't the case the application will behave erratically.

To recap, hooks may only be called from the inside of a function body that defines a React component.

##### Do not define components within components

Move components outside the main parent `App`, or in the appropriate folder `./components/`. The idea is one component per file. If there are nested component within a main component, we can define a single file for the main parent component, and export just the parent.

