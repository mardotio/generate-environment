# Generate environment

Fetches the sepcified environment variables and returns an object containing the
fetched values, or a list of environment variables that are missing. Supports
optional environment variables to prevent returning an error if the variable was
missing. The resulting object is typed to contain all keys that were requested
and are typed as `string` if required, or `string | null` if marked as optional.

## Install

```
npm i @mardotio/generate-environment
```

## Usage

### Validating required environment variables

```ts
  // With the following environment
  // FOO=hello
  // BAR=world
  generateEnvironment({
    required: ['FOO', 'BAR'] as const,
  });
  // results in:
  // {
  //   errors: null,
  //   environment: {
  //     FOO: 'hello',
  //     BAR: 'world',
  //   },
  // }
```

```ts
  // With the following environment
  // FOO=hello
  generateEnvironment({
    required: ['FOO', 'BAR'] as const,
  });
  // results in:
  // {
  //   errors: ['BAR'],
  //   environment: null,
  // }
```

### Optional environment variables

```ts
  // With the following environment
  // FOO=hello
  // BAR=world
  generateEnvironment({
    required: ['FOO'] as const,
    optional: ['BAR'] as const,
  });
  // results in:
  // {
  //   errors: null,
  //   environment: {
  //     FOO: 'hello',
  //     BAR: 'world',
  //   },
  // }
```

```ts
  // With the following environment
  // FOO=hello
  generateEnvironment({
    required: ['FOO'] as const,
    optional: ['BAR'] as const,
  });
  // results in:
  // {
  //   errors: null,
  //   environment: {
  //     FOO: 'hello',
  //     BAR: null,
  //   },
  // }
```
