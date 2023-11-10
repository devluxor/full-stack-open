# React Query, useReducer and the context

## a few more different ways to manage the state of an application.


## React Query

React Query is a versatile library that, based on what we have already seen, simplifies the application. Does React Query make more complex state management solutions such as Redux unnecessary? No. React Query can partially replace the state of the application in some cases, but as the documentation states

React Query is a server-state library, responsible for managing asynchronous operations between your server and client
Redux, etc. are client-state libraries that can be used to store asynchronous data, albeit inefficiently when compared to a tool like React Query
So React Query is a library that maintains the server state in the frontend, i.e. acts as a cache for what is stored on the server. React Query simplifies the processing of data on the server, and can in some cases eliminate the need for data on the server to be saved in the frontend state.

Most React applications need not only a way to temporarily store the served data, but also some solution for how the rest of the frontend state (e.g. the state of forms or notifications) is handled.

