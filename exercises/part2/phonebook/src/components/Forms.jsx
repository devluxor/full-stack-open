import { Input } from './Inputs'

const AddContactForm = ({
  newContact, 
  setNewName, 
  setNewNumber, 
  newName, newNumber
}) => {
  return (
    <form onSubmit={e => newContact(e)}>
      <div>
        <Input 
          text='Name: '
          value={newName}
          placeholder='Contact name...'
          handler={setNewName}
        />
        <Input 
          text='Number: '
          value={newNumber}
          placeholder='Phone number...'
          handler={setNewNumber}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default AddContactForm