const ContactList = ({contacts}) => {
  return (
    <ul>
      {contacts.map((contact) => {
        return (<Contact 
          key={contact.id} 
          contactName={contact.name}
          contactNumber={contact.number} 
        />)
      })}
    </ul>
  )
}

const Contact = ({contactName, contactNumber}) => {
  return <li>{contactName} {contactNumber}</li>
}

export default ContactList