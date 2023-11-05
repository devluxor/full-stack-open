# Testing React apps


There are many different ways of testing React applications.

Tests will be implemented with the same Jest testing library developed by Facebook that was used in the previous part.

In addition to Jest, we also need another testing library that will help us render components for testing purposes. The current best option for this is react-testing-library which has seen rapid growth in popularity in recent times.

After the initial configuration, the test renders the component with the render function provided by the react-testing-library:

Normally React components are rendered to the DOM. The render method we used renders the components in a format that is suitable for tests without rendering them to the DOM.

We can use the object screen to access the rendered component. We use screen's method getByText to search for an element that has the note content and ensure that it exists:

and standard assertions of type `expect()...`


Test file location

In React there are (at least) two different conventions for the test file's location. We created our test files according to the current standard by placing them in the same directory as the component being tested.

The reason we choose to follow this convention is that it is configured by default in applications created by create-react-app.

The other convention is to store the test files "normally" in a separate test directory. 

Searching for content in a component

The react-testing-library package offers many different ways of investigating the content of the component being tested. In reality, the expect in our test is not needed at all

For example, find a component with x content, if it does not, the test fails.

We could also use CSS-selectors to find rendered elements by using the method querySelector of the object container that is one of the fields returned by the render:

(we have access via the classic DOM api)

There are also other methods, eg. getByTestId, that look for elements based on id-attributes that are inserted into the code specifically for testing purposes.

Debugging tests
We typically run into many different kinds of problems when writing our tests.

Object screen has method debug that can be used to print the HTML of a component to the terminal. 


It is also possible to use the same method to print a wanted element to console: (argument of debug)

Clicking buttons in tests

In addition to displaying content, we can test clicking a button works as expected

Let us install a library user-event that makes simulating user input a bit easier:

this works by initializing mock sessions, and passing mock functions within the test. We can even simulate events like clicks, etc.

The expectation of the test verifies that the mock function has been called exactly once.

Mock objects and functions are commonly used stub components in testing that are used for replacing dependencies of the components being tested. Mocks make it possible to return hardcoded responses, and to verify the number of times the mock functions are called and with what parameters.

we can use the toHaveStyle to check for the existence of rules like ('display: none') for togglable content, etc.

Testing the forms

We can also simulate text input with userEvent.

we use mock functions

Tests get access to the input field using the function getByRole.

The method type of the userEvent is used to write text to the input field.

About finding the elements

If a form has two inputs, ie.

Method getAllByRole now returns an array and the right input field is the first element of the array. However, this approach is a bit suspicious since it relies on the order of the input fields.

we can use different methods to find specific inputs in the form, byId, byPlaceHolder text...

but

The most flexible way of finding elements in tests is the method querySelector of the container object, which is returned by render, as was mentioned earlier in this part. Any CSS selector can be used with this method for searching elements in tests.

It is important to notice that, unlike the other ByText commands, findByText returns a promise!

There are situations where yet another form of the command queryByText is useful. The command returns the element but it does not cause an exception if the element is not found.

We could eg. use the command to ensure that something is not rendered to the component:

```js
  const element = screen.queryByText('do not want this thing to be rendered')
  expect(element).toBeNull()
```


Test coverage
We can easily find out the coverage of our tests by running them with the command.

Frontend integration tests

In the previous part of the course material, we wrote integration tests for the backend that tested its logic and connected the database through the API provided by the backend. When writing these tests, we made the conscious decision not to write unit tests, as the code for that backend is fairly simple, and it is likely that bugs in our application occur in more complicated scenarios than unit tests are well suited for.

So far all of our tests for the frontend have been unit tests that have validated the correct functioning of individual components. Unit testing is useful at times, but even a comprehensive suite of unit tests is not enough to validate that the application works as a whole.

We could also make integration tests for the frontend. Integration testing tests the collaboration of multiple components. It is considerably more difficult than unit testing, as we would have to for example mock data from the server. We chose to concentrate on making end-to-end tests to test the whole application. We will work on the end-to-end tests in the last chapter of this part.

Snapshot testing

Jest offers a completely different alternative to "traditional" testing called snapshot testing. The interesting feature of snapshot testing is that developers do not need to define any tests themselves, it is simple enough to adopt snapshot testing.

The fundamental principle is to compare the HTML code defined by the component after it has changed to the HTML code that existed before it was changed.

If the snapshot notices some change in the HTML defined by the component, then either it is new functionality or a "bug" caused by accident. Snapshot tests notify the developer if the HTML code of the component changes. The developer has to tell Jest if the change was desired or undesired. If the change to the HTML code is unexpected, it strongly implies a bug, and the developer can become aware of these potential issues easily thanks to snapshot testing.