const AddContactForm = ({
  newContact, 
  setNewName, 
  setNewNumber, 
  newName, newNumber
}) => {
  return (
    <form onSubmit={newContact}>
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

const Input = ({text, value, placeholder, handler}) => {
  return (
    <div>
    {text} 
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => handler(e.target.value)} // updates var in comp. state dynamically
    ></input> 
  </div>
  )
}

export default AddContactForm