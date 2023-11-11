# Extra topics

## Organization of code in React application

In most applications, we followed the principle by which components were placed in the directory components, reducers were placed in the directory reducers, and the code responsible for communicating with the server was placed in the directory services. This way of organizing fits a smaller application just fine, but as the amount of components increases, better solutions are needed. There is no one correct way to organize a project. [The article The 100% correct way to structure a React app (or why there’s no such thing)](https://medium.com/hackernoon/the-100-correct-way-to-structure-a-react-app-or-why-theres-no-such-thing-3ede534ef1ed) provides some perspective on the issue.

## Frontend and backend in the same repository

During the course, we have created the frontend and backend into separate repositories. This is a very typical approach. However, we did the deployment by copying the bundled frontend code into the backend repository. A possibly better approach would have been to deploy the frontend code separately.

Sometimes, there may be a situation where the entire application is to be put into a single repository. In this case, a common approach is to put the package.json and webpack.config.js in the root directory, as well as place the frontend and backend code into their own directories, e.g. client and server.

## Changes on the server

If there are changes in the state on the server, e.g. when new blogs are added by other users to the bloglist service, the React frontend we implemented during this course will not notice these changes until the page reloads. A similar situation arises when the frontend triggers a time-consuming computation in the backend. How do we reflect the results of the computation to the frontend?

One way is to execute _polling_ on the frontend, meaning repeated requests to the backend API e.g. using the `setInterval` command, to check for changes in the server's state, and to show them on the frontend accordingly.

A more sophisticated way is to use WebSockets which allow for establishing a two-way communication channel between the browser and the server. In this case, the browser does not need to poll the backend, and instead only has to define callback functions for situations when the server sends data about updates on its state via a WebSocket. It is like establishing a two-way, extra channel between server and client.

WebSockets is an API provided by the browser, which is not yet fully supported on all browsers:

Instead of directly using the WebSocket API, it is advisable to use the Socket.io library, which provides various fallback options in case the browser does not have full support for WebSockets.

In part 8, our topic is GraphQL, which provides a nice mechanism for notifying clients when there are changes in the backend data.

## Virtual DOM

When a software developer uses React, they rarely or never directly manipulate the DOM. The function defining the React component returns a set of React elements. Although some of the elements look like normal HTML elements they are also just JavaScript-based React elements at their core.

The React elements defining the appearance of the components of the application make up the Virtual DOM, which is stored in system memory during runtime.

With the help of the ReactDOM library, the virtual DOM defined by the components is rendered to a real DOM that can be shown by the browser using the DOM API:

When the state of the application changes, a new virtual DOM gets defined by the components. React has the previous version of the virtual DOM in memory and instead of directly rendering the new virtual DOM using the DOM API, React computes the optimal way to update the DOM (remove, add or modify elements in the DOM) such that the DOM reflects the new virtual DOM.

## The role of React in applications

In the material, we may not have put enough emphasis on the fact that React is primarily a library for managing the creation of views for an application. If we look at the traditional Model View Controller pattern, then the domain of React would be View. React has a more narrow area of application than e.g. Angular, which is an all-encompassing Frontend MVC framework. Therefore, React is not called a framework, but a library.

In small applications, data handled by the application is stored in the state of the React components, so in this scenario, the state of the components can be thought of as models of an MVC architecture.

However, MVC architecture is not usually mentioned when talking about React applications. Furthermore, if we are using Redux, then the applications follow the Flux architecture and the role of React is even more focused on creating the views. The business logic of the application is handled using the Redux state and action creators. If we're using Redux Thunk familiar from part 6, then the business logic can be almost completely separated from the React code.

Because both React and Flux were created at Facebook, one could say that using React only as a UI library is the intended use case. Following the Flux architecture adds some overhead to the application, and if we're talking about a small application or prototype, it might be a good idea to use React "wrong", since over-engineering rarely yields an optimal result.

Part 6 last chapter covers the newer trends of state management in React. React's hook functions useReducer and useContext provide a kind of lightweight version of Redux. React Query, on the other hand, is a library that solves many of the problems associated with handling state on the server, eliminating the need for a React application to store data retrieved from the server directly in frontend state.

## Security

- Always keep npms updated
- Use Express security guide
- Sanitize user inputs
- Never trust data from the browser
- Always expect the worst

The dependencies can be brought up to date by updating the file package.json. The best way to do that is by using a tool called npm-check-updates. It can be installed globally by running the command

```sh
npm install -g npm-check-updates
```
The npm audit command can be used to check the security of dependencies. It compares the version numbers of the dependencies in your application to a list of the version numbers of dependencies containing known security threats in a centralized error database.

`audit fix `does not update dependencies if their major version number has increased. Updating these dependencies could lead to the whole application breaking down.

> Warning: The single most important lesson you can learn about website security is to **never trust data from the browser**. This includes, but is not limited to data in URL parameters of GET requests, POST requests, HTTP headers and cookies, and user-uploaded files. Always check and sanitize all incoming data. Always assume the worst.

Express security guide: <https://expressjs.com/en/advanced/best-practice-security.html>

## Current trends

### Typed versions of Javascript: 
    - TypeScript

### Server-side rendering, isomorphic applications and universal code:

The browser is not the only domain where components defined using React can be rendered. The rendering can also be done on the server. This kind of approach is increasingly being used, such that, when accessing the application for the first time, the server serves a pre-rendered page made with React. From here onwards, the operation of the application continues, as usual, meaning the browser executes React, which manipulates the DOM shown by the browser. The rendering that is done on the server goes by the name: server-side rendering.

One motivation for server-side rendering is Search Engine Optimization (SEO). Search engines have traditionally been very bad at recognizing JavaScript-rendered content. However, the tide might be turning:

  - <https://www.javascriptstuff.com/react-seo/>
  - <https://medium.freecodecamp.org/seo-vs-react-is-it-neccessary-to-render-react-pages-in-the-backend-74ce5015c0c9>

Of course, server-side rendering is not anything specific to React or even JavaScript. Using the same programming language throughout the stack in theory simplifies the execution of the concept because the same code can be run on both the front- and backend.

Along with server-side rendering, there has been talk of so-called **isomorphic applications** and **universal code**, although there has been some debate about their definitions. According to some definitions, an isomorphic web application performs rendering on both frontend and backend. On the other hand, universal code is code that can be executed in most environments, meaning both frontend and backend.

React and Node provide a desirable option for implementing an isomorphic application as universal code.

Writing universal code directly using React is currently still pretty cumbersome. Lately, a library called **Next.js**, which is implemented on top of React, has garnered much attention and is a good option for making universal applications.

### Progressive web apps

Lately, people have started using the term progressive web app (PWA) launched by Google.

In short, we are talking about web applications working as well as possible on every platform and taking advantage of the best parts of those platforms. The smaller screen of mobile devices must not hamper the usability of the application. PWAs should also work flawlessly in offline mode or with a slow internet connection. On mobile devices, they must be installable just like any other application. All the network traffic in a PWA should be encrypted.

### Microservice architecture

During this course, we have only scratched the surface of the server end of things. In our applications, we had a monolithic backend, meaning one application making up a whole and running on a single server, serving only a few API endpoints.

As the application grows, the monolithic backend approach starts turning problematic both in terms of performance and maintainability.

A microservice architecture (microservices) is a way of composing the backend of an application from many separate, independent services, which communicate with each other over the network. An individual microservice's purpose is to take care of a particular logical functional whole. In a pure microservice architecture, the services do not use a shared database.

For example, the bloglist application could consist of two services: one handling the user and another taking care of the blogs. The responsibility of the user service would be user registration and user authentication, while the blog service would take care of operations related to the blogs.

The image below visualizes the difference between the structure of an application based on a microservice architecture and one based on a more traditional monolithic structure:

![Microservices-vs-monolithical-architecture](https://fullstackopen.com/static/beecf1d05714ef6a4ac0721fce62d394/5a190/36.png)

The role of the frontend (enclosed by a red square in the picture) does not differ much between the two models. There is often a so-called API gateway between the microservices and the frontend, which provides an illusion of a more traditional "everything on the same server" API. Netflix, among others, uses this type of approach.

Microservice architectures emerged and evolved for the needs of large internet-scale applications. The trend was set by Amazon far before the appearance of the term microservice. The critical starting point was an email sent to all employees in 2002 by Amazon CEO Jeff Bezos:

<table>
<tbody>
<tr>
<td>
All teams will henceforth expose their data and functionality through service interfaces.

Teams must communicate with each other through these interfaces.

There will be no other form of inter-process communication allowed: no direct linking, no direct reads of another team’s data store, no shared-memory model, no back-doors whatsoever. The only communication allowed is via service interface calls over the network.

It doesn’t matter what technology you use.

All service interfaces, without exception, must be designed from the ground up to be externalize-able. That is to say, the team must plan and design to be able to expose the interface to developers in the outside world.

No exceptions.

Anyone who doesn’t do this will be fired. Thank you; have a nice day!
</td>
</tr>
</tbody>
</table>

Nowadays, one of the biggest forerunners in the use of microservices is Netflix (<https://www.infoq.com/presentations/netflix-chaos-microservices>)

The use of microservices has steadily been gaining hype to be kind of a silver bullet of today, which is being offered as a solution to almost every kind of problem. However, there are several challenges when it comes to applying a microservice architecture, and it might make sense to go monolith first (<https://martinfowler.com/bliki/MonolithFirst.html>) by initially making a traditional all-encompassing backend. Or maybe not (<https://martinfowler.com/articles/dont-start-monolith.html>). There are a bunch of different opinions on the subject. Both links lead to Martin Fowler's site; as we can see, even the wise are not entirely sure which one of the right ways is more right.

### Serverless

After the release of Amazon's lambda service at the end of 2014, a new trend started to emerge in web application development: serverless.

The main thing about lambda, and nowadays also Google's Cloud functions as well as similar functionality in Azure, is that it enables the execution of individual functions in the cloud. Before, the smallest executable unit in the cloud was a single process, e.g. a runtime environment running a Node backend.

E.g. Using Amazon's API gateway it is possible to make serverless applications where the requests to the defined HTTP API get responses directly from cloud functions. Usually, the functions already operate using stored data in the databases of the cloud service.

Serverless is not about there not being a server in applications, but about how the server is defined. Software developers can shift their programming efforts to a higher level of abstraction as there is no longer a need to programmatically define the routing of HTTP requests, database relations, etc., since the cloud infrastructure provides all of this. Cloud functions also lend themselves to creating a well-scaling system, e.g. Amazon's Lambda can execute a massive amount of cloud functions per second. All of this happens automatically through the infrastructure and there is no need to initiate new servers, etc.

### Useful libraries and interesting links

The JavaScript developer community has produced a large variety of useful libraries. If you are developing anything more substantial, it is worth it to check if existing solutions are already available. Below are listed some libraries recommended by trustworthy parties.

If your application has to handle complicated data, lodash, which we recommended in part 4, is a good library to use. If you prefer the functional programming style, you might consider using ramda.

If you are handling times and dates, date-fns offers good tools for that. If you have complex forms in your apps, have a look at whether React Hook Form would be a good fit. If your application displays graphs, there are multiple options to choose from. Both recharts and highcharts are well-recommended.

The Immer provides immutable implementations of some data structures. The library could be of use when using Redux, since as we remember in part 6, reducers must be pure functions, meaning they must not modify the store's state but instead have to replace it with a new one when a change occurs.

Redux-saga provides an alternative way to make asynchronous actions for Redux Thunk familiar from part 6. Some embrace the hype and like it. I don't.

For single-page applications, the gathering of analytics data on the interaction between the users and the page is more challenging than for traditional web applications where the entire page is loaded. The React Google Analytics library offers a solution.

You can take advantage of your React know-how when developing mobile applications using Facebook's extremely popular React Native library, which is the topic of part 10 of the course.

When it comes to the tools used for the management and bundling of JavaScript projects, the community has been very fickle. Best practices have changed rapidly (the years are approximations, nobody remembers that far back in the past):

- 2011 Bower
- 2012 Grunt
- 2013-14 Gulp
- 2012-14 Browserify
- 2015- Webpack

Hipsters seem to have lost their interest in tool development after webpack started to dominate the markets. A few years ago, Parcel started to make the rounds marketing itself as simple (which Webpack is not) and faster than Webpack. However, after a promising start, Parcel has not gathered any steam, and it's beginning to look like it will not be the end of Webpack. Recently, esbuild has been on a relatively high rise and is already seriously challenging Webpack.

The site <https://reactpatterns.com/> provides a concise list of best practices for React, some of which are already familiar from this course. Another similar list is react bits.

Reactiflux is a big chat community of React developers on Discord. It could be one possible place to get support after the course has concluded. For example, numerous libraries have their own channels.