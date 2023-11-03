import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null // private variable to this module

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createBlog = async (newBlog) => {
  // send request with token (create config object)
  // return data in response
  const config = { headers: { 
    Authorization: token 
  }}

  try {
    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
  } catch(e) {
    throw Error(e)
  }
}

export default { getAll, setToken, createBlog}