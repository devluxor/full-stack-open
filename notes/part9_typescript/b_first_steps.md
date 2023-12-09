# b: First steps with TypeScript

- how to execute ts code: ts-node

- where to find types for libraries, frameworks, projects, etc:

>Usually, types for existing packages can be found from the `@types` organization within `npm`, and you can add the relevant types to your project by installing an `npm` package with the name of your package with a `@types/` prefix. For example:

```sh
npm install --save-dev @types/react @types/express @types/lodash @types/jest @types/mongoose
```

- [Definitely typed](https://github.com/DefinitelyTyped/DefinitelyTyped)

The *@types/** are maintained by Definitely typed, a community project to maintain types of everything in one place.

Sometimes, an npm package can also include its types within the code and, in that case, installing the corresponding *@types/** is not necessary.

NB: Since the typings are only used before compilation, the typings are not needed in the production build and they should always be in the devDependencies of the package.json.

Since the global variable process is defined by Node itself, we get its typings from the package @types/node.

Since version 10.0 ts-node has defined @types/node as a peer dependency. If the version of npm is at least 7.0, the peer dependencies of a project are automatically installed by npm. If you have an older npm, the peer dependency must be installed explicitly:

- For example, for express apps, we install types for Express:

```bash
npm install --save-dev @types/express
```

This will make TS to infer types properly, for example, for `req` and `res` arguments.

- About modules:

> A single tsconfig.json can only represent a single environment, both in terms of what globals are available and in terms of how modules behave. If your app contains server code, DOM code, web worker code, test code, and code to be shared by all of those, each of those should have its own tsconfig.json, connected with project references. Then, use this guide once for each tsconfig.json. For library-like projects within an app, especially ones that need to run in multiple runtime environments, use the “I’m writing a library” section.

See official doc.

- The TS alternative to nodemon (autoreloader in development mode):

`ts-node-dev`:

```sh
npm install --save-dev ts-node-dev
```

- Install ESLint for TS projects:

```sh
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

- Typical setup for TS projects

    - folder init. `npm init`
    -  `npm install typescript --save-dev`
    - package.json:
    ```js
      {
        // ..
        "scripts": {

          "tsc": "tsc"
        },
        // ..
      }
    ```
    -  npm run tsc -- --init
    - typical active rules in tsconfig.json:
    ```js
    {
      "compilerOptions": {
        "target": "ES6",
        "outDir": "./build/",
        "module": "commonjs",
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true,
        "esModuleInterop": true
      }
    }
    ```
    - eslint dependencies:
    `npm install express
npm install --save-dev eslint @types/express @typescript-eslint/eslint-plugin @typescript-eslint/parser`
    - package.json:

 ```js
          {
        "name": "flight-diary",
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "scripts": {
          "tsc": "tsc",
          "dev": "ts-node-dev index.ts",
          "lint": "eslint --ext .ts .",
          "start": "node build/index.js"
        },
        "author": "",
        "license": "ISC",
        "dependencies": {
          "express": "^4.18.2"
        },
        "devDependencies": {
          "@types/express": "^4.17.18",
          "@typescript-eslint/eslint-plugin": "^6.7.3",
          "@typescript-eslint/parser": "^6.7.3",
          "eslint": "^8.50.0",
          "typescript": "^5.2.2"
        }
      }
```

    - `.eslintrc`:

```js
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "plugins": ["@typescript-eslint"],
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "rules": {
    "@typescript-eslint/semi": ["error"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "no-case-declarations": "off"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```
- autoreloader:
 ```js
 npm install --save-dev ts-node-dev
 ```
- `.lint`