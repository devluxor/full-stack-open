# Node.js and Express

Node is JavaScript with bindings to the underlying operating system, making it possible to write JavaScript programs that read and write
files, execute child processes, and communicate over the network. This makes Node useful as a:

- Modern alternative to shell scripts that does not suffer from the arcane syntax of bash and other Unix shells.
- General-purpose programming language for running trusted
programs, not subject to the security constraints imposed by web browsers on untrusted code.
- Popular environment for writing efficient and highly concurrent web servers.

## Node

Node.js is an open-source, server-side JavaScript runtime environment that allows developers to execute JavaScript code on the server. It is built on the V8 JavaScript engine, the same engine that powers the Google Chrome web browser. Node.js is designed for building scalable and high-performance network applications and has gained widespread popularity in web development, particularly for building server-side applications and APIs. Here are some key concepts and fundamentals of Node.js:

- JavaScript Runtime: Node.js provides a runtime environment for executing JavaScript code on the server, as opposed to in the browser. This enables developers to write both client-side and server-side code using the same language, improving code sharing and consistency.

- Non-Blocking and Asynchronous: One of Node.js's fundamental principles is its non-blocking, event-driven architecture. It uses an event loop to handle I/O operations asynchronously. This allows Node.js to efficiently handle a large number of concurrent connections without getting blocked by time-consuming tasks. As a result, Node.js is highly suited for applications that require high concurrency and responsiveness, such as real-time applications and web servers.

- Modules and npm: Node.js uses a module system to organize code into reusable components. You can create your own modules and use built-in modules or third-party modules available through the Node Package Manager (npm). npm is a package manager that simplifies the installation, management, and sharing of Node.js packages and libraries.

- CommonJS Modules: Node.js uses the CommonJS module system, which allows you to encapsulate code and expose specific functionality to other parts of your application. You can use the require function to import modules, and you can module.exports to define what a module should make available to other modules.

- Event-Driven Programming: Node.js is event-driven, and it uses the EventEmitter pattern to handle events. You can create custom events and listeners to respond to asynchronous events in your application. This makes it particularly well-suited for building real-time applications like chat applications or streaming services.

- Built-in Core Modules: Node.js provides a set of built-in core modules for performing various tasks, such as working with the file system, handling network requests, and managing buffers. These modules are accessible without the need for external libraries.

- Package Ecosystem: Node.js has a vast and active ecosystem of open-source packages available through npm. This ecosystem includes libraries for a wide range of purposes, making it easy to find and use existing solutions for common tasks in your application.

- Cross-Platform: Node.js is designed to be cross-platform and is available for various operating systems, including Windows, macOS, and Linux. This makes it possible to develop and run Node.js applications on a wide range of environments.

- Scalability: Node.js is known for its ability to handle a large number of concurrent connections, making it a good choice for building scalable network applications. It's often used for building APIs, microservices, and real-time applications.

- Community and Support: Node.js has a large and active developer community, which means you can find extensive documentation, tutorials, and community support to help you with your Node.js projects.

Node.js is a powerful technology for building fast, scalable, and event-driven applications on the server-side. Its core concepts and fundamentals, including asynchronous programming, modules, and the npm ecosystem, make it a versatile choice for a wide range of web and network application development projects.

## Express

Implementing our server code directly with Node's built-in `http` web server is possible. However, it is cumbersome, especially once the application grows in size.

Many libraries have been developed to ease server-side development with Node, by offering a more pleasing interface to work with the built-in http module. These libraries aim to provide a better abstraction for general use cases we usually require to build a backend server. By far the most popular library intended for this purpose is express.

Express is a minimal and flexible web application framework for Node.js. It provides a set of tools for building web and API applications, making it easier to handle routing, middleware, and HTTP requests and responses in a Node.js environment. Express is one of the most popular and widely used web frameworks in the Node.js ecosystem. Here are the key concepts and fundamentals of Express:

1. Routing: Express simplifies URL routing and allows you to define routes for handling different HTTP methods (GET, POST, PUT, DELETE, etc.) and URL patterns. You can create route handlers to respond to specific URL paths, making it easy to define how your application responds to various requests.

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});
```

2. Middleware: Middleware: Middleware functions are a core concept in Express. Middleware functions are executed in a sequence and can be used to perform tasks such as authentication, logging, request and response manipulation, and error handling. Express provides a variety of built-in middleware, and you can also create custom middleware to suit your application's needs.

```js
app.use(express.json()); // Built-in middleware for parsing JSON requests

