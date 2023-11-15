const Book = ({book}) => {
  return (
    <tr key={book.title}>
      <td>{book.title}</td>
      <td>{book.author}</td>
      <td style={{textAlign: 'right'}} >{book.published}</td>
    </tr>
  )
}

export default Book