import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"
import Book from "./Book"
import BookList from "./Booklist"
import { useEffect, useState } from "react"
import Select from 'react-select';


const Books = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [filterOptions, setFilterOptions] = useState([{
    value: 'all', label: 'all'
  }])
  const [optionsLoaded, setOptionsLoaded] = useState(false)

  const result = useQuery(ALL_BOOKS, {
    variables: activeFilter !== 'all' ? {genre: activeFilter} : {} 
  })

  useEffect(() => {
    if (!result.data || optionsLoaded) return

    const books = result.data.allBooks
    let filters = {}
    books.forEach(book => {
      book.genres.forEach(genre => {
        if (!filters[genre] && genre) {
          filters[genre] = {value: genre, label: genre}
        }
      })
    })

    setFilterOptions(filterOptions.concat(Object.keys(filters).map(genre => filters[genre])))
    setOptionsLoaded(true)
  },[result.data, optionsLoaded, filterOptions])

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  return (
    <div>
      <h2>books</h2>
      { books ? 
        <>
          <h4>active filter: {activeFilter}</h4>
          <BookList books={books}/> 
          <div style={{marginTop: 30}}>
            Filters:
            <Select
              defaultValue={'all'}
              onChange={({value}) => setActiveFilter(value)}
              options={filterOptions}
              />
          </div>
        </>
        : <p>Books loading</p>}
        
    </div>
  )
}

export default Books
