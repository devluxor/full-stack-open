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

