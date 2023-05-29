import { Client, Databases, Models, Query } from "node-appwrite";

interface ClientData {
  endpoint: string;
  project: string;
  key: string;
  jwt?: string;
  locale?: string;
  selfSigned?: boolean;
}

interface SyncAppwriteInstancesOptions {
  source: ClientData;
  target: ClientData;
  sourceDatabasesId?: string;
  targetDatabasesId?: string;
  sourceCollectionsId?: string;
  targetCollectionsId?: string;
}

interface SyncAppwriteOptions {
  syncDatabases?: boolean;
  syncCollections?: boolean;
  syncAttributes?: boolean;
  syncIndexes?: boolean;
  syncDocuments?: boolean;
}

// Helper function to compare two indexes
function compareIndexes(
  sourceIndex: Models.Index,
  targetIndex: Models.Index
): boolean {
  return (
    sourceIndex.key === targetIndex.key &&
    sourceIndex.type === targetIndex.type &&
    sourceIndex.status === targetIndex.status &&
    JSON.stringify(sourceIndex.attributes) ===
      JSON.stringify(targetIndex.attributes)
  );
}

// Helper function to compare two documents
function compareDocuments(sourceDocument: any, targetDocument: any): boolean {
  const sourceData = { ...sourceDocument };
  const targetData = { ...targetDocument };

  delete sourceData.$id;
  delete targetData.$id;

  return JSON.stringify(sourceData) === JSON.stringify(targetData);
}

export class AppwriteSync {
  private sourceClient: Client;
  private targetClient: Client;
  private sourceDatabasesId?: string = "";
  private targetDatabasesId?: string = "";
  private sourceCollectionsId?: string = "";
  private targetCollectionsId?: string = "";
  private sourceDatabasesList: Models.Database[] = [];
  private targetDatabasesList: Models.Database[] = [];
  private sourceCollectionsList: Record<string, Models.Collection[]> = {};
  private targetCollectionsList: Record<string, Models.Collection[]> = {};

  constructor(options: SyncAppwriteInstancesOptions) {
    this.sourceDatabasesId = options.sourceDatabasesId;
    this.sourceCollectionsId = options.sourceCollectionsId;
    this.targetDatabasesId = options.targetDatabasesId;
    this.targetCollectionsId = options.targetCollectionsId;

    // source
    this.sourceClient = new Client()
      .setEndpoint(options.source.endpoint)
      .setProject(options.source.project)
      .setKey(options.source.key)
      .setSelfSigned(options.source.selfSigned);

    if (options.source.jwt) {
      this.sourceClient.setJWT(options.source.jwt);
    }

    if (options.source.locale) {
      this.sourceClient.setLocale(options.source.locale);
    }

    // target
    this.targetClient = new Client()
      .setEndpoint(options.target.endpoint)
      .setProject(options.target.project)
      .setKey(options.target.key)
      .setSelfSigned(options.target.selfSigned);

    if (options.target.jwt) {
      this.targetClient.setJWT(options.target.jwt);
    }

    if (options.target.locale) {
      this.targetClient.setLocale(options.target.locale);
    }
  }

  private async useDatabases() {
    const source = new Databases(this.sourceClient);
    const target = new Databases(this.targetClient);

    return [source, target];
  }

  async getDatabases() {
    const [source, target] = await this.useDatabases();

    if (this.sourceDatabasesId && this.targetDatabasesId) {
      try {
        const sourceDatabaseList = await source.get(this.sourceDatabasesId);

        this.sourceDatabasesList = [sourceDatabaseList];
      } catch {}

      try {
        const targetDatabaseList = await target.get(this.targetDatabasesId);

        this.targetDatabasesList = [targetDatabaseList];
      } catch {}
    } else {
      const sourceDatabasesList = await source.list();
      this.sourceDatabasesList = sourceDatabasesList.databases;

      const targetDatabasesList = await target.list();
      this.targetDatabasesList = targetDatabasesList.databases;
    }
  }

  async getCollections() {
    const [source, target] = await this.useDatabases();

    if (
      this.sourceDatabasesId &&
      this.targetDatabasesId &&
      this.sourceCollectionsId &&
      this.targetCollectionsId
    ) {
      try {
        const sourceCollectionsList = await source.getCollection(
          this.sourceDatabasesId,
          this.sourceCollectionsId
        );

        this.sourceCollectionsList[this.sourceCollectionsId] = [
          sourceCollectionsList,
        ];
      } catch {}

      try {
        const targetCollectionsList = await target.getCollection(
          this.targetDatabasesId,
          this.targetCollectionsId
        );

        this.targetCollectionsList[this.targetCollectionsId] = [
          targetCollectionsList,
        ];
      } catch {}
    } else {
      await this.getDatabases();

      for (const sourceDatabase of this.sourceDatabasesList) {
        const sourceCollectionsList = await source.listCollections(
          sourceDatabase.$id
        );
        this.sourceCollectionsList[sourceDatabase.$id] =
          sourceCollectionsList.collections;

        for (const targetDatabase of this.targetDatabasesList) {
          const targetCollectionsList = await target.listCollections(
            targetDatabase.$id
          );
          this.targetCollectionsList[targetDatabase.$id] =
            targetCollectionsList.collections;
        }
      }
    }
  }

