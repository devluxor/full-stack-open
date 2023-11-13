import { useSelector } from "react-redux"

const Notification = () => {
  const notification = useSelector(({notification}) => notification )

  if (!notification) return

  return (
    <div className={`notification ${notification.type}`}>
      {notification.message}
    </div>
  )
}

export default Notification