import { useNavigate } from "react-router-dom"

import useField from "../hooks"

const CreateNew = (props) => {
  const navigate = useNavigate()

  const content = useField('text', 'content')
  const author = useField('text', 'author')
  const info = useField('text', 'info')

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/')
  }

  const resetFields = (e) => {
    e.preventDefault()
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <Input {...content} />
        </div>
        <div>
          author
          <Input {...author} />
        </div>
        <div>
          url for more info
          <Input {...info} />
        </div>
        <button type="submit">create</button>
        <button onClick={resetFields} >reset</button>
      </form>
    </div>
  )

}

const Input = ({name, value, type, onChange}) => {

  return (
    <input  
      name={name}
      value={value}
      type={type}
      onChange={e => onChange(e)}
    />
  )
} 

export default CreateNew