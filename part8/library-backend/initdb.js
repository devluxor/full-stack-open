const books = require('./basebooks')
const authors = require('./baseauthors')
const Book = require('./models/book')
const Author = require('./models/author')

const loadBooks = async () => {
  books.forEach(async book => {
    const author = await Author.findOne({name: book.author})

    const newBook = new Book({...args, author})

    try {
      await newBook.save()
    } catch (e) {
      console.log(e)
    }
  })
}

loadBooks()

// const book = books[0]
// console.log(book)
// const newBook = new Book({...books[0]})

// console.log(newBook)

// const loadAuthors = async () => {
//   authors.forEach(async author => {
//     const newAuthor = new Author({name: author.name, born: author.born})
//     console.log("🤖 ~ file: initdb.js:29 ~ loadAuthors ~ newAuthor:", newAuthor)
    
//     try {
//       await newAuthor.save()
//     } catch (e) {
//       console.log(e)
      
//     }
//   })
// }

// const author = authors[0]
// const newAuthor = new Author({name: author.name, born: author.born})
// console.log("🤖 ~ file: initdb.js:29 ~ loadAuthors ~ newAuthor:", newAuthor)

// const testy = async () => {
//   const a = await Author.find()
//   console.log(a)
// }

// testy()
// console.log(Author.find())
// try {
//   newAuthor.save()
// } catch (e) {
//   console.log(e)
  
// }