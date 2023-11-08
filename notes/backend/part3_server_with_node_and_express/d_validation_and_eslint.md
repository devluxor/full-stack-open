## Validation and eslint

Remember that validations are not done when updating a document by default. The documentation addresses the issue by explaining that validations are not run by default when `findOneAndUpdate` is executed. We can fix it by passing an extra configuration object:

```js
app.put('/update/:id', (request, response, next) => {
  // ...
  Note.findByIdAndUpdate(
    request.params.id, 
    { newData },
    { new: true, runValidators: true, context: 'query' } // configuration object. notice the second property
  )
  // ... 
})
```

Now the validation works and will not allow the update if the values are not congruent with the document schema.

## Eslint

> Generically, lint or a linter is any tool that detects and flags errors in programming languages, including stylistic errors. The term lint-like behavior is sometimes applied to the process of flagging suspicious language usage. Lint-like tools generally perform static analysis of source code.

In compiled statically typed languages like Java, IDEs like NetBeans can point out errors in the code, even ones that are more than just compile errors. Additional tools for performing static analysis like checkstyle, can be used for expanding the capabilities of the IDE to also point out problems related to style, like indentation.

In the JavaScript universe, the current leading tool for static analysis (aka "linting") is ESlint.

We can install it as a dev. dep:

```bash
npm install eslint --save-dev
```

```bash
npx eslint --init
```

There are many configuration standards. 

Remember to gitignore the `dist` folder.