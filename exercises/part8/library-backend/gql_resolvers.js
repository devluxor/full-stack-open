const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const resolvers = {
  Query: {
    bookCount: async () => {
      const result = await Book.find({})
      return result.length
    },
    authorCount: async () => {
      const result = await Author.find({})
      return result.length
    },
    allBooks: async (root, args) => {
      const isAuthor = (book, author) => book.author.name === author
      const hasGenres = (book, genre) => book.genres.includes(genre)

      const books = await Book.find({}).populate('author')
      const author = args.author
      const genre = args.genre

      if (!author && !genre) return books
      else if (author && !genre) return books.filter(b => isAuthor(b, author))
      else if (!author && genre) return books.filter(b => hasGenres(b, genre))

      const result = books.filter(b => {
        return isAuthor(b, author) && hasGenres(b, genre)
      })

      return result
    },
    allAuthors: async () => {
      return Author.find({})
    },
    allUsers: async () => {
      return User.find({})
    },
    me: async (root, args, {currentUser}) => {
      return currentUser
    },
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({}).populate('author')

      return books.filter(b => b.author.name === root.name ).length
    }
  },
  Mutation: {
    addBook: async (root, args, {currentUser}) => {
      if (!currentUser) return null
      
      const author = await Author.findOne({name: args.author})

      let newAuthor
      if (!author) {
        newAuthor = new Author({name: args.author})
        await newAuthor.save()
      }

      const newBook = new Book({...args, author: newAuthor ?? author})

      try {
        await newBook.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }

      return newBook
    },
    addAuthor: async (root, args, {currentUser}) => {
      if (!currentUser) return null
      
      const newAuthor = new Author({...args})
      try {
        await newAuthor.save()
        return newAuthor
      } catch (error) { 
        throw new GraphQLError('Adding author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }

    },
    editAuthor: async (root, args, {currentUser}) => {
      if (!currentUser) return null
      
      const author = await Author.findOne({name: args.name})
      if (!author) return null

      const editedAuthor = {
        ...author._doc,
        name: args.newName ?? author._doc.name,
        born: args.setBornTo
      }

      const options = { new: true, runValidators: true, context: 'query'}
      try {
        const updatedAuthor = await Author.findByIdAndUpdate(
          author._id, 
          editedAuthor, 
          options
        )
        return updatedAuthor
      } catch (e) {
        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
    },
    createUser: async (root, args) => {
      const user = new User({...args})
      try {
        const newUser = await user.save()
        return newUser
      } catch (error) {
        throw new GraphQLError('Couldn\'t create user', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) { // hardcoded password as an example
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }

      const userForToken = {
        username: user.username,
        id: user._id,
        favoriteGenre: user.favoriteGenre
      }
      
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    clear: async (root, args) => {
      await Book.deleteMany()
      return 1
    }
  }
}

module.exports = resolvers