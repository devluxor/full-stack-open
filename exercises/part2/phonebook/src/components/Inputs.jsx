const Input = ({text, value, placeholder, handler}) => {
  return (
    <div>
    {text} 
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => handler(e.target.value)} // updates var in comp. state dynamically
    ></input> 
  </div>
  )
}

const SearchInput = ({setShowAll, setSearchString}) => {
  const handleSearch = (e) => {
    const searchString = e.target.value
    setSearchString(searchString)
    setShowAll(searchString.trim() === '') 
  }

  return (
    <input
      placeholder='Search by name...'
      onChange={handleSearch}
    ></input>
  )
}

export {Input, SearchInput}