app.use((req, res, next) => {
  // Custom middleware
  console.log('Request received at', new Date());
  next();
});
```

3. Request and Response Objects: Express uses the `req` and `res` objects to represent the HTTP request and response, respectively. These objects provide a wide range of methods and properties for inspecting and manipulating the request and crafting the response.

```js
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`User ID: ${userId}`);
});
```

4. Views and Templates: Although Express itself is not a template engine, it works well with various template engines such as EJS, Handlebars, Pug, and Mustache. You can use these engines to render dynamic HTML views on the server and send them to the client.

5. Static Files: Express allows you to serve static files (e.g., CSS, JavaScript, images) from a directory using the express.static middleware. This is useful for handling client-side assets.

like

```js
app.use(express.static('public'));
```

or

```js
app.use(express.static('dist'));
```

6. Error Handling: Express provides mechanisms for handling errors, including a special error-handling middleware function that can be used to catch and process errors in a consistent manner.

```js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});
```

7. RESTful Routing: Express is often used for building RESTful APIs, making it easy to create endpoints for resource-based interactions.

8. Integration with Databases: Express can be used with various databases and data stores. Developers often use it in conjunction with ORMs (Object-Relational Mapping) libraries like Sequelize and database systems like MongoDB.

9. Middleware and Route Composition: Express allows you to compose middleware and routes in a modular fashion, making it easy to organize and reuse code.

10. Community and Ecosystem: Express has a large and active community, which means you can find a wealth of middleware, extensions, and third-party modules to extend its functionality and address common web development needs.

Express's simplicity and flexibility make it a popular choice for developing web applications, whether you're building a RESTful API or a full-fledged web application. Its key concepts, including routing, middleware, and request/response handling, make it a powerful tool for Node.js web development.

## nodemon

If we make changes to the application's code we have to restart the application to see the changes. We restart the application by first shutting it down by typing Ctrl+C and then restarting the application. Compared to the convenient workflow in React where the browser automatically reloaded after changes were made, this feels slightly cumbersome.

The solution to this problem is nodemon:

nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.

We should install nodemon by defining it as a development dependency.

We can start our application with nodemon like this:

```bash
node_modules/.bin/nodemon index.js
```

The command is long and quite unpleasant, so let's define a dedicated npm script for it in the package.json file:

```js
{
  // ..
  "scripts": {
    "start": "node index.js",

    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ..
}
```

We can now start the server in development mode with the command:

```bash
npm run dev
```

### About HTTP request types

The HTTP standard talks about two properties related to request types, safety and idempotency.

The HTTP GET request should be safe:

In particular, the convention has been established that the GET and HEAD methods SHOULD NOT have the significance of taking an action other than retrieval. These methods ought to be considered "safe".

Safety means that the executing request must not cause any side effects on the server. By side effects, we mean that the state of the database must not change as a result of the request, and the response must only return data that already exists on the server.

Nothing can ever guarantee that a GET request is safe, this is just a recommendation that is defined in the HTTP standard. By adhering to RESTful principles in our API, GET requests are always used in a way that they are safe.

The HTTP standard also defines the request type HEAD, which ought to be safe. In practice, HEAD should work exactly like GET but it does not return anything but the status code and response headers. The response body will not be returned when you make a HEAD request.

All HTTP requests except POST should be idempotent:

Methods can also have the property of "idempotence" in that (aside from error or expiration issues) the side-effects of N > 0 identical requests is the same as for a single request. The methods GET, HEAD, PUT and DELETE share this property

This means that if a request does not generate side effects, then the result should be the same regardless of how many times the request is sent.

If we make an HTTP PUT request to the URL /api/notes/10 and with the request we send the data { content: "no side effects!", important: true }, the result is the same regardless of how many times the request is sent.

Like safety for the GET request, idempotence is also just a recommendation in the HTTP standard and not something that can be guaranteed simply based on the request type. However, when our API adheres to RESTful principles, then GET, HEAD, PUT, and DELETE requests are used in such a way that they are idempotent.

POST is the only HTTP request type that is neither safe nor idempotent. If we send 5 different HTTP POST requests to /api/notes with a body of {content: "many same", important: true}, the resulting 5 notes on the server will all have the same content.

### A REST app:

For example, in a simple Note web app, this would be the routes we should implement:

| URL  |	verb 	| functionality |
| --- | --- | --- |
| notes	| GET	| fetches all resources in the collection |
| notes/10 | 	GET	| fetches a single resource |
| notes	| POST |	creates a new resource based on the request data |
| notes/10 |	DELETE |	removes the identified resource |
| notes/10 |	PUT	| replaces the entire identified resource with the request data |
| notes/10 |	PATCH	| replaces a part of the identified resource with the request data |

## On Receiving data

To access the data in json form automatically, we need the help of the express `json-parser` that we can use with the command `app.use(express.json())`.

Let's activate the json-parser and implement an initial handler for dealing with the HTTP POST requests where the route handlers are defined:

```js
const express = require('express')
const app = express()

app.use(express.json())

//...

app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)
  response.json(note)
})
```

## Middleware

The express json-parser we took into use earlier is a so-called middleware.

Middleware are functions that can be used for handling request and response objects.

The json-parser we used earlier takes the raw data from the requests that are stored in the request object, parses it into a JavaScript object and assigns it to the request object as a new property body.

In practice, you can use several middlewares at the same time. When you have more than one, they're executed one by one in the order that they were taken into use in express.

These are functions that are executed in the request-response cycle of an Express application. They can process the request object (req), the response object (res), and the next function to perform tasks, modify the request or response, and control the flow of the application. Middleware functions are an integral part of Express and are used for tasks such as authentication, logging, request and response manipulation, error handling, and more.

The next middleware function is commonly denoted by a variable named `next`.

Middleware functions can perform the following tasks:

- Execute any code.
- Make changes to the request and the response objects.
- End the request-response cycle.
- Call the next middleware function in the stack.

Here's how to use and configure Express middleware, and how they are executed in a specific order:

1. Using Middleware:
To use middleware in an Express application, you use the `app.use` method to apply middleware functions to all routes or to specific routes. Middleware can also be applied to specific HTTP methods or route patterns. Here's an example of using middleware:

example of simple `app.js`
```js
const express = require('express');
const app = express();

