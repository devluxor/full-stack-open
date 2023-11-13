import { useState, useEffect } from "react";
import userService from "../services/users";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getUsers().then(u => setUsers(u))
  }, [])

  return (
    <table>
      <thead>
        <tr>
          <th>User name</th>
          <th>Blogs Created</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => {
          return (
            <User key={user.id} user={user}/>
          )
        })}
      </tbody>
    </table>
  )
}

const User = ({user}) => {
  return (
    <tr>
      <td><Link to={`/users/${user.id}`} >{user.name ?? 'Unknown'}</Link></td>
      <td style={{textAlign: 'right'}}>{user.blogs.length}</td>
    </tr>
  )
}

export default Users