  private async syncDatabases() {
    const [_, target] = await this.useDatabases();

    // get all databses
    await this.getDatabases();

    for (const sourceDB of this.sourceDatabasesList) {
      const targetDB = this.targetDatabasesList.find(
        (targetDB: any) =>
          targetDB.$id === sourceDB.$id ||
          this.targetDatabasesId === targetDB.$id
      );

      if (!targetDB) {
        await target.create(
          this.targetDatabasesId || sourceDB.$id,
          this.targetDatabasesId || sourceDB.name
        );
      }
    }
    console.info("end syncing databases");
  }
  catch(error: any) {
    return Promise.reject(`Error syncing attributes: ${error}`);
  }

  private async syncCollections() {
    const [_, target] = await this.useDatabases();

    // get all databases and collections
    await this.getDatabases();
    await this.getCollections();

    // try {
    for (const sourceDatabase of this.sourceDatabasesList) {
      for (const sourceCollection of this.sourceCollectionsList[
        sourceDatabase.$id
      ]) {
        const targetCollection = this.targetCollectionsList[
          sourceDatabase.$id
        ].find(
          (targetCollection: any) =>
            targetCollection.$id === sourceCollection.$id
        );

        if (!targetCollection) {
          await target.createCollection(
            sourceDatabase.$id,
            sourceCollection.$id,
            sourceCollection.name,
            sourceCollection.$permissions,
            sourceCollection.documentSecurity
          );
        }
      }
    }
    // } catch (error) {
    //   return Promise.reject(`Error syncing collections: ${error}`);
    // }
  }

  private async syncAttributes() {
    const [source, target] = await this.useDatabases();

    // get all databases and collections
    await this.getDatabases();
    await this.getCollections();

    try {
      for (const database of this.sourceDatabasesList) {
        for (const collection of this.sourceCollectionsList[database.$id]) {
          const sourceAttributesResponse = await source.listAttributes(
            database.$id,
            collection.$id
          );

          const targetAttributesResponse = await target.listAttributes(
            database.$id,
            collection.$id
          );

          const sourceAttributes: any[] = sourceAttributesResponse.attributes;
          const targetAttributes: any[] = targetAttributesResponse.attributes;

          for (const sourceAttribute of sourceAttributes) {
            const targetAttribute = targetAttributes.find(
              (attr: any) => attr.key === sourceAttribute.key
            );

            if (!targetAttribute) {
              const createMethod = `create${
                sourceAttribute.type.charAt(0).toUpperCase() +
                sourceAttribute.type.slice(1)
              }Attribute`;

              console.info(sourceAttribute.type);

              switch (sourceAttribute.type) {
                case "datetime":
                  await (target as any)[createMethod](
                    database.$id,
                    collection.$id,
                    sourceAttribute.key,
                    sourceAttribute.required,
                    sourceAttribute.default,
                    sourceAttribute.array
                  );
                  break;
                case "relationship":
                  await (target as any)[createMethod](
                    database.$id,
                    collection.$id,
                    sourceAttribute.relatedCollection,
                    sourceAttribute.relationType,
                    sourceAttribute.twoWay,
                    sourceAttribute.key,
                    sourceAttribute.twoWayKey,
                    sourceAttribute.onDelete
                  );
                  break;
                case "integer":
                  await (target as any)[createMethod](
                    database.$id,
                    collection.$id,
                    sourceAttribute.key,
                    sourceAttribute.required,
                    sourceAttribute.min,
                    sourceAttribute.max,
                    sourceAttribute.default,
                    sourceAttribute.array
                  );
                  break;
                default:
                  await (target as any)[createMethod](
                    database.$id,
                    collection.$id,
                    sourceAttribute.key,
                    sourceAttribute.size || 100,
                    sourceAttribute.required,
                    sourceAttribute.default,
                    sourceAttribute.array
                  );
                  break;
              }
            }
          }
        }
      }
    } catch (error) {
      return console.error(error);
    }
  }

