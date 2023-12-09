import { useState, useEffect } from "react"
import axios from 'axios'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const baseURL = 'https://studies.cs.helsinki.fi/restcountries/api/name'
  
  useEffect(() => {
    if (!name) return
    const url = `${baseURL}/${name}`
    axios.get(url).then(r => {
      const data = r.data
      setCountry({
        found: true,
        data: {
          name: data.name.common,
          capital: data.capital[0],
          population: data.population,
          flag: data.flags.png
        }
      })
    }).catch(() => setCountry({}))
  }, [name])

  return country
}

