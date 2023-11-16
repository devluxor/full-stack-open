import { useQuery } from "@apollo/client"
import { ALL_BOOKS, USER_INFO } from "../queries"
import BookList from "./Booklist"
import { useState} from "react"

const Recommendations = () => {
  const [genre, setGenre] = useState(null)
  const userResult = useQuery(USER_INFO)
  const booksResult = useQuery(ALL_BOOKS, {
    variables: {genre},
    fetchPolicy: 'network-only',
    skip: !genre
  })

  if (booksResult.loading || userResult.loading) {
    return <div>loading...</div>
  } 
  console.log(genre)
  
  if (!genre) setGenre(userResult.data.me.favoriteGenre)
  
  const books = booksResult.data?.allBooks
  
  return (
    <>
      Titles based on your favorite genre: <strong>{genre}</strong>
      <BookList books={books}/>
    </>
  )
}

export default Recommendations