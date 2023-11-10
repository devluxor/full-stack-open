# React Query, useReducer and the context

## a few more different ways to manage the state of an application.


## React Query

React Query is a versatile library that, based on what we have already seen, simplifies the application. Does React Query make more complex state management solutions such as Redux unnecessary? No. React Query can partially replace the state of the application in some cases, but as the documentation states

React Query is a server-state library, responsible for managing asynchronous operations between your server and client
Redux, etc. are client-state libraries that can be used to store asynchronous data, albeit inefficiently when compared to a tool like React Query
So React Query is a library that maintains the server state in the frontend, i.e. acts as a cache for what is stored on the server. React Query simplifies the processing of data on the server, and can in some cases eliminate the need for data on the server to be saved in the frontend state.

Most React applications need not only a way to temporarily store the served data, but also some solution for how the rest of the frontend state (e.g. the state of forms or notifications) is handled.

## useReducer

So even if the application uses React Query, some kind of solution is usually needed to manage the rest of the frontend state (for example, the state of forms). Quite often, the state created with useState is a sufficient solution. Using Redux is of course possible, but there are other alternatives.

The hook useReducer provides a mechanism to create a state for an application. The parameter for creating a state is the reducer function that handles state changes, and the initial value of the state:

The reducer function that handles state changes is similar to Redux's reducers, i.e. the function gets as parameters the current state and the action that changes the state. The function returns the new state updated based on the type and possible contents of the action:

The function useReducer returns an array that contains an element to access the current value of the state (first element of the array), and a dispatch function (second element of the array) to change the state:

Using context for passing the state to components
If we want to split the application into several components, one solution would be to pass these as props in the usual way: The solution works, but is not optimal. If the component structure gets complicated, e.g. the dispatcher should be forwarded using props through many components to the components that need it, even though the components in between in the component tree do not need the dispatcher. This phenomenon is called prop drilling.

React's built-in Context API provides a solution for us. React's context is a kind of global state of the application, to which it is possible to give direct access to any component app.  Context lets the parent component make some information available to any component in the tree below it—no matter how deep—without passing it explicitly through props.

The context is created with React's hook createContext.


### tricks:

there are components that only use one of the two values returned by `useContext`: Some components only use the state value, others may just need the dispatch function. In that case, we can write two helpers that return only the needed value (custom hooks). For instance, in the file that defines the context:

```js
const CounterContext = createContext()

// ...

export const useCounterValue = () => {
  const counterAndDispatch = useContext(CounterContext)
  return counterAndDispatch[0]
}

export const useCounterDispatch = () => {
  const counterAndDispatch = useContext(CounterContext)
  return counterAndDispatch[1]
}

// ...
```

if the component just needs the dispatch function to change some data, we can write helpers that return another function with the needed dispatch function in its closure. For example:

```js
const reducer = (state, action) => {
  switch (action.type) {
    case "SET":
        return action.payload
    case "CLEAR":
        return null
    default:
        return state
  }
}

// ...

export const useNotify = () => {
  const valueAndDispatch = useContext(NotificationContext)
  const dispatch = valueAndDispatch[1]
  return (payload) => {
    dispatch({ type: 'SET', payload})
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)
  } 
}
```

Use:

```js
import { useNotify } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  // useNotify returns our function with the dispatch in its closure
  const notifyWith = useNotify()

  const doSomeAction = () => {
    // action

    // this function will be invoked with this
    // string argument along the dispatch function,
    // in this case, for a notification system
    notifyWith(`anecdote '${content}' created`)
  }
  // ...
}
// ...
```





## Which state management solution to choose?

In chapters 1-5, all state management of the application was done using React's hook useState. Asynchronous calls to the backend required the use of the useEffect hook in some situations. In principle, nothing else is needed.

A subtle problem with a solution based on a state created with the useState hook is that if some part of the application's state is needed by multiple components of the application, the state and the functions for manipulating it must be passed via props to all components that handle the state. Sometimes props need to be passed through multiple components, and the components along the way may not even be interested in the state in any way. This somewhat unpleasant phenomenon is called prop drilling.

Over the years, several alternative solutions have been developed for state management of React applications, which can be used to ease problematic situations (e.g. prop drilling). However, no solution has been "final", all have their own pros and cons, and new solutions are being developed all the time.

The situation may confuse a beginner and even an experienced web developer. Which solution should be used?

For a simple application, useState is certainly a good starting point. If the application is communicating with the server, the communication can be handled in the same way as in chapters 1-5, using the state of the application itself. Recently, however, it has become more common to move the communication and associated state management at least partially under the control of React Query (or some other similar library). If you are concerned about useState and the prop drilling it entails, using context may be a good option. There are also situations where it may make sense to handle some of the state with useState and some with contexts.

The most comprehensive and robust state management solution is Redux, which is a way to implement the so-called Flux architecture. Redux is slightly older than the solutions presented in this section. The rigidity of Redux has been the motivation for many new state management solutions, such as React's useReducer. Some of the criticisms of Redux's rigidity have already become obsolete thanks to the Redux Toolkit.

Over the years, there have also been other state management libraries developed that are similar to Redux, such as the newer entrant Recoil and the slightly older MobX. However, according to Npm trends, Redux still clearly dominates, and in fact seems to be increasing its lead:

graph showing redux growing in popularity over past 5 years

Also, Redux does not have to be used in its entirety in an application. It may make sense, for example, to manage the form state outside of Redux, especially in situations where the state of a form does not affect the rest of the application. It is also perfectly possible to use Redux and React Query together in the same application.

The question of which state management solution should be used is not at all straightforward. It is impossible to give a single correct answer. It is also likely that the selected state management solution may turn out to be suboptimal as the application grows to such an extent that the solution have to be changed even if the application has already been put into production use.