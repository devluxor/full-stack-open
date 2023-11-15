
import { Link } from 'react-router-dom'

const Navbar = () => {
  
  const padding = {
    padding: 5,
  }

  return (
    <div style={{marginBottom: 20}}>
      <span style={padding}><strong>Libary app</strong></span>
      <Link style={padding} to="/authors">Authors</Link>
      <Link style={padding} to="/books">Books</Link>
      <Link style={padding} to="/new_book">New Book</Link>
    </div>
  )
}

export default Navbar