import { useState } from 'react'

import ContactList from './components/Contacts'
import AddContactForm from './components/Forms'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [searchString, setSearchString] = useState('')

  const contactsToShow = showAll 
    ? persons 
    : persons.filter(person => (new RegExp(`${searchString}`, 'iu')).test(person.name))

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
      <SearchInput
        setSearchString={setSearchString}     
        setShowAll={setShowAll}     
      />

      <Header text='Add a new contact' />

      <AddContactForm  
        newContact={addNewContact} 
        setNewName={setNewName} 
        setNewNumber={setNewNumber} 
        newName={newName}
        newNumber={newNumber}
        />
      <Header text='Numbers' />
      <ContactList contacts={contactsToShow} />
    </>
  )
}

const Header = ({text}) => {
  return <h2>{text}</h2>
}

const SearchInput = ({setShowAll, setSearchString}) => {
  const handleSearch = (e) => {
    const searchString = e.target.value
    setSearchString(searchString)
    setShowAll(searchString.trim() === '') 
  }

  return (
    <input
      placeholder='Search by name...'
      onChange={handleSearch}
    ></input>
  )
}

export default App
