<div align="center">

# React Event Modifier

Enhances React elements with Svelte-inspired event modifiers.

</div>

## 📖 Overview

[Svelte has a nice feature](https://svelte.io/docs#template-syntax-element-directives-on-eventname) to modify events in useful ways. For example you can quickly call `stopPropagation()` or `preventDefault()` on your events with simple 'modifiers' on an element.

This library brings some of that functionality to React in a tiny ~1kB package.

### How Svelte does it

```html
<button on:click|stopPropagation="{handleClick}">
  <!-- The click event wont't propagate -->
</button>

<form on:submit|preventDefault="{handleSubmit}">
  <!-- The submit event won't reload the page -->
</form>
```

### How `react-event-modifiers` does it

```jsx
import mod from "react-event-modifiers"

<mod.button onClick-stopPropagation={handleClick}>
    {/* The click event wont't propagate */}
</mod.button>

<mod.form onSubmit-preventDefault={handleSubmit}>
    {/* The submit event won't reload the page */}
</mod.form>
```

---

## 🚀 Get started

Install the library:

```shell
npm i react-event-modifiers
```

When you have an element you wish to update like this:

```jsx
<button onClick={handleClick}>Click me</button>
```

Then import the library and update the element as follows:

```jsx
import mod from "react-event-modifiers"

<mod.button onClick-stopPropagation={handleClick}>Click me</mod.button>
```

Note the `mod.` prefix to the element, and the `-stopPropagation` modifier to the event handler prop.

You can use modifiers without a handler like this:

```jsx
<mod.button onClick-stopPropagation>Click me</mod.button>
```

and chain modifiers together like this:

```jsx
<mod.button onClick-preventDefault-stopPropagation={handleClick}>Click me</mod.button>
```


All native JSX elements are supported and this library should act as a drop in replacement which doesn't affect other props.
Typescript is fully supported too!

![Typescript example](https://github.com/kangabru/react-event-modifiers/blob/assets/images/types_example.png?raw=true)


Note that the only Svelte modifiers that are supported are `stopPropagation` and `preventDefault`. React [already supports](https://react.dev/learn/responding-to-events#capture-phase-events) `capture` events and other modifiers were deemed too niche to implement.

---

## 🧐 How it works

Part of the reason for building this little library was to see if this was possible.

It works as follows:

- Importing `react-event-modifier` returns a [proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object.
- When you call `<mod.div ...>` the proxy is called with the keyword 'div' and all of the react props.
- This library can then create a normal react 'div' element and modify the props in any way we like.
- Typescript is used to ensure that only native elements (like `div`) and event handlers (like `onClick`) are modifiable.

Modifying the props:

- The props are given as a simple JS object with keys/vals like `{ "onClick-stopPropagation": customHandler }`.
- This library can then strip out the modifiers like `-stopPropagation` and wrap functions with an appropriate handler.
- Finally the new handler is assigned to the default keyword and the result is a modified object like `{ "onClick": (e) => { e.stopPropagation(); customHandler(e) } }`

Creating the types:

- One critical piece of this library is ensuring that React types are maintained when using the library. For example:
    - The element `<mod.div>` should have all of the props and types of `<div>`
    - The handler `<mod.div onClick-stopPropagation={...}>` should have the same signature as `onClick={...}`
- The library uses all features of the [Creating types from types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) handbook guide importantly:
  - [Mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html) to copy and modify the original `JSX.IntrinsicElements` types into custom ones
  - [Template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) to modify event types like `onClick` to `onClick-stopPropagation`
- Finally this library even has Typescript tests which cover important use cases. E.g. testing that non-modifiable props like `className` are not polluted with modifiers.

---

## 🤷 Is this actually useful?

It's a definitely a _tiny_ quality of life feature but it comes in handy. It really shines when making games and modals where there are many overlaying clickable elements. Having a simple modifier can keep code clean and even save you from making your own click wrappers. It's also a nice feature if you're writing a lot of client-side forms.

---

## 💻 Development

Issues and PRs are welcome!

Useful commands:
- Run tests: `npm run tests`
- Run linting etc: `npm run check`
- Run the UI demo: `cd react-demo-ts/` then `npm run dev`
- Build: `npm run build`
