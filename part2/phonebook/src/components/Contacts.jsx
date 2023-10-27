const ContactList = ({contacts}) => {
  return (
    contacts.map(contact => {
      return <Contact key={contact.name} contactName={contact.name} />
    })
  )
}

const Contact = ({contactName}) => {
  return <p>{contactName}</p>
}

export default ContactList