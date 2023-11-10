# React Router


## React Router

React has the React Router library which provides an excellent solution for managing navigation in a React application.

Routing, or the conditional rendering of components based on the URL in the browser, is used by placing components as children of the Router component, meaning inside Router tags.

BrowserRouter is a Router that uses the HTML5 history API (pushState, replaceState and the popState event) to keep your UI in sync with the URL.

Normally the browser loads a new page when the URL in the address bar changes. However, with the help of the HTML5 history API, BrowserRouter enables us to use the URL in the address bar of the browser for internal "routing" in a React application. So, even if the URL in the address bar changes, the content of the page is only manipulated using Javascript, and the browser will not load new content from the server. Using the back and forward actions, as well as making bookmarks, is still logical like on a traditional web page.

Inside the router, we define links that modify the address bar with the help of the Link component, which when clicked changes the URL in the address bar. Components rendered based on the URL of the browser are defined with the help of the component Route.

