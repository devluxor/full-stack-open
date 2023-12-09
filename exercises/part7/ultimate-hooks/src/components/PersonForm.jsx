import { useField } from "../hooks"

import Input from "./Input"

const PersonForm = ({personService}) => {
  const name = useField('text')
  const number = useField('text')

  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
    name.onChange()
    number.onChange()
  }

  return (
    <form onSubmit={handlePersonSubmit}>
      name <Input {...name} /> <br/>
      number <Input {...number} />
      <button>create</button>
    </form>
  )
}

export default PersonForm