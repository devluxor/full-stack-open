# Custom hooks

Custom hooks
React offers the option to create custom hooks. According to React, the primary purpose of custom hooks is to facilitate the reuse of the logic used in components.

Building your own Hooks lets you extract component logic into reusable functions.

Custom hooks are regular JavaScript functions that can use any other hooks, as long as they adhere to the rules of hooks. Additionally, the name of custom hooks must start with the word use.

Let's recap the rules of using hooks, copied verbatim from the official React documentation:

- Don’t call Hooks inside loops, conditions, or nested functions. Instead, always use Hooks at the top level of your React function.

- Don’t call Hooks from regular JavaScript functions. Instead, you can:

    - Call Hooks from React function components.
    - Call Hooks from custom Hooks