// Middleware function to log requests
app.use((req, res, next) => {
  console.log('Request received at', new Date());
  next(); // Call next() to pass control to the next middleware
});

// Route that uses the middleware
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});
```

2. Configuring Middleware: Middleware can be configured by attaching them to specific routes or route patterns. You can also pass multiple middleware functions to a single route or apply them globally using app.use. Middleware functions are executed in the order they are defined. You can configure middleware like this:

```js
// Middleware functions attached to a specific route
app.get('/user', authMiddleware, getUserInfo);

// Multiple middleware functions applied to a route
app.get('/admin', [authMiddleware, adminRoleCheck], adminDashboard);

// Global middleware applied to all routes
app.use(loggingMiddleware);
```

3. Order of Execution: Middleware functions are executed in the order in which they are defined. When a request is received, Express processes each middleware function in the order they were attached to the route or the application. The next function is used to move to the next middleware in the stack. If next is not called, the request-response cycle may be terminated prematurely. The order of middleware can have a significant impact on how the request is handled. For example, authentication middleware should typically be executed before route-specific middleware to ensure that authentication occurs before accessing certain routes.

4. Error Handling Middleware: Express allows you to define error-handling middleware by specifying four parameters in a middleware function (err, req, res, next). Error-handling middleware should be defined after all other middleware. If an error is encountered, Express will skip regular route handlers and go directly to error-handling middleware.

```js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});
```

5. Built-in Middleware:
Express provides some built-in middleware for common tasks. For example, express.json() is used to parse JSON requests, and express.static() is used to serve static files. These can be easily incorporated into your application using app.use.

```js
app.use(express.json()); // Parse JSON requests
app.use(express.static('public')); // Serve static files from the 'public' directory
```

## Morgan

A very common example of middleware is the logger morgan.

## Important

However, Node.js uses so-called CommonJS modules. The reason for this is that the Node ecosystem had a need for modules long before JavaScript supported them in the language specification. Node supports now also the use of ES6 modules, but since the support is not quite perfect yet, we'll stick to CommonJS modules.