  private async syncIndexes() {
    const [source, target] = await this.useDatabases();

    // get all databases and collections
    await this.getDatabases();
    await this.getCollections();

    for (const database of this.sourceDatabasesList) {
      for (const collection of this.sourceCollectionsList[database.$id]) {
        // Fetch indexes from both source and destination collections
        const sourceIndexes = await source.listIndexes(
          database.$id,
          collection.$id
        );
        const targetIndexes = await target.listIndexes(
          database.$id,
          collection.$id
        );

        // Create a Map with the destination indexes using index name as key
        const targetIndexMap: Map<string, Models.Index> = new Map();

        for (const index of targetIndexes.indexes) {
          targetIndexMap.set(index.key, index);
        }

        // Iterate through source indexes and sync with the destination indexes
        for (const sourceIndex of sourceIndexes.indexes) {
          const targetIndex = targetIndexMap.get(sourceIndex.key);

          if (!targetIndex) {
            // Create index if it doesn't exist in the destination
            await target.createIndex(
              database.$id,
              collection.$id,
              sourceIndex.key,
              sourceIndex.type,
              sourceIndex.attributes,
              sourceIndex.orders
            );
          } else {
            // Compare the source and destination indexes, update if necessary
            const indexesMatch = compareIndexes(sourceIndex, targetIndex);

            if (!indexesMatch) {
              // Update the index in the destination
              await target.deleteIndex(
                database.$id,
                collection.$id,
                targetIndex.key
              );
              await target.createIndex(
                database.$id,
                collection.$id,
                targetIndex.key,
                sourceIndex.type,
                sourceIndex.attributes,
                sourceIndex.orders
              );
            }

            // Remove the matched index from the destination Map
            targetIndexMap.delete(sourceIndex.key);
          }
        }
      }
    }
  }

  private async syncDocuments() {
    const [source, target] = await this.useDatabases();

    // get all databases and collections
    await this.getDatabases();
    await this.getCollections();

    let sourceDocuments: Models.Document[] | undefined;
    const limit = 10;

    for (const database of this.sourceDatabasesList) {
      console.info(`\n- database: ${database.$id}`);

      for (const collection of this.sourceCollectionsList[database.$id]) {
        let totalSource = 0;
        // start and reset cursor Id
        let lastId: string | undefined = undefined;

        console.info(`-- collection: ${collection.$id}`);

        do {
          let query = [Query.limit(limit)];

          console.info(`--- lastId: ${lastId}`);

          if (lastId) {
            query.push(Query.cursorAfter(lastId));
          }

          console.info(`--- quering: ${limit} items`);
          // Fetch documents from the source collection
          const responseSourceDocuments = await source.listDocuments(
            database.$id,
            collection.$id,
            query
          );

          sourceDocuments = responseSourceDocuments.documents;
          totalSource = sourceDocuments.length;

          const sourceDocumentIds = sourceDocuments.map((doc) => doc.$id);

          lastId = sourceDocumentIds.at(-1);

          // Fetch matching documents from the destination collection
          let targetDocuments: Models.Document[] = [];

          if (sourceDocumentIds.length > 0) {
            const responseTargetDocuments = await target.listDocuments(
              database.$id,
              collection.$id,
              [Query.equal("$id", sourceDocumentIds)]
            );

            targetDocuments = responseTargetDocuments.documents;
          }

          // Create a Map with the destination documents using document ID as key
          const targetDocumentMap: Map<string, any> = new Map();

          for (const targetDoc of targetDocuments) {
            targetDocumentMap.set(targetDoc.$id, targetDoc);
          }

          // Iterate through source documents and sync with the destination documents
          for (const sourceDocument of sourceDocuments) {
            console.info(`--- syncing document ${sourceDocument.$id}`);

            const targetDocument = targetDocumentMap.get(sourceDocument.$id);
            // Create document if it doesn't exist in the destination
            // calling $collectionId, $databaseId, $createdAt, $permissions,
            // $updatedAt to avoid 'unknown attribute' error
            const {
              $id,
              $collectionId,
              $databaseId,
              $createdAt,
              $permissions,
              $updatedAt,
              ...documentData
            } = sourceDocument;

            Object.keys(documentData).forEach((key) => {
              try {
                if ("$databaseId" in documentData[key]) {
                  documentData[key] = documentData[key]["$id"];
                }
              } catch {}
            });

            if (!targetDocument) {
              console.info("--- creating", $id);

              await target.createDocument(
                database.$id,
                collection.$id,
                $id,
                documentData,
                $permissions
              );
            } else {
              // Compare the source and destination documents, update if necessary
              const documentsMatch = compareDocuments(
                sourceDocument,
                targetDocument
              );

              if (!documentsMatch) {
                console.info("--- updating", $id);
                // Update the document in the destination
                await target.updateDocument(
                  database.$id,
                  collection.$id,
                  $id,
                  documentData
                );
              }
            }
          }
        } while (totalSource === limit);
      }
    }
  }

  async sync(options: SyncAppwriteOptions) {
    console.info("starting sync");
    console.info(`Options:\n${JSON.stringify(options, null, "\r")}`);

    if (options.syncDatabases) {
      console.info("syncing databases");
      await this.syncDatabases();
    }

    if (options.syncCollections) {
      console.info("Syncing collections");
      await this.syncCollections();
    }

    if (options.syncAttributes) {
      console.info("syncing attributes");
      await this.syncAttributes();
    }

    if (options.syncIndexes) {
      console.info("syncing indexes");
      await this.syncIndexes();
    }

    if (options.syncDocuments) {
      console.info("syncing documents");
      await this.syncDocuments();
    }
  }
}
