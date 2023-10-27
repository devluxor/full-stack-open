const Header = ({name}) => {
  return (
    <>
      <h1>{name}</h1>
    </>
  )
}

const Content = ({parts}) => {
  return (
    <ol>
      {parts.map((part) => {
        return <Part key={part.id} part={part}/>
      })}
    </ol>
  )
}

const Part = ({part}) => {
  return (
    <li>
      {part.name}: {part.exercises}
    </li>
  )
}

const Total = ({parts}) => {
  const total = parts.map(c => c.exercises).reduce(((a, c) => a + c))
  return (
    <>
      <p>Number of exercises {total}</p>
    </>
  )
}

const Course = ({course}) => {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts}/>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        id: 0,
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        id: 1,
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        id: 2,
        name: 'State of a component',
        exercises: 14
      },
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App