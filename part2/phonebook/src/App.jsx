import { useState } from 'react'

import ContactList from './components/Contacts'
import AddContactForm from './components/Forms'

const App = () => {
  const [persons, setPersons] = useState([
    { id: 1, name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const addNewContact = (event) => {
    event.preventDefault()
    if (newName.trim() === '') return

    const newContact = { id: persons.length + 1, name: newName }
    setPersons(persons.concat(newContact))
    setNewName('')
  }

  return (
    <>
      <Header text='Phonebook' />
      <AddContactForm  
        handleNewContact={addNewContact} 
        handleSetNewName={setNewName} 
        newName={newName}/>
      <Header text='Numbers' />
      <ContactList contacts={persons} />
    </>
  )
}

const Header = ({text}) => {
  return <h2>{text}</h2>
}

export default App
