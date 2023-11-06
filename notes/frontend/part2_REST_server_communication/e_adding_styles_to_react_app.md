# Adding styles to React app

When adding CSS styles to a React component, there are several approaches, and the best approach can depend on the project's requirements and your team's preferences. However, there are some best practices and popular methods for styling React components:

1. CSS Modules: CSS Modules are a widely adopted approach for styling React components. They allow you to write CSS files where each class is locally scoped to the component it belongs to. This means you can use simple class names without worrying about global conflicts. To use CSS Modules, you typically name your CSS files with the `.module.css` extension, and then import and use them in your components.

For example:

```js
import styles from './assets/styles/MyComponent.module.css';

function MyComponent() {
  return <div className={styles.myComponent}>Styled content</div>;
}
```

2. Styled-components: Styled-components is a popular library that allows you to write CSS directly in your JavaScript code. It provides a way to define component-specific styles using tagged template literals. This approach is known as CSS-in-JS. Styled-components create and attach styles to your components at runtime.

```js
import styled from 'styled-components';

const StyledDiv = styled.div`
  color: blue;
  font-size: 16px;
`;

function MyComponent() {
  return <StyledDiv>Styled content</StyledDiv>;
}
```

3. CSS Preprocessors: If your team is already using a CSS preprocessor like SASS or LESS, you can continue to use it in your React project. You would then compile the preprocessor code into regular CSS before including it in your React components.

4. Global CSS: You can also use traditional global CSS, but it's generally not recommended for React applications. Global styles can lead to naming conflicts and make it harder to maintain and scale your project. However, you may still need some global styles for things like CSS resets.

5. CSS-in-JS Libraries: Besides styled-components, there are other CSS-in-JS libraries like Emotion, JSS, and Aphrodite. These libraries offer similar approaches to styling as styled-components and may be worth considering depending on your project's requirements.

Best practices for styling in React components include:

- Keep your styles modular and scoped to the component whenever possible to avoid global conflicts.
- Use meaningful class or variable names to make your code more readable and maintainable.
- Consider using responsive design principles for handling different screen sizes.
- Separate your styles from your component logic to keep your codebase clean and maintainable.
- Follow a consistent naming convention for your styles.

Ultimately, the choice of styling method will depend on your project's specific needs and your team's familiarity and preferences. The key is to maintain consistency in your approach across your project and follow best practices to ensure a maintainable and scalable codebase.

## Inline styles

React also makes it possible to write styles directly in the code as so-called inline styles.

The idea behind defining inline styles is extremely simple. Any React component or element can be provided with a set of CSS properties as a JavaScript object through the style attribute.

CSS rules are defined slightly differently in JavaScript than in normal CSS files. Let's say that we wanted to give some element the color green and italic font that's 16 pixels in size. In CSS, it would look like this:

```css
{
  color: green;
  font-style: italic;
  font-size: 16px;
}
```

But as a React inline-style object it would look like this:

```js
{
  color: 'green',
  fontStyle: 'italic',
  fontSize: 16
}
```

Every CSS property is defined as a separate property of the JavaScript object. Numeric values for pixels can be simply defined as integers. One of the major differences compared to regular CSS, is that hyphenated (kebab case) CSS properties are written in camelCase.

Next, we could add a "bottom block" to our application by creating a Footer component and defining the following inline styles for it:

```js
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2023</em>
    </div>
  )
}
```

Inline styles and some of the other ways of adding styles to React components go completely against the grain of old conventions. Traditionally, it has been considered best practice to entirely separate CSS from the content (HTML) and functionality (JavaScript). According to this older school of thought, the goal was to write CSS, HTML, and JavaScript into their separate files.

The philosophy of React is, in fact, the polar opposite of this. Since the separation of CSS, HTML, and JavaScript into separate files did not seem to scale well in larger applications, React bases the division of the application along the lines of its logical functional entities.

The structural units that make up the application's functional entities are React components. A React component defines the HTML for structuring the content, the JavaScript functions for determining functionality, and also the component's styling; all in one place. This is to create individual components that are as independent and reusable as possible.


