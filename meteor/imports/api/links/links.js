// Definition of the links collection

import OfflineCollectionVersions from '../../api/offlineCollections/offlineCollectionVersions';
import OfflineMongo from '../../api/offlineCollections/collectionTransformer';
import { Random } from 'meteor/random';
// import { Mongo } from 'meteor/mongo';

const collectionName = 'links';

if (!OfflineCollectionVersions.findOne({ collection: collectionName })) {
  OfflineCollectionVersions.insert({
    collection: collectionName,
    offlineVersion: Random.id()
  });
}

export const Links = new Mongo.Collection(collectionName);

// Allow all client-side updates
Links.allow({
  insert: () => true,
  update: () => true,
  remove: () => true,
});