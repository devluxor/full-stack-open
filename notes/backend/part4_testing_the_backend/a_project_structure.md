# Part 4: Testing Express servers, user administration

## Project structure

For smaller applications, the structure does not matter that much. Once the application starts to grow in size, you are going to have to establish some kind of structure and separate the different responsibilities of the application into separate modules. This will make developing the application much easier.

There is no strict directory structure or file naming convention that is required for Express applications. In contrast, Ruby on Rails does require a specific structure.

These are Node.js best practices, there is not a strict form (unlike Ruby on Rails)

### Example app: A very simple but functional `npm` app.

This app allows users to save information about interesting blogs they have stumbled across on the internet. For each listed blog we will save the author, title, URL, and amount of upvotes from users of the application.

The app consists of two routes, one to retrieve the list of blogs from the database, and other to add a blog entry. It has no frontend; the user can interact with the app via software like Postman, Insomnia or the VS Code REST client extension.

The database is based on MongoDB (non-relational); we interact with it via MongoDB Atlas.

```bash
├── index.js
├── app.js
├── dist
│   └── ...
├── controllers
│   └── blogs.js
├── models
│   └── blog.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js
├── tests  
│   └── ...
```

There are other important files that should be also considered for the basic structure of the, and are usually present as well in the root folder of any Node.js application, for example:

```bash
├── .env
├── .eslintrc.js
├── README.md
```

### `index.js`

The contents of the `index.js` file used for starting the application gets simplified as follows:

```js
const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

The `index.js` file only imports the actual application from the `app.js` file and then starts the application. The function info of the logger-module is used for the console printout telling that the application is running.

Now the Express app and the code taking care of the web server are separated from each other following the best practices. One of the advantages of this method is that the application can now be tested at the level of HTTP API calls without actually making calls via HTTP over the network, this makes the execution of tests faster.

### `app.js`

The `app.js` file that creates the actual application takes the router into use as shown below:

```js
// we create the necessary references to the modules we have installed via `npm` or that are
// present in other folders (`utils`, `controllers`...)
const express = require('express')
const cors = require('cors')

// handles environment variables like passwords, api keys, ports, etc
const config = require('./utils/config')

//  HTTP request logger middleware for node.js
const morgan = require('morgan')

// custom middleware (error handlers, unknown route handler, custom loggers, etc)
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')


const bloglistRouter = require('./controllers/blogs')

// The app object is instantiated upon the creation of the Express server. 
const app = express()

// Database imports + extra setting + connection to the database + logging connection success/failure
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// This adds a custom token to the logger 'morgan',
// so the body of the request sent to the server is shown on the terminal
morgan.token('body', req => {
  return JSON.stringify(req.body)
})

// Setup the middleware; you can invoke app.use(<specific_middleware_layer_here>) 
// for every middleware layer that you want to add onto your Express middleware stack. 
app.use(morgan(':method :url :status :body'))
app.use(cors())
app.use(express.json())
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

// The router we defined earlier is used if the URL of the request starts with /api/blogs. 
// For this reason, the bloglistRouter object must only define the relative parts of the routes, 
// i.e. the empty path / or just the parameter /:id.
app.use('/api/blogs', bloglistRouter)

// we export the app object after connecting to the database and adding all the necessary layers
module.exports = app
```

Note that the responsibility of establishing the connection to the database has been given to the app.js module. 

### `dist/`

It is empty in this case, but this would contain the production version (minificated, in a single file, etc) of the frontend. Usually imported via a custom `npm run build:ui` command, set in the `package.json` file in the root folder of the application. 

### `controllers/`

#### `blogs.js`

The route handlers have also been moved into a dedicated module. The event handlers for routes are commonly referred to as controllers, and for this reason we have created a new `controllers` directory. All of the routes related to the app are now in the `blogs.js` module under the `controllers` directory:

```js
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json({
    ...savedBlog._doc,
    username: user.username
  })
})

blogsRouter.put('/:id', async (request, response) => {
  // ...
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const parameterId = request.params.id
  const blog = await Blog.findById(parameterId)

  if (blog.user.toString() !== request.user.id) {
    return response.status(401).json({ error: 'unauthorized user'})
  }
  
  await blog.deleteOne()
  response.status(204).end()
})

