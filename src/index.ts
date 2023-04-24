import { AppwriteSync } from "./appwrite-sync";

const main = async () => {
  const app = new AppwriteSync({
    source: {
      endpoint: "http://localhost/v1",
      project: "intranet",
      key: "e424448744767b0de4ed46e8b92c3d607814880dd603c4347ba09d482a16b4c44de0fad9b5cbe5fd86d2bc0747fee3b703dfdb3c2e63507c413eb79e4dec56f2ce48ea7bb9fbfddcabcadf22dafb7aedc46821af2f473d044909f8e7b655ccb67b9de3bdbf51b7a864fe15a17256263b27bc34b01d8081810d6c806da443c244",
      selfSigned: true,
    },
    target: {
      endpoint: "https://api.imda.cl/v1",
      project: "intranet",
      key: "eaf3e0f6dc73db7e3d3ad3de3f00421d03fa6628249bac444a36b0f2fa3705523d729ae5dd4f48bab2957862cc4c19d670368a2e8335afb53d714a5456ef8c8ce96272430c77a00ce43d072e675d0cddb497a6d013181ecf808a4d870466577e264496839c3dc4e5f1b36a7168d15f4d2d8af6d78883a69e9b3541c45b5184af",
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
