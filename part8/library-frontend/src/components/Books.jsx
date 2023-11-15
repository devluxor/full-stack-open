import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"
import Book from "./Book"

const Books = () => {

  const result = useQuery(ALL_BOOKS)

  // const authors = []
  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {result.data.allBooks.map((book) => <Book key={book.title} book={book}/> )}
        </tbody>
      </table>
    </div>
  )
}

export default Books
