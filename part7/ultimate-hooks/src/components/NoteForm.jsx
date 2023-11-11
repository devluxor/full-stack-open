import Input from "./Input";

import { useField } from "../hooks";

const NoteForm = ({noteService}) => {
  const content = useField('text')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
    content.onChange()
  }

  return (
    <form onSubmit={handleNoteSubmit}>
      <Input {...content} />
      <button>create</button>
    </form>
  )
}

export default NoteForm