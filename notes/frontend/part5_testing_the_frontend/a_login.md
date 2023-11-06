# Login in Frontend

## Handling login

create form user/password

the entered values are sent via post

if correct, a token is created

this token can be sent via post req when the user creates a new note

if user logged in, show form to add new notes
if user not logged in, show login form

## Saving the token to the browser's local storage

Our application has a small flaw: if the browser is refreshed (eg. pressing F5), the user's login information disappears.

This problem is easily solved by saving the login details to local storage. Local Storage is a key-value database in the browser.

It is very easy to use. A value corresponding to a certain key is saved to the database with the method setItem. For example:

```js
window.localStorage.setItem('name', 'juha tauriainen')
```

saves the string given as the second parameter as the value of the key name.

The value of a key can be found with the method getItem:

and removeItem removes a key.

Values in the local storage are persisted even when the page is re-rendered. The storage is origin-specific so each web application has its own storage.

Values saved to the storage are DOMstrings, so we cannot save a JavaScript object as it is. The object has to be parsed to JSON first, with the method JSON.stringify. Correspondingly, when a JSON object is read from the local storage, it has to be parsed back to JavaScript with JSON.parse.

We still have to modify our application so that when we enter the page, the application checks if user details of a logged-in user can already be found on the local storage. If they can, the details are saved to the state of the application and to noteService. The right way to do this is with an effect hook:

We can have multiple effect hooks,

  // a token is a string cryptographically signed
  // that contains some hidden data, here username, and id
  // this token (JWT format, an industry standard) will
  // be sent to the client when the user correctly log ins
  // then, the client will store it and send this same token
  // in each subsequent requests' headers. Upon receipt, the server extracts
  // the data in the token. If the id in the token is the same id of the currently
  // logged in user, the server will allow certain operation (like delete his/her
  // own notes)

A note on using local storage

the challenge of token-based authentication is how to cope with the situation when the API access of the token holder to the API needs to be revoked.

There are two solutions to the problem. The first one is to limit the validity period of a token. This forces the user to re-login to the app once the token has expired. The other approach is to save the validity information of each token to the backend database. This solution is often called a server-side session.

No matter how the validity of tokens is checked and ensured, saving a token in the local storage might contain a security risk if the application has a security vulnerability that allows Cross Site Scripting (XSS) attacks.

When using React sensibly it should not be possible since React sanitizes all text that it renders, meaning that it is not executing the rendered content as JavaScript.

If one wants to play safe, the best option is to not store a token in local storage. This might be an option in situations where leaking a token might have tragic consequences.

It has been suggested that the identity of a signed-in user should be saved as httpOnly cookies, so that JavaScript code could not have any access to the token. The drawback of this solution is that it would make implementing SPA applications a bit more complex. One would need at least to implement a separate page for logging in.

However, it is good to notice that even the use of httpOnly cookies does not guarantee anything. It has even been suggested that httpOnly cookies are not any safer than the use of local storage.

So no matter the used solution the most important thing is to minimize the risk of XSS attacks altogether.