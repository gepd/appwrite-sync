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

4. finally, you must have instaled `tsc` to compile and run the code, use `tsc&&node ./dist/index.js`

### License

This repository is available under the MIT License.
