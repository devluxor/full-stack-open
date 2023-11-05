# End to end testing

o far we have tested the backend as a whole on an API level using integration tests and tested some frontend components using unit tests.

Next, we will look into one way to test the system as a whole using End to End (E2E) tests.

We can do E2E testing of a web application using a browser and a testing library. There are multiple libraries available. One example is Selenium, which can be used with almost any browser. Another browser option is so-called headless browsers, which are browsers with no graphical user interface. For example, Chrome can be used in headless mode.

E2E tests are potentially the most useful category of tests because they test the system through the same interface as real users use.

They do have some drawbacks too. Configuring E2E tests is more challenging than unit or integration tests. They also tend to be quite slow, and with a large system, their execution time can be minutes or even hours. This is bad for development because during coding it is beneficial to be able to run tests as often as possible in case of code regressions.

E2E tests can also be flaky. Some tests might pass one time and fail another, even if the code does not change at all.

Cypress
E2E library Cypress has become popular within the last year. Cypress is exceptionally easy to use, and when compared to Selenium, for example, it requires a lot less hassle and headache. Its operating principle is radically different than most E2E testing libraries because Cypress tests are run completely within the browser. Other libraries run the tests in a Node process, which is connected to the browser through an API.

Unlike the frontend's unit tests, Cypress tests can be in the frontend or the backend repository, or even in their separate repository.


Controlling the state of the database

If the tests need to be able to modify the server's database, the situation immediately becomes more complicated. Ideally, the server's database should be the same each time we run the tests, so our tests can be reliably and easily repeatable.

As with unit and integration tests, with E2E tests it is best to empty the database and possibly format it before the tests are run. The challenge with E2E tests is that they do not have access to the database.

The solution is to create API endpoints for the backend tests. We can empty the database using these endpoints

The Cypress documentation gives us the following advice: Fully test the login flow – but only once. So instead of logging in a user using the form in the beforeEach block, Cypress recommends that we bypass the UI and do an HTTP request to the backend to log in. The reason for this is that logging in with an HTTP request is much faster than filling out a form.

Running and debugging the tests
Finally, some notes on how Cypress works and debugging your tests.

The form of the Cypress tests gives the impression that the tests are normal JavaScript code, 

When Cypress runs a test, it adds each cy command to an execution queue. When the code of the test method has been executed, Cypress will execute each command in the queue one by one.

Cypress commands always return undefined, so button.click() in the above code would cause an error. An attempt to start the debugger would not stop the code between executing the commands, but before any commands have been executed.

Cypress commands are like promises, so if we want to access their return values, we have to do it using the then command. 

Stopping the test execution with the debugger is possible. The debugger starts only if Cypress test runner's developer console is open.

The developer console is all sorts of useful when debugging your tests. You can see the HTTP requests done by the tests on the Network tab, and the console tab will show you information about your tests:

So far we have run our Cypress tests using the graphical test runner. It is also possible to run them from the command line. We just have to add an npm script for it: