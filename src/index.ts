import { AppwriteSync } from "./appwrite-sync";

const main = async () => {
  const app = new AppwriteSync({
    source: {
      endpoint: "...",
      project: "...",
      key: "...",
      selfSigned: true,
    },
    target: {
      endpoint: "...",
      project: "...",
      key: "...",
    },
  });

  await app.sync({
    syncDatabases: false,
    syncCollections: false,
    syncAttributes: false,
    syncIndexes: false,
    syncDocuments: true,
  });
};

main();
