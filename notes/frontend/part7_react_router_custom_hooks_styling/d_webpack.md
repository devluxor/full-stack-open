# Webpack

In the early days, React was somewhat famous for being very difficult to configure the tools required for application development. To make the situation easier, Create React App was developed, which eliminated configuration-related problems. Vite, which is also used in the course, has recently replaced Create React App in new applications.

Create React App (CRA) is a command-line tool that helps developers quickly set up a new React.js project with a predefined and opinionated project structure. It is maintained by Facebook and provides a sensible default configuration for building React applications.

With Create React App, developers can avoid the initial setup and configuration complexities associated with setting up a modern JavaScript development environment, including build tools, transpilers, and bundlers. It abstracts away the configuration details, allowing developers to focus on writing code and building features.

Both Vite and Create React App use bundlers to do the actual work. Webpack was by far the most popular bundler for years. Recently, however, there have been several new generation bundlers such as esbuild used by Vite, which are significantly faster and easier to use than Webpack. However, e.g. esbuild still lacks some useful features (such as hot reload of the code in the browser)

## Bundler

 a bundler refers to a tool that takes your application's source code, along with its dependencies, and combines them into a single, optimized bundle of files that can be served to the browser. The goal is to improve loading times and reduce the number of HTTP requests by delivering a more compact and efficient set of assets.

Both Vite and Create React App use bundlers, but they differ in their approaches and technologies.

Vite:
Vite takes a unique approach to bundling during development. In the development server mode, Vite doesn't bundle your entire codebase into a single file. Instead, it leverages native ES module support in modern browsers. Each module in your application is served individually, leading to faster development server startup and quicker Hot Module Replacement (HMR) updates. This "on-demand bundling" approach helps reduce development feedback times.

In the production build, Vite uses Rollup as its bundler. Rollup is a module bundler for JavaScript, and it optimizes the code for production by combining and minimizing files while removing dead code and unused dependencies.

Create React App:
Create React App uses webpack as its default bundler. Webpack is a widely-used bundler in the JavaScript ecosystem. It analyzes the project's dependency graph and bundles the necessary files into optimized bundles. Webpack also includes features like code splitting, which can further optimize the loading of large applications by splitting the code into smaller chunks that are loaded on demand.

In both Vite and Create React App, the bundler plays a crucial role in optimizing the application for production, ensuring efficient loading times, and managing the complexities of modern JavaScript development, such as transpiling code from newer ECMAScript versions and handling diverse assets like stylesheets and images.

## Bundling

Even though ES6 modules are defined in the ECMAScript standard, the older browsers do not know how to handle code that is divided into modules.

For this reason, code that is divided into modules must be bundled for browsers, meaning that all of the source code files are transformed into a single file that contains all of the application code.

We perform the bundling of our application with the `npm run build` command. Under the hood, the npm script bundles the source, and this produces the following collection of files in the dist directory:

```sh
├── assets
│   ├── index-d526a0c5.css
│   ├── index-e92ae01e.js
│   └── react-35ef61ed.svg
├── index.html
└── vite.svg
```

The index.html file located at the root of the dist directory is the "main file" of the application which loads the bundled JavaScript file with a script tag. The build script also bundles the application's CSS files into a single /assets/index-d526a0c5.css file.

In practice, bundling is done so that we define an entry point for the application, which typically is the index.js file. When webpack bundles the code, it includes not only the code from the entry point but also the code that is imported by the entry point, as well as the code imported by its import statements, and so on.

Since part of the imported files are packages like React, Redux, and Axios, the bundled JavaScript file will also contain the contents of each of these libraries.

> The old way of dividing the application's code into multiple files was based on the fact that the index.html file loaded all of the separate JavaScript files of the application with the help of script tags. This resulted in decreased performance, since the loading of each separate file results in some overhead. For this reason, these days the preferred method is to bundle the code into a single file.

## Transpiling

The process of transforming code from one form of JavaScript to another is called transpiling. The general definition of the term is to compile source code by transforming it from one language to another.

For example, we can transpile the code containing JSX into regular JavaScript with the help of babel, which is currently the most popular tool for the job.

Most browsers do not support the latest features that were introduced in ES6 and ES7, and for this reason, the code is usually transpiled to a version of JavaScript that implements the ES5 standard.

The transpilation process that is executed by Babel is defined with plugins. In practice, most developers use ready-made presets that are groups of pre-configured plugins.

Currently, we are using the @babel/preset-react preset for transpiling the source code of our application.

## Source Maps

The location of the error indicated in the message does not match the actual location of the error in our source code. If we click the error message, we notice that the displayed source code does not resemble our application code:

Of course, we want to see our actual source code in the error message.

Luckily, fixing the error message in this respect is quite easy. We will ask webpack to generate a so-called source map for the bundle, which makes it possible to map errors that occur during the execution of the bundle to the corresponding part in the original source code.

The source map can be generated by adding a new devtool property to the configuration object with the value 'source-map':

Generating the source map also makes it possible to use the Chrome debugger:

## Minification

When we deploy the application to production, we are using the main.js code bundle that is generated by webpack. The size of the main.js file is 1009487 bytes even though our application only contains a few lines of our code. The large file size is because the bundle also contains the source code for the entire React library. The size of the bundled code matters since the browser has to load the code when the application is first used. With high-speed internet connections, 1009487 bytes is not an issue, but if we were to keep adding more external dependencies, loading speeds could become an issue, particularly for mobile users.

If we inspect the contents of the bundle file, we notice that it could be greatly optimized in terms of file size by removing all of the comments. There's no point in manually optimizing these files, as there are many existing tools for the job.

The optimization process for JavaScript files is called minification. One of the leading tools intended for this purpose is UglifyJS.

Starting from version 4 of webpack, the minification plugin does not require additional configuration to be used. It is enough to modify the npm script in the package.json file to specify that webpack will execute the bundling of the code in production mode: