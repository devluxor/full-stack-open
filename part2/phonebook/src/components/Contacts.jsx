const ContactList = ({contacts}) => {
  return (
    <ul>
      {contacts.map((contact) => {
        return <Contact key={contact.id} contactName={contact.name} />
      })}
    </ul>
  )
}

const Contact = ({contactName}) => {
  return <li>{contactName}</li>
}

export default ContactList