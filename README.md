## Appwrite Sync

### 🚧 This is an experimental project, backup your data before use it

This is a small, and currently exprimental project, to sync two appwrite instances.

Note: this is a comunity project and isn't maintained by appwrite

### How to use it

1. Clone this repository

2. run `yarn install`

3. To make it work you need to initialize the `AppwriteSync` class like this

```ts
// index.ts
const app = new AppwriteSync({
  source: {
    endpoint: "",
    project: "",
    key: "",
  },
  target: {
    endpoint: "",
    project: "",
    key: "",
  },
});
```

After this you can sync the two instances with the `sync` method.

```ts
// index.ts
app.sync({
  syncDatabases: true,
  syncCollections: true,
  syncAttributes: true,
  syncIndexes: true,
  syncDocuments: true,
});
```

You can change each option to false to start to sync.

4. finally run `node ./dist/index.js`

### Development

if you update any typescipt file re-compile the code with the `tsc` command (you need to install typescript), after this run `node ./dist/index.js` again

### License

This repository is available under the MIT License.
