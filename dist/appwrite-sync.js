"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppwriteSync = void 0;
var node_appwrite_1 = require("node-appwrite");
function compareIndexes(sourceIndex, targetIndex) {
    return (sourceIndex.key === targetIndex.key &&
        sourceIndex.type === targetIndex.type &&
        sourceIndex.status === targetIndex.status &&
        JSON.stringify(sourceIndex.attributes) ===
            JSON.stringify(targetIndex.attributes));
}
function compareDocuments(sourceDocument, targetDocument) {
    var sourceData = __assign({}, sourceDocument);
    var targetData = __assign({}, targetDocument);
    delete sourceData.$id;
    delete targetData.$id;
    return JSON.stringify(sourceData) === JSON.stringify(targetData);
}
var AppwriteSync = (function () {
    function AppwriteSync(options) {
        this.sourceDatabasesId = "";
        this.targetDatabasesId = "";
        this.sourceCollectionsId = "";
        this.targetCollectionsId = "";
        this.sourceDatabasesList = [];
        this.targetDatabasesList = [];
        this.sourceCollectionsList = {};
        this.targetCollectionsList = {};
        this.sourceDatabasesId = options.sourceDatabasesId;
        this.sourceCollectionsId = options.sourceCollectionsId;
        this.targetDatabasesId = options.targetDatabasesId;
        this.targetCollectionsId = options.targetCollectionsId;
        this.sourceClient = new node_appwrite_1.Client()
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
        this.targetClient = new node_appwrite_1.Client()
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
    AppwriteSync.prototype.useDatabases = function () {
        return __awaiter(this, void 0, void 0, function () {
            var source, target;
            return __generator(this, function (_a) {
                source = new node_appwrite_1.Databases(this.sourceClient);
                target = new node_appwrite_1.Databases(this.targetClient);
                return [2, [source, target]];
            });
        });
    };
    AppwriteSync.prototype.getDatabases = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, source, target, sourceDatabaseList, _b, targetDatabaseList, _c, sourceDatabasesList, targetDatabasesList;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4, this.useDatabases()];
                    case 1:
                        _a = _d.sent(), source = _a[0], target = _a[1];
                        if (!(this.sourceDatabasesId && this.targetDatabasesId)) return [3, 9];
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 4, , 5]);
                        return [4, source.get(this.sourceDatabasesId)];
                    case 3:
                        sourceDatabaseList = _d.sent();
                        this.sourceDatabasesList = [sourceDatabaseList];
                        return [3, 5];
                    case 4:
                        _b = _d.sent();
                        return [3, 5];
                    case 5:
                        _d.trys.push([5, 7, , 8]);
                        return [4, target.get(this.targetDatabasesId)];
                    case 6:
                        targetDatabaseList = _d.sent();
                        this.targetDatabasesList = [targetDatabaseList];
                        return [3, 8];
                    case 7:
                        _c = _d.sent();
                        return [3, 8];
                    case 8: return [3, 12];
                    case 9: return [4, source.list()];
                    case 10:
                        sourceDatabasesList = _d.sent();
                        this.sourceDatabasesList = sourceDatabasesList.databases;
                        return [4, target.list()];
                    case 11:
                        targetDatabasesList = _d.sent();
                        this.targetDatabasesList = targetDatabasesList.databases;
                        _d.label = 12;
                    case 12: return [2];
                }
            });
        });
    };
    AppwriteSync.prototype.getCollections = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, source, target, sourceCollectionsList, _b, targetCollectionsList, _c, _i, _d, sourceDatabase, sourceCollectionsList, _e, _f, targetDatabase, targetCollectionsList;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4, this.useDatabases()];
                    case 1:
                        _a = _g.sent(), source = _a[0], target = _a[1];
                        if (!(this.sourceDatabasesId &&
                            this.targetDatabasesId &&
                            this.sourceCollectionsId &&
                            this.targetCollectionsId)) return [3, 9];
                        _g.label = 2;
                    case 2:
                        _g.trys.push([2, 4, , 5]);
                        return [4, source.getCollection(this.sourceDatabasesId, this.sourceCollectionsId)];
                    case 3:
                        sourceCollectionsList = _g.sent();
                        this.sourceCollectionsList[this.sourceCollectionsId] = [
                            sourceCollectionsList,
                        ];
                        return [3, 5];
                    case 4:
                        _b = _g.sent();
                        return [3, 5];
                    case 5:
                        _g.trys.push([5, 7, , 8]);
                        return [4, target.getCollection(this.targetDatabasesId, this.targetCollectionsId)];
                    case 6:
                        targetCollectionsList = _g.sent();
                        this.targetCollectionsList[this.targetCollectionsId] = [
                            targetCollectionsList,
                        ];
                        return [3, 8];
                    case 7:
                        _c = _g.sent();
                        return [3, 8];
                    case 8: return [3, 17];
                    case 9: return [4, this.getDatabases()];
                    case 10:
                        _g.sent();
                        _i = 0, _d = this.sourceDatabasesList;
                        _g.label = 11;
                    case 11:
                        if (!(_i < _d.length)) return [3, 17];
                        sourceDatabase = _d[_i];
                        return [4, source.listCollections(sourceDatabase.$id)];
                    case 12:
                        sourceCollectionsList = _g.sent();
                        this.sourceCollectionsList[sourceDatabase.$id] =
                            sourceCollectionsList.collections;
                        _e = 0, _f = this.targetDatabasesList;
                        _g.label = 13;
                    case 13:
                        if (!(_e < _f.length)) return [3, 16];
                        targetDatabase = _f[_e];
                        return [4, target.listCollections(targetDatabase.$id)];
                    case 14:
                        targetCollectionsList = _g.sent();
                        this.targetCollectionsList[targetDatabase.$id] =
                            targetCollectionsList.collections;
                        _g.label = 15;
                    case 15:
                        _e++;
                        return [3, 13];
                    case 16:
                        _i++;
                        return [3, 11];
                    case 17: return [2];
                }
            });
        });
    };
    AppwriteSync.prototype.syncDatabases = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _, target, _loop_1, this_1, _i, _b, sourceDB;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, this.useDatabases()];
                    case 1:
                        _a = _c.sent(), _ = _a[0], target = _a[1];
                        return [4, this.getDatabases()];
                    case 2:
                        _c.sent();
                        _loop_1 = function (sourceDB) {
                            var targetDB;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        targetDB = this_1.targetDatabasesList.find(function (targetDB) {
                                            return targetDB.$id === sourceDB.$id ||
                                                _this.targetDatabasesId === targetDB.$id;
                                        });
                                        if (!!targetDB) return [3, 2];
                                        return [4, target.create(this_1.targetDatabasesId || sourceDB.$id, this_1.targetDatabasesId || sourceDB.name)];
                                    case 1:
                                        _d.sent();
                                        _d.label = 2;
                                    case 2: return [2];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _b = this.sourceDatabasesList;
                        _c.label = 3;
                    case 3:
                        if (!(_i < _b.length)) return [3, 6];
                        sourceDB = _b[_i];
                        return [5, _loop_1(sourceDB)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3, 3];
                    case 6:
                        console.info("end syncing databases");
                        return [2];
                }
            });
        });
    };
    AppwriteSync.prototype.catch = function (error) {
        return Promise.reject("Error syncing attributes: ".concat(error));
    };
    AppwriteSync.prototype.syncCollections = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _, target, _i, _b, sourceDatabase, _loop_2, this_2, _c, _d, sourceCollection;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4, this.useDatabases()];
                    case 1:
                        _a = _e.sent(), _ = _a[0], target = _a[1];
                        return [4, this.getDatabases()];
                    case 2:
                        _e.sent();
                        return [4, this.getCollections()];
                    case 3:
                        _e.sent();
                        _i = 0, _b = this.sourceDatabasesList;
                        _e.label = 4;
                    case 4:
                        if (!(_i < _b.length)) return [3, 9];
                        sourceDatabase = _b[_i];
                        _loop_2 = function (sourceCollection) {
                            var targetCollection;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        targetCollection = this_2.targetCollectionsList[sourceDatabase.$id].find(function (targetCollection) {
                                            return targetCollection.$id === sourceCollection.$id;
                                        });
                                        if (!!targetCollection) return [3, 2];
                                        return [4, target.createCollection(sourceDatabase.$id, sourceCollection.$id, sourceCollection.name, sourceCollection.$permissions, sourceCollection.documentSecurity)];
                                    case 1:
                                        _f.sent();
                                        _f.label = 2;
                                    case 2: return [2];
                                }
                            });
                        };
                        this_2 = this;
                        _c = 0, _d = this.sourceCollectionsList[sourceDatabase.$id];
                        _e.label = 5;
                    case 5:
                        if (!(_c < _d.length)) return [3, 8];
                        sourceCollection = _d[_c];
                        return [5, _loop_2(sourceCollection)];
                    case 6:
                        _e.sent();
                        _e.label = 7;
                    case 7:
                        _c++;
                        return [3, 5];
                    case 8:
                        _i++;
                        return [3, 4];
                    case 9: return [2];
                }
            });
        });
    };
    AppwriteSync.prototype.syncAttributes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, source, target, _i, _b, database, _c, _d, collection, sourceAttributesResponse, targetAttributesResponse, sourceAttributes, targetAttributes, _loop_3, _e, sourceAttributes_1, sourceAttribute, error_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4, this.useDatabases()];
                    case 1:
                        _a = _f.sent(), source = _a[0], target = _a[1];
                        return [4, this.getDatabases()];
                    case 2:
                        _f.sent();
                        return [4, this.getCollections()];
                    case 3:
                        _f.sent();
                        _f.label = 4;
                    case 4:
                        _f.trys.push([4, 15, , 16]);
                        _i = 0, _b = this.sourceDatabasesList;
                        _f.label = 5;
                    case 5:
                        if (!(_i < _b.length)) return [3, 14];
                        database = _b[_i];
                        _c = 0, _d = this.sourceCollectionsList[database.$id];
                        _f.label = 6;
                    case 6:
                        if (!(_c < _d.length)) return [3, 13];
                        collection = _d[_c];
                        return [4, source.listAttributes(database.$id, collection.$id)];
                    case 7:
                        sourceAttributesResponse = _f.sent();
                        return [4, target.listAttributes(database.$id, collection.$id)];
                    case 8:
                        targetAttributesResponse = _f.sent();
                        sourceAttributes = sourceAttributesResponse.attributes;
                        targetAttributes = targetAttributesResponse.attributes;
                        _loop_3 = function (sourceAttribute) {
                            var targetAttribute, createMethod, _g;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0:
                                        targetAttribute = targetAttributes.find(function (attr) { return attr.key === sourceAttribute.key; });
                                        if (!!targetAttribute) return [3, 9];
                                        createMethod = "create".concat(sourceAttribute.type.charAt(0).toUpperCase() +
                                            sourceAttribute.type.slice(1), "Attribute");
                                        console.info(sourceAttribute.type);
                                        _g = sourceAttribute.type;
                                        switch (_g) {
                                            case "datetime": return [3, 1];
                                            case "relationship": return [3, 3];
                                            case "integer": return [3, 5];
                                        }
                                        return [3, 7];
                                    case 1: return [4, target[createMethod](database.$id, collection.$id, sourceAttribute.key, sourceAttribute.required, sourceAttribute.default, sourceAttribute.array)];
                                    case 2:
                                        _h.sent();
                                        return [3, 9];
                                    case 3: return [4, target[createMethod](database.$id, collection.$id, sourceAttribute.relatedCollection, sourceAttribute.relationType, sourceAttribute.twoWay, sourceAttribute.key, sourceAttribute.required, sourceAttribute.default, sourceAttribute.array)];
                                    case 4:
                                        _h.sent();
                                        return [3, 9];
                                    case 5: return [4, target[createMethod](database.$id, collection.$id, sourceAttribute.key, sourceAttribute.required, sourceAttribute.min, sourceAttribute.max, sourceAttribute.default, sourceAttribute.array)];
                                    case 6:
                                        _h.sent();
                                        return [3, 9];
                                    case 7: return [4, target[createMethod](database.$id, collection.$id, sourceAttribute.key, sourceAttribute.size || 100, sourceAttribute.required, sourceAttribute.default, sourceAttribute.array)];
                                    case 8:
                                        _h.sent();
                                        return [3, 9];
                                    case 9: return [2];
                                }
                            });
                        };
                        _e = 0, sourceAttributes_1 = sourceAttributes;
                        _f.label = 9;
                    case 9:
                        if (!(_e < sourceAttributes_1.length)) return [3, 12];
                        sourceAttribute = sourceAttributes_1[_e];
                        return [5, _loop_3(sourceAttribute)];
                    case 10:
                        _f.sent();
                        _f.label = 11;
                    case 11:
                        _e++;
                        return [3, 9];
                    case 12:
                        _c++;
                        return [3, 6];
                    case 13:
                        _i++;
                        return [3, 5];
                    case 14: return [3, 16];
                    case 15:
                        error_1 = _f.sent();
                        return [2, Promise.reject("Error syncing attributes: ".concat(error_1))];
                    case 16: return [2];
                }
            });
        });
    };
    AppwriteSync.prototype.syncIndexes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, source, target, _i, _b, database, _c, _d, collection, sourceIndexes, targetIndexes, targetIndexMap, _e, _f, index, _g, _h, sourceIndex, targetIndex, indexesMatch;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4, this.useDatabases()];
                    case 1:
                        _a = _j.sent(), source = _a[0], target = _a[1];
                        return [4, this.getDatabases()];
                    case 2:
                        _j.sent();
                        return [4, this.getCollections()];
                    case 3:
                        _j.sent();
                        _i = 0, _b = this.sourceDatabasesList;
                        _j.label = 4;
                    case 4:
                        if (!(_i < _b.length)) return [3, 17];
                        database = _b[_i];
                        _c = 0, _d = this.sourceCollectionsList[database.$id];
                        _j.label = 5;
                    case 5:
                        if (!(_c < _d.length)) return [3, 16];
                        collection = _d[_c];
                        return [4, source.listIndexes(database.$id, collection.$id)];
                    case 6:
                        sourceIndexes = _j.sent();
                        return [4, target.listIndexes(database.$id, collection.$id)];
                    case 7:
                        targetIndexes = _j.sent();
                        targetIndexMap = new Map();
                        for (_e = 0, _f = targetIndexes.indexes; _e < _f.length; _e++) {
                            index = _f[_e];
                            targetIndexMap.set(index.key, index);
                        }
                        _g = 0, _h = sourceIndexes.indexes;
                        _j.label = 8;
                    case 8:
                        if (!(_g < _h.length)) return [3, 15];
                        sourceIndex = _h[_g];
                        targetIndex = targetIndexMap.get(sourceIndex.key);
                        if (!!targetIndex) return [3, 10];
                        return [4, target.createIndex(database.$id, collection.$id, sourceIndex.key, sourceIndex.type, sourceIndex.attributes, sourceIndex.orders)];
                    case 9:
                        _j.sent();
                        return [3, 14];
                    case 10:
                        indexesMatch = compareIndexes(sourceIndex, targetIndex);
                        if (!!indexesMatch) return [3, 13];
                        return [4, target.deleteIndex(database.$id, collection.$id, targetIndex.key)];
                    case 11:
                        _j.sent();
                        return [4, target.createIndex(database.$id, collection.$id, targetIndex.key, sourceIndex.type, sourceIndex.attributes, sourceIndex.orders)];
                    case 12:
                        _j.sent();
                        _j.label = 13;
                    case 13:
                        targetIndexMap.delete(sourceIndex.key);
                        _j.label = 14;
                    case 14:
                        _g++;
                        return [3, 8];
                    case 15:
                        _c++;
                        return [3, 5];
                    case 16:
                        _i++;
                        return [3, 4];
                    case 17: return [2];
                }
            });
        });
    };
    AppwriteSync.prototype.syncDocuments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, source, target, sourceDocuments, limit, _i, _b, database, _c, _d, collection, lastId, query, responseSourceDocuments, sourceDocumentIds, targetDocuments, responseTargetDocuments, targetDocumentMap, _e, targetDocuments_1, targetDoc, _f, sourceDocuments_1, sourceDocument, targetDocument, $id, $collectionId, $databaseId, $createdAt, $permissions, $updatedAt, documentData, documentsMatch;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4, this.useDatabases()];
                    case 1:
                        _a = _g.sent(), source = _a[0], target = _a[1];
                        return [4, this.getDatabases()];
                    case 2:
                        _g.sent();
                        return [4, this.getCollections()];
                    case 3:
                        _g.sent();
                        limit = 10;
                        _i = 0, _b = this.sourceDatabasesList;
                        _g.label = 4;
                    case 4:
                        if (!(_i < _b.length)) return [3, 17];
                        database = _b[_i];
                        console.info("\n- database: ".concat(database.$id));
                        _c = 0, _d = this.sourceCollectionsList[database.$id];
                        _g.label = 5;
                    case 5:
                        if (!(_c < _d.length)) return [3, 16];
                        collection = _d[_c];
                        lastId = undefined;
                        console.info("-- collection: ".concat(collection.$id));
                        query = [node_appwrite_1.Query.limit(limit)];
                        console.info("--- lastId: ".concat(lastId));
                        if (lastId) {
                            query.push(node_appwrite_1.Query.cursorAfter(lastId));
                        }
                        return [4, source.listDocuments(database.$id, collection.$id, query)];
                    case 6:
                        responseSourceDocuments = _g.sent();
                        sourceDocuments = responseSourceDocuments.documents;
                        sourceDocumentIds = sourceDocuments.map(function (doc) { return doc.$id; });
                        targetDocuments = [];
                        if (!(sourceDocumentIds.length > 0)) return [3, 8];
                        return [4, target.listDocuments(database.$id, collection.$id, [node_appwrite_1.Query.equal("$id", sourceDocumentIds)])];
                    case 7:
                        responseTargetDocuments = _g.sent();
                        targetDocuments = responseTargetDocuments.documents;
                        _g.label = 8;
                    case 8:
                        targetDocumentMap = new Map();
                        for (_e = 0, targetDocuments_1 = targetDocuments; _e < targetDocuments_1.length; _e++) {
                            targetDoc = targetDocuments_1[_e];
                            targetDocumentMap.set(targetDoc.$id, targetDoc);
                        }
                        _f = 0, sourceDocuments_1 = sourceDocuments;
                        _g.label = 9;
                    case 9:
                        if (!(_f < sourceDocuments_1.length)) return [3, 14];
                        sourceDocument = sourceDocuments_1[_f];
                        console.info("--- syncing document ".concat(sourceDocument.$id));
                        targetDocument = targetDocumentMap.get(sourceDocument.$id);
                        $id = sourceDocument.$id, $collectionId = sourceDocument.$collectionId, $databaseId = sourceDocument.$databaseId, $createdAt = sourceDocument.$createdAt, $permissions = sourceDocument.$permissions, $updatedAt = sourceDocument.$updatedAt, documentData = __rest(sourceDocument, ["$id", "$collectionId", "$databaseId", "$createdAt", "$permissions", "$updatedAt"]);
                        if (!!targetDocument) return [3, 11];
                        console.log("--- creating", $id);
                        return [4, target.createDocument(database.$id, collection.$id, $id, documentData, $permissions)];
                    case 10:
                        _g.sent();
                        return [3, 13];
                    case 11:
                        documentsMatch = compareDocuments(sourceDocument, targetDocument);
                        if (!!documentsMatch) return [3, 13];
                        console.log("--- updating", $id);
                        return [4, target.updateDocument(database.$id, collection.$id, $id, documentData)];
                    case 12:
                        _g.sent();
                        _g.label = 13;
                    case 13:
                        _f++;
                        return [3, 9];
                    case 14:
                        lastId = sourceDocumentIds[sourceDocuments.length - 1];
                        _g.label = 15;
                    case 15:
                        _c++;
                        return [3, 5];
                    case 16:
                        _i++;
                        return [3, 4];
                    case 17: return [2];
                }
            });
        });
    };
    AppwriteSync.prototype.sync = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.info("starting sync");
                        console.info("Options:\n".concat(JSON.stringify(options, null, "\r")));
                        if (!options.syncDatabases) return [3, 2];
                        console.info("syncing databases");
                        return [4, this.syncDatabases()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!options.syncCollections) return [3, 4];
                        console.info("Syncing collections");
                        return [4, this.syncCollections()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!options.syncAttributes) return [3, 6];
                        console.info("syncing attributes");
                        return [4, this.syncAttributes()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!options.syncIndexes) return [3, 8];
                        console.info("syncing indexes");
                        return [4, this.syncIndexes()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!options.syncDocuments) return [3, 10];
                        console.info("syncing documents");
                        return [4, this.syncDocuments()];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [2];
                }
            });
        });
    };
    return AppwriteSync;
}());
exports.AppwriteSync = AppwriteSync;
