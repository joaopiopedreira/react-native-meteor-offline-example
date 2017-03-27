// Definition of the links collection

import { Mongo } from 'meteor/mongo';
import OfflineCollectionVersions from '../../api/offlineCollections/offlineCollectionVersions';
import OfflineMongo from '../../api/offlineCollections/collectionTransformer';
import { Random } from 'meteor/random';
import SimpleSchema from 'simpl-schema';

const collectionName = 'links';

if (!OfflineCollectionVersions.findOne({ collection: collectionName })) {
  OfflineCollectionVersions.insert({
    collection: collectionName,
    offlineVersion: Random.id()
  });
}

const Links = new Mongo.Collection(collectionName);

Links.schema = new SimpleSchema({
  url: String,
  title: String,
  createdAt: Date,
});

Links.attachSchema(Links.schema);

// Allow all client-side updates
Links.allow({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

export default Links;