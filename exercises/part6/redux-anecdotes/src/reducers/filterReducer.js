import { createSlice } from "@reduxjs/toolkit"

const filterSlice = createSlice({
  name: 'filter',
  initialState: 'ALL',
  reducers: {
    filterReducer(state, action) {
      console.log(JSON.parse(JSON.stringify(state)))
      console.log(JSON.parse(JSON.stringify(action)))
      // // switch (action.type) {
      // //   case 'SET_FILTER': return action.payload
      // //   default: return state
      // // }
      return action.payload
    },

    // filterChange(filter) {
    //   console.log("🤖 ~ file: filterReducer.js:17 ~ filterChange ~ filter:", filter)
    //   // return {
    //   //   type: 'SET_FILTER',
    //   //   payload: filter,
    //   // }
    //   return filter
    // }      
  }
})

// const filterReducer = (state = 'ALL', action) => {
//   switch (action.type) {
//     case 'SET_FILTER':
//       return action.payload
//     default:
//       return state
//   }
// }

// export const filterChange = filter => {
//   return {
//     type: 'SET_FILTER',
//     payload: filter,
//   }
// }

// export const {filterReducer, filterChange} = filterSlice.actions

export default filterSlice.reducer