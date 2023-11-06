# MongoDB

MongoDB is a popular, open-source, NoSQL database management system that is designed to store and manage unstructured or semi-structured data. MongoDB is classified as a document database, and it stores data in a flexible, JSON-like format known as BSON (Binary JSON). Here are the key concepts and fundamentals of MongoDB:

1. **Document-Oriented Data Model:** MongoDB uses a document-based data model, where data is stored in documents. Each document is a self-contained unit that can represent complex, nested data structures. Documents are typically stored in collections, which are analogous to tables in relational databases.

2. **BSON (Binary JSON):** BSON is a binary representation of JSON (JavaScript Object Notation), and it is the format used to store data in MongoDB. BSON allows for efficient storage and retrieval of data, and it supports various data types, including strings, numbers, arrays, and embedded documents.

3. **Collections:** In MongoDB, data is organized into collections. A collection is a group of documents that share a similar structure, but they are not required to have the same schema. Collections are similar to tables in relational databases.

4. **Documents:** Documents are the basic unit of data in MongoDB. Each document is represented in BSON format and contains one or more key-value pairs. Documents are flexible, meaning they can have different fields and data types.

5. **Fields:** Fields are the keys in a document and contain the values. Fields can be of different data types, including strings, numbers, arrays, or even other embedded documents.

6. **JSON-like Query Language:** MongoDB uses a query language similar to JSON to retrieve and manipulate data. You can use a variety of operators to filter, update, and manipulate data within documents.

7. **Indexing:** MongoDB supports indexing to improve query performance. You can define indexes on one or more fields in a collection to speed up data retrieval.

8. **Replication:** MongoDB offers replication for high availability and fault tolerance. It allows you to create replica sets, which consist of multiple copies of your data. If one server fails, another can take over to ensure data availability.

9. **Sharding:** MongoDB provides horizontal scaling through sharding. Sharding allows you to distribute data across multiple servers to handle large datasets and high write and read workloads.

10. **Aggregation Framework:** MongoDB includes a powerful aggregation framework that allows you to perform complex data transformation and analysis operations on your data.

11. **Geospatial Capabilities:** MongoDB has built-in support for geospatial data and queries, making it suitable for location-based applications.

12. **GridFS:** GridFS is a specification for storing and retrieving large files in MongoDB. It allows you to store files in smaller chunks, making it suitable for managing large binary data, such as images or videos.

13. **Security:** MongoDB provides authentication, authorization, and encryption mechanisms to secure your data and control access to your database.

14. **Community and Ecosystem:** MongoDB has a large and active community, which means you can find extensive documentation, tutorials, and community support. There are also many third-party libraries and tools that enhance MongoDB's functionality.

MongoDB is widely used for a variety of applications, including content management systems, e-commerce platforms, real-time analytics, and more. Its flexibility, scalability, and ease of use make it a popular choice for developers and organizations looking to work with unstructured or semi-structured data.

## MongoDB Atlas

Naturally, you can install and run MongoDB on your computer. However, the internet is also full of Mongo database services that you can use. Our preferred MongoDB provider in this course will be MongoDB Atlas.

## Mongoose

We could use the database directly from our JavaScript code with the official MongoDB Node.js driver library, but it is quite cumbersome to use. We will instead use the Mongoose library that offers a higher-level API.

Mongoose is an Object Data Modeling (ODM) library for Node.js and MongoDB, which means it provides a structured way to interact with MongoDB databases using JavaScript. It simplifies and streamlines the process of working with MongoDB, a NoSQL database, by providing an abstraction layer and additional features. Here are some key concepts and fundamentals of Mongoose:

1. **Schema**:
   - In Mongoose, a schema defines the structure of the data that can be stored in a MongoDB collection. It includes the fields (properties) for documents in the collection and their data types. Schemas can also include validation rules, default values, and other constraints.

2. **Model**:
   - A model is a JavaScript class that is a compiled version of a Mongoose schema. It represents a MongoDB collection and provides an interface for querying and manipulating data. You can use models to perform CRUD (Create, Read, Update, Delete) operations on your MongoDB data.

3. **Connecting to MongoDB**:
   - Mongoose allows you to connect to a MongoDB database using the `mongoose.connect()` method. You can specify the MongoDB connection string, options, and error handling.

   ```javascript
   const mongoose = require('mongoose');
   mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });
   ```

4. **Defining a Schema**:
   - You create a schema using the `mongoose.Schema` constructor. You define the fields and their data types within the schema. For example, to define a schema for a "User" collection:

   ```javascript
   const userSchema = new mongoose.Schema({
     username: String,
     email: String,
     age: Number,
   });
   ```

