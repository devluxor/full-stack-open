const SearchResults = ({countriesList, allCountries}) => {
  if (!countriesList) return
  
  const listLength = countriesList.length
  if (listLength === 0 || listLength === allCountries.length) return
  
  if (listLength > 10) return <p>Too many matches, specify another filter</p>
  else if (listLength === 1) return <Country country={countriesList[0]} />
  else return <CountrySearchList list={countriesList}/>
}

const CountrySearchList = ({list}) => {
  return (
    <ul>
      {list.map(country => {
        return <li key={country.name.common}>{country.name.common}</li>
      })}
    </ul>
  )
}

const Country = ({country}) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <ul>
        <li>Capital: {country.capital[0]}</li>
        <li>Area: {country.area}</li>
      </ul>
      <h2>Languages:</h2>
      <ul>
        {Object.values(country.languages).map(lang => {
          return <li key={lang}>{lang}</li>
        })}
      </ul>
      <img 
        src={country.flags.png} 
        alt={`${country.demonyms.eng.m} flag`}
      ></img>
    </div>
  )
}

export default SearchResults