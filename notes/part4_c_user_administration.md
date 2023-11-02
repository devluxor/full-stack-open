# User administration

We want to add user authentication and authorization to our application. Users should be stored in the database and every note should be linked to the user who created it. Deleting and editing a note should only be allowed for the user who created it.

Let's start by adding information about users to the database. There is a one-to-many relationship between the user (User) and notes (Note):

(one user can create many notes, many notes can have one (the same) user)

If we were working with a relational database the implementation would be straightforward. Both resources would have their separate database tables, and the id of the user who created a note would be stored in the notes table as a foreign key.

When working with document databases the situation is a bit different, as there are many different ways of modeling the situation.

The existing solution saves every note in the notes collection in the database. If we do not want to change this existing collection, then the natural choice is to save users in their own collection, users for example.

Like with all document databases, we can use object IDs in Mongo to reference documents in other collections. This is similar to using foreign keys in relational databases.

Traditionally document databases like Mongo do not support join queries that are available in relational databases, used for aggregating data from multiple tables. However, starting from version 3.2. Mongo has supported lookup aggregation queries. 

If we need functionality similar to join queries, we will implement it in our application code by making multiple queries. In certain situations, Mongoose can take care of joining and aggregating data, which gives the appearance of a join query. However, even in these situations, Mongoose makes multiple queries to the database in the background. (instead of one with joins like trad. rel. queries)

## References across collections

If we were using a relational database the note would contain a reference key to the user who created it. In document databases, we can do the same thing.

i.e:

one collection users contains user documents with an id field (like keys)

one collection notes contains note documents with a user (its author) field, that contains a user id

Document databases do not demand the foreign key to be stored in the note resources, it could also be stored in the users collection, or even both:

for example, the user documents can have a notes property with an array containg the ids of the notes he/she created

Document databases also offer a radically different way of organizing the data: In some situations, it might be beneficial to nest the entire notes array as a part of the documents in the users collection:

```js
[
  {
    username: 'mluukkai',
    _id: 123456,
    notes: [
      {
        content: 'HTML is easy',
        important: false,
      },
      {
        content: 'The most important operations of HTTP protocol are GET and POST',
        important: true,
      },
    ],
  },
  {
    username: 'hellas',
    _id: 141414,
    notes: [
      {
        content:
          'A proper dinosaur codes with Java',
        important: false,
      },
    ],
  },
]
```

In this schema, notes would be tightly nested under users and the database would not generate ids for them.

The structure and schema of the database are not as self-evident as it was with relational databases. The chosen schema must support the use cases of the application the best. This is not a simple design decision to make, as all use cases of the applications are not known when the design decision is made.

Paradoxically, schema-less databases like Mongo require developers to make far more radical design decisions about data organization at the beginning of the project than relational databases with schemas. On average, relational databases offer a more or less suitable way of organizing data for many applications.

Mongoose schema for users

in our simple notes app, we decide to store the ids of the notes created by the user in the user document. Let's define the model for representing a user in the models/user.js file.

In our model, In stark contrast to the conventions of relational databases, references are now stored in both documents: the note references the user who created it, and the user has an array of references to all of the notes created by them.

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
```

```js
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
```

Creating users

Let's implement a route for creating new users. Users have a unique username, a name and something called a passwordHash. The password hash is the output of a one-way hash function applied to the user's password. It is never wise to store unencrypted plain text passwords in the database!

Let's install the bcrypt package for generating the password hashes:

Let's define a separate router for dealing with users in a new controllers/users.js file. Let's take the router into use in our application in the app.js file, so that it handles requests made to the /api/users url:

The password sent in the request is not stored in the database. We store the hash of the password that is generated with the bcrypt.hash function.

(then we will compare the hash generated by the entered password with this stored hash; if they _match_ (two equal password inputs will generate an _equivalent_ hash, not always literally the same), the entered password is correct)

The fundamentals of storing passwords are outside the scope of this course material. We will not discuss what the magic number 10 assigned to the saltRounds variable means, but you can read more about it in the linked material.

write tests for the users new functionality


The test case obviously will not pass at this point. We are essentially practicing test-driven development (TDD), where tests for new functionality are written before the functionality is implemented.

tests first, functionality then

Mongoose does not have a built-in validator for checking the uniqueness of a field. Fortunately there is a ready-made solution for this, the mongoose-unique-validator library. 

We could also implement other validations into the user creation. We could check that the username is long enough, that the username only consists of permitted characters, or that the password is strong enough. 

The code for creating a new note has to be updated so that the note is assigned to the user who created it.

Populate
We would like our API to work in such a way, that when an HTTP GET request is made to the /api/users route, the user objects would also contain the contents of the user's notes and not just their id. In a relational database, this functionality would be implemented with a join query.

As previously mentioned, document databases do not properly support join queries between collections, but the Mongoose library can do some of these joins for us. Mongoose accomplishes the join by doing multiple queries, which is different from join queries in relational databases which are transactional, meaning that the state of the database does not change during the time that the query is made. With join queries in Mongoose, nothing can guarantee that the state between the collections being joined is consistent, meaning that if we make a query that joins the user and notes collections, the state of the collections may change during the query.

The Mongoose join is done with the populate method. 

The populate method is chained after the find method making the initial query. The parameter given to the populate method defines that the ids referencing note objects in the notes field of the user document will be replaced by the referenced note documents.

We can use the populate parameter for choosing the fields we want to include from the documents. In addition to the field id:n we are now only interested in content and important.

It's important to understand that the database does not know that the ids stored in the user field of notes reference documents in the user collection.

The functionality of the populate method of Mongoose is based on the fact that we have defined "types" to the references in the Mongoose schema with the ref option: