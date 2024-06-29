# Containers Quick Reference Guide


- Docker is a set of products that help us to manage images and containers. 
- **Images** include all the code, dependencies and instructions on how to run the application. Images can be build upon other images; for example, use an image `node` as the base for another image: this will create a new image that has: a base, other files (our application) + instructions.
- **Containers** package software into standardized units
- For managing the Docker containers, there is also a tool called **Docker Compose** that allows one to orchestrate (control) multiple containers at the same time.
- **Dockerfile** is a simple text file that contains all the instructions for creating an image from a directory. This File is generally in the root directory of the application.

## Guide for People In a Rush: TODO

 - What is an Image
 - What is a container
 - What is Docker

- We use Docker commands to:
    - Create images from a project or part or a project (i.e.: frontend and backend)
    - (Images can be created from other images as bases; for example, we can create a new image based on other image we downloaded, but adding new files.)
    - Run images: in order to interact with images (images are immutable), we need to _actualize_ them by creating containers from them. (Most of the time, we will work with containers). Then we run the containers (according the instructions given in the `Dockerfile` that we used to create the image)
    - Interact with containers: we can debug by gaining access to containers during execution. For example, we can run commands on a bash terminal within them.
 
### Basic Containerization Routine

- Define `Dockerfile` for backend
- Define `Dockerfile` for frontend

(we can define different images for different environments (development, testing, production))
(we can run, for example, backend outside a container and frontend inside)
(During development, it can be useful to containerize some parts of the application)
(It is possible to containerize _every_ part of the app (like frontend, backend, database, auxiliary database, debugger, even more))

- If we want to _orchestrate_ (manage multiple containers at the same time, for example, to define a development or production environment), we use Docker Compose. In this file, each container is defined as a _service_. This tool works thanks to a common `docker-compose.yml` file in which we define which containers will be used for the project: their names, their connections, etc. There will be a common local network between containers ran this way, so they can communicate with themselves, and, at the same time, with other external networks (like Internet)

- Docker compose will by itself create containers from images and run them, according the instructions in the `docker-compose.yml` file. There can be more than one `docker-compose` file for a single project (for example, one for production, other for development, etc.). We use it by simple entering something like `docker compose up` in the same folder where a `docker-compose` is.

- One simple case for orchestrating different containers could be:
    - One container ran (a process, a service) for the frontend
    - One container ran (a process, a service) for the backend
    - Maybe others, like a database or auxiliary databases for caches, etc.
    - One container ran (a process, a service) for a proxy.

- We execute a docker compose command and these processes are started. When we visit the proxy's external address, we've set up the orchestration in the way he serves us a frontend (a  container running) able to communicate internally with the backend (another container), giving the appearance that it is the proxy who's serving us, while in reality it's all based on an internal orchestration thanks to a `docker-compose` file (and others, for example, `nginx.conf` for the proxy).

- This is very important for deployment (projects are deployed to platforms as images that the server will run).

- Kubernetes is a powerful tool in this field.

## Basic Docker commands

### Summary (Most used commands)

|command|explain|shorthand|
|--- |--- |--- |
|`docker image ls`|Lists all images|`docker images`|
|`docker image rm <image>`|Removes an image|`docker rmi`|
|`docker image pull <image>`|Pulls image from a docker registry|`docker pull`|
|`docker container ls -a`|Lists all containers|`docker ps -a`|
|`docker container run <image>`|Runs a container from an image|`docker run`|
|`docker container rm <container>`|Removes a container|`docker rm`|
|`docker container stop <container>`|Stops a container|`docker stop`|
|`docker container exec <container>`|Executes a command inside the container|`docker exec`|

### `run` (aka `container run`)

> Docker runs processes in isolated containers. A container is a process which runs on a host. The host may be local or remote. When an operator executes docker run, the container process that runs is isolated in that it has its own file system, its own networking, and its own isolated process tree separate from the host.

The `docker run` command is used to create and run a Docker container based on a specific Docker image. This command is a fundamental part of working with Docker containers. The `docker run` command must specify an `IMAGE` to create the container from. The command structure is the following: 

```bash
docker container run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

This tells Docker to create a container from an image, and run a command within it. It can run a container even if the image to run is not downloaded on our device yet. In this case, The Docker daemon will pull the "hello-world" image from the Docker Hub.

#### Important flags:

`-it`: make sure we can interact with the container. (Interactive: keep STDIN open; tty: allocate a pseudo-TTY). Add `-a` or `-all` to list containers that have already been exited. `docker container ls` has a shorter alias `docker ps`.

`--name`: We can give a name to the container.

`-p`: will inform Docker that a port from the host machine should be opened and directed to a port in the container. The format for `-p` is `host-port:application-port`. For example:

```sh
docker run -p 3123:3000 IMAGE_NAME
```

Other Example:

```bash
docker run -it IMAGE_NAME bash
```

In this case the last `bash` is the command that will override the default command defined in `CMD` in the `Dockerfile` used to build the image.

`-rm`: will remove the container after execution.

`-d`: With some containers the command line appears to freeze after pulling and starting the container. This might be because that particular container is now running in the current terminal, blocking the input. You can observe this with `docker container ls` from another terminal. In this situation one can exit by pressing control + c and try again with the `-d` flag. he -d flag starts a container detached, meaning that it runs in the background. 


### `start`

Dockers can be referred by its `CONTAINER ID`, by the first characters of its `CONTAINER ID`, or by its given name, like `hopeful_clark` or `throbbing_gristle`

We can start stopped containers with:

```bash
docker start [options] CONTAINER-ID-OR-CONTAINER-NAME
```

#### Important flags:


`-i`: the flag `--interactive` or `-i` makes we are able to interact with the container.

### `kill`

sends a signal `SIGKILL` to the process that is running the container forcing it to exit, and that causes the container to stop. We can check it's status with `container ls -a`

```sh
docker kill container
```

### `commit`

This command

```sh
docker commit CONTAINER-ID-OR-CONTAINER-NAME NEW-IMAGE-NAME
```

Will create a new image that includes the changes we may have made to the container. You can use `container diff` to check for the changes between the original image and container before doing so.

## The `Dockerfile`

A Dockerfile is a script used to create a Docker container image.

- Create a file `Dockerfile` in the root of the project.
- Set instructions. For example:

```dockerfile
FROM node:16 # the base for the image

WORKDIR /usr/src/app # sets a working directory in the container for our application so we don't interfere with the contents of the image. If the directory doesn't exist in the base image, it will be automatically created.

COPY . . #  will copy the current directory from the host machine to the directory with the same name in the image. It will create a new directory if it does not exist.

COPY --chown=node:node . . 

RUN npm ci --only-production # commands run before the execution of CMD. In Node-based applications, npm ci is better than npm install. In development mode, we need to use npm install

ENV DEBUG=true # with Dockerfiles we can use the instruction ENV to set environment variables.

EXPOSE 3000 # We could need to expose certain ports

USER node # The first COPY and this instruction makes the application to run as a non-root (less prileges) user. This is very important for safety reasons.

CMD node index.js # the default command that the image will execute in the working directory. It can then be overwritten with the parameter given after the image name.
```

## Creating an image of our project and running it

- We now can use the command `docker build` to create an image based on the `Dockerfile`.
- We should add a `-t` flat that will help us to name the image:

Format:

```sh
docker build [OPTIONS] PATH
```

Example:

```sh
docker build -t fs-hello-world .
## This translates to:
## "Docker please build this image with a tag fs-hello-world via the Dockerfile 
## in this directory". 
## You can point to any Dockerfile, but here the dot means the Dockerfile in the current
## directory from which we execute the command.
```

- Then we need to run the image with `run`:

```sh
docker run -p 3000:3000 fs-hello-world
```

The default command, defined by the `CMD` in the `Dockerfile`, can be overridden if needed. We could e.g. open a bash session to the container and observe its content:

```sh
docker run -it fs-hello-world bash
```

### Manual operation:

We have to perform two operations: creating the image with `build` and running the image (by creating a container) via `run`. For example:

```sh
docker build -t express-server . && docker run -p 3000:3000 express-server
```

Having to write two commands is cumbersome. `docker compose` offers a better alternative.

## `docker compose`

Docker Compose is a tool for defining and running multi-container Docker applications. With Docker Compose, you can define a multi-container application in a single file, called `docker-compose.yml` or `docker-compose.dev.yml` (or similar), and use a set of simple commands to create and manage the entire application stack.

### Basics:

1. **(`docker-compose.yml`):** This file is used to define the services, networks, and volumes that make up your Docker application. It specifies how the containers should be built, configured, and connected.

   Example `docker-compose.yml` file:

   ```yaml
   version: '3.8'

   services:
     app:                    # The name of the service, can be anything
       image: express-server # Declares which image to use
       build: .              # Declares where to build if image is not found
       ports:                # Declares the ports to publish
         - 3000:3000
      other:
        image: nginx
        ports:
          - "8080:80"
      mongo:
        image: mongo         # If we don't have the image locally, it will download it
        ports:
          - 3456:27017
        environment:
          MONGO_INITDB_ROOT_USERNAME: root
          MONGO_INITDB_ROOT_PASSWORD: example
          MONGO_INITDB_DATABASE: the_database
          # These variables, used in conjunction, create a new user and set that user's password. 
          # This user is created in the admin authentication database and given the role of root,
          # which is a "superuser" role.
          # The last environment variable MONGO_INITDB_DATABASE will tell MongoDB to create a
          # database with that name.
   ```

   In this example, there are three services defined (`app`, `other` and `mongo`), each based on a different Docker images.

2. **Service:** A service is a containerized application component defined in the `docker-compose.yml` file. Each service can have its own configuration, such as the Docker image, environment variables, ports to expose, and more.

3. **Environment Variables and Overrides:** Docker Compose allows you to use environment variables in the `docker-compose.yml` file and override them with a separate `.env` file or environment variables defined in the shell.

4. **Scaling:** You can easily scale services by specifying the desired number of replicas in the `docker-compose.yml` file.

Docker Compose simplifies the process of managing complex, multi-container applications, making it easier to develop, test, and deploy applications that consist of multiple interconnected services. It is particularly useful for local development environments and can be a valuable tool in a continuous integration/continuous deployment (CI/CD) pipeline.

#### Commands:

- `docker compose up`: Creates and starts the containers defined in the `docker-compose.yml` file. Of the current directory. If we want to rebuild the images we can use `docker compose up --build`. We can use `docker compose -f [filename] up` to specify a file to run the Docker Compose command with. You can also run the application in the background with `docker compose up -d` (`-d` for detached). 
- `docker compose down`: Stops and removes the containers, networks, and volumes created by `up`.
- `docker compose ps`: Lists the containers associated with the project.
- `docker compose logs`: Displays log output from the containers. For example, `docker compose -f docker-compose.dev.yml logs -f`. `-f` will ensure we follow the logs.
- `docker compose exec`: Runs a command in a running container.

#### One idea and use case:

During development, we can containerize some parts of it (like a Mongo db in our example); we do not want to run the application inside a container. It is not the best option to move the entire development environment into a container. Developing while the application itself is inside a container is a challenge, but it's possible.

Once we have the container running in the background with `docker compose -f docker-compose.dev.yml logs -f`, we can begin developing the app locally.

## Binding Mounts

Imagine we need a file to be executed to, for instance, initialize a database with some data (the mongo image needs to be initialized under certain conditions, among them, the execution of a `.js` file). But that file is _outside_ the image `mongo` that created the container with our Mongo database, and we need some way to _get it_ inside the container.

We have two options: we could 

- Create a new image `FROM` `mongo`(use `mongo` as the base of a new image) and `COPY` the file that initializes the database. 
- Use a **bind mount** to _mount_ the file to the container created from the image `mongo`. 

Bind mount is the act of binding or linking a file (or directory) on the host machine to a file (or directory) in the container. A bind mount is done by adding a `-v` flag with `container run`. The syntax is `-v FILE-IN-HOST:FILE-IN-CONTAINER`.

When using Docker Compose, the bind mount is declared under key `volumes` in the `docker-compose-yml` file, with the same format, for example:

```yml
  mongo:
      # ...
    volumes: 
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
```

Here, `./mongo/mongo-init.js` is the file that will initialize the database stored in our local machine. `:` separates the address of this file in our machine from the bound file in the container, `docker-entrypoint-initdb.d/mongo-init.js`

> The result of the bind mount is that the file `mongo-init.js` in the mongo folder of the host machine is the same as the `mongo-init.js` file in the container's `/docker-entrypoint-initdb.d` directory. Changes to either file will be available in the other. We don't need to make any changes during runtime. But this will be the key to software development in containers.

## Persisting the data with volumes

By default, containers are not going to preserve our data. When we close the containers you may or may not be able to get the data back. For example, the developers who made the `mongo` image defined a volume to be used, so data will be preserved (thanks to a line of `VOLUME /data/db /data/configdb` in the `Dockerfile` used to build the `mongo` image)

There are two distinct methods to store the data:

- Declaring a location in your local machine (called [bind mount](#binding-mounts); remember bind mounts imply binding a local file in the host machine with another in the container)
- Letting Docker decide where to store the data (**volume**)

### Named volumes

Add a named volume as a key under `volumes:` in the `docker-compose.yml` file:

```yml
services:
  # ...

volumes:
  mongo_data:
```

Now the volume is created but managed by Docker. 

#### Commands:

After starting the application (like with `docker compose -f docker-compose.dev.yml up`) you can list the volumes with `docker volume ls`, inspect one of them with `docker volume inspect` and even delete them with `docker volume rm`.

## `exec`

The Docker `command exec` is very useful for debugging. It can be used to jump right into a container when it's running.

Example of use case:

1. A container is running, listening on port `80`. We could shut it down and restart with the `-p` flag to have our browser access it: 

```sh
docker container stop keen_darwin
docker container rm keen_darwin

docker container run -d -p 8080:80 nginx
```

2. We access with. Note that the `-it` flag makes us able to interact with the container; the last `bash` overrides the default `CMD` command in the image, starting the bash propmt

```sh
docker exec -it wonderful_ramanujan bash
```

3. We will see something like:

```sh
root@7edcb36aff08:/#
```

We have gained access to the container. We can execute commands from within:

```sh
root@7edcb36aff08:/# cd /usr/share/nginx/html/
root@7edcb36aff08:/# rm index.html
root@7edcb36aff08:/# echo "Hello, exec!" > index.html
```

## Other tip for debugging:

>Editor's note_ when doing development, it is essential to constantly follow the container logs. I'm usually not running containers in a detached mode (that is with -d) since it requires a bit of an extra effort to open the logs.
>
>When I'm 100% sure that everything works... no, when I'm 200% sure, then I might relax a bit and start the containers in detached mode. Until everything again falls apart and it is time to open the logs again.

## Redis

Redis is a key-value database. In contrast to eg. MongoDB, the data stored to a key-value storage has a bit less structure, there are eg. no collections or tables, it just contains junks of data that can be fetched based on the key that was attached to the data (the value).

By default Redis works in-memory, which means that it does not store data persistently.

An excellent use case for Redis is to use it as a cache. Caches are often used to store data that is otherwise slow to fetch and save the data until it's no longer valid. After the cache becomes invalid, you would then fetch the data again and store it in the cache.

We can add it as a 3rd party service for our application. We need to:

1. Configure our app to use Redis. For instance:

```js
const redis = require('redis')
const { promisify } = require('util')
const { REDIS_URL } = require('../util/config')
// REDIS_URL = redis://localhost:6379


let getAsync
let setAsync

if (!REDIS_URL) {
  const redisIsDisabled = () => {
    console.log('No REDIS_URL set, Redis is disabled')
    return null
  }
  getAsync = redisIsDisabled
  setAsync = redisIsDisabled
} else {
  const client = redis.createClient({
    url: REDIS_URL
  })
    
  getAsync = promisify(client.get).bind(client)
  setAsync = promisify(client.set).bind(client)    
}

module.exports = {
  getAsync,
  setAsync
}
```

- `setAsync` function takes in key and value, using the key to store the value.
- `getAsync` function takes in key and returns the value in a promise.

2. Add Redis to our `docker-compose.yml` file under `services:`

```yml
services:
  # ...
  redis:
    image: redis
    ports: 
      - 6379:6379
    command: ['redis-server', '--appendonly', 'yes'] 
    # Overwrite the CMD to toggle data persistence
    volumes: # Declare the volume
      - ./redis_data:/data
```

The data will now be persisted to directory `redis_data` of the host machine. Remember to add the directory to `.gitignore`!

### We can gain direct access to the Redis database using `redis-cli`

1. Go to the Redis container with `docker exec` and open the `redis-cli`:

```sh
docker exec -it container_name bash
```

2. Once inside the container, run `redis-cli`.

3. Here is a list of commands to use: <https://redis.io/commands/>

4. We can GET, SET and many other operations.

### Other functionality of Redis

In addition to the `GET`, `SET` and `DEL` operations on keys and values, Redis can do also a quite a lot more. It can for example automatically expire keys, that is a very useful feature when Redis is used as a cache.

Redis can also be used to implement so called publish-subscribe (or PubSub) pattern that is a asynchronous communication mechanism for distributed software. In this scenario Redis works as a message broker between two or more services. Some of the services are publishing messages by sending those to Redis, that on arrival of a message, informs the parties that have subscribed to those messages.

## Practical case

- Set base files for the app. For example, we could quickly create an example scaffolding with `npx express-generator`. 
- Set containerization basics: the `Dockerfile` (generally in the root directory of the project). See [The Dockerfile](#the-dockerfile).

> Dockerfile best practices **rules of thumb**:
>- Try to create as **secure** of an image as possible.
>- Try to create as **small** of an image as possible.
> 
>Smaller images are more secure by having less attack surface area, and smaller images also move faster in deployment pipelines. Read here a [list of 10 best practices for Node/Express containerization](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)

- Set files and folders to ignore. For example:

```txt
.dockerignore
.gitignore
node_modules
Dockerfile
```

Don't forget about including the files and directories used for [bind mounts](#binding-mounts-and-volumes), if any. Also, the Redis directory `redis_data` if the data persistence is toggled on.

- [Use `docker` compose to define and manage the containers for our application](#docker-compose).