// we would add all routes here
// if any route needs helpers, we can import them
// from a `controllers_helpers.js` module, for example.

module.exports = blogsRouter
```

All routes are now defined for the router object, similar to what I did before with the object representing the entire application, `app` in the `app.js` file in the root folder.

It's worth noting that the paths in the route handlers have been shortened (see `app.js` file)

So what are these router objects exactly? The Express manual provides the following explanation:

> A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.

The router is in fact a middleware, that can be used for defining "related routes" in a single place, which is typically placed in its own module.

The `app.js` file that creates the actual application takes the router into use as shown below:

```js
// ...
const bloglistRouter = require('./controllers/bloglist')
// ...
app.use('/api/blog', bloglistRouter)
// ...
```

The router object we defined earlier in the `bloglist.js` file is used if the URL of the request starts with `/api/blogs`. For this reason, the `bloglistRouter` object must only define the relative parts of the routes, i.e. the empty path `/` or just the parameter `/:id`.

### `models/`

#### `blog.js`

The responsibility of establishing the connection to the database has been given to the `app.js` module. The `blog.js` file under the `models` directory only defines the Mongoose schema for the blogs.

```js
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = mongoose.model('Blog', blogSchema)
```

### `utils/`

#### `config.js`

The handling of environment variables is extracted into a separate `utils/config.js` file:

```js
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI // one mock db for testing
    : process.env.MONGODB_URI // the real db

module.exports = { // then import as config, access like config.PORT, etc.
    MONGODB_URI,
    PORT
}
```

The other parts of the application can access the environment variables by importing the configuration module:

```js
const config = require('./utils/config')
// ...
logger.info(`Server running on port ${config.PORT}`)
```

#### `logger.js`

```js
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
```

The logger has two functions, info for printing normal log messages, and error for all error messages.

Extracting logging into its own module is a good idea in more ways than one. If we wanted to start writing logs to a file or send them to an external logging service like graylog or papertrail we would only have to make changes in one place.

#### `middleware.js`

Our custom middleware has been moved to a new `utils/middleware.js` module. It contains our custom error handler and the handler for unknown endpoints. It could also contain our custom logger (not in this case, as we use the very handy 'morgan' - see `app.js`):

```js
const logger = require('./logger')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler
}
```

### `.env`

The environment variables (including passwords, ports, API keys, etc.) are defined inside this file, and it can look like this:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.o1opl.mongodb.net/<dbname>?retryWrites=true&w=majority
PORT=3001
```

We can use the `dotenv` library, so we can make these globally available throughout the application.

The environment variables defined in the `.env` file can be taken into use with the expression `require('dotenv').config()` and you can reference them in your code just like you would reference normal environment variables, with the familiar `process.env.MONGODB_URI` syntax (see `app.js` file)

### `.eslintrc.js`

Generically, lint or a linter is any tool that detects and flags errors in programming languages, including stylistic errors. The term lint-like behavior is sometimes applied to the process of flagging suspicious language usage. Lint-like tools generally perform static analysis of source code.

In the JavaScript universe, the current leading tool for static analysis (aka "linting") is ESlint.

Many companies define coding standards that are enforced throughout the organization through the ESlint configuration file. It is not recommended to keep reinventing the wheel over and over again, and it can be a good idea to adopt a ready-made configuration from someone else's project into yours. Recently many projects have adopted the Airbnb Javascript style guide by taking Airbnb's ESlint configuration into use.

For example, in our app it could look like this:

```js
module.exports = {
    'env': {
        'node': true,
        'commonjs': true,
        'es2021': true
    },
    'extends': 'eslint:recommended',
    'overrides': [
    ],
    'parserOptions': {
        'ecmaVersion': 'latest'
    },
    'rules': {
        'indent': [
            'error',
            2
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
        'eqeqeq': 'error',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': [
            'error', 'always'
        ],
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ],
        'no-console': 0,
    }
}
```


### `README.md`

