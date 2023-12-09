import WeatherReport from "./weather"

const SearchResults = ({countriesList, allCountries, showCountry}) => {
  if (!countriesList) return
  
  const listLength = countriesList.length
  if (listLength === 0 || listLength === allCountries.length) return
  
  if (listLength > 10) return <p>Too many matches, specify another filter</p>
  else if (listLength === 1) return <Country country={countriesList[0]} />
  else return <CountrySearchList list={countriesList} showCountry={showCountry}/>
}

const CountrySearchList = ({list, showCountry}) => {
  return (
    <ul>
      {list.map(country => {
        const name = country.name.common
        return (
          <li key={name}>
            {name}
            <button onClick={() => showCountry(name)}>Show</button>
          </li>
        )
      })}
    </ul>
  )
}

const Country = ({country}) => {
  const capital = country.capital[0]
  return (
    <div>
      <h1>{country.name.common}</h1>
      <ul>
        <li>Capital: {capital}</li>
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
      <h2>Weather in {capital}</h2>
      <WeatherReport city={capital}/>
    </div>
  )
}

export default SearchResults