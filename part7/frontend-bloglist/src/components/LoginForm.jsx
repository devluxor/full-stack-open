import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { logUser } from '../reducers/userReducer'
import { setNotification } from '../reducers/notificationReducer'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const login = async (event) => {
    event.preventDefault()

    try {
      await dispatch(logUser({ username, password }))
      setUsername('')
      setPassword('')
    } catch (e){
      dispatch(setNotification({ type: 'fail', message: 'Wrong credentials' }))
      setPassword('')
    }
  }

  return (
    <form onSubmit={login}>
      <div>
        username
        <input
          id="login-username-input"
          type="text"
          value={username}
          name="Username"
          placeholder="User..."
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="login-password-input"
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
