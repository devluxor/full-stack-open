# Basics of orchestration

## Context

Create app

Build for production ( turn the JavaScript code and CSS, into production-ready static files. )

Use a server for serving the static files (html, css, js files)

  - Use the `express.static` with Express. For instance, in the `app.js` file of a Node-Express app:

  ```js
  // ...
  app.use(express.static('dist'))
  // ...
  ```

  - Containerizing

## Containerization of React apps

- Begin writing in the `Dockerfile`:

```dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build
```

### Serve

A valid option for serving static files now that we already have Node in the container is `serve`.

> serve helps you serve a static site, single page application or just a static file (no matter if on your device or on the local network). It also provides a neat interface for listing the directory's contents:


The installation of `serve` turns into a RUN in the Dockerfile. This way the dependency is installed during the build process. The command to serve build directory will become the command to start the container:

```dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

RUN npm install -g serve

CMD ["serve", "build"]
# This could be CMD ["serve", "-s", "build", "-p", "3000"]
```

When we now build the image with `docker build . -t hello-front` and run it with `docker run -p 5001:3000 hello-front`, the app will be available in <http://localhost:5001>.

But there is a better option

### Using multiple stages

What is a multi-stage Docker build?

- A `Dockerfile` with multiple _stages_
- Every stage starts with a `FROM` statement
- Every stage generates its own container image (from scratch??? it seems that, in every stage, all files from previous stage are gone _EXCEPT THE ONES WE WANT TO COPY_ ???)
- By default, the image from the last stage is committed in the local registry.

We can:

- Filter data (avoid passing irrelevant data)
- Pass some data between stages

Basic usage:

- Define the first stage 
- Use an alias to reference the stage later 
- Copy files, perform build, etc. 
- Introduce a second `FROM` 
- Use a `COPY` statement with an additional option `--from=[previous stage name]`. With this option, we make sure that Docker will copy the generated (built) application data (via `npm run build` or equivalent) **from the previous stage, rather than the host file system**.

A good goal is to create Docker images so that they do not contain anything irrelevant. With a minimal number of dependencies, images are less likely to break or become vulnerable over time.

Multi-stage builds are designed for **splitting the build process into many separate stages, where it is possible to limit what parts of the image files are moved between the stages**. That opens possibilities for **limiting the size of the image since not all by-products of the build are necessary for the resulting image**. Smaller images are faster to upload and download and they help reduce the number of vulnerabilities your software may have.

With multi-stage builds, a tried and true solution like Nginx can be used to serve static files without a lot of headaches. The Docker Hub page for Nginx tells us the required info to open the ports and "Hosting some simple static content".

#### Use:

The `Dockerfile` is now:

```sh
# First stage: build-stage

# The first FROM is now a stage called build-stage
FROM node:16 AS build-stage
WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

# Secons stage:
# This is a new stage, everything before this is gone, except the files we want to COPY
FROM nginx:1.20-alpine

# COPY the directory `build` from build-stage (the previous stage) to /usr/share/nginx/html
# The target location here was found from the Docker hub page
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
```

We have declared two stages:

- A build stage
- A second stage: In this stage, only the relevant files of the first stage (the build directory, that contains the static content) are copied.

After we build it again, the image is ready to serve the static content. But, this time, will be smaller and leaner.

The default port will be 80 for Nginx, so something like `-p 8000:80` in the `run` command will work, so the parameters of the run command need to be changed a bit.

Multi-stage builds also include some **internal optimizations** that may affect your builds. As an example, multi-stage builds skip stages that are not used. If we wish to use a stage to replace a part of a build pipeline, like testing or notifications, we must pass some data to the following stages. In some cases this is justified: copy the code from the testing stage to the build stage. This ensures that you are building the tested code.

#### Testing as a use case for multi-stage builds

One interesting possibility to utilize multi-stage builds is to use a separate build stage for testing. If the testing stage fails, the whole build process will also fail. Note that it may not be the best idea to move all testing to be done during the building of an image, but there may be some containerization-related tests where it might be worth considering.

An example:

```sh
FROM node:16 AS test-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN CI=true npm test

FROM node:16 AS build-stage

COPY --from=test-stage /usr/src/app . 
## We copy the files from the test stage, not the host machine. 
## We are passing the data from one stage to another.
## If the tests fail, the image won't be built.

RUN npm ci

ENV REACT_APP_BACKEND_URL=http://localhost:3000/

RUN npm run build

CMD ["npm", "start"]
```

## Development in containers

Plausible reasons:

