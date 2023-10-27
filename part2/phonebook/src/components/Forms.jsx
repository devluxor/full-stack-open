const AddContactForm = ({handleNewContact, handleSetNewName, newName}) => {
  return (
    <form onSubmit={handleNewContact}>
    <div>
      name: 
      <input
        value={newName}
        placeholder='Contact name'
        onChange={(e) => handleSetNewName(e.target.value)} // updates newName var in comp. state dynamically
      ></input> 
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

export default AddContactForm