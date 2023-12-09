import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      console.log("🤖 ~ file: LoginForm.jsx:12 ~ LoginForm ~ error:", error)
    }
  })


  useEffect(() => {
    if ( result.data ) { // if response after entering credentials not null (valid)
      const token = result.data.login.value 
      setToken(token) // save token in app state
      localStorage.setItem('library-user-token', token) // store token in client
    }
  }, [result.data, setToken])

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
