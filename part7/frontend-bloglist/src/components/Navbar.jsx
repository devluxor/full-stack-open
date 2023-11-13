import { Link } from 'react-router-dom'

const padding = {
  padding: 5
}
const Navbar = ({ user, handleLogout }) => {
  return (
    <div>
      <Link style={padding} to="/">home</Link>
      <Link style={padding} to="/users">users</Link>
      <p style={{ display: 'inline-block' }}>{user.name} logged in</p>
      <button style={{ display: 'inline-block' }} onClick={handleLogout}>logout</button>
    </div>
  )
}

export default Navbar