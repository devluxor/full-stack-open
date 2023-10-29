import { useState, useEffect } from 'react'

import countryServices from './services/countries'

function App() {
  const [searchString, setSearchString] = useState('')
  const [countries, setCountries] = useState(null)

  

  /*
    set initial state of countries to null
    fetch countries from server
    save data in countries
  */

  /*
    user enters chars in input
    onchange handler dynamically sets searchString
                     look for countries with that name
                     find all countries that include searchString
                        if more than 10 : too many matches
                        if 1 < x <= 10 : show list of countries
                        if 1 : show country details

  */

  const handleSearchString = e => {
    const inputString = e.target.value
    if (inputString === '') return

    setSearchString(inputString)
    console.log(searchString)
  }

  const getAllCountries = () => {
    countryServices
      .then(countries => setCountries(countries))
      .catch(error => console.log(error))
  }


  return (
    <>
      <SearchInput
        handleSearchString={handleSearchString}
      ></SearchInput>
    </>
  )
}

const SearchInput = ({handleSearchString}) => {
  return (
    <div>
      find countries
      <input 
        type='text'
        placeholder='Enter country...'    
        onChange={e => handleSearchString(e)}  
      ></input>
    </div>
  )
}

const CountryList = () => {

}

const Country = () => {

}

const Capital = () => {

}

const Languages = () => {

}

export default App
