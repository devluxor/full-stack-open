import { useResource } from "./hooks/index"

import NoteForm from "./components/NoteForm"
import NoteList from "./components/NoteList"
import PersonForm from "./components/PersonForm"
import PersonList from "./components/PersonList"

const App = () => {
  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  return (
    <div>
      <h2>notes</h2>
      <NoteForm noteService={noteService}/>
      <NoteList notes={notes}/>

      <h2>persons</h2>
      <PersonForm personService={personService} />
      <PersonList persons={persons}/>
    </div>
  )
}



export default App