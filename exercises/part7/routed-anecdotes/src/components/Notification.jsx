const Notification = ({message}) => {
  if (!message) return
  return <p>{message}</p>
}

export default Notification