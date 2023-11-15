import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook' 
import Navbar from './components/Navbar'

import { Route, Routes } from 'react-router-dom'


const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
          <Route path='/authors'  element={< Authors/>}/>
          <Route path='/books'    element={< Books/>}/>
          <Route path='/new_book' element={< NewBook/>}/>
          <Route path='/' element={< Books/>}/>
      </Routes>
    </div>
  )
}



export default App
