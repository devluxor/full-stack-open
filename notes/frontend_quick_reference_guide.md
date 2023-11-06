# Frontend Quick Reference Guide

## Project structure

Standard Structure: ([See a detailed explanation](./frontend/part1_intro_to_react/intro_to_react.md))

```bash
my_react_app/
  ├── dist/
  ├── node_modules/
  ├── public/
  │   ├── index.html
  │   ├── favicon.ico
  │   └── manifest.json
  ├── src/
  │   ├── index.js
  │   ├── App.js
  │   ├── components/
  │   │   └── SomeComponent.js
  │   ├── assets/
  │   │   ├── images/
  │   │   ├── styles/
  │   │   │   ├── App.css
  │   │   │   ├── index.css
  │   │   │   └── SomeComponent.css
  │   ├── data/
  │   ├── services/
  │   │   └── someService.js
  │   ├── utils/
  ├── package.json
  ├── package-lock.json
  ├── .gitignore
  ├── README.md
  ├── .env (optional)
```

## Roadmap

1. Create the basic files/folder structure for our template with 

```bash
 npm create vite@latest [app_name] -- --template react
```

Follow the installer instructions.

2. It's a good idea to create a TODO.md or PLAN.md file.

3. Install general dependencies and development environment dependencies. 
Examples of general dependencies: axios; dev. dependencies: cypress, eslint, jest, etc.

4. Configure `.gitignore`, `.eslintrc.cjs`, etc.

5. Add the necessary folders like `src/services`, `src/components` etc., to separate the different elements of the application (styles, components, services, etc.)

### General Roadmap

Creating the frontend for a React web application involves several steps, and the order in which you perform them may vary depending on your project's specific requirements. However, here's a general roadmap to guide you through the process:

1. **Project Setup**:
    - Install npm, Node.js, Vite, etc. as needed.

2. **React Project Setup**:
    - Vite is the fastest and easiest way. Create the basic files/folder structure for our template with 

    ```bash
    npm create vite@latest [app_name] -- --template react
    ```

   - Or create a new React project using a tool like Create React App (CRA) or manually configure Webpack and Babel if you prefer a custom setup.

3. **Project Structure**:
   - Organize your project structure, separating components, styles, and other assets.
   - Consider following a project structure convention like the Atomic Design methodology or similar to keep your code organized.

4. **Basic Components**:
   - Create fundamental React components, such as the main application container, header, and footer.

5. **Routing**:
   - Set up client-side routing using a library like React Router to handle navigation between different parts of your application.

6. **Styling**:
   - Choose a CSS-in-JS solution or a CSS preprocessor like SASS or LESS, and style your components.
   - Consider using a UI framework or component library like Material-UI, Ant Design, or Bootstrap for faster styling.

7. **State Management**:
   - Decide on a state management solution, such as React's built-in state management, Context API, or a library like Redux or Mobx, and implement it as needed.

8. **API Integration**:
   - Connect your frontend to the backend by making API requests. Use libraries like Axios or the fetch API to fetch data.

9. **Component Development**:
   - Start building your application's features by creating React components for various parts of the UI.
   - Break down your UI into smaller, reusable components and compose them to create complex interfaces.

10. **Data Management**:
    - Manage data from the backend by setting up data models and managing state effectively.
    - Use asynchronous operations and update the UI with fetched data.

11. **Forms and User Input**:
    - Create forms for user input and validation.
    - Handle form submissions and user interactions.

12. **Testing**:
    - Write unit tests for your components and integration tests for user flows.
    - Use testing libraries like Jest and React Testing Library.

13. **Optimization**:
    - Optimize your application's performance by implementing lazy loading, code splitting, and reducing unnecessary re-renders.
    - Use memoization techniques to cache expensive calculations or data.

14. **Accessibility (A11y)**:
    - Ensure your application is accessible to all users by following accessibility best practices.
    - Test your app with screen readers and automated accessibility tools.

15. **Error Handling**:
    - Implement error handling for network requests and user interactions.
    - Display meaningful error messages to users.

16. **Deployment**:
    - Configure your build process for production using tools like Webpack or Create React App.
    - Choose a hosting platform (e.g., Netlify, Vercel, AWS, or GitHub Pages) and deploy your application.

17. **Continuous Integration and Deployment (CI/CD)**:
    - Set up a CI/CD pipeline to automate testing and deployment processes.
    - Consider using tools like GitHub Actions, Travis CI, or Jenkins.

18. **Monitoring and Analytics**:
    - Integrate analytics tools like Google Analytics or Mixpanel to track user interactions and gather insights about your application's performance.

19. **Security**:
    - Implement security best practices, including data validation, authentication, and authorization.
    - Protect against common web vulnerabilities, such as XSS and CSRF.

20. **Documentation**:
    - Document your code, API endpoints, and how to run your project.
    - Consider using tools like JSDoc or Markdown for documentation.

21. **User Acceptance Testing (UAT)**:
    - Conduct UAT with stakeholders or users to gather feedback and make necessary improvements.

22. **Final Testing and Debugging**:
    - Conduct thorough testing and debugging before releasing your application to ensure it's free from critical issues.

23. **Launch**:
    - Once you are confident in the stability and performance of your application, launch it for users to access.

Remember that this roadmap is a general guideline, and the specifics can vary depending on your project's requirements, team size, and timeline. It's essential to continuously iterate and improve your application based on user feedback and evolving needs.