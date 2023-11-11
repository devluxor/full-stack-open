# More about styles

## Alternatives to single CSS file, and inline styles:

### Ready-made UI libraries

Many UI frameworks provide developers of web applications with ready-made themes and "components" like buttons, menus, and tables. We write components in quotes because, in this context, we are not talking about React components. Usually, UI frameworks are used by including the CSS stylesheets and JavaScript code of the framework in the application.

- like Bootstrap (once king)

Many UI frameworks have React-friendly versions where the framework's "components" have been transformed into React components. There are a few different React versions of Bootstrap like reactstrap and react-bootstrap.

#### React Bootstrap

#### Material UI

### Closing thoughts

The difference between react-bootstrap and MaterialUI is not big. It's up to you which one you find better looking. I have not used MaterialUI a lot, but my first impressions are positive. Its documentation is a bit better than react-bootstrap's. According to https://www.npmtrends.com/ which tracks the popularity of different npm-libraries, MaterialUI passed react-bootstrap in popularity at the end of 2018:

The benefit of using the React Bootstrap library is not that evident.

In addition to making the frontend code more compact and readable, another benefit of using React UI framework libraries is that they include the JavaScript that is needed to make specific components work. Some Bootstrap components require a few unpleasant JavaScript dependencies that we would prefer not to include in our React applications.

Some potential downsides to using UI frameworks through integration libraries instead of using them "directly" are that integration libraries may have unstable APIs and poor documentation. The situation with Semantic UI React is a lot better than with many other UI frameworks, as it is an official React integration library.

There is also the question of whether or not UI framework libraries should be used in the first place. It is up to everyone to form their own opinion, but for people lacking knowledge in CSS and web design, they are very useful tools.

Other UI frameworks

Here are some other UI frameworks for your consideration. If you do not see your favorite UI framework in the list, please make a pull request to the course material.

- <https://bulma.io/>
- <https://ant.design/>
- <https://get.foundation/>
- <https://chakra-ui.com/>
- <https://tailwindcss.com/>
- <https://semantic-ui.com/>
- <https://mantine.dev/>
- <https://react.fluentui.dev/>
- <https://storybook.js.org>
- <https://www.primefaces.org/primereact/>
- <https://v2.grommet.io>
- <https://blueprintjs.com>
- <https://evergreen.segment.com>
- <https://www.radix-ui.com/>
- <https://react-spectrum.adobe.com/react-aria/ind>ex.html
- <https://master.co/>
- <https://www.radix-ui.com/>
- <https://nextui.org/>
- <https://daisyui.com/>
- <https://ui.shadcn.com/>
- <https://www.tremor.so/>
- <https://headlessui.com/>

## Other: Styled components

There are also other ways of styling React applications that we have not yet taken a look at.

The styled components library offers an interesting approach for defining styles through tagged template literals that were introduced in ES6.

Styled components have seen consistent growth in popularity in recent times, and quite a lot of people consider it to be the best way of defining styles in React applications.

Certainly! Styled Components is a popular library for styling React components using tagged template literals. It allows you to write actual CSS code within your JavaScript files, making it easier to manage styles for your components. Here's a basic overview of how to use Styled Components in a React application:

1. **Installation:**
   First, you need to install the Styled Components library. You can do this using npm or yarn:

   ```bash
   npm install styled-components
   ```

   or

   ```bash
   yarn add styled-components
   ```

2. **Importing:**
   Import `styled` from the `styled-components` package at the top of your React component file where you want to use styled components.

   ```javascript
   import styled from 'styled-components';
   ```

3. **Creating Styled Components:**
   You can create styled components by calling the `styled` function and passing a tag template literal containing your CSS. The tag template literal is a special syntax in JavaScript, denoted by backticks (`).

   ```javascript
   const StyledButton = styled.button`
     background-color: #3498db;
     color: #ffffff;
     padding: 10px 15px;
     border: none;
     border-radius: 4px;
     cursor: pointer;

     &:hover {
       background-color: #2980b9;
     }
   `;
   ```

   Here, `StyledButton` is a styled component that represents a button with the specified styles. You can use any valid CSS within the backticks.

4. **Using Styled Components:**
   Now that you have created a styled component, you can use it just like any other React component in your render function.

   ```javascript
   import React from 'react';

   const MyComponent = () => {
     return (
       <div>
         <h1>Hello Styled Components!</h1>
         <StyledButton>Click me</StyledButton>
       </div>
     );
   };

   export default MyComponent;
   ```

   In this example, the `StyledButton` component is used inside the `MyComponent` component.

5. **Dynamic Styling:**
   One of the powerful features of Styled Components is the ability to pass props to dynamically change styles. You can use props within the styled component's template literal and conditionally apply styles based on those props.

   ```javascript
   const StyledButton = styled.button`
     background-color: ${(props) => (props.primary ? '#3498db' : '#2ecc71')};
     color: #ffffff;
     padding: 10px 15px;
     border: none;
     border-radius: 4px;
     cursor: pointer;

     &:hover {
       background-color: ${(props) => (props.primary ? '#2980b9' : '#27ae60')};
     }
   `;
   ```

   Then, when using the `StyledButton` component, you can pass the `primary` prop to change the button's appearance dynamically.

   ```javascript
   <StyledButton primary>Primary Button</StyledButton>
   <StyledButton>Secondary Button</StyledButton>
   ```

That's a basic overview of using Styled Components in a React application. It offers a convenient and flexible way to manage styles in your components.