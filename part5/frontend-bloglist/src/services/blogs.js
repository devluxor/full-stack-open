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
  const config = { headers: {
    Authorization: token
  } }

  try {
    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
  } catch(e) {
    throw Error(e)
  }
}

const updateBlog = async (blog) => {
  const blogId = blog.id || blog._id
  try {
    const response = await axios.put(`${baseUrl}/${blogId}`, blog)
    return response.data
  } catch (e) {
    throw Error(e)
  }
}

const deleteBlog = async (blog) => {
  const config = { headers: {
    Authorization: token
  } }

  const blogId = blog.id || blog._id
  try {
    const response = await axios.delete(`${baseUrl}/${blogId}`, config)
    return response.data
  } catch (e) {
    throw Error(e)
  }
}

export default { getAll, setToken, createBlog, updateBlog, deleteBlog }