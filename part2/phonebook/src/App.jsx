import { useState } from 'react'

import ContactList from './components/Contacts'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  return (
    <div>
      <Header text='Phonebook' />
      <AddContactForm  />
      <Header text='Numbers' />
      <ContactList contacts={persons} />
    </div>
  )
}

const Header = ({text}) => {
  return <h2>{text}</h2>
}

const AddContactForm = ({}) => {
  return (
    <form onSubmit={'handler'}>
    <div>
      name: 
      <input
        placeholder='Contact name'      
      ></input> 
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}



export default App
