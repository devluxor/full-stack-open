# b: deploying to internet

## connecting frontend to backend

1. FRONTEND: change the `baseURL` in the `src/services/` modules:

2. BACKEND: Set up CORS:

    - execute `npm install cors` to install the Node's cors middleware
    - take the middleware to use and allow for requests from all origins:

      ```js
      const cors = require('cors')

      app.use(cors())
      ```

4. FRONTEND: set production build:

    - When the application is deployed, we must create a production build or a version of the application which is optimized for production.
    - A production build of applications created with Vite can be created with the command `npm run build`.
    - This creates a directory called `dist` (which contains the only HTML file of our application, `index.html` ) which contains the directory assets. Minified version of our application's JavaScript code will be generated in the `dist` directory. Even though the application code is in multiple files, all of the JavaScript will be minified into one file. All of the code from all of the application's dependencies will also be minified into this single file.
    - Copy the production build (the `dist` directory) from the FRONTEND to the root of the folder BACKEND and configure the backend to show the frontend's main page (the file dist/index.html) as its main page. To make Express show static content, the page `index.html` and the JavaScript, etc., it fetches, we need a built-in middleware from Express called `static`. We add

    ```js
    app.use(express.static('dist'))
    ```

    among the declaration of middlewares

    In consequence, whenever express gets an HTTP GET request it will first check if the `dist` directory contains a file corresponding to the request's address. If a correct file is found, express will return it.

    Now HTTP GET requests to the address www.serversaddress.com/index.html or www.serversaddress.com will show the React frontend. (The page of the single page web app). And GET requests to the address www.serversaddress.com/api/notes will be handled by the backend code.

5. FRONTEND: Because of our situation, both the frontend and the backend are at the same address, we can declare `baseURL` as a relative URL. This means we can leave out the part declaring the server in our `src/services/` module:

    ```js
    import axios from 'axios'
    const baseUrl = '/api/notes'

    const getAll = async () => {
      const request = axios.get(baseUrl)
      return request.data
    }
    ```

6. After each change in the FRONTEND, we have to create a new production build of the frontend and copy it to the root of the BACKEND. We can create our own scripts to do it in the BACKEND `package.json` file, for example:

```json
{
  // ...
  "scripts": {
    // ...
    "build:ui": "rm -rf dist && cd ../frontend && npm run build && cp -r dist ../backend",
  },
  // ... 
}
```

7. BACKEND: Choose platform: Fly.io, Render, Heroku, etc. Initialize it and configure it in your backend.

8. BACKEND: Add more scripts to the `package.json` file. For example:

      ```json
      {
        // ...
        "scripts": {
          // ...
          "build:ui": "rm -rf dist && cd ../frontend/ && npm run build && cp -r dist ../backend",
          "deploy": "fly deploy",
          "deploy:full": "npm run build:ui && npm run deploy",    
          "logs:prod": "fly logs"
        },
      }
      ```

9. FRONTEND: Changes on the FRONTEND have caused it to no longer work in development mode (when started with command npm run dev), as the connection to the BACKEND does not work. This is due to changing the BACKEND address to a relative URL (i.e.: `/api/notes`) in the `src/services` module. Because in development mode the FRONTEND is at the address localhost:5173, the requests to the BACKEND go to the wrong address localhost:5173/api/notes. The BACKEND is at localhost:3001. If the project was created with Vite, this problem is easy to solve. It is enough to add the following declaration to the `vite.config.js` file of the FRONTEND root folder:

      ```js
      import { defineConfig } from 'vite'
      import react from '@vitejs/plugin-react'

      // https://vitejs.dev/config/
      export default defineConfig({
        plugins: [react()],

        server: {
          proxy: {
            '/api': {
              target: 'http://localhost:3001',
              changeOrigin: true,
            },
          }
        },
      })
      ```

After a restart, the React development environment will work as a proxy. If the React code does an HTTP request to a server address at http://localhost:5173 not managed by the React application itself (i.e. when requests are not about fetching the CSS or JavaScript of the application), the request will be redirected to the server at http://localhost:3001.

Note that with the vite-configuration shown above, only requests that are made to paths starting with /api are redirected to the server.

## On deployment

A negative aspect of our approach is how complicated it is to deploy the frontend. Deploying a new version requires generating a new production build of the frontend and copying it to the backend repository. This makes creating an automated deployment pipeline more difficult. Deployment pipeline means an automated and controlled way to move the code from the computer of the developer through different tests and quality checks to the production environment. 

There are multiple ways to build a deployment pipeline, for example, placing both backend and frontend code in the same repository.

In some situations, it may be sensible to deploy the frontend code as its own application.

## Same origin policy and CORS

The Same-Origin Policy (SOP) and Cross-Origin Resource Sharing (CORS) are web security mechanisms that govern how web browsers control and protect resources (such as data and scripts) on web pages. These mechanisms are important for maintaining the security and privacy of web applications. Let's discuss each of them with real examples.

Same-Origin Policy (SOP):
The Same-Origin Policy is a fundamental security concept that restricts web pages from making requests to domains other than the one that served the web page. Under the SOP, web browsers enforce that web pages can only access resources (e.g., data, scripts, cookies) from the same origin, which is defined by the combination of protocol (HTTP or HTTPS), domain, and port.

For example, if a web page is loaded from https://example.com, it can make requests to resources from the same origin, such as https://example.com/data.json, but it cannot make requests to resources from a different origin, such as https://api.example2.com/data.json.

Cross-Origin Resource Sharing (CORS):
CORS is a mechanism that allows web servers to declare which origins are permitted to access resources on their server. It relaxes the Same-Origin Policy by enabling controlled cross-origin requests. Servers can include specific HTTP headers to indicate which origins are allowed to access their resources. These headers are checked by web browsers, which enforce the SOP.

Here's how CORS works with an example:

Let's say you have a web application hosted on https://app.example.com, and you want to make an API request to https://api.example2.com. To enable this request, api.example2.com must respond with appropriate CORS headers. For instance, the server may include the following headers in its response:

```bash
Access-Control-Allow-Origin: https://app.example.com
```

or 

```bash
Access-Control-Allow-Origin: *
```


With these headers, the browser will allow the web page at https://app.example.com to access resources on https://api.example2.com. If the server does not include these headers, the browser will block the request.

Why SOP and CORS Are Important:

- Security: The Same-Origin Policy is crucial for preventing unauthorized access to sensitive data from different domains. It helps protect users from cross-site request forgery (CSRF) and cross-site scripting (XSS) attacks.

- Privacy: SOP prevents websites from accessing the content of other websites, which helps maintain user privacy.

- Cross-Origin Communication: While SOP provides security, there are legitimate scenarios where web applications need to make cross-origin requests. CORS allows controlled cross-origin communication, ensuring that it is done securely and only with the server's consent.

- Web Services: Many modern web applications rely on third-party APIs and services. CORS enables these applications to interact with external servers and access the data and functionality they provide.

- Web Security Best Practices: Adhering to SOP and using CORS for cross-origin requests is considered a best practice for web security. It helps ensure that web applications do not expose users to unnecessary risks.

In summary, the Same-Origin Policy and CORS are essential for maintaining the security and privacy of web applications while still allowing controlled and secure cross-origin communication. They are fundamental concepts in web security, and web developers need to understand and implement them correctly to build secure and reliable web applications.
