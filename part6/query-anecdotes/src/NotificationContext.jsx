import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  if (action.type === 'CANCEL') return ''
  else return action.payload
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext