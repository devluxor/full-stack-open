# c: Getting data from server

## Axios

- Axios is a popular JavaScript library used for making HTTP requests in web applications, including React apps. It provides a simple and efficient way to send HTTP requests to a server and handle the responses. Axios is often preferred over the native fetch method and XMLHttpRequest for several reasons:

- Simplicity and Consistency:
Axios provides a simple and consistent API for making HTTP requests across different browsers and environments. It abstracts many of the complexities and inconsistencies that can be encountered when using the native fetch API or XMLHttpRequest.

- Promise-Based:
Axios is built on top of Promises, making it easier to work with asynchronous code and handle responses. You can use async/await syntax or Promise chaining to manage the flow of your requests.

- Interceptors:
Axios allows you to define request and response interceptors, which are functions that can be executed before a request is sent or after a response is received. Interceptors are powerful for tasks like adding headers, logging, or handling errors globally across your application.

- Convenient Defaults:
Axios includes sensible defaults for various request configurations, such as setting the Content-Type header or handling response data as JSON. This reduces the need for repetitive code when making requests.

- Error Handling:
Axios provides built-in error handling that makes it easier to handle different types of HTTP errors, such as network errors or status code-based errors. You can catch and handle errors in a consistent way.

- Cross-Origin Requests:
Axios simplifies handling cross-origin requests, including sending cookies and handling CORS (Cross-Origin Resource Sharing) issues. This is often more straightforward with Axios compared to the native fetch method.

- Cancel Requests:
Axios supports request cancellation, which can be useful when dealing with scenarios where you need to cancel an ongoing request, such as when a user navigates away from a page or performs a new action.

- Upload and Download Progress Tracking:
Axios provides progress tracking for file uploads and downloads. You can monitor the progress of large data transfers and display progress bars or other UI elements.

- Server-Side Rendering (SSR) and Isomorphic Applications:
Axios can be used in server-side rendering (SSR) environments, making it suitable for isomorphic or universal JavaScript applications that render on both the server and the client.

- Community and Ecosystem:
Axios has a large and active community, which means you can find plenty of resources, plugins, and extensions to enhance its capabilities.

While Axios offers many advantages, it's important to note that the native fetch method is also a viable option for making HTTP requests in modern web applications. It has improved over time and is well-supported in modern browsers. The choice between Axios and fetch ultimately depends on your project requirements and personal preferences. Axios is often preferred for its ease of use, consistency, and the additional features it provides.

### Communicating with a server

We can use this library to set up a mock server during development.

1. Install json-server as a development dependency (only used during development) by executing the command:

```bash
npm install json-server --save-dev
```

and make a small addition to the `scripts` part of the `package.json` file:

```js
{
  // ... 
  "scripts": {
    // ...
    "server": "json-server -p3001 --watch db.json"
  },
}
```

2. Create a JSON data file:
Create a JSON file that will serve as your mock API data source. For example, create a `db.json` file with some sample data in json format:

```json
{
  "posts": [
    { "id": 1, "title": "First Post" },
    { "id": 2, "title": "Second Post" }
  ]
}
```

3. Start the mock server in the root folder of the app via the command

```bash
npm run server 
```

4. Access the mock API:

Your mock API is now running, and you can access it by making HTTP requests to `http://localhost:3001`. For example, to retrieve the list of posts, you can use a GET request to `http://localhost:3001/posts`.

You can use tools like Axios or the fetch API in your React app to interact with this mock API. Here's an example of how you might fetch data in a React component:

```js
import React, { useEffect, useState } from "react";
import axios from "axios"; // You may need to install Axios if not already installed.

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/posts").then((response) => {
      setPosts(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

### `useEffect` 

Notice the second argument of `useEffect`:

Example 1 of 3: Passing a dependency array
If you specify the dependencies, your Effect runs **after the initial render and after re-renders with changed dependencies**.

```js
useEffect(() => {
  // ...
}, [a, b]); // Runs again if a or b are different
```

Example 2 of 3: Passing an empty dependency array 
If your Effect truly doesn’t use any reactive values, it will **only run after the initial render**.

```js
useEffect(() => {
  // ...
}, []); // Does not run again (except once in development)
```

If you pass no dependency array at all, your Effect runs **after every single render** (and re-render) of your component.

```js
useEffect(() => {
  // ...
}); // Always runs again
```

> The Effect Hook lets you perform side effects on function components. Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.

Effect hooks are precisely the right tool to use when fetching data from a server.

### The development runtime environment

The configuration for the whole application has steadily grown more complex. Let's review what happens and where. The following image describes the makeup of a very simple React app with the json mock server:

![Simple-React-App-Arquitecture](https://fullstackopen.com/static/0e3766361ce9d08f0c4fdd39152cf493/5a190/18e.png)