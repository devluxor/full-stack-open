import userService from "../services/users"
import { useState, useEffect } from "react"

const UserDetails = ({userDetails}) => {
  const id = userDetails.id
  
  const [user, setUser] = useState(null)
  useEffect(() => {
    userService.getUser(id).then(u => setUser(u))
  },[id])
  
  if (!user) return

  return (
    <>
      <h2>{user.name ?? 'Unknown'}</h2>
      <h4>added blogs</h4>
      <ul>
        {user.blogs.map(b => <li key={b.id}>{b.title}</li>)}
      </ul>
    </>
  )
}

export default UserDetails