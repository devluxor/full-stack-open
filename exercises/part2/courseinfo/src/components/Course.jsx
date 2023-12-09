const Course = ({course}) => {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts}/>
    </>
  )
}

const Header = ({name}) => {
  return <h1>{name}</h1>
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
  return <li>{part.name}: {part.exercises}</li>
}

const Total = ({parts}) => {
  const total = parts.map(c => c.exercises).reduce(((a, c) => a + c))
  return <p><b>Number of exercises {total}</b></p>
}

export default Course