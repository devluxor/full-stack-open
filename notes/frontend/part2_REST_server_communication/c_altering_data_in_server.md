# Altering data in server

## REST 

REST, which stands for Representational State Transfer, is an architectural style for designing networked applications. It's not a specific technology or protocol but rather a set of principles and constraints for building web services. REST is often used in the context of web APIs (Application Programming Interfaces) to enable communication between different software systems over the internet.

Key principles and concepts of REST include:

1. Resources: In REST, everything is considered a resource, which can be an object, data, or even a service. Resources are identified by unique URLs (Uniform Resource Locators). For example, a web service might have resources like "users," "products," or "orders."

2. HTTP Methods: REST relies on the standard HTTP methods for performing operations on resources, which are typically CRUD (Create, Read, Update, Delete) operations:

- GET: Retrieve data from a resource.
- POST: Create a new resource.
- PUT: Update an existing resource.
- DELETE: Remove a resource.
These HTTP methods are used to indicate the intent of the client in interacting with a resource.

3. Stateless: RESTful services are stateless, meaning that each request from a client to the server must contain all the necessary information for the server to understand and process the request. There should be no reliance on the server's state between requests. The reason for this is that the HTTP protocol is stateless.

4. Representations: Resources can have multiple representations, such as JSON, XML, HTML, or others. Clients can specify their preferred representation using the "Accept" header in the HTTP request.

5. Uniform Interface: REST encourages a uniform and consistent interface for interacting with resources. This simplifies client-server interactions by following well-defined conventions.

6. Statelessness: Each request from a client to a server must contain all the information necessary to understand and process the request. The server should not rely on any information from previous requests.

7. Client-Server Separation: REST promotes a clear separation between the client and server, allowing them to evolve independently. This separation can lead to a more scalable and modular system.

8. Layered System: REST supports a layered architecture where different components (e.g., proxies, load balancers) can be added to the system without affecting the overall system's behavior. This promotes scalability and flexibility.

9. Self-descriptive Messages: Responses from the server should include enough information for the client to understand how to process the data, typically through the use of standard HTTP headers.

RESTful APIs are commonly used in web development to create services that allow different software systems to communicate over the internet in a simple, scalable, and standardized way. These principles make it easier for developers to build and maintain web services and for clients to consume them.

For example, in a simple Note web app, this would be the routes we should implement:

| URL  |	verb 	| functionality |
| --- | --- | --- |
| notes	| GET	| fetches all resources in the collection |
| notes/10 | 	GET	| fetches a single resource |
| notes	| POST |	creates a new resource based on the request data |
| notes/10 |	DELETE |	removes the identified resource |
| notes/10 |	PUT	| replaces the entire identified resource with the request data |
| notes/10 |	PATCH	| replaces a part of the identified resource with the request data |

## Extracting Communication with the Backend into a Separate Module

In the spirit of the single responsibility principle, we should extract this communication into its own module in the `src/services/` folder, which returns an object to interact with the server following the REST model:

For example:

```js
import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/whatever'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  const response.data
}

const delete = async (id, newObject) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

export default { 
  getAll, 
  create, 
  update,
  delete
}
```