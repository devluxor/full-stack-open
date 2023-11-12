# Flux arquitecture and Redux

## Flux-architecture

Already years ago Facebook developed the Flux-architecture to make state management of React apps easier. In Flux, the state is separated from the React components and into its own stores. State in the store is not changed directly, but with different actions.

When an action changes the state of the store, the views are rerendered:

![Flux-architecture](https://fullstackopen.com/static/165b40470776ac449f8b9604d4828004/5a190/flux1.png)

If some action on the application, for example pushing a button, causes the need to change the state, the change is made with an action. This causes re-rendering the view (a React component) again:

![Flux-architecture-action](https://fullstackopen.com/static/7bf90479b6757c7af3b9a9f0e7f19a64/5a190/flux2.png)

Flux offers a standard way for how and where the application's state is kept and how it is modified.

## Flux

Facebook has an implementation for Flux, but we will be using the Redux - library. It works with the same principle but is a bit simpler. Facebook also uses Redux now instead of their original Flux.

As in Flux, in Redux the state is also stored in a **store**.

The whole state of the application is stored in one JavaScript object in the store. If the state was more complicated, different things in the state would be saved as separate fields of the object. The state of the store is changed with **actions**. Actions are objects, which have at least a field determining the type of the action. The general convention is that actions have exactly two fields, type telling the type and payload containing the data included with the Action.

```js
{
  type: 'NEW_NOTE',
  payload: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
}
```

If there is data involved with the action, other fields can be declared as needed. The impact of the action to the state of the application is defined using a **reducer**. In practice, a reducer is a function that is given the current state and an action as parameters. It returns a new state.

Reducer is never supposed to be called directly from the application's code. Reducer is only given as a parameter to the `createStore` function which creates the store:

```js
import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  // ...
}

const store = createStore(counterReducer)
```

The store now uses the reducer to handle actions, which are dispatched or 'sent' to the store with its `dispatch` method.

```js
store.dispatch({ type: 'INCREMENT' })
```

You can find out the state of the store using the method `getState`.

The third important method the store has is `subscribe`, which is used to create callback functions the store calls whenever an action is dispatched to the store.

## Pure functions, immutable

basic assumption of Redux reducer that reducers must be pure functions. A pure function is a function that has the following properties:

- the function return values are identical for identical arguments (no variation with local static variables, non-local variables, mutable reference arguments or input streams), and
- the function has no side effects (no mutation of local static variables, non-local variables, mutable reference arguments or input/output streams).

A reducer state must be composed of immutable objects. If there is a change in the state, the old object is not changed, but it is replaced with a new, changed, object. 

## Uncontrolled form

If we have not bound the state of the form fields to the state of the App component, React calls this kind of form **uncontrolled**.

> Uncontrolled forms have certain limitations (for example, dynamic error messages or disabling the submit button based on input are not possible).

## Action creators

React components don't need to know the Redux action types and forms. We should separate creating actions into separate functions:

Functions that create actions are called action creators.

## Forwarding Redux Store to various components: React-Redux

We should separate App into its module.

How can the App access the store after the move? And more broadly, when a component is composed of many smaller components, there must be a way for all the components to access the store. There are multiple ways to share the Redux store with components. First, we will look into the newest, and possibly the easiest way is using the hooks API of the react-redux library.

## Presentational components:

This components are very simple, unaware that the event handler they get as props dispatches an action. Usually they render a single element in a list of elements, for instance.