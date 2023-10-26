const Header = ({name}) => {
  return (
    <>
      <h1>{name}</h1>
    </>
  )
}

const Content = ({courses}) => {
  return (
    <ol>
      {courses.map((course, i) => {
        return <Part key={i} part={course}/>
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

const Total = ({courses}) => {
  const total = courses.map(c => c.exercises).reduce(((a, c) => a + c))
  return (
    <>
      <p>Number of exercises {total}</p>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header name={course.name} />
      <Content courses={course.parts} />
      <Total courses={course.parts}/>
    </div>
  )
}

export default App