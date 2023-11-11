# More about styles

## Alternatives to single CSS file, and inline styles:

### Ready-made UI libraries

Many UI frameworks provide developers of web applications with ready-made themes and "components" like buttons, menus, and tables. We write components in quotes because, in this context, we are not talking about React components. Usually, UI frameworks are used by including the CSS stylesheets and JavaScript code of the framework in the application.

- like Bootstrap (once king)

Many UI frameworks have React-friendly versions where the framework's "components" have been transformed into React components. There are a few different React versions of Bootstrap like reactstrap and react-bootstrap.

#### React Bootstrap

#### Material UI

Material-UI is a popular React component library that implements Google's Material Design. It provides a set of pre-designed React components that follow the Material Design guidelines, making it easy to create a consistent and visually appealing user interface. Here's a basic overview of how to use Material-UI in a React application:

1. **Installation:**
   To get started with Material-UI, you need to install the `@mui/material` package. You may also want to install `@emotion/react` and `@emotion/styled` as Material-UI relies on the Emotion library for styling.

   ```bash
   npm install @mui/material @emotion/react @emotion/styled
   ```

   or

   ```bash
   yarn add @mui/material @emotion/react @emotion/styled
   ```

2. **Importing Components:**
   You can import Material-UI components into your React files as needed. For example:

   ```javascript
   import React from 'react';
   import Button from '@mui/material/Button';
   import TextField from '@mui/material/TextField';
   ```

   This example imports the `Button` and `TextField` components.

3. **Using Material-UI Components:**
   Once imported, you can use Material-UI components like any other React component in your application:

   ```javascript
   import React from 'react';
   import Button from '@mui/material/Button';

   const MyComponent = () => {
     return (
       <div>
         <h1>Hello Material-UI!</h1>
         <Button variant="contained" color="primary">
           Click me
         </Button>
       </div>
     );
   };

   export default MyComponent;
   ```

   Here, the `Button` component is used with the `variant` and `color` props to specify its appearance.

4. **Theming:**
   Material-UI allows you to customize the theme of your application to match your design preferences. You can use the `ThemeProvider` to wrap your entire application or specific parts of it.

   ```javascript
   import React from 'react';
   import { createTheme, ThemeProvider } from '@mui/material/styles';
   import Button from '@mui/material/Button';

   const theme = createTheme();

   const MyThemedComponent = () => {
     return (
       <ThemeProvider theme={theme}>
         <div>
           <h1>Hello Themed Material-UI!</h1>
           <Button variant="contained" color="primary">
             Click me
           </Button>
         </div>
       </ThemeProvider>
     );
   };

   export default MyThemedComponent;
   ```

   You can customize the theme by providing a `createTheme` configuration object with your desired values.

5. **Responsive Design:**
   Material-UI components are designed to be responsive by default. You can create responsive layouts using components like `Grid` to define the structure of your page.

   ```javascript
   import React from 'react';
   import Grid from '@mui/material/Grid';
   import Paper from '@mui/material/Paper';

   const ResponsiveLayout = () => {
     return (
       <Grid container spacing={2}>
         <Grid item xs={12} md={6}>
           <Paper>Content 1</Paper>
         </Grid>
         <Grid item xs={12} md={6}>
           <Paper>Content 2</Paper>
         </Grid>
       </Grid>
     );
   };

   export default ResponsiveLayout;
   ```

   In this example, the `Grid` component is used to create a responsive layout with two columns.

This is a basic overview of using Material-UI in a React application. Material-UI provides a wide range of components, and its theming system allows for easy customization to fit the look and feel of your application. Check the official Material-UI documentation for more details and examples: [Material-UI Documentation](https://mui.com/getting-started/installation/).

### Closing thoughts

The difference between react-bootstrap and MaterialUI is not big. It's up to you which one you find better looking. I have not used MaterialUI a lot, but my first impressions are positive. Its documentation is a bit better than react-bootstrap's. According to https://www.npmtrends.com/ which tracks the popularity of different npm-libraries, MaterialUI passed react-bootstrap in popularity at the end of 2018:

The benefit of using the React Bootstrap library is not that evident.

In addition to making the frontend code more compact and readable, another benefit of using React UI framework libraries is that they include the JavaScript that is needed to make specific components work. Some Bootstrap components require a few unpleasant JavaScript dependencies that we would prefer not to include in our React applications.

Some potential downsides to using UI frameworks through integration libraries instead of using them "directly" are that integration libraries may have unstable APIs and poor documentation. The situation with Semantic UI React is a lot better than with many other UI frameworks, as it is an official React integration library.

There is also the question of whether or not UI framework libraries should be used in the first place. It is up to everyone to form their own opinion, but for people lacking knowledge in CSS and web design, they are very useful tools.

Other UI frameworks

Here are some other UI frameworks for your consideration. If you do not see your favorite UI framework in the list, please make a pull request to the course material.

## Recommended:

- <https://tailwindcss.com/>
- <https://mantine.dev/>
- <https://chakra-ui.com/>

## Other good alternative: Styled components

There are also other ways of styling React applications that we have not yet taken a look at.

The styled components library offers an interesting approach for defining styles through tagged template literals that were introduced in ES6.

Styled components have seen consistent growth in popularity in recent times, and quite a lot of people consider it to be the best way of defining styles in React applications.

Styled Components is a popular library for styling React components using tagged template literals. It allows you to write actual CSS code within your JavaScript files, making it easier to manage styles for your components. Here's a basic overview of how to use Styled Components in a React application:

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
