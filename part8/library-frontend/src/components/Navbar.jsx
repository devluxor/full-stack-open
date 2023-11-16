
import { Link } from 'react-router-dom'
import Recommendations from './Recommendations'

const Navbar = ({userLoggedIn,logout}) => {
  const padding = {
    padding: 5,
  }

  return (
    <div style={{marginBottom: 20}}>
      <span style={padding}><strong>Libary app</strong></span>
      <Link style={padding} to="/authors">Authors</Link>
      <Link style={padding} to="/books">Books</Link>
      {userLoggedIn ?
        <>
          <Link style={padding} to="/new_book">New Book</Link>
          <Link style={padding} to="/recommendations">Recommendations</Link>
          <button onClick={logout}>Logout</button>
        </>
        : <Link style={padding} to="/login">Login</Link>
      }
    </div>
  )
}

export default Navbar