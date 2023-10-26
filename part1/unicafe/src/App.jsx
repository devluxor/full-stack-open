import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  const totalClicks = () => {
    return good + neutral + bad
  }

  const averageScoreClicks = () => {
    const total = totalClicks()
    if (total === 0) return 0

    return (good + (bad * -1)) / total
  }

  const positivePercentageClicks = () => {
    const total = totalClicks()
    if (total === 0) return 0

    return (100 * good) / totalClicks()
  }

  return (
    <div>
      <Header text="give feedback"/>
      <Button onClick={handleGoodClick} text='good'/>
      <Button onClick={handleNeutralClick} text='neutral'/>
      <Button onClick={handleBadClick} text='bad'/>

      <Header text="statistics"/>
      <Statistics data={{
          good: good,
          neutral: neutral,
          bad: bad,
          all: totalClicks(),
          average: averageScoreClicks(),
          positivePercentage: positivePercentageClicks(),
        }}
      />
    </div>
  )
}

const Header = ({text}) => <h1>{text}</h1>

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Statistics = ({data}) => {
  if (data.all === 0) return <p>No feedback given!</p>
  
  return (
    <table>
      <tbody>
        {Object.keys(data).map((k, i) => {
          const value = /percentage/i.test(k) ? `${data[k]} %` : data[k]
          return <StatisticLine key={i} text={k} value={value}/>
        })}
      </tbody>
    </table>
  )
}

const StatisticLine = ({text, value}) => {
  return (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
  )
}

export default App