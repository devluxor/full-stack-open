import Book from "./Book"

const BookList = ({books}) => {
  return (
    <table>
      <tbody>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Published</th>
        </tr>
        {books.map((book) => <Book key={book.title} book={book}/> )}
      </tbody>
    </table>
  )
}

export default BookList