import axios from 'axios'
const baseUrl = '/api/users'

const getUsers = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getUser = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

export default { getUsers, getUser }