- To keep the environment similar between development and production to avoid bugs that appear only in the production environment
- To avoid differences between developers and their personal environments that lead to difficulties in application development
- To help new team members hop in by having them install container runtime - and requiring nothing else.

The tradeoff is that we may encounter some unconventional behavior when we aren't running the applications like we are used to. We will need to do at least two things to move the application to a container:

- Start the application in development mode
- Access the files with VS Code

### Basics

- Create a new `dev.Dockerfile` (During build the flag -f will be used to tell which file to use, it would otherwise default to Dockerfile, so the following command will build the image: `docker build -f ./dev.Dockerfile -t hello-front-dev .`)
- Access the files with VSCode. We have two options:
    - The Visual Studio Code Remote - Containers extension
    - Volumes, the same thing we used to preserve data with the database

#### With volumes:

Let's do a trial run with the flag `-v`, and if that works, then we will move the configuration to a `docker-compose` file. 

> VOLUME [is] (shared filesystems):
> `-v` or `-volume` with `HOST-SOURCE:CONTAINER-DESTINATION` : This bind mounts a volume.

To use the `-v`, we will need to tell it the current directory of our host machine.
We can use that as the left side for `-v` to map the current directory to the inside of the container or you can use the full directory path of your local machine:

```sh
docker run -p 3000:3000 -v "$(pwd):/usr/src/app/" hello-front-dev
```

Then we can create a `docker-compose.yml` file:

```yml
services:
  app:
    image: hello-front-dev
    build:
      context: . # The context will pick this directory as the "build context"
      dockerfile: dev.Dockerfile # This will simply tell which dockerfile to read
    volumes:
      - ./:/usr/src/app # The path can be relative, so ./ is enough to say "the same location as the docker-compose.yml"
    ports:
      - 3000:3000
    container_name: hello-front-dev # This will name the container hello-front-dev
```

With this configuration, docker compose up can run the application in development mode. You don't even need Node installed to develop it!

Installing new dependencies is a headache for a development setup like this. One of the better options is to install the new dependency inside the container. So instead of doing e.g. `npm install axios`, you have to do it in the running container e.g. `docker exec hello-front-dev npm install axios`, or add it to the `package.json` and `run docker build` again.

##### Communication between containers in a Docker network

The Docker Compose tool sets up a network between the containers (defined in the `docker-compose` file) and includes a DNS to easily connect two containers. 

We can add a new service to the `docker-compose` file as a test. We will use Busybox, "The Swiss Army Knife of Embedded Linux", a small executable with multiple tools. It can help us to debug our configurations.

We will use it to see that containers are inside a network and you can easily connect between them.

Add it to the `docker-compose` file:

```yaml
services:
  app:
  # ...

  debug-helper:
    image: busybox
```

With the wget tool included in Busybox, we can send a request from the debug-helper container to the other (which must be running, of course). The `wget` command equires the flag -O with - to output the response to the stdout:

```sh
docker compose run debug-helper wget -O - http://app:3000
```

The URL is the interesting part here. We simply said to connect to the port 3000 of the service app. The app is the name of the service specified in the `docker-compose.yml` file:

```yml
services:
  app: ## !!
    image: hello-front-dev
    build:
      context: .
      dockerfile: dev.Dockerfile
    volumes:
      - ./:/usr/src/app
    ports:
      - 3000:3000 ## !!
    container_name: hello-front-dev
  # ...
```

And the port used is the port from which the application is available in that container, also specified in the `docker-compose.yml`. The port does not need to be published for other services in the same network to be able to connect to it. The "ports" in the `docker-compose` file are only **for external access**.

If we change it like this:

```yml
services:
  app:
    # ...
    ports:
      - 3210:3000 # !!!
  # ...
```

After `docker compose up` the application will be available in http://localhost:3210 at the host machine, but the command `docker compose run debug-helper wget -O - http://app:3000` still works, since the port is still 3000 within the docker network. (Internal port)

