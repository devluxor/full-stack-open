import { useState } from 'react'

import ContactList from './components/Contacts'
import AddContactForm from './components/Forms'

const App = () => {
  const [persons, setPersons] = useState([
    { id: 1, name: 'Arto Hellas', number: '123' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addNewContact = (event) => {
    event.preventDefault()
    if (newName.trim() === '') return
    else if (contactInList()) {
      alert(`${newName} is already in the list`)
      resetInputs()
      return
    }

    const newContact = { id: persons.length + 1, name: newName, number: newNumber, }
    setPersons(persons.concat(newContact))
    resetInputs()
  }

  const contactInList = () => {
    return persons.find(person => person.name === newName)
  }

  const resetInputs = () => {
    setNewName('')
    setNewNumber('')
  }

  return (
    <>
      <Header text='Phonebook' />
      <AddContactForm  
        newContact={addNewContact} 
        setNewName={setNewName} 
        setNewNumber={setNewNumber} 
        newName={newName}
        newNumber={newNumber}
        />
      <Header text='Numbers' />
      <ContactList contacts={persons} />
    </>
  )
}

const Header = ({text}) => {
  return <h2>{text}</h2>
}

export default App
