import { useState, useEffect } from 'react'
import fullReport from '../services/openweather'

const WeatherReport = ({city}) => {
  const [report, setReport] = useState(null)

  useEffect(() => {
    let ignore = false

    const loadReport = async () => {
      try {
        const report = await fullReport(city)
        if (!ignore) setReport(report)
      } catch (e) {
        console.log(e)
      }
    }

    loadReport()

    return () => ignore = true
  }, [city]) 

  if (!report) return 

  return (
    <>
      <p>Temperature: {report.main.temp} Celsius</p>
      <img 
        src={`https://openweathermap.org/img/wn/${report.weather[0].icon}@2x.png`}
        alt={`${report.weather[0].description}`}
      ></img>
      <p>Wind: {report.wind.speed} m/s</p>
    </>
  )
} 

export default WeatherReport

