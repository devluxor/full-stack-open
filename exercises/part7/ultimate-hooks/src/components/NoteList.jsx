const NoteList = ({notes}) => {
  return (
    notes.map(n => <p key={n.id}>{n.content}</p>)
  )
}

export default NoteList