5. **Creating a Model**:
   - You compile a schema into a model using `mongoose.model()`. This step creates a constructor for documents that will be stored in a specific MongoDB collection.

   ```javascript
   const User = mongoose.model('User', userSchema);
   ```

6. **CRUD Operations**:
   - With a Mongoose model, you can perform CRUD operations on the MongoDB collection. For example:

   - Create a new document:

     ```javascript
     const newUser = new User({ username: 'john', email: 'john@example.com', age: 30 });
     newUser.save();
     ```

   - Read data from the collection:

     ```javascript
     User.find({ age: 25 }, (err, users) => {
       if (err) {
         console.error(err);
       } else {
         console.log(users);
       }
     });
     ```

   - Update a document:

     ```javascript
     User.updateOne({ username: 'john' }, { age: 31 }, (err) => {
       if (err) {
         console.error(err);
       }
     });
     ```

   - Delete a document:

     ```javascript
     User.deleteOne({ username: 'john' }, (err) => {
       if (err) {
         console.error(err);
       }
     });
     ```

   - This methods return promise-like objects, and they should be used with the `async`/`await` syntax. For example:

      ```js
      usersRouter.get('/', async (request, response) => {
        const users = await User.find({})
        response.json(users)
      })
      ```

7. **Middleware and Hooks**:
   - Mongoose provides middleware and hooks to add custom logic at different stages of the document lifecycle, such as before saving, updating, or removing a document.

8. **Validation and Constraints**:
   - Mongoose allows you to define validation rules for your schema fields, ensuring that data adheres to specific constraints.

9. **Populating**:
   - Mongoose supports data population, allowing you to reference documents in other collections and retrieve them in a single query.

10. **Querying**:
    - Mongoose provides a flexible and expressive query API for filtering, sorting, and projecting data.

11. **Middleware**:
    - You can use middleware functions to execute code before or after certain actions, such as saving a document or removing a document.

12. **Plugins**:
    - Mongoose allows you to create and use plugins to add reusable functionality to your models and schemas.

Mongoose simplifies and enhances the process of working with MongoDB in Node.js applications, making it easier to define schemas, perform CRUD operations, and add custom logic to your data models. It's a popular choice for developers building Node.js applications with MongoDB as their database.

## Connecting to the database

```js
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
```

It's not a good idea to hardcode the address of the database into the code, so instead the address of the database is passed to the application via the MONGODB_URI environment variable.

There are many ways to define the value of an environment variable. We can use the dotenv library.

To use the library, we create a .env file at the root of the project. The environment variables are defined inside of the file, and it can look like this:

```bash
MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001
```

We also added the hardcoded port of the server into the PORT environment variable.

**The .env file should be gitignored right away since we do not want to publish any confidential information publicly online!**

The environment variables defined in the .env file can be taken into use with the expression require('dotenv').config() and you can reference them in your code just like you would reference normal environment variables, with the familiar process.env.MONGODB_URI

## Moving Error handling into middleware

We can write the code for the error handler among the rest of our code. This can be a reasonable solution at times, but there are cases where it is better to implement all error handling in a single place. This can be particularly useful if we want to report data related to errors to an external error-tracking system like Sentry later on.

We can do this by passing the exceptions to the `next` argument: it passes the error forward with the next function. The next middleware function is passed to the handler as the third parameter

All routes can look like this:

```js
notesRouter.get('/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id)
    if (note) response.json(note)
    else response.status(404).end()
  } catch(exception) {
    next(exception)
  }
})
```

If `next` was called without an argument, then the execution would simply move onto the next route or middleware. If the `next` function is called with an argument, then the execution will continue to the  error handler middleware or to those that are set up to handle errors.

Express error handlers are middleware that are defined with a function that accepts four parameters. Our error handler looks like this:

Our custom error handler could look like this:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)
```

The error handler checks if the error is a `CastError` exception, in which case we know that the error was caused by an invalid object id for Mongo. In this situation, the error handler will send a response to the browser with the response object passed as a parameter. In all other error situations, the middleware passes the error forward to the default Express error handler.

Note that the error-handling middleware has to be the last loaded middleware!

## Middleware order in `app.js`

> All Express route handlers (whether app.use(), app.get(), app.post() or anything else) are checked for a route match in the order they are registered. Further, once a route sends a request and does not call `next()`, then no further routes are checked for a match to the current request. All processing for that request will be done.

Correct order:

```js
app.use(cors())
app.use(express.static('dist'))
app.use(express.json()) // response bode parser
app.use(morgan(':method :url :status :body')) // logger

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// the middleware for handling unsupported routes is just before the error handler:
app.use(middleware.unknownEndpoint) 
app.use(middleware.errorHandler) // the error-handling middleware must be at the end
```