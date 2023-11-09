// import { filterReducer } from '../reducers/filterReducer'
import { useDispatch } from 'react-redux'

const AnecdoteFilter = () => {
  const dispatch = useDispatch() // gives access to the store.dispatch method

  return (
    <>
      <label htmlFor="filter-input">filter</label>
      <input
        type="text"
        placeholder="filter..."
        id="filter-input"
        onChange={e => dispatch({ type: 'filter/filterReducer', payload: e.target.value })}
      ></input>
    </>
  )
}

export default AnecdoteFilter