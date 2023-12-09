# More topics

We can refer to other types' fields within other types' definitions. For example, if we already have a `Diagnosis` type

```js
export interface Diagnosis {
  code: string,
  name: string,
  latin?: string
}
```

we might just want to refer to that code field of the `Diagnosis` type directly in case its type ever change:

```js
interface BaseEntry {
  id: string
  description: string
  date: string
  specialist: string

  diagnosisCodes?: Array<Diagnosis['code']> // !!
}
```

## `Omit` with unions

See: <https://github.com/microsoft/TypeScript/issues/42680>

An important point concerning unions is that, when you use them with `Omit` to exclude a property, it works in a possibly unexpected way. Suppose that we want to remove the `id` from each Entry. We could think of using

```js
Omit<Entry, 'id'>
```

but it wouldn't work as we might expect: **the resulting type would only contain the common properties, but not the ones they don't share.** Hence, any union that is passed as the first type to Omit, is being considered as an intersection instead.

A possible workaround is to define a special Omit-like function to deal with such situations:

```js
// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
type EntryWithoutId = UnionOmit<Entry, 'id'>;
```


