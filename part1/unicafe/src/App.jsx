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

    return `${(100 * good) / totalClicks()} %`
  }

  return (
    <div>
      <Header text="give feedback"/>

      <Button onClick={handleGoodClick} text='good'/>
      <Button onClick={handleNeutralClick} text='neutral'/>
      <Button onClick={handleBadClick} text='bad'/>

      <Header text="statistics"/>
      <ul>
        <Statistic text='good' clicks={good} />
        <Statistic text='neutral' clicks={neutral} />
        <Statistic text='bad' clicks={bad} />
        <Statistic text='all' clicks={totalClicks()} />
        <Statistic text='average' clicks={averageScoreClicks()} />
        <Statistic text='positives' clicks={positivePercentageClicks()} />
      </ul>
    </div>
  )
}

const Header = ({text}) => <h1>{text}</h1>
const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>
const Statistic = ({text, clicks}) => <li>{text}: {clicks}</li>

export default App