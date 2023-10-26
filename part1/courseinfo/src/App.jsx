// hree new components: Header, Content, and Total
// All data still resides in the App component, 
// which passes the necessary data to each component using props. 

// Header takes care of rendering the name of the course, 
// Content renders the parts and their number of exercises
// Total renders the total number of exercises.

const Header = title => {
  return (
    <>
      <h1>{title.title}</h1>
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
      {part.partName}: {part.exercises}
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
  const title = 'Half Stack application development'

  const courses = [
    { courseId: 1,
      partName: 'Fundamentals of React',
      exercises: 10,
    },
    { courseId: 2,
      partName: 'Using props to pass data',
      exercises: 7,
    },
    { courseId: 3,
      partName: 'State of a component',
      exercises: 14,
    },
  ]

  return (
    <div>
      <Header title={title} />
      <Content courses={courses} />
      <Total courses={courses}/>
    </div>
  )
}

export default App