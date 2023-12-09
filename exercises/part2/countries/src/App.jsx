import { useState, useEffect } from 'react'

import countryServices from './services/countries'
import SearchResults from './components/results' 

function App() {
  const [allCountries, setCountries] = useState(null)
  const [searchResult, setSearchResult] = useState(null)

  useEffect(() => {
    countryServices
      .getAll()
      .then(countryList => setCountries(countryList) )
      .catch(e => console.log(e))
  }, [])

  const handleSearchString = e => {
    const inputString = e.target.value.trim()
    if (inputString === '') {
      setSearchResult([])
      return
    }

    findCountries(inputString)
  }

  const findCountries = string => {
    const nameRegexp = new RegExp(`${string}`, 'i')
    const results = allCountries.filter(country => nameRegexp.test(country.name.common))    
    setSearchResult(results)
  }

  const showCountry = name => {
    setSearchResult([searchResult.find(country => country.name.common === name)])
  }

  if (!allCountries) return

  return (
    <>
      <SearchInput handleSearchString={handleSearchString} />
      <SearchResults
        allCountries={allCountries}
        countriesList={searchResult}
        showCountry={showCountry}
      />
    </>
  )
}

const SearchInput = ({handleSearchString}) => {
  return (
    <div>
      find countries
      <input 
        type='text'
        placeholder='Enter country name...'    
        onChange={e => handleSearchString(e)}  
      ></input>
    </div>
  )
}

export default App
