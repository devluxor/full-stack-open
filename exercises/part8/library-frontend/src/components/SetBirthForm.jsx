import { useState, useEffect } from "react"
import { useMutation } from "@apollo/client"
import Select from 'react-select';
import { ALL_AUTHORS, UPDATE_BORN } from "../queries"

const SetBirthForm = ({authors}) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ updateBorn, result ] = useMutation(UPDATE_BORN, {
    refetchQueries: [
      {query: ALL_AUTHORS}
    ],
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      console.log(messages)
    }
  })

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.log('author not found') // !!
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()

    updateBorn({ variables: {  name, born: Number(born) }})

    setName('')
    setBorn('')
  }
  
  const authorOptions = authors.map(({name}) => {
    return  { value: name, label: name } 
  })

  return (
    <div style={{marginTop: 20}}>
      <form onSubmit={submit}>
        <div>
          <Select
            defaultValue={null}
            onChange={({value}) => setName(value)}
            options={authorOptions}
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">Update author</button>
      </form>
    </div>
  )
}

export default SetBirthForm