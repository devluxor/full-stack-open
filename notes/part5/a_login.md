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