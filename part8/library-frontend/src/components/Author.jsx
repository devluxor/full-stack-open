const Author = ({author}) => {
  return (
    <tr key={author.name}>
      <td>{author.name}</td>
      <td>{author.born ?? 'Unknown'}</td>
      <td style={{textAlign: 'right'}}>{author.bookCount}</td>
    </tr>
  )
}

export default Author