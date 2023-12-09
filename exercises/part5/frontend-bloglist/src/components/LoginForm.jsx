import { useState } from 'react'

const LoginForm = ({ loginUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = async (event) => {
    event.preventDefault()
    const success = await loginUser(username, password)

    if (success) {
      setUsername('')
      setPassword('')
    } else setPassword('')
  }

  return (
    <form onSubmit={login}>
      <div>
        username
        <input
          id='login-username-input'
          type="text"
          value={username}
          name="Username"
          placeholder='User...'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='login-password-input'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">log in</button>
    </form>
  )
}

export default LoginForm