![Image](https://fullstackopen.com/static/ecd3aa14ff1220e3f47ddd6b63116a48/efc6e/busybox_networking_drawio.png)

As the above image illustrates, docker `compose run` asks debug-helper to send the request within the network. While the browser in host machine sends the request from outside the network.

Don't forget to remove the debug helper and reset the ports after testing.

##### Run the backend from a development container 

We must:

- Create a `dev.Dockerfile` for creating the image for the container
- Create (or edit if it exists) a `docker-compose.dev.yml`

Example of `dev.Dockerfile`:

```sh
FROM node:16

WORKDIR /usr/src/app

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

# Starts backend in dev mode
CMD ["npm", "run", "dev"]
```

Example of `docker-compose.dev.yml`:

```yml
version: '3.8'

services:
  server:
    image: hello-back-dev
    container_name: hello-back-dev # This will name the container hello-back-dev
    build:
      context: . # The context will pick this directory as the "build context"
      dockerfile: dev.Dockerfile # This will simply tell which dockerfile to read
    volumes:
      - ./:/usr/src/app # The path can be relative, so ./ is enough to say "the same location as the docker-compose.yml"
    ports:
      - 3000:3000
    depends_on:
      - "mongo"
      - "redis"
    environment:
      - REDIS_URL=redis://redis:6379
      - MONGO_URL=mongodb://the_username:the_password@mongo:27017/the_database
  mongo:
    image: mongo
    ports:
      - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes: 
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - ./mongo_data:/data/db
  redis:
    image: redis
    ports: 
      - 6379:6379
    command: ['redis-server', '--appendonly', 'yes'] # Overwrite the CMD given by the redis image
    volumes: # Declare the volume
      - ./redis_data:/data
    
volumes:
  mongo_data:
```

The command to build and run the development container would be:

```sh
docker compose -f ./docker-compose.dev.yml up
```

Now we can access the backend!

## Communications between containers in a more ambitious environment

Next, we will add a reverse proxy to our docker-compose.yml. According to Wikipedia

>A reverse proxy is a type of proxy server that retrieves resources on behalf of a client from one or more servers. These resources are then returned to the client, appearing as if they originated from the reverse proxy server itself.

![Difference between a forward proxy and a reverse proxy](https://kinsta.com/wp-content/uploads/2020/08/Forward-Proxy-vs-Reverse-Proxy-Servers.png)

So in our case, the reverse proxy will be the single point of entry to our application, and the final goal will be to set both the React frontend and the Express backend behind the reverse proxy.

There are multiple different options for a reverse proxy implementation, such as Traefik, Caddy, Nginx, and Apache (ordered by initial release from newer to older).

Our pick is Nginx.

### Putting the frontend behind the reverse proxy as an example

Create a file `nginx.conf` in the project root 

Use this template as starting point (we will adjust it later):

```conf
# events is required, but defaults are ok
events { }

# A http server, listening at port 80
http {
  server {
    listen 80;

    # Requests starting with root (/) are handled
    location / {
      # The following 3 lines are required for the hot loading to work (websocket).
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      
      # Requests are directed to http://localhost:3000
      proxy_pass http://localhost:3000;
    }
  }
}
```

- Create an Nginx service in the `docker-compose.yml` file. Add a volume as instructed in the Docker Hub page where the right side is `:/etc/nginx/nginx.conf:ro`, the final `ro` declares that the volume will be read-only:

```yml
services:
  app:
    # ...
  nginx:
    image: nginx:1.20.1
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 8080:80
    container_name: reverse-proxy
    depends_on:
      - app # wait for the frontend container to be started
```

If we connect now to http://localhost:8080 we will see a familiar-looking page with 502 status: Bad Gateway

This is because directing requests to http://localhost:3000 leads to nowhere as the Nginx container does not have an application running in port 3000. By definition, localhost refers to the current computer used to access it. **With containers localhost is unique for each container, leading to the container itself.**

We can test this via `curl` to send a request to the application itself:

```sh
$ docker exec -it reverse-proxy bash  

root@374f9e62bfa8:/# curl http://localhost:80
  <html>
  <head><title>502 Bad Gateway</title></head>
  ...
```

To help us, Docker Compose set up a network when we ran docker compose up. It also added all of the containers in the docker-compose.yml to the network. A DNS makes sure we can find the other container. The containers are each given two names: the service name and the container name.

We can also test the DNS from within the container! Let's curl the service name (app) in port 3000:

```sh
root@374f9e62bfa8:/# curl http://app:3000
  <!DOCTYPE html>
  <html lang="en">
    <head>
    ...
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    ...
```

That means we have to replace the `proxy_pass` address in `nginx.conf`:

```conf
# events is required, but defaults are ok
events { }

# A http server, listening at port 80
http {
  server {
    # ...

    location / {
      # ...
      proxy_pass http://app:3000; # !!!
    }
  }
}
```

Remember that we have added the `app` dependency in `docker-compose.yml` to `app`. This  ensures that the `nginx` container is not started before the frontend container `app` is started.

If we do not enforce the starting order with depends_on there a risk that Nginx fails on startup since it tries to resolve all DNS names that are referred in the config file.

Note that depends_on does not guarantee that the service in the depended container is ready for action, it just ensures that the container has been started (and the corresponding entry is added to DNS). If a service needs to wait another service to become ready before the startup, other solutions should be used.

[See startup order in compose files.](https://docs.docker.com/compose/startup-order/)

### Putting the reverse proxy in front of both the frontend and the backend

- Create a parent folder for the backend and the frontend. For example:

```sh
app
├── frontend
├── backend
├── nginx.dev.conf
└── docker-compose.dev.yml
```

- Add the ngninx service, backend and frontend services, plus all others needed, to the `docker-compose.dev.yml`.

For example:

```yml
version: '3.8'

services:
  todo-backend: # we can also name it server
    image: todo-backend-dev
    container_name: todo-backend-dev
    build:
      context: . 
    volumes:
      - ./:/usr/src/app 
    ports:
      - 3000:3000
    environment:
      - REDIS_URL=redis://redis:6379
      - MONGO_URL=mongodb://the_username:the_password@mongo:27017/the_database

  todo-frontend: # we can also name it app
    image: todo-frontend-dev
    build:
      context: ./todo-frontend/
      dockerfile: dev.Dockerfile
    volumes:
      - ./todo-frontend/:/usr/src/app
  nginx:
    image: nginx:latest
    volumes: 
      - ./nginx.conf:/etc/nginx/nginx.conf:ro # the file must be ngninx.conf in server!!
    depends_on:
      - todo-frontend
    ports:
      - 8081:80
    container_name: reverse-proxy

# DB
mongo:
    image: mongo
    ports:
      - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes: 
      - ./todo-backend/mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - ./todo-backend/mongo_data:/data/db

# Auxiliar DB (i.e.: for caching, etc.)
  redis:
    image: redis
    ports: 
      - 6379:6379
    command: ['redis-server', '--appendonly', 'yes'] # Overwrite the CMD in the redis image
    volumes: # Declare the volume
      - ./todo-backend/redis_data:/data

volumes:
  mongo_data:
```


![Image](https://fullstackopen.com/static/a5c3b8d70abca3569ed532e053af7bc7/15d25/ex_12_16_nginx_front.png)

- To add the backend, we need to add a new location to the `nginx.conf` so that requests to `/api` are proxied to the backend. Following these examples:

```conf
# events is required, but defaults are ok
events { }

# A http server, listening at port 80
http {
  server {
    listen 80;

    # Requests starting with root (/) are handled
    location / {
      # The following 3 lines are required for the hot loading to work (websocket).
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      
      # Requests are directed to http://localhost:3000
      proxy_pass http://todo-frontend:3000;
    }

    # Requests starting with /api/ are handled
    location /api/ {
      proxy_pass http://todo-backend:3000/;
    }
  }
}
```

#### Important note about the `proxy_pass` directive

The proxy_pass directive has an interesting feature with a trailing slash. As we are using the path `/api` for `location` (we can't use the same `location` twice, as I understand), but the backend application only answers to URLs with paths `/` or `/todos` (the server does not have any `/api/*` route) we want the `/api` to be removed from the request. In other words, even though the browser will send a GET request to `/api/todos/1` we want the Nginx to proxy the request to `/todos/1`. Do this by adding a trailing slash / to the URL at the end of `proxy_pass` 

#### Important remarks

It is essential to understand where the React app is actually run. The above figure might give the impression that React app is run in the container but it is totally wrong.

It is just the React app source code that is in the container. When the browser hits the address http://localhost:8080 (assuming that you set up Nginx to be accessed in port 8080), the React source code gets downloaded from the container to the browser:

![Image](https://fullstackopen.com/static/77b99e85166ce2271fd108b320628c14/3ebb1/nginx-setup.png)

Next, the browser starts executing the React app, and all the requests it makes to the backend should be done through the Nginx reverse proxy:

![Image](https://fullstackopen.com/static/5c2e45fa07a35a51f5e7ec209d497690/92e00/nginx-setup2.png)

Note that the app will work  even if no exposed port are defined for the backend and frontend in the docker compose file.

We just need to expose the Nginx port to the host machine since the access to the backend and frontend is proxied to the right container port by Nginx. Because Nginx, frontend and backend are defined in the same Docker compose configuration, Docker puts those to the same Docker network and thanks to that, Nginx has direct access to frontend and backend containers ports.

## Tools for production

Containers are fun tools to use in development, but the best use case for them is in the production environment. There are many more powerful tools than Docker Compose to run containers in production.

Heavyweight container orchestration tools like **Kubernetes** allow us to manage containers on a completely new level. These tools hide away the physical machines and allow us, the developers, to worry less about the infrastructure.

