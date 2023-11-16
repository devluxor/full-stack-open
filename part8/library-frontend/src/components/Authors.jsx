import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'

import Author from './Author'
import SetBirthForm from './SetBirthForm'


const Authors = ({userLoggedIn}) => {
  const result = useQuery(ALL_AUTHORS)

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <>
      <div>
        <h2>Authors</h2>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Born</th>
              <th>Books</th>
            </tr>
            {result.data.allAuthors.map((author) =>  <Author key={author.name} author={author}/>)}
          </tbody>
        </table>
      </div>
      {userLoggedIn ? <SetBirthForm authors={result.data.allAuthors}/> : null}
    </>
  )
}



export default Authors
