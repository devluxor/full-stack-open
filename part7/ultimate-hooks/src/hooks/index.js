import { useState, useEffect } from "react"
import axios from "axios"

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    if (!event) {
      setValue('')
      return
    }

    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios.get(baseUrl)
         .then(r => setResources(r.data))
         .catch(e => console.log(e.message))
  }, [baseUrl])

  const create = async (resource) => {
    try {
      const response = await axios.post(baseUrl, resource)
      setResources(resources.concat(response.data))
      return response.data
    } catch (e) {
      console.log(e)
    }
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}

export {
  useField,
  useResource
}