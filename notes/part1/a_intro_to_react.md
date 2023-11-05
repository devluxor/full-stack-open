# 1a: Introduction to React

## Topics

### Vite

Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects. It consists of two major parts:

- A dev server that provides rich feature enhancements over native ES modules, for example extremely fast Hot Module Replacement (HMR).

- A build command that bundles your code with Rollup, pre-configured to output highly optimized static assets for production.

Vite is opinionated and comes with sensible defaults out of the box.  Support for frameworks or integration with other tools is possible through Plugins. Vite is also highly extensible via its Plugin API and JavaScript API with full typing support.

#### Why Vite

Before ES modules were available in browsers, developers had no native mechanism for authoring JavaScript in a modularized fashion. This is why we are all familiar with the concept of "bundling": using tools that crawl, process and concatenate our source modules into files that can run in the browser.

However, as we build more and more ambitious applications, the amount of JavaScript we are dealing with is also increasing dramatically.  We are starting to hit a performance bottleneck for JavaScript based tooling: The slow feedback loop can greatly affect developers' productivity and happiness.

Vite aims to address these issues by leveraging new advancements in the ecosystem: the availability of native ES modules in the browser, and the rise of JavaScript tools written in compile-to-native languages.

Vite improves the dev server start time by first dividing the modules in an application into two categories: dependencies and source code.

Dependencies are mostly plain JavaScript that do not change often during development. Some large dependencies (e.g. component libraries with hundreds of modules) are also quite expensive to process. Dependencies may also be shipped in various module formats (e.g. ESM or CommonJS).

Vite pre-bundles dependencies using esbuild. esbuild is written in Go and pre-bundles dependencies 10-100x faster than JavaScript-based bundlers.

Source code often contains non-plain JavaScript that needs transforming (e.g. JSX, CSS or Vue/Svelte components), and will be edited very often. Also, not all source code needs to be loaded at the same time (e.g. with route-based code-splitting).

Vite serves source code over native ESM. This is essentially letting the browser take over part of the job of a bundler: Vite only needs to transform and serve source code on demand, as the browser requests it. Code behind conditional dynamic imports is only processed if actually used on the current screen.

```
Q: What is Vite?

A: Vite is a frontend tool that is used for building fast and optimized web applications. It uses a modern build system and a fast development server to provide a streamlined and efficient development experience.

Q: How does Vite work?

A: Vite uses native ES modules and rollup to compile and optimize your code for production, resulting in faster build times and smaller bundle sizes. It also provides a fast and lightweight development server that enables you to see changes in real-time as you write code.

Q: Can I use Vite with other frontend technologies, such as React or Vue.js?

A: Yes, Vite is designed to work seamlessly with modern web development tools and technologies, including React and Vue.js.

Q: What is the difference between Vite and Create React App?

A: The main differences between Vite and Create React App include their build systems, development servers, and ecosystem compatibility. Vite uses a faster and more efficient build system and provides a faster and more efficient development server, while Create React App has a larger and more established ecosystem.
```

### React
