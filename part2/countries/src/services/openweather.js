import axios from "axios"

const api_key = import.meta.env.VITE_WEATHER
const baseURL = 'https://api.openweathermap.org/data/2.5/weather'

const report = async (city) => {
  const request = await axios.get(`${baseURL}?q=${city}&appid=${api_key}`)
  return request.data
}

export default report