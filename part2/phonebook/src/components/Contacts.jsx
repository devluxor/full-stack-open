const ContactList = ({contacts, deleteContact}) => {
  return (
    <ul>
      {contacts.map((contact) => {
        return (
          <Contact 
            key={contact.id} 
            contact={contact}
            deleteContact={deleteContact} 
          />
        )
      })}
    </ul>
  )
}

const Contact = ({contact, deleteContact}) => {
  return (
    <li>
      {contact.name} {contact.number} 
      <button
        onClick={() => deleteContact(contact.id)}
      >Delete</button>      
    </li>
  )
}

export default ContactList