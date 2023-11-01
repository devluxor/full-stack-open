# Part 4: Testing Express servers, user administration

## Testing the backend

In some situations, it can be beneficial to implement some of the backend tests by mocking the database instead of using a real database. One library that could be used for this is mongodb-memory-server.

we will decide to test the entire application through its REST API, so that the database is also included. This kind of testing where multiple components of the system are being tested as a group is called integration testing.

### Test environment

when your backend server is running in Fly.io or Render, it is in production mode.

The convention in Node is to define the execution mode of the application with the NODE_ENV environment variable.

In our current application, we only load the environment variables defined in the .env file if the application is not in production mode.

It is common practice to define separate modes for development and testing.

change the scripts in our notes application package.json file, so that when tests are run, NODE_ENV gets the value test:

```js
{
  // ...
  "scripts": {

    "start": "NODE_ENV=production node index.js",
    "dev": "NODE_ENV=development nodemon index.js",
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",

    "test": "NODE_ENV=test jest --verbose --runInBand"
  },
  // ...
}
```

We also added the runInBand option to the npm script that executes the tests. This option will prevent Jest from running tests in parallel

We specified the mode of the application to be development in the npm run dev script that uses nodemon. We also specified that the default npm start command will define the mode as production.

the way that we have specified the mode of the application in our scripts: it will not work on Windows. We can correct this by installing the cross-env package as a development dependency with the command:

```
npm install --save-dev cross-env
```
this will install the dep. as dev. dep; we have to install it as gen. dep. in order to work as deployed in fly or render with:

and
```js
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    // ...
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
  },
  // ...
}
```

Now we can modify the way that our application runs in different modes.

we could define the application to use a separate test database when it is running tests.

We can create our separate test database in MongoDB Atlas. This is not an optimal solution in situations where many people are developing the same application. Test execution in particular typically requires a single database instance that is not used by tests that are running concurrently.

It would be better to run our tests using a database that is installed and running on the developer's local machine. The optimal solution would be to have every test execution use a separate database. This is "relatively simple" to achieve by running Mongo in-memory or by using Docker containers. We will not complicate things and will instead continue to use the MongoDB Atlas database.

Let's make some changes to the module `utils/config.js` that defines the application's configuration:

```js
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
```

The .env file has separate variables for the database addresses of the development and test databases:
```sh
MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001


TEST_MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/testNoteApp?retryWrites=true&w=majority
```

### supertest

We will install the package as a development dependency:

```
npm install --save-dev supertest
```

we create our first test under the folder `tests/`

`note_api.test.js`:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(async () => {
  await mongoose.connection.close()
})
```

The test imports the Express application from the app.js module and wraps it with the supertest function into a so-called superagent object. This object is assigned to the api variable and tests can use it for making HTTP requests to the backend.

Mongoose documentation does not recommend testing Mongoose applications with Jest. (test with jest works for me flawlessly)


The documentation for supertest says the following:

if the server is not already listening for connections then it is bound to an ephemeral port for you so there is no need to keep track of ports.

supertest takes care that the application being tested is started at the port that it uses internally.

The middleware that outputs information about the HTTP requests is obstructing the test execution output. Let us modify the logger so that it does not print to the console in test mode:

### Initializing the database before tests

To make our tests more robust, we have to reset the database and generate the needed test data in a controlled manner before we run the tests.

Let's initialize the database before every test with the beforeEach function:

structure of tests:

test(
  test title as string,
  async function(
    includes assertion like: `expect(x).someJestMethod(to be/match include y)`
  )
)

Running tests one by one

When we are writing tests, it is usually wise to only execute one or two tests

A better option is to specify the tests that need to be run as parameters of the npm test command.

NB: When running a single test, the mongoose connection might stay open if no tests using the connection are run. The problem might be because supertest primes the connection, but Jest does not run the afterAll portion of the code.

Async/await

More tests and refactoring the backend

When code gets refactored, there is always the risk of regression, meaning that existing functionality may break. Let's refactor the remaining operations by first writing a test for each route of the API.

The same verification steps will repeat in different tests later on, and it is a good idea to extract these steps into helper functions. Let's add the function into a new file called tests/test_helper.js which is in the same directory as the test file.

Eliminating the try-catch

Async/await unclutters the code a bit, but the 'price' is the try/catch structure required for catching exceptions. All of the route handlers follow the same structure

```js
try {
  // do the async operations here
} catch(exception) {
  next(exception)
}
```
One starts to wonder if it would be possible to refactor the code to eliminate the catch from the methods?

The express-async-errors library has a solution for this.

Using the library is very easy. You introduce the library in app.js, before you import your routes

The 'magic' of the library allows us to eliminate the try-catch blocks completely. 

This:

```js
notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
```

Becomes this:

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
```

Because of the library, we do not need the next(exception) call anymore. The library handles everything under the hood. If an exception occurs in an async route, the execution is automatically passed to the error handling middleware.

Optimizing the `beforeEach` operation

This won't work:

```js
beforeEach(async () => {
  await Note.deleteMany({})
  console.log('cleared')

  helper.initialNotes.forEach(async (note) => {
    let noteObject = new Note(note)
    await noteObject.save()
    console.log('saved')
  })
  console.log('done')
})
```

The problem is that every iteration of the `forEach` loop generates an asynchronous operation, and `beforeEach` won't wait for them to finish executing. In other words, the await commands defined inside the `forEach` loop are not in the `beforeEach` function, but in separate functions that `beforeEach` will not wait for.

Since the execution of tests begins immediately after `beforeEach` has finished executing, the execution of tests begins before the database state is initialized.

One way of fixing this is to wait for all of the asynchronous operations to finish executing with the `Promise.all` method:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})
```

The `Promise.all` method can be used for transforming an array of promises into a single promise, that will be fulfilled once every promise in the array passed to it as a parameter is resolved. The last line of code await Promise.all(promiseArray) waits until every promise for saving a note is finished, meaning that the database has been initialized.

The returned values of each promise in the array can still be accessed when using the Promise.all method. If we wait for the promises to be resolved with the await syntax `const results = await Promise.all(promiseArray)`, the operation will return an array that contains the resolved values for each promise in the promiseArray, and they appear in the same order as the promises in the array.

Promise.all executes the promises it receives in parallel. If the promises need to be executed in a particular order, this will be problematic. In situations like this, the operations can be executed inside of a for...of block, that guarantees a specific execution order.

NB: the material uses the `toContain` matcher in several places to verify that an array contains a specific element. It's worth noting that the method uses the `===` operator for comparing and matching elements, which means that it is often not well-suited for matching objects. In most cases, the appropriate method for verifying objects in arrays is the `toContainEqual